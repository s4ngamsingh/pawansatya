"""
Climate & Atmospheric Dynamics Engine
Synchronizes subdivision weather conditions (clouds, storms, rain, heatwave, snow, cyclone)
with real Indian climatology, lead-time evolution, and physical atmospheric drivers.
"""

from typing import Dict, Any

def compute_climate_phenotype(
    sub: Dict[str, Any],
    scenario_id: str,
    lead_time: int,
    drivers: Dict[str, float],
    eval_res: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Computes authentic meteorological conditions (phenotype, temperature, rainfall, wind, summary)
    for a subdivision at a specific forecast lead-time (Day 1-10).
    """
    sub_id = sub.get("id", "")
    elevation = float(sub.get("elevation_mean_m", 300))
    orographic_factor = float(sub.get("orographic_lift_factor", 0.35))
    zone = sub.get("zone", "")
    vulnerable_to = sub.get("vulnerable_to", [])
    is_affected = sub.get("is_affected_system", False)
    bust_prob = float(eval_res.get("bust_probability", 20.0))
    expected_precip_err = float(eval_res.get("expected_error_precip_mm", 10.0))
    cape = float(drivers.get("cape", 1500.0))
    mfc = float(drivers.get("moisture_flux_convergence", 0.5))

    # Base environmental lapse rate: ~6.5°C per 1000m
    base_temp = 32.0 - (elevation / 1000.0) * 6.5
    temp_c = round(base_temp, 1)
    rainfall_mm = 15.0
    wind_kmh = 18.0
    condition = "MODERATE_RAIN"
    summary = "Seasonal Climatological Flow"
    regime = "Normal Synoptic Flow"

    # =========================================================================
    # 1. BAY OF BENGAL MONSOON DEPRESSION
    # System moves WNW: Day 1-2 (Bay/Coast) -> Day 3-5 (Inland Odisha/MP/CG) -> Day 6-8 (West MP/Rajasthan) -> Day 9-10 (Dissipation)
    # =========================================================================
    if scenario_id == "monsoon_depression":
        coastal_core = ["sub_06", "sub_07", "sub_08", "sub_01"] # Gangetic WB, Odisha, Jharkhand, ANI
        inland_core = ["sub_19", "sub_20", "sub_26", "sub_27"]  # East MP, Chhattisgarh, Vidarbha, West MP
        tail_core = ["sub_17", "sub_18"]                        # East/West Rajasthan

        if lead_time in [1, 2]:
            if sub_id in coastal_core:
                condition = "HEAVY_STORM"
                rainfall_mm = round(85.0 + bust_prob * 0.8, 1)
                wind_kmh = round(52.0 + bust_prob * 0.25, 1)
                temp_c = round(27.5 - (elevation / 1000.0) * 4.0, 1)
                summary = f"Depression Landfall & Coastal Squall ({rainfall_mm}mm/24h)"
                regime = "Coastal Inflow Front"
            elif zone in ["South", "Northeast"]:
                condition = "MODERATE_RAIN"
                rainfall_mm = round(25.0 + mfc * 30.0, 1)
                summary = f"Active Monsoon Surge ({rainfall_mm}mm/24h)"
            elif zone == "Northwest":
                condition = "MODERATE_HEAT"
                temp_c = round(38.5 + (10 - lead_time) * 0.4, 1)
                rainfall_mm = 0.0
                summary = f"Dry Pre-Monsoon Air ({temp_c}°C)"

        elif lead_time in [3, 4, 5]: # PEAK INLAND DELUGE
            if sub_id in inland_core or sub_id in coastal_core:
                condition = "HEAVY_STORM"
                rainfall_mm = round(125.0 + bust_prob * 1.2 + orographic_factor * 40.0, 1)
                wind_kmh = round(60.0 + bust_prob * 0.3, 1)
                temp_c = round(26.0 - (elevation / 1000.0) * 4.0, 1)
                summary = f"Deep Depression Deluge & High Bust Risk ({rainfall_mm}mm/24h)"
                regime = "Vortex Core Convergence"
            elif zone in ["South", "Northeast"]:
                condition = "MODERATE_RAIN"
                rainfall_mm = round(35.0 + mfc * 30.0, 1)
                summary = f"Vigorous Monsoon Inflow ({rainfall_mm}mm/24h)"
            else:
                condition = "MODERATE_HEAT"
                temp_c = round(37.0 + (float(sub.get("lat", 20.0)) % 4), 1)
                rainfall_mm = 2.0
                summary = f"Partly Cloudy & Warm ({temp_c}°C)"

        elif lead_time in [6, 7, 8]: # PROPAGATION TO CENTRAL-WEST
            if sub_id in tail_core or sub_id in inland_core:
                condition = "HEAVY_STORM"
                rainfall_mm = round(75.0 + bust_prob * 0.9, 1)
                wind_kmh = round(45.0 + bust_prob * 0.2, 1)
                temp_c = round(28.0, 1)
                summary = f"Monsoon Low Remnant Rain ({rainfall_mm}mm/24h)"
                regime = "Weakening Low Pressure"
            elif sub_id in coastal_core:
                condition = "MODERATE_RAIN"
                rainfall_mm = round(25.0 + mfc * 15.0, 1)
                summary = f"Post-Depression Scattered Showers ({rainfall_mm}mm/24h)"
            else:
                condition = "MODERATE_HEAT"
                temp_c = round(38.0, 1)
                rainfall_mm = 0.0
                summary = f"Above Normal Temperatures ({temp_c}°C)"

        else: # DAY 9-10 DISSIPATION
            if zone in ["South", "Northeast", "Central"]:
                condition = "MODERATE_RAIN"
                rainfall_mm = round(15.0 + mfc * 15.0, 1)
                summary = f"Normal Monsoon Rains ({rainfall_mm}mm/24h)"
            else:
                condition = "MODERATE_HEAT"
                temp_c = round(38.5, 1)
                rainfall_mm = 0.0
                summary = f"Dry Fair Weather ({temp_c}°C)"

    # =========================================================================
    # 2. VERY SEVERE TROPICAL CYCLONE (RAPID INTENSIFICATION)
    # Day 1-2 (Depression over Sea) -> Day 3-5 (RI Landfall Storm) -> Day 6-8 (Inland Rain) -> Day 9-10 (Dissipation)
    # =========================================================================
    elif scenario_id == "cyclone_severe":
        cyclone_path = ["sub_21", "sub_22", "sub_23", "sub_28", "sub_07", "sub_31"] # Gujarat, Konkan, Coastal AP, Odisha, TN

        if lead_time in [1, 2]:
            if sub_id in cyclone_path:
                condition = "MODERATE_RAIN"
                rainfall_mm = round(40.0 + mfc * 30.0, 1)
                wind_kmh = round(55.0 + mfc * 25.0, 1)
                summary = f"Outer Cyclonic Bands ({wind_kmh} km/h winds)"
                regime = "Tropical Squall Inflow"
            else:
                condition = "MODERATE_HEAT"
                temp_c = round(35.0, 1)
                summary = f"Pre-Cyclone Subsidence ({temp_c}°C)"

        elif lead_time in [3, 4, 5]: # RAPID INTENSIFICATION & LANDFALL
            if sub_id in cyclone_path or is_affected:
                condition = "CYCLONE_VORTEX"
                rainfall_mm = round(175.0 + bust_prob * 1.5, 1)
                wind_kmh = round(125.0 + bust_prob * 0.7, 1)
                temp_c = round(25.0, 1)
                summary = f"Catastrophic Cyclone Squall ({wind_kmh} km/h, {rainfall_mm}mm/24h)"
                regime = "Severe Vortex Eye Wall"
            elif zone in ["South", "East", "Northeast"]:
                condition = "HEAVY_STORM"
                rainfall_mm = round(85.0 + mfc * 40.0, 1)
                wind_kmh = round(65.0, 1)
                summary = f"Severe Inflow Gale & Storm ({rainfall_mm}mm/24h)"
                regime = "Peripheral Squall Zone"
            else:
                condition = "MODERATE_RAIN"
                rainfall_mm = round(20.0, 1)
                summary = f"Overcast with Light Rain ({rainfall_mm}mm/24h)"

        elif lead_time in [6, 7, 8]: # INLAND DECAY
            if is_affected or sub_id in cyclone_path:
                condition = "HEAVY_STORM"
                rainfall_mm = round(65.0 + mfc * 35.0, 1)
                wind_kmh = round(50.0, 1)
                summary = f"Post-Landfall Depression Rain ({rainfall_mm}mm/24h)"
                regime = "Decaying Cyclonic Low"
            else:
                condition = "MODERATE_RAIN"
                rainfall_mm = round(15.0, 1)
                summary = f"Scattered Rain ({rainfall_mm}mm/24h)"

        else: # DAY 9-10
            condition = "MODERATE_RAIN" if zone in ["South", "Northeast"] else "MODERATE_HEAT"
            rainfall_mm = 12.0 if condition == "MODERATE_RAIN" else 0.0
            summary = "Seasonal Climatology Restored"

    # =========================================================================
    # 3. PRE-MONSOON SEVERE HEATWAVE
    # Day 1-2 (Onset) -> Day 3-7 (Peak Heat Dome 45-49°C) -> Day 8-10 (Isolated Thunderstorms/Dust Storms)
    # =========================================================================
    elif scenario_id == "heat_wave":
        heat_core = ["sub_17", "sub_18", "sub_19", "sub_26", "sub_27", "sub_29", "sub_11", "sub_13"] # Rajasthan, MP, Vidarbha, Telangana, Punjab, Haryana

        if lead_time in [1, 2]:
            if sub_id in heat_core:
                condition = "HEAT_WAVE" if sub_id in ["sub_17", "sub_18"] else "MODERATE_HEAT"
                temp_c = round(43.5 + (0.5 if sub_id in ["sub_17", "sub_18"] else 0.0), 1)
                rainfall_mm = 0.0
                wind_kmh = 22.0
                summary = f"Heatwave Onset: Dry Westerlies ({temp_c}°C)"
                regime = "Thermal Low Formation"
            elif zone in ["South", "Northeast"]:
                condition = "MODERATE_RAIN"
                rainfall_mm = round(15.0 + mfc * 15.0, 1)
                summary = f"Localized Pre-Monsoon Showers ({temp_c}°C)"
            else:
                condition = "MODERATE_HEAT"
                temp_c = round(39.5, 1)
                rainfall_mm = 0.0
                summary = f"Above Normal Heat ({temp_c}°C)"

        elif lead_time in [3, 4, 5, 6, 7]: # PEAK SEVERE HEAT DOME
            if sub_id in heat_core or is_affected:
                condition = "HEAT_WAVE"
                temp_c = round(46.0 + (bust_prob * 0.04) + (0.8 if sub_id in ["sub_17", "sub_18"] else 0.0), 1)
                rainfall_mm = 0.0
                wind_kmh = 28.0
                summary = f"Severe Heatwave & Blistering Loo ({temp_c}°C & 0mm)"
                regime = "Intense Anticyclonic Heat Dome"
            elif zone in ["North", "West", "Central", "East"]:
                condition = "MODERATE_HEAT"
                temp_c = round(41.5 + (bust_prob * 0.02), 1)
                rainfall_mm = 0.0
                summary = f"Severe Heat Warning ({temp_c}°C)"
                regime = "Subsidence Heating"
            elif zone == "Northeast":
                condition = "HEAVY_STORM"
                rainfall_mm = round(55.0 + mfc * 30.0, 1)
                summary = f"Isolated Severe Convective Storms ({rainfall_mm}mm/24h)"
            else:
                condition = "MODERATE_RAIN"
                rainfall_mm = 10.0
                summary = f"Humid Coastal Heat with Showers ({temp_c}°C)"

        else: # DAY 8-10 SLIGHT MODERATION / DUST STORMS
            if sub_id in heat_core:
                condition = "MODERATE_HEAT"
                temp_c = round(42.5, 1)
                rainfall_mm = 0.0
                wind_kmh = 32.0
                summary = f"Dust Storm Activity & High Heat ({temp_c}°C)"
            else:
                condition = "MODERATE_RAIN" if zone in ["South", "Northeast"] else "MODERATE_HEAT"
                temp_c = round(38.0, 1)
                summary = f"Gradual Heat Relief ({temp_c}°C)"

    # =========================================================================
    # 4. INTENSE WESTERN DISTURBANCE & SUBTROPICAL JET
    # Day 1-2 (Approach) -> Day 3-5 (Peak Snow Blizzard & Plains Thunderstorms) -> Day 6-8 (Cold Wave) -> Day 9-10
    # =========================================================================
    elif scenario_id == "western_disturbance":
        alpine_wd = ["sub_12", "sub_14", "sub_15", "sub_16"] # HP, Uttarakhand, Ladakh, J&K
        plains_wd = ["sub_11", "sub_13", "sub_09"]            # Punjab, Haryana/Delhi, West UP

        if lead_time in [1, 2]:
            if sub_id in alpine_wd:
                condition = "SNOW_STORM"
                temp_c = round(1.0 - (elevation / 1000.0) * 3.5, 1)
                rainfall_mm = round(25.0 + orographic_factor * 20.0, 1)
                summary = f"Western Disturbance Snow Onset ({rainfall_mm}mm eq)"
                regime = "Trough Incursion"
            elif sub_id in plains_wd:
                condition = "MODERATE_RAIN"
                temp_c = round(22.0, 1)
                rainfall_mm = 15.0
                summary = f"Overcast with Light Showers ({rainfall_mm}mm)"
            else:
                condition = "MODERATE_HEAT" if zone in ["Central", "South"] else "MODERATE_RAIN"
                summary = f"Stable Synoptic Conditions ({temp_c}°C)"

        elif lead_time in [3, 4, 5]: # PEAK OROGRAPHIC BLIZZARD & DELUGE
            if sub_id in alpine_wd:
                condition = "SNOW_STORM"
                temp_c = round(-4.5 - (elevation / 1000.0) * 4.0, 1)
                rainfall_mm = round(65.0 + bust_prob * 0.8 + orographic_factor * 50.0, 1)
                wind_kmh = round(55.0 + bust_prob * 0.3, 1)
                summary = f"Severe Himalayan Blizzard & Cloudburst ({rainfall_mm}mm eq, {temp_c}°C)"
                regime = "Orographic Jet Interaction"
            elif sub_id in plains_wd or is_affected:
                condition = "HEAVY_STORM"
                temp_c = round(18.0 - (lead_time * 0.5), 1)
                rainfall_mm = round(55.0 + bust_prob * 0.7, 1)
                wind_kmh = round(45.0, 1)
                summary = f"Severe Thunderstorm & Hailstorm ({rainfall_mm}mm/24h)"
                regime = "Frontal Convective Squall"
            elif zone in ["South", "Northeast"]:
                condition = "MODERATE_RAIN"
                rainfall_mm = 15.0
                summary = f"Isolated Showers ({rainfall_mm}mm)"
            else:
                condition = "MODERATE_HEAT"
                temp_c = round(34.0, 1)
                summary = f"Warm Pre-Frontal Conditions ({temp_c}°C)"

        elif lead_time in [6, 7, 8]: # POST-FRONTAL COLD WAVE
            if sub_id in alpine_wd:
                condition = "SNOW_STORM"
                temp_c = round(-7.0, 1)
                rainfall_mm = 15.0
                summary = f"Sub-Zero Alpine Freeze ({temp_c}°C)"
            elif sub_id in plains_wd:
                condition = "MODERATE_HEAT"
                temp_c = round(14.5, 1)
                rainfall_mm = 0.0
                summary = f"Severe Post-WD Cold Wave ({temp_c}°C)"
            else:
                condition = "MODERATE_RAIN" if zone == "South" else "MODERATE_HEAT"
                summary = "Clearing Skies"

        else: # DAY 9-10
            condition = "MODERATE_RAIN" if zone in ["South", "Northeast"] else "MODERATE_HEAT"
            summary = "Fair Weather / Calm"

    # =========================================================================
    # 5. ACTIVE-TO-BREAK MONSOON TRANSITION
    # Day 1-2 (Trough shifting) -> Day 3-6 (Break: Foothills Deluge, Central India Dry) -> Day 7-10 (Revival)
    # =========================================================================
    elif scenario_id == "break_monsoon":
        foothills_ne = ["sub_02", "sub_03", "sub_05", "sub_09"] # Arunachal, Assam, Sub-Himalayan WB, West UP
        central_peninsular = ["sub_19", "sub_20", "sub_26", "sub_27", "sub_28", "sub_29"] # MP, CG, Vidarbha, AP, Telangana

        if lead_time in [3, 4, 5, 6]: # FULL BREAK MONSOON
            if sub_id in foothills_ne or zone == "Northeast":
                condition = "HEAVY_STORM"
                rainfall_mm = round(160.0 + bust_prob * 1.5 + orographic_factor * 60.0, 1)
                wind_kmh = round(48.0, 1)
                temp_c = round(25.0, 1)
                summary = f"Catastrophic Foothills & Brahmaputra Deluge ({rainfall_mm}mm/24h)"
                regime = "Foothills Trough Lock"
            elif sub_id in central_peninsular or zone in ["Central", "West"]:
                condition = "MODERATE_HEAT"
                temp_c = round(37.5 + (bust_prob * 0.03), 1)
                rainfall_mm = 0.0
                summary = f"Monsoon Break: Dry Spell & Agricultural Stress ({temp_c}°C)"
                regime = "Monsoon Trough Absence"
            elif zone == "South":
                condition = "MODERATE_RAIN"
                rainfall_mm = round(20.0 + mfc * 15.0, 1)
                summary = f"Isolated Coastal Showers ({rainfall_mm}mm)"
            else:
                condition = "MODERATE_HEAT"
                temp_c = round(38.0, 1)
                summary = f"Dry Fair Weather ({temp_c}°C)"

        elif lead_time in [1, 2]: # TRANSITION COMMENCING
            if zone == "Northeast":
                condition = "HEAVY_STORM"
                rainfall_mm = round(80.0, 1)
                summary = f"Pre-Break Intensification ({rainfall_mm}mm/24h)"
            else:
                condition = "MODERATE_RAIN"
                rainfall_mm = round(25.0, 1)
                summary = f"Monsoon Trough Shifting North ({rainfall_mm}mm)"

        else: # DAY 7-10 MONSOON REVIVAL
            if zone in ["Central", "South", "East", "Northeast"]:
                condition = "MODERATE_RAIN"
                rainfall_mm = round(30.0 + mfc * 25.0, 1)
                summary = f"Monsoon Revival: Rainfall Returning ({rainfall_mm}mm/24h)"
            else:
                condition = "MODERATE_HEAT"
                temp_c = round(36.5, 1)
                summary = f"Seasonal Transition ({temp_c}°C)"

    # =========================================================================
    # 6. NORMAL / FAIR WEATHER FLOW
    # =========================================================================
    else:
        if elevation > 1800:
            condition = "SNOW_STORM" if temp_c < 2.0 else "MODERATE_RAIN"
            summary = f"Alpine Mountain Weather ({temp_c}°C)"
        elif zone in ["Northeast", "South"]:
            condition = "MODERATE_RAIN"
            rainfall_mm = round(20.0 + mfc * 20.0, 1)
            summary = f"Scattered Climatological Rain ({rainfall_mm}mm/24h)"
        elif sub.get("vulnerable_to") and "Heatwaves" in sub.get("vulnerable_to"):
            condition = "MODERATE_HEAT"
            temp_c = round(38.5, 1)
            rainfall_mm = 0.0
            summary = f"Warm Seasonal Weather ({temp_c}°C)"
        else:
            condition = "MODERATE_RAIN" if mfc > 0.4 else "MODERATE_HEAT"
            summary = f"Fair Weather ({temp_c}°C)"

    return {
        "weather_condition": condition,
        "temperature_c": temp_c,
        "rainfall_mm": rainfall_mm,
        "wind_speed_kmh": wind_kmh,
        "weather_summary": summary,
        "climate_regime": regime
    }
