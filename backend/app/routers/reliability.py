"""
AI Decision-Support Reliability Router
"""

from fastapi import APIRouter
from typing import Dict, Any
from app.ml.reliability import reliability_engine

router = APIRouter(prefix="/api/reliability", tags=["Reliability"])

@router.get("/current")
def get_current_reliability() -> Dict[str, Any]:
    return reliability_engine.calculate_reliability(
        data_quality_pct=95.2,
        missing_sensors_count=0,
        total_sensors_count=8,
        latency_minutes=5,
        ai_forecast_mm=58.4,
        nwp_forecast_mm=48.0,
        model_tree_variance=2.8,
        spatial_agreement_pct=92.5,
        temporal_trend_continuity_pct=89.0
    )
