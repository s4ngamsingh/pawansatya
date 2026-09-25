import React, { useState, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  Play,
  Pause,
  AlertTriangle,
  Cpu,
  Satellite,
  Layers,
  TrendingUp,
  CloudRain,
  Wind,
  Sun,
  Waves,
  Snowflake,
  CheckCircle2,
  Eye,
  Radio
} from 'lucide-react';
import heroImage from '../assets/hero.png';
import spcOutlookSample from '../assets/spc_outlook_sample.webp';
import cycloneSatellite from '../assets/cyclone_satellite_hires.jpg';
import radarStreamline from '../assets/radar_streamline_vortex.jpg';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onOpenValidationModal: () => void;
}

// Newspaper Brand Masthead Logo - Compact & Refined Editorial Proportion
const NewspaperMasthead: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center py-2 sm:py-2.5">
    {/* Top Gazette Edition Strip */}
    <div className="w-full flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-neutral-600 border-b border-[#111111] pb-1 mb-1.5 px-1">
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        <span className="font-bold text-[#111111]">VOL. XXIV NO. 142</span>
        <span>&bull;</span>
        <span className="hidden sm:inline">SMART INDIA HACKATHON EDITION</span>
        <span className="sm:hidden">SIH EDITION</span>
      </div>
      <div className="hidden md:flex items-center space-x-2 font-semibold text-neutral-700">
        <span>NEW DELHI</span>
        <span>&bull;</span>
        <span>MINISTRY OF EARTH SCIENCES / IMD / NCMRWF</span>
      </div>
      <div className="flex items-center space-x-1.5 font-bold text-[#111111]">
        <span className="inline-block w-1.5 h-1.5 bg-[#CC0000]" />
        <span>RS. 5.00 / FREE DIGITAL ARCHIVE</span>
      </div>
    </div>

    {/* Refined Proportional Newspaper Title */}
    <div className="py-0.5">
      <h1 className="font-serif font-black text-2xl sm:text-3xl md:text-5xl tracking-tight text-[#111111] leading-none uppercase">
        PAWAN<span className="text-[#CC0000]">SATYA</span>
      </h1>
      <p className="font-serif italic text-[10px] sm:text-xs text-neutral-600 mt-0.5 tracking-wider uppercase">
        &ldquo;The National Gazette of Synoptic Weather Bust Intelligence & Medium-Range NWP Verification&rdquo;
      </p>
    </div>
  </div>
);

// Kinetic Text Animations with snappy mechanical feel
const containerWords: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 * i }
  })
};

const childWord: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1]
    }
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
      num: '01',
      name: 'Monsoon Depression',
      zone: 'Bay of Bengal & Central India',
      icon: <CloudRain className="h-5 w-5 stroke-1" />,
      desc: 'Track bifurcation and sudden heavy precipitation swath shifts across Odisha, MP, and Gujarat, causing sudden regional forecast misses.'
    },
    {
      id: 'cyclone',
      num: '02',
      name: 'Tropical Cyclones',
      zone: 'Coastal Gujarat, Odisha, AP & TN',
      icon: <Wind className="h-5 w-5 stroke-1" />,
      desc: 'Rapid intensification dynamics, eyewall replacement cycles, and landfall location displacement exceeding standard NWP error bounds.'
    },
    {
      id: 'western_disturbance',
      num: '03',
      name: 'Western Disturbances',
      zone: 'Himalayan Foothills & NW Plains',
      icon: <Snowflake className="h-5 w-5 stroke-1" />,
      desc: 'Orographic precipitation spikes, catastrophic flash floods, and cloudburst unpredictability over Himachal and Uttarakhand.'
    },
    {
      id: 'heat_wave',
      num: '04',
      name: 'Severe Heat Waves',
      zone: 'Vidarbha, Rajasthan & Central India',
      icon: <Sun className="h-5 w-5 stroke-1" />,
      desc: 'Dry soil-moisture feedback loops causing extreme temperature anomalies and duration busts exceeding 45°C thresholds.'
    },
    {
      id: 'break_monsoon',
      num: '05',
      name: 'Active-to-Break Monsoon',
      zone: 'Indo-Gangetic Plains & Sub-Himalaya',
      icon: <Waves className="h-5 w-5 stroke-1" />,
      desc: 'Monsoon trough shifts abruptly north to the Himalayan foothills, causing sudden rain cessation in the agricultural heartland.'
    },
    {
      id: 'fair_weather',
      num: '06',
      name: 'Stable Synoptic Flow',
      zone: 'Peninsular & West India',
      icon: <CheckCircle2 className="h-5 w-5 stroke-1" />,
      desc: 'Quasi-geostrophic balance with high multi-model coherence and low bust probability across operational lead times.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#111111] flex flex-col font-body selection:bg-[#111111] selection:text-[#F9F9F7] sharp-corners">
      
      {/* Top Broadsheet Masthead */}
      <header className="w-full bg-[#F9F9F7] border-b-2 border-[#111111] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <NewspaperMasthead />

          {/* Running News Ticker Bar - Slim & High Density */}
          <div className="py-1 sm:py-1.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono border-t border-[#111111] bg-[#F9F9F7]">
            <div className="flex items-center space-x-2.5 w-full sm:w-auto overflow-hidden">
              <span className="bg-[#CC0000] text-[#F9F9F7] font-bold px-1.5 py-0.5 tracking-wider shrink-0 uppercase text-[9px] sm:text-[10px]">
                BREAKING BULLETIN
              </span>
              <p className="truncate text-neutral-800 font-mono text-[10px] sm:text-[11px]">
                NWP BUST ALERT: Day 4 Lorenz spread explosion detected over Bay of Bengal trough &bull; Holdout Model AUC 0.966 &bull; GFS vs ERA5 Analog
              </p>
            </div>

            {/* Quick Editorial Nav Buttons */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={onOpenValidationModal}
                className="px-2.5 py-1 border border-[#111111] bg-transparent hover:bg-[#111111] hover:text-[#F9F9F7] transition-colors font-mono uppercase text-[10px] font-semibold flex items-center space-x-1"
              >
                <Cpu className="h-3 w-3" />
                <span>Validation (AUC 0.966)</span>
              </button>
              
              <button
                onClick={onLaunchDashboard}
                className="px-3 py-1 bg-[#111111] text-[#F9F9F7] border border-[#111111] hover:bg-[#F9F9F7] hover:text-[#111111] font-mono uppercase text-[10px] font-bold transition-all flex items-center space-x-1 hard-shadow-hover"
              >
                <span>Launch Console</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Front Page Article with Highly Visible Atmospheric Video */}
      <section className="relative border-b-4 border-[#111111] overflow-hidden min-h-[92vh] flex items-center justify-center">
        
        {/* Background Atmospheric Video - Vivid and Clearly Visible */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            poster={heroImage}
            className="w-full h-full object-cover object-center opacity-85 scale-100"
          >
            <source src="/hero-video.webm" type="video/webm" />
            <source src="https://satlib.cira.colostate.edu/wp-content/uploads/sites/23/2023/10/20231007120021-20231009134021_g18_fd_geocolor_tslidia_nolablels.mp4" type="video/mp4" />
          </video>
          
          {/* Subtle Top & Bottom Vignette Mask to blend with masthead and metrics */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F9F9F7]/70 via-transparent to-[#F9F9F7]/95" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Video Toggle Control */}
        <button
          onClick={toggleVideo}
          className="absolute top-4 right-4 z-30 px-3 py-1.5 bg-[#F9F9F7] border-2 border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F9F9F7] transition-all font-mono text-[10px] uppercase font-bold flex items-center space-x-1.5 hard-shadow-sm shadow-md"
          title={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
        >
          {isPlaying ? (
            <>
              <Pause className="h-3.5 w-3.5" />
              <span>PAUSE SATELLITE REEL</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              <span>RUN SATELLITE REEL</span>
            </>
          )}
        </button>

        {/* Hero Broadsheet Headline Content Framed in Sharp Front-Page Dispatch Plate */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full">
          
          {/* Front Page Dispatch Panel with Translucent Paper Backing */}
          <div className="bg-[#F9F9F7]/92 border-2 border-[#111111] p-6 sm:p-10 max-w-5xl mx-auto shadow-2xl backdrop-blur-xs hard-shadow-lg text-center space-y-6">
            
            {/* Top Category Badge */}
            <div className="inline-flex items-center space-x-2 border-y border-[#111111] py-1 px-4 text-xs font-mono uppercase tracking-widest text-[#111111] bg-[#F9F9F7]">
              <span className="w-2.5 h-2.5 bg-[#CC0000]" />
              <span className="font-bold">OPERATIONAL METEOROLOGY ADVISORY</span>
              <span>&bull;</span>
              <span className="text-neutral-600">MEDIUM-RANGE FORECAST RELIABILITY REPORT</span>
            </div>

            {/* Massive Serif H1 */}
            <motion.div
              variants={containerWords}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              <h1 className="font-serif font-black text-4xl sm:text-6xl lg:text-8xl text-[#111111] leading-[0.92] tracking-tighter uppercase">
                <span className="block overflow-hidden py-1">
                  {['PREDICT', 'FORECAST', 'BUSTS'].map((word, idx) => (
                    <motion.span
                      key={idx}
                      variants={childWord}
                      className="inline-block mr-2 sm:mr-3.5"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
                <span className="block overflow-hidden py-1 text-[#CC0000]">
                  {['BEFORE', 'THEY', 'STRIKE.'].map((word, idx) => (
                    <motion.span
                      key={idx}
                      variants={childWord}
                      className="inline-block mr-2 sm:mr-3.5 underline decoration-[#111111] underline-offset-8"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </h1>
            </motion.div>

            {/* Front Page Article Lead with Drop Cap */}
            <div className="max-w-4xl mx-auto pt-3 border-t border-[#111111] text-left">
              <p className="drop-cap-red text-base sm:text-lg text-neutral-800 leading-relaxed font-body text-justify">
                Numerical Weather Prediction models encounter critical forecast busts when volatile atmospheric regimes—such as monsoonal depressions, orographic cloudbursts, and rapid cyclonic escalations—undergo non-linear error growth. PawanSatya cross-examines incoming NWP model runs against ten years of empirical ERA5 reanalysis errors, isolating catastrophic bifurcations and empowering forecasters with high-resolution confidence maps and explainable AI diagnostics from Day 1 to Day 10.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onLaunchDashboard}
                className="px-8 py-4 bg-[#111111] text-[#F9F9F7] border border-[#111111] hover:bg-[#F9F9F7] hover:text-[#111111] font-mono font-bold uppercase tracking-widest text-xs transition-all flex items-center space-x-2.5 hard-shadow-hover"
              >
                <span>OPEN OPERATIONAL CONSOLE</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onOpenValidationModal}
                className="px-6 py-4 border-2 border-[#111111] bg-[#F9F9F7] text-[#111111] hover:bg-[#111111] hover:text-[#F9F9F7] font-mono font-semibold uppercase tracking-widest text-xs transition-all flex items-center space-x-2 hard-shadow-hover"
              >
                <Cpu className="h-4 w-4 text-[#CC0000]" />
                <span>INSPECT MODEL HOLDOUT DATA</span>
                <span className="bg-[#CC0000] text-white px-1.5 py-0.5 text-[10px] font-bold">
                  AUC 0.966
                </span>
              </button>
            </div>

          </div>

          {/* 4-Column Broadsheet Metrics Strip */}
          <div className="mt-8 max-w-5xl mx-auto border-2 border-[#111111] bg-[#F9F9F7] grid grid-cols-2 md:grid-cols-4 hard-shadow-sm">
            
            <div className="p-4 border-r border-b md:border-b-0 border-[#111111] hover:bg-neutral-100 transition-colors">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-600 block">
                METRIC I &bull; ROC-AUC
              </span>
              <span className="font-serif font-black text-3xl sm:text-4xl text-[#111111] block mt-1">
                0.966
              </span>
              <span className="text-xs font-mono text-[#CC0000] font-semibold block mt-0.5">
                +46.6% vs Climatology
              </span>
            </div>

            <div className="p-4 border-b md:border-b-0 md:border-r border-[#111111] hover:bg-neutral-100 transition-colors">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-600 block">
                METRIC II &bull; HORIZON
              </span>
              <span className="font-serif font-black text-3xl sm:text-4xl text-[#111111] block mt-1">
                DAY 1&ndash;10
              </span>
              <span className="text-xs font-mono text-neutral-600 block mt-0.5">
                Lorenz Bifurcation Curve
              </span>
            </div>

            <div className="p-4 border-r border-[#111111] hover:bg-neutral-100 transition-colors">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-600 block">
                METRIC III &bull; COVERAGE
              </span>
              <span className="font-serif font-black text-3xl sm:text-4xl text-[#111111] block mt-1">
                36 ZONES
              </span>
              <span className="text-xs font-mono text-neutral-600 block mt-0.5">
                All IMD Subdivisions
              </span>
            </div>

            <div className="p-4 hover:bg-neutral-100 transition-colors">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-600 block">
                METRIC IV &bull; GROUND TRUTH
              </span>
              <span className="font-serif font-black text-3xl sm:text-4xl text-[#111111] block mt-1">
                ERA5+GFS
              </span>
              <span className="text-xs font-mono text-neutral-600 block mt-0.5">
                Time-Based Split
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* Visual Plate Comparative Section: Satellite Ground Truth vs NWP Streamlines */}
      <section className="py-16 border-b-4 border-[#111111] bg-white newsprint-texture">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="border-b-2 border-[#111111] pb-3 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#CC0000] block">
                OBSERVATIONAL EVIDENCE &bull; SATELLITE VS. NUMERICAL PREDICTION
              </span>
              <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#111111] tracking-tight uppercase mt-1">
                Where Forecast Guidance Diverges from Reality
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-body text-neutral-600 max-w-md text-justify">
              Examining empirical satellite spiraling dynamics alongside multi-model Doppler wind streamline reflectivity vortices.
            </p>
          </div>

          {/* 2-Column Broadside Photographic Spreads */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Plate A: High-Resolution Tropical Cyclone Satellite */}
            <div className="border-2 border-[#111111] bg-[#F9F9F7] p-3 hard-shadow hover:bg-neutral-50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#111111] pb-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="bg-[#111111] text-[#F9F9F7] font-mono text-[10px] font-bold px-2 py-0.5 uppercase">
                      PLATE NO. 1.1
                    </span>
                    <span className="font-serif font-bold text-sm text-[#111111] uppercase">
                      Geostationary Cyclone Eyewall Spiral
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#CC0000] font-bold uppercase">
                    GROUND TRUTH
                  </span>
                </div>

                <div className="border border-[#111111] overflow-hidden bg-black">
                  <img
                    src={cycloneSatellite}
                    alt="High resolution geostationary satellite imagery of intense tropical cyclone eyewall"
                    className="w-full h-80 object-cover object-center hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="pt-3 space-y-1.5">
                  <span className="text-[11px] font-mono text-[#111111] font-bold uppercase block">
                    OBSERVED INTENSIFICATION & ASYMMETRIC RAINBANDS
                  </span>
                  <p className="text-xs font-body text-neutral-700 leading-relaxed text-justify">
                    High-resolution visible satellite capture of a mature category cyclone making landfall. Dense cirrus outflow shields and concentrated eyewall convection frequently lead to rapid track displacement and intensity busts in raw NWP physics schemes.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-[#111111] text-[10px] font-mono text-neutral-600 flex items-center justify-between">
                <span>IMD REGIME: TROPICAL CYCLONE BENCHMARK</span>
                <span className="font-bold text-[#CC0000]">AUC 0.971</span>
              </div>
            </div>

            {/* Plate B: Doppler Radar & NWP Wind Streamlines */}
            <div className="border-2 border-[#111111] bg-[#F9F9F7] p-3 hard-shadow hover:bg-neutral-50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#111111] pb-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="bg-[#CC0000] text-white font-mono text-[10px] font-bold px-2 py-0.5 uppercase">
                      PLATE NO. 1.2
                    </span>
                    <span className="font-serif font-bold text-sm text-[#111111] uppercase">
                      NWP Doppler Wind Streamline Vortex
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#111111] font-bold uppercase">
                    MODEL SIMULATION
                  </span>
                </div>

                <div className="border border-[#111111] overflow-hidden bg-black">
                  <img
                    src={radarStreamline}
                    alt="NWP model forecast wind streamlines and convective precipitation reflectivity vortex"
                    className="w-full h-80 object-cover object-center hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="pt-3 space-y-1.5">
                  <span className="text-[11px] font-mono text-[#111111] font-bold uppercase block">
                    MULTI-MODEL STREAMLINE & PRECIPITATION REFLECTIVITY
                  </span>
                  <p className="text-xs font-body text-neutral-700 leading-relaxed text-justify">
                    Doppler radar velocity streamlines overlaid onto multi-tier precipitation reflectivity. PawanSatya extracts deep-layer shear (|V500 - V850|) and moisture convergence to detect where convective parameterizations fail.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-[#111111] text-[10px] font-mono text-neutral-600 flex items-center justify-between">
                <span>MODEL RUN: NOAA GFS 0.25&deg; / ECMWF IFS</span>
                <span className="font-bold text-emerald-700">SHAP CALIBRATED</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Five Pillars of Forecast Bust Detection (Asymmetric 12-Column Grid) */}
      <section id="features" className="py-20 border-b-4 border-[#111111] bg-[#F9F9F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Section Header */}
          <div className="border-b-2 border-[#111111] pb-4 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#CC0000] block">
                DISPATCH NO. 1734 // CORE CAPABILITIES
              </span>
              <h2 className="font-serif font-black text-3xl sm:text-5xl text-[#111111] tracking-tight uppercase mt-1">
                The Five Pillars of Bust Detection
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-body text-neutral-600 max-w-md text-justify">
              Directly resolving the core deliverables outlined in the Smart India Hackathon operational problem statement for the Ministry of Earth Sciences.
            </p>
          </div>

          {/* Asymmetric 12-Column Broadsheet Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 border-2 border-[#111111] bg-[#F9F9F7]">
            
            {/* Left 7 Columns: 4 Technical Pillar Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 lg:border-r border-[#111111]">
              
              {/* Pillar 1 */}
              <div className="p-6 border-b md:border-r border-[#111111] space-y-3 hover:bg-neutral-100 transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#CC0000]">
                      DELIVERABLE 01
                    </span>
                    <div className="h-8 w-8 border border-[#111111] bg-[#F9F9F7] flex items-center justify-center">
                      <Satellite className="h-4 w-4 stroke-1" />
                    </div>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#111111] uppercase tracking-tight">
                    High-Resolution Satellite Confidence Map
                  </h3>
                  <p className="text-xs sm:text-sm font-body text-neutral-700 leading-relaxed text-justify">
                    Interactive ESRI World Imagery basemap covering all 36 IMD meteorological subdivisions. Red/Green/Amber color-coded polygons immediately highlight areas where NWP guidance is unreliable.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#111111] text-[10px] font-mono text-neutral-500 uppercase font-semibold">
                  Coverage: IMD 36 Subdivisions
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-6 border-b border-[#111111] space-y-3 hover:bg-neutral-100 transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#CC0000]">
                      DELIVERABLE 02
                    </span>
                    <div className="h-8 w-8 border border-[#111111] bg-[#F9F9F7] flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 stroke-1" />
                    </div>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#111111] uppercase tracking-tight">
                    Day 1 to Day 10 Lead-Time Scrubber
                  </h3>
                  <p className="text-xs sm:text-sm font-body text-neutral-700 leading-relaxed text-justify">
                    Models the chaotic error growth trajectory using Lorenz atmospheric dynamics. Identifies the exact bifurcation window (e.g. Day 4 vs Day 7) where multi-model spread explodes.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#111111] text-[10px] font-mono text-neutral-500 uppercase font-semibold">
                  Dynamics: Lorenz '63/96 Growth
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-6 border-b md:border-b-0 md:border-r border-[#111111] space-y-3 hover:bg-neutral-100 transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#CC0000]">
                      DELIVERABLE 03
                    </span>
                    <div className="h-8 w-8 border border-[#111111] bg-[#F9F9F7] flex items-center justify-center">
                      <Layers className="h-4 w-4 stroke-1" />
                    </div>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#111111] uppercase tracking-tight">
                    Explainable AI (SHAP Waterfall)
                  </h3>
                  <p className="text-xs sm:text-sm font-body text-neutral-700 leading-relaxed text-justify">
                    Transparent meteorological reasoning: inspect exact physical feature attributions including CAPE, 0–6km deep-layer wind shear, Z500 geopotential vorticity, and moisture flux convergence.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#111111] text-[10px] font-mono text-neutral-500 uppercase font-semibold">
                  Engine: TreeExplainer Shapley
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="p-6 space-y-3 hover:bg-neutral-100 transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#CC0000]">
                      DELIVERABLE 04
                    </span>
                    <div className="h-8 w-8 border border-[#111111] bg-[#F9F9F7] flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 stroke-1" />
                    </div>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#111111] uppercase tracking-tight">
                    Ranked Error-Prone Hotspot Detection
                  </h3>
                  <p className="text-xs sm:text-sm font-body text-neutral-700 leading-relaxed text-justify">
                    Automated ranking of subdivisions exceeding critical bust thresholds (&ge;65%). Includes estimated track displacement error (&plusmn;km) and precipitation magnitude error (&plusmn;mm).
                  </p>
                </div>
                <div className="pt-3 border-t border-[#111111] text-[10px] font-mono text-neutral-500 uppercase font-semibold">
                  Alerts: Magnitude & Track Drift
                </div>
              </div>

            </div>

            {/* Right 5 Columns: Editorial Figure Plate & Comparator */}
            <div className="lg:col-span-5 p-6 bg-[#F9F9F7] flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#111111] pb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#111111]">
                    PLATE NO. 1.3 &bull; SYNOPTIC SURFACE
                  </span>
                  <span className="text-[10px] font-mono text-[#CC0000] font-bold uppercase">
                    ARCHIVE RECORD
                  </span>
                </div>

                {/* Editorial Photo Frame */}
                <div className="border border-[#111111] p-1.5 bg-white hard-shadow-sm">
                  <img
                    src={spcOutlookSample}
                    alt="Synoptic Outlook and Convective Forecast Verification Chart"
                    className="w-full h-52 object-cover object-center editorial-photo"
                  />
                  <div className="mt-2 text-[10px] font-mono text-neutral-600 uppercase tracking-wide leading-tight">
                    Fig 1.3: Synoptic severe weather outlook and pressure isobar contour verification mapping.
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="font-serif font-bold text-lg text-[#111111] uppercase">
                    NWP vs. Historical Error Comparator
                  </h4>
                  <p className="text-xs font-body text-neutral-700 leading-relaxed text-justify">
                    Benchmarks current multi-model spread (GFS, ECMWF IFS, NCUM, GEFS) against 10-year ERA5 historical forecast error distributions to detect systematic model biases in real time.
                  </p>
                </div>
              </div>

              <div className="p-3 border border-[#111111] bg-white text-xs font-mono">
                <span className="font-bold text-[#CC0000] block mb-1">OPERATIONAL BULLETIN READY:</span>
                Generates instant printable official advisories for disaster management authorities and forecasters.
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Inverted Section: India's 6 Volatile Synoptic Regimes */}
      <section id="systems" className="py-20 bg-[#111111] text-[#F9F9F7] border-b-4 border-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Inverted Section Header */}
          <div className="border-b border-neutral-700 pb-4 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#CC0000] block">
                SPECIAL INVERTED FOLIO &bull; BENCHMARK REGIMES
              </span>
              <h2 className="font-serif font-black text-3xl sm:text-5xl text-[#F9F9F7] tracking-tight uppercase mt-1">
                Volatile Atmospheric Systems
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-body text-neutral-400 max-w-md text-justify">
              Calibrated on historical events (&le;2022) and verified against completely unseen holdout systems (&ge;2023) across India&apos;s six benchmark synoptic patterns.
            </p>
          </div>

          {/* 6-Grid Broadsheet Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {systems.map((s) => (
              <div
                key={s.id}
                className="border border-neutral-700 bg-neutral-900 p-6 flex flex-col justify-between space-y-4 hover:border-[#CC0000] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="text-[11px] font-mono font-bold text-[#CC0000] uppercase tracking-wider">
                      SYSTEM // {s.num}
                    </span>
                    <div className="h-8 w-8 border border-neutral-700 flex items-center justify-center text-neutral-300">
                      {s.icon}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-lg text-white uppercase tracking-tight">
                      {s.name}
                    </h4>
                    <span className="text-[11px] font-mono text-neutral-400 block mt-0.5">
                      Zone: {s.zone}
                    </span>
                  </div>

                  <p className="text-xs font-body text-neutral-300 leading-relaxed text-justify">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span>HOLD-OUT VALIDATED</span>
                  <span className="text-emerald-400 font-bold">AUC 0.96+</span>
                </div>
              </div>
            ))}
          </div>

          {/* Inverted Section Action */}
          <div className="mt-12 text-center">
            <button
              onClick={onLaunchDashboard}
              className="px-8 py-3.5 bg-[#F9F9F7] text-[#111111] hover:bg-[#CC0000] hover:text-white font-mono font-bold uppercase tracking-widest text-xs transition-colors inline-flex items-center space-x-2"
            >
              <span>TEST ALL 6 REGIMES IN OPERATIONAL CONSOLE</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* ML Pipeline & Mathematical Foundations (4-Column Newspaper Layout) */}
      <section id="architecture" className="py-20 border-b-4 border-[#111111] bg-[#F9F9F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="border-b-2 border-[#111111] pb-4 mb-10 text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#CC0000] block">
              SCIENTIFIC METHODOLOGY &bull; NO SYNTHETIC SHORTCUTS
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-5xl text-[#111111] tracking-tight uppercase">
              End-to-End AI/ML Architecture
            </h2>
            <p className="text-xs sm:text-sm font-body text-neutral-700 leading-relaxed">
              How real NWP model forecasts, ECMWF ERA5 reanalysis ground truth, and LightGBM GBDT combine into operational intelligence.
            </p>
          </div>

          {/* 4 Editorial Columns with Vertical Rules */}
          <div className="grid grid-cols-1 md:grid-cols-4 border-2 border-[#111111] bg-white">
            
            {/* Step 1 */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-[#111111] space-y-3 hover:bg-neutral-50 transition-colors">
              <span className="text-xs font-mono font-bold text-[#CC0000] uppercase block">
                COLUMN I &bull; STEP 01
              </span>
              <h4 className="font-serif font-bold text-base text-[#111111] uppercase">
                Real Data Ingestion
              </h4>
              <p className="text-xs font-body text-neutral-700 leading-relaxed text-justify">
                Ingests real NOAA GFS 0.25&deg; operational runs (CAPE, winds at 850/500hPa, Z500, RH) alongside ECMWF ERA5 gridded reanalysis ground truth.
              </p>
              <div className="text-[10px] font-mono text-neutral-500 pt-2 border-t border-neutral-200">
                Data: ECMWF ERA5 + NOAA GFS
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-[#111111] space-y-3 hover:bg-neutral-50 transition-colors">
              <span className="text-xs font-mono font-bold text-[#CC0000] uppercase block">
                COLUMN II &bull; STEP 02
              </span>
              <h4 className="font-serif font-bold text-base text-[#111111] uppercase">
                Physical Feature Extraction
              </h4>
              <p className="text-xs font-body text-neutral-700 leading-relaxed text-justify">
                Computes deep-layer shear (|V500 - V850|), Eady baroclinic growth rate (&sigma;<sub>BI</sub>), and 500hPa geopotential thickness wave anomalies.
              </p>
              <div className="text-[10px] font-mono text-neutral-500 pt-2 border-t border-neutral-200">
                Formula: &sigma;<sub>BI</sub> = 0.31(f/N)|&part;u/&part;z|
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-[#111111] space-y-3 hover:bg-neutral-50 transition-colors">
              <span className="text-xs font-mono font-bold text-[#CC0000] uppercase block">
                COLUMN III &bull; STEP 03
              </span>
              <h4 className="font-serif font-bold text-base text-[#111111] uppercase">
                LightGBM GBDT Classifier
              </h4>
              <p className="text-xs font-body text-neutral-700 leading-relaxed text-justify">
                Trained on historical systems (&le;2022) with a strict time-based split. Evaluated on unseen 2023–2024 systems achieving AUC 0.966.
              </p>
              <div className="text-[10px] font-mono text-neutral-500 pt-2 border-t border-neutral-200">
                Split: Strict Time-Based Holdout
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 space-y-3 hover:bg-neutral-50 transition-colors">
              <span className="text-xs font-mono font-bold text-[#CC0000] uppercase block">
                COLUMN IV &bull; STEP 04
              </span>
              <h4 className="font-serif font-bold text-base text-[#111111] uppercase">
                SHAP XAI & Decision Support
              </h4>
              <p className="text-xs font-body text-neutral-700 leading-relaxed text-justify">
                Real `TreeExplainer` computes exact feature attribution weights for forecasters, with automatic bulletin generation.
              </p>
              <div className="text-[10px] font-mono text-neutral-500 pt-2 border-t border-neutral-200">
                Attribution: Exact Shapley Weights
              </div>
            </div>

          </div>

          {/* Ornamental Broadside Divider */}
          <div className="py-12 text-center font-serif text-2xl text-neutral-400 tracking-[1em]">
            &#x2727; &#x2727; &#x2727;
          </div>

          {/* Framed Editorial Advertisement Box / Call to Action */}
          <div className="border-4 border-[#111111] p-8 sm:p-12 bg-white text-center max-w-4xl mx-auto hard-shadow">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#CC0000] block mb-2">
              NATIONAL METEOROLOGICAL DISPATCH NOTICE
            </span>
            <h3 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] uppercase tracking-tight">
              Ready to Explore the Operational Bust Detection System?
            </h3>
            <p className="text-xs sm:text-sm font-body text-neutral-700 max-w-2xl mx-auto mt-3 leading-relaxed text-justify">
              Experience the live operational console with ESRI high-resolution satellite imagery, 3D DEM terrain elevations, interactive lead-time scrubbers, and live SHAP meteorological explainability.
            </p>
            <div className="mt-6">
              <button
                onClick={onLaunchDashboard}
                className="px-8 py-4 bg-[#111111] text-[#F9F9F7] border border-[#111111] hover:bg-[#F9F9F7] hover:text-[#111111] font-mono font-bold uppercase tracking-widest text-xs transition-all inline-flex items-center space-x-2.5 hard-shadow-hover"
              >
                <span>ENTER OPERATIONAL CONSOLE NOW</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Editorial Colophon & Broadsheet Footer */}
      <footer className="bg-[#F9F9F7] text-[#111111] py-10 border-t-2 border-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Colophon Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#111111] text-xs font-mono">
            
            <div className="space-y-2">
              <span className="font-bold text-[#111111] uppercase block">
                PUBLICATION COLOPHON
              </span>
              <p className="text-neutral-600 font-body text-xs leading-relaxed">
                PawanSatya is engineered for the Ministry of Earth Sciences and Indian Meteorological Department as an operational decision support system.
              </p>
              <div className="text-[11px] text-[#CC0000] font-bold">
                SIH Problem Statement 1734
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-[#111111] uppercase block">
                DATA SOURCES & SATELLITES
              </span>
              <ul className="text-neutral-600 space-y-1">
                <li>&bull; ESRI World Imagery (2D Sat)</li>
                <li>&bull; MapLibre Global DEM (3D Topo)</li>
                <li>&bull; NOAA GFS 0.25&deg; Operational NWP</li>
                <li>&bull; ECMWF ERA5 Gridded Reanalysis</li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-[#111111] uppercase block">
                MATHEMATICAL STANDARDS
              </span>
              <ul className="text-neutral-600 space-y-1">
                <li>&bull; LightGBM Gradient Boosting</li>
                <li>&bull; TreeExplainer Shapley XAI</li>
                <li>&bull; Lorenz Atmospheric Chaos Model</li>
                <li>&bull; Quasi-Geostrophic Dynamics</li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-[#111111] uppercase block">
                SYSTEM CLEARANCE
              </span>
              <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
                <span className="inline-block w-2 h-2 bg-emerald-600" />
                <span>ALL METEOROLOGICAL FEEDS LIVE</span>
              </div>
              <p className="text-neutral-600 text-[11px] mt-1 font-mono">
                Broadsheet Release v1.3.0 &bull; Edition: New Delhi
              </p>
            </div>

          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-neutral-600 gap-2">
            <div>
              &copy; 2024&ndash;2026 PAWANSATYA METEOROLOGICAL CONSORTIUM &bull; ALL RIGHTS RESERVED
            </div>
            <div className="flex items-center space-x-4">
              <span className="underline decoration-[#CC0000] decoration-1">Terms of Dissemination</span>
              <span>&bull;</span>
              <span className="underline decoration-[#CC0000] decoration-1">Forecast Verification Protocol</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
