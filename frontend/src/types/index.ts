export type RiskLevel = 'SAFE' | 'CAUTION' | 'DANGER';

export interface Subdivision {
  id: string;
  code: string;
  name: string;
  zone: string;
  lat: number;
  lon: number;
  coordinates: [number, number][];
  vulnerable_to: string[];
  is_affected_system: boolean;
  bust_probability: number;
  confidence_score: number;
  risk_level: RiskLevel;
  risk_color: string;
  error_prone: boolean;
  reliability_tag: string;
  expected_error_km: number;
  expected_error_precip_mm: number;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  category: string;
  critical_lead_times: number[];
  advisory: string;
  historical_analog: string;
}

export interface EvaluationSummary {
  total_regions: number;
  danger_count: number;
  caution_count: number;
  safe_count: number;
  avg_confidence: number;
  avg_bust_probability: number;
}

export interface ConfidenceMapResponse {
  scenario: Scenario;
  lead_time_days: number;
  summary: EvaluationSummary;
  subdivisions: Subdivision[];
  error_prone_hotspots: Subdivision[];
}

export interface FeatureContribution {
  feature_key: string;
  name: string;
  value: number;
  contribution: number;
  impact: 'INCREASES_BUST_RISK' | 'REDUCES_BUST_RISK';
  is_risk_driver: boolean;
  explanation: string;
}

export interface RegionExplanation {
  subdivision_name: string;
  lead_time_days: number;
  bust_probability: number;
  confidence_score: number;
  baseline_probability: number;
  lead_time_impact: number;
  feature_contributions: FeatureContribution[];
  top_drivers: string[];
  all_reasons: string[];
  operational_advisory: string;
  historical_analog: string;
}

export interface DayTrajectory {
  day: string;
  lead_time: number;
  bust_probability: number;
  confidence_score: number;
  risk_level: RiskLevel;
  risk_color: string;
  expected_error_km: number;
  expected_error_precip_mm: number;
}

export interface ExplainResponse {
  region: {
    id: string;
    code: string;
    name: string;
    zone: string;
    lat: number;
    lon: number;
    vulnerable_to: string[];
    is_affected: boolean;
  };
  evaluation: {
    lead_time_days: number;
    bust_probability: number;
    confidence_score: number;
    risk_level: RiskLevel;
    risk_color: string;
    error_prone: boolean;
    reliability_tag: string;
    expected_error_km: number;
    expected_error_precip_mm: number;
  };
  explanation: RegionExplanation;
  trajectory_10_days: DayTrajectory[];
}

export interface CustomEvaluatePayload {
  subdivision_id: string;
  lead_time_days: number;
  ensemble_spread: number;
  cape: number;
  vertical_wind_shear: number;
  vorticity_gradient: number;
  moisture_flux_convergence: number;
  baroclinic_growth_rate: number;
  climatological_anomaly: number;
}
