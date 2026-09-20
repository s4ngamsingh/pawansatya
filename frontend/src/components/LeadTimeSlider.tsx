import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock, AlertCircle } from 'lucide-react';

interface LeadTimeSliderProps {
  currentLeadTime: number;
  onChangeLeadTime: (day: number) => void;
  criticalLeadTimes?: number[];
}

export const LeadTimeSlider: React.FC<LeadTimeSliderProps> = ({
  currentLeadTime,
  onChangeLeadTime,
  criticalLeadTimes = []
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        onChangeLeadTime(currentLeadTime >= 10 ? 1 : currentLeadTime + 1);
      }, 1800);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentLeadTime, onChangeLeadTime]);

  const days = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3.5">
        
        {/* Title and Forecast horizon */}
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center">
            <Clock className="h-4 w-4 text-neutral-700" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-neutral-900 font-sans">
                Forecast Lead-Time Horizon
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 font-medium">
                Day 1 &ndash; 10
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Lorenz atmospheric error growth progression across medium-range lead times.
            </p>
          </div>
        </div>

        {/* Playback Controls & Selected Day Indicator */}
        <div className="flex items-center space-x-3 self-end md:self-auto">
          <div className="flex items-center bg-neutral-100 border border-neutral-200 rounded-xl p-1 shadow-inner">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                isPlaying
                  ? 'bg-rose-600 text-white'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
              }`}
              title={isPlaying ? 'Pause simulation' : 'Auto-advance Day 1 to 10'}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span className="text-xs">{isPlaying ? 'Pause' : 'Play'}</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onChangeLeadTime(1)}
              className="p-1.5 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors"
              title="Reset to Day 1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </motion.button>
          </div>

          {/* Large active indicator */}
          <div className="bg-neutral-900 text-white font-bold px-3.5 py-1.5 rounded-xl text-sm shadow-md flex items-center gap-1.5">
            <span className="font-mono">DAY {currentLeadTime}</span>
            <span className="text-xs font-normal text-neutral-300 font-mono">
              (+{currentLeadTime * 24}h)
            </span>
          </div>
        </div>

      </div>

      {/* Interactive Slider Track with layoutId */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
        {days.map((day) => {
          const isSelected = currentLeadTime === day;
          const isCritical = criticalLeadTimes.includes(day);

          return (
            <motion.button
              key={day}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChangeLeadTime(day)}
              className="relative flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-center select-none"
            >
              {/* Animated Floating Pill Background using Framer Motion layoutId */}
              {isSelected && (
                <motion.div
                  layoutId="activeLeadTime"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  className="absolute inset-0 bg-neutral-900 rounded-xl shadow-md z-0"
                />
              )}

              {/* Inactive border/bg */}
              {!isSelected && (
                <div
                  className={`absolute inset-0 rounded-xl border transition-colors bg-neutral-50 hover:bg-neutral-100 ${
                    day <= 3
                      ? 'border-emerald-200 hover:border-emerald-400'
                      : day <= 6
                      ? 'border-amber-200 hover:border-amber-400'
                      : 'border-rose-200 hover:border-rose-400'
                  }`}
                />
              )}

              {/* Critical Alert Dot */}
              {isCritical && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 z-20">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
              )}

              {/* Button content */}
              <div className="relative z-10 flex flex-col items-center">
                <span
                  className={`text-xs font-mono font-bold ${
                    isSelected ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  D{day}
                </span>
                <span
                  className={`text-[10px] font-mono ${
                    isSelected ? 'text-neutral-300' : 'text-neutral-500'
                  }`}
                >
                  +{day * 24}h
                </span>

                {/* Micro indicator line */}
                <div
                  className={`mt-1.5 h-1 w-6 rounded-full ${
                    isSelected
                      ? 'bg-white'
                      : day <= 3
                      ? 'bg-emerald-500'
                      : day <= 6
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-neutral-600 mt-3 pt-2.5 border-t border-neutral-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Days 1–3: High Predictability</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Days 4–6: Synoptic Error Growth</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Days 7–10: Lorenz Predictability Limit</span>
          </div>
        </div>

        {criticalLeadTimes.length > 0 && (
          <div className="flex items-center space-x-1.5 text-rose-600 font-medium">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>High-risk bifurcation window at Day {criticalLeadTimes.join(', ')}</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default LeadTimeSlider;
