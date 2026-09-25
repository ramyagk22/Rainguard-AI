"""
Historical Events & Timeline Analysis Router
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.database import get_collection

router = APIRouter(prefix="/api/historical", tags=["Historical Events"])

@router.get("/events", response_model=List[Dict[str, Any]])
def get_historical_events():
    coll = get_collection("historical_events")
    events = coll.find()
    return events

@router.get("/event/{event_id}")
def get_event_detail(event_id: str):
    coll = get_collection("historical_events")
    event = coll.find_one({"event_id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    # Extended timeline series for visualization charts
    timeline_series = [
        {"time": "T+00h", "rainfall_mm": 15.0, "predicted_rainfall_mm": 18.0, "water_depth_m": 0.1, "predicted_depth_m": 0.12},
        {"time": "T+06h", "rainfall_mm": 65.0, "predicted_rainfall_mm": 72.0, "water_depth_m": 0.35, "predicted_depth_m": 0.38},
        {"time": "T+12h", "rainfall_mm": 185.0, "predicted_rainfall_mm": 195.0, "water_depth_m": 0.85, "predicted_depth_m": 0.92},
        {"time": "T+18h", "rainfall_mm": 320.0, "predicted_rainfall_mm": 340.0, "water_depth_m": 1.45, "predicted_depth_m": 1.50},
        {"time": "T+24h", "rainfall_mm": event.get("peak_rainfall_mm", 450.0), "predicted_rainfall_mm": round(event.get("peak_rainfall_mm", 450.0) * 0.95, 1), "water_depth_m": 1.85, "predicted_depth_m": 1.78},
        {"time": "T+36h", "rainfall_mm": 380.0, "predicted_rainfall_mm": 360.0, "water_depth_m": 1.30, "predicted_depth_m": 1.25},
        {"time": "T+48h", "rainfall_mm": 120.0, "predicted_rainfall_mm": 110.0, "water_depth_m": 0.60, "predicted_depth_m": 0.55}
    ]
    
    return {
        "event": event,
        "timeline_series": timeline_series
    }
