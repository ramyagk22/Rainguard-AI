"""
Early Warning Center & Configurable Thresholds Router
"""

from fastapi import APIRouter, Depends
from typing import Dict, Any, List
from app.models.schemas import WarningThresholdConfig, EarlyWarningAlert
from app.ml.early_warning import warning_engine, PROTOTYPE_NOTICE
from app.database import get_collection
from app.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/warnings", tags=["Early Warning Center"])

_ACTIVE_THRESHOLDS = WarningThresholdConfig()

@router.get("/thresholds")
def get_thresholds():
    return {
        "thresholds": _ACTIVE_THRESHOLDS.dict(),
        "is_prototype": True,
        "disclaimer": PROTOTYPE_NOTICE
    }

@router.post("/thresholds")
def update_thresholds(config: WarningThresholdConfig, current_user: Dict[str, Any] = Depends(get_current_user)):
    global _ACTIVE_THRESHOLDS
    _ACTIVE_THRESHOLDS = config
    
    # Audit log
    audit_coll = get_collection("audit_logs")
    audit_coll.insert_one({
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "user_email": current_user.get("email", "admin@rainguard.ai"),
        "user_role": current_user.get("role", "Administrator"),
        "action": "CONFIG_CHANGE",
        "target_id": "WARNING_THRESHOLDS",
        "details": f"Updated prototype warning thresholds (Severe: {config.severe_rainfall_1h_mm}mm, Critical depth: {config.critical_inundation_depth_m}m)."
    })

    return {
        "status": "success",
        "message": "Warning thresholds updated successfully.",
        "thresholds": _ACTIVE_THRESHOLDS.dict()
    }

@router.get("/active-warnings")
def get_active_warnings():
    coll = get_collection("alerts")
    alerts = coll.find({"status": "ACTIVE"})
    return {
        "count": len(alerts),
        "disclaimer": PROTOTYPE_NOTICE,
        "warnings": alerts
    }
