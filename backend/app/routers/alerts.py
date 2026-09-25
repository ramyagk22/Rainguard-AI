"""
Alert Management & Audit Log Router
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.database import get_collection
from app.auth import get_current_user

router = APIRouter(prefix="/api/alerts", tags=["Alert Management"])

@router.get("", response_model=List[Dict[str, Any]])
def get_alerts(status: Optional[str] = None):
    coll = get_collection("alerts")
    query = {}
    if status and status != "ALL":
        query["status"] = status.upper()
    return coll.find(query)

@router.post("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    coll = get_collection("alerts")
    alert = coll.find_one({"alert_id": alert_id})
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    coll.update_one({"alert_id": alert_id}, {
        "status": "ACKNOWLEDGED",
        "acknowledged_by": current_user.get("email"),
        "acknowledged_at": now_str
    })

    # Add audit log
    audit_coll = get_collection("audit_logs")
    audit_coll.insert_one({
        "timestamp": now_str,
        "user_email": current_user.get("email"),
        "user_role": current_user.get("role"),
        "action": "ACKNOWLEDGE",
        "target_id": alert_id,
        "details": f"Operator {current_user.get('name')} acknowledged alert for {alert.get('location')}."
    })

    return {"status": "success", "message": f"Alert {alert_id} acknowledged."}

@router.post("/{alert_id}/escalate")
def escalate_alert(alert_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    coll = get_collection("alerts")
    alert = coll.find_one({"alert_id": alert_id})
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    coll.update_one({"alert_id": alert_id}, {
        "warning_level": "CRITICAL",
        "reason": f"ESCALATED BY COMMAND: {alert.get('reason')} [Escalated by {current_user.get('role')} {current_user.get('name')}]"
    })

    # Add audit log
    audit_coll = get_collection("audit_logs")
    audit_coll.insert_one({
        "timestamp": now_str,
        "user_email": current_user.get("email"),
        "user_role": current_user.get("role"),
        "action": "ESCALATE",
        "target_id": alert_id,
        "details": f"Alert {alert_id} escalated to CRITICAL by {current_user.get('role')}."
    })

    return {"status": "success", "message": f"Alert {alert_id} escalated to CRITICAL."}

@router.post("/{alert_id}/close")
def close_alert(alert_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    coll = get_collection("alerts")
    alert = coll.find_one({"alert_id": alert_id})
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    coll.update_one({"alert_id": alert_id}, {
        "status": "CLOSED",
        "closed_by": current_user.get("email"),
        "closed_at": now_str
    })

    # Add audit log
    audit_coll = get_collection("audit_logs")
    audit_coll.insert_one({
        "timestamp": now_str,
        "user_email": current_user.get("email"),
        "user_role": current_user.get("role"),
        "action": "CLOSE",
        "target_id": alert_id,
        "details": f"Alert {alert_id} closed by {current_user.get('name')}."
    })

    return {"status": "success", "message": f"Alert {alert_id} closed."}

@router.get("/audit-trail")
def get_audit_trail():
    coll = get_collection("audit_logs")
    logs = coll.find(sort_field="timestamp", sort_order=-1, limit=50)
    return logs
