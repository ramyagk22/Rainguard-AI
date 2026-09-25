"""
RainGuard AI - Seed Data & Comprehensive Hydrometeorological Baseline
Populates realistic, high-fidelity datasets representing Tamil Nadu / Chennai coastal flood basins.
"""

from typing import Dict, List, Any
from app.database import get_collection
from app.models.schemas import StatusLevel, QualityStatus
import logging

logger = logging.getLogger("rainguard.seed")

DEMO_USERS = [
    {
        "id": "usr-1",
        "email": "operator@rainguard.ai",
        "password_hash": "demo123",  # For demo authentication
        "name": "Kavitha R.",
        "role": "Emergency Operator",
        "department": "State Emergency Operations Center (SEOC)",
        "badge": "EOC-OPS-402",
        "region": "Tamil Nadu Coastal Command"
    },
    {
        "id": "usr-2",
        "email": "analyst@rainguard.ai",
        "password_hash": "demo123",
        "name": "Dr. S. Sundaram",
        "role": "Weather Analyst",
        "department": "Meteorological & Hydrological Research Cell",
        "badge": "MET-RES-108",
        "region": "Regional Meteorological Center"
    },
    {
        "id": "usr-3",
        "email": "admin@rainguard.ai",
        "password_hash": "demo123",
        "name": "R. Anand Kumar",
        "role": "Administrator",
        "department": "Innovexa Disaster Intelligence Core",
        "badge": "SYS-ADM-001",
        "region": "Global Headquarters"
    }
]

DATA_SOURCES = [
    {
        "source_id": "src-sat-01",
        "name": "INSAT-3DR Geostationary Imager",
        "source_type": "SATELLITE",
        "status": "Connected",
        "latest_timestamp": "2026-09-24T17:05:00Z",
        "coverage_pct": 99.4,
        "latency_minutes": 8,
        "quality": "GOOD",
        "missing_data_pct": 0.6,
        "outlier_count": 2,
        "consistency_pct": 98.2,
        "model_or_sensor": "Multi-Spectral TIR / VIS Channels (1km res)"
    },
    {
        "source_id": "src-rad-01",
        "name": "DWR Chennai S-Band Doppler Radar",
        "source_type": "RADAR",
        "status": "Connected",
        "latest_timestamp": "2026-09-24T17:10:00Z",
        "coverage_pct": 97.8,
        "latency_minutes": 5,
        "quality": "GOOD",
        "missing_data_pct": 1.2,
        "outlier_count": 4,
        "consistency_pct": 96.5,
        "model_or_sensor": "S-Band Dual Polarimetric (250km radial)"
    },
    {
        "source_id": "src-grd-01",
        "name": "IMD & State AWS Rain Gauge Telemetry",
        "source_type": "GROUND OBSERVATIONS",
        "status": "Connected",
        "latest_timestamp": "2026-09-24T17:12:00Z",
        "coverage_pct": 94.2,
        "latency_minutes": 6,
        "quality": "GOOD",
        "missing_data_pct": 3.8,
        "outlier_count": 1,
        "consistency_pct": 95.1,
        "model_or_sensor": "Tipping Bucket Automatic Rain Gauges (18 stations)"
    },
    {
        "source_id": "src-nwp-01",
        "name": "NWP GFS & ECMWF High-Res Guidance",
        "source_type": "NWP",
        "status": "Connected",
        "latest_timestamp": "2026-09-24T12:00:00Z",
        "coverage_pct": 100.0,
        "latency_minutes": 45,
        "quality": "GOOD",
        "missing_data_pct": 0.0,
        "outlier_count": 0,
        "consistency_pct": 92.4,
        "model_or_sensor": "Global 0.125° ECMWF IFS / GFS 0.25° Assimilation"
    }
]

WEATHER_STATIONS = [
    {
        "station_id": "STA-CHN-001",
        "name": "Meenambakkam Airport AWS",
        "region": "Chennai South",
        "latitude": 12.9941,
        "longitude": 80.1709,
        "rainfall_1h_mm": 38.4,
        "rainfall_3h_mm": 84.2,
        "rainfall_24h_mm": 142.5,
        "temperature_c": 26.2,
        "relative_humidity_pct": 94.0,
        "wind_speed_kmh": 32.5,
        "wind_direction_deg": 65.0,
        "pressure_hpa": 1003.8,
        "water_level_m": 4.8,
        "river_danger_level_m": 7.0,
        "data_quality": "GOOD",
        "last_updated": "5 mins ago",
        "is_demo": True
    },
    {
        "station_id": "STA-CHN-002",
        "name": "Nungambakkam Central Observatory",
        "region": "Chennai Central",
        "latitude": 13.0595,
        "longitude": 80.2425,
        "rainfall_1h_mm": 24.6,
        "rainfall_3h_mm": 62.1,
        "rainfall_24h_mm": 98.4,
        "temperature_c": 26.8,
        "relative_humidity_pct": 91.0,
        "wind_speed_kmh": 28.0,
        "wind_direction_deg": 70.0,
        "pressure_hpa": 1004.2,
        "water_level_m": None,
        "river_danger_level_m": None,
        "data_quality": "GOOD",
        "last_updated": "8 mins ago",
        "is_demo": True
    },
    {
        "station_id": "STA-CHN-003",
        "name": "Velachery Urban Hydro Gauge",
        "region": "Velachery South Basin",
        "latitude": 12.9815,
        "longitude": 80.2180,
        "rainfall_1h_mm": 46.2,
        "rainfall_3h_mm": 108.5,
        "rainfall_24h_mm": 178.0,
        "temperature_c": 25.8,
        "relative_humidity_pct": 96.0,
        "wind_speed_kmh": 34.0,
        "wind_direction_deg": 60.0,
        "pressure_hpa": 1003.1,
        "water_level_m": 3.4,
        "river_danger_level_m": 3.8,
        "data_quality": "GOOD",
        "last_updated": "3 mins ago",
        "is_demo": True
    },
    {
        "station_id": "STA-CHN-004",
        "name": "Chembarambakkam Reservoir Telemetry",
        "region": "Kanchipuram Basin",
        "latitude": 13.0119,
        "longitude": 80.0575,
        "rainfall_1h_mm": 42.0,
        "rainfall_3h_mm": 96.0,
        "rainfall_24h_mm": 165.2,
        "temperature_c": 25.4,
        "relative_humidity_pct": 95.0,
        "wind_speed_kmh": 36.5,
        "wind_direction_deg": 75.0,
        "pressure_hpa": 1003.5,
        "water_level_m": 22.8,
        "river_danger_level_m": 24.0,
        "data_quality": "GOOD",
        "last_updated": "4 mins ago",
        "is_demo": True
    },
    {
        "station_id": "STA-CHN-005",
        "name": "Adyar Saidapet Bridge Hydro Station",
        "region": "Adyar River Corridor",
        "latitude": 13.0205,
        "longitude": 80.2225,
        "rainfall_1h_mm": 35.8,
        "rainfall_3h_mm": 79.4,
        "rainfall_24h_mm": 135.0,
        "temperature_c": 26.0,
        "relative_humidity_pct": 93.0,
        "wind_speed_kmh": 30.0,
        "wind_direction_deg": 65.0,
        "pressure_hpa": 1004.0,
        "water_level_m": 7.65,
        "river_danger_level_m": 7.50,
        "data_quality": "GOOD",
        "last_updated": "2 mins ago",
        "is_demo": True
    },
    {
        "station_id": "STA-CHN-006",
        "name": "Madhavaram Red Hills Station",
        "region": "North Chennai Basin",
        "latitude": 13.1488,
        "longitude": 80.2314,
        "rainfall_1h_mm": 28.5,
        "rainfall_3h_mm": 71.0,
        "rainfall_24h_mm": 112.0,
        "temperature_c": 26.5,
        "relative_humidity_pct": 92.0,
        "wind_speed_kmh": 27.5,
        "wind_direction_deg": 80.0,
        "pressure_hpa": 1004.5,
        "water_level_m": 5.2,
        "river_danger_level_m": 6.8,
        "data_quality": "GOOD",
        "last_updated": "7 mins ago",
        "is_demo": True
    },
    {
        "station_id": "STA-CHN-007",
        "name": "Ennore Creek Coastal Radar Link",
        "region": "Ennore Marine Boundary",
        "latitude": 13.2300,
        "longitude": 80.3200,
        "rainfall_1h_mm": 31.0,
        "rainfall_3h_mm": 74.5,
        "rainfall_24h_mm": 120.0,
        "temperature_c": 27.0,
        "relative_humidity_pct": 95.0,
        "wind_speed_kmh": 42.0,
        "wind_direction_deg": 55.0,
        "pressure_hpa": 1002.8,
        "water_level_m": 2.1,
        "river_danger_level_m": 2.5,
        "data_quality": "GOOD",
        "last_updated": "5 mins ago",
        "is_demo": True
    },
    {
        "station_id": "STA-TN-008",
        "name": "Cuddalore Coastal AWS",
        "region": "Cuddalore Port",
        "latitude": 11.7480,
        "longitude": 79.7714,
        "rainfall_1h_mm": 18.2,
        "rainfall_3h_mm": 45.0,
        "rainfall_24h_mm": 82.0,
        "temperature_c": 27.4,
        "relative_humidity_pct": 89.0,
        "wind_speed_kmh": 26.0,
        "wind_direction_deg": 90.0,
        "pressure_hpa": 1005.1,
        "water_level_m": None,
        "river_danger_level_m": None,
        "data_quality": "GOOD",
        "last_updated": "10 mins ago",
        "is_demo": True
    }
]

INUNDATION_ZONES = [
    {
        "zone_id": "ZN-VEL-01",
        "name": "Velachery South & Lake Marsh Bowl",
        "center_lat": 12.9815,
        "center_lon": 80.2180,
        "elevation_dem_m": 3.4,
        "slope_pct": 0.4,
        "soil_saturation_pct": 94.0,
        "drainage_discharge_m3s": 12.5,
        "predicted_inundation_km2": 4.85,
        "predicted_depth_m": 1.15,
        "depth_range_label": "0.80m - 1.30m (Severe Inundation)",
        "risk_category": "SEVERE",
        "population_density_sqkm": 14200,
        "critical_infrastructure_count": 6,
        "prediction_reliability": "HIGH",
        "last_updated": "Just now"
    },
    {
        "zone_id": "ZN-ADY-02",
        "name": "Saidapet Adyar River Corridor",
        "center_lat": 13.0205,
        "center_lon": 80.2225,
        "elevation_dem_m": 5.1,
        "slope_pct": 0.6,
        "soil_saturation_pct": 96.0,
        "drainage_discharge_m3s": 28.0,
        "predicted_inundation_km2": 3.60,
        "predicted_depth_m": 1.45,
        "depth_range_label": "> 1.30m (Critical Submersion)",
        "risk_category": "CRITICAL",
        "population_density_sqkm": 16800,
        "critical_infrastructure_count": 8,
        "prediction_reliability": "HIGH",
        "last_updated": "Just now"
    },
    {
        "zone_id": "ZN-TAM-03",
        "name": "Tambaram Mudichur Lowland Basin",
        "center_lat": 12.9249,
        "center_lon": 80.1000,
        "elevation_dem_m": 8.2,
        "slope_pct": 0.5,
        "soil_saturation_pct": 91.0,
        "drainage_discharge_m3s": 16.0,
        "predicted_inundation_km2": 6.20,
        "predicted_depth_m": 0.95,
        "depth_range_label": "0.80m - 1.30m (Severe Inundation)",
        "risk_category": "SEVERE",
        "population_density_sqkm": 11500,
        "critical_infrastructure_count": 5,
        "prediction_reliability": "HIGH",
        "last_updated": "Just now"
    },
    {
        "zone_id": "ZN-MAD-04",
        "name": "Madhavaram Retteri Urban Catchment",
        "center_lat": 13.1488,
        "center_lon": 80.2314,
        "elevation_dem_m": 7.0,
        "slope_pct": 0.8,
        "soil_saturation_pct": 86.0,
        "drainage_discharge_m3s": 18.5,
        "predicted_inundation_km2": 2.90,
        "predicted_depth_m": 0.65,
        "depth_range_label": "0.40m - 0.80m (Moderate Inundation)",
        "risk_category": "ALERT",
        "population_density_sqkm": 9400,
        "critical_infrastructure_count": 4,
        "prediction_reliability": "MEDIUM",
        "last_updated": "Just now"
    },
    {
        "zone_id": "ZN-ENN-05",
        "name": "Ennore Creek Industrial Lowland",
        "center_lat": 13.2300,
        "center_lon": 80.3200,
        "elevation_dem_m": 2.2,
        "slope_pct": 0.2,
        "soil_saturation_pct": 98.0,
        "drainage_discharge_m3s": 22.0,
        "predicted_inundation_km2": 5.40,
        "predicted_depth_m": 0.70,
        "depth_range_label": "0.40m - 0.80m (Moderate Inundation)",
        "risk_category": "ALERT",
        "population_density_sqkm": 4200,
        "critical_infrastructure_count": 7,
        "prediction_reliability": "HIGH",
        "last_updated": "Just now"
    },
    {
        "zone_id": "ZN-NUN-06",
        "name": "Nungambakkam Kodambakkam Storm Line",
        "center_lat": 13.0595,
        "center_lon": 80.2425,
        "elevation_dem_m": 9.5,
        "slope_pct": 1.2,
        "soil_saturation_pct": 78.0,
        "drainage_discharge_m3s": 32.0,
        "predicted_inundation_km2": 1.20,
        "predicted_depth_m": 0.28,
        "depth_range_label": "0.15m - 0.40m (Minor Waterlogging)",
        "risk_category": "WATCH",
        "population_density_sqkm": 19500,
        "critical_infrastructure_count": 12,
        "prediction_reliability": "HIGH",
        "last_updated": "Just now"
    }
]

CRITICAL_INFRASTRUCTURE = [
    {
        "id": "INF-HOSP-01",
        "name": "Rajiv Gandhi Government General Hospital (RGGGH)",
        "type": "Hospital",
        "latitude": 13.0818,
        "longitude": 80.2785,
        "status": "Operational / Safe Elevation",
        "elevation_m": 9.2,
        "potentially_affected": False
    },
    {
        "id": "INF-HOSP-02",
        "name": "MIOT International Super Specialty Hospital",
        "type": "Hospital",
        "latitude": 13.0185,
        "longitude": 80.1834,
        "status": "Potentially Affected (Adyar Basin)",
        "elevation_m": 5.4,
        "potentially_affected": True
    },
    {
        "id": "INF-SHEL-01",
        "name": "Saidapet Community Flood Relief Center",
        "type": "Shelter",
        "latitude": 13.0230,
        "longitude": 80.2260,
        "capacity_people": 1200,
        "current_occupancy": 340,
        "status": "Active & Staged",
        "elevation_m": 6.8,
        "potentially_affected": False
    },
    {
        "id": "INF-SHEL-02",
        "name": "Velachery Higher Secondary School Evacuation Shelter",
        "type": "Shelter",
        "latitude": 12.9770,
        "longitude": 80.2230,
        "capacity_people": 850,
        "current_occupancy": 120,
        "status": "Active & Staged",
        "elevation_m": 5.9,
        "potentially_affected": False
    },
    {
        "id": "INF-ROAD-01",
        "name": "Velachery 100-Feet Bypass Road Subway",
        "type": "Subway / Road",
        "latitude": 12.9840,
        "longitude": 80.2195,
        "status": "Waterlogged - Transit Closed",
        "elevation_m": 2.8,
        "potentially_affected": True
    },
    {
        "id": "INF-BRG-01",
        "name": "Maraimalai Adigal Bridge (Saidapet)",
        "type": "Bridge",
        "latitude": 13.0198,
        "longitude": 80.2215,
        "status": "Monitored - Stage Level High",
        "elevation_m": 8.0,
        "potentially_affected": True
    }
]

HISTORICAL_EVENTS = [
    {
        "event_id": "EVT-2015-12",
        "title": "Chennai Mega-Flood (Dec 2015)",
        "date_str": "Dec 01 - Dec 04, 2015",
        "region": "Chennai Metro & Kanchipuram Basin",
        "peak_rainfall_mm": 494.0,
        "maximum_inundation_km2": 182.5,
        "warning_lead_time_hours": 2.5,
        "prediction_error_pct": 18.4,
        "status": "Archived & Benchmarked",
        "summary_notes": "Extreme cloudburst caused by depression over Southwest Bay of Bengal. Synchronized release from Chembarambakkam reservoir led to severe Adyar bank breach.",
        "timeline_steps": [
            {"time": "06:00 UTC", "phase": "Rainfall Begins", "detail": "Moderate monsoonal showers initiated across coastal corridor (12 mm/h)."},
            {"time": "11:30 UTC", "phase": "Heavy Rainfall Detected", "detail": "DWR radar recorded continuous reflectivity > 52 dBZ. Convective cloud band stalled over city."},
            {"time": "14:00 UTC", "phase": "AI Model Prediction", "detail": "RainGuard prototype simulated 24h accumulation exceeding 450 mm."},
            {"time": "16:45 UTC", "phase": "Risk Rapidly Increases", "detail": "Soil saturation reached 100%; runoff coefficients peaked across concrete areas."},
            {"time": "18:00 UTC", "phase": "Early Warning Issued", "detail": "Critical Flood Bulletin dispatched to SEOC with 2.5 hour lead-time."},
            {"time": "20:30 UTC", "phase": "Inundation Observed", "detail": "Over 1.8m submergence recorded in Saidapet, Kotturpuram and Velachery."},
            {"time": "Dec 04", "phase": "Event Receding", "detail": "Depression crossed coast; emergency dewatering restored main transit."}
        ],
        "validation_metrics": {
            "rainfall_mae_mm": 18.2,
            "rainfall_rmse_mm": 24.6,
            "csi_critical_success_index": 0.84,
            "pod_probability_of_detection": 0.91,
            "far_false_alarm_rate": 0.12,
            "inundation_iou": 0.78,
            "inundation_f1_score": 0.86,
            "depth_mae_m": 0.18
        }
    },
    {
        "event_id": "EVT-2023-12",
        "title": "Severe Cyclonic Storm 'Michaung' (Dec 2023)",
        "date_str": "Dec 03 - Dec 05, 2023",
        "region": "Chennai, Tiruvallur & Chengalpattu",
        "peak_rainfall_mm": 450.0,
        "maximum_inundation_km2": 145.0,
        "warning_lead_time_hours": 5.5,
        "prediction_error_pct": 11.2,
        "status": "Archived & Benchmarked",
        "summary_notes": "Slow-moving tropical cyclone skirted close to Tamil Nadu coast, dumping relentless spiral rainbands for over 36 hours.",
        "timeline_steps": [
            {"time": "02:00 UTC", "phase": "Rainfall Begins", "detail": "Outer squall bands of Cyclone Michaung made landfall."},
            {"time": "07:00 UTC", "phase": "Heavy Rainfall Detected", "detail": "Persistent reflectivity cores 48-55 dBZ detected by Karaikal & Chennai DWR."},
            {"time": "09:30 UTC", "phase": "AI Model Prediction", "detail": "AI model nowcasted 380-440 mm accumulated rainfall over Velachery and Tambaram."},
            {"time": "11:00 UTC", "phase": "Risk Increases", "detail": "Adyar and Buckingham canal backwaters stalled due to astronomical high tide."},
            {"time": "12:30 UTC", "phase": "Warning Issued", "detail": "Level-4 CRITICAL Early Warning broadcasted 5.5 hours ahead of peak submersion."},
            {"time": "18:00 UTC", "phase": "Inundation Observed", "detail": "Extensive 1.2m depth recorded across Tambaram-Mudichur corridor."},
            {"time": "Dec 05", "phase": "Event Ends", "detail": "Cyclone tracked north toward Andhra Pradesh coast."}
        ],
        "validation_metrics": {
            "rainfall_mae_mm": 12.8,
            "rainfall_rmse_mm": 17.4,
            "csi_critical_success_index": 0.89,
            "pod_probability_of_detection": 0.94,
            "far_false_alarm_rate": 0.08,
            "inundation_iou": 0.83,
            "inundation_f1_score": 0.90,
            "depth_mae_m": 0.14
        }
    },
    {
        "event_id": "EVT-2021-11",
        "title": "Northeast Monsoon Depressional Surge (Nov 2021)",
        "date_str": "Nov 06 - Nov 08, 2021",
        "region": "North Chennai & Central Metro",
        "peak_rainfall_mm": 215.0,
        "maximum_inundation_km2": 68.0,
        "warning_lead_time_hours": 6.8,
        "prediction_error_pct": 9.5,
        "status": "Archived & Benchmarked",
        "summary_notes": "Overnight intense cloudburst with 140 mm falling in 4 hours. Low-lying Retteri and Madhavaram witnessed prolonged waterlogging.",
        "timeline_steps": [
            {"time": "18:00 UTC", "phase": "Rainfall Begins", "detail": "Convective storm cells developed over Bay of Bengal."},
            {"time": "21:00 UTC", "phase": "Heavy Rainfall Detected", "detail": "Rapid radar echoes intensified above 45 dBZ."},
            {"time": "22:15 UTC", "phase": "AI Model Prediction", "detail": "RainGuard predicted localized ponding in Madhavaram & T. Nagar."},
            {"time": "23:00 UTC", "phase": "Warning Issued", "detail": "ALERT warning issued with 6.8h lead time."},
            {"time": "03:30 UTC", "phase": "Inundation Observed", "detail": "Road subways submerged to 0.65m."},
            {"time": "Nov 08", "phase": "Event Ends", "detail": "Pumping operations completed."}
        ],
        "validation_metrics": {
            "rainfall_mae_mm": 9.4,
            "rainfall_rmse_mm": 13.1,
            "csi_critical_success_index": 0.91,
            "pod_probability_of_detection": 0.95,
            "far_false_alarm_rate": 0.07,
            "inundation_iou": 0.85,
            "inundation_f1_score": 0.92,
            "depth_mae_m": 0.11
        }
    }
]

INITIAL_ALERTS = [
    {
        "alert_id": "ALT-ADY-092401",
        "warning_level": "CRITICAL",
        "location": "Saidapet Adyar River Corridor",
        "region": "Chennai South",
        "hazard": "Catastrophic Heavy Rainfall & Overbank Flooding",
        "expected_rainfall_mm": 96.5,
        "expected_inundation_km2": 3.60,
        "expected_depth_m": 1.45,
        "expected_time_window": "Next 4 Hours",
        "lead_time_hours": 3.5,
        "reliability": "HIGH",
        "reason": "Catchment 3-hour rainfall (79.4mm) and Adyar stage level (7.65m) exceeded critical danger stage (7.50m). Chembarambakkam reservoir release pending.",
        "data_sources": ["DWR Chennai S-Band", "Saidapet Hydro Gauge STA-CHN-005", "INSAT-3DR TIR", "GFS NWP"],
        "issued_at": "2026-09-24 16:30:00 UTC",
        "expires_at": "2026-09-24 20:00:00 UTC",
        "status": "ACTIVE",
        "acknowledged_by": None,
        "acknowledged_at": None,
        "is_prototype_threshold": True,
        "actionable_instructions": [
            "Evacuate vulnerable riverbank slums along Jafferkhanpet and Saidapet causeway.",
            "Deploy SDRF rescue rafts at Maraimalai Adigal Bridge approaches.",
            "Divert traffic away from Anna Salai Saidapet subway.",
            "Isolate electrical distribution transformers in inundated basements."
        ]
    },
    {
        "alert_id": "ALT-VEL-092402",
        "warning_level": "SEVERE",
        "location": "Velachery South & Lake Marsh Bowl",
        "region": "Velachery South Basin",
        "hazard": "Severe Urban Inundation & Subway Flooding",
        "expected_rainfall_mm": 118.0,
        "expected_inundation_km2": 4.85,
        "expected_depth_m": 1.15,
        "expected_time_window": "Next 5 Hours",
        "lead_time_hours": 4.5,
        "reliability": "HIGH",
        "reason": "Micro-drainage capacity (12.5 m3/s) fully overwhelmed by 46.2 mm/h peak rain intensity over saturated marsh basin.",
        "data_sources": ["DWR Chennai Radar", "Velachery Hydro STA-CHN-003", "ECMWF Guidance"],
        "issued_at": "2026-09-24 16:45:00 UTC",
        "expires_at": "2026-09-24 21:15:00 UTC",
        "status": "ACTIVE",
        "acknowledged_by": None,
        "acknowledged_at": None,
        "is_prototype_threshold": True,
        "actionable_instructions": [
            "Operate 100HP high-capacity dewatering pump sets at Velachery bypass.",
            "Issue emergency SMS push notifications to ward 178-180 residents.",
            "Stage drinking water supplies at Velachery Higher Secondary School."
        ]
    },
    {
        "alert_id": "ALT-TAM-092403",
        "warning_level": "ALERT",
        "location": "Tambaram Mudichur Lowland Basin",
        "region": "Chengalpattu District",
        "hazard": "Heavy Rainfall & Localized Waterlogging",
        "expected_rainfall_mm": 74.0,
        "expected_inundation_km2": 6.20,
        "expected_depth_m": 0.95,
        "expected_time_window": "Next 6 Hours",
        "lead_time_hours": 6.0,
        "reliability": "HIGH",
        "reason": "Runoff accumulation from Adanur tank surplus approaching low-lying residential layouts.",
        "data_sources": ["Meenambakkam AWS", "INSAT-3DR", "State Hydro Network"],
        "issued_at": "2026-09-24 15:30:00 UTC",
        "expires_at": "2026-09-24 21:30:00 UTC",
        "status": "ACKNOWLEDGED",
        "acknowledged_by": "operator@rainguard.ai",
        "acknowledged_at": "2026-09-24 16:05:00 UTC",
        "is_prototype_threshold": True,
        "actionable_instructions": [
            "Deploy backhoe excavators to clear weeds from Mudichur surplus canal.",
            "Restrict heavy vehicle movement across flooded residential causeways."
        ]
    }
]

INITIAL_REPORTS = [
    {
        "report_id": "REP-2026-0924-01",
        "title": "Comprehensive Disaster Situation Briefing — Northeast Monsoon Active Surge",
        "region": "Greater Chennai & Coastal Coromandel",
        "generated_at": "2026-09-24 17:00:00 UTC",
        "hazard_level": "SEVERE",
        "risk_level": "HIGH",
        "reliability": "HIGH (88.4%)",
        "status": "Official Briefing Ready",
        "summary": "Meso-scale convective cloud clusters interacting with low-pressure trough over Southwest Bay of Bengal. Critical inundation projected along Saidapet Adyar corridor and Velachery South.",
        "author": "Dr. S. Sundaram (Weather Analyst) & RainGuard Automated Pipeline"
    },
    {
        "report_id": "REP-2026-0924-02",
        "title": "Hydrological Drainage Capacity & Reservoir Inflow Assessment",
        "region": "Chembarambakkam & Adyar Sub-Basin",
        "generated_at": "2026-09-24 14:30:00 UTC",
        "hazard_level": "ALERT",
        "risk_level": "MEDIUM",
        "reliability": "HIGH (91.2%)",
        "status": "Archived",
        "summary": "Reservoir water stage monitored at 22.8m (capacity 24.0m). Current discharge 1,500 cusecs with safety margin for 12 hours under forecasted rainfall.",
        "author": "Innovexa Automated Hydrology Monitor"
    }
]

AUDIT_LOGS = [
    {
        "id": "AUD-001",
        "timestamp": "2026-09-24 17:15:00 UTC",
        "user_email": "admin@rainguard.ai",
        "user_role": "Administrator",
        "action": "SYSTEM_STARTUP",
        "target_id": "SYS-CORE",
        "details": "RainGuard AI Engine v1.0.0 initialized with multi-source telemetry fusion pipeline."
    },
    {
        "id": "AUD-002",
        "timestamp": "2026-09-24 16:45:00 UTC",
        "user_email": "system@rainguard.ai",
        "user_role": "Automated Engine",
        "action": "WARNING_TRIGGER",
        "target_id": "ALT-VEL-092402",
        "details": "Severe flood alert automatically triggered for Velachery South based on 118mm forecast."
    },
    {
        "id": "AUD-003",
        "timestamp": "2026-09-24 16:05:00 UTC",
        "user_email": "operator@rainguard.ai",
        "user_role": "Emergency Operator",
        "action": "ACKNOWLEDGE",
        "target_id": "ALT-TAM-092403",
        "details": "Operator acknowledged Tambaram Mudichur alert and initiated municipal field coordination."
    }
]

def seed_initial_data():
    """
    Seeds initial datasets into the active database collections if empty.
    """
    coll_users = get_collection("users")
    if coll_users.count_documents() == 0:
        logger.info("Seeding initial users...")
        for u in DEMO_USERS:
            coll_users.insert_one(u)

    coll_sources = get_collection("data_sources")
    if coll_sources.count_documents() == 0:
        logger.info("Seeding data sources...")
        for s in DATA_SOURCES:
            coll_sources.insert_one(s)

    coll_stations = get_collection("observations")
    if coll_stations.count_documents() == 0:
        logger.info("Seeding weather stations & observations...")
        for st in WEATHER_STATIONS:
            coll_stations.insert_one(st)

    coll_inundation = get_collection("inundation_predictions")
    if coll_inundation.count_documents() == 0:
        logger.info("Seeding inundation zones...")
        for iz in INUNDATION_ZONES:
            coll_inundation.insert_one(iz)

    coll_infra = get_collection("critical_infrastructure")
    if coll_infra.count_documents() == 0:
        logger.info("Seeding critical infrastructure...")
        for inf in CRITICAL_INFRASTRUCTURE:
            coll_infra.insert_one(inf)

    coll_events = get_collection("historical_events")
    if coll_events.count_documents() == 0:
        logger.info("Seeding historical flood events...")
        for he in HISTORICAL_EVENTS:
            coll_events.insert_one(he)

    coll_alerts = get_collection("alerts")
    if coll_alerts.count_documents() == 0:
        logger.info("Seeding active early warning alerts...")
        for al in INITIAL_ALERTS:
            coll_alerts.insert_one(al)

    coll_reports = get_collection("reports")
    if coll_reports.count_documents() == 0:
        logger.info("Seeding situation reports...")
        for rp in INITIAL_REPORTS:
            coll_reports.insert_one(rp)

    coll_audits = get_collection("audit_logs")
    if coll_audits.count_documents() == 0:
        logger.info("Seeding initial audit logs...")
        for aud in AUDIT_LOGS:
            coll_audits.insert_one(aud)

    logger.info("Seed data initialization complete.")
