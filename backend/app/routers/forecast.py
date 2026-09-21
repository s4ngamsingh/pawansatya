"""
API Router for Forecast Bust Detection, ML Validation Metrics, and XAI Explanations
"""

import os
import json
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from app.data.scenarios import get_all_scenarios, get_scenario_by_id
from app.data.india_subdivisions import get_all_subdivisions, get_subdivision_by_id
from app.models.bust_detector import ForecastBustDetector
from app.models.explainability import MeteorologicalExplainer
from app.models.climate_dynamics import compute_climate_phenotype

router = APIRouter(prefix="/api", tags=["Forecast Bust Detection"])

ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ml", "artifacts")
METRICS_PATH = os.path.join(ARTIFACTS_DIR, "metrics.json")
DATASET_SAMPLE_PATH = os.path.join(ARTIFACTS_DIR, "dataset_sample.csv")

class CustomEvaluateRequest(BaseModel):
    subdivision_id: str = Field(default="sub_07", description="IMD Subdivision ID")
    lead_time_days: int = Field(default=3, ge=1, le=10, description="Lead time in days (1-10)")
    ensemble_spread: float = Field(default=0.75, ge=0.0, le=1.0)
    cape: float = Field(default=2600.0, ge=0.0, le=5000.0)
    vertical_wind_shear: float = Field(default=22.0, ge=0.0, le=70.0)
    vorticity_gradient: float = Field(default=0.70, ge=0.0, le=1.0)
    moisture_flux_convergence: float = Field(default=0.80, ge=0.0, le=1.0)
    baroclinic_growth_rate: float = Field(default=0.60, ge=0.0, le=1.0)
    climatological_anomaly: float = Field(default=0.75, ge=0.0, le=1.0)
    elevation_m: float = Field(default=450.0, ge=0.0, le=9000.0, description="Terrain elevation in meters ASL")
    orographic_forcing: float = Field(default=0.40, ge=0.0, le=1.0, description="Orographic lift factor [0-1]")

@router.get("/scenarios")
def list_scenarios():
    """Retrieve all pre-configured meteorological scenarios."""
    return {"scenarios": get_all_scenarios()}

@router.get("/subdivisions")
def list_subdivisions():
    """Retrieve all 36 IMD meteorological subdivisions."""
    return {"subdivisions": get_all_subdivisions()}

@router.get("/model/metrics")
def get_model_metrics():
    """
    Returns real holdout validation metrics, confusion matrix, ROC curve data,
    and climatological baseline comparison for the trained LightGBM model.
    """
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, "r") as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Model metrics artifact not found.")

@router.get("/model/dataset-sample")
def download_dataset_sample():
    """Download the historical training dataset sample (CSV)."""
    if os.path.exists(DATASET_SAMPLE_PATH):
        return FileResponse(
            DATASET_SAMPLE_PATH,
            media_type="text/csv",
            filename="historical_forecast_bust_dataset_sample.csv"
        )
    raise HTTPException(status_code=404, detail="Dataset sample not found.")

@router.get("/forecast/confidence-map")
def get_confidence_map(
    scenario_id: str = Query("monsoon_depression", description="Scenario ID"),
    lead_time: int = Query(3, ge=1, le=10, description="Lead time in days (1 to 10)")
):
    """
    Computes region-wise confidence and bust probability across all 36 IMD subdivisions
    using real LightGBM model inference.
    """
    scenario = get_scenario_by_id(scenario_id)
    subdivisions = get_all_subdivisions()
    affected_ids = set(scenario.get("affected_subdivisions", []))
    base_drivers = scenario.get("base_drivers", {})

    evaluated_subdivisions = []
    danger_count = 0
    caution_count = 0
    safe_count = 0
    total_confidence = 0.0
    total_bust = 0.0

    for sub in subdivisions:
        is_affected = sub["id"] in affected_ids
        
        # Spatial variance
        var_factor = 1.0 + 0.08 * (sub["lat"] % 3 - 1.5)
        drivers = {
            k: min(1.0 if "cape" not in k and "shear" not in k else 5000.0, max(0.0, v * var_factor))
            for k, v in base_drivers.items()
        }

        if not is_affected:
            drivers = {
                k: v * 0.45 if "cape" not in k and "shear" not in k else v * 0.6
                for k, v in drivers.items()
            }

        # Inject subdivision-specific DEM terrain attributes
        drivers["elevation_m"] = float(sub.get("elevation_mean_m", 300.0))
        drivers["orographic_forcing"] = float(sub.get("orographic_lift_factor", 0.35))

        eval_res = ForecastBustDetector.evaluate(
            drivers,
            lead_time_days=lead_time,
            is_affected=is_affected
        )

        climate_res = compute_climate_phenotype(
            sub=sub,
            scenario_id=scenario_id,
            lead_time=lead_time,
            drivers=drivers,
            eval_res=eval_res
        )

        if eval_res["risk_level"] == "DANGER":
            danger_count += 1
        elif eval_res["risk_level"] == "CAUTION":
            caution_count += 1
        else:
            safe_count += 1

        total_confidence += eval_res["confidence_score"]
        total_bust += eval_res["bust_probability"]

        evaluated_subdivisions.append({
            "id": sub["id"],
            "code": sub["code"],
            "name": sub["name"],
            "zone": sub["zone"],
            "lat": sub["lat"],
            "lon": sub["lon"],
            "elevation_mean_m": sub.get("elevation_mean_m", 300),
            "elevation_max_m": sub.get("elevation_max_m", 1000),
            "terrain_ruggedness": sub.get("terrain_ruggedness", 0.3),
            "orographic_lift_factor": sub.get("orographic_lift_factor", 0.35),
            "coordinates": sub["coordinates"],
            "vulnerable_to": sub["vulnerable_to"],
            "is_affected_system": is_affected,
            "bust_probability": eval_res["bust_probability"],
            "confidence_score": eval_res["confidence_score"],
            "risk_level": eval_res["risk_level"],
            "risk_color": eval_res["risk_color"],
            "error_prone": eval_res["error_prone"],
            "reliability_tag": eval_res["reliability_tag"],
            "expected_error_km": eval_res["expected_error_km"],
            "expected_error_precip_mm": eval_res["expected_error_precip_mm"],
            "weather_condition": climate_res.get("weather_condition", "MODERATE_RAIN"),
            "temperature_c": climate_res.get("temperature_c", 28.0),
            "rainfall_mm": climate_res.get("rainfall_mm", 10.0),
            "wind_speed_kmh": climate_res.get("wind_speed_kmh", 15.0),
            "weather_summary": climate_res.get("weather_summary", ""),
            "climate_regime": climate_res.get("climate_regime", "Synoptic Flow"),
            "is_ml_inferred": eval_res.get("is_ml_inferred", True),
            "model_type": eval_res.get("model_type", "LightGBM")
        })

    hotspots = [s for s in evaluated_subdivisions if s["risk_level"] in ("DANGER", "CAUTION")]
    hotspots.sort(key=lambda x: x["bust_probability"], reverse=True)

    n = len(subdivisions)
    avg_confidence = round(total_confidence / n, 1) if n > 0 else 0.0
    avg_bust = round(total_bust / n, 1) if n > 0 else 0.0

    return {
        "scenario": {
            "id": scenario["id"],
            "name": scenario["name"],
            "description": scenario["description"],
            "category": scenario["category"],
            "critical_lead_times": scenario.get("critical_lead_times", []),
            "advisory": scenario.get("advisory", ""),
            "historical_analog": scenario.get("historical_analog", "")
        },
        "lead_time_days": lead_time,
        "summary": {
            "total_regions": n,
            "danger_count": danger_count,
            "caution_count": caution_count,
            "safe_count": safe_count,
            "avg_confidence": avg_confidence,
            "avg_bust_probability": avg_bust
        },
        "subdivisions": evaluated_subdivisions,
        "error_prone_hotspots": hotspots[:8]
    }

@router.get("/forecast/explain")
def explain_region(
    subdivision_id: str = Query("sub_07", description="IMD Subdivision ID"),
    scenario_id: str = Query("monsoon_depression", description="Scenario ID"),
    lead_time: int = Query(3, ge=1, le=10, description="Lead time in days")
):
    """
    Returns true SHAP feature attribution from the real SHAP TreeExplainer,
    meteorological drivers, and 10-day risk trajectory.
    """
    sub = get_subdivision_by_id(subdivision_id)
    scenario = get_scenario_by_id(scenario_id)
    affected_ids = set(scenario.get("affected_subdivisions", []))
    is_affected = sub["id"] in affected_ids
    base_drivers = scenario.get("base_drivers", {})

    drivers = dict(base_drivers)
    if not is_affected:
        drivers = {
            k: v * 0.45 if "cape" not in k and "shear" not in k else v * 0.6
            for k, v in drivers.items()
        }

    # Inject subdivision-specific DEM terrain attributes
    drivers["elevation_m"] = float(sub.get("elevation_mean_m", 300.0))
    drivers["orographic_forcing"] = float(sub.get("orographic_lift_factor", 0.35))

    eval_res = ForecastBustDetector.evaluate(
        drivers,
        lead_time_days=lead_time,
        is_affected=is_affected
    )

    model = ForecastBustDetector.get_model()

    explanation = MeteorologicalExplainer.explain(
        evaluation=eval_res,
        scenario_info=scenario,
        subdivision_name=sub["name"],
        model=model
    )

    trajectory = ForecastBustDetector.get_10_day_trajectory(
        drivers,
        is_affected=is_affected
    )

    return {
        "region": {
            "id": sub["id"],
            "code": sub["code"],
            "name": sub["name"],
            "zone": sub["zone"],
            "lat": sub["lat"],
            "lon": sub["lon"],
            "elevation_mean_m": sub.get("elevation_mean_m", 300),
            "elevation_max_m": sub.get("elevation_max_m", 1000),
            "terrain_ruggedness": sub.get("terrain_ruggedness", 0.3),
            "orographic_lift_factor": sub.get("orographic_lift_factor", 0.35),
            "vulnerable_to": sub["vulnerable_to"],
            "is_affected": is_affected
        },
        "evaluation": eval_res,
        "explanation": explanation,
        "trajectory_10_days": trajectory
    }

@router.post("/forecast/custom-evaluate")
def custom_evaluate(req: CustomEvaluateRequest):
    """
    Custom what-if simulation endpoint evaluated with the real LightGBM model.
    """
    sub = get_subdivision_by_id(req.subdivision_id)
    
    features = {
        "ensemble_spread": req.ensemble_spread,
        "cape": req.cape,
        "vertical_wind_shear": req.vertical_wind_shear,
        "vorticity_gradient": req.vorticity_gradient,
        "moisture_flux_convergence": req.moisture_flux_convergence,
        "baroclinic_growth_rate": req.baroclinic_growth_rate,
        "climatological_anomaly": req.climatological_anomaly,
        "elevation_m": req.elevation_m,
        "orographic_forcing": req.orographic_forcing
    }

    eval_res = ForecastBustDetector.evaluate(
        features,
        lead_time_days=req.lead_time_days,
        is_affected=True
    )

    model = ForecastBustDetector.get_model()

    scenario_mock = {
        "historical_analog": "Custom Forecaster Simulation (Simulated Atmospheric State)"
    }

    explanation = MeteorologicalExplainer.explain(
        evaluation=eval_res,
        scenario_info=scenario_mock,
        subdivision_name=sub["name"],
        model=model
    )

    trajectory = ForecastBustDetector.get_10_day_trajectory(
        features,
        is_affected=True
    )

    return {
        "region": sub,
        "evaluation": eval_res,
        "explanation": explanation,
        "trajectory_10_days": trajectory
    }
