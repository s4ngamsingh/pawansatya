import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegionExplanation, Subdivision } from '../types';
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Layers,
  ChevronDown,
  Info,
  Activity,
  Gauge,
  Mountain
} from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';

interface ExplainabilityPanelProps {
  explanation: RegionExplanation | null;
  selectedSubdivision: Subdivision | null;
  leadTime: number;
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({
  explanation,
  selectedSubdivision,
  leadTime
}) => {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  if (!explanation || !selectedSubdivision) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center text-neutral-500 text-xs flex flex-col items-center justify-center h-full min-h-[350px] shadow-sm">
        <Info className="h-8 w-8 text-neutral-400 mb-3 animate-pulse" />
        <h4 className="text-sm font-semibold text-neutral-800 mb-1">No Region Selected</h4>
        <p className="max-w-xs text-neutral-600">
          Click any subdivision on the satellite map to inspect real-time AI explainability, physical drivers, and SHAP attribution.
        </p>
      </div>
    );
  }

  const isDanger = selectedSubdivision.risk_level === 'DANGER';
  const isSafe = selectedSubdivision.risk_level === 'SAFE';

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm flex flex-col space-y-4">
      
      {/* Animated container keyed to subdivision for smooth transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedSubdivision.id}-${leadTime}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="space-y-4"
        >
          {/* Header & Title */}
          <div className="flex items-start justify-between border-b border-neutral-200 pb-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  Meteorological Explainability &bull; XAI
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
                  SHAP
                </span>
                {selectedSubdivision.elevation_mean_m && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                    <Mountain className="h-2.5 w-2.5" />
                    DEM {selectedSubdivision.elevation_mean_m}m
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight font-sans">
                {explanation.subdivision_name}
              </h2>
              <p className="text-xs text-neutral-500">
                Lead Time: <strong className="text-neutral-800">Day {leadTime}</strong> (+{leadTime * 24}h Horizon)
              </p>
            </div>

            {/* Risk Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs border ${
                isDanger
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : isSafe
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {isDanger ? (
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
              ) : (
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
              )}
              <span>{selectedSubdivision.reliability_tag}</span>
            </motion.div>
          </div>

          {/* Primary Metric Moment: Large, Commanding Display Typography */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Primary: Bust Probability */}
            <div
              className={`p-3.5 rounded-xl border col-span-2 sm:col-span-1 ${
                isDanger
                  ? 'bg-rose-50/70 border-rose-200'
                  : isSafe
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-amber-50/70 border-amber-200'
              }`}
            >
              <div className="text-[11px] font-medium text-neutral-500 mb-1 flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-neutral-400" />
                <span>Bust Probability</span>
              </div>
              <div
                className={`text-4xl sm:text-5xl font-black tracking-tight font-sans ${
                  isDanger
                    ? 'text-rose-600'
                    : isSafe
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                }`}
              >
                <AnimatedNumber value={explanation.bust_probability} decimals={1} suffix="%" />
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">
                Baseline: {explanation.baseline_probability}%
              </div>
            </div>

            {/* Secondary: Forecast Confidence */}
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="text-[11px] font-medium text-neutral-500 mb-1 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-neutral-400" />
                <span>Confidence Score</span>
              </div>
              <div className="text-3xl font-bold tracking-tight text-neutral-900 font-sans">
                <AnimatedNumber value={selectedSubdivision.confidence_score} decimals={1} suffix="%" />
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">
                Model: LightGBM GBDT
              </div>
            </div>

            {/* Tertiary: Expected Error */}
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="text-[11px] font-medium text-neutral-500 mb-1">
                Expected Rainfall Error
              </div>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-mono">
                &plusmn;{selectedSubdivision.expected_error_precip_mm} <span className="text-xs font-normal text-neutral-500">mm</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-1 font-mono">
                Track: &plusmn;{selectedSubdivision.expected_error_km} km
              </div>
            </div>
          </div>

          {/* Topography & DEM Orographic Lift Metrics Card */}
          {selectedSubdivision.elevation_mean_m !== undefined && (
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100/60 border border-neutral-200 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-900 flex items-center gap-1.5">
                  <Mountain className="h-3.5 w-3.5 text-neutral-700" />
                  Topography & Orographic Lift Profile (DEM)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-neutral-600 border border-neutral-200 shadow-2xs">
                  NASA / Copernicus DEM
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-white p-2 rounded-lg border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] text-neutral-500 block">Mean Elevation</span>
                  <span className="text-sm font-bold font-mono text-neutral-900">{selectedSubdivision.elevation_mean_m}m</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] text-neutral-500 block">Peak Elevation</span>
                  <span className="text-sm font-bold font-mono text-neutral-900">{selectedSubdivision.elevation_max_m}m</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] text-neutral-500 block">Orographic Factor</span>
                  <span className="text-sm font-bold font-mono text-neutral-900">
                    {Math.round((selectedSubdivision.orographic_lift_factor || 0) * 100)}%
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] text-neutral-500 block">Ruggedness (TRI)</span>
                  <span className="text-sm font-bold font-mono text-neutral-900">
                    {Math.round((selectedSubdivision.terrain_ruggedness || 0) * 100)}%
                  </span>
                </div>
              </div>
              {(selectedSubdivision.orographic_lift_factor || 0) > 0.7 && (
                <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>
                    <strong>Orographic Trigger Active:</strong> High mountain barrier forcing amplifies convective precipitation forecast bust probability.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Operational Forecaster Advisory Box (Clean typography, non-mono) */}
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed transition-all ${
              isDanger
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : isSafe
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold text-neutral-900 mb-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Operational Guidance & Advisory</span>
            </div>
            <p className="text-neutral-700 text-xs font-normal leading-relaxed">
              {explanation.operational_advisory}
            </p>
          </div>

          {/* SHAP Waterfall / Feature Attribution Chart */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-neutral-500" />
                Physical Driver Attribution (SHAP)
              </span>
              <span className="text-[11px] text-neutral-500">
                Sorted by impact magnitude
              </span>
            </div>

            <div className="space-y-2">
              {explanation.feature_contributions.map((feat) => {
                const isPositive = feat.contribution > 0;
                const barWidth = Math.min(100, Math.max(8, Math.abs(feat.contribution) * 3.5));
                const isExpanded = expandedFeature === feat.feature_key;

                return (
                  <div
                    key={feat.feature_key}
                    className="bg-neutral-50/80 p-2.5 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors"
                  >
                    <div
                      onClick={() => setExpandedFeature(isExpanded ? null : feat.feature_key)}
                      className="flex items-center justify-between text-xs cursor-pointer select-none"
                    >
                      <span className="text-neutral-800 font-medium truncate max-w-[200px] sm:max-w-[280px]">
                        {feat.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-mono text-neutral-500">
                          {feat.value}
                        </span>
                        <span
                          className={`text-xs font-mono font-bold ${
                            isPositive ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {isPositive ? `+${feat.contribution}%` : `${feat.contribution}%`}
                        </span>
                        <ChevronDown
                          className={`h-3 w-3 text-neutral-400 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Progress bar with Framer Motion spring */}
                    <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden flex mt-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                        className={`h-full rounded-full ${
                          isPositive
                            ? 'bg-gradient-to-r from-rose-600 to-rose-400'
                            : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                        }`}
                      />
                    </div>

                    {/* Expandable Explanation */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-2.5 pt-2 border-t border-neutral-200 text-[11px] text-neutral-600 leading-relaxed"
                        >
                          {feat.explanation}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
};

export default ExplainabilityPanel;
