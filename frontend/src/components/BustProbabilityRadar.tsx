import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { DayTrajectory, Subdivision } from '../types';
import { TrendingUp } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';

interface BustProbabilityRadarProps {
  trajectory: DayTrajectory[];
  selectedSubdivision: Subdivision | null;
  currentLeadTime: number;
  onSelectLeadTime: (day: number) => void;
}

export const BustProbabilityRadar: React.FC<BustProbabilityRadarProps> = ({
  trajectory,
  selectedSubdivision,
  currentLeadTime,
  onSelectLeadTime
}) => {
  const currentDayData = trajectory.find((t) => t.lead_time === currentLeadTime) || trajectory[0];

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">
                10-Day Error Trajectory
              </h3>
              <span className="text-[11px] px-2 py-0.2 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 font-medium">
                {selectedSubdivision?.name || 'National Aggregate'}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Lorenz chaotic error propagation &amp; bust probability curve
            </p>
          </div>
        </div>

        {/* Current Day Gauge Snapshot */}
        {currentDayData && (
          <div className="flex items-center gap-3 bg-neutral-950/80 border border-neutral-800 px-3 py-1.5 rounded-xl font-mono">
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block font-sans">DAY {currentLeadTime} BUST</span>
              <span className="text-sm font-bold text-rose-400">
                <AnimatedNumber value={currentDayData.bust_probability} decimals={1} suffix="%" />
              </span>
            </div>
            <div className="h-6 w-px bg-neutral-800" />
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block font-sans">CONFIDENCE</span>
              <span className="text-sm font-bold text-emerald-400">
                <AnimatedNumber value={currentDayData.confidence_score} decimals={1} suffix="%" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chart Section */}
      <div className="h-[210px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trajectory}
            margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
            onClick={(e: any) => {
              if (e && e.activePayload && e.activePayload.length > 0) {
                const day = e.activePayload[0].payload.lead_time;
                if (day) onSelectLeadTime(day);
              }
            }}
          >
            <defs>
              <linearGradient id="bustGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="confGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#71717a"
              tick={{ fontSize: 10, fill: '#a1a1aa' }}
              tickLine={false}
            />
            <YAxis
              stroke="#71717a"
              tick={{ fontSize: 10, fill: '#a1a1aa' }}
              domain={[0, 100]}
              tickLine={false}
              unit="%"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as DayTrajectory;
                  return (
                    <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl shadow-2xl font-mono text-xs">
                      <div className="font-bold text-white border-b border-neutral-800 pb-1 mb-1.5 flex items-center justify-between gap-3">
                        <span>{d.day} (+{d.lead_time * 24}h)</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-bold" style={{ color: d.risk_color, backgroundColor: `${d.risk_color}22` }}>
                          {d.risk_level}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between gap-4 text-rose-400 font-semibold">
                          <span>Bust Probability:</span>
                          <span>{d.bust_probability}%</span>
                        </div>
                        <div className="flex justify-between gap-4 text-emerald-400 font-semibold">
                          <span>Confidence Score:</span>
                          <span>{d.confidence_score}%</span>
                        </div>
                        <div className="flex justify-between gap-4 text-neutral-400 text-[11px]">
                          <span>Track Error:</span>
                          <span>&plusmn;{d.expected_error_km} km</span>
                        </div>
                        <div className="flex justify-between gap-4 text-neutral-400 text-[11px]">
                          <span>Precip Error:</span>
                          <span>&plusmn;{d.expected_error_precip_mm} mm</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={65} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.6} />
            <Area
              type="monotone"
              dataKey="bust_probability"
              stroke="#f43f5e"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#bustGradient)"
              name="Bust Probability %"
            />
            <Area
              type="monotone"
              dataKey="confidence_score"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#confGradient)"
              name="Confidence Score %"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2 pt-2 border-t border-neutral-800/80">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Bust Risk</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Confidence</span>
          </div>
        </div>
        <span className="text-neutral-500">Click any day to jump lead time</span>
      </div>

    </div>
  );
};

export default BustProbabilityRadar;
