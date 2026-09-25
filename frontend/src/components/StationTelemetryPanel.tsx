import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Sun,
  CloudRain,
  CloudLightning,
  MapPin
} from 'lucide-react';
import type { Subdivision, Scenario } from '../types';

interface StationTelemetryPanelProps {
  selectedSubdivision: Subdivision | null;
  selectedScenario: Scenario | null;
  leadTime: number;
}

export const StationTelemetryPanel: React.FC<StationTelemetryPanelProps> = ({
  selectedSubdivision,
  selectedScenario,
  leadTime
}) => {
  const subName = selectedSubdivision?.name || 'Konkan & Goa (Mumbai)';
  const prob = selectedSubdivision?.bust_probability ?? 68;
  const isHighRisk = prob >= 65;
  const isModerateRisk = prob >= 40 && prob < 65;

  // Synthesize realistic regional coordinates based on subdivision
  const coords = selectedSubdivision
    ? `${(15 + (selectedSubdivision.id.length * 1.7) % 15).toFixed(1)}°N, ${(73 + (selectedSubdivision.id.length * 1.9) % 18).toFixed(1)}°E`
    : '18.9°N, 72.8°E';

  // 5-day outlook items
  const days = [
    { day: 'Today', icon: <Sun className="h-4 w-4 text-amber-600" />, cond: 'Partly', temp: '32/26°', isBust: false },
    { day: 'Day 2', icon: <CloudRain className="h-4 w-4 text-sky-600" />, cond: 'Rain', temp: '29/25°', isBust: false },
    { day: `Day ${leadTime}`, icon: <CloudLightning className="h-4 w-4 text-[#CC0000]" />, cond: 'Deluge+', temp: '27/24°', isBust: true },
    { day: 'Day 5', icon: <CloudRain className="h-4 w-4 text-sky-600" />, cond: 'Showers', temp: '30/25°', isBust: false },
    { day: 'Day 7', icon: <Sun className="h-4 w-4 text-amber-600" />, cond: 'Clear', temp: '33/27°', isBust: false }
  ];

  return (
    <div className="border-2 border-[#111111] bg-[#F9F9F7] p-4 space-y-4 hard-shadow-sm sharp-corners">
      
      {/* Top Header & Station Identity */}
      <div className="border-b border-[#111111] pb-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest">
            <span className="text-neutral-500 font-bold">SYNOPTIC STATION TELEMETRY</span>
            <span>&bull;</span>
            <span className="text-neutral-700 font-semibold">{selectedScenario?.category || 'SYNOPTIC'}</span>
            <span>&bull;</span>
            <span className={`px-1.5 py-0.2 font-bold ${isHighRisk ? 'bg-[#CC0000] text-white' : isModerateRisk ? 'bg-amber-500 text-black' : 'bg-emerald-600 text-white'}`}>
              {isHighRisk ? 'CRITICAL BUST BIAS' : isModerateRisk ? 'MODERATE SPREAD' : 'STABLE VERIF'}
            </span>
          </div>

          <h3 className="font-serif font-black text-base sm:text-lg text-[#111111] tracking-tight uppercase truncate mt-0.5">
            {subName}
          </h3>

          <div className="flex items-center space-x-1.5 text-[10px] font-mono text-neutral-600 mt-0.5">
            <MapPin className="h-3 w-3 text-[#CC0000]" />
            <span>DOMAIN COORDS: {coords} &bull; ELEVATION: 18m MSL</span>
          </div>
        </div>

        {/* Bust Risk Metric Badge */}
        <div className="text-right shrink-0 border border-[#111111] bg-white p-2">
          <span className="text-[9px] font-mono uppercase text-neutral-500 block">BUST RISK</span>
          <span className={`font-serif font-black text-xl leading-none block ${isHighRisk ? 'text-[#CC0000]' : isModerateRisk ? 'text-amber-600' : 'text-emerald-700'}`}>
            {prob}%
          </span>
          <span className="text-[8px] font-mono text-neutral-600 uppercase">
            {isHighRisk ? 'High Divergence' : isModerateRisk ? 'Moderate Spread' : 'Coherent'}
          </span>
        </div>
      </div>

      {/* 4-Cell Physical Atmospheric Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border border-[#111111] bg-white">
        
        {/* Cell 1: Temp */}
        <div className="p-2.5 border-r border-b sm:border-b-0 border-[#111111] space-y-0.5">
          <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 uppercase">
            <span>SURFACE TEMP</span>
            <Thermometer className="h-3 w-3 text-neutral-700" />
          </div>
          <div className="font-serif font-black text-lg text-[#111111]">
            31.2°C
          </div>
          <span className="text-[9px] font-mono text-emerald-700 block font-semibold">
            Normal (+0.4)
          </span>
        </div>

        {/* Cell 2: Humidity */}
        <div className="p-2.5 border-b sm:border-b-0 sm:border-r border-[#111111] space-y-0.5">
          <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 uppercase">
            <span>HUMIDITY (RH)</span>
            <Droplets className="h-3 w-3 text-sky-600" />
          </div>
          <div className="font-serif font-black text-lg text-[#111111]">
            74%
          </div>
          <span className="text-[9px] font-mono text-neutral-500 block">
            Moisture Flux High
          </span>
        </div>

        {/* Cell 3: Wind */}
        <div className="p-2.5 border-r border-[#111111] space-y-0.5">
          <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 uppercase">
            <span>SURFACE WIND</span>
            <Wind className="h-3 w-3 text-neutral-700" />
          </div>
          <div className="font-serif font-black text-lg text-[#111111]">
            16 km/h
          </div>
          <span className="text-[9px] font-mono text-neutral-600 block">
            WSW (245°)
          </span>
        </div>

        {/* Cell 4: Pressure */}
        <div className="p-2.5 space-y-0.5">
          <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 uppercase">
            <span>BAROMETRIC P</span>
            <Gauge className="h-3 w-3 text-neutral-700" />
          </div>
          <div className="font-serif font-black text-lg text-[#111111]">
            1008.4 hPa
          </div>
          <span className="text-[9px] font-mono text-[#CC0000] block font-semibold">
            12h: -2.8 hPa (Drop)
          </span>
        </div>

      </div>

      {/* 5-Day Forecast Outlook Strip with BUST Flag */}
      <div className="border border-[#111111] bg-white p-2.5 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-mono border-b border-neutral-200 pb-1">
          <span className="font-bold text-[#111111] uppercase">5-DAY SYNOPTIC OUTLOOK & BUST WINDOW</span>
          <span className="text-[9px] text-[#CC0000] font-bold uppercase tracking-wider">
            CRITICAL LEAD: DAY {leadTime}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1 pt-1">
          {days.map((item, idx) => (
            <div
              key={idx}
              className={`p-1.5 text-center flex flex-col items-center justify-between transition-colors ${
                item.isBust
                  ? 'border-2 border-[#CC0000] bg-red-50/60'
                  : 'border border-neutral-200 bg-[#F9F9F7] hover:bg-neutral-100'
              }`}
            >
              <span className="text-[9px] font-mono font-bold text-neutral-700 uppercase">
                {item.day}
              </span>
              <div className="my-1">
                {item.icon}
              </div>
              <span className="text-[9px] font-serif font-bold text-[#111111] block">
                {item.temp}
              </span>
              {item.isBust ? (
                <span className="mt-1 px-1 bg-[#CC0000] text-white text-[8px] font-mono font-bold uppercase tracking-tighter">
                  BUST?
                </span>
              ) : (
                <span className="mt-1 text-[8px] font-mono text-neutral-500 uppercase">
                  {item.cond}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 10-Day Plume Inflection & High Risk Window Sparkline */}
      <div className="border border-[#111111] bg-white p-3 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="font-bold text-[#111111] uppercase">
            10-DAY SPREAD INFLECTION & PLUME
          </span>
          <span className="text-[#CC0000] font-bold text-[9px] uppercase">
            &sigma; SPREAD: &plusmn;3.8°C
          </span>
        </div>

        {/* SVG Sparkline Curve with Shaded Bust Risk Zone */}
        <div className="relative h-16 w-full border border-neutral-200 bg-neutral-50/50 p-1">
          <svg className="w-full h-full" viewBox="0 0 300 60" preserveAspectRatio="none">
            {/* Shaded High Bust Risk Window (Days 4 to 7) */}
            <rect x="90" y="2" width="100" height="56" fill="rgba(204, 0, 0, 0.08)" stroke="rgba(204, 0, 0, 0.2)" strokeDasharray="2 2" />
            <text x="95" y="14" fill="#CC0000" fontSize="7" fontFamily="monospace" fontWeight="bold">
              HIGH BUST ZONE
            </text>

            {/* Precipitation Volume Bar Histogram */}
            <rect x="15" y="44" width="8" height="14" fill="#cbd5e1" />
            <rect x="45" y="38" width="8" height="20" fill="#94a3b8" />
            <rect x="75" y="32" width="8" height="26" fill="#64748b" />
            <rect x="105" y="16" width="8" height="42" fill="#ef4444" />
            <rect x="135" y="22" width="8" height="36" fill="#f87171" />
            <rect x="165" y="28" width="8" height="30" fill="#94a3b8" />
            <rect x="195" y="36" width="8" height="22" fill="#cbd5e1" />
            <rect x="225" y="42" width="8" height="16" fill="#e2e8f0" />
            <rect x="255" y="46" width="8" height="12" fill="#e2e8f0" />
            <rect x="280" y="48" width="8" height="10" fill="#e2e8f0" />

            {/* Mean Temperature Forecast Curve */}
            <path
              d="M 10 32 Q 50 30, 90 28 T 140 22 T 180 34 T 240 28 T 290 26"
              fill="none"
              stroke="#111111"
              strokeWidth="1.8"
            />

            {/* Upper & Lower Ensemble Spread Envelopes */}
            <path
              d="M 90 28 Q 140 12, 180 20 T 290 14"
              fill="none"
              stroke="#CC0000"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <path
              d="M 90 28 Q 140 40, 180 46 T 290 44"
              fill="none"
              stroke="#CC0000"
              strokeWidth="1"
              strokeDasharray="2 2"
            />

            {/* Inflection Point Marker */}
            <circle cx="120" cy="24" r="3" fill="#CC0000" />
            <line x1="120" y1="2" x2="120" y2="58" stroke="#CC0000" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 pt-0.5">
          <span>D+1 (Deterministic)</span>
          <span className="text-[#CC0000] font-bold">Bust Window (D+4 to D+7)</span>
          <span>D+10 (Climatology)</span>
        </div>
      </div>

    </div>
  );
};
