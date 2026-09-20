"""
Meteorological scenarios covering rapidly evolving atmospheric systems in the Indian Subcontinent:
- Monsoon Depression
- Tropical Cyclone
- Western Disturbance
- Pre-monsoon Severe Heatwave
- Active-to-Break Monsoon Phase
- Normal / Climatological Flow
"""

from typing import List, Dict, Any

SCENARIOS: List[Dict[str, Any]] = [
    {
        "id": "monsoon_depression",
        "name": "Bay of Bengal Monsoon Depression",
        "description": "Deep depression over North Bay of Bengal moving west-northwest across Odisha and Central India. Large NWP divergence in track bifurcation and heavy rain swath.",
        "category": "Monsoon Dynamics",
        "affected_subdivisions": ["sub_06", "sub_07", "sub_08", "sub_19", "sub_20", "sub_26", "sub_27", "sub_21"],
        "critical_lead_times": [4, 5, 6, 7],
        "base_drivers": {
            "ensemble_spread": 0.82,
            "cape": 2400.0,
            "vertical_wind_shear": 24.5,
            "vorticity_gradient": 0.78,
            "moisture_flux_convergence": 0.88,
            "baroclinic_growth_rate": 0.65,
            "climatological_anomaly": 0.79
        },
        "advisory": "High likelihood of forecast bust in Day 4-7 precipitation amounts. Multi-model ensemble divergence is elevated (>45mm/day variance). Forecasters advised not to issue single-deterministic flood warnings.",
        "historical_analog": "Aug 2019 Odisha-Chhattisgarh Deep Depression (Day 5 forecast bust: Track shifted 180 km south of GFS operational track)."
    },
    {
        "id": "cyclone_severe",
        "name": "Very Severe Cyclonic Storm (Rapid Intensification)",
        "description": "Intense vortex over East-Central Arabian Sea / Bay of Bengal undergoing rapid intensification (RI). Severe forecast busts in landfall timing, intensity, and storm surge.",
        "category": "Tropical Cyclogenesis",
        "affected_subdivisions": ["sub_21", "sub_22", "sub_23", "sub_28", "sub_07", "sub_31"],
        "critical_lead_times": [3, 4, 5],
        "base_drivers": {
            "ensemble_spread": 0.91,
            "cape": 3100.0,
            "vertical_wind_shear": 14.0,
            "vorticity_gradient": 0.94,
            "moisture_flux_convergence": 0.95,
            "baroclinic_growth_rate": 0.84,
            "climatological_anomaly": 0.92
        },
        "advisory": "Critical bust risk. Rapid intensification phase not resolved by hydrostatic parameterizations. GFS vs ECMWF track disagreement exceeds 240 km at Day 4.",
        "historical_analog": "Cyclone Biparjoy (June 2023) - multiple recurvature track revisions between Day 3 and Day 6."
    },
    {
        "id": "western_disturbance",
        "name": "Intense Western Disturbance & Subtropical Jet",
        "description": "Upper-tropospheric trough interacting with the Subtropical Westerly Jet stream over Northwest India, triggering heavy orographic precipitation and cloudbursts.",
        "category": "Extratropical-Tropical Interaction",
        "affected_subdivisions": ["sub_12", "sub_14", "sub_15", "sub_16", "sub_11", "sub_13"],
        "critical_lead_times": [2, 3, 4, 5],
        "base_drivers": {
            "ensemble_spread": 0.76,
            "cape": 1850.0,
            "vertical_wind_shear": 38.0,
            "vorticity_gradient": 0.82,
            "moisture_flux_convergence": 0.72,
            "baroclinic_growth_rate": 0.89,
            "climatological_anomaly": 0.85
        },
        "advisory": "Orographic precipitation amplification failure risk. Models tend to under-predict 24-hr snow accumulation by up to 60% in high-altitude catchments.",
        "historical_analog": "July 2023 Himachal Pradesh Deluge - WD-monsoon surge interaction resulting in extreme Day 3 forecast bust."
    },
    {
        "id": "heat_wave",
        "name": "Pre-Monsoon Severe Heat Wave",
        "description": "Anticyclonic blocking pattern with severe dry air subsidence and intense solar insolation over Vidarbha, Rajasthan, and Madhya Pradesh.",
        "category": "Thermodynamic & Land-Atmosphere",
        "affected_subdivisions": ["sub_17", "sub_18", "sub_19", "sub_26", "sub_27", "sub_29"],
        "critical_lead_times": [5, 6, 7, 8],
        "base_drivers": {
            "ensemble_spread": 0.58,
            "cape": 750.0,
            "vertical_wind_shear": 8.0,
            "vorticity_gradient": 0.35,
            "moisture_flux_convergence": 0.15,
            "baroclinic_growth_rate": 0.42,
            "climatological_anomaly": 0.88
        },
        "advisory": "Day 6-9 temperature busts likely due to soil-moisture feedback underestimation in NWP land-surface schemes. Maximum temperatures likely to exceed model forecasts by 2.5°C to 4.0°C.",
        "historical_analog": "May 2022 Central-Northwest India Heatwave - Persistent underestimation of peak heat dome temperatures beyond Day 5."
    },
    {
        "id": "break_monsoon",
        "name": "Active-to-Break Monsoon Transition",
        "description": "Monsoon trough shifting rapidly northward towards the Himalayan foothills. Sudden cessation of rainfall over central India and torrential rain over Northeast & Sub-Himalayan Bengal.",
        "category": "Intra-Seasonal Oscillation",
        "affected_subdivisions": ["sub_02", "sub_03", "sub_05", "sub_09", "sub_20", "sub_24", "sub_25", "sub_26"],
        "critical_lead_times": [3, 4, 5, 6],
        "base_drivers": {
            "ensemble_spread": 0.79,
            "cape": 2200.0,
            "vertical_wind_shear": 22.0,
            "vorticity_gradient": 0.74,
            "moisture_flux_convergence": 0.81,
            "baroclinic_growth_rate": 0.61,
            "climatological_anomaly": 0.77
        },
        "advisory": "Rapid displacement of the low-level jet and monsoon trough axis. High probability of false-positive rainfall forecasts in Central India and false-negative deluge in Sub-Himalayan regions.",
        "historical_analog": "July 2021 Break Monsoon - NWP models delayed the trough shift by 72 hours, causing major agricultural planning forecast busts."
    },
    {
        "id": "normal_flow",
        "name": "Stable Climatological / Fair Weather Flow",
        "description": "Quasi-stationary synoptic patterns with low baroclinic instability, gentle gradients, and high ensemble coherence across the country.",
        "category": "Stable Baseline",
        "affected_subdivisions": [],
        "critical_lead_times": [8, 9, 10],
        "base_drivers": {
            "ensemble_spread": 0.22,
            "cape": 600.0,
            "vertical_wind_shear": 10.0,
            "vorticity_gradient": 0.20,
            "moisture_flux_convergence": 0.25,
            "baroclinic_growth_rate": 0.22,
            "climatological_anomaly": 0.18
        },
        "advisory": "Forecast confidence is high across all lead times. NWP deterministic guidance is consistent with ensemble members. Low risk of forecast bust.",
        "historical_analog": "January 2024 Stable Winter High-Pressure Regime."
    }
]

def get_scenario_by_id(scenario_id: str) -> Dict[str, Any]:
    for sc in SCENARIOS:
        if sc["id"] == scenario_id:
            return sc
    return SCENARIOS[0]

def get_all_scenarios() -> List[Dict[str, Any]]:
    return SCENARIOS
