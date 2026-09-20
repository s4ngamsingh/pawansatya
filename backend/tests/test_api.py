"""
Unit and Integration Tests for AI-Based Forecast Bust Detection Backend
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.bust_detector import ForecastBustDetector
from app.models.explainability import MeteorologicalExplainer

client = TestClient(app)

def test_root_and_health():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "OPERATIONAL"

    health = client.get("/health")
    assert health.status_code == 200
    assert health.json()["subdivisions_count"] == 36

def test_list_scenarios():
    res = client.get("/api/scenarios")
    assert res.status_code == 200
    scenarios = res.json()["scenarios"]
    assert len(scenarios) >= 5
    scenario_ids = [s["id"] for s in scenarios]
    assert "monsoon_depression" in scenario_ids
    assert "cyclone_severe" in scenario_ids

def test_list_subdivisions():
    res = client.get("/api/subdivisions")
    assert res.status_code == 200
    subs = res.json()["subdivisions"]
    assert len(subs) == 36

def test_confidence_map_endpoint():
    res = client.get("/api/forecast/confidence-map?scenario_id=monsoon_depression&lead_time=5")
    assert res.status_code == 200
    data = res.json()
    assert "scenario" in data
    assert data["lead_time_days"] == 5
    assert len(data["subdivisions"]) == 36
    assert "error_prone_hotspots" in data
    
    # Check that bust_probability is bounded 0 to 100
    for sub in data["subdivisions"]:
        assert 0.0 <= sub["bust_probability"] <= 100.0
        assert 0.0 <= sub["confidence_score"] <= 100.0
        assert sub["risk_level"] in ("SAFE", "CAUTION", "DANGER")

def test_explain_endpoint():
    res = client.get("/api/forecast/explain?subdivision_id=sub_07&scenario_id=monsoon_depression&lead_time=4")
    assert res.status_code == 200
    data = res.json()
    assert "explanation" in data
    assert "feature_contributions" in data["explanation"]
    assert len(data["trajectory_10_days"]) == 10

def test_bust_detector_monotonic_growth():
    features = {
        "ensemble_spread": 0.85,
        "cape": 3200.0,
        "vertical_wind_shear": 30.0,
        "vorticity_gradient": 0.8,
        "moisture_flux_convergence": 0.9,
        "baroclinic_growth_rate": 0.7,
        "climatological_anomaly": 0.8
    }
    
    # Lead time error factor should increase as lead time increases
    day1 = ForecastBustDetector.evaluate(features, lead_time_days=1, is_affected=True)
    day10 = ForecastBustDetector.evaluate(features, lead_time_days=10, is_affected=True)
    assert day10["bust_probability"] >= day1["bust_probability"]
    assert day10["confidence_score"] <= day1["confidence_score"]
