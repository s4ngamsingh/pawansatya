import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      stroke="rgba(255, 255, 255, 0.15)"
      strokeWidth="1.5"
      strokeDasharray="3 3"
    />
    <circle
      cx="22"
      cy="22"
      r="13"
      stroke="rgba(255, 255, 255, 0.25)"
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
        <stop offset="1" stopColor="#ffffff" />
      </linearGradient>
    </defs>
  </svg>
);

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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* Top Floating Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BrandLogo size="h-8 w-8" />
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-white font-sans">
                PAWAN<span className="font-light text-rose-500">SATYA</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400">
                SIH 2024
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#systems" className="hover:text-white transition-colors">Synoptic Systems</a>
            <a href="#architecture" className="hover:text-white transition-colors">ML Architecture</a>
            <button
              onClick={onOpenValidationModal}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-mono text-[11px]"
            >
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
              <span>Validation (AUC 0.966)</span>
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onLaunchDashboard}
              className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs shadow-lg hover:bg-neutral-200 transition-all flex items-center space-x-2"
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
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            poster={heroImage}
            className="w-full h-full object-cover object-center opacity-40 scale-105"
            src="https://svs.gsfc.nasa.gov/vis/a010000/a012600/a012635/12635_Hurricane_Matthew_twitter_720.mp4"
          />
          
          {/* Subtle Atmospheric Gradient Masks */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/65 to-neutral-950/80" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-neutral-950/50 to-neutral-950" />
          
          {/* Scanning Radar Vector Line */}
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: 'radial-gradient(rgba(244,63,94,0.15) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
            />
          </div>
        </div>

        {/* Video Play/Pause Floating Toggle */}
        <button
          onClick={toggleVideo}
          className="absolute bottom-8 right-8 z-20 p-2.5 rounded-full bg-neutral-900/80 border border-neutral-700/80 text-neutral-300 hover:text-white backdrop-blur-md transition-all shadow-lg hover:scale-105"
          title={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
        </button>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-7">
          
          {/* Context Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs font-medium text-neutral-300 shadow-xl backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-white font-semibold">Smart India Hackathon</span>
            <span className="text-neutral-600">&bull;</span>
            <span className="text-neutral-400">AI-Based Forecast Bust Detection</span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white font-sans leading-[1.1]">
              Predict Forecast Busts <br />
              <span className="bg-gradient-to-r from-rose-500 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
                Before They Strike.
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
              Medium-range weather forecasts can fail dramatically during rapidly evolving cyclones, monsoon depressions, and heavy deluge events. PawanSatya compares current NWP patterns with 10-year ERA5 error behaviour, delivering region-wise confidence maps and explainable AI risk indicators from Day 1 to Day 10.
            </p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLaunchDashboard}
              className="px-8 py-4 rounded-2xl bg-white text-black font-bold text-sm shadow-2xl hover:bg-neutral-100 transition-all flex items-center space-x-2.5 group"
            >
              <span>Launch Operational Console</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenValidationModal}
              className="px-6 py-4 rounded-2xl bg-neutral-900/90 border border-neutral-700/80 hover:border-emerald-500/50 text-white font-medium text-sm shadow-lg backdrop-blur-md transition-all flex items-center space-x-2"
            >
              <Cpu className="h-4 w-4 text-emerald-400" />
              <span>Model Holdout Validation</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-bold border border-emerald-800/40">
                AUC 0.966
              </span>
            </motion.button>
          </motion.div>

          {/* Hero Metrics Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto"
          >
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md text-left">
              <span className="text-[11px] text-neutral-400 block font-medium">Holdout AUC-ROC</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white">0.966</span>
              <span className="text-[11px] text-emerald-400 block mt-0.5 font-medium">+46.6% vs Climatology</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md text-left">
              <span className="text-[11px] text-neutral-400 block font-medium">Forecast Horizon</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white">Day 1 &ndash; 10</span>
              <span className="text-[11px] text-neutral-400 block mt-0.5">Lorenz Growth Tracking</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md text-left">
              <span className="text-[11px] text-neutral-400 block font-medium">IMD Subdivisions</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white">36 Regions</span>
              <span className="text-[11px] text-neutral-400 block mt-0.5">ESRI Satellite Layer</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md text-left">
              <span className="text-[11px] text-neutral-400 block font-medium">Ground Truth</span>
              <span className="text-2xl sm:text-3xl font-bold text-white font-mono">ERA5 + GFS</span>
              <span className="text-[11px] text-neutral-400 block mt-0.5 font-mono">Time-Based Split</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Core Capabilities Section */}
      <section id="features" className="py-20 bg-neutral-950 border-t border-neutral-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider">
              Engineered for Operational Meteorologists
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
              Five Pillars of Forecast Bust Detection
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Designed specifically to meet and exceed every technical deliverable outlined in the Smart India Hackathon problem statement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                  <Satellite className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white font-sans">
                  High-Resolution Satellite Confidence Map
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Interactive ESRI World Imagery basemap covering all 36 IMD meteorological subdivisions. Red/Green/Amber color-coded polygons immediately highlight areas where NWP guidance is unreliable.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-800/80 text-[11px] font-mono text-neutral-500">
                Deliverable 1 &bull; Region-wise Confidence Map
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-rose-400" />
                </div>
                <h3 className="text-lg font-bold text-white font-sans">
                  Day 1 to Day 10 Lead-Time Scrubber
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Models the chaotic error growth trajectory using Lorenz atmospheric dynamics. Identify the exact bifurcation window (e.g. Day 4 vs Day 7) where model spread explodes.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-800/80 text-[11px] font-mono text-neutral-500">
                Deliverable 2 &bull; Forecast Bust Probability
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white font-sans">
                  Explainable AI (SHAP Waterfall)
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Transparent meteorological reasoning: inspect exact physical feature attributions including CAPE, 0–6km deep-layer wind shear, Z500 geopotential vorticity, and moisture flux convergence.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-800/80 text-[11px] font-mono text-neutral-500">
                Deliverable 3 &bull; Key Reasons / XAI
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-rose-500" />
                </div>
                <h3 className="text-lg font-bold text-white font-sans">
                  Ranked Error-Prone Hotspot Detection
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Automated detection and ranking of subdivisions exceeding critical bust thresholds (&ge;65%). Includes estimated track displacement error (&plusmn;km) and precipitation magnitude error (&plusmn;mm).
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-800/80 text-[11px] font-mono text-neutral-500">
                Deliverable 4 &bull; Error-Prone Area Detection
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                  <Database className="h-5 w-5 text-sky-400" />
                </div>
                <h3 className="text-lg font-bold text-white font-sans">
                  NWP vs. Historical Error Comparator
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Benchmarks current multi-model spread (GFS, ECMWF IFS, NCUM, GEFS) against 10-year ERA5 historical forecast error distributions to detect systematic model biases.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-800/80 text-[11px] font-mono text-neutral-500">
                Deliverable 5 &bull; Historical Comparison
              </div>
            </div>

            {/* Pillar 6 */}
            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white font-sans">
                  Operational Bulletin Generator
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Generates ready-to-print official meteorological briefing bulletins for disaster managers, state authorities, and operational forecasters with actionable risk directives.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-800/80 text-[11px] font-mono text-neutral-500">
                Operational Forecaster Advisory
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Rapidly Evolving Atmospheric Systems Section */}
      <section id="systems" className="py-20 bg-neutral-900/40 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider">
              Problem Statement Benchmark Events
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
              Calibrated on India&apos;s Most Volatile Weather
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Trained on actual historical systems (&le;2022) and validated on completely unseen future events (&ge;2023) across India&apos;s 6 critical synoptic regimes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {systems.map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800/90 hover:border-neutral-700 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                    {s.icon}
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">
                    {s.zone.split('&')[0]}
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-sans">{s.name}</h4>
                  <span className="text-xs text-neutral-400 font-medium">{s.zone}</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLaunchDashboard}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-xs shadow-lg hover:bg-neutral-200 transition-all"
            >
              <span>Test All 6 Regimes in Console</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ML Pipeline & Architecture Section */}
      <section id="architecture" className="py-20 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
              Scientifically Rigorous &bull; No Synthetic Shortcuts
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
              End-to-End AI/ML Architecture
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              How real NWP model forecasts, ECMWF ERA5 reanalysis ground truth, and LightGBM GBDT combine into operational intelligence.
            </p>
          </div>

          {/* Workflow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2 relative">
              <span className="text-xs font-mono text-emerald-400 font-bold block">STEP 01</span>
              <h4 className="text-sm font-bold text-white font-sans">Real Data Ingestion</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Ingests real NOAA GFS operational runs (CAPE, winds at 850/500hPa, Z500, RH) alongside ECMWF ERA5 gridded reanalysis ground truth.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2 relative">
              <span className="text-xs font-mono text-emerald-400 font-bold block">STEP 02</span>
              <h4 className="text-sm font-bold text-white font-sans">Physical Feature Extraction</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Computes deep-layer shear (|V500 - V850|), Eady baroclinic growth rate (&sigma;<sub>BI</sub>), and 500hPa geopotential thickness wave anomalies.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2 relative">
              <span className="text-xs font-mono text-emerald-400 font-bold block">STEP 03</span>
              <h4 className="text-sm font-bold text-white font-sans">LightGBM GBDT Classifier</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Trained on historical systems (&le;2022) with a strict time-based split. Evaluated on unseen 2023–2024 systems achieving AUC 0.966.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2 relative">
              <span className="text-xs font-mono text-emerald-400 font-bold block">STEP 04</span>
              <h4 className="text-sm font-bold text-white font-sans">SHAP XAI & Decision Support</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Real `TreeExplainer` computes exact feature attribution weights for forecasters, with automatic bulletin generation.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer Call to Action Banner */}
      <section className="py-16 bg-gradient-to-b from-neutral-950 to-neutral-900 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <BrandLogo size="h-12 w-12 mx-auto" />
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
            Ready to Explore the Forecast Bust Detection System?
          </h2>
          <p className="text-neutral-400 text-sm max-w-2xl mx-auto">
            Experience the full operational console with ESRI high-resolution satellite imagery, interactive lead-time scrubbers, and live SHAP meteorological explainability.
          </p>
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLaunchDashboard}
              className="px-8 py-4 rounded-2xl bg-white text-black font-bold text-sm shadow-2xl hover:bg-neutral-100 transition-all inline-flex items-center space-x-2.5"
            >
              <span>Launch Operational Console</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-white font-semibold">PAWANSATYA SYSTEM</span>
            <span>&bull;</span>
            <span>Smart India Hackathon (SIH 2024)</span>
          </div>
          <div className="text-neutral-400 font-mono text-[11px]">
            AI-Based Forecast Bust Detection for Medium-Range Weather Forecasts
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
