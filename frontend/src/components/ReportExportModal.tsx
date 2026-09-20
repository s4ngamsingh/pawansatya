import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Copy, Check, FileText, ShieldAlert } from 'lucide-react';
import { Scenario, Subdivision, EvaluationSummary, RegionExplanation } from '../types';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: Scenario | null;
  summary: EvaluationSummary | null;
  leadTime: number;
  hotspots: Subdivision[];
  selectedExplanation: RegionExplanation | null;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  scenario,
  summary,
  leadTime,
  hotspots,
  selectedExplanation
}) => {
  const [copied, setCopied] = useState(false);
  const reportDate = new Date().toUTCString();

  if (!scenario || !summary) return null;

  const handleCopy = () => {
    const text = `
================================================================================
  NATIONAL WEATHER FORECAST BUST ADVISORY BULLETIN
  INDIA METEOROLOGICAL DEPARTMENT / NCMRWF OPERATIONAL GUIDANCE
================================================================================
Generated: ${reportDate}
Scenario: ${scenario.name} (${scenario.category})
Forecast Horizon: Day ${leadTime} (+${leadTime * 24} hours)
Critical Lead Times: ${scenario.critical_lead_times.join(', ')}

SUMMARY METRICS:
- High Bust Risk (Unreliable): ${summary.danger_count} subdivisions
- Moderate Uncertainty (Caution): ${summary.caution_count} subdivisions
- High Confidence (Safe): ${summary.safe_count} subdivisions
- National Mean Confidence: ${summary.avg_confidence}%
- National Mean Bust Probability: ${summary.avg_bust_probability}%

CRITICAL ERROR-PRONE SUBDIVISIONS:
${hotspots.map((h, i) => `${i + 1}. ${h.name} (${h.code}) - Bust Prob: ${h.bust_probability}%, Conf: ${h.confidence_score}%, Track Err: ~${h.expected_error_km}km, Precip Err: ~${h.expected_error_precip_mm}mm`).join('\n')}

OPERATIONAL DIRECTIVE:
${scenario.advisory}

HISTORICAL ANALOG REFERENCE:
${scenario.historical_analog}
================================================================================
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                    Operational Forecaster Briefing Bulletin
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Official medium-range forecast uncertainty &amp; bust advisory document
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Bulletin Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-white">
              
              {/* Header Banner */}
              <div className="border border-neutral-800 bg-neutral-950/70 p-4 rounded-xl text-center space-y-1">
                <span className="text-[10px] tracking-wider text-neutral-400 uppercase font-medium">
                  GOVERNMENT OF INDIA &bull; MINISTRY OF EARTH SCIENCES
                </span>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                  Medium-Range NWP Forecast Bust Risk Bulletin
                </h2>
                <div className="text-[11px] text-neutral-400 flex justify-center items-center gap-3 pt-1 font-mono">
                  <span>ISSUED: {reportDate}</span>
                  <span>&bull;</span>
                  <span>VALIDITY: DAY {leadTime} (+{leadTime * 24}H)</span>
                </div>
              </div>

              {/* Scenario Overview */}
              <div className="bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs">{scenario.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300">
                    {scenario.category}
                  </span>
                </div>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  {scenario.description}
                </p>
              </div>

              {/* Key Metrics Table */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-rose-950/30 border border-rose-900/40 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-rose-400 block uppercase font-semibold">High Bust Danger</span>
                  <span className="text-xl font-bold font-mono text-rose-400">{summary.danger_count}</span>
                  <span className="text-[10px] text-rose-300/80 block mt-0.5">Subdivisions</span>
                </div>
                <div className="bg-amber-950/30 border border-amber-900/40 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-amber-400 block uppercase font-semibold">Caution Zones</span>
                  <span className="text-xl font-bold font-mono text-amber-300">{summary.caution_count}</span>
                  <span className="text-[10px] text-amber-300/80 block mt-0.5">Subdivisions</span>
                </div>
                <div className="bg-emerald-950/30 border border-emerald-900/40 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-emerald-400 block uppercase font-semibold">Safe Zones</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">{summary.safe_count}</span>
                  <span className="text-[10px] text-emerald-300/80 block mt-0.5">High Confidence</span>
                </div>
              </div>

              {/* Priority Alert Zones Table */}
              <div>
                <span className="text-[11px] text-neutral-400 font-semibold block mb-2">
                  Priority Error-Prone Subdivisions (Day {leadTime})
                </span>
                <div className="border border-neutral-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-950 text-neutral-400 text-[10px] uppercase border-b border-neutral-800">
                      <tr>
                        <th className="p-2.5 font-medium">Subdivision</th>
                        <th className="p-2.5 font-medium">Zone</th>
                        <th className="p-2.5 font-medium">Bust Risk</th>
                        <th className="p-2.5 font-medium">Confidence</th>
                        <th className="p-2.5 font-medium">Exp. Error</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 bg-neutral-950/40">
                      {hotspots.slice(0, 6).map((h) => (
                        <tr key={h.id}>
                          <td className="p-2.5 font-semibold text-white">{h.name}</td>
                          <td className="p-2.5 text-neutral-400">{h.zone}</td>
                          <td className="p-2.5 font-bold font-mono text-rose-400">{h.bust_probability}%</td>
                          <td className="p-2.5 font-bold font-mono text-emerald-400">{h.confidence_score}%</td>
                          <td className="p-2.5 text-neutral-400 font-mono">&plusmn;{h.expected_error_km}km / &plusmn;{h.expected_error_precip_mm}mm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Operational Advisory */}
              <div className="bg-neutral-950/80 border border-rose-900/40 p-3.5 rounded-xl">
                <div className="flex items-center space-x-2 text-rose-400 font-semibold mb-1">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Operational Advisory For Decision Makers</span>
                </div>
                <p className="text-neutral-300 leading-relaxed text-xs">
                  {scenario.advisory}
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-950/70 flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopy}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-neutral-800 hover:border-white text-xs text-white transition-colors bg-neutral-900"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
              </motion.button>

              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.print()}
                  className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors shadow"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Bulletin</span>
                </motion.button>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportExportModal;
