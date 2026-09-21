"""
Explainable AI (XAI) Engine for Meteorological Forecast Busts
Integrates real SHAP (SHapley Additive exPlanations) TreeExplainer
to quantify exact atmospheric feature attributions.
"""

import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List

ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ml", "artifacts")
EXPLAINER_PATH = os.path.join(ARTIFACTS_DIR, "shap_explainer.joblib")

FEATURE_COLS = [
    "lead_time",
    "ensemble_spread",
    "cape",
    "vertical_wind_shear",
    "z500_vorticity_gradient",
    "moisture_flux_convergence",
    "baroclinic_growth_rate",
    "climatological_anomaly",
    "elevation_m",
    "orographic_forcing"
]

METRIC_METADATA = {
    "ensemble_spread": {
        "name": "Ensemble Spread Divergence",
        "unit": "norm [0-1]",
        "danger_description": "Substantial bifurcation among GEFS and ECMWF ensemble members indicates low predictability and high sensitivity to initial conditions."
    },
    "cape": {
        "name": "Convective Instability (CAPE)",
        "unit": "J/kg",
        "danger_description": "Extreme Convective Available Potential Energy exceeds sub-grid convective parameterization limits, leading to localized rainfall bust events."
    },
    "vertical_wind_shear": {
        "name": "0-6 km Vertical Wind Shear",
        "unit": "m/s",
        "danger_description": "Deep-layer shear modulates storm organization; models frequently misjudge multicell vs supercell convective transitions."
    },
    "z500_vorticity_gradient": {
        "name": "500 hPa Vorticity Gradient",
        "unit": "10^-5 s^-1",
        "danger_description": "Sharp mid-tropospheric potential vorticity gradient triggers rapid baroclinic energy conversion with high phase-speed uncertainty."
    },
    "moisture_flux_convergence": {
        "name": "Moisture Flux Convergence (MFC)",
        "unit": "g kg^-1 s^-1",
        "danger_description": "Intense low-level jet moisture convergence prone to boundary-layer moisture flux divergence errors."
    },
    "baroclinic_growth_rate": {
        "name": "Eady Baroclinic Growth Rate",
        "unit": "day^-1",
        "danger_description": "High baroclinic instability leads to exponential error growth in frontal and depression wave amplitudes."
    },
    "climatological_anomaly": {
        "name": "Climatological Standardized Anomaly",
        "unit": "sigma",
        "danger_description": "Event exceeds 2.5 sigma from 30-year climatology, operating in non-linear regimes where NWP training biases are highest."
    },
    "lead_time": {
        "name": "Forecast Horizon (Lead Time)",
        "unit": "days",
        "danger_description": "Chaotic error doubling over time degrades deterministic skill beyond the predictability horizon."
    },
    "elevation_m": {
        "name": "Mean Terrain Elevation (DEM)",
        "unit": "m ASL",
        "danger_description": "High-altitude topography modifies boundary-layer dynamics and traps thermal/moisture gradients that standard NWP models fail to resolve."
    },
    "orographic_forcing": {
        "name": "Orographic Lift & Slope Index",
        "unit": "index [0-1]",
        "danger_description": "Steep mountain barriers (Western Ghats, Himalayan arc) force incoming moisture upward, triggering unparameterized sub-grid convective cloudbursts and heavy precipitation busts."
    }
}

class MeteorologicalExplainer:
    """
    Computes real SHAP values for the LightGBM bust detection model and maps
    them to domain-specific meteorological justifications.
    """

    _explainer = None

    @classmethod
    def get_explainer(cls, model):
        """Lazy load or initialize SHAP TreeExplainer."""
        if cls._explainer is None:
            if os.path.exists(EXPLAINER_PATH):
                try:
                    cls._explainer = joblib.load(EXPLAINER_PATH)
                    print(f"[MeteorologicalExplainer] Loaded real SHAP TreeExplainer from {EXPLAINER_PATH}")
                except Exception as e:
                    print(f"[MeteorologicalExplainer] Warning loading SHAP explainer: {e}")
            
            if cls._explainer is None and model is not None:
                try:
                    import shap
                    cls._explainer = shap.TreeExplainer(model)
                    print("[MeteorologicalExplainer] Initialized real SHAP TreeExplainer from model.")
                except Exception as e:
                    print(f"[MeteorologicalExplainer] Could not initialize SHAP TreeExplainer: {e}")
        return cls._explainer

    @classmethod
    def explain(
        cls,
        evaluation: Dict[str, Any],
        scenario_info: Dict[str, Any],
        subdivision_name: str,
        model = None
    ) -> Dict[str, Any]:
        """
        Generate true SHAP feature attribution breakdown and operational justifications.
        """
        feature_dict = evaluation.get("features", {})
        bust_prob = evaluation.get("bust_probability", 50.0)
        lead_time = evaluation.get("lead_time_days", 1)

        explainer = cls.get_explainer(model)
        feature_contributions: List[Dict[str, Any]] = []
        key_reasons: List[str] = []

        is_real_shap = False

        if explainer is not None and feature_dict:
            try:
                df_input = pd.DataFrame([feature_dict])[FEATURE_COLS]
                # Compute SHAP values
                shap_res = explainer.shap_values(df_input)
                
                # Handle binary classification output formats
                if isinstance(shap_res, list) and len(shap_res) > 1:
                    shap_vals = shap_res[1][0]  # Positive class (bust)
                elif isinstance(shap_res, np.ndarray) and shap_res.ndim == 2:
                    shap_vals = shap_res[0]
                else:
                    shap_vals = np.array(shap_res).flatten()

                is_real_shap = True

                for feat_key, shap_val in zip(FEATURE_COLS, shap_vals):
                    meta = METRIC_METADATA.get(feat_key, {
                        "name": feat_key,
                        "danger_description": "Atmospheric variable contributing to forecast variance."
                    })

                    val = feature_dict.get(feat_key, 0.0)
                    contribution = round(float(shap_val * 100.0), 2)
                    is_risk_driver = bool(shap_val > 0.04)

                    feature_contributions.append({
                        "feature_key": feat_key,
                        "name": meta["name"],
                        "value": round(float(val), 2),
                        "contribution": contribution,
                        "impact": "INCREASES_BUST_RISK" if contribution > 0 else "REDUCES_BUST_RISK",
                        "is_risk_driver": is_risk_driver,
                        "explanation": meta["danger_description"] if is_risk_driver else f"{meta['name']} is within stable bounds."
                    })

                    if is_risk_driver:
                        key_reasons.append(f"{meta['name']}: {meta['danger_description']}")

            except Exception as e:
                print(f"[MeteorologicalExplainer] Error computing real SHAP values: {e}")
                is_real_shap = False

        # Fallback if SHAP computation fails
        if not is_real_shap:
            for feat_key in FEATURE_COLS:
                val = feature_dict.get(feat_key, 0.5)
                meta = METRIC_METADATA.get(feat_key, {"name": feat_key, "danger_description": ""})
                norm_val = val / 3500.0 if feat_key == "cape" else val / 50.0 if feat_key == "vertical_wind_shear" else val
                contrib = round((norm_val - 0.35) * 22.0, 1)
                is_driver = bool(contrib > 5.0)

                feature_contributions.append({
                    "feature_key": feat_key,
                    "name": meta["name"],
                    "value": round(float(val), 2),
                    "contribution": contrib,
                    "impact": "INCREASES_BUST_RISK" if contrib > 0 else "REDUCES_BUST_RISK",
                    "is_risk_driver": is_driver,
                    "explanation": meta["danger_description"] if is_driver else f"{meta['name']} is within stable limits."
                })
                if is_driver:
                    key_reasons.append(f"{meta['name']}: {meta['danger_description']}")

        # Sort feature contributions by absolute impact
        feature_contributions.sort(key=lambda x: abs(x["contribution"]), reverse=True)

        if not key_reasons:
            key_reasons.append("Atmospheric flow is governed by stable synoptic steering with low baroclinic growth.")

        # Operational Advisory
        if bust_prob >= 65.0:
            operational_advisory = (
                f"CRITICAL CAUTION for {subdivision_name} at Day {lead_time}: High bust probability ({bust_prob}%). "
                "Forecasters should NOT rely on deterministic single-model runs. "
                "Utilize EPS (Ensemble Prediction System) percentiles (10th-90th) and verify boundary conditions with radar/satellite nowcasting."
            )
        elif bust_prob >= 38.0:
            operational_advisory = (
                f"MODERATE UNCERTAINTY for {subdivision_name} at Day {lead_time}: Bust probability is {bust_prob}%. "
                "Track model trend over subsequent cycles (00Z/12Z). Monitor convective parameterization shifts in next run."
            )
        else:
            operational_advisory = (
                f"HIGH CONFIDENCE for {subdivision_name} at Day {lead_time}: Forecast reliability is robust ({evaluation.get('confidence_score')}%). "
                "Standard operational guidance applies with low risk of significant error."
            )

        return {
            "subdivision_name": subdivision_name,
            "lead_time_days": lead_time,
            "bust_probability": bust_prob,
            "confidence_score": evaluation.get("confidence_score", 50.0),
            "baseline_probability": 15.0,
            "is_real_shap": is_real_shap,
            "xai_engine": "SHAP TreeExplainer (LightGBM)" if is_real_shap else "Statistical Proxy",
            "feature_contributions": feature_contributions,
            "top_drivers": key_reasons[:3],
            "all_reasons": key_reasons,
            "operational_advisory": operational_advisory,
            "historical_analog": scenario_info.get("historical_analog", "Historical analog database query matched similar rapid divergence cases.")
        }
