"""
Full GIS Risk Map & Assessment Router
Hazard + Exposure + Vulnerability = Risk Framework
"""

from fastapi import APIRouter
from typing import Dict, Any, List
from app.database import get_collection

router = APIRouter(prefix="/api/risk", tags=["Risk Map"])

@router.get("/layers")
def get_risk_map_layers() -> Dict[str, Any]:
    inundation_coll = get_collection("inundation_predictions")
    zones = inundation_coll.find()
    
    infra_coll = get_collection("critical_infrastructure")
    infra = infra_coll.find()
    
    stations_coll = get_collection("observations")
    stations = stations_coll.find()

    # Drainage and river lines
    drainage_lines = [
        {
            "id": "RIV-ADYAR",
            "name": "Adyar River Main Channel",
            "type": "River",
            "danger_stage_m": 7.5,
            "current_stage_m": 7.65,
            "status": "DANGER_EXCEEDED",
            "coordinates": [
                [13.0119, 80.0575], # Chembarambakkam
                [13.0180, 80.1450], # Porur / Ramapuram
                [13.0198, 80.2215], # Saidapet Bridge
                [13.0120, 80.2550], # Kotturpuram
                [13.0080, 80.2720]  # Adyar Estuary
            ]
        },
        {
            "id": "RIV-COOUM",
            "name": "Cooum River Basin",
            "type": "River",
            "danger_stage_m": 6.8,
            "current_stage_m": 5.4,
            "status": "NORMAL",
            "coordinates": [
                [13.0720, 80.1200], # Koyambedu
                [13.0740, 80.1900], # Aminjikarai
                [13.0710, 80.2500], # Egmore
                [13.0650, 80.2850]  # Marina mouth
            ]
        },
        {
            "id": "CANAL-BUCKINGHAM",
            "name": "Buckingham Canal",
            "type": "Canal",
            "danger_stage_m": 3.0,
            "current_stage_m": 2.6,
            "status": "WATCH",
            "coordinates": [
                [13.2300, 80.3200], # Ennore
                [13.1200, 80.2900], # Central
                [12.9800, 80.2450], # Tiruvanmiyur
                [12.8500, 80.2200]  # Sholinganallur
            ]
        }
    ]

    return {
        "zones": zones,
        "critical_infrastructure": infra,
        "stations": stations,
        "drainage_lines": drainage_lines,
        "methodology": {
            "formula": "Risk = Hazard x Exposure x Vulnerability",
            "hazard_components": ["Rainfall Intensity", "Catchment Runoff Volume", "River Stage Overtopping"],
            "exposure_components": ["Population Density", "Critical Infrastructure Count", "Arterial Road Network"],
            "vulnerability_components": ["Low Topographic Elevation (<5m)", "Impervious Concrete Ratio", "Drainage Outfall Tide Lock"]
        }
    }
