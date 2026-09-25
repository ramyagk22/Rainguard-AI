export type StatusLevel = 'NORMAL' | 'WATCH' | 'ALERT' | 'SEVERE' | 'CRITICAL';
export type QualityStatus = 'GOOD' | 'BORDERLINE' | 'INSUFFICIENT';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string;
}

export interface WeatherStation {
  station_id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  rainfall_1h_mm: number;
  rainfall_3h_mm: number;
  rainfall_24h_mm: number;
  temperature_c: number;
  relative_humidity_pct: number;
  wind_speed_kmh: number;
  wind_direction_deg: number;
  pressure_hpa: number;
  water_level_m?: number | null;
  river_danger_level_m?: number | null;
  data_quality: QualityStatus;
  last_updated: string;
  is_demo: boolean;
}

export interface DataSource {
  source_id: string;
  name: string;
  source_type: string;
  status: string;
  latest_timestamp: string;
  coverage_pct: number;
  latency_minutes: number;
  quality: QualityStatus;
  missing_data_pct: number;
  outlier_count: number;
  consistency_pct: number;
  model_or_sensor: string;
}

export interface InundationZone {
  zone_id: string;
  name: string;
  center_lat: number;
  center_lon: number;
  elevation_dem_m: number;
  slope_pct: number;
  soil_saturation_pct: number;
  drainage_discharge_m3s: number;
  predicted_inundation_km2: number;
  predicted_depth_m: number;
  depth_range_label: string;
  risk_category: StatusLevel;
  population_density_sqkm: number;
  critical_infrastructure_count: number;
  prediction_reliability: string;
  last_updated: string;
}

export interface EarlyWarningAlert {
  alert_id: string;
  warning_level: StatusLevel;
  location: string;
  region: string;
  hazard: string;
  expected_rainfall_mm: number;
  expected_inundation_km2: number;
  expected_depth_m: number;
  expected_time_window: string;
  lead_time_hours: number;
  reliability: string;
  reason: string;
  data_sources: string[];
  issued_at: string;
  expires_at: string;
  status: string;
  acknowledged_by?: string | null;
  acknowledged_at?: string | null;
  is_prototype_threshold: boolean;
  actionable_instructions: string[];
}

export interface FeatureAttribution {
  feature_name: string;
  feature_value: string;
  contribution_score: number;
  attribution_percentage: number;
  impact_direction: 'INCREASING_RISK' | 'REDUCING_RISK';
  physical_meaning: string;
}

export interface HistoricalEvent {
  event_id: string;
  title: string;
  date_str: string;
  region: string;
  peak_rainfall_mm: number;
  maximum_inundation_km2: number;
  warning_lead_time_hours: number;
  prediction_error_pct: number;
  status: string;
  timeline_steps: Array<{ time: string; phase: string; detail: string }>;
  validation_metrics: Record<string, number>;
  summary_notes: string;
}

export interface SituationReport {
  report_id: string;
  title: string;
  region: string;
  generated_at: string;
  hazard_level: string;
  risk_level: string;
  reliability: string;
  status: string;
  summary: string;
  author: string;
  executive_summary?: string;
  rainfall_analysis?: any;
  inundation_summary?: any;
  explainable_ai_attribution?: string[];
  actionable_early_warnings?: string[];
  responsible_ai_disclaimer?: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  user_email: string;
  user_role: string;
  action: string;
  target_id: string;
  details: string;
}
