import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders, Play, RotateCcw } from 'lucide-react';
import { Subdivision, ExplainResponse, CustomEvaluatePayload } from '../types';
import { submitCustomEvaluation } from '../services/api';

interface CustomEvaluatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdivisions: Subdivision[];
  selectedSubdivision: Subdivision | null;
  onEvaluationComplete: (result: ExplainResponse) => void;
}

export const CustomEvaluatorModal: React.FC<CustomEvaluatorModalProps> = ({
  isOpen,
  onClose,
  subdivisions,
  selectedSubdivision,
  onEvaluationComplete
}) => {
  const [subId, setSubId] = useState<string>(selectedSubdivision?.id || 'sub_07');
  const [leadTime, setLeadTime] = useState<number>(4);
  const [ensembleSpread, setEnsembleSpread] = useState<number>(0.78);
  const [cape, setCape] = useState<number>(2800);
  const [shear, setShear] = useState<number>(24);
  const [vorticity, setVorticity] = useState<number>(0.75);
  const [mfc, setMfc] = useState<number>(0.82);
  const [baroclinic, setBaroclinic] = useState<number>(0.65);
  const [anomaly, setAnomaly] = useState<number>(0.80);
  const [loading, setLoading] = useState<boolean>(false);

  // Quick Preset Handlers
  const applyPreset = (preset: string) => {
    if (preset === 'cyclone') {
      setEnsembleSpread(0.92);
      setCape(3400);
      setShear(16);
      setVorticity(0.95);
      setMfc(0.96);
      setBaroclinic(0.85);
      setAnomaly(0.90);
    } else if (preset === 'depression') {
      setEnsembleSpread(0.80);
      setCape(2400);
      setShear(22);
      setVorticity(0.78);
      setMfc(0.85);
      setBaroclinic(0.68);
      setAnomaly(0.75);
    } else if (preset === 'heatwave') {
      setEnsembleSpread(0.55);
      setCape(700);
      setShear(8);
      setVorticity(0.30);
      setMfc(0.12);
      setBaroclinic(0.40);
      setAnomaly(0.88);
    } else {
      // Stable
      setEnsembleSpread(0.20);
      setCape(500);
      setShear(10);
      setVorticity(0.18);
      setMfc(0.22);
      setBaroclinic(0.20);
      setAnomaly(0.15);
    }
  };

  const handleSimulate = async () => {
    setLoading(true);
    const payload: CustomEvaluatePayload = {
      subdivision_id: subId,
      lead_time_days: leadTime,
      ensemble_spread: ensembleSpread,
      cape: cape,
      vertical_wind_shear: shear,
      vorticity_gradient: vorticity,
      moisture_flux_convergence: mfc,
      baroclinic_growth_rate: baroclinic,
      climatological_anomaly: anomaly
    };

    const result = await submitCustomEvaluation(payload);
    onEvaluationComplete(result);
    setLoading(false);
    onClose();
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
            className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <Sliders className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                    What-If Atmospheric Simulator
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Test custom NWP ensemble spread and thermodynamic instability parameters
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

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              
              {/* Presets */}
              <div>
                <span className="text-[11px] font-medium text-neutral-400 block mb-2">
                  Quick Atmospheric Regime Presets
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => applyPreset('cyclone')}
                    className="px-2.5 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-rose-600 hover:text-rose-400 text-neutral-300 transition-colors text-xs font-medium"
                  >
                    Severe Cyclone
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => applyPreset('depression')}
                    className="px-2.5 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-amber-600 hover:text-amber-400 text-neutral-300 transition-colors text-xs font-medium"
                  >
                    Monsoon Depression
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => applyPreset('heatwave')}
                    className="px-2.5 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-amber-600 hover:text-amber-400 text-neutral-300 transition-colors text-xs font-medium"
                  >
                    Severe Heatwave
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => applyPreset('stable')}
                    className="px-2.5 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-emerald-600 hover:text-emerald-400 text-neutral-300 transition-colors text-xs font-medium"
                  >
                    Stable Baseline
                  </motion.button>
                </div>
              </div>

              {/* Region and Lead Time Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-400 block mb-1.5 font-medium">Target Subdivision</label>
                  <select
                    value={subId}
                    onChange={(e) => setSubId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-white"
                  >
                    {subdivisions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5 font-medium">
                    <label className="text-neutral-400">Lead Time Horizon</label>
                    <span className="text-white font-mono">Day {leadTime} (+{leadTime * 24}h)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={leadTime}
                    onChange={(e) => setLeadTime(parseInt(e.target.value))}
                    className="w-full accent-white bg-neutral-800"
                  />
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="space-y-3.5 pt-2 border-t border-neutral-800">
                
                {/* Ensemble Spread */}
                <div>
                  <div className="flex justify-between mb-1 text-xs">
                    <span className="text-neutral-300 font-medium">Ensemble Spread Divergence</span>
                    <span className="text-white font-mono font-bold">{Math.round(ensembleSpread * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.02"
                    value={ensembleSpread}
                    onChange={(e) => setEnsembleSpread(parseFloat(e.target.value))}
                    className="w-full accent-rose-500 bg-neutral-800"
                  />
                </div>

                {/* CAPE */}
                <div>
                  <div className="flex justify-between mb-1 text-xs">
                    <span className="text-neutral-300 font-medium">Convective Available Potential Energy (CAPE)</span>
                    <span className="text-white font-mono font-bold">{cape} J/kg</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4500"
                    step="50"
                    value={cape}
                    onChange={(e) => setCape(parseInt(e.target.value))}
                    className="w-full accent-amber-400 bg-neutral-800"
                  />
                </div>

                {/* Vertical Wind Shear */}
                <div>
                  <div className="flex justify-between mb-1 text-xs">
                    <span className="text-neutral-300 font-medium">0–6 km Deep Layer Wind Shear</span>
                    <span className="text-white font-mono font-bold">{shear} m/s</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="1"
                    value={shear}
                    onChange={(e) => setShear(parseInt(e.target.value))}
                    className="w-full accent-white bg-neutral-800"
                  />
                </div>

                {/* Mid-Tropospheric Vorticity Gradient */}
                <div>
                  <div className="flex justify-between mb-1 text-xs">
                    <span className="text-neutral-300 font-medium">500 hPa Relative Vorticity Gradient</span>
                    <span className="text-white font-mono font-bold">{Math.round(vorticity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.02"
                    value={vorticity}
                    onChange={(e) => setVorticity(parseFloat(e.target.value))}
                    className="w-full accent-rose-500 bg-neutral-800"
                  />
                </div>

                {/* Moisture Flux Convergence */}
                <div>
                  <div className="flex justify-between mb-1 text-xs">
                    <span className="text-neutral-300 font-medium">Low-Level Moisture Flux Convergence (MFC)</span>
                    <span className="text-white font-mono font-bold">{Math.round(mfc * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.02"
                    value={mfc}
                    onChange={(e) => setMfc(parseFloat(e.target.value))}
                    className="w-full accent-emerald-400 bg-neutral-800"
                  />
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-950/70 flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => applyPreset('stable')}
                className="flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset to Baseline</span>
              </motion.button>

              <div className="flex items-center space-x-2.5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleSimulate}
                  disabled={loading}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-white text-black hover:bg-neutral-200 transition-all flex items-center space-x-1.5 shadow-lg"
                >
                  <Play className="h-3.5 w-3.5 fill-black" />
                  <span>{loading ? 'Evaluating...' : 'Run Simulation'}</span>
                </motion.button>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomEvaluatorModal;
