import React from 'react';
import { Subdivision, WeatherConditionType } from '../types';

interface WeatherGlyphProps {
  condition: WeatherConditionType;
  size?: number; // default 28px
  className?: string;
  showLabel?: boolean;
}

export interface WeatherConditionInfo {
  type: WeatherConditionType;
  title: string;
  subtitle: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
  glowColor: string;
}

export const WEATHER_CONDITIONS_META: Record<WeatherConditionType, WeatherConditionInfo> = {
  HEAT_WAVE: {
    type: 'HEAT_WAVE',
    title: 'HEAT WAVE',
    subtitle: 'Severe to Extreme Heat',
    badgeBg: '#dc2626', // Red
    badgeText: '#ffffff',
    icon: '☀️',
    glowColor: 'rgba(239, 68, 68, 0.6)'
  },
  MODERATE_HEAT: {
    type: 'MODERATE_HEAT',
    title: 'MODERATE HEAT',
    subtitle: 'Above Normal Temperatures',
    badgeBg: '#ea580c', // Orange
    badgeText: '#ffffff',
    icon: '⛅',
    glowColor: 'rgba(249, 115, 22, 0.5)'
  },
  MODERATE_RAIN: {
    type: 'MODERATE_RAIN',
    title: 'MODERATE RAINFALL',
    subtitle: 'Likely at Many Places',
    badgeBg: '#15803d', // Green
    badgeText: '#ffffff',
    icon: '🌧️',
    glowColor: 'rgba(34, 197, 94, 0.5)'
  },
  HEAVY_STORM: {
    type: 'HEAVY_STORM',
    title: 'HEAVY TO VERY HEAVY RAINFALL',
    subtitle: 'Thunderstorms & Flash Rain',
    badgeBg: '#1e3a8a', // Deep Navy Blue
    badgeText: '#ffffff',
    icon: '⛈️',
    glowColor: 'rgba(37, 99, 235, 0.7)'
  },
  SNOW_STORM: {
    type: 'SNOW_STORM',
    title: 'OROGRAPHIC SNOW / WD',
    subtitle: 'Himalayan Snow & Cloudburst',
    badgeBg: '#0284c7', // Sky Cyan
    badgeText: '#ffffff',
    icon: '❄️',
    glowColor: 'rgba(56, 189, 248, 0.6)'
  },
  CYCLONE_VORTEX: {
    type: 'CYCLONE_VORTEX',
    title: 'CYCLONIC STORM SQUALL',
    subtitle: 'High Sea Surge & Gale Winds',
    badgeBg: '#6b21a8', // Deep Purple
    badgeText: '#ffffff',
    icon: '🌀',
    glowColor: 'rgba(168, 85, 247, 0.7)'
  }
};

/**
 * Derives the active weather condition for a subdivision based on the current scenario
 * and regional meteorology/elevation characteristics.
 */
export function getWeatherConditionForSubdivision(
  sub: Subdivision,
  scenarioId?: string
): WeatherConditionType {
  // If backend climate dynamics engine already computed real condition, prioritize it!
  if (sub.weather_condition) {
    return sub.weather_condition;
  }

  const isHighAltitude = (sub.elevation_mean_m && sub.elevation_mean_m >= 1800) || sub.zone === 'North';

  // 1. Intense Western Disturbance scenario
  if (scenarioId === 'western_disturbance') {
    if (isHighAltitude || ['sub_12', 'sub_14', 'sub_15', 'sub_16'].includes(sub.id)) {
      return 'SNOW_STORM';
    }
    if (sub.is_affected_system || ['sub_11', 'sub_13'].includes(sub.id)) {
      return 'HEAVY_STORM';
    }
    if (['South', 'Northeast'].includes(sub.zone)) {
      return 'MODERATE_RAIN';
    }
    return 'MODERATE_HEAT';
  }

  // 2. Pre-monsoon Heatwave scenario
  if (scenarioId === 'heat_wave') {
    if (sub.is_affected_system || ['sub_17', 'sub_18', 'sub_19', 'sub_26', 'sub_27', 'sub_29'].includes(sub.id)) {
      return 'HEAT_WAVE';
    }
    if (['North', 'West', 'Central'].includes(sub.zone) || sub.vulnerable_to.includes('Heatwaves')) {
      return 'MODERATE_HEAT';
    }
    if (sub.zone === 'Northeast') {
      return 'HEAVY_STORM';
    }
    return 'MODERATE_RAIN';
  }

  // 3. Tropical Cyclone scenario
  if (scenarioId === 'cyclone_severe') {
    if (sub.is_affected_system || ['sub_21', 'sub_22', 'sub_23', 'sub_28', 'sub_07', 'sub_31'].includes(sub.id)) {
      return 'CYCLONE_VORTEX';
    }
    if (['South', 'East', 'Northeast'].includes(sub.zone)) {
      return 'HEAVY_STORM';
    }
    return 'MODERATE_RAIN';
  }

  // 4. Monsoon Depression scenario
  if (scenarioId === 'monsoon_depression') {
    if (sub.is_affected_system || ['sub_06', 'sub_07', 'sub_08', 'sub_20', 'sub_21'].includes(sub.id)) {
      return 'HEAVY_STORM';
    }
    if (['Northeast', 'South'].includes(sub.zone)) {
      return 'HEAVY_STORM';
    }
    if (['Central', 'East'].includes(sub.zone)) {
      return 'MODERATE_RAIN';
    }
    if (sub.zone === 'Northwest') {
      return 'MODERATE_HEAT';
    }
    return 'MODERATE_RAIN';
  }

  // 5. Break Monsoon scenario
  if (scenarioId === 'break_monsoon') {
    if (sub.zone === 'Northeast' || ['sub_02', 'sub_03', 'sub_05', 'sub_09'].includes(sub.id)) {
      return 'HEAVY_STORM';
    }
    if (sub.zone === 'South') {
      return 'MODERATE_RAIN';
    }
    return 'MODERATE_HEAT';
  }

  // 6. Default / Climatological baseline based on regional risk & vulnerability
  if (isHighAltitude && sub.risk_level === 'DANGER') {
    return 'SNOW_STORM';
  }
  if (sub.risk_level === 'DANGER') {
    if (sub.vulnerable_to.some((v) => v.toLowerCase().includes('heat'))) {
      return 'HEAT_WAVE';
    }
    return 'HEAVY_STORM';
  }
  if (sub.risk_level === 'CAUTION') {
    if (sub.vulnerable_to.some((v) => v.toLowerCase().includes('heat'))) {
      return 'MODERATE_HEAT';
    }
    return 'MODERATE_RAIN';
  }
  if (sub.vulnerable_to.some((v) => v.toLowerCase().includes('heat'))) {
    return 'MODERATE_HEAT';
  }
  return 'MODERATE_RAIN';
}

/**
 * Generates an SVG string representation of the weather glyph
 * formatted for injection into Leaflet L.divIcon or MapLibre Marker HTML.
 */
export function getWeatherGlyphHtml(
  condition: WeatherConditionType,
  size: number = 32,
  includeTooltip: boolean = true,
  subName?: string,
  sub?: Subdivision
): string {
  const meta = WEATHER_CONDITIONS_META[condition];

  let svgContent = '';

  switch (condition) {
    case 'HEAT_WAVE':
      // Glowing vibrant sun with animated heat rays
      svgContent = `
        <svg viewBox="0 0 36 36" width="${size}" height="${size}" class="weather-glyph-svg sun-pulse">
          <defs>
            <radialGradient id="sunGrad-${condition}" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="50%" stop-color="#f97316" />
              <stop offset="100%" stop-color="#dc2626" />
            </radialGradient>
            <filter id="sunGlow-${condition}" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <!-- Sun Rays -->
          <g stroke="#ea580c" stroke-width="2" stroke-linecap="round" opacity="0.85" class="sun-rays">
            <line x1="18" y1="3" x2="18" y2="7" />
            <line x1="18" y1="29" x2="18" y2="33" />
            <line x1="3" y1="18" x2="7" y2="18" />
            <line x1="29" y1="18" x2="33" y2="18" />
            <line x1="7.4" y1="7.4" x2="10.2" y2="10.2" />
            <line x1="25.8" y1="25.8" x2="28.6" y2="28.6" />
            <line x1="7.4" y1="28.6" x2="10.2" y2="25.8" />
            <line x1="25.8" y1="10.2" x2="28.6" y2="7.4" />
          </g>
          <!-- Sun Core -->
          <circle cx="18" cy="18" r="8" fill="url(#sunGrad-${condition})" filter="url(#sunGlow-${condition})" />
        </svg>
      `;
      break;

    case 'MODERATE_HEAT':
      // Sun behind white cumulus cloud
      svgContent = `
        <svg viewBox="0 0 36 36" width="${size}" height="${size}" class="weather-glyph-svg">
          <defs>
            <linearGradient id="cloudGradWhite" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#e2e8f0" />
            </linearGradient>
          </defs>
          <!-- Sun in Background -->
          <circle cx="23" cy="13" r="6" fill="#f59e0b" />
          <g stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round" opacity="0.8">
            <line x1="23" y1="4" x2="23" y2="6" />
            <line x1="30" y1="13" x2="32" y2="13" />
            <line x1="28" y1="8" x2="30" y2="6" />
          </g>
          <!-- Foreground Cloud -->
          <path d="M12 28 h14 a6 6 0 0 0 1 -11.9 a8 8 0 0 0 -15 -2.1 a5.5 5.5 0 0 0 -4 5 a5 5 0 0 0 4 9 z" 
                fill="url(#cloudGradWhite)" 
                stroke="#cbd5e1" 
                stroke-width="1"
                filter="drop-shadow(0 2px 3px rgba(0,0,0,0.25))" />
        </svg>
      `;
      break;

    case 'MODERATE_RAIN':
      // Puffy cloud with animated raindrops
      svgContent = `
        <svg viewBox="0 0 36 36" width="${size}" height="${size}" class="weather-glyph-svg">
          <defs>
            <linearGradient id="cloudGradRain" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#f8fafc" />
              <stop offset="100%" stop-color="#94a3b8" />
            </linearGradient>
          </defs>
          <!-- Cloud -->
          <path d="M10 21 h16 a6 6 0 0 0 1 -11.9 a7.5 7.5 0 0 0 -14 -2.1 a5 5 0 0 0 -4 5 a4.5 4.5 0 0 0 3 9 z" 
                fill="url(#cloudGradRain)" 
                stroke="#64748b" 
                stroke-width="1"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
          <!-- Raindrops (Animated) -->
          <g stroke="#0284c7" stroke-width="1.8" stroke-linecap="round" class="rain-drops">
            <line x1="12" y1="25" x2="10" y2="29" class="drop-1" />
            <line x1="18" y1="25" x2="16" y2="30" class="drop-2" />
            <line x1="24" y1="25" x2="22" y2="29" class="drop-3" />
          </g>
        </svg>
      `;
      break;

    case 'HEAVY_STORM':
      // Dark slate convective cloud with heavy raindrops and yellow lightning bolt
      svgContent = `
        <svg viewBox="0 0 36 36" width="${size}" height="${size}" class="weather-glyph-svg">
          <defs>
            <linearGradient id="cloudGradStorm" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#475569" />
              <stop offset="100%" stop-color="#1e293b" />
            </linearGradient>
            <filter id="lightningGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <!-- Dark Thundercloud -->
          <path d="M10 20 h17 a6 6 0 0 0 1 -11.9 a8 8 0 0 0 -15 -2.1 a5 5 0 0 0 -4 5 a4.5 4.5 0 0 0 3 9 z" 
                fill="url(#cloudGradStorm)" 
                stroke="#0f172a" 
                stroke-width="1.2"
                filter="drop-shadow(0 3px 5px rgba(0,0,0,0.45))" />
          <!-- Lightning Bolt -->
          <polygon points="17,17 14,24 18,24 15,31 22,22 18,22" 
                   fill="#fbbf24" 
                   stroke="#f59e0b" 
                   stroke-width="0.8"
                   filter="url(#lightningGlow)" 
                   class="lightning-flash" />
          <!-- Heavy Rain -->
          <g stroke="#38bdf8" stroke-width="2" stroke-linecap="round" class="rain-drops-heavy">
            <line x1="11" y1="24" x2="9" y2="30" class="drop-1" />
            <line x1="25" y1="24" x2="23" y2="30" class="drop-3" />
          </g>
        </svg>
      `;
      break;

    case 'SNOW_STORM':
      // Soft cyan-white cloud with snowflakes
      svgContent = `
        <svg viewBox="0 0 36 36" width="${size}" height="${size}" class="weather-glyph-svg">
          <defs>
            <linearGradient id="cloudGradSnow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#f0f9ff" />
              <stop offset="100%" stop-color="#bae6fd" />
            </linearGradient>
          </defs>
          <!-- Snow Cloud -->
          <path d="M10 21 h16 a6 6 0 0 0 1 -11.9 a7.5 7.5 0 0 0 -14 -2.1 a5 5 0 0 0 -4 5 a4.5 4.5 0 0 0 3 9 z" 
                fill="url(#cloudGradSnow)" 
                stroke="#38bdf8" 
                stroke-width="1"
                filter="drop-shadow(0 2px 4px rgba(2,132,199,0.3))" />
          <!-- Snowflakes -->
          <g fill="#0284c7" class="snow-flakes">
            <circle cx="12" cy="27" r="1.5" />
            <circle cx="18" cy="29" r="1.5" />
            <circle cx="24" cy="27" r="1.5" />
          </g>
        </svg>
      `;
      break;

    case 'CYCLONE_VORTEX':
      // Swirling purple/indigo vortex with spiral eye
      svgContent = `
        <svg viewBox="0 0 36 36" width="${size}" height="${size}" class="weather-glyph-svg cyclone-spin">
          <defs>
            <radialGradient id="cycloneGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#f3e8ff" />
              <stop offset="40%" stop-color="#a855f7" />
              <stop offset="100%" stop-color="#581c87" />
            </radialGradient>
          </defs>
          <g stroke="#9333ea" stroke-width="2" stroke-linecap="round" fill="none">
            <path d="M18 6 A12 12 0 0 1 30 18 A12 12 0 0 1 20 29" />
            <path d="M18 30 A12 12 0 0 1 6 18 A12 12 0 0 1 16 7" />
          </g>
          <circle cx="18" cy="18" r="5" fill="url(#cycloneGrad)" stroke="#ffffff" stroke-width="1.2" />
        </svg>
      `;
      break;
  }

  const tooltip = includeTooltip
    ? `
      <div class="weather-glyph-tooltip pointer-events-none absolute bottom-full mb-1.5 hidden group-hover:flex flex-col items-center z-50 whitespace-nowrap">
        <div class="bg-neutral-900/95 text-white text-[10px] font-sans px-2.5 py-1 rounded-md shadow-xl border border-neutral-700 backdrop-blur-md flex flex-col gap-0.5">
          <div class="flex items-center gap-1.5 font-semibold">
            <span>${meta.icon}</span>
            <span class="text-neutral-100">${meta.title}</span>
            ${subName ? `<span class="text-neutral-400 font-normal">&bull; ${subName}</span>` : ''}
          </div>
          ${sub?.weather_summary || sub?.temperature_c !== undefined ? `
            <div class="text-[9px] text-neutral-300 flex items-center gap-1.5 font-mono">
              ${sub?.temperature_c !== undefined ? `<span>${sub.temperature_c}&deg;C</span>` : ''}
              ${sub?.rainfall_mm !== undefined ? `<span>&bull; ${sub.rainfall_mm}mm/24h</span>` : ''}
              ${sub?.wind_speed_kmh !== undefined ? `<span>&bull; ${sub.wind_speed_kmh}km/h</span>` : ''}
            </div>
            ${sub?.weather_summary ? `<div class="text-[9px] text-sky-300 italic font-sans max-w-[200px] truncate">${sub.weather_summary}</div>` : ''}
          ` : ''}
        </div>
        <div class="w-1.5 h-1.5 bg-neutral-900 rotate-45 -mt-0.5 border-r border-b border-neutral-700"></div>
      </div>
    `
    : '';

  return `
    <div class="weather-glyph-container group relative inline-flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125" style="width: ${size}px; height: ${size}px;">
      ${svgContent}
      ${tooltip}
    </div>
  `;
}

/**
 * Standalone React component to render a weather glyph
 */
export const WeatherGlyph: React.FC<WeatherGlyphProps> = ({
  condition,
  size = 32,
  className = '',
  showLabel = false
}) => {
  const meta = WEATHER_CONDITIONS_META[condition];
  const html = getWeatherGlyphHtml(condition, size, false);

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {showLabel && (
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-bold text-neutral-900">{meta.title}</span>
          <span className="text-[10px] text-neutral-500">{meta.subtitle}</span>
        </div>
      )}
    </div>
  );
};

export default WeatherGlyph;
