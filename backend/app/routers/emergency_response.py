"""
Emergency Response Operations Router
"""

from fastapi import APIRouter
from typing import Dict, Any, List
from app.database import get_collection

router = APIRouter(prefix="/api/emergency", tags=["Emergency Response"])

@router.get("/situation")
def get_emergency_situation() -> Dict[str, Any]:
    infra_coll = get_collection("critical_infrastructure")
    infra = infra_coll.find()
    
    inundation_coll = get_collection("inundation_predictions")
    zones = inundation_coll.find({"risk_category": {"$in": ["ALERT", "SEVERE", "CRITICAL"]}})
    
    shelters = [item for item in infra if item.get("type") == "Shelter"]
    hospitals = [item for item in infra if item.get("type") == "Hospital"]
    roads = [item for item in infra if "Road" in item.get("type", "") or "Subway" in item.get("type", "")]
    
    total_shelter_capacity = sum(s.get("capacity_people", 0) for s in shelters)
    current_occupancy = sum(s.get("current_occupancy", 0) for s in shelters)
    
    return {
        "status_summary": {
            "operational_condition": "LEVEL-3 INCIDENT COMMAND ACTIVE",
            "active_high_risk_zones": len(zones),
            "total_shelter_capacity": total_shelter_capacity,
            "current_occupancy": current_occupancy,
            "available_capacity": total_shelter_capacity - current_occupancy,
            "potentially_affected_infrastructure_count": len([i for i in infra if i.get("potentially_affected", False)])
        },
        "critical_infrastructure": infra,
        "shelters": shelters,
        "hospitals": hospitals,
        "potentially_affected_roads": roads,
        "response_actions": [
            {"id": "ACT-1", "action": "Mobilize NDRF 04th Battalion Team Alpha to Saidapet Maraimalai Adigal Bridge.", "priority": "HIGH", "status": "DISPATCHED"},
            {"id": "ACT-2", "action": "Position 150HP submersible dewatering pumps at Velachery 100-Ft subway.", "priority": "HIGH", "status": "IN_PROGRESS"},
            {"id": "ACT-3", "action": "Stage emergency food packets and clean water purification tablets at Saidapet Relief Center.", "priority": "MEDIUM", "status": "STAGED"},
            {"id": "ACT-4", "action": "Coordinate with TANGEDCO power utility for localized grid trip prevention in waterlogged basements.", "priority": "HIGH", "status": "COORDINATING"}
        ],
        "disclaimer": "Infrastructure and routes are labeled 'Potentially Affected' based on hydrological model forecasts. Ground reconnaissance must confirm field status before heavy transport transit."
    }
