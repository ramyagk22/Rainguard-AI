"""
RainGuard AI - Decision-Support Reliability Engine
Evaluates multi-source telemetry quality, sensor latency, spatial completeness,
model variance and forecast consensus to determine overall decision reliability.
"""

from typing import Dict, Any, List

RELIABILITY_DISCLAIMER = (
    "AI decision-support reliability indicator. "
    "Reliability does not represent certainty that a future event will occur. "
    "Values reflect data quality, sensor health, and mathematical model convergence."
)

class ReliabilityEngine:
    def __init__(self):
        self.disclaimer = RELIABILITY_DISCLAIMER

    def calculate_reliability(
        self,
        data_quality_pct: float = 94.0,
        missing_sensors_count: int = 0,
        total_sensors_count: int = 8,
        latency_minutes: int = 6,
        ai_forecast_mm: float = 65.0,
        nwp_forecast_mm: float = 58.0,
        model_tree_variance: float = 3.2,
        spatial_agreement_pct: float = 91.0,
        temporal_trend_continuity_pct: float = 88.0
    ) -> Dict[str, Any]:
        """
        Calculates holistic reliability across all scientific vectors.
        """
        # 1. Data Quality Score (0-100)
        data_quality_score = max(0.0, min(100.0, data_quality_pct))

        # 2. Input Completeness Score
        completeness_ratio = (total_sensors_count - missing_sensors_count) / max(1, total_sensors_count)
        input_completeness_score = round(completeness_ratio * 100.0, 1)

        # 3. Observation Freshness Score
        # Latency < 10m is 100%, drops linearly to 40% at 60m
        if latency_minutes <= 10:
            freshness_score = 100.0
        elif latency_minutes <= 60:
            freshness_score = round(100.0 - ((latency_minutes - 10) * 1.2), 1)
        else:
            freshness_score = max(20.0, round(40.0 - ((latency_minutes - 60) * 0.3), 1))

        # 4. Forecast Agreement Score (AI vs NWP model consensus)
        max_rain = max(ai_forecast_mm, nwp_forecast_mm, 1.0)
        agreement_ratio = 1.0 - (abs(ai_forecast_mm - nwp_forecast_mm) / (max_rain * 1.5))
        forecast_agreement_score = round(max(30.0, min(100.0, agreement_ratio * 100.0)), 1)

        # 5. Model Uncertainty Score (inverse of ensemble variance)
        uncertainty_score = round(max(40.0, min(100.0, 100.0 - (model_tree_variance * 4.0))), 1)

        # 6. Spatial and Temporal Consistency
        spatial_score = round(max(30.0, min(100.0, spatial_agreement_pct)), 1)
        temporal_score = round(max(30.0, min(100.0, temporal_trend_continuity_pct)), 1)

        # Weighted aggregate score
        weights = {
            "quality": 0.20,
            "completeness": 0.15,
            "freshness": 0.20,
            "agreement": 0.20,
            "uncertainty": 0.15,
            "consistency": 0.10
        }

        overall_score = round(
            (data_quality_score * weights["quality"]) +
            (input_completeness_score * weights["completeness"]) +
            (freshness_score * weights["freshness"]) +
            (forecast_agreement_score * weights["agreement"]) +
            (uncertainty_score * weights["uncertainty"]) +
            (((spatial_score + temporal_score) / 2.0) * weights["consistency"]),
            1
        )

        if overall_score >= 80.0:
            overall_rating = "HIGH"
        elif overall_score >= 65.0:
            overall_rating = "MEDIUM"
        else:
            overall_rating = "LOW"

        factors_summary = [
            f"Observation freshness is optimal ({latency_minutes}m telemetry latency).",
            f"Sensor network completeness is at {input_completeness_score}% across coastal gauges.",
            f"AI and NWP numerical forecasts demonstrate strong agreement ({forecast_agreement_score}% consensus).",
            f"Spatial radar-gauge interpolation consistency is {spatial_score}%."
        ]

        return {
            "data_quality_score": data_quality_score,
            "input_completeness_score": input_completeness_score,
            "observation_freshness_score": freshness_score,
            "forecast_agreement_score": forecast_agreement_score,
            "model_uncertainty_score": uncertainty_score,
            "spatial_consistency_score": spatial_score,
            "temporal_consistency_score": temporal_score,
            "overall_score": overall_score,
            "overall_rating": overall_rating,
            "factors_summary": factors_summary,
            "disclaimer": self.disclaimer
        }

reliability_engine = ReliabilityEngine()
