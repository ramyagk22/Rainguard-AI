"""
System Settings & Operational Preferences Router
"""

from fastapi import APIRouter
from typing import Dict, Any
from app.config import settings
from app.database import is_mongo_active

router = APIRouter(prefix="/api/settings", tags=["Settings"])

@router.get("/status")
def get_system_settings_status() -> Dict[str, Any]:
    return {
        "product_name": settings.PROJECT_NAME,
        "team_name": settings.TEAM_NAME,
        "version": settings.VERSION,
        "tagline": settings.TAGLINE,
        "database_backend": "MongoDB Atlas" if is_mongo_active() else "Autonomous Local Store (Demo Mode)",
        "demo_mode": settings.DEMO_MODE,
        "data_provenance": "Simulated Hydrometeorological Baseline (Chennai / Tamil Nadu Basins)",
        "supported_languages": ["en", "ta"],
        "default_language": "en",
        "pwa_offline_enabled": True,
        "low_bandwidth_support": True
    }
