"""
AI-Based Forecast Bust Detection System - Backend Server
Smart India Hackathon (SIH)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.forecast import router as forecast_router

app = FastAPI(
    title="AI-Based Forecast Bust Detection System",
    description=(
        "Operational AI/ML API for detecting forecast busts in medium-range Numerical Weather "
        "Prediction (NWP) models (GFS, ECMWF, NCMRWF) across 36 IMD Meteorological Subdivisions "
        "for Day 1 to Day 10 lead times."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(forecast_router)

@app.get("/")
def root():
    return {
        "system": "AI-Based Forecast Bust Detection for Medium-Range Weather Forecasts",
        "status": "OPERATIONAL",
        "version": "1.0.0",
        "lead_times": "Day 1 to Day 10",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "forecast-bust-detection-api",
        "subdivisions_count": 36,
        "scenarios_available": 6
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
