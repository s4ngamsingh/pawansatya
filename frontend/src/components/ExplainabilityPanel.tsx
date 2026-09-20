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
  Gauge
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
      <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-8 text-center text-neutral-400 text-xs flex flex-col items-center justify-center h-full min-h-[350px]">
        <Info className="h-8 w-8 text-neutral-600 mb-3 animate-pulse" />
        <h4 className="text-sm font-semibold text-neutral-300 mb-1">No Region Selected</h4>
        <p className="max-w-xs text-neutral-400">
          Click any subdivision on the satellite map to inspect real-time AI explainability, physical drivers, and SHAP attribution.
        </p>
      </div>
    );
  }

  const isDanger = selectedSubdivision.risk_level === 'DANGER';
  const isSafe = selectedSubdivision.risk_level === 'SAFE';

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 shadow-xl flex flex-col space-y-4">
      
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
          <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                  Meteorological Explainability &bull; XAI
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                  SHAP
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
                {explanation.subdivision_name}
              </h2>
              <p className="text-xs text-neutral-400">
                Lead Time: <strong className="text-neutral-200">Day {leadTime}</strong> (+{leadTime * 24}h Horizon)
              </p>
            </div>

            {/* Risk Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm border ${
                isDanger
                  ? 'bg-rose-950/40 text-rose-400 border-rose-800/60'
                  : isSafe
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                  : 'bg-amber-950/40 text-amber-300 border-amber-800/60'
              }`}
            >
              {isDanger ? (
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
              ) : (
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
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
                  ? 'bg-rose-950/20 border-rose-900/40'
                  : isSafe
                  ? 'bg-emerald-950/20 border-emerald-900/40'
                  : 'bg-amber-950/20 border-amber-900/40'
              }`}
            >
              <div className="text-[11px] font-medium text-neutral-400 mb-1 flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-neutral-500" />
                <span>Bust Probability</span>
              </div>
              <div
                className={`text-4xl sm:text-5xl font-black tracking-tight font-sans ${
                  isDanger
                    ? 'text-rose-500'
                    : isSafe
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >
                <AnimatedNumber value={explanation.bust_probability} decimals={1} suffix="%" />
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">
                Baseline: {explanation.baseline_probability}%
              </div>
            </div>

            {/* Secondary: Forecast Confidence */}
            <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
              <div className="text-[11px] font-medium text-neutral-400 mb-1 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-neutral-500" />
                <span>Confidence Score</span>
              </div>
              <div className="text-3xl font-bold tracking-tight text-white font-sans">
                <AnimatedNumber value={selectedSubdivision.confidence_score} decimals={1} suffix="%" />
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">
                Model: LightGBM GBDT
              </div>
            </div>

            {/* Tertiary: Expected Error */}
            <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
              <div className="text-[11px] font-medium text-neutral-400 mb-1">
                Expected Rainfall Error
              </div>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-200 font-mono">
                &plusmn;{selectedSubdivision.expected_error_precip_mm} <span className="text-xs font-normal text-neutral-400">mm</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-1 font-mono">
                Track: &plusmn;{selectedSubdivision.expected_error_km} km
              </div>
            </div>
          </div>

          {/* Operational Forecaster Advisory Box (Clean typography, non-mono) */}
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed transition-all ${
              isDanger
                ? 'bg-rose-950/25 border-rose-900/40 text-rose-200'
                : isSafe
                ? 'bg-emerald-950/25 border-emerald-900/40 text-emerald-200'
                : 'bg-amber-950/25 border-amber-900/40 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold text-white mb-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Operational Guidance & Advisory</span>
            </div>
            <p className="text-neutral-300 text-xs font-normal leading-relaxed">
              {explanation.operational_advisory}
            </p>
          </div>

          {/* SHAP Waterfall / Feature Attribution Chart */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-neutral-400" />
                Physical Driver Attribution (SHAP)
              </span>
              <span className="text-[11px] text-neutral-400">
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
                    className="bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/80 hover:border-neutral-700 transition-colors"
                  >
                    <div
                      onClick={() => setExpandedFeature(isExpanded ? null : feat.feature_key)}
                      className="flex items-center justify-between text-xs cursor-pointer select-none"
                    >
                      <span className="text-neutral-200 font-medium truncate max-w-[200px] sm:max-w-[280px]">
                        {feat.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-mono text-neutral-400">
                          {feat.value}
                        </span>
                        <span
                          className={`text-xs font-mono font-bold ${
                            isPositive ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {isPositive ? `+${feat.contribution}%` : `${feat.contribution}%`}
                        </span>
                        <ChevronDown
                          className={`h-3 w-3 text-neutral-500 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Progress bar with Framer Motion spring */}
                    <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden flex mt-2">
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
                          className="mt-2.5 pt-2 border-t border-neutral-800 text-[11px] text-neutral-400 leading-relaxed"
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
