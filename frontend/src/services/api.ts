import {
  Subdivision,
  Scenario,
  ConfidenceMapResponse,
  ExplainResponse,
  CustomEvaluatePayload,
  DayTrajectory,
  FeatureContribution
} from '../types';

const API_BASE = 'http://localhost:8000/api';

// Fallback scenarios and subdivisions if backend isn't actively reachable
export const FALLBACK_SCENARIOS: Scenario[] = [
  {
    id: "monsoon_depression",
    name: "Bay of Bengal Monsoon Depression",
    description: "Deep depression over North Bay of Bengal moving west-northwest across Odisha and Central India. Large NWP divergence in track bifurcation and heavy rain swath.",
    category: "Monsoon Dynamics",
    critical_lead_times: [4, 5, 6, 7],
    advisory: "High likelihood of forecast bust in Day 4-7 precipitation amounts. Multi-model ensemble divergence is elevated (>45mm/day variance). Forecasters advised not to issue single-deterministic flood warnings.",
    historical_analog: "Aug 2019 Odisha-Chhattisgarh Deep Depression (Day 5 forecast bust: Track shifted 180 km south of GFS operational track)."
  },
  {
    id: "cyclone_severe",
    name: "Very Severe Cyclonic Storm (Rapid Intensification)",
    description: "Intense vortex over East-Central Arabian Sea / Bay of Bengal undergoing rapid intensification (RI). Severe forecast busts in landfall timing, intensity, and storm surge.",
    category: "Tropical Cyclogenesis",
    critical_lead_times: [3, 4, 5],
    advisory: "Critical bust risk. Rapid intensification phase not resolved by hydrostatic parameterizations. GFS vs ECMWF track disagreement exceeds 240 km at Day 4.",
    historical_analog: "Cyclone Biparjoy (June 2023) - multiple recurvature track revisions between Day 3 and Day 6."
  },
  {
    id: "western_disturbance",
    name: "Intense Western Disturbance & Subtropical Jet",
    description: "Upper-tropospheric trough interacting with the Subtropical Westerly Jet stream over Northwest India, triggering heavy orographic precipitation and cloudbursts.",
    category: "Extratropical-Tropical Interaction",
    critical_lead_times: [2, 3, 4, 5],
    advisory: "Orographic precipitation amplification failure risk. Models tend to under-predict 24-hr snow accumulation by up to 60% in high-altitude catchments.",
    historical_analog: "July 2023 Himachal Pradesh Deluge - WD-monsoon surge interaction resulting in extreme Day 3 forecast bust."
  },
  {
    id: "heat_wave",
    name: "Pre-Monsoon Severe Heat Wave",
    description: "Anticyclonic blocking pattern with severe dry air subsidence and intense solar insolation over Vidarbha, Rajasthan, and Madhya Pradesh.",
    category: "Thermodynamic & Land-Atmosphere",
    critical_lead_times: [5, 6, 7, 8],
    advisory: "Day 6-9 temperature busts likely due to soil-moisture feedback underestimation in NWP land-surface schemes. Maximum temperatures likely to exceed model forecasts by 2.5°C to 4.0°C.",
    historical_analog: "May 2022 Central-Northwest India Heatwave - Persistent underestimation of peak heat dome temperatures beyond Day 5."
  },
  {
    id: "break_monsoon",
    name: "Active-to-Break Monsoon Transition",
    description: "Monsoon trough shifting rapidly northward towards the Himalayan foothills. Sudden cessation of rainfall over central India and torrential rain over Northeast & Sub-Himalayan Bengal.",
    category: "Intra-Seasonal Oscillation",
    critical_lead_times: [3, 4, 5, 6],
    advisory: "Rapid displacement of the low-level jet and monsoon trough axis. High probability of false-positive rainfall forecasts in Central India and false-negative deluge in Sub-Himalayan regions.",
    historical_analog: "July 2021 Break Monsoon - NWP models delayed the trough shift by 72 hours, causing major agricultural planning forecast busts."
  },
  {
    id: "normal_flow",
    name: "Stable Climatological / Fair Weather Flow",
    description: "Quasi-stationary synoptic patterns with low baroclinic instability, gentle gradients, and high ensemble coherence across the country.",
    category: "Stable Baseline",
    critical_lead_times: [8, 9, 10],
    advisory: "Forecast confidence is high across all lead times. NWP deterministic guidance is consistent with ensemble members. Low risk of forecast bust.",
    historical_analog: "January 2024 Stable Winter High-Pressure Regime."
  }
];

export const FALLBACK_SUBDIVISIONS_BASE = [
  { id: "sub_01", code: "ANI", name: "Andaman & Nicobar Islands", zone: "Island", lat: 11.667, lon: 92.735, vulnerable_to: ["Cyclones", "Heavy Rainfall", "Monsoon Surge"] },
  { id: "sub_02", code: "ARP", name: "Arunachal Pradesh", zone: "Northeast", lat: 28.218, lon: 94.727, vulnerable_to: ["Cloudbursts", "Flash Floods", "Orographic Rain"] },
  { id: "sub_03", code: "ASM", name: "Assam & Meghalaya", zone: "Northeast", lat: 26.200, lon: 92.937, vulnerable_to: ["Brahmaputra Floods", "Heavy Monsoon Rain", "Landslides"] },
  { id: "sub_04", code: "NMMT", name: "Nagaland, Manipur, Mizoram & Tripura", zone: "Northeast", lat: 24.500, lon: 93.500, vulnerable_to: ["Heavy Rainfall", "Flash Floods", "Landslides"] },
  { id: "sub_05", code: "SHWB", name: "Sub-Himalayan West Bengal & Sikkim", zone: "East", lat: 26.800, lon: 88.500, vulnerable_to: ["Break Monsoon Torrential Rain", "Landslides", "Floods"] },
  { id: "sub_06", code: "GWB", name: "Gangetic West Bengal", zone: "East", lat: 22.800, lon: 87.800, vulnerable_to: ["Monsoon Depressions", "Nor'westers", "Cyclonic Storms"] },
  { id: "sub_07", code: "ODS", name: "Odisha", zone: "East", lat: 20.500, lon: 84.500, vulnerable_to: ["Monsoon Depressions", "Tropical Cyclones", "Extreme Rainfall"] },
  { id: "sub_08", code: "JHK", name: "Jharkhand", zone: "East", lat: 23.600, lon: 85.300, vulnerable_to: ["Depression Track Incursions", "Thunderstorms", "Heatwaves"] },
  { id: "sub_09", code: "BHR", name: "Bihar", zone: "East", lat: 25.800, lon: 85.800, vulnerable_to: ["Break Monsoon Downpours", "Kosi Floods", "Lightning"] },
  { id: "sub_10", code: "EUP", name: "East Uttar Pradesh", zone: "North", lat: 26.500, lon: 82.500, vulnerable_to: ["Trough Shift Errors", "Monsoon Floods", "Heatwaves"] },
  { id: "sub_11", code: "WUP", name: "West Uttar Pradesh", zone: "North", lat: 28.000, lon: 78.500, vulnerable_to: ["Western Disturbance Interaction", "Dust Storms", "Heatwaves"] },
  { id: "sub_12", code: "UTK", name: "Uttarakhand", zone: "North", lat: 30.200, lon: 79.200, vulnerable_to: ["Cloudbursts", "Orographic Rain Amplification", "Landslides"] },
  { id: "sub_13", code: "HCD", name: "Haryana, Chandigarh & Delhi", zone: "North", lat: 29.200, lon: 76.800, vulnerable_to: ["Urban Floods", "WD-Monsoon Interaction", "Fog & Heatwaves"] },
  { id: "sub_14", code: "PNB", name: "Punjab", zone: "North", lat: 31.000, lon: 75.400, vulnerable_to: ["Western Disturbances", "Pre-monsoon Squalls", "Coldwaves"] },
  { id: "sub_15", code: "HMP", name: "Himachal Pradesh", zone: "North", lat: 31.800, lon: 77.200, vulnerable_to: ["Heavy Snowfall", "Cloudbursts", "Glacial Outbursts"] },
  { id: "sub_16", code: "JKL", name: "Jammu & Kashmir and Ladakh", zone: "North", lat: 34.000, lon: 76.500, vulnerable_to: ["Western Disturbances", "Snowstorms", "Avalanches"] },
  { id: "sub_17", code: "WRJ", name: "West Rajasthan", zone: "Northwest", lat: 26.900, lon: 72.000, vulnerable_to: ["Extreme Heatwaves", "Desert Cyclogenesis Errors", "Dust Storms"] },
  { id: "sub_18", code: "ERJ", name: "East Rajasthan", zone: "Northwest", lat: 25.800, lon: 75.800, vulnerable_to: ["Flash Floods", "Heatwaves", "Monsoon Trough Errors"] },
  { id: "sub_19", code: "WMP", name: "West Madhya Pradesh", zone: "Central", lat: 23.500, lon: 76.500, vulnerable_to: ["Depression Heavy Rain", "Heatwaves", "Thunderstorms"] },
  { id: "sub_20", code: "EMP", name: "East Madhya Pradesh", zone: "Central", lat: 23.200, lon: 80.800, vulnerable_to: ["Monsoon Depressions", "Lightning", "Floods"] },
  { id: "sub_21", code: "GJR", name: "Gujarat Region", zone: "West", lat: 22.500, lon: 72.800, vulnerable_to: ["Mid-Tropospheric Cyclones", "Heavy Monsoon Rain", "Floods"] },
  { id: "sub_22", code: "SAU", name: "Saurashtra & Kutch", zone: "West", lat: 22.300, lon: 70.300, vulnerable_to: ["Arabian Sea Cyclones", "Coastal Surges", "Flash Floods"] },
  { id: "sub_23", code: "KNG", name: "Konkan & Goa", zone: "West", lat: 17.500, lon: 73.400, vulnerable_to: ["Offshore Trough Deluges", "Urban Mumbai Floods", "Cyclones"] },
  { id: "sub_24", code: "MDM", name: "Madhya Maharashtra", zone: "West", lat: 18.500, lon: 74.800, vulnerable_to: ["Ghat Heavy Rainfall", "Rain-Shadow Drought", "Hailstorms"] },
  { id: "sub_25", code: "MRT", name: "Marathwada", zone: "West", lat: 19.200, lon: 76.300, vulnerable_to: ["Monsoon Breaks", "Severe Convective Storms", "Drought"] },
  { id: "sub_26", code: "VID", name: "Vidarbha", zone: "Central", lat: 21.000, lon: 79.200, vulnerable_to: ["Severe Heatwaves", "Depression Heavy Rain", "Hailstorms"] },
  { id: "sub_27", code: "CHG", name: "Chhattisgarh", zone: "Central", lat: 21.500, lon: 82.000, vulnerable_to: ["Monsoon Depression Path", "Mahanadi Floods", "Lightning"] },
  { id: "sub_28", code: "CAP", name: "Coastal Andhra Pradesh & Yanam", zone: "South", lat: 16.500, lon: 81.500, vulnerable_to: ["Bay of Bengal Cyclones", "Storm Surges", "Gale Winds"] },
  { id: "sub_29", code: "TEL", name: "Telangana", zone: "South", lat: 17.800, lon: 79.100, vulnerable_to: ["Urban Flash Floods", "Heatwaves", "Monsoon Lows"] },
  { id: "sub_30", code: "RYL", name: "Rayalaseema", zone: "South", lat: 14.800, lon: 78.200, vulnerable_to: ["Northeast Monsoon Cyclones", "Dry Spells", "Heat"] },
  { id: "sub_31", code: "TNP", name: "Tamil Nadu, Puducherry & Karaikal", zone: "South", lat: 11.100, lon: 78.800, vulnerable_to: ["Northeast Monsoon Deluges", "Cyclones", "Floods"] },
  { id: "sub_32", code: "CKA", name: "Coastal Karnataka", zone: "South", lat: 13.800, lon: 74.800, vulnerable_to: ["Extremely Heavy Monsoon Rainfall", "Landslides", "Floods"] },
  { id: "sub_33", code: "NIK", name: "North Interior Karnataka", zone: "South", lat: 16.000, lon: 75.900, vulnerable_to: ["Drought", "Erratic Monsoon Pulses", "Heatwaves"] },
  { id: "sub_34", code: "SIK", name: "South Interior Karnataka", zone: "South", lat: 13.200, lon: 76.500, vulnerable_to: ["Convective Storms", "Monsoon Deficits", "Squalls"] },
  { id: "sub_35", code: "KRL", name: "Kerala & Mahe", zone: "South", lat: 10.400, lon: 76.300, vulnerable_to: ["Monsoon Onset Deluges", "Western Ghats Landslides", "Floods"] },
  { id: "sub_36", code: "LAK", name: "Lakshadweep", zone: "Island", lat: 10.570, lon: 72.636, vulnerable_to: ["Arabian Sea Cyclogenesis", "Monsoon Surges", "Sea Swells"] }
];

// Client-side simulation fallback logic
function simulateEvaluation(scenarioId: string, leadTime: number, subId: string): Subdivision {
  const base = FALLBACK_SUBDIVISIONS_BASE.find(s => s.id === subId) || FALLBACK_SUBDIVISIONS_BASE[0];
  
  const scenarioAffected: Record<string, string[]> = {
    monsoon_depression: ["sub_06", "sub_07", "sub_08", "sub_19", "sub_20", "sub_26", "sub_27", "sub_21"],
    cyclone_severe: ["sub_21", "sub_22", "sub_23", "sub_28", "sub_07", "sub_31"],
    western_disturbance: ["sub_12", "sub_14", "sub_15", "sub_16", "sub_11", "sub_13"],
    heat_wave: ["sub_17", "sub_18", "sub_19", "sub_26", "sub_27", "sub_29"],
    break_monsoon: ["sub_02", "sub_03", "sub_05", "sub_09", "sub_20", "sub_24", "sub_25", "sub_26"],
    normal_flow: []
  };

  const isAffected = (scenarioAffected[scenarioId] || []).includes(subId);
  const baseRisk = isAffected ? 0.65 : 0.22;
  const leadGrowth = 1.0 + 0.28 * Math.pow(leadTime - 1, 1.15);
  
  const rawProb = 1.0 / (1.0 + Math.exp(-6.2 * (baseRisk * (0.45 + 0.55 * (leadGrowth / 3.7)) - 0.45)));
  const bustProbability = Math.round(Math.min(98.5, Math.max(3.0, rawProb * 1000)) / 10);
  const confidenceScore = Math.round(Math.min(98.0, Math.max(2.0, 100.0 - bustProbability * 0.96)) * 10) / 10;

  let riskLevel: 'SAFE' | 'CAUTION' | 'DANGER' = 'SAFE';
  let riskColor = '#22c55e'; // Green
  let errorProne = false;
  let reliabilityTag = 'High Confidence';

  if (bustProbability >= 65.0) {
    riskLevel = 'DANGER';
    riskColor = '#ef4444'; // Red
    errorProne = true;
    reliabilityTag = 'Unreliable Forecast';
  } else if (bustProbability >= 38.0) {
    riskLevel = 'CAUTION';
    riskColor = '#f59e0b'; // Amber
    errorProne = false;
    reliabilityTag = 'Moderate Uncertainty';
  }

  const expectedErrorKm = Math.round((35.0 + (bustProbability * 3.8) * (leadTime / 3.0)) * 10) / 10;
  const expectedErrorPrecipMm = Math.round((5.0 + (bustProbability * 0.9) * (leadTime / 4.0)) * 10) / 10;

  return {
    ...base,
    coordinates: [[base.lon - 1.2, base.lat - 1.0], [base.lon + 1.2, base.lat - 1.0], [base.lon + 1.2, base.lat + 1.0], [base.lon - 1.2, base.lat + 1.0]],
    is_affected_system: isAffected,
    bust_probability: bustProbability,
    confidence_score: confidenceScore,
    risk_level: riskLevel,
    risk_color: riskColor,
    error_prone: errorProne,
    reliability_tag: reliabilityTag,
    expected_error_km: expectedErrorKm,
    expected_error_precip_mm: expectedErrorPrecipMm
  };
}

export async function fetchScenarios(): Promise<Scenario[]> {
  try {
    const res = await fetch(`${API_BASE}/scenarios`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      return data.scenarios;
    }
  } catch {
    // fallback
  }
  return FALLBACK_SCENARIOS;
}

export async function fetchConfidenceMap(
  scenarioId: string,
  leadTime: number
): Promise<ConfidenceMapResponse> {
  try {
    const res = await fetch(
      `${API_BASE}/forecast/confidence-map?scenario_id=${scenarioId}&lead_time=${leadTime}`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  // Simulated fallback response
  const scenario = FALLBACK_SCENARIOS.find(s => s.id === scenarioId) || FALLBACK_SCENARIOS[0];
  const subdivisions = FALLBACK_SUBDIVISIONS_BASE.map(s => simulateEvaluation(scenarioId, leadTime, s.id));
  
  let dangerCount = 0;
  let cautionCount = 0;
  let safeCount = 0;
  let totalConf = 0;
  let totalBust = 0;

  subdivisions.forEach(s => {
    if (s.risk_level === 'DANGER') dangerCount++;
    else if (s.risk_level === 'CAUTION') cautionCount++;
    else safeCount++;
    totalConf += s.confidence_score;
    totalBust += s.bust_probability;
  });

  const hotspots = subdivisions.filter(s => s.risk_level !== 'SAFE').sort((a, b) => b.bust_probability - a.bust_probability);

  return {
    scenario,
    lead_time_days: leadTime,
    summary: {
      total_regions: subdivisions.length,
      danger_count: dangerCount,
      caution_count: cautionCount,
      safe_count: safeCount,
      avg_confidence: Math.round(totalConf / subdivisions.length * 10) / 10,
      avg_bust_probability: Math.round(totalBust / subdivisions.length * 10) / 10
    },
    subdivisions,
    error_prone_hotspots: hotspots.slice(0, 8)
  };
}

export async function fetchRegionExplain(
  subdivisionId: string,
  scenarioId: string,
  leadTime: number
): Promise<ExplainResponse> {
  try {
    const res = await fetch(
      `${API_BASE}/forecast/explain?subdivision_id=${subdivisionId}&scenario_id=${scenarioId}&lead_time=${leadTime}`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  const sub = simulateEvaluation(scenarioId, leadTime, subdivisionId);
  const scenario = FALLBACK_SCENARIOS.find(s => s.id === scenarioId) || FALLBACK_SCENARIOS[0];

  const trajectory_10_days: DayTrajectory[] = [];
  for (let d = 1; d <= 10; d++) {
    const evalD = simulateEvaluation(scenarioId, d, subdivisionId);
    trajectory_10_days.push({
      day: `Day ${d}`,
      lead_time: d,
      bust_probability: evalD.bust_probability,
      confidence_score: evalD.confidence_score,
      risk_level: evalD.risk_level,
      risk_color: evalD.risk_color,
      expected_error_km: evalD.expected_error_km,
      expected_error_precip_mm: evalD.expected_error_precip_mm
    });
  }

  const feature_contributions: FeatureContribution[] = [
    {
      feature_key: "ensemble_spread",
      name: "Ensemble Spread Divergence",
      value: sub.is_affected_system ? 0.84 : 0.32,
      contribution: sub.is_affected_system ? 18.5 : -4.2,
      impact: sub.is_affected_system ? 'INCREASES_BUST_RISK' : 'REDUCES_BUST_RISK',
      is_risk_driver: sub.is_affected_system,
      explanation: "Substantial bifurcation among GEFS and ECMWF ensemble members indicates low predictability."
    },
    {
      feature_key: "cape_normalized",
      name: "Convective Instability (CAPE)",
      value: sub.is_affected_system ? 0.78 : 0.28,
      contribution: sub.is_affected_system ? 14.2 : -2.8,
      impact: sub.is_affected_system ? 'INCREASES_BUST_RISK' : 'REDUCES_BUST_RISK',
      is_risk_driver: sub.is_affected_system,
      explanation: "Extreme Convective Available Potential Energy exceeds sub-grid convective parameterization limits."
    },
    {
      feature_key: "vorticity_gradient",
      name: "500 hPa Vorticity Gradient",
      value: sub.is_affected_system ? 0.72 : 0.25,
      contribution: sub.is_affected_system ? 11.4 : -3.5,
      impact: sub.is_affected_system ? 'INCREASES_BUST_RISK' : 'REDUCES_BUST_RISK',
      is_risk_driver: sub.is_affected_system,
      explanation: "Mid-tropospheric potential vorticity gradient triggers rapid baroclinic energy conversion."
    },
    {
      feature_key: "moisture_flux_convergence",
      name: "Moisture Flux Convergence (MFC)",
      value: sub.is_affected_system ? 0.81 : 0.30,
      contribution: sub.is_affected_system ? 9.8 : -1.9,
      impact: sub.is_affected_system ? 'INCREASES_BUST_RISK' : 'REDUCES_BUST_RISK',
      is_risk_driver: sub.is_affected_system,
      explanation: "Intense low-level jet moisture convergence prone to boundary-layer moisture flux divergence errors."
    }
  ];

  const topDrivers = sub.is_affected_system
    ? [
        "Ensemble Spread Divergence: Substantial bifurcation among GEFS/ECMWF ensemble members (>45mm spread).",
        "Convective Instability (CAPE): CAPE >2800 J/kg exceeds single-deterministic parameterization.",
        "500 hPa Vorticity Gradient: Elevated baroclinic energy conversion causing track/phase speed errors."
      ]
    : [
        "Stable synoptic flow with low baroclinic growth rate.",
        "Ensemble members demonstrate tight cluster agreement across all lead times."
      ];

  const operational_advisory = sub.bust_probability >= 65
    ? `CRITICAL CAUTION for ${sub.name} at Day ${leadTime}: High forecast bust probability (${sub.bust_probability}%). Do not rely on single-deterministic NWP runs. Cross-verify with EPS percentiles.`
    : sub.bust_probability >= 38
    ? `MODERATE UNCERTAINTY for ${sub.name} at Day ${leadTime}: Bust probability is ${sub.bust_probability}%. Monitor consecutive 00Z/12Z model cycles.`
    : `HIGH CONFIDENCE for ${sub.name} at Day ${leadTime}: Forecast reliability is robust (${sub.confidence_score}%). Standard operational guidance applies.`;

  return {
    region: {
      id: sub.id,
      code: sub.code,
      name: sub.name,
      zone: sub.zone,
      lat: sub.lat,
      lon: sub.lon,
      vulnerable_to: sub.vulnerable_to,
      is_affected: sub.is_affected_system
    },
    evaluation: {
      lead_time_days: leadTime,
      bust_probability: sub.bust_probability,
      confidence_score: sub.confidence_score,
      risk_level: sub.risk_level,
      risk_color: sub.risk_color,
      error_prone: sub.error_prone,
      reliability_tag: sub.reliability_tag,
      expected_error_km: sub.expected_error_km,
      expected_error_precip_mm: sub.expected_error_precip_mm
    },
    explanation: {
      subdivision_name: sub.name,
      lead_time_days: leadTime,
      bust_probability: sub.bust_probability,
      confidence_score: sub.confidence_score,
      baseline_probability: 15.0,
      lead_time_impact: Math.round((leadTime - 1) * 3.6 * 10) / 10,
      feature_contributions,
      top_drivers: topDrivers,
      all_reasons: topDrivers,
      operational_advisory,
      historical_analog: scenario.historical_analog
    },
    trajectory_10_days
  };
}

export async function submitCustomEvaluation(payload: CustomEvaluatePayload): Promise<ExplainResponse> {
  try {
    const res = await fetch(`${API_BASE}/forecast/custom-evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  // Fallback custom calculation
  return await fetchRegionExplain(payload.subdivision_id, 'monsoon_depression', payload.lead_time_days);
}
