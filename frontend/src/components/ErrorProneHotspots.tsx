import React from 'react';
import { motion } from 'framer-motion';
import { Subdivision } from '../types';
import { AlertOctagon, ArrowUpRight } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';

interface ErrorProneHotspotsProps {
  hotspots: Subdivision[];
  selectedSubdivision: Subdivision | null;
  onSelectSubdivision: (sub: Subdivision) => void;
  leadTime: number;
}

export const ErrorProneHotspots: React.FC<ErrorProneHotspotsProps> = ({
  hotspots,
  selectedSubdivision,
  onSelectSubdivision,
  leadTime
}) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
            <AlertOctagon className="h-4 w-4 text-rose-600 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-neutral-900">
                Error-Prone Regions (Day {leadTime})
              </h3>
              <span className="text-[11px] px-2 py-0.2 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                {hotspots.length} Alert Zones
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Ranked regions where NWP forecasts exhibit elevated bust risk.
            </p>
          </div>
        </div>
      </div>

      {/* Hotspots List with Framer Motion */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {hotspots.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 text-xs">
            No critical forecast bust zones detected for this lead time.
          </div>
        ) : (
          hotspots.map((sub, index) => {
            const isSelected = selectedSubdivision?.id === sub.id;
            const isCritical = sub.bust_probability >= 65.0;

            return (
              <motion.div
                key={sub.id}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelectSubdivision(sub)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                    : isCritical
                    ? 'bg-rose-50/70 border-rose-200 hover:border-rose-300 hover:bg-rose-50'
                    : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className={`text-xs font-mono font-bold w-4 ${isSelected ? 'text-neutral-400' : 'text-neutral-400'}`}>
                    #{index + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-neutral-900'}`}>
                        {sub.name}
                      </h4>
                      <span className={`text-[10px] ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        ({sub.zone})
                      </span>
                    </div>
                    <div className={`flex items-center space-x-2 mt-0.5 text-[11px] font-mono ${isSelected ? 'text-neutral-300' : 'text-neutral-600'}`}>
                      <span>Track: &plusmn;{sub.expected_error_km}km</span>
                      <span>&bull;</span>
                      <span>Rain: &plusmn;{sub.expected_error_precip_mm}mm</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className={`text-xs font-bold font-mono ${isSelected ? 'text-rose-300' : 'text-rose-600'}`}>
                      <AnimatedNumber value={sub.bust_probability} decimals={1} suffix="%" /> BUST
                    </div>
                    <div className={`text-[10px] font-mono ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`}>
                      <AnimatedNumber value={sub.confidence_score} decimals={1} suffix="%" /> CONF
                    </div>
                  </div>

                  <div className={`p-1 rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-neutral-800 border-neutral-700 text-white'
                      : 'bg-white border-neutral-200 text-neutral-500 group-hover:text-neutral-900 shadow-xs'
                  }`}>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-neutral-200 text-[11px] text-neutral-500 flex items-center justify-between">
        <span>Click any region to inspect physical drivers</span>
        <span className="text-rose-600 font-medium">Bust Threshold &ge; 65%</span>
      </div>

    </div>
  );
};

export default ErrorProneHotspots;
