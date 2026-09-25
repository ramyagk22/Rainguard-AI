"""
Model Architecture, Provenance & AI Insights Router
"""

from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/api/models", tags=["Model Insights"])

@router.get("/info")
def get_model_info() -> Dict[str, Any]:
    return {
        "rainfall_model": {
            "model_name": "RainGuard-ConvRF Spatiotemporal Ensemble",
            "model_version": "v2.4.1-prod",
            "architecture_type": "Hybrid Spatiotemporal Convolutional Recurrent Network (ConvLSTM) coupled with Calibrated Random Forest Ensemble",
            "input_resolution": "1 km x 1 km spatial / 15-minute temporal step",
            "forecast_horizons": ["1 Hour (Nowcasting)", "3 Hours", "6 Hours", "12 Hours", "24 Hours (Synoptic Blend)"],
            "input_features": [
                "INSAT-3DR Thermal Infrared Brightness Temperature (10.8 µm)",
                "DWR S-Band Doppler Radar Reflectivity (dBZ) & Radial Velocity",
                "IMD Surface AWS Rain Gauge Telemetry (Tipping Bucket)",
                "Surface Barometric Pressure Deficit (hPa)",
                "Relative Humidity (%) & Convective Available Potential Energy (CAPE)",
                "Numerical Weather Prediction Guidance (ECMWF IFS / GFS 0.25°)"
            ],
            "training_dataset": "IMD Historical Radar & Gauge Archive (2014 - 2023, 180,000 spatial timesteps)",
            "validation_dataset": "Monsoon Seasons 2022 - 2023 (stratified extreme rain events)",
            "test_dataset": "Extreme Weather Benchmark (Dec 2015, Nov 2021, Cyclone Michaung Dec 2023)",
            "inference_latency_ms": 145,
            "last_inference_timestamp": "2026-09-24T17:15:00Z",
            "known_limitations": [
                "Radar beam blockage in distant mountainous western terrain beyond 200 km radial limit.",
                "Parallax displacement in geostationary satellite imagery during rapid convective cloud shear.",
                "Uncertainty increases for forecast horizons beyond 12 hours without updated NWP cycle initialization."
            ]
        },
        "inundation_model": {
            "model_name": "RainGuard-Hydro2D Kinematic Runoff Engine",
            "model_version": "v1.8.3",
            "architecture_type": "Physics-Guided 2D Shallow Water Approximation & SCS-CN Runoff Hypsometry",
            "input_resolution": "5m DEM elevation grid with sub-catchment micro-drainage polygons",
            "input_features": [
                "High-Resolution LiDAR / SRTM Digital Elevation Model (DEM)",
                "Catchment Hydraulic Slope Gradient (%)",
                "Soil Moisture Saturation Index (Antecedent Precipitation Index API)",
                "Municipal Stormwater Micro-Drainage Culvert Capacity (m³/s)",
                "River Stage Level relative to Bridge Pier Danger Marks (m)"
            ],
            "validation_dataset": "Survey of India Flood Extent Polygons (Chennai Metropolitan Area)",
            "inference_latency_ms": 82,
            "last_inference_timestamp": "2026-09-24T17:15:00Z",
            "known_limitations": [
                "Unmapped localized solid waste blockages in municipal storm drains may cause localized ponding.",
                "Tidal surge backwater assumes standard astronomical tide tables unless ocean surge telemetry is active."
            ]
        }
    }
