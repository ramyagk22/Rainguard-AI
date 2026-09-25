"""
Dashboard API router
"""

from fastapi import APIRouter
from datetime import datetime
from typing import Dict, Any, List
from app.database import get_collection
from app.config import settings

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/summary")
def get_dashboard_summary() -> Dict[str, Any]:
    alerts_coll = get_collection("alerts")
    active_alerts = alerts_coll.find({"status": "ACTIVE"})
    
    inundation_coll = get_collection("inundation_predictions")
    zones = inundation_coll.find()
    
    stations_coll = get_collection("observations")
    stations = stations_coll.find()
    
    sources_coll = get_collection("data_sources")
    sources = sources_coll.find()
    
    total_inundation_km2 = sum(z.get("predicted_inundation_km2", 0) for z in zones)
    heavy_rain_zones = len([z for z in zones if z.get("risk_category") in ["ALERT", "SEVERE", "CRITICAL"]])
    high_risk_areas = len([z for z in zones if z.get("risk_category") in ["SEVERE", "CRITICAL"]])
    connected_sources = len([s for s in sources if s.get("status") == "Connected"])

    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

    return {
        "mode": "DEMO MODE (Prototype Simulation)" if settings.DEMO_MODE else "LIVE DATA",
        "last_updated": now_str,
        "region": settings.PRIMARY_REGION,
        "stats": {
            "active_alerts": {
                "value": len(active_alerts),
                "label": "Active Warnings",
                "status": "SEVERE" if any(a.get("warning_level") == "CRITICAL" for a in active_alerts) else "ALERT",
                "trend": "+1 in last 2h"
            },
            "heavy_rainfall_zones": {
                "value": heavy_rain_zones,
                "label": "Heavy Rainfall Zones",
                "status": "ALERT",
                "trend": "Stationary rainband"
            },
            "high_risk_areas": {
                "value": high_risk_areas,
                "label": "High-Risk Areas",
                "status": "CRITICAL",
                "trend": "Adyar & Velachery"
            },
            "predicted_inundation_km2": {
                "value": round(total_inundation_km2, 2),
                "unit": "km²",
                "label": "Predicted Inundation Extent",
                "status": "SEVERE",
                "trend": "+4.2 km² expected"
            },
            "monitoring_stations": {
                "value": len(stations),
                "total": len(stations),
                "label": "Monitoring Stations",
                "status": "NORMAL",
                "trend": "100% operational"
            },
            "data_sources": {
                "connected": connected_sources,
                "total": len(sources),
                "label": "Data Sources",
                "status": "NORMAL" if connected_sources == len(sources) else "WATCH",
                "trend": "INSAT, DWR, AWS, NWP"
            }
        },
        "responsible_ai_disclaimer": "RainGuard AI is an AI-based decision-support prototype. Predictions should be interpreted together with official meteorological, hydrological and disaster-management information."
    }

@router.get("/charts")
def get_dashboard_charts() -> Dict[str, Any]:
    # Chart 1: Rainfall Trend (Observed past 6 hours, predicted next 6 hours)
    rainfall_trend = [
        {"time": "-5h", "observed": 12.0, "predicted": None, "nwp": 10.5},
        {"time": "-4h", "observed": 18.5, "predicted": None, "nwp": 15.0},
        {"time": "-3h", "observed": 26.0, "predicted": None, "nwp": 22.0},
        {"time": "-2h", "observed": 34.5, "predicted": None, "nwp": 28.5},
        {"time": "-1h", "observed": 42.0, "predicted": None, "nwp": 35.0},
        {"time": "Now", "observed": 46.2, "predicted": 46.2, "nwp": 38.0},
        {"time": "+1h", "observed": None, "predicted": 52.4, "nwp": 41.0},
        {"time": "+2h", "observed": None, "predicted": 58.0, "nwp": 44.5},
        {"time": "+3h", "observed": None, "predicted": 64.2, "nwp": 46.0},
        {"time": "+4h", "observed": None, "predicted": 55.0, "nwp": 42.0},
        {"time": "+5h", "observed": None, "predicted": 41.5, "nwp": 36.0},
        {"time": "+6h", "observed": None, "predicted": 28.0, "nwp": 29.0}
    ]

    # Chart 2: Multi-Horizon Forecast Comparison (Observed, NWP GFS, AI Prediction)
    forecast_comparison = [
        {"horizon": "1 Hour", "observed": 46.2, "nwp": 38.0, "ai_prediction": 52.4},
        {"horizon": "3 Hours", "observed": 108.5, "nwp": 85.0, "ai_prediction": 118.0},
        {"horizon": "6 Hours", "observed": None, "nwp": 142.0, "ai_prediction": 174.5},
        {"horizon": "12 Hours", "observed": None, "nwp": 195.0, "ai_prediction": 228.0},
        {"horizon": "24 Hours", "observed": None, "nwp": 245.0, "ai_prediction": 285.0}
    ]

    # Chart 3: Risk Distribution (Normal, Watch, Alert, Severe, Critical)
    risk_distribution = [
        {"name": "NORMAL", "count": 2, "color": "#0284c7"},
        {"name": "WATCH", "count": 1, "color": "#d97706"},
        {"name": "ALERT", "count": 2, "color": "#ea580c"},
        {"name": "SEVERE", "count": 2, "color": "#dc2626"},
        {"name": "CRITICAL", "count": 1, "color": "#991b1b"}
    ]

    # Chart 4: Predicted Inundation Extent (km²) vs Time (0h to 24h)
    inundation_area_time = [
        {"time": "T+0h (Current)", "inundation_km2": 9.4, "critical_depth_km2": 1.8},
        {"time": "T+3h", "inundation_km2": 16.8, "critical_depth_km2": 4.2},
        {"time": "T+6h (Peak)", "inundation_km2": 24.15, "critical_depth_km2": 8.4},
        {"time": "T+12h", "inundation_km2": 21.6, "critical_depth_km2": 6.1},
        {"time": "T+18h", "inundation_km2": 15.2, "critical_depth_km2": 3.0},
        {"time": "T+24h", "inundation_km2": 9.8, "critical_depth_km2": 1.2}
    ]

    return {
        "rainfall_trend": rainfall_trend,
        "forecast_comparison": forecast_comparison,
        "risk_distribution": risk_distribution,
        "inundation_area_time": inundation_area_time
    }
