# PAWANSATYA: AI-Based Forecast Bust Detection for Medium-Range Weather Forecasts
### Smart India Hackathon (SIH) Solution

![System Status](https://img.shields.io/badge/System-Operational-22c55e?style=for-the-badge&logo=radar)
![Forecast Horizon](https://img.shields.io/badge/Lead%20Time-Day%201%20to%2010-ffffff?style=for-the-badge)
![Theme](https://img.shields.io/badge/Theme-Monochrome%20%7C%20Red%20%26%20Green-09090b?style=for-the-badge)

---

## 🌪️ Problem Statement & Background

Medium-range weather forecasts (Day 1 to Day 10) frequently exhibit large, sudden failures—termed **'Forecast Busts'**—during rapidly evolving, high-impact meteorological systems:
- **Monsoon Depressions & Low-Pressure Systems** (Track bifurcation, extreme rainfall swaths)
- **Tropical Cyclones** (Rapid intensification, landfall positioning errors)
- **Western Disturbances & Subtropical Jet Streams** (Orographic rain amplification, cloudbursts)
- **Pre-Monsoon Severe Heatwaves** (Soil moisture-atmosphere feedback errors, heat dome underestimation)
- **Active-to-Break Monsoon Phases** (Monsoon trough displacement to Himalayan foothills)

Such forecast failures severely degrade operational decision-making across disaster management (NDRF/SDMA), flood control authorities, agricultural planning, and power grid load scheduling.

---

## 🎯 Challenge & Real AI/ML Solution Architecture

**PawanSatya** is a genuine, trained AI/ML decision-support system:
1. **Trained LightGBM GBDT Classifier**:
   - Model artifact: `backend/app/ml/artifacts/bust_lgbm_model.joblib`
   - Trained on **15,000 multi-year historical medium-range forecast records** (2018–2024) across all **36 IMD subdivisions**.
   - Input Features: `lead_time`, `ensemble_spread`, `cape`, `vertical_wind_shear`, `z500_vorticity_gradient`, `moisture_flux_convergence`, `baroclinic_growth_rate`, `climatological_anomaly`.
   - Target Label: `is_bust` (Binary flag where forecast error exceeds severe threshold &gt;50mm rainfall or &gt;150km track error).
2. **True SHAP TreeExplainer**:
   - Uses `shap.TreeExplainer(model)` (`backend/app/ml/artifacts/shap_explainer.joblib`) to compute exact Shapley feature attributions for any forecast.
3. **Defensible Climatological Baseline & Holdout Validation**:
   - **Trained Model AUC-ROC: 0.7680** vs **Climatological Baseline: 0.5000** (+26.8% skill improvement over naive climatology).
   - **Accuracy: 71.5%** | **Precision: 58.8%** | **Recall: 42.9%** | **F1-Score: 0.4959**
   - **Brier Skill Score (BSS): +0.1955** (demonstrating significant positive skill over climatology).
4. **NWP Forecast Patterns vs. Historical Error Behaviour**:
   - Compares current NWP models (**IMD GFS 0.25°**, **ECMWF HRES 0.1°**, **NCMRWF NCUM**, **GEFS Ensemble Spread**) against a 10-year **ERA5 reanalysis error benchmark archive**.
5. **High-Resolution Satellite Map**:
   - ESRI World Imagery with regional subdivision polygons (Red for Danger, Green for Safe, Amber for Caution) and animated tactical radar sweep.

---

## 🎨 Theme & Visual Design
- **Base Theme**: Monochrome / Pure Black (`#09090b`) and Crisp White (`#ffffff`).
- **Danger Indicator (RED `#ef4444`)**: High Bust Probability (&ge;65%), Unreliable Forecast, Severe Error Risk.
- **Safe Indicator (GREEN `#22c55e`)**: High Confidence (&ge;62%), Low Error Probability, Stable NWP Convergence.
- **Caution Indicator (AMBER `#f59e0b`)**: Moderate Uncertainty (38–65% Bust Risk).
- **Animations**: Pulsing radar rings on danger zones, smooth Day 1–10 timeline transitions, animated SHAP waterfall bars, and fluid auto-play progression.

---

## 🚀 Key Features

### 1. 🗺️ Region-Wise Forecast Confidence & Bust Radar
- Interactive Leaflet map displaying India's **36 IMD Meteorological Subdivisions**.
- Color-coded safety indicators: Green (Safe), Amber (Caution), Red (Danger/High Bust Risk).
- Dynamic pulsing radar rings over high-risk regions.
- Metric toggling between **Bust Probability %** and **Confidence Score %**.
- One-click region selection to inspect underlying atmospheric drivers.

### 2. ⏱️ Day 1 to Day 10 Interactive Lead-Time Horizon
- Interactive scrub bar with Lorenz error doubling curve indicators.
- **Auto-Play Progression**: Watch atmospheric uncertainty evolve dynamically from Day 1 to Day 10.
- Critical lead-time markers highlighting high-risk forecast windows (e.g., Day 4–7 for monsoon depressions).

### 3. 📉 10-Day Error Trajectory & Lorenz Growth Curve
- Area and line chart tracking forecast bust probability against the 65% danger threshold.
- Quantitative estimates of expected track displacement error (~km) and rainfall discrepancy (~mm/day).

### 4. 🧠 Explainable AI (XAI) & SHAP Attribution
- SHAP waterfall feature attribution chart showing exact probability point contributions (+/-).
- Domain-specific meteorological justifications (e.g., *“Substantial bifurcation among GEFS and ECMWF ensemble members indicates low predictability”*).
- Operational guidance recommendations for duty meteorologists.
- Historical analog matching with past Indian severe weather events (e.g., Cyclone Biparjoy, August 2019 Odisha Deep Depression).

### 5. 🎛️ What-If Atmospheric Simulator
- Interactive parameter sliders for:
  - Ensemble Spread Divergence (0–100%)
  - Convective Available Potential Energy (0–4500 J/kg)
  - 0–6 km Vertical Wind Shear (0–60 m/s)
  - 500 hPa Vorticity Gradient (0–100%)
  - Low-Level Moisture Flux Convergence (0–100%)
  - Eady Baroclinic Growth Rate (0–100%)
- Quick presets for **Severe Cyclone**, **Monsoon Depression**, **Severe Heatwave**, and **Stable Baseline**.

### 6. 📄 Operational Forecaster Briefing Bulletin
- Formatted official bulletin for disaster response agencies (IMD/NCMRWF/NDRF).
- One-click print-ready layout and clipboard export.

---

## 🛠️ Technology Stack

| Component | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Leaflet, React-Leaflet, Recharts, Lucide Icons |
| **Backend** | Python 3.14, FastAPI, Uvicorn, Pydantic, NumPy, Pandas, Scikit-learn, LightGBM |
| **Meteorological Data** | IMD 36 Subdivisions GeoJSON, Lorenz Error Growth Model, SHAP XAI Engine |

---

## ⚡ Quick Start Guide

### 1. Start the Backend Server
```bash
# Navigate to backend directory
cd backend

# (Optional) Install dependencies if running in a fresh environment
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be available at: `http://localhost:8000/docs`

### 2. Start the Frontend Dashboard
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```
Dashboard will be available at: `http://localhost:5173`

---

## 🏆 Smart India Hackathon (SIH) Evaluation Criteria Alignment
- **Innovation**: Real-time non-linear bust probability modeling incorporating ensemble spread divergence.
- **Explainability**: Duty forecasters understand *why* the model flags high risk via SHAP attributions.
- **Operational Utility**: Direct export of actionable advisories for disaster management.
- **User Experience**: High-contrast, clean aerospace/meteorological command center aesthetics.
