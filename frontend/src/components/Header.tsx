import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Sliders,
  FileText,
  Clock,
  ChevronDown,
  Cpu,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Scenario, EvaluationSummary } from '../types';
import { AnimatedNumber } from './AnimatedNumber';

interface HeaderProps {
  scenarios: Scenario[];
  selectedScenario: Scenario | null;
  onSelectScenario: (scenario: Scenario) => void;
  summary: EvaluationSummary | null;
  leadTime: number;
  onOpenCustomSimulator: () => void;
  onOpenReportModal: () => void;
  onOpenValidationModal: () => void;
  onNavigateLanding?: () => void;
}

// Custom SVG Brand Mark: Atmospheric Isobar Vortex + Radar Vector
const BrandLogo: React.FC = () => (
  <svg
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-9 w-9 shrink-0"
  >
    {/* Outer Isobar Ring */}
    <circle
      cx="22"
      cy="22"
      r="20"
      stroke="rgba(255, 255, 255, 0.15)"
      strokeWidth="1.5"
      strokeDasharray="3 3"
    />
    {/* Inner Isobar Ring */}
    <circle
      cx="22"
      cy="22"
      r="13"
      stroke="rgba(255, 255, 255, 0.25)"
      strokeWidth="1.5"
    />
    {/* Cyclonic Vortex Spiral */}
    <path
      d="M22 6C30.8366 6 38 13.1634 38 22C38 27.5 34.5 32.5 29 35C24.5 37 18 36 14 32C10 28 9.5 22 13 17C16 12.5 22 12.5 25 16C28 19.5 27 24.5 23 26C19.5 27.5 17 25 18 22"
      stroke="url(#vortexGrad)"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* Core Radar Beacon */}
    <circle cx="22" cy="22" r="3" fill="#ef4444" />
    <defs>
      <linearGradient id="vortexGrad" x1="6" y1="6" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f43f5e" />
        <stop offset="0.5" stopColor="#fb7185" />
        <stop offset="1" stopColor="#ffffff" />
      </linearGradient>
    </defs>
  </svg>
);

export const Header: React.FC<HeaderProps> = ({
  scenarios,
  selectedScenario,
  onSelectScenario,
  summary,
  leadTime,
  onOpenCustomSimulator,
  onOpenReportModal,
  onOpenValidationModal,
  onNavigateLanding
}) => {
  const [timeUtc, setTimeUtc] = useState<string>('');
  const [timeIst, setTimeIst] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeUtc(now.toUTCString().slice(17, 25) + ' UTC');
      const istOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setTimeIst(new Intl.DateTimeFormat('en-GB', istOptions).format(now) + ' IST');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          
          {/* Brand & System Title */}
          <div
            onClick={onNavigateLanding}
            className={`flex items-center space-x-3.5 ${onNavigateLanding ? 'cursor-pointer group' : ''}`}
            title={onNavigateLanding ? 'Click to return to Landing Page' : undefined}
          >
            <motion.div
              whileHover={{ rotate: 15, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="p-1.5 rounded-xl bg-neutral-900 border border-neutral-800 shadow-md flex items-center justify-center"
            >
              <BrandLogo />
            </motion.div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white font-sans group-hover:text-rose-400 transition-colors">
                  PAWAN<span className="font-light text-rose-500">SATYA</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Operational
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-normal">
                AI Medium-Range Forecast Bust Detection <span className="text-neutral-600 hidden sm:inline">&bull;</span> <span className="text-neutral-500 hidden sm:inline">NOAA GFS & ERA5 Reanalysis</span>
              </p>
            </div>
          </div>

          {/* Quick Stats Summary: Differentiated chromatic pills */}
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-2 bg-neutral-900/90 border border-neutral-800/90 px-3 py-1.5 rounded-xl text-xs shadow-inner"
            >
              {/* Danger */}
              <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-rose-950/30 text-rose-400 border border-rose-900/30">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                <span className="font-mono font-bold">
                  <AnimatedNumber value={summary.danger_count} />
                </span>
                <span className="text-[11px] font-medium text-rose-300">Bust Risk</span>
              </div>

              {/* Caution */}
              <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-amber-950/30 text-amber-300 border border-amber-900/30">
                <span className="font-mono font-bold">
                  <AnimatedNumber value={summary.caution_count} />
                </span>
                <span className="text-[11px] font-medium text-amber-400">Caution</span>
              </div>

              {/* Safe */}
              <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-emerald-950/30 text-emerald-300 border border-emerald-900/30">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-mono font-bold">
                  <AnimatedNumber value={summary.safe_count} />
                </span>
                <span className="text-[11px] font-medium text-emerald-400">Safe</span>
              </div>

              <div className="hidden sm:flex items-center space-x-1 pl-2 border-l border-neutral-800 text-neutral-400 text-xs">
                <span>Avg Conf:</span>
                <span className="font-mono font-bold text-white">
                  <AnimatedNumber value={summary.avg_confidence} decimals={1} suffix="%" />
                </span>
              </div>
            </motion.div>
          )}

          {/* Right Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Clocks */}
            <div className="hidden xl:flex items-center space-x-2 text-[11px] font-mono bg-neutral-900/80 border border-neutral-800 px-2.5 py-1.5 rounded-lg text-neutral-400">
              <Clock className="h-3.5 w-3.5 text-neutral-500" />
              <span>{timeUtc}</span>
              <span className="text-neutral-700">/</span>
              <span className="text-neutral-200">{timeIst}</span>
            </div>

            {/* Scenario Dropdown with AnimatePresence */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-neutral-900 border border-neutral-700/80 hover:border-neutral-600 text-xs font-medium text-white rounded-lg shadow-sm transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="max-w-[170px] sm:max-w-[210px] truncate">
                  {selectedScenario ? selectedScenario.name : 'Select Scenario'}
                </span>
                <motion.div
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ type: 'spring', duration: 0.25, stiffness: 350, damping: 25 }}
                    className="absolute right-0 mt-2 w-84 bg-neutral-900/95 backdrop-blur-2xl border border-neutral-800 rounded-xl shadow-2xl py-1.5 z-50 overflow-hidden"
                  >
                    <div className="px-3.5 py-1.5 text-[11px] font-medium text-neutral-400 border-b border-neutral-800/80">
                      Rapidly Evolving Synoptic Scenarios
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-neutral-800/50">
                      {scenarios.map((sc) => {
                        const isSelected = selectedScenario?.id === sc.id;
                        return (
                          <motion.button
                            key={sc.id}
                            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                            onClick={() => {
                              onSelectScenario(sc);
                              setDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 text-xs transition-colors flex items-start justify-between gap-2 ${
                              isSelected
                                ? 'bg-neutral-800/80 text-white font-medium'
                                : 'text-neutral-300'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="font-semibold text-white flex items-center gap-1.5">
                                <span>{sc.name}</span>
                              </div>
                              <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                                {sc.description}
                              </p>
                            </div>
                            {isSelected && (
                              <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action: ML Validation Modal */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenValidationModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 text-xs text-neutral-200 hover:text-white rounded-lg shadow-sm transition-all"
              title="View Holdout Validation Metrics, ROC Curve & Download Dataset"
            >
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline font-medium">ML Validation</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 font-bold">
                AUC 0.966
              </span>
            </motion.button>

            {/* Action: Custom Evaluator Simulator */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenCustomSimulator}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-xs text-neutral-300 hover:text-white rounded-lg shadow-sm transition-all"
              title="Test custom meteorological parameters"
            >
              <Sliders className="h-3.5 w-3.5 text-neutral-400" />
              <span className="hidden md:inline font-medium">Simulator</span>
            </motion.button>

            {/* Action: Export Bulletin */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenReportModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white text-black font-semibold text-xs rounded-lg shadow-md hover:bg-neutral-100 transition-all"
              title="Generate Operational Forecast Bust Bulletin"
            >
              <FileText className="h-3.5 w-3.5 text-black" />
              <span>Bulletin</span>
            </motion.button>

          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
