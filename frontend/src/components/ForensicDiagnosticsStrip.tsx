import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { Scenario, Subdivision } from '../types';

interface ForensicDiagnosticsStripProps {
  scenario: Scenario | null;
  selectedSubdivision: Subdivision | null;
  leadTime: number;
  onOpenReportModal?: () => void;
  onOpenSimulatorModal?: () => void;
}

export const ForensicDiagnosticsStrip: React.FC<ForensicDiagnosticsStripProps> = ({
  scenario,
  selectedSubdivision,
  leadTime,
  onOpenReportModal,
  onOpenSimulatorModal
}) => {
  const subName = selectedSubdivision?.name || 'Konkan & Goa';
  const prob = selectedSubdivision?.bust_probability ?? 65;

  return (
    <div className="border-2 border-[#111111] bg-[#F9F9F7] p-3.5 space-y-3 hard-shadow-sm sharp-corners">
      
      {/* Title & Section Tag */}
      <div className="flex items-center justify-between border-b border-[#111111] pb-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#CC0000]" />
          <span className="font-serif font-black text-sm uppercase text-[#111111]">
            FORENSIC DIAGNOSTIC SUITE &bull; MULTI-MODEL DIVERGENCE DISPATCH
          </span>
        </div>
        <div className="text-[10px] font-mono text-neutral-600">
          DOMAIN BENCHMARK: <span className="font-bold text-[#111111]">{scenario?.name || 'Monsoon Depression'}</span> &bull; CRITICAL LEAD: <span className="text-[#CC0000] font-bold">D+{leadTime}</span>
        </div>
      </div>

      {/* 4 Diagnostic Broadsheet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Card 1: Ensemble Plume (ENS 51 Members) */}
        <div className="border border-[#111111] bg-white p-3 flex flex-col justify-between space-y-2 hover:bg-neutral-50/70 transition-colors">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-1">
              <span className="font-mono text-[10px] font-bold uppercase text-[#111111]">
                1. ENSEMBLE PLUME (ENS)
              </span>
              <span className="text-[9px] font-mono bg-neutral-100 border border-neutral-300 px-1 py-0.2 font-semibold">
                51 MEMBERS
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-neutral-600 truncate">{subName} Plume</span>
              <span className="text-[#CC0000] font-bold">Bust: {prob.toFixed(0)}% (&plusmn;3.8°C)</span>
            </div>

            {/* Sparkline Graphic */}
            <div className="relative h-20 w-full border border-neutral-200 bg-[#F9F9F7] p-1 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                {/* Ensemble Spread Fan */}
                <path d="M 10 32 Q 60 30, 90 28 T 190 14 L 190 48 Q 140 40, 90 28 Z" fill="rgba(14, 165, 233, 0.12)" />
                {/* Dotted Bifurcation Threshold */}
                <line x1="85" y1="2" x2="85" y2="58" stroke="#CC0000" strokeWidth="1" strokeDasharray="3 3" />
                <text x="90" y="12" fill="#CC0000" fontSize="6.5" fontFamily="monospace" fontWeight="bold">BUST INFLECTION</text>
                {/* Control Forecast Curve */}
                <path d="M 10 32 Q 50 30, 85 28 T 140 22 T 190 18" fill="none" stroke="#111111" strokeWidth="1.6" />
                {/* Outlier ensemble member */}
                <path d="M 85 28 Q 130 42, 190 46" fill="none" stroke="#CC0000" strokeWidth="1.2" strokeDasharray="2 2" />
                {/* Inflection Dot */}
                <circle cx="85" cy="28" r="2.5" fill="#CC0000" />
              </svg>
            </div>
          </div>

          <div className="pt-1.5 border-t border-neutral-200 flex items-center justify-between text-[9px] font-mono text-neutral-500">
            <span>Lead: D+0</span>
            <span className="text-[#CC0000] font-bold">D+{leadTime} Plume Spread</span>
            <span>D+10 Horizon</span>
          </div>
        </div>

        {/* Card 2: Model Track Divergence */}
        <div className="border border-[#111111] bg-white p-3 flex flex-col justify-between space-y-2 hover:bg-neutral-50/70 transition-colors">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-1">
              <span className="font-mono text-[10px] font-bold uppercase text-[#111111]">
                2. MODEL TRACK DIVERGENCE
              </span>
              <div className="flex items-center space-x-1 text-[8px] font-mono">
                <span className="bg-neutral-800 text-white px-1">HRES</span>
                <span className="bg-sky-600 text-white px-1">AIFS</span>
                <span className="bg-amber-600 text-white px-1">GFS</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-neutral-600">Displacement Error</span>
              <span className="text-[#CC0000] font-bold">&Delta; 140 km (+48h)</span>
            </div>

            {/* Track Divergence Diagram */}
            <div className="relative h-20 w-full border border-neutral-200 bg-[#F9F9F7] p-1 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 160 60">
                {/* Concentric Cone Rings */}
                <circle cx="100" cy="30" r="24" fill="none" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="2 2" />
                <circle cx="100" cy="30" r="14" fill="none" stroke="#94a3b8" strokeWidth="0.8" />
                <circle cx="100" cy="30" r="5" fill="none" stroke="#ef4444" strokeWidth="1.2" />
                {/* Coastline indication */}
                <path d="M 30 10 Q 50 35, 60 55" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2" />
                {/* HRES Track Path */}
                <path d="M 20 50 Q 60 38, 100 30" fill="none" stroke="#111111" strokeWidth="2" />
                {/* AIFS/GFS Divergent Track Path */}
                <path d="M 60 38 Q 80 20, 110 15" fill="none" stroke="#CC0000" strokeWidth="1.8" strokeDasharray="3 2" />
                <circle cx="110" cy="15" r="2.5" fill="#CC0000" />
                <text x="114" y="16" fill="#CC0000" fontSize="6" fontFamily="monospace" fontWeight="bold">Valid: T+72h</text>
              </svg>
            </div>
          </div>

          <div className="pt-1.5 border-t border-neutral-200 flex items-center justify-between text-[9px] font-mono">
            <span className="text-neutral-600">Spread Index: <strong className="text-[#CC0000]">HIGH</strong></span>
            <span className="text-neutral-500 truncate">Cause: Baroclinic Bifurcation</span>
          </div>
        </div>

        {/* Card 3: Regional Radar & In-Situ Observation */}
        <div className="border border-[#111111] bg-white p-3 flex flex-col justify-between space-y-2 hover:bg-neutral-50/70 transition-colors">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-1">
              <span className="font-mono text-[10px] font-bold uppercase text-[#111111]">
                3. REGIONAL RADAR & IN-SITU
              </span>
              <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-1 py-0.2 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" />
                <span>LIVE DOPPLER</span>
              </span>
            </div>

            {/* Radar Scope & In-Situ Side-by-Side */}
            <div className="grid grid-cols-12 gap-2 h-20 items-center">
              
              {/* Radar PPI Sweep Display */}
              <div className="col-span-5 h-full border border-neutral-300 bg-neutral-900 flex items-center justify-center relative overflow-hidden">
                {/* Concentric radar rings */}
                <div className="absolute inset-1 rounded-full border border-emerald-500/40" />
                <div className="absolute inset-3 rounded-full border border-emerald-500/30" />
                <div className="absolute inset-5 rounded-full border border-emerald-500/20" />
                {/* Center crosshair */}
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-emerald-500/30" />
                <div className="absolute inset-y-0 left-1/2 w-[1px] bg-emerald-500/30" />
                {/* Echo Blip */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-rose-500 rounded-full blur-[2px] opacity-80" />
                <div className="absolute top-3 right-3 w-4 h-4 bg-amber-400 rounded-full blur-[3px] opacity-60" />
                {/* Radar sweeping needle */}
                <div className="absolute top-1/2 left-1/2 w-8 h-[1.5px] bg-emerald-400 origin-left -rotate-45" />
                <span className="absolute bottom-0.5 left-1 text-[7px] font-mono text-emerald-400">IMD RADAR</span>
              </div>

              {/* Station Telemetry Bias Column */}
              <div className="col-span-7 text-[9px] font-mono space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Surface Obs:</span>
                  <span className="font-bold text-[#111111]">31.2°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Pressure:</span>
                  <span className="text-neutral-800">1008.4 hPa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">24h Precip:</span>
                  <span className="font-bold text-sky-700">14.2 mm</span>
                </div>
                <div className="flex justify-between text-[#CC0000]">
                  <span>Bias Error:</span>
                  <span className="font-bold">-0.4 mm (Low)</span>
                </div>
              </div>

            </div>
          </div>

          <div className="pt-1.5 border-t border-neutral-200 flex items-center justify-between text-[9px] font-mono text-neutral-500">
            <span>Reflectivity: 0 to 60 dBZ</span>
            <span className="text-emerald-700 font-bold">Reliability: 96.4%</span>
          </div>
        </div>

        {/* Card 4: Bust Alerts & Diagnostics */}
        <div className="border border-[#111111] bg-white p-3 flex flex-col justify-between space-y-2 hover:bg-neutral-50/70 transition-colors">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-1">
              <span className="font-mono text-[10px] font-bold uppercase text-[#111111]">
                4. BUST ALERTS & DIAGNOSTICS
              </span>
              <span className="text-[9px] font-mono bg-[#CC0000] text-white px-1 py-0.2 font-bold">
                CRITICAL (2)
              </span>
            </div>

            <div className="space-y-1.5 text-[9px] font-mono">
              {/* Alert 1 */}
              <div className="p-1 border border-red-200 bg-red-50/50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#CC0000] uppercase truncate">AIFS vs Physics Model Shear</span>
                  <span className="text-[#CC0000] font-bold text-[8px] bg-red-100 px-1">D+3</span>
                </div>
                <p className="text-neutral-700 text-[8px] line-clamp-1 mt-0.5">
                  Cyclonic vorticity error: GFS/IFS deepens storm faster than neural net.
                </p>
              </div>

              {/* Alert 2 */}
              <div className="p-1 border border-neutral-200 bg-neutral-50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900 uppercase truncate">Western Ghats Orographic Bust</span>
                  <span className="text-neutral-700 font-bold text-[8px] bg-neutral-200 px-1">D+5</span>
                </div>
                <p className="text-neutral-700 text-[8px] line-clamp-1 mt-0.5">
                  Orographic precipitation plume spread exceeds &plusmn;40 mm/24h.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-1.5 border-t border-neutral-200 flex items-center justify-between text-[9px] font-mono">
            <button
              onClick={onOpenSimulatorModal}
              className="text-[#CC0000] font-bold hover:underline flex items-center gap-0.5"
            >
              <span>Inspect Diagnostics</span>
              <ArrowRight className="h-2.5 w-2.5" />
            </button>
            <button
              onClick={onOpenReportModal}
              className="text-neutral-700 hover:text-black font-semibold hover:underline"
            >
              Operational Log &gt;
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
