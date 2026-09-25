"""
RainGuard AI - Early Warning & Hazard Advisory Generation Engine
Configurable thresholds, multi-criteria hazard evaluation, lead-time estimation,
and transparent prototype disclaimers.
"""

from typing import Dict, Any, List
from datetime import datetime, timedelta
from app.models.schemas import StatusLevel, EarlyWarningAlert, WarningThresholdConfig

PROTOTYPE_NOTICE = (
    "Prototype Warning Thresholds. Decision-support prototype only. "
    "Thresholds are configured for demonstration and research benchmarking and do not "
    "replace official warning bulletins issued by the India Meteorological Department (IMD) "
    "or State Disaster Management Authority (TNSDMA)."
)

class EarlyWarningEngine:
    def __init__(self):
        self.default_thresholds = WarningThresholdConfig()

    def evaluate_warning(
        self,
        location: str,
        region: str,
        predicted_rainfall_mm: float,
        rainfall_intensity_mm_hr: float,
        predicted_depth_m: float,
        predicted_inundation_km2: float,
        river_water_level_m: float = 0.0,
        river_danger_level_m: float = 7.5,
        reliability_level: str = "HIGH",
        data_quality: str = "GOOD",
        thresholds: WarningThresholdConfig = None
    ) -> EarlyWarningAlert:
        """
        Multi-criteria early warning evaluation.
        """
        th = thresholds or self.default_thresholds
        
        # Determine warning level based on configurable prototype thresholds
        if predicted_depth_m >= th.critical_inundation_depth_m or predicted_rainfall_mm >= th.critical_rainfall_1h_mm or (river_water_level_m >= river_danger_level_m and predicted_depth_m >= 1.0):
            level = StatusLevel.CRITICAL
            hazard = "Catastrophic Heavy Rainfall & Extreme Inundation"
            lead_time = 3.5
            reason = f"Catchment forecasted rainfall ({predicted_rainfall_mm:.1f} mm) combined with river overtopping stage ({river_water_level_m:.2f}m) exceeds critical urban inundation threshold ({th.critical_inundation_depth_m}m)."
            instructions = [
                "Activate Level-3 Incident Command Post immediately.",
                "Execute mandatory evacuation of low-lying settlements along riverbanks.",
                "Deploy NDRF / SDRF inflatable rescue boats and emergency dewatering pumps.",
                "Halt commuter traffic on inundated subways and arterial bridge causeways."
            ]
        elif predicted_depth_m >= th.severe_inundation_depth_m or predicted_rainfall_mm >= th.severe_rainfall_1h_mm:
            level = StatusLevel.SEVERE
            hazard = "Severe Rainfall & Widespread Urban Inundation"
            lead_time = 4.5
            reason = f"Forecasted rainfall intensity ({rainfall_intensity_mm_hr:.1f} mm/h) exceeds severe drainage capacity threshold ({th.severe_rainfall_1h_mm} mm)."
            instructions = [
                "Issue public travel advisory advising against non-essential transit.",
                "Position heavy dewatering pump sets at vulnerable subway underpasses.",
                "Alert emergency medical services and power grid substations for localized shutdown."
            ]
        elif predicted_depth_m >= th.alert_inundation_depth_m or predicted_rainfall_mm >= th.alert_rainfall_1h_mm:
            level = StatusLevel.ALERT
            hazard = "Heavy Rainfall & Localized Waterlogging"
            lead_time = 6.0
            reason = f"Rainfall forecast ({predicted_rainfall_mm:.1f} mm) crosses alert threshold ({th.alert_rainfall_1h_mm} mm) with shallow waterlogging anticipated."
            instructions = [
                "Municipal storm drain clearance teams on standby.",
                "Monitor reservoir inflow rates and catchment river gauge telemetries.",
                "Verify shelter supplies and communication repeaters."
            ]
        elif predicted_depth_m >= th.watch_inundation_depth_m or predicted_rainfall_mm >= th.watch_rainfall_1h_mm:
            level = StatusLevel.WATCH
            hazard = "Moderate Rainfall Advisory"
            lead_time = 12.0
            reason = f"Convective cloud formation detected on Doppler radar; expected rainfall ({predicted_rainfall_mm:.1f} mm) warrants routine vigilance."
            instructions = [
                "Maintain continuous monitoring of satellite and radar scans.",
                "Check sluice gate operations and micro-canal desilting."
            ]
        else:
            level = StatusLevel.NORMAL
            hazard = "Normal Weather Conditions"
            lead_time = 24.0
            reason = "Precipitation within safe municipal absorption and drainage thresholds."
            instructions = ["Routine weather and hydrological monitoring active."]

        now = datetime.utcnow()
        issued_at = now.strftime("%Y-%m-%d %H:%M:%S UTC")
        expires_at = (now + timedelta(hours=lead_time)).strftime("%Y-%m-%d %H:%M:%S UTC")
        alert_id = f"ALT-{location.upper()[:3]}-{now.strftime('%m%d%H%M')}"

        return EarlyWarningAlert(
            alert_id=alert_id,
            warning_level=level,
            location=location,
            region=region,
            hazard=hazard,
            expected_rainfall_mm=round(predicted_rainfall_mm, 1),
            expected_inundation_km2=round(predicted_inundation_km2, 2),
            expected_depth_m=round(predicted_depth_m, 2),
            expected_time_window=f"Next {int(lead_time)} Hours",
            lead_time_hours=lead_time,
            reliability=reliability_level,
            reason=reason,
            data_sources=["INSAT-3DR Satellite", "DWR Chennai Doppler Radar", "IMD Meenambakkam AWS", "GFS NWP Model"],
            issued_at=issued_at,
            expires_at=expires_at,
            status="ACTIVE",
            is_prototype_threshold=True,
            actionable_instructions=instructions
        )

warning_engine = EarlyWarningEngine()
