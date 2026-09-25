"""
AI Rainfall Forecast Router
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.ml.rainfall_model import rainfall_engine
from app.config import settings

router = APIRouter(prefix="/api/rainfall", tags=["Rainfall Forecast"])

class RainfallPredictRequest(BaseModel):
    location: str = "Velachery South Basin"
    region: str = "Chennai Metro"
    horizon_hours: int = 3
    radar_reflectivity_dbz: Optional[float] = 48.5
    pressure_hpa: Optional[float] = 1002.5
    relative_humidity_pct: Optional[float] = 95.0
    wind_convergence_mps: Optional[float] = 8.2
    nwp_gfs_mm: Optional[float] = 28.0
    lag1_rainfall_mm: Optional[float] = 22.0
    lag3_rainfall_mm: Optional[float] = 54.0
    cape_j_kg: Optional[float] = 2100.0

@router.post("/predict")
def predict_rainfall(req: RainfallPredictRequest) -> Dict[str, Any]:
    features = {
        "radar_reflectivity_dbz": req.radar_reflectivity_dbz,
        "pressure_hpa": req.pressure_hpa,
        "relative_humidity_pct": req.relative_humidity_pct,
        "wind_convergence_mps": req.wind_convergence_mps,
        "nwp_gfs_mm": req.nwp_gfs_mm,
        "lag1_rainfall_mm": req.lag1_rainfall_mm,
        "lag3_rainfall_mm": req.lag3_rainfall_mm,
        "cape_j_kg": req.cape_j_kg
    }

    result = rainfall_engine.predict(features, horizon_hours=req.horizon_hours)
    
    observed_val = round(req.lag1_rainfall_mm * 1.2, 1)
    
    return {
        "location": req.location,
        "region": req.region,
        "horizon_hours": req.horizon_hours,
        "forecast_period": f"Next {req.horizon_hours} Hours",
        "observed_rainfall_mm": observed_val,
        "nwp_forecast_mm": result["nwp_forecast_mm"],
        "ai_prediction_mm": result["predicted_rainfall_mm"],
        "fused_prediction_mm": result["fused_prediction_mm"],
        "peak_intensity_mm_hr": result["peak_intensity_mm_hr"],
        "accumulated_rainfall_mm": result["accumulated_rainfall_mm"],
        "prediction_reliability": result["reliability_level"],
        "reliability_score_pct": result["reliability_score_pct"],
        "model_version": result["model_version"],
        "input_timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "is_demo_data": settings.DEMO_MODE,
        "data_status_label": "Demo data (Prototype / Simulation)",
        "disclaimer": "AI decision-support prototype. Predictions contain uncertainty and should be verified against official IMD bulletins."
    }

@router.get("/spatial-grid")
def get_spatial_grid():
    """
    Returns spatial grid points comparing Observed, AI Forecast, NWP Forecast, and Difference.
    """
    grid_points = [
        {"location": "Velachery South", "lat": 12.9815, "lon": 80.2180, "observed": 46.2, "ai_forecast": 58.4, "nwp_forecast": 42.0, "diff": 16.4},
        {"location": "Saidapet Adyar", "lat": 13.0205, "lon": 80.2225, "observed": 35.8, "ai_forecast": 52.0, "nwp_forecast": 38.5, "diff": 13.5},
        {"location": "Tambaram Mudichur", "lat": 12.9249, "lon": 80.1000, "observed": 42.0, "ai_forecast": 64.5, "nwp_forecast": 48.0, "diff": 16.5},
        {"location": "Madhavaram Retteri", "lat": 13.1488, "lon": 80.2314, "observed": 28.5, "ai_forecast": 38.0, "nwp_forecast": 32.0, "diff": 6.0},
        {"location": "Ennore Creek", "lat": 13.2300, "lon": 80.3200, "observed": 31.0, "ai_forecast": 44.0, "nwp_forecast": 36.0, "diff": 8.0},
        {"location": "Nungambakkam Central", "lat": 13.0595, "lon": 80.2425, "observed": 24.6, "ai_forecast": 32.5, "nwp_forecast": 29.0, "diff": 3.5},
        {"location": "Chembarambakkam Inflow", "lat": 13.0119, "lon": 80.0575, "observed": 42.0, "ai_forecast": 62.0, "nwp_forecast": 45.0, "diff": 17.0},
        {"location": "Cuddalore Port", "lat": 11.7480, "lon": 79.7714, "observed": 18.2, "ai_forecast": 24.0, "nwp_forecast": 22.0, "diff": 2.0}
    ]
    return {
        "region": "Tamil Nadu Coastal Region",
        "grid_resolution_km": "1.0 x 1.0",
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "points": grid_points
    }
