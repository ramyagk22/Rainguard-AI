"""
Explainable AI (XAI) Attribution Router
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.ml.explainability import explainability_engine

router = APIRouter(prefix="/api/xai", tags=["Explainable AI"])

class RainfallExplainRequest(BaseModel):
    radar_reflectivity_dbz: Optional[float] = 48.5
    pressure_hpa: Optional[float] = 1002.5
    relative_humidity_pct: Optional[float] = 95.0
    wind_convergence_mps: Optional[float] = 8.2
    nwp_gfs_mm: Optional[float] = 28.0
    lag1_rainfall_mm: Optional[float] = 22.0
    lag3_rainfall_mm: Optional[float] = 54.0
    cape_j_kg: Optional[float] = 2100.0

class InundationExplainRequest(BaseModel):
    rainfall_mm: Optional[float] = 85.0
    dem_elevation_m: Optional[float] = 3.4
    slope_pct: Optional[float] = 0.4
    soil_saturation_pct: Optional[float] = 94.0
    drainage_discharge_m3s: Optional[float] = 12.5
    river_stage_m: Optional[float] = 7.65
    river_danger_level_m: Optional[float] = 7.50

@router.post("/explain-rainfall")
def explain_rainfall(req: RainfallExplainRequest) -> Dict[str, Any]:
    return explainability_engine.explain_rainfall_prediction(req.dict())

@router.post("/explain-inundation")
def explain_inundation(req: InundationExplainRequest) -> Dict[str, Any]:
    return explainability_engine.explain_inundation_prediction(req.dict())
