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
import { CustomEvaluatorModal } from './components/CustomEvaluatorModal';
import { ReportExportModal } from './components/ReportExportModal';
import { ModelValidationModal } from './components/ModelValidationModal';

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
        return <CloudRain className="h-4 w-4 text-sky-400" />;
      case 'cyclone_severe':
        return <Wind className="h-4 w-4 text-rose-500" />;
      case 'western_disturbance':
        return <Snowflake className="h-4 w-4 text-indigo-400" />;
      case 'heat_wave':
        return <Sun className="h-4 w-4 text-amber-400" />;
      case 'break_monsoon':
        return <Waves className="h-4 w-4 text-teal-400" />;
      default:
        return <CloudLightning className="h-4 w-4 text-neutral-300" />;
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-white selection:text-black">
      
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
              className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 py-5 space-y-5"
            >
              
              {/* Rapidly Evolving System Selectors */}
              <motion.div variants={itemVariants} className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-3.5 shadow-md">
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-neutral-300">
                      Rapidly Evolving Atmospheric Systems &bull; Benchmark Regimes
                    </span>
                    <button
                      onClick={() => setCurrentView('landing')}
                      className="px-2 py-0.5 rounded text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors flex items-center gap-1"
                      title="Back to Landing Page"
                    >
                      <Home className="h-3 w-3" />
                      <span>Overview</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    Select synoptic regime to test bust profile
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {scenarios.map((sc) => {
                    const isSelected = selectedScenario?.id === sc.id;
                    return (
                      <motion.button
                        key={sc.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedScenario(sc)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center space-x-3 select-none ${
                          isSelected
                            ? 'bg-white text-black border-white shadow-lg'
                            : 'bg-neutral-950/70 border-neutral-800/80 hover:border-neutral-700 text-neutral-300 hover:text-white'
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-neutral-900 text-white' : 'bg-neutral-900 border border-neutral-800'}`}>
                          {getSystemIcon(sc.id)}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold truncate block leading-tight">
                            {sc.name.split(' (')[0].split(' - ')[0]}
                          </span>
                          <span className={`text-[10px] font-mono block mt-0.5 ${isSelected ? 'text-neutral-700' : 'text-neutral-400'}`}>
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
                    className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative overflow-hidden"
                  >
                    <div className="space-y-1.5 z-10">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-neutral-950 border border-neutral-800 text-neutral-300">
                          Active Synoptic Pattern
                        </span>
                        <span className="text-xs font-semibold text-rose-400">
                          {selectedScenario.category}
                        </span>
                        <span className="text-neutral-700">&bull;</span>
                        <span className="text-xs text-neutral-400">
                          Critical Lead Times: <strong className="text-white font-mono">Day {selectedScenario.critical_lead_times.join(', ')}</strong>
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-white font-sans">
                        {selectedScenario.name}
                      </h2>
                      <p className="text-xs text-neutral-400 max-w-4xl leading-relaxed">
                        {selectedScenario.description}
                      </p>
                    </div>

                    {/* Historical Analog Snippet */}
                    <div className="bg-neutral-950/80 border border-neutral-800/80 p-3.5 rounded-xl text-xs max-w-md self-start md:self-auto z-10 shrink-0">
                      <div className="flex items-center space-x-1.5 text-neutral-400 text-[11px] font-semibold mb-1">
                        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                        <span>Historical Analog Match</span>
                      </div>
                      <p className="text-neutral-300 text-xs line-clamp-2 leading-relaxed">
                        {selectedScenario.historical_analog}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Lead Time Horizon Interactive Scrub Bar */}
              <motion.div variants={itemVariants}>
                <LeadTimeSlider
                  currentLeadTime={leadTime}
                  onChangeLeadTime={(d) => setLeadTime(d)}
                  criticalLeadTimes={selectedScenario?.critical_lead_times}
                />
              </motion.div>

              {/* Core Dashboard Grid */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Left Column: Satellite Map & Comparative Modules (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Satellite Map with ESRI Imagery & Regional Polygons */}
                  <ConfidenceMap
                    subdivisions={subdivisions}
                    selectedSubdivision={selectedSubdivision}
                    onSelectSubdivision={(sub) => setSelectedSubdivision(sub)}
                    leadTime={leadTime}
                  />

                  {/* NWP vs Historical Forecast Error Behaviour Comparator */}
                  <NwpHistoricalComparator
                    selectedSubdivision={selectedSubdivision}
                    scenario={selectedScenario}
                    leadTime={leadTime}
                  />

                  {/* Error-Prone Hotspots List below Map */}
                  <ErrorProneHotspots
                    hotspots={hotspots}
                    selectedSubdivision={selectedSubdivision}
                    onSelectSubdivision={(sub) => setSelectedSubdivision(sub)}
                    leadTime={leadTime}
                  />
                </div>

                {/* Right Column: Radar & Explainability (5 cols) */}
                <div className="lg:col-span-5 space-y-5">
                  
                  {/* 10-Day Error Trajectory Curve */}
                  <BustProbabilityRadar
                    trajectory={trajectory}
                    selectedSubdivision={selectedSubdivision}
                    currentLeadTime={leadTime}
                    onSelectLeadTime={(d) => setLeadTime(d)}
                  />

                  {/* Meteorological Explainability & SHAP Waterfall */}
                  <ExplainabilityPanel
                    explanation={explanation}
                    selectedSubdivision={selectedSubdivision}
                    leadTime={leadTime}
                  />

                </div>

              </motion.div>

            </motion.main>

            {/* Footer */}
            <footer className="border-t border-neutral-800/80 bg-neutral-950 py-4 text-xs text-neutral-400 mt-8">
              <div className="max-w-[1700px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-semibold">PAWANSATYA SYSTEM</span>
                  <span>&bull;</span>
                  <span>Smart India Hackathon (SIH)</span>
                </div>
                <div className="flex items-center space-x-4 text-xs font-mono">
                  <span>Satellite: ESRI World Imagery</span>
                  <span>&bull;</span>
                  <span>NWP: GFS 0.25&deg; / GEFS / ECMWF IFS</span>
                  <span>&bull;</span>
                  <span>IMD 36 Subdivisions</span>
                  <span>&bull;</span>
                  <span className="text-white font-bold">v1.2.0</span>
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
