"""
AI/ML Forecast Bust Detection & Confidence Scoring Engine
Uses real trained LightGBM GBDT Classifier on historical NWP vs ERA5 reanalysis data.
"""

import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List

ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ml", "artifacts")
MODEL_PATH = os.path.join(ARTIFACTS_DIR, "bust_lgbm_model.joblib")

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

class ForecastBustDetector:
    """
    Evaluates Numerical Weather Prediction (NWP) forecast reliability using
    a trained LightGBM Classifier and predicts Forecast Bust Probability.
    """

    _model = None

    @classmethod
    def get_model(cls):
        """Lazy loader for trained LightGBM model."""
        if cls._model is None:
            if os.path.exists(MODEL_PATH):
                try:
                    cls._model = joblib.load(MODEL_PATH)
                    print(f"[ForecastBustDetector] Loaded trained LightGBM model from {MODEL_PATH}")
                except Exception as e:
                    print(f"[ForecastBustDetector] Warning loading model: {e}")
        return cls._model

    @classmethod
    def evaluate(
        cls,
        features: Dict[str, float],
        lead_time_days: int = 1,
        is_affected: bool = False
    ) -> Dict[str, Any]:
        """
        Evaluate bust probability and forecast confidence using the real LightGBM model.
        """
        model = cls.get_model()

        # Prepare feature vector
        raw_spread = float(features.get("ensemble_spread", 0.35))
        raw_cape = float(features.get("cape", 1500.0))
        raw_shear = float(features.get("vertical_wind_shear", 20.0))
        raw_vort = float(features.get("vorticity_gradient", 0.35))
        raw_mfc = float(features.get("moisture_flux_convergence", 0.35))
        raw_baro = float(features.get("baroclinic_growth_rate", 0.35))
        raw_anomaly = float(features.get("climatological_anomaly", 1.0))
        raw_elevation = float(features.get("elevation_m", 300.0))
        raw_orographic = float(features.get("orographic_forcing", 0.35))

        # Adjust for affected status if not already scaled
        if is_affected and raw_spread < 0.5:
            raw_spread = min(0.98, raw_spread * 1.5)
            raw_vort = min(0.98, raw_vort * 1.4)

        feature_dict = {
            "lead_time": lead_time_days,
            "ensemble_spread": raw_spread,
            "cape": raw_cape,
            "vertical_wind_shear": raw_shear,
            "z500_vorticity_gradient": raw_vort,
            "moisture_flux_convergence": raw_mfc,
            "baroclinic_growth_rate": raw_baro,
            "climatological_anomaly": raw_anomaly,
            "elevation_m": raw_elevation,
            "orographic_forcing": raw_orographic
        }

        # Real ML Inference
        if model is not None:
            df_input = pd.DataFrame([feature_dict])[FEATURE_COLS]
            proba = float(model.predict_proba(df_input)[0][1])
            is_ml_inferred = True
            model_name = "LightGBM Classifier (Trained GBDT)"
        else:
            # Calibrated fallback if model artifact not yet generated
            growth = 1.0 + 0.30 * (max(1, min(10, lead_time_days)) - 1) ** 1.15
            orographic_boost = 0.20 * raw_orographic * (raw_mfc + (raw_cape / 4500.0) * 0.4)
            base = (raw_spread * 0.30 + raw_vort * 0.20 + (raw_cape / 3500.0) * 0.15 + (raw_shear / 50.0) * 0.15 + orographic_boost)
            proba = 1.0 / (1.0 + np.exp(-6.5 * (base * (growth / 2.5) - 0.5)))
            is_ml_inferred = False
            model_name = "Calibrated Statistical Engine (Pre-training)"

        # Percentages
        bust_probability = round(float(np.clip(proba * 100.0, 2.5, 98.5)), 1)
        confidence_score = round(float(np.clip(100.0 - bust_probability * 0.96, 2.0, 98.0)), 1)

        # Risk Classification
        if bust_probability >= 65.0:
            risk_level = "DANGER"
            risk_color = "#ef4444"
            error_prone = True
            reliability_tag = "Unreliable Forecast"
        elif bust_probability >= 38.0:
            risk_level = "CAUTION"
            risk_color = "#f59e0b"
            error_prone = False
            reliability_tag = "Moderate Uncertainty"
        else:
            risk_level = "SAFE"
            risk_color = "#22c55e"
            error_prone = False
            reliability_tag = "High Confidence"

        # Expected error magnitudes
        expected_error_km = round(35.0 + (bust_probability * 3.8) * (lead_time_days / 3.0), 1)
        expected_error_precip_mm = round(5.0 + (bust_probability * 0.9) * (lead_time_days / 4.0), 1)

        return {
            "lead_time_days": lead_time_days,
            "bust_probability": bust_probability,
            "confidence_score": confidence_score,
            "risk_level": risk_level,
            "risk_color": risk_color,
            "error_prone": error_prone,
            "reliability_tag": reliability_tag,
            "expected_error_km": expected_error_km,
            "expected_error_precip_mm": expected_error_precip_mm,
            "features": feature_dict,
            "is_ml_inferred": is_ml_inferred,
            "model_type": model_name
        }

    @classmethod
    def get_10_day_trajectory(
        cls,
        features: Dict[str, float],
        is_affected: bool = False
    ) -> List[Dict[str, Any]]:
        """Returns 10-day trajectory using real model inference across Day 1 to Day 10."""
        trajectory = []
        for day in range(1, 11):
            eval_res = cls.evaluate(features, lead_time_days=day, is_affected=is_affected)
            trajectory.append({
                "day": f"Day {day}",
                "lead_time": day,
                "bust_probability": eval_res["bust_probability"],
                "confidence_score": eval_res["confidence_score"],
                "risk_level": eval_res["risk_level"],
                "risk_color": eval_res["risk_color"],
                "expected_error_km": eval_res["expected_error_km"],
                "expected_error_precip_mm": eval_res["expected_error_precip_mm"]
            })
        return trajectory
