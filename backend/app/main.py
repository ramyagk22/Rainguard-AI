"""
RainGuard AI - Main FastAPI Application Server
Built by Team Innovexa
"From Rainfall Intelligence to Actionable Flood Warnings."
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.data.seed_data import seed_initial_data

# Import API Routers
from app.routers.auth import router as auth_router
from app.routers.dashboard import router as dashboard_router
from app.routers.live_monitoring import router as live_monitoring_router
from app.routers.data_sources import router as data_sources_router
from app.routers.rainfall import router as rainfall_router
from app.routers.inundation import router as inundation_router
from app.routers.risk import router as risk_router
from app.routers.xai import router as xai_router
from app.routers.reliability import router as reliability_router
from app.routers.warnings import router as warnings_router
from app.routers.alerts import router as alerts_router
from app.routers.emergency_response import router as emergency_response_router
from app.routers.historical import router as historical_router
from app.routers.forecast_vs_observed import router as forecast_vs_observed_router
from app.routers.model_insights import router as model_insights_router
from app.routers.reports import router as reports_router
from app.routers.settings import router as settings_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("rainguard.main")

app = FastAPI(
    title=f"{settings.PROJECT_NAME} by {settings.TEAM_NAME}",
    version=settings.VERSION,
    description="Integrated Heavy Rainfall Early Warning and Inundation Prediction System"
)

# CORS configuration for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    logger.info("Initializing RainGuard AI Database & Seed Data...")
    init_db()
    seed_initial_data()
    logger.info("RainGuard AI System Online and Ready.")

# Root health check endpoint
@app.get("/")
def root():
    return {
        "product": settings.PROJECT_NAME,
        "team": settings.TEAM_NAME,
        "tagline": settings.TAGLINE,
        "status": "OPERATIONAL",
        "demo_mode": settings.DEMO_MODE,
        "data_status": "Demo data (Prototype / Simulation)",
        "responsible_ai_disclaimer": "RainGuard AI is an AI-based decision-support prototype. Predictions should be interpreted together with official meteorological and disaster-management information."
    }

# Register all Routers
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(live_monitoring_router)
app.include_router(data_sources_router)
app.include_router(rainfall_router)
app.include_router(inundation_router)
app.include_router(risk_router)
app.include_router(xai_router)
app.include_router(reliability_router)
app.include_router(warnings_router)
app.include_router(alerts_router)
app.include_router(emergency_response_router)
app.include_router(historical_router)
app.include_router(forecast_vs_observed_router)
app.include_router(model_insights_router)
app.include_router(reports_router)
app.include_router(settings_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
