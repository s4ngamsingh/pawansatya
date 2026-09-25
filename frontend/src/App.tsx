import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import type {
  Subdivision,
  Scenario,
  EvaluationSummary,
  RegionExplanation,
  DayTrajectory,
  ExplainResponse
} from './types';
import {
  fetchScenarios,
  fetchConfidenceMap,
  fetchRegionExplain,
  FALLBACK_SCENARIOS
} from './services/api';

import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { LeadTimeSlider } from './components/LeadTimeSlider';
import { ConfidenceMap } from './components/ConfidenceMap';
import { BustProbabilityRadar } from './components/BustProbabilityRadar';
import { ExplainabilityPanel } from './components/ExplainabilityPanel';
import { ErrorProneHotspots } from './components/ErrorProneHotspots';
import { NwpHistoricalComparator } from './components/NwpHistoricalComparator';
import { StationTelemetryPanel } from './components/StationTelemetryPanel';
import { ForensicDiagnosticsStrip } from './components/ForensicDiagnosticsStrip';
import { CustomEvaluatorModal } from './components/CustomEvaluatorModal';
import { ReportExportModal } from './components/ReportExportModal';
import { ModelValidationModal } from './components/ModelValidationModal';
import { LoadingScreen } from './components/LoadingScreen';

import {
  Sparkles,
  CloudLightning,
  Wind,
  Sun,
  Waves,
  CloudRain,
  Snowflake,
  Home
} from 'lucide-react';

export function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  const [scenarios, setScenarios] = useState<Scenario[]>(FALLBACK_SCENARIOS);
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(FALLBACK_SCENARIOS[0]);
  const [leadTime, setLeadTime] = useState<number>(4);

  const [subdivisions, setSubdivisions] = useState<Subdivision[]>([]);
  const [selectedSubdivision, setSelectedSubdivision] = useState<Subdivision | null>(null);
  const [summary, setSummary] = useState<EvaluationSummary | null>(null);
  const [hotspots, setHotspots] = useState<Subdivision[]>([]);

  const [explanation, setExplanation] = useState<RegionExplanation | null>(null);
  const [trajectory, setTrajectory] = useState<DayTrajectory[]>([]);

  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isValidationOpen, setIsValidationOpen] = useState<boolean>(false);

  // Load scenarios on mount
  useEffect(() => {
    async function initScenarios() {
      const scList = await fetchScenarios();
      setScenarios(scList);
      if (scList.length > 0) {
        setSelectedScenario(scList[0]);
      }
    }
    initScenarios();
  }, []);

  // Fetch confidence map whenever scenario or lead time changes
  useEffect(() => {
    async function loadMapData() {
      if (!selectedScenario) return;
      const data = await fetchConfidenceMap(selectedScenario.id, leadTime);
      setSubdivisions(data.subdivisions);
      setSummary(data.summary);
      setHotspots(data.error_prone_hotspots);

      // If no subdivision selected, or selected subdivision not in new set, default to first hotspot or first subdivision
      if (!selectedSubdivision && data.subdivisions.length > 0) {
        const defaultSub = data.error_prone_hotspots[0] || data.subdivisions[0];
        setSelectedSubdivision(defaultSub);
      } else if (selectedSubdivision) {
        const updated = data.subdivisions.find((s) => s.id === selectedSubdivision.id);
        if (updated) setSelectedSubdivision(updated);
      }
    }
    loadMapData();
  }, [selectedScenario, leadTime]);

  // Fetch explanation & trajectory whenever selected subdivision changes
  useEffect(() => {
    async function loadExplanation() {
      if (!selectedSubdivision || !selectedScenario) return;
      const data = await fetchRegionExplain(selectedSubdivision.id, selectedScenario.id, leadTime);
      setExplanation(data.explanation);
      setTrajectory(data.trajectory_10_days);
    }
    loadExplanation();
  }, [selectedSubdivision, selectedScenario, leadTime]);

  // Handle custom evaluation simulation result
  const handleCustomEvaluationComplete = (result: ExplainResponse) => {
    const updatedSub = subdivisions.find((s) => s.id === result.region.id) || {
      ...result.region,
      coordinates: [],
      ...result.evaluation
    };
    setSelectedSubdivision(updatedSub as Subdivision);
    setExplanation(result.explanation);
    setTrajectory(result.trajectory_10_days);
    setLeadTime(result.evaluation.lead_time_days);
  };

  // Weather system icons mapping for the 6 specific rapidly evolving systems
  const getSystemIcon = (id: string) => {
    switch (id) {
      case 'monsoon_depression':
        return <CloudRain className="h-4 w-4 text-sky-600" />;
      case 'cyclone_severe':
        return <Wind className="h-4 w-4 text-[#CC0000]" />;
      case 'western_disturbance':
        return <Snowflake className="h-4 w-4 text-indigo-600" />;
      case 'heat_wave':
        return <Sun className="h-4 w-4 text-amber-600" />;
      case 'break_monsoon':
        return <Waves className="h-4 w-4 text-teal-600" />;
      default:
        return <CloudLightning className="h-4 w-4 text-neutral-700" />;
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.04
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 350, damping: 25 } }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#111111] flex flex-col font-serif selection:bg-[#111111] selection:text-white">
      
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} durationMs={2600} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentView === 'landing' ? (
          <motion.div
            key="landing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <LandingPage
              onLaunchDashboard={() => setCurrentView('dashboard')}
              onOpenValidationModal={() => setIsValidationOpen(true)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {/* Header */}
            <Header
              scenarios={scenarios}
              selectedScenario={selectedScenario}
              onSelectScenario={(sc) => setSelectedScenario(sc)}
              summary={summary}
              leadTime={leadTime}
              onOpenCustomSimulator={() => setIsSimulatorOpen(true)}
              onOpenReportModal={() => setIsReportOpen(true)}
              onOpenValidationModal={() => setIsValidationOpen(true)}
              onNavigateLanding={() => setCurrentView('landing')}
            />

            {/* Main Container with Framer Motion Stagger */}
            <motion.main
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex-1 max-w-[1750px] w-full mx-auto px-3 sm:px-5 py-4 space-y-5"
            >
              
              {/* Rapidly Evolving System Selectors */}
              <motion.div variants={itemVariants} className="bg-[#F9F9F7] border-2 border-[#111111] p-3 hard-shadow-sm sharp-corners">
                <div className="flex items-center justify-between mb-2.5 px-1 border-b border-[#111111] pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#111111]">
                      RAPIDLY EVOLVING ATMOSPHERIC SYSTEMS &bull; BENCHMARK REGIMES
                    </span>
                    <button
                      onClick={() => setCurrentView('landing')}
                      className="px-2 py-0.5 text-[11px] font-mono bg-white hover:bg-neutral-100 border border-[#111111] text-[#111111] transition-colors flex items-center gap-1 sharp-corners"
                      title="Back to Landing Page"
                    >
                      <Home className="h-3 w-3" />
                      <span>Overview</span>
                    </button>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-600">
                    SELECT SYNOPTIC REGIME TO TEST BUST PROFILE
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {scenarios.map((sc) => {
                    const isSelected = selectedScenario?.id === sc.id;
                    return (
                      <motion.button
                        key={sc.id}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedScenario(sc)}
                        className={`p-2.5 border text-left transition-all flex items-center space-x-2.5 select-none sharp-corners ${
                          isSelected
                            ? 'bg-[#111111] text-white border-[#111111] hard-shadow-sm'
                            : 'bg-white border-[#111111] hover:bg-neutral-100 text-[#111111]'
                        }`}
                      >
                        <div className={`p-1.5 shrink-0 sharp-corners ${isSelected ? 'bg-neutral-800 text-white' : 'bg-neutral-100 border border-[#111111]'}`}>
                          {getSystemIcon(sc.id)}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-mono font-bold truncate block leading-tight">
                            {sc.name.split(' (')[0].split(' - ')[0]}
                          </span>
                          <span className={`text-[10px] font-mono block mt-0.5 ${isSelected ? 'text-amber-400' : 'text-neutral-500'}`}>
                            D{sc.critical_lead_times.join(', ')} Critical
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Scenario Context Banner */}
              <AnimatePresence mode="wait">
                {selectedScenario && (
                  <motion.div
                    key={selectedScenario.id}
                    variants={itemVariants}
                    className="bg-[#F9F9F7] border-2 border-[#111111] p-3.5 hard-shadow-sm sharp-corners flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#111111] text-white sharp-corners uppercase">
                          Active Synoptic Regime
                        </span>
                        <span className="text-xs font-mono font-bold text-[#CC0000]">
                          {selectedScenario.category}
                        </span>
                        <span className="text-neutral-400">&bull;</span>
                        <span className="text-xs font-mono text-neutral-600">
                          CRITICAL BUST WINDOW: <strong className="text-[#111111] font-mono">DAY {selectedScenario.critical_lead_times.join(', ')}</strong>
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-serif font-black text-[#111111]">
                        {selectedScenario.name}
                      </h2>
                      <p className="text-xs font-serif text-neutral-700 max-w-4xl leading-relaxed">
                        {selectedScenario.description}
                      </p>
                    </div>

                    {/* Historical Analog Snippet */}
                    <div className="bg-white border border-[#111111] p-2.5 text-xs max-w-md self-start md:self-auto shrink-0 sharp-corners">
                      <div className="flex items-center space-x-1.5 text-neutral-600 text-[10px] font-mono font-bold uppercase mb-1">
                        <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                        <span>HISTORICAL ANALOG MATCH</span>
                      </div>
                      <p className="text-neutral-800 text-xs font-serif line-clamp-2 leading-relaxed italic">
                        "{selectedScenario.historical_analog}"
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* TIER 1: Upper Workstation & Synoptic Telemetry (12 cols) */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* Left 4 Cols: ECMWF-style Station Telemetry & Regional Bust Hotspots */}
                <div className="lg:col-span-4 space-y-4">
                  <StationTelemetryPanel
                    selectedSubdivision={selectedSubdivision}
                    selectedScenario={selectedScenario}
                    leadTime={leadTime}
                  />

                  <ErrorProneHotspots
                    hotspots={hotspots}
                    selectedSubdivision={selectedSubdivision}
                    onSelectSubdivision={(sub) => setSelectedSubdivision(sub)}
                    leadTime={leadTime}
                  />
                </div>

                {/* Right 8 Cols: Confidence Spatial Map & Lead-Time Slider */}
                <div className="lg:col-span-8 space-y-4">
                  <ConfidenceMap
                    subdivisions={subdivisions}
                    selectedSubdivision={selectedSubdivision}
                    onSelectSubdivision={(sub) => setSelectedSubdivision(sub)}
                    leadTime={leadTime}
                    scenario={selectedScenario}
                  />

                  <LeadTimeSlider
                    currentLeadTime={leadTime}
                    onChangeLeadTime={(d) => setLeadTime(d)}
                    criticalLeadTimes={selectedScenario?.critical_lead_times}
                  />
                </div>

              </motion.div>

              {/* TIER 2: Physical Dynamics & Model Verification (12 cols) */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* 7 Cols: NWP vs Historical Error Comparator */}
                <div className="lg:col-span-7 space-y-4">
                  <NwpHistoricalComparator
                    selectedSubdivision={selectedSubdivision}
                    scenario={selectedScenario}
                    leadTime={leadTime}
                  />
                </div>

                {/* 5 Cols: Ensemble Plume Trajectory Radar & Explainability */}
                <div className="lg:col-span-5 space-y-4">
                  <BustProbabilityRadar
                    trajectory={trajectory}
                    selectedSubdivision={selectedSubdivision}
                    currentLeadTime={leadTime}
                    onSelectLeadTime={(d) => setLeadTime(d)}
                  />

                  <ExplainabilityPanel
                    explanation={explanation}
                    selectedSubdivision={selectedSubdivision}
                    leadTime={leadTime}
                  />
                </div>

              </motion.div>

              {/* TIER 3: Multi-Model Forensic Diagnostic Strip (12 cols) */}
              <motion.div variants={itemVariants}>
                <ForensicDiagnosticsStrip
                  scenario={selectedScenario}
                  selectedSubdivision={selectedSubdivision}
                  leadTime={leadTime}
                  onOpenReportModal={() => setIsReportOpen(true)}
                  onOpenSimulatorModal={() => setIsSimulatorOpen(true)}
                />
              </motion.div>

            </motion.main>

            {/* Footer */}
            <footer className="border-t-2 border-[#111111] bg-[#F9F9F7] py-3 text-xs text-neutral-600 mt-8">
              <div className="max-w-[1750px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-2 font-mono text-[11px]">
                  <span className="h-2 w-2 bg-emerald-600 animate-pulse" />
                  <span className="text-[#111111] font-bold">PAWANSATYA OPERATIONAL FORECAST SYSTEM</span>
                  <span>&bull;</span>
                  <span>ECMWF / IMD SYNOPTIC PROTOCOL</span>
                </div>
                <div className="flex items-center space-x-4 text-[10px] font-mono">
                  <span>SATELLITE: ESRI WORLD IMAGERY</span>
                  <span>&bull;</span>
                  <span>NWP: GFS 0.25&deg; / IFS / AIFS</span>
                  <span>&bull;</span>
                  <span>IMD 36 SUBDIVISIONS</span>
                  <span>&bull;</span>
                  <span className="text-[#111111] font-bold">v1.2.0-PRO</span>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals with AnimatePresence */}
      <CustomEvaluatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        subdivisions={subdivisions}
        selectedSubdivision={selectedSubdivision}
        onEvaluationComplete={handleCustomEvaluationComplete}
      />

      <ReportExportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        scenario={selectedScenario}
        summary={summary}
        leadTime={leadTime}
        hotspots={hotspots}
        selectedExplanation={explanation}
      />

      <ModelValidationModal
        isOpen={isValidationOpen}
        onClose={() => setIsValidationOpen(false)}
      />

    </div>
  );
}

export default App;
