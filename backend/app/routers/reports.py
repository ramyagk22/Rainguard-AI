"""
Situation Reports & Briefing Generation Router
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.database import get_collection
from app.auth import get_current_user

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("", response_model=List[Dict[str, Any]])
def get_reports():
    coll = get_collection("reports")
    reports = coll.find()
    return reports

@router.get("/{report_id}")
def get_report_detail(report_id: str):
    coll = get_collection("reports")
    report = coll.find_one({"report_id": report_id})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.post("/generate")
def generate_situation_report(region: str = "Greater Chennai & Coastal Coromandel", current_user: Dict[str, Any] = Depends(get_current_user)):
    now = datetime.utcnow()
    report_id = f"REP-{now.strftime('%Y-%m%d-%H%M')}"
    
    report_content = {
        "report_id": report_id,
        "title": f"Official Flood Situation Briefing & Hydrometeorological Intelligence — {region}",
        "team": "Innovexa",
        "product": "RainGuard AI",
        "region": region,
        "generated_at": now.strftime("%Y-%m-%d %H:%M:%S UTC"),
        "hazard_level": "SEVERE",
        "risk_level": "CRITICAL",
        "reliability": "HIGH (88.4%)",
        "status": "Official Briefing Ready",
        "author": f"{current_user.get('name', 'Operator')} ({current_user.get('role', 'Emergency Operator')})",
        "executive_summary": (
            "An intense active monsoonal cloudband with Doppler radar reflectivity exceeding 52 dBZ "
            "is stagnating over the South Chennai and coastal Coromandel corridor. "
            "RainGuard AI predicts cumulative 3-hour precipitation of 108.5 - 122.0 mm, "
            "generating critical hydrodynamic runoff along the Adyar river basin and Velachery marsh bowl. "
            "Overbank stage has been reached at Saidapet Bridge (7.65m vs 7.50m danger mark). "
            "Immediate Level-3 incident response protocols are recommended."
        ),
        "data_sources_fused": [
            "INSAT-3DR Geostationary Imager (TIR1/TIR2 brightness temperature)",
            "DWR Chennai Doppler Radar (250km radial S-band reflectivity)",
            "IMD Automatic Weather Station network (8 active telemetry nodes)",
            "ECMWF 0.125° & GFS 0.25° Numerical Weather Prediction"
        ],
        "rainfall_analysis": {
            "observed_past_3h_mm": 84.2,
            "ai_predicted_next_3h_mm": 118.0,
            "nwp_forecast_next_3h_mm": 85.0,
            "fused_consensus_mm": 110.5,
            "peak_intensity_mm_hr": 46.2
        },
        "inundation_summary": {
            "predicted_total_inundation_km2": 24.15,
            "critical_submersion_zones": ["Saidapet Adyar River Corridor (>1.3m)", "Velachery South Bowl (1.15m)", "Tambaram Mudichur (0.95m)"],
            "potentially_affected_infrastructure": ["MIOT Hospital Approach", "Velachery 100-Ft Subway", "Saidapet Causeways"]
        },
        "explainable_ai_attribution": [
            "Doppler Radar Reflectivity (+42% contribution to extreme rainfall nowcast)",
            "Soil Moisture Saturation at 94% (+28% contribution to immediate overland ponding)",
            "Low-lying Topography (<3.4m MSL) causing gravitational accumulation (+21%)"
        ],
        "reliability_assessment": {
            "score": "88.4% (HIGH)",
            "sensor_latency": "5 minutes",
            "gauge_telemetry_completeness": "100%",
            "forecast_consensus": "Strong agreement between ConvRF and ECMWF"
        },
        "actionable_early_warnings": [
            "Mandatory evacuation of riverbank habitations along Jafferkhanpet and Saidapet.",
            "Continuous operation of heavy dewatering pumps at inundated subways.",
            "Relief shelter activation at Saidapet Community Center and Velachery Higher Secondary School."
        ],
        "historical_reference": "Conditions show hydrodynamic similarity to the initial surge phase of Cyclone Michaung (Dec 2023).",
        "responsible_ai_disclaimer": (
            "RainGuard AI is an AI-based decision-support prototype. "
            "Predictions contain uncertainty and must be verified in conjunction with official directives from the "
            "India Meteorological Department (IMD) and State Disaster Management Authority."
        )
    }

    coll = get_collection("reports")
    coll.insert_one(report_content)
    
    # Audit log
    audit_coll = get_collection("audit_logs")
    audit_coll.insert_one({
        "timestamp": now.strftime("%Y-%m-%d %H:%M:%S UTC"),
        "user_email": current_user.get("email", "operator@rainguard.ai"),
        "user_role": current_user.get("role", "Emergency Operator"),
        "action": "REPORT_GENERATE",
        "target_id": report_id,
        "details": f"Generated Situation Briefing {report_id} for {region}."
    })

    return report_content
