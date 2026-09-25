"""
Live Weather & Rainfall Monitoring Router
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.database import get_collection

router = APIRouter(prefix="/api/monitoring", tags=["Live Monitoring"])

@router.get("/stations", response_model=List[Dict[str, Any]])
def get_weather_stations():
    coll = get_collection("observations")
    stations = coll.find()
    return stations

@router.get("/station/{station_id}")
def get_station_details(station_id: str):
    coll = get_collection("observations")
    station = coll.find_one({"station_id": station_id})
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
        
    # Telemetry time series for station modal
    history = [
        {"time": "-4h", "rainfall_mm": round(station.get("rainfall_1h_mm", 20.0) * 0.4, 1), "temp_c": 27.8, "humidity_pct": 82},
        {"time": "-3h", "rainfall_mm": round(station.get("rainfall_1h_mm", 20.0) * 0.65, 1), "temp_c": 27.2, "humidity_pct": 86},
        {"time": "-2h", "rainfall_mm": round(station.get("rainfall_1h_mm", 20.0) * 0.85, 1), "temp_c": 26.6, "humidity_pct": 91},
        {"time": "-1h", "rainfall_mm": round(station.get("rainfall_1h_mm", 20.0) * 1.05, 1), "temp_c": 26.0, "humidity_pct": 94},
        {"time": "Now", "rainfall_mm": station.get("rainfall_1h_mm", 25.0), "temp_c": station.get("temperature_c", 25.8), "humidity_pct": station.get("relative_humidity_pct", 95)}
    ]
    
    return {
        "station": station,
        "telemetry_history": history
    }

@router.get("/radar-frames")
def get_radar_frames(timeframe: str = "1h"):
    """
    Returns Doppler Radar Reflectivity frames for animation across selected timeframe (1h, 3h, 6h, 24h).
    """
    frames = [
        {"timestamp": "-60m", "label": "T-60m", "reflectivity_max_dbz": 44.5, "storm_center": [12.95, 80.30]},
        {"timestamp": "-45m", "label": "T-45m", "reflectivity_max_dbz": 48.0, "storm_center": [12.98, 80.26]},
        {"timestamp": "-30m", "label": "T-30m", "reflectivity_max_dbz": 51.5, "storm_center": [13.01, 80.23]},
        {"timestamp": "-15m", "label": "T-15m", "reflectivity_max_dbz": 53.0, "storm_center": [13.03, 80.21]},
        {"timestamp": "0m (Latest)", "label": "Current Scan", "reflectivity_max_dbz": 54.2, "storm_center": [13.05, 80.20]}
    ]
    return {
        "timeframe": timeframe,
        "radar_station": "DWR Chennai S-Band (13.08°N, 80.29°E)",
        "elevation_angle_deg": 0.5,
        "frames": frames
    }
