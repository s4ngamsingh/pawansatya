import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  ArrowRight,
  Play,
  Pause,
  ShieldCheck,
  AlertTriangle,
  Cpu,
  Satellite,
  Layers,
  Sparkles,
  TrendingUp,
  CloudRain,
  Wind,
  Sun,
  Waves,
  Snowflake,
  ExternalLink,
  ChevronRight,
  Activity,
  CheckCircle2,
  Database
} from 'lucide-react';
import heroImage from '../assets/hero.png';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onOpenValidationModal: () => void;
}

// Custom Brand Mark: Atmospheric Isobar Vortex + Radar Vector
const BrandLogo: React.FC<{ size?: string }> = ({ size = 'h-9 w-9' }) => (
  <svg
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${size} shrink-0`}
  >
    <circle
      cx="22"
      cy="22"
      r="20"
      stroke="rgba(0, 0, 0, 0.12)"
      strokeWidth="1.5"
      strokeDasharray="3 3"
    />
    <circle
      cx="22"
      cy="22"
      r="13"
      stroke="rgba(0, 0, 0, 0.2)"
      strokeWidth="1.5"
    />
    <path
      d="M22 6C30.8366 6 38 13.1634 38 22C38 27.5 34.5 32.5 29 35C24.5 37 18 36 14 32C10 28 9.5 22 13 17C16 12.5 22 12.5 25 16C28 19.5 27 24.5 23 26C19.5 27.5 17 25 18 22"
      stroke="url(#vortexGradLanding)"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle cx="22" cy="22" r="3" fill="#ef4444" />
    <defs>
      <linearGradient id="vortexGradLanding" x1="6" y1="6" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f43f5e" />
        <stop offset="0.5" stopColor="#fb7185" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>
    </defs>
  </svg>
);

// Text Animation Variants for Kinetic Typography
const containerWords: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 * i }
  })
};

const childWord: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotateX: 30,
    filter: 'blur(6px)'
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      damping: 18,
      stiffness: 160
    }
  }
};

const textFadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchDashboard,
  onOpenValidationModal
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const systems = [
    {
      id: 'monsoon_depression',
      name: 'Monsoon Depression',
      zone: 'Bay of Bengal & Central India',
      icon: <CloudRain className="h-5 w-5 text-sky-400" />,
      desc: 'Track bifurcation and sudden heavy precipitation swath shifts across Odisha, MP, and Gujarat.'
    },
    {
      id: 'cyclone',
      name: 'Tropical Cyclones',
      zone: 'Coastal Gujarat, Odisha, AP & TN',
      icon: <Wind className="h-5 w-5 text-rose-500" />,
      desc: 'Rapid intensification, eyewall replacement cycles, and landfall location displacement.'
    },
    {
      id: 'western_disturbance',
      name: 'Western Disturbances',
      zone: 'Himalayan Foothills & NW Plains',
      icon: <Snowflake className="h-5 w-5 text-indigo-400" />,
      desc: 'Orographic precipitation spikes, catastrophic flash floods, and cloudburst unpredictability.'
    },
    {
      id: 'heat_wave',
      name: 'Severe Heat Waves',
      zone: 'Vidarbha, Rajasthan & Central India',
      icon: <Sun className="h-5 w-5 text-amber-400" />,
      desc: 'Dry soil-moisture feedback loops causing extreme temperature anomalies and duration busts.'
    },
    {
      id: 'break_monsoon',
      name: 'Active-to-Break Monsoon',
      zone: 'Indo-Gangetic Plains & Sub-Himalaya',
      icon: <Waves className="h-5 w-5 text-teal-400" />,
      desc: 'Monsoon trough shifts abruptly north to the foothills, causing sudden rain cessation in the plains.'
    },
    {
      id: 'fair_weather',
      name: 'Stable Synoptic Flow',
      zone: 'Peninsular & West India',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
      desc: 'Quasi-geostrophic balance with high model coherence and high forecast confidence.'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white overflow-x-hidden">
      
      {/* Top Floating Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BrandLogo size="h-8 w-8" />
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-neutral-900 font-sans">
                PAWAN<span className="font-light text-rose-600">SATYA</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-neutral-100 border border-neutral-200 text-neutral-600">
                SIH 2024
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-neutral-600">
            <a href="#features" className="hover:text-neutral-900 transition-colors">Capabilities</a>
            <a href="#systems" className="hover:text-neutral-900 transition-colors">Synoptic Systems</a>
            <a href="#architecture" className="hover:text-neutral-900 transition-colors">ML Architecture</a>
            <button
              onClick={onOpenValidationModal}
              className="hover:text-emerald-700 transition-colors flex items-center gap-1 font-mono text-[11px]"
            >
              <Cpu className="h-3.5 w-3.5 text-emerald-600" />
              <span>Validation (AUC 0.966)</span>
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onLaunchDashboard}
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs shadow-md hover:bg-black transition-all flex items-center space-x-2"
            >
              <span>Launch Console</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section with Cinematic Atmospheric Video */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        
        {/* Background Video with Gradient Overlays */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            poster={heroImage}
            className="w-full h-full object-cover object-center opacity-75 scale-105 transition-opacity duration-700"
          >
            <source src="/hero-video.webm" type="video/webm" />
            <source src="https://satlib.cira.colostate.edu/wp-content/uploads/sites/23/2023/10/20231007120021-20231009134021_g18_fd_geocolor_tslidia_nolablels.mp4" type="video/mp4" />
          </video>
          
          {/* Balanced Atmospheric Light Gradient Masks - keeps satellite video vividly visible while ensuring text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/35 to-neutral-50" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-white/20 to-neutral-50/70" />
          
          {/* Scanning Radar Vector Line */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: 'radial-gradient(rgba(244,63,94,0.25) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
            />
          </div>
        </div>

        {/* Video Play/Pause Floating Toggle */}
        <button
          onClick={toggleVideo}
          className="absolute bottom-8 right-8 z-20 p-2.5 rounded-full bg-white/90 border border-neutral-300 text-neutral-700 hover:text-neutral-900 backdrop-blur-md transition-all shadow-md hover:scale-105"
          title={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-neutral-900" />}
        </button>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          
          {/* Context Badge */}
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 border border-neutral-200/90 text-xs font-mono font-medium text-neutral-800 shadow-md backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-neutral-900 font-bold uppercase tracking-wider text-[11px]">Smart India Hackathon</span>
            <span className="text-neutral-300">&bull;</span>
            <span className="text-neutral-600 tracking-wide text-[11px]">AI-Based Forecast Bust Detection</span>
          </motion.div>

          {/* Main Headline with Kinetic Word Reveal */}
          <motion.div
            variants={containerWords}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <h1 className="font-display font-black tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-neutral-950 leading-[1.08]">
              <span className="block overflow-hidden py-1">
                {['Predict', 'Forecast', 'Busts'].map((word, idx) => (
                  <motion.span
                    key={idx}
                    variants={childWord}
                    className="inline-block mr-3 sm:mr-4.5"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <span className="block overflow-hidden py-1">
                {['Before', 'They', 'Strike.'].map((word, idx) => (
                  <motion.span
                    key={idx}
                    variants={childWord}
                    className="inline-block mr-3 sm:mr-4.5 bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent drop-shadow-xs"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h1>

            <motion.p
              variants={textFadeUp}
              className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-neutral-700 leading-relaxed font-sans font-normal tracking-tight pt-2"
            >
              Medium-range weather forecasts can fail dramatically during rapidly evolving cyclones, monsoon depressions, and heavy deluge events. PawanSatya compares current NWP patterns with 10-year ERA5 error behaviour, delivering region-wise confidence maps and explainable AI risk indicators from Day 1 to Day 10.
            </motion.p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLaunchDashboard}
              className="px-8 py-4 rounded-2xl bg-neutral-900 text-white font-display font-bold text-sm shadow-xl hover:bg-black transition-all flex items-center space-x-2.5 group"
            >
              <span>Launch Operational Console</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenValidationModal}
              className="px-6 py-4 rounded-2xl bg-white/95 border border-neutral-300 hover:border-emerald-500 text-neutral-800 font-display font-semibold text-sm shadow-md backdrop-blur-md transition-all flex items-center space-x-2"
            >
              <Cpu className="h-4 w-4 text-emerald-600" />
              <span>Model Holdout Validation</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                AUC 0.966
              </span>
            </motion.button>
          </motion.div>

          {/* Hero Metrics Strip */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto"
          >
            <motion.div whileHover={{ y: -3 }} className="p-4 rounded-2xl bg-white/90 border border-neutral-200 shadow-sm backdrop-blur-md text-left transition-shadow hover:shadow-md">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block font-semibold">Holdout AUC-ROC</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950">0.966</span>
              <span className="text-[11px] text-emerald-600 block mt-0.5 font-medium">+46.6% vs Climatology</span>
            </motion.div>

            <motion.div whileHover={{ y: -3 }} className="p-4 rounded-2xl bg-white/90 border border-neutral-200 shadow-sm backdrop-blur-md text-left transition-shadow hover:shadow-md">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block font-semibold">Forecast Horizon</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950">Day 1 &ndash; 10</span>
              <span className="text-[11px] text-neutral-500 block mt-0.5">Lorenz Growth Tracking</span>
            </motion.div>

            <motion.div whileHover={{ y: -3 }} className="p-4 rounded-2xl bg-white/90 border border-neutral-200 shadow-sm backdrop-blur-md text-left transition-shadow hover:shadow-md">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block font-semibold">IMD Subdivisions</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950">36 Regions</span>
              <span className="text-[11px] text-neutral-500 block mt-0.5">ESRI Satellite Layer</span>
            </motion.div>

            <motion.div whileHover={{ y: -3 }} className="p-4 rounded-2xl bg-white/90 border border-neutral-200 shadow-sm backdrop-blur-md text-left transition-shadow hover:shadow-md">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block font-semibold">Ground Truth</span>
              <span className="text-2xl sm:text-3xl font-bold text-neutral-950 font-mono">ERA5 + GFS</span>
              <span className="text-[11px] text-neutral-500 block mt-0.5 font-mono">Time-Based Split</span>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* Core Capabilities Section */}
      <section id="features" className="py-24 bg-white border-t border-neutral-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto space-y-3 mb-16"
          >
            <span className="text-xs font-mono font-bold text-rose-600 uppercase tracking-[0.2em] block">
              Engineered for Operational Meteorologists
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight font-display">
              Five Pillars of Forecast Bust Detection
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans">
              Designed specifically to meet and exceed every technical deliverable outlined in the Smart India Hackathon problem statement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200 hover:border-neutral-300 hover:bg-white transition-all space-y-3 flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center shadow-xs">
                  <Satellite className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-neutral-950 font-display tracking-tight">
                  High-Resolution Satellite Confidence Map
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                  Interactive ESRI World Imagery basemap covering all 36 IMD meteorological subdivisions. Red/Green/Amber color-coded polygons immediately highlight areas where NWP guidance is unreliable.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-200 text-[11px] font-mono text-neutral-500 font-medium">
                Deliverable 1 &bull; Region-wise Confidence Map
              </div>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200 hover:border-neutral-300 hover:bg-white transition-all space-y-3 flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center shadow-xs">
                  <TrendingUp className="h-5 w-5 text-rose-600" />
                </div>
                <h3 className="text-lg font-bold text-neutral-950 font-display tracking-tight">
                  Day 1 to Day 10 Lead-Time Scrubber
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                  Models the chaotic error growth trajectory using Lorenz atmospheric dynamics. Identify the exact bifurcation window (e.g. Day 4 vs Day 7) where model spread explodes.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-200 text-[11px] font-mono text-neutral-500 font-medium">
                Deliverable 2 &bull; Forecast Bust Probability
              </div>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200 hover:border-neutral-300 hover:bg-white transition-all space-y-3 flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center shadow-xs">
                  <Layers className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-neutral-950 font-display tracking-tight">
                  Explainable AI (SHAP Waterfall)
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                  Transparent meteorological reasoning: inspect exact physical feature attributions including CAPE, 0–6km deep-layer wind shear, Z500 geopotential vorticity, and moisture flux convergence.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-200 text-[11px] font-mono text-neutral-500 font-medium">
                Deliverable 3 &bull; Key Reasons / XAI
              </div>
            </motion.div>

            {/* Pillar 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200 hover:border-neutral-300 hover:bg-white transition-all space-y-3 flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center shadow-xs">
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                </div>
                <h3 className="text-lg font-bold text-neutral-950 font-display tracking-tight">
                  Ranked Error-Prone Hotspot Detection
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                  Automated detection and ranking of subdivisions exceeding critical bust thresholds (&ge;65%). Includes estimated track displacement error (&plusmn;km) and precipitation magnitude error (&plusmn;mm).
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-200 text-[11px] font-mono text-neutral-500 font-medium">
                Deliverable 4 &bull; Error-Prone Area Detection
              </div>
            </motion.div>

            {/* Pillar 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200 hover:border-neutral-300 hover:bg-white transition-all space-y-3 flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center shadow-xs">
                  <Database className="h-5 w-5 text-sky-600" />
                </div>
                <h3 className="text-lg font-bold text-neutral-950 font-display tracking-tight">
                  NWP vs. Historical Error Comparator
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                  Benchmarks current multi-model spread (GFS, ECMWF IFS, NCUM, GEFS) against 10-year ERA5 historical forecast error distributions to detect systematic model biases.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-200 text-[11px] font-mono text-neutral-500 font-medium">
                Deliverable 5 &bull; Historical Comparison
              </div>
            </motion.div>

            {/* Pillar 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200 hover:border-neutral-300 hover:bg-white transition-all space-y-3 flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center shadow-xs">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-neutral-950 font-display tracking-tight">
                  Operational Bulletin Generator
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                  Generates ready-to-print official meteorological briefing bulletins for disaster managers, state authorities, and operational forecasters with actionable risk directives.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-200 text-[11px] font-mono text-neutral-500 font-medium">
                Operational Forecaster Advisory
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Rapidly Evolving Atmospheric Systems Section */}
      <section id="systems" className="py-24 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto space-y-3 mb-16"
          >
            <span className="text-xs font-mono font-bold text-rose-600 uppercase tracking-[0.2em] block">
              Problem Statement Benchmark Events
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight font-display">
              Calibrated on India&apos;s Most Volatile Weather
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans">
              Trained on actual historical systems (&le;2022) and validated on completely unseen future events (&ge;2023) across India&apos;s 6 critical synoptic regimes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {systems.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 transition-all space-y-3 shadow-xs hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-neutral-100 border border-neutral-200">
                    {s.icon}
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-neutral-500 uppercase tracking-wider">
                    {s.zone.split('&')[0]}
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-neutral-950 font-display">{s.name}</h4>
                  <span className="text-xs text-neutral-500 font-sans font-medium">{s.zone}</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLaunchDashboard}
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-neutral-900 text-white font-display font-bold text-xs shadow-md hover:bg-black transition-all"
            >
              <span>Test All 6 Regimes in Console</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ML Pipeline & Architecture Section */}
      <section id="architecture" className="py-24 bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto space-y-3 mb-16"
          >
            <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-[0.2em] block">
              Scientifically Rigorous &bull; No Synthetic Shortcuts
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight font-display">
              End-to-End AI/ML Architecture
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans">
              How real NWP model forecasts, ECMWF ERA5 reanalysis ground truth, and LightGBM GBDT combine into operational intelligence.
            </p>
          </motion.div>

          {/* Workflow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              whileHover={{ y: -3 }}
              className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 relative shadow-xs hover:bg-white transition-all"
            >
              <span className="text-xs font-mono text-emerald-700 font-bold tracking-wider block">STEP 01</span>
              <h4 className="text-sm font-bold text-neutral-950 font-display">Real Data Ingestion</h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Ingests real NOAA GFS operational runs (CAPE, winds at 850/500hPa, Z500, RH) alongside ECMWF ERA5 gridded reanalysis ground truth.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12 }}
              whileHover={{ y: -3 }}
              className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 relative shadow-xs hover:bg-white transition-all"
            >
              <span className="text-xs font-mono text-emerald-700 font-bold tracking-wider block">STEP 02</span>
              <h4 className="text-sm font-bold text-neutral-950 font-display">Physical Feature Extraction</h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Computes deep-layer shear (|V500 - V850|), Eady baroclinic growth rate (&sigma;<sub>BI</sub>), and 500hPa geopotential thickness wave anomalies.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.19 }}
              whileHover={{ y: -3 }}
              className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 relative shadow-xs hover:bg-white transition-all"
            >
              <span className="text-xs font-mono text-emerald-700 font-bold tracking-wider block">STEP 03</span>
              <h4 className="text-sm font-bold text-neutral-950 font-display">LightGBM GBDT Classifier</h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Trained on historical systems (&le;2022) with a strict time-based split. Evaluated on unseen 2023–2024 systems achieving AUC 0.966.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.26 }}
              whileHover={{ y: -3 }}
              className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 relative shadow-xs hover:bg-white transition-all"
            >
              <span className="text-xs font-mono text-emerald-700 font-bold tracking-wider block">STEP 04</span>
              <h4 className="text-sm font-bold text-neutral-950 font-display">SHAP XAI & Decision Support</h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Real `TreeExplainer` computes exact feature attribution weights for forecasters, with automatic bulletin generation.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer Call to Action Banner */}
      <section className="py-24 bg-gradient-to-b from-neutral-50 to-neutral-100 border-t border-neutral-200">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6"
        >
          <BrandLogo size="h-12 w-12 mx-auto" />
          <h2 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight font-display">
            Ready to Explore the Forecast Bust Detection System?
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base max-w-2xl mx-auto font-sans leading-relaxed">
            Experience the full operational console with ESRI high-resolution satellite imagery, interactive lead-time scrubbers, and live SHAP meteorological explainability.
          </p>
          <div className="pt-3">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLaunchDashboard}
              className="px-8 py-4 rounded-2xl bg-neutral-900 text-white font-display font-bold text-sm shadow-xl hover:bg-black transition-all inline-flex items-center space-x-2.5"
            >
              <span>Launch Operational Console</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-neutral-900 font-semibold">PAWANSATYA SYSTEM</span>
            <span>&bull;</span>
            <span>Smart India Hackathon (SIH 2024)</span>
          </div>
          <div className="text-neutral-500 font-mono text-[11px]">
            AI-Based Forecast Bust Detection for Medium-Range Weather Forecasts
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
