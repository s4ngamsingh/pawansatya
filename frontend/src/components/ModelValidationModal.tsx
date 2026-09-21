import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Cpu,
  Award,
  BarChart2,
  Download,
  Database,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ModelValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelValidationModal: React.FC<ModelValidationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:8000/api/model/metrics')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setMetrics(data);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className="bg-white border border-neutral-200 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Header */}
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <Cpu className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-neutral-900 tracking-tight font-sans">
                      AI/ML Model Validation &amp; Time-Based Holdout Benchmarks
                    </h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                      Real ERA5 Ground Truth
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Trained on historical events (&le;2022); strictly evaluated on future unseen systems (&ge;2023)
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-900">
              
              {/* Time-Based Split Provenance Banner */}
              <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-800 font-semibold text-xs flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                    Strict Temporal / Event-Based Holdout Validation
                  </span>
                  <span className="text-[11px] text-neutral-600 font-mono">
                    Zero Data Leakage &bull; No Circular Evaluation
                  </span>
                </div>
                <p className="text-neutral-700 leading-relaxed font-sans text-xs">
                  Unlike arbitrary random splits, our LightGBM model was trained exclusively on historical systems up to 2022, and evaluated on completely unseen future events in 2023–2024 (including <strong>Cyclone Biparjoy</strong> and the <strong>July 2023 Himachal Pradesh Deluge</strong>).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
                    <span className="text-neutral-500 block font-semibold mb-0.5">TRAINING EVENTS (&le;2022):</span>
                    <span className="text-neutral-800 font-mono">Aug 2019 Odisha Depression, Jul 2021 Break Monsoon, May 2022 Heatwave</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-300">
                    <span className="text-emerald-700 block font-semibold mb-0.5">UNSEEN TEST HOLDOUT (&ge;2023):</span>
                    <span className="text-neutral-800 font-mono">Jun 2023 Cyclone Biparjoy, Jul 2023 HP Deluge, Dec 2023 Cyclone Michaung</span>
                  </div>
                </div>
              </div>

              {/* Key Metric Scorecards */}
              {metrics && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* AUC-ROC */}
                  <div className="bg-neutral-50 border border-neutral-200 p-3.5 rounded-xl">
                    <div className="text-[11px] text-neutral-500 font-medium mb-1">
                      Model AUC-ROC
                    </div>
                    <div className="text-2xl font-bold font-mono text-neutral-900 flex items-baseline gap-1.5">
                      <span>{metrics.metrics.auc_roc}</span>
                      <span className="text-[11px] text-emerald-600 font-normal">
                        +{(metrics.metrics.auc_roc - metrics.metrics.baseline_auc_roc).toFixed(3)} skill
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-500 block mt-1 font-mono">
                      Climatology Baseline: {metrics.metrics.baseline_auc_roc}
                    </span>
                  </div>

                  {/* F1 Score */}
                  <div className="bg-neutral-50 border border-neutral-200 p-3.5 rounded-xl">
                    <div className="text-[11px] text-neutral-500 font-medium mb-1">
                      F1-Score
                    </div>
                    <div className="text-2xl font-bold font-mono text-emerald-600">
                      {metrics.metrics.f1_score}
                    </div>
                    <span className="text-[10px] text-neutral-500 block mt-1 font-mono">
                      Prec: {(metrics.metrics.precision * 100).toFixed(1)}% | Rec: {(metrics.metrics.recall * 100).toFixed(1)}%
                    </span>
                  </div>

                  {/* Brier Skill Score */}
                  <div className="bg-neutral-50 border border-neutral-200 p-3.5 rounded-xl">
                    <div className="text-[11px] text-neutral-500 font-medium mb-1">
                      Brier Skill Score (BSS)
                    </div>
                    <div className="text-2xl font-bold font-mono text-neutral-900">
                      +{metrics.metrics.brier_skill_score}
                    </div>
                    <span className="text-[10px] text-neutral-500 block mt-1 font-mono">
                      Brier Loss: {metrics.metrics.brier_score}
                    </span>
                  </div>

                  {/* Accuracy */}
                  <div className="bg-neutral-50 border border-neutral-200 p-3.5 rounded-xl">
                    <div className="text-[11px] text-neutral-500 font-medium mb-1">
                      Holdout Accuracy
                    </div>
                    <div className="text-2xl font-bold font-mono text-neutral-900">
                      {(metrics.metrics.accuracy * 100).toFixed(1)}%
                    </div>
                    <span className="text-[10px] text-neutral-500 block mt-1 font-mono">
                      Evaluated on {metrics.test_samples} Unseen Samples
                    </span>
                  </div>
                </div>
              )}

              {/* Side-by-Side: ROC Curve & Feature Importances */}
              {metrics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  
                  {/* ROC Curve */}
                  <div className="bg-white border border-neutral-200 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                      <span className="font-semibold text-neutral-900 flex items-center gap-1.5 text-xs">
                        <Award className="h-4 w-4 text-emerald-600" />
                        Holdout ROC Curve (Unseen 2023–2024 Events)
                      </span>
                      <span className="text-xs text-emerald-600 font-mono font-bold">AUC = {metrics.metrics.auc_roc}</span>
                    </div>

                    <div className="h-[210px] w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metrics.roc_curve} margin={{ top: 5, right: 15, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="fpr" stroke="#94a3b8" tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 1]} unit=" FPR" />
                          <YAxis stroke="#94a3b8" tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 1]} unit=" TPR" />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white border border-neutral-200 p-2 rounded-lg text-[11px] font-mono shadow-md text-neutral-800">
                                    <div>FPR: {payload[0].payload.fpr}</div>
                                    <div className="text-emerald-600 font-bold">TPR: {payload[0].payload.tpr}</div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line type="monotone" dataKey="tpr" stroke="#10b981" strokeWidth={2.5} dot={false} name="LightGBM Model" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-[10px] text-neutral-500 flex justify-between pt-1">
                      <span>False Positive Rate (FPR)</span>
                      <span className="text-emerald-700">Outperforming random diagonal (AUC 0.50)</span>
                    </div>
                  </div>

                  {/* Feature Importance */}
                  <div className="bg-white border border-neutral-200 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                      <span className="font-semibold text-neutral-900 flex items-center gap-1.5 text-xs">
                        <BarChart2 className="h-4 w-4 text-neutral-500" />
                        Feature Importance (Split Gain)
                      </span>
                      <span className="text-[11px] text-neutral-500">Top Atmospheric Drivers</span>
                    </div>

                    <div className="space-y-1.5 pt-2 max-h-[210px] overflow-y-auto pr-1">
                      {metrics.feature_importances.map((f: any) => (
                        <div key={f.feature} className="p-2 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                          <span className="text-neutral-800 text-xs truncate">{f.feature}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full"
                                style={{ width: `${(f.importance / metrics.feature_importances[0].importance) * 100}%` }}
                              />
                            </div>
                            <span className="text-neutral-500 font-mono text-[11px] w-8 text-right">{f.importance}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Confusion Matrix Breakdown */}
              {metrics && (
                <div className="bg-white border border-neutral-200 p-4 rounded-xl space-y-3">
                  <span className="font-semibold text-neutral-900 text-xs block">
                    Holdout Confusion Matrix on Future Systems (Threshold = 0.50)
                  </span>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-emerald-50/50 border border-emerald-200 p-3 rounded-xl">
                      <span className="text-[10px] text-neutral-500 block uppercase font-medium">True Negatives (TN)</span>
                      <span className="text-xl font-bold font-mono text-neutral-900">{metrics.confusion_matrix.true_negatives}</span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5">Reliable forecast correctly classified</span>
                    </div>
                    <div className="bg-amber-50/50 border border-amber-200 p-3 rounded-xl">
                      <span className="text-[10px] text-neutral-500 block uppercase font-medium">False Positives (FP)</span>
                      <span className="text-xl font-bold font-mono text-amber-600">{metrics.confusion_matrix.false_positives}</span>
                      <span className="text-[10px] text-neutral-500 block mt-0.5">False bust alarms</span>
                    </div>
                    <div className="bg-rose-50/50 border border-rose-200 p-3 rounded-xl">
                      <span className="text-[10px] text-neutral-500 block uppercase font-medium">False Negatives (FN)</span>
                      <span className="text-xl font-bold font-mono text-rose-600">{metrics.confusion_matrix.false_negatives}</span>
                      <span className="text-[10px] text-neutral-500 block mt-0.5">Missed bust events</span>
                    </div>
                    <div className="bg-emerald-50/50 border border-emerald-200 p-3 rounded-xl">
                      <span className="text-[10px] text-neutral-500 block uppercase font-medium">True Positives (TP)</span>
                      <span className="text-xl font-bold font-mono text-emerald-600">{metrics.confusion_matrix.true_positives}</span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5">Bust events successfully detected</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer with Dataset Download */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-neutral-500 flex items-center gap-1.5 font-mono">
                <Database className="h-3.5 w-3.5 text-neutral-700" />
                <span>Artifact: <code className="text-neutral-900 font-semibold">bust_lgbm_model.joblib</code></span>
              </div>

              <div className="flex items-center space-x-2">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="http://localhost:8000/api/model/dataset-sample"
                  download="real_nwp_era5_events_sample.csv"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 hover:border-neutral-900 text-xs text-neutral-700 hover:text-neutral-900 transition-colors bg-white shadow-sm"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Real Event Sample (.CSV)</span>
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-black transition-colors shadow-sm"
                >
                  Close
                </motion.button>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModelValidationModal;
