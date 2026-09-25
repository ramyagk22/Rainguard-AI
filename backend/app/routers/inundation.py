"""
AI Inundation Prediction Router
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.ml.inundation_model import inundation_engine
from app.database import get_collection
from app.config import settings

router = APIRouter(prefix="/api/inundation", tags=["Inundation Prediction"])

class InundationSimRequest(BaseModel):
    zone_id: Optional[str] = "ZN-VEL-01"
    rainfall_mm: float = 85.0
    dem_elevation_m: float = 3.4
    slope_pct: float = 0.4
    soil_saturation_pct: float = 94.0
    drainage_discharge_m3s: float = 12.5
    river_stage_m: float = 7.65
    river_danger_level_m: float = 7.50

@router.get("/zones", response_model=List[Dict[str, Any]])
def get_inundation_zones():
    coll = get_collection("inundation_predictions")
    zones = coll.find()
    return zones

@router.post("/simulate")
def simulate_inundation(req: InundationSimRequest) -> Dict[str, Any]:
    res = inundation_engine.predict_zone_inundation(
        rainfall_mm=req.rainfall_mm,
        dem_elevation_m=req.dem_elevation_m,
        slope_pct=req.slope_pct,
        soil_saturation_pct=req.soil_saturation_pct,
        drainage_discharge_m3s=req.drainage_discharge_m3s,
        river_stage_m=req.river_stage_m,
        river_danger_level_m=req.river_danger_level_m
    )
    
    return {
        "zone_id": req.zone_id,
        "input_parameters": req.dict(),
        "prediction": res,
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "is_demo_data": settings.DEMO_MODE,
        "disclaimer": "Hydrological inundation model is a prototype decision-support tool. Ground conditions, local obstructions and micro-pumping can affect local water levels."
    }
