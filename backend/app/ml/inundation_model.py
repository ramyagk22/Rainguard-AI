"""
RainGuard AI - AI Inundation & Hydrodynamic Risk Engine
Integrates:
- Predicted & Antecedent Rainfall (mm)
- High-Resolution Digital Elevation Model (DEM elevation in meters)
- Surface Slope (%)
- Soil Moisture Saturation Index (0.0 - 1.0)
- Urban Micro-Drainage Capacity (m3/s)
- River Stage Water Level (m above gauge datum)
"""

import math
from typing import Dict, Any

class InundationPredictionEngine:
    def __init__(self):
        self.model_version = "RainGuard-Hydro2D-v1.8"

    def predict_zone_inundation(
        self,
        rainfall_mm: float,
        dem_elevation_m: float,
        slope_pct: float,
        soil_saturation_pct: float,
        drainage_discharge_m3s: float,
        river_stage_m: float = 0.0,
        river_danger_level_m: float = 7.5,
        catchment_area_sqkm: float = 4.2
    ) -> Dict[str, Any]:
        """
        Physics-guided hydrological runoff depth & inundation risk calculation.
        """
        # 1. Effective rainfall using modified SCS-CN runoff curve
        # Higher soil saturation lowers infiltration capacity drastically
        cn_base = 82.0  # Urban / suburban mixed catchment
        cn_adjusted = min(98.0, cn_base + (soil_saturation_pct / 100.0) * 16.0)
        s_retention = (25400.0 / cn_adjusted) - 254.0
        initial_abstraction = 0.2 * s_retention

        if rainfall_mm > initial_abstraction:
            runoff_mm = ((rainfall_mm - initial_abstraction) ** 2) / (rainfall_mm - initial_abstraction + s_retention)
        else:
            runoff_mm = 0.0

        # 2. Local Topographic Accumulation Factor (DEM & Slope)
        # Low elevations (< 8m) and flat slopes (< 1.5%) experience high ponding
        slope_drainage_factor = max(0.2, min(2.5, 1.0 + (slope_pct * 0.4)))
        elevation_risk_factor = max(0.4, min(3.0, (14.0 - min(dem_elevation_m, 14.0)) / 4.0))

        # 3. Drainage capacity offset (urban culverts / storm drains)
        drainage_relief_mm = min(runoff_mm * 0.6, (drainage_discharge_m3s * 3.6) / catchment_area_sqkm)
        excess_ponding_mm = max(0.0, (runoff_mm - drainage_relief_mm) * elevation_risk_factor / slope_drainage_factor)

        # 4. River Stage Backwater Overtopping
        river_backwater_m = 0.0
        if river_stage_m > 0 and river_danger_level_m > 0:
            stage_excess = river_stage_m - river_danger_level_m
            if stage_excess > 0:
                river_backwater_m = stage_excess * 0.45

        # Total predicted depth in meters
        predicted_depth_m = round((excess_ponding_mm / 1000.0) + river_backwater_m, 2)
        
        # Inundation area extent (km2) based on catchment hypsometry
        depth_ratio = min(2.5, predicted_depth_m / 1.0)
        inundation_area_km2 = round(catchment_area_sqkm * min(0.92, (depth_ratio * 0.38)), 2)

        # Categorize Risk
        if predicted_depth_m < 0.15:
            risk_category = "NORMAL"
            depth_range_label = "< 0.15m (Minimal Ponding)"
        elif predicted_depth_m < 0.40:
            risk_category = "WATCH"
            depth_range_label = "0.15m - 0.40m (Minor Waterlogging)"
        elif predicted_depth_m < 0.80:
            risk_category = "ALERT"
            depth_range_label = "0.40m - 0.80m (Moderate Inundation)"
        elif predicted_depth_m < 1.30:
            risk_category = "SEVERE"
            depth_range_label = "0.80m - 1.30m (Severe Inundation)"
        else:
            risk_category = "CRITICAL"
            depth_range_label = "> 1.30m (Critical Submersion)"

        # Reliability based on physical constraints
        reliability_score = round(max(62.0, min(95.0, 92.0 - (slope_pct * 1.5) - abs(dem_elevation_m - 6.0) * 1.2)), 1)
        reliability_level = "HIGH" if reliability_score >= 80 else ("MEDIUM" if reliability_score >= 65 else "LOW")

        return {
            "predicted_depth_m": predicted_depth_m,
            "depth_range_label": depth_range_label,
            "predicted_inundation_km2": inundation_area_km2,
            "risk_category": risk_category,
            "runoff_mm": round(runoff_mm, 1),
            "effective_ponding_mm": round(excess_ponding_mm, 1),
            "river_backwater_m": round(river_backwater_m, 2),
            "dem_elevation_m": dem_elevation_m,
            "slope_pct": slope_pct,
            "soil_saturation_pct": soil_saturation_pct,
            "drainage_discharge_m3s": drainage_discharge_m3s,
            "prediction_reliability": reliability_level,
            "reliability_score_pct": reliability_score,
            "model_version": self.model_version
        }

inundation_engine = InundationPredictionEngine()
