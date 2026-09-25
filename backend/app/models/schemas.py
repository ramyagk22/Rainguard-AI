from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    EMERGENCY_OPERATOR = "Emergency Operator"
    WEATHER_ANALYST = "Weather Analyst"
    ADMINISTRATOR = "Administrator"

class StatusLevel(str, Enum):
    NORMAL = "NORMAL"
    WATCH = "WATCH"
    ALERT = "ALERT"
    SEVERE = "SEVERE"
    CRITICAL = "CRITICAL"

class QualityStatus(str, Enum):
    GOOD = "GOOD"
    BORDERLINE = "BORDERLINE"
    INSUFFICIENT = "INSUFFICIENT"

class UserLogin(BaseModel):
    email: str
    password: str
    role: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class WeatherStation(BaseModel):
    station_id: str
    name: str
    region: str
    latitude: float
    longitude: float
    rainfall_1h_mm: float
    rainfall_3h_mm: float
    rainfall_24h_mm: float
    temperature_c: float
    relative_humidity_pct: float
    wind_speed_kmh: float
    wind_direction_deg: float
    pressure_hpa: float
    water_level_m: Optional[float] = None
    river_danger_level_m: Optional[float] = None
    data_quality: QualityStatus
    last_updated: str
    is_demo: bool = True

class DataSource(BaseModel):
    source_id: str
    name: str
    source_type: str  # SATELLITE, RADAR, GROUND, NWP
    status: str       # Connected, Degraded, Disconnected
    latest_timestamp: str
    coverage_pct: float
    latency_minutes: int
    quality: QualityStatus
    missing_data_pct: float
    outlier_count: int
    consistency_pct: float
    model_or_sensor: str

class RainfallPrediction(BaseModel):
    location: str
    region: str
    horizon_hours: int
    observed_rainfall_mm: float
    nwp_forecast_mm: float
    ai_prediction_mm: float
    fused_prediction_mm: float
    peak_intensity_mm_hr: float
    accumulated_rainfall_mm: float
    prediction_reliability: str  # HIGH, MEDIUM, LOW
    reliability_score_pct: float
    model_version: str
    input_timestamp: str
    is_demo_data: bool = True
    disclaimer: str

class InundationZone(BaseModel):
    zone_id: str
    name: str
    center_lat: float
    center_lon: float
    elevation_dem_m: float
    slope_pct: float
    soil_saturation_pct: float
    drainage_discharge_m3s: float
    predicted_inundation_km2: float
    predicted_depth_m: float
    depth_range_label: str  # e.g. "0.3m - 0.8m"
    risk_category: StatusLevel
    population_density_sqkm: int
    critical_infrastructure_count: int
    prediction_reliability: str
    last_updated: str

class FeatureAttribution(BaseModel):
    feature_name: str
    feature_value: str
    contribution_score: float  # Positive = raises risk, Negative = lowers risk
    attribution_percentage: float
    impact_direction: str      # "INCREASING_RISK" or "REDUCING_RISK"
    physical_meaning: str

class ExplainabilityReport(BaseModel):
    target_prediction_type: str
    location: str
    base_value: float
    predicted_value: float
    feature_attributions: List[FeatureAttribution]
    methodology: str  # "SHAP (TreeExplainer & Kernel Approximation)"
    scientific_disclaimer: str

class ReliabilityAssessment(BaseModel):
    location: str
    data_quality_score: float
    input_completeness_score: float
    observation_freshness_score: float
    forecast_agreement_score: float
    model_uncertainty_score: float
    spatial_consistency_score: float
    temporal_consistency_score: float
    overall_score: float
    overall_rating: str  # HIGH, MEDIUM, LOW
    factors_summary: List[str]
    disclaimer: str

class EarlyWarningAlert(BaseModel):
    alert_id: str
    warning_level: StatusLevel
    location: str
    region: str
    hazard: str
    expected_rainfall_mm: float
    expected_inundation_km2: float
    expected_depth_m: float
    expected_time_window: str
    lead_time_hours: float
    reliability: str
    reason: str
    data_sources: List[str]
    issued_at: str
    expires_at: str
    status: str  # "ACTIVE", "ACKNOWLEDGED", "EXPIRED", "CLOSED"
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[str] = None
    is_prototype_threshold: bool = True
    actionable_instructions: List[str]

class AuditRecord(BaseModel):
    id: str
    timestamp: str
    user_email: str
    user_role: str
    action: str  # "VIEW", "ACKNOWLEDGE", "ESCALATE", "CLOSE", "CONFIG_CHANGE"
    target_id: str
    details: str

class HistoricalEvent(BaseModel):
    event_id: str
    title: str
    date_str: str
    region: str
    peak_rainfall_mm: float
    maximum_inundation_km2: float
    warning_lead_time_hours: float
    prediction_error_pct: float
    status: str
    timeline_steps: List[Dict[str, Any]]
    validation_metrics: Dict[str, Any]
    summary_notes: str

class WarningThresholdConfig(BaseModel):
    watch_rainfall_1h_mm: float = 15.0
    alert_rainfall_1h_mm: float = 35.0
    severe_rainfall_1h_mm: float = 65.0
    critical_rainfall_1h_mm: float = 100.0
    watch_inundation_depth_m: float = 0.2
    alert_inundation_depth_m: float = 0.5
    severe_inundation_depth_m: float = 0.9
    critical_inundation_depth_m: float = 1.4
    is_prototype: bool = True
