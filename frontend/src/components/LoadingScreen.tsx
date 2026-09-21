import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  durationMs = 2600
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [statusIndex, setStatusIndex] = useState<number>(0);

  const statusMessages = [
    'Initializing IMD 36 Subdivision Geometries...',
    'Calibrating ECMWF IFS & GFS Ensemble Feeds...',
    'Loading LightGBM Bust Predictor Weights...',
    'Synchronizing Lorenz Error Growth Curves...',
    'PawanSatya System Ready & Operational.'
  ];

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      const sIdx = Math.min(
        statusMessages.length - 1,
        Math.floor((elapsed / durationMs) * statusMessages.length)
      );
      setStatusIndex(sIdx);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        setTimeout(onComplete, 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-white via-neutral-50 to-neutral-100 p-6 select-none"
    >
      {/* Subtle background atmospheric contour ripples */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neutral-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-xl flex flex-col items-center">
        {/* Splash Image Card with Framer Motion reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-white rounded-3xl p-3 sm:p-4 shadow-2xl border border-neutral-200/80 overflow-hidden relative"
        >
          <img
            src="/pawansatya-splash.jpg"
            alt="PawanSatya - AI-Driven Forecast Reliability & Bust Detection"
            className="w-full h-auto object-cover rounded-2xl"
          />

          {/* Subtle shimmer effect across the image card */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
          />
        </motion.div>

        {/* Progress bar container */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-md mt-6 space-y-2.5"
        >
          {/* Progress bar track */}
          <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-rose-600 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          {/* Status and Percentage */}
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span className="truncate max-w-[280px]">
              {statusMessages[statusIndex]}
            </span>
            <span className="text-neutral-900 font-bold ml-2">
              {progress}%
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
