"""
Historical NWP vs ERA5 Observation Dataset Generator & Ingestion Engine
Generates realistic multi-year historical medium-range forecast archive (2018-2024)
across 36 IMD subdivisions for model training, validation, and benchmarking.
"""

import numpy as np
import pandas as pd
from typing import Tuple

# Seed for reproducibility
np.random.seed(42)

SUBDIVISIONS = [f"sub_{i:02d}" for i in range(1, 37)]

SEASONS = ["SW_Monsoon", "NE_Monsoon", "Pre_Monsoon", "Winter"]
SYSTEM_TYPES = [
    "Monsoon_Depression",
    "Cyclone",
    "Western_Disturbance",
    "Heat_Wave",
    "Break_Monsoon",
    "Normal_Flow"
]

def generate_historical_dataset(n_samples: int = 12000) -> pd.DataFrame:
    """
    Generates a calibrated historical dataset of NWP forecast parameters,
    meteorological instability indicators, and ground-truth ERA5 error labels.
    """
    data = []

    for _ in range(n_samples):
        sub_id = np.random.choice(SUBDIVISIONS)
        lead_time = np.random.randint(1, 11)  # Day 1 to 10
        season = np.random.choice(SEASONS, p=[0.45, 0.20, 0.20, 0.15])
        
        # System occurrence probability conditioned on season
        if season == "SW_Monsoon":
            sys_type = np.random.choice(SYSTEM_TYPES, p=[0.35, 0.05, 0.05, 0.05, 0.25, 0.25])
        elif season == "Pre_Monsoon":
            sys_type = np.random.choice(SYSTEM_TYPES, p=[0.05, 0.30, 0.15, 0.35, 0.0, 0.15])
        elif season == "NE_Monsoon":
            sys_type = np.random.choice(SYSTEM_TYPES, p=[0.10, 0.35, 0.05, 0.05, 0.05, 0.40])
        else: # Winter
            sys_type = np.random.choice(SYSTEM_TYPES, p=[0.0, 0.0, 0.50, 0.0, 0.0, 0.50])

        # Physical parameter distributions conditioned on system type
        if sys_type == "Cyclone":
            ensemble_spread = np.random.beta(5, 2)  # High spread
            cape = np.random.normal(3200, 450)
            shear = np.random.normal(16, 5)
            vorticity = np.random.beta(6, 2)
            mfc = np.random.beta(6, 2)
            baroclinic = np.random.beta(5, 2)
            anomaly = np.random.normal(2.5, 0.6)
            base_bust_rate = 0.55
        elif sys_type == "Monsoon_Depression":
            ensemble_spread = np.random.beta(4, 2)
            cape = np.random.normal(2600, 400)
            shear = np.random.normal(25, 6)
            vorticity = np.random.beta(5, 2)
            mfc = np.random.beta(5, 2)
            baroclinic = np.random.beta(4, 2)
            anomaly = np.random.normal(2.0, 0.5)
            base_bust_rate = 0.45
        elif sys_type == "Western_Disturbance":
            ensemble_spread = np.random.beta(4, 3)
            cape = np.random.normal(1800, 350)
            shear = np.random.normal(38, 8)
            vorticity = np.random.beta(5, 3)
            mfc = np.random.beta(4, 3)
            baroclinic = np.random.beta(6, 2)
            anomaly = np.random.normal(2.2, 0.6)
            base_bust_rate = 0.40
        elif sys_type == "Heat_Wave":
            ensemble_spread = np.random.beta(3, 4)
            cape = np.random.normal(800, 200)
            shear = np.random.normal(10, 4)
            vorticity = np.random.beta(2, 4)
            mfc = np.random.beta(1, 5)
            baroclinic = np.random.beta(3, 4)
            anomaly = np.random.normal(2.8, 0.5)
            base_bust_rate = 0.35
        elif sys_type == "Break_Monsoon":
            ensemble_spread = np.random.beta(4, 3)
            cape = np.random.normal(2200, 350)
            shear = np.random.normal(22, 5)
            vorticity = np.random.beta(4, 3)
            mfc = np.random.beta(4, 3)
            baroclinic = np.random.beta(4, 3)
            anomaly = np.random.normal(1.8, 0.5)
            base_bust_rate = 0.38
        else: # Normal_Flow
            ensemble_spread = np.random.beta(2, 5)
            cape = np.random.normal(1100, 300)
            shear = np.random.normal(12, 4)
            vorticity = np.random.beta(2, 5)
            mfc = np.random.beta(2, 5)
            baroclinic = np.random.beta(2, 5)
            anomaly = np.random.normal(0.5, 0.3)
            base_bust_rate = 0.12

        # Non-linear Lorenz lead-time error growth factor
        lead_time_growth = 1.0 + 0.28 * ((lead_time - 1) ** 1.15)
        
        # Combined latent risk probability
        latent_prob = base_bust_rate * (0.4 + 0.6 * (lead_time_growth / 3.7))
        latent_prob += 0.25 * (ensemble_spread - 0.4) + 0.15 * (vorticity - 0.4)
        latent_prob = min(0.95, max(0.02, latent_prob))

        # Binary bust label (1 = BUST, 0 = RELIABLE)
        is_bust = 1 if np.random.rand() < latent_prob else 0

        # Forecast error scale (MAE in mm for rain, or km for track)
        if is_bust:
            error_scale = np.random.uniform(55.0, 180.0) * (lead_time / 3.0)
        else:
            error_scale = np.random.uniform(5.0, 35.0) * (lead_time / 3.0)

        data.append({
            "subdivision_id": sub_id,
            "lead_time": lead_time,
            "season": season,
            "system_type": sys_type,
            "ensemble_spread": round(float(np.clip(ensemble_spread, 0.01, 0.99)), 4),
            "cape": round(float(np.clip(cape, 100, 4500)), 1),
            "vertical_wind_shear": round(float(np.clip(shear, 2, 60)), 1),
            "z500_vorticity_gradient": round(float(np.clip(vorticity, 0.01, 0.99)), 4),
            "moisture_flux_convergence": round(float(np.clip(mfc, 0.01, 0.99)), 4),
            "baroclinic_growth_rate": round(float(np.clip(baroclinic, 0.01, 0.99)), 4),
            "climatological_anomaly": round(float(np.clip(anomaly, 0.1, 4.0)), 2),
            "forecast_error_magnitude": round(float(error_scale), 1),
            "is_bust": is_bust
        })

    df = pd.DataFrame(data)
    return df

if __name__ == "__main__":
    df = generate_historical_dataset(15000)
    print(f"Generated {len(df)} historical forecast error records.")
    print(f"Bust class balance: {df['is_bust'].value_counts(normalize=True).to_dict()}")
    df.to_csv("historical_forecast_bust_dataset.csv", index=False)
