import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Polygon, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import { Subdivision } from '../types';
import {
  Satellite,
  Radar,
  Mountain,
  Layers,
  X,
  CloudRain,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import L from 'leaflet';
import { Marker } from 'react-leaflet';
import { AnimatedNumber } from './AnimatedNumber';
import { DemTerrainMap3D } from './DemTerrainMap3D';
import { SynopticOutlookMap } from './SynopticOutlookMap';
import {
  getWeatherConditionForSubdivision,
  getWeatherGlyphHtml,
  WEATHER_CONDITIONS_META
} from './WeatherGlyph';
import { Scenario } from '../types';

interface ConfidenceMapProps {
  subdivisions: Subdivision[];
  selectedSubdivision: Subdivision | null;
  onSelectSubdivision: (sub: Subdivision) => void;
  leadTime: number;
  scenario?: Scenario | null;
}

// Controller to smoothly fly to selected subdivision
const MapController: React.FC<{ selected: Subdivision | null }> = ({ selected }) => {
  const map = useMap();
  React.useEffect(() => {
    if (selected) {
      map.setView([selected.lat, selected.lon], Math.max(map.getZoom(), 5.2), {
        animate: true,
        duration: 0.8
      });
    }
  }, [selected, map]);
  return null;
};

export const ConfidenceMap: React.FC<ConfidenceMapProps> = ({
  subdivisions,
  selectedSubdivision,
  onSelectSubdivision,
  leadTime,
  scenario
}) => {
  const [viewDimension, setViewDimension] = useState<'2D_SATELLITE' | '3D_DEM_TOPO' | 'SPC_OUTLOOK'>('2D_SATELLITE');
  const [filter, setFilter] = useState<'ALL' | 'DANGER' | 'SAFE'>('ALL');
  const [displayMetric, setDisplayMetric] = useState<'BUST_PROB' | 'CONFIDENCE'>('BUST_PROB');
  const [mapStyle, setMapStyle] = useState<'SATELLITE_HYBRID' | 'SATELLITE_PURE' | 'DARK'>('SATELLITE_HYBRID');
  const [showRadarOverlay, setShowRadarOverlay] = useState<boolean>(true);
  const [showWeatherLayer, setShowWeatherLayer] = useState<boolean>(true);
  const [dismissedSubId, setDismissedSubId] = useState<string | null>(null);
  const [isSideSliderOpen, setIsSideSliderOpen] = useState<boolean>(false);

  const filteredSubdivisions = subdivisions.filter((sub) => {
    if (filter === 'DANGER') return sub.risk_level === 'DANGER';
    if (filter === 'SAFE') return sub.risk_level === 'SAFE';
    return true;
  });

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[680px] relative isolate z-0">
      
      {/* Top Map Toolbar - Single row with horizontal slider scroll if needed */}
      <div className="p-2.5 bg-white/95 backdrop-blur-xl border-b border-neutral-200 flex items-center justify-between gap-3 z-10 overflow-x-auto scrollbar-none sm:scrollbar-thin">
        
        {/* Left Side: Title + Always-Visible Map Switcher */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="h-7 w-7 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
            {viewDimension === '3D_DEM_TOPO' ? (
              <Mountain className="h-4 w-4 text-neutral-900" />
            ) : viewDimension === 'SPC_OUTLOOK' ? (
              <Layers className="h-4 w-4 text-purple-700" />
            ) : (
              <Satellite className="h-4 w-4 text-neutral-900" />
            )}
          </div>
          <div className="hidden sm:block">
            <span className="text-xs font-semibold text-neutral-900 block leading-tight">
              {viewDimension === '3D_DEM_TOPO'
                ? '3D DEM Bust Radar'
                : viewDimension === 'SPC_OUTLOOK'
                ? 'SPC Synoptic Outlook'
                : 'Satellite Radar'}
            </span>
          </div>

          {/* Primary Map Switcher - ALWAYS VISIBLE AT THE FRONT */}
          <div className="flex items-center bg-neutral-100 border border-neutral-200 rounded-xl p-0.5 text-xs shrink-0">
            <button
              onClick={() => setViewDimension('2D_SATELLITE')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                viewDimension === '2D_SATELLITE'
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="2D High-Resolution Satellite & Radar Sweep"
            >
              <Satellite className="h-3.5 w-3.5" />
              <span>2D Sat</span>
            </button>
            <button
              onClick={() => setViewDimension('3D_DEM_TOPO')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewDimension === '3D_DEM_TOPO'
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="3D Digital Elevation Model (DEM) with WebGL terrain extrusion"
            >
              <Mountain className="h-3.5 w-3.5 text-rose-400" />
              <span>3D Topo</span>
              <span className="text-[9px] px-1 rounded bg-rose-500 text-white font-bold">3D</span>
            </button>
            <button
              onClick={() => setViewDimension('SPC_OUTLOOK')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewDimension === 'SPC_OUTLOOK'
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="NOAA SPC Convective Style Probability Contours & Synoptic Stations"
            >
              <Layers className="h-3.5 w-3.5 text-purple-500" />
              <span>SPC Outlook</span>
              <span className="text-[9px] px-1 rounded bg-purple-600 text-white font-bold">SPC</span>
            </button>
          </div>
        </div>

        {/* Right Side: Quick Controls + Side Slider Toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Side Slider Toggle Button */}
          <button
            onClick={() => setIsSideSliderOpen(!isSideSliderOpen)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              isSideSliderOpen
                ? 'bg-neutral-900 text-white border-neutral-800 shadow-sm'
                : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800 shadow-xs'
            }`}
            title="Open side options slider"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-purple-600" />
            <span>Options Slider</span>
          </button>

          {/* Basemap Switcher (Only in 2D mode) */}
          {viewDimension === '2D_SATELLITE' && (
            <div className="hidden md:flex items-center bg-neutral-100 border border-neutral-200 rounded-xl p-0.5 text-xs">
              <button
                onClick={() => setMapStyle('SATELLITE_HYBRID')}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                  mapStyle === 'SATELLITE_HYBRID' ? 'bg-neutral-900 text-white font-semibold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Sat Hybrid
              </button>
              <button
                onClick={() => setMapStyle('SATELLITE_PURE')}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                  mapStyle === 'SATELLITE_PURE' ? 'bg-neutral-900 text-white font-semibold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Pure Sat
              </button>
              <button
                onClick={() => setMapStyle('DARK')}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                  mapStyle === 'DARK' ? 'bg-neutral-900 text-white font-semibold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Dark
              </button>
            </div>
          )}

          {/* Weather Layer Toggle */}
          <button
            onClick={() => setShowWeatherLayer(!showWeatherLayer)}
            className={`px-2.5 py-1 rounded-xl border text-xs flex items-center gap-1.5 transition-colors ${
              showWeatherLayer
                ? 'bg-sky-50 border-sky-300 text-sky-800 font-medium'
                : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-neutral-900'
            }`}
            title="Toggle IMD Weather Forecast Glyphs"
          >
            <CloudRain className={`h-3.5 w-3.5 ${showWeatherLayer ? 'text-sky-600' : 'text-neutral-500'}`} />
            <span className="hidden sm:inline">Weather</span>
            <span className={`text-[9px] px-1 rounded font-bold ${
              showWeatherLayer ? 'bg-sky-600 text-white' : 'bg-neutral-300 text-neutral-700'
            }`}>
              {showWeatherLayer ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Metric Toggle */}
          <div className="flex items-center bg-neutral-100 border border-neutral-200 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setDisplayMetric('BUST_PROB')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                displayMetric === 'BUST_PROB' ? 'bg-rose-600 text-white font-semibold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Bust %
            </button>
            <button
              onClick={() => setDisplayMetric('CONFIDENCE')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                displayMetric === 'CONFIDENCE' ? 'bg-emerald-600 text-white font-semibold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Conf %
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-neutral-100 border border-neutral-200 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === 'ALL' ? 'bg-neutral-900 text-white font-semibold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All (36)
            </button>
            <button
              onClick={() => setFilter('DANGER')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === 'DANGER' ? 'bg-rose-600 text-white font-semibold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Danger
            </button>
            <button
              onClick={() => setFilter('SAFE')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === 'SAFE' ? 'bg-emerald-600 text-white font-semibold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Safe
            </button>
          </div>
        </div>

      </div>

      {/* Map Viewport (2D Satellite, 3D DEM Topography, or SPC Synoptic Outlook) */}
      <div className="flex-1 w-full h-full relative overflow-hidden">
        {/* Side Slider Handle (Always accessible on the left edge of the map) */}
        <button
          onClick={() => setIsSideSliderOpen(!isSideSliderOpen)}
          className="absolute top-1/2 -translate-y-1/2 left-0 z-[1002] bg-neutral-900/90 hover:bg-neutral-900 text-white px-2 py-3.5 rounded-r-2xl shadow-2xl backdrop-blur-md border border-l-0 border-neutral-700 flex flex-col items-center gap-2 group transition-all"
          title={isSideSliderOpen ? "Close side options slider" : "Open side options slider"}
        >
          <SlidersHorizontal className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold tracking-widest uppercase [writing-mode:vertical-lr] rotate-180">
            {isSideSliderOpen ? 'Close Slider' : 'Map Options'}
          </span>
          {isSideSliderOpen ? (
            <ChevronLeft className="h-3.5 w-3.5 text-neutral-400" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
          )}
        </button>

        {/* Side Slider Panel (Slide-in Drawer) */}
        <AnimatePresence>
          {isSideSliderOpen && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="absolute top-0 left-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl border-r border-neutral-200 shadow-2xl z-[1001] flex flex-col overflow-y-auto p-4"
            >
              {/* Header with Close */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-purple-600" />
                  <h3 className="font-bold text-neutral-900 text-sm">Map Options Slider</h3>
                </div>
                <button
                  onClick={() => setIsSideSliderOpen(false)}
                  className="h-7 w-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors"
                  title="Close slider"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Section 1: Map Projection Switcher */}
              <div className="mb-4">
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                  Map Projection
                </label>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => {
                      setViewDimension('2D_SATELLITE');
                      setIsSideSliderOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                      viewDimension === '2D_SATELLITE'
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Satellite className="h-4 w-4 text-sky-400" />
                      <div>
                        <span className="font-bold block">2D Satellite Radar</span>
                        <span className="text-[10px] text-neutral-400">ESRI World Imagery + Radar Sweep</span>
                      </div>
                    </div>
                    {viewDimension === '2D_SATELLITE' && <span className="text-emerald-400 text-xs">● Active</span>}
                  </button>

                  <button
                    onClick={() => {
                      setViewDimension('3D_DEM_TOPO');
                      setIsSideSliderOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                      viewDimension === '3D_DEM_TOPO'
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Mountain className="h-4 w-4 text-rose-400" />
                      <div>
                        <span className="font-bold block">3D Topo DEM Extrusion</span>
                        <span className="text-[10px] text-neutral-400">WebGL Mountain Terrain Relief</span>
                      </div>
                    </div>
                    {viewDimension === '3D_DEM_TOPO' && <span className="text-emerald-400 text-xs">● Active</span>}
                  </button>

                  <button
                    onClick={() => {
                      setViewDimension('SPC_OUTLOOK');
                      setIsSideSliderOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                      viewDimension === 'SPC_OUTLOOK'
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-purple-400" />
                      <div>
                        <span className="font-bold block">SPC Synoptic Bust Outlook</span>
                        <span className="text-[10px] text-neutral-400">Concentric Isopleths & Hatched Plumes</span>
                      </div>
                    </div>
                    {viewDimension === 'SPC_OUTLOOK' && <span className="text-emerald-400 text-xs">● Active</span>}
                  </button>
                </div>
              </div>

              {/* Section 2: Basemap (2D Only) */}
              {viewDimension === '2D_SATELLITE' && (
                <div className="mb-4 pt-3 border-t border-neutral-200">
                  <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                    Satellite Basemap
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    <button
                      onClick={() => setMapStyle('SATELLITE_HYBRID')}
                      className={`py-1.5 px-2 rounded-lg font-medium border text-center transition-all ${
                        mapStyle === 'SATELLITE_HYBRID'
                          ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      Sat Hybrid
                    </button>
                    <button
                      onClick={() => setMapStyle('SATELLITE_PURE')}
                      className={`py-1.5 px-2 rounded-lg font-medium border text-center transition-all ${
                        mapStyle === 'SATELLITE_PURE'
                          ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      Pure Sat
                    </button>
                    <button
                      onClick={() => setMapStyle('DARK')}
                      className={`py-1.5 px-2 rounded-lg font-medium border text-center transition-all ${
                        mapStyle === 'DARK'
                          ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      Dark Chart
                    </button>
                  </div>
                </div>
              )}

              {/* Section 3: Weather & Radar Overlays */}
              <div className="mb-4 pt-3 border-t border-neutral-200">
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                  Active Map Overlays
                </label>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setShowWeatherLayer(!showWeatherLayer)}
                    className={`p-2 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      showWeatherLayer
                        ? 'bg-sky-50 border-sky-300 text-sky-900 font-semibold'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CloudRain className="h-4 w-4 text-sky-600" />
                      <span>IMD Weather Glyphs</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      showWeatherLayer ? 'bg-sky-600 text-white' : 'bg-neutral-200 text-neutral-600'
                    }`}>
                      {showWeatherLayer ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  {viewDimension === '2D_SATELLITE' && (
                    <button
                      onClick={() => setShowRadarOverlay(!showRadarOverlay)}
                      className={`p-2 rounded-xl border text-xs flex items-center justify-between transition-all ${
                        showRadarOverlay
                          ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Radar className="h-4 w-4 text-rose-600" />
                        <span>Radar Sweep Beam</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        showRadarOverlay ? 'bg-rose-600 text-white' : 'bg-neutral-200 text-neutral-600'
                      }`}>
                        {showRadarOverlay ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Section 4: Primary Metric */}
              <div className="mb-4 pt-3 border-t border-neutral-200">
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                  Display Metric
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setDisplayMetric('BUST_PROB')}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                      displayMetric === 'BUST_PROB'
                        ? 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    Bust Probability %
                  </button>
                  <button
                    onClick={() => setDisplayMetric('CONFIDENCE')}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                      displayMetric === 'CONFIDENCE'
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    Confidence Score %
                  </button>
                </div>
              </div>

              {/* Section 5: Risk Filter */}
              <div className="mb-2 pt-3 border-t border-neutral-200">
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                  Subdivision Filter
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button
                    onClick={() => setFilter('ALL')}
                    className={`py-1.5 rounded-lg border font-medium text-center transition-all ${
                      filter === 'ALL'
                        ? 'bg-neutral-900 text-white border-neutral-900 font-semibold shadow-xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    All (36)
                  </button>
                  <button
                    onClick={() => setFilter('DANGER')}
                    className={`py-1.5 rounded-lg border font-medium text-center transition-all ${
                      filter === 'DANGER'
                        ? 'bg-rose-600 text-white border-rose-600 font-semibold shadow-xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    Danger
                  </button>
                  <button
                    onClick={() => setFilter('SAFE')}
                    className={`py-1.5 rounded-lg border font-medium text-center transition-all ${
                      filter === 'SAFE'
                        ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    Safe
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {viewDimension === '3D_DEM_TOPO' ? (
          <DemTerrainMap3D
            subdivisions={filteredSubdivisions}
            selectedSubdivision={selectedSubdivision}
            onSelectSubdivision={onSelectSubdivision}
            displayMetric={displayMetric}
            showWeatherLayer={showWeatherLayer}
            scenarioId={scenario?.id}
          />
        ) : viewDimension === 'SPC_OUTLOOK' ? (
          <SynopticOutlookMap
            subdivisions={filteredSubdivisions}
            selectedSubdivision={selectedSubdivision}
            scenario={scenario || undefined}
            leadTime={leadTime}
            onSelectSubdivision={onSelectSubdivision}
          />
        ) : (
          <div className="w-full h-full relative">
            <MapContainer
              center={[22.5937, 78.9629]}
              zoom={4.8}
              scrollWheelZoom={true}
              className="w-full h-full"
              style={{ background: '#0a0a0a' }}
            >
              {/* Smooth auto-pan controller */}
              <MapController selected={selectedSubdivision} />

              {/* Basemap Selection */}
              {mapStyle === 'SATELLITE_HYBRID' && (
                <>
                  {/* ESRI World Imagery Basemap (True Satellite) */}
                  <TileLayer
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={18}
                  />
                  {/* ESRI Reference Overlay (Borders, Roads, Major Cities) */}
                  <TileLayer
                    attribution='Labels &copy; Esri'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={18}
                    opacity={0.85}
                  />
                </>
              )}

              {mapStyle === 'SATELLITE_PURE' && (
                <TileLayer
                  attribution='Tiles &copy; Esri &mdash; World Imagery'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  maxZoom={18}
                />
              )}

              {mapStyle === 'DARK' && (
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  maxZoom={18}
                />
              )}

              {/* Render 36 IMD Meteorological Subdivisions */}
              {filteredSubdivisions.map((sub) => {
                const isSelected = selectedSubdivision?.id === sub.id;
                const isDanger = sub.risk_level === 'DANGER';
                const isSafe = sub.risk_level === 'SAFE';

                // Distinctive color fills
                let fillColor = sub.risk_color;
                let fillOpacity = isSelected ? 0.70 : isDanger ? 0.52 : isSafe ? 0.40 : 0.45;
                let strokeColor = isSelected ? '#ffffff' : isDanger ? '#ef4444' : isSafe ? '#22c55e' : '#f59e0b';
                let strokeWidth = isSelected ? 3.5 : isDanger ? 2.2 : 1.2;

                return (
                  <React.Fragment key={sub.id}>
                    {/* Regional Polygon */}
                    {sub.coordinates && sub.coordinates.length > 0 && (
                      <Polygon
                        positions={sub.coordinates}
                        pathOptions={{
                          color: strokeColor,
                          weight: strokeWidth,
                          fillColor: fillColor,
                          fillOpacity: fillOpacity
                        }}
                        eventHandlers={{
                          click: () => onSelectSubdivision(sub)
                        }}
                      >
                        <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                          <div className="bg-white border border-neutral-200 text-neutral-900 p-2 rounded-lg text-xs shadow-xl font-sans">
                            <div className="font-bold flex items-center justify-between gap-2">
                              <span>{sub.name}</span>
                              <span
                                className="px-1.5 py-0.2 rounded text-[10px] font-bold"
                                style={{ backgroundColor: sub.risk_color, color: sub.risk_level === 'CAUTION' ? '#000' : '#fff' }}
                              >
                                {sub.risk_level}
                              </span>
                            </div>
                            <div className="text-[11px] text-neutral-600 mt-1 space-y-0.5">
                              <div>Bust Probability: <strong className="text-rose-600 font-mono">{sub.bust_probability}%</strong></div>
                              <div>Confidence: <strong className="text-emerald-600 font-mono">{sub.confidence_score}%</strong></div>
                              <div className="text-neutral-500 font-mono">Exp. Err: ~{sub.expected_error_km}km / ~{sub.expected_error_precip_mm}mm</div>
                            </div>
                          </div>
                        </Tooltip>
                      </Polygon>
                    )}

                    {/* Center Centroid Indicator Marker */}
                    <CircleMarker
                      center={[sub.lat, sub.lon]}
                      radius={isSelected ? 10 : isDanger ? 8 : 5}
                      pathOptions={{
                        color: isSelected ? '#ffffff' : sub.risk_color,
                        weight: isSelected ? 3 : 1.5,
                        fillColor: sub.risk_color,
                        fillOpacity: 0.95
                      }}
                      eventHandlers={{
                        click: () => onSelectSubdivision(sub)
                      }}
                    >
                      <Popup>
                        <div className="text-neutral-900 p-1 min-w-[200px] font-sans">
                          <div className="border-b pb-1 mb-2">
                            <h4 className="font-bold text-sm text-neutral-950">{sub.name}</h4>
                            <span className="text-[11px] text-neutral-600">IMD {sub.zone} &bull; {sub.code}</span>
                          </div>
                          <div className="space-y-1 text-xs">
                            {sub.weather_summary && (
                              <p><span className="text-neutral-600">Weather:</span> <strong className="text-sky-700 font-sans">{sub.weather_summary}</strong></p>
                            )}
                            {sub.temperature_c !== undefined && (
                              <p><span className="text-neutral-600">Temp / 24h Rain:</span> <span className="font-mono font-medium">{sub.temperature_c}&deg;C &bull; {sub.rainfall_mm} mm</span></p>
                            )}
                            <p><span className="text-neutral-600">Bust Probability:</span> <strong className="text-rose-600 font-mono">{sub.bust_probability}%</strong></p>
                            <p><span className="text-neutral-600">Forecast Confidence:</span> <strong className="text-emerald-600 font-mono">{sub.confidence_score}%</strong></p>
                            <p><span className="text-neutral-600">Expected Track Error:</span> &plusmn;{sub.expected_error_km} km</p>
                            <p><span className="text-neutral-600">Expected Precip Error:</span> &plusmn;{sub.expected_error_precip_mm} mm</p>
                            <p><span className="text-neutral-600">Primary Vulnerability:</span> {sub.vulnerable_to.join(', ')}</p>
                          </div>
                          <button
                            onClick={() => onSelectSubdivision(sub)}
                            className="mt-3 w-full py-1.5 bg-neutral-900 text-white font-semibold rounded-lg text-xs hover:bg-black transition-colors shadow"
                          >
                            Inspect Meteorological Drivers &rarr;
                          </button>
                        </div>
                      </Popup>
                    </CircleMarker>
                    {/* Weather Condition Cloud / Storm / Heatwave Glyph */}
                    {showWeatherLayer && (
                      <Marker
                        key={`weather-${sub.id}`}
                        position={[sub.lat + 0.38, sub.lon + 0.38]}
                        icon={L.divIcon({
                          html: getWeatherGlyphHtml(
                            getWeatherConditionForSubdivision(sub, scenario?.id),
                            28,
                            true,
                            sub.name,
                            sub
                          ),
                          className: 'weather-glyph-leaflet-marker',
                          iconSize: [28, 28],
                          iconAnchor: [14, 14]
                        })}
                        eventHandlers={{
                          click: () => onSelectSubdivision(sub)
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </MapContainer>

            {/* Southwest Monsoon Winds Streamlines Indicator (as per IMD reference image) */}
            {showWeatherLayer && (
              <div className="absolute right-28 bottom-20 pointer-events-none z-[400] flex flex-col items-center">
                <div className="bg-emerald-950/85 border border-emerald-500/70 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2.5">
                  <div className="flex flex-col gap-1">
                    <svg width="34" height="22" viewBox="0 0 34 22" fill="none">
                      <path d="M4 18 C 12 16, 20 10, 28 4" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" className="monsoon-wind-stream" />
                      <path d="M22 4 L 28 4 L 28 10" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 20 C 15 18, 22 13, 30 7" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" className="monsoon-wind-stream" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-emerald-300 block tracking-wider uppercase">
                      SOUTHWEST MONSOON WINDS
                    </span>
                    <span className="text-[9px] text-emerald-400/90 font-mono">
                      Synoptic Inflow &bull; Bay of Bengal
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tactical Radar Sweep Beam Animation Overlay */}
            {showRadarOverlay && (
              <div className="absolute inset-0 pointer-events-none z-[400] overflow-hidden">
                <div className="w-full h-full relative opacity-20">
                  <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -mt-[300px] -ml-[300px] rounded-full border border-rose-500/40 animate-radar-sweep origin-center"
                       style={{
                         background: 'conic-gradient(from 0deg, rgba(244,63,94,0.4) 0deg, rgba(244,63,94,0) 60deg, transparent 360deg)'
                       }}
                  />
                </div>
              </div>
            )}

            {/* Floating Satellite Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xl border border-neutral-200 p-3.5 rounded-2xl text-xs z-[1000] shadow-xl max-w-xs">
              <div className="text-[11px] text-neutral-500 font-medium mb-2 flex items-center justify-between border-b border-neutral-200 pb-1.5">
                <span className="flex items-center gap-1.5 text-neutral-900 font-semibold">
                  <Satellite className="h-3.5 w-3.5" />
                  Satellite Bust Radar (Day {leadTime})
                </span>
                <span className="text-neutral-400 font-mono">IMD 36</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500 border border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.6)] animate-pulse" />
                  <span className="text-neutral-800 font-medium">Danger (&ge;65% Bust Risk)</span>
                  <span className="text-[10px] text-rose-600 ml-auto font-semibold">UNRELIABLE</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-amber-400 border border-amber-300" />
                  <span className="text-neutral-800 font-medium">Caution (38–65% Uncertainty)</span>
                  <span className="text-[10px] text-amber-700 ml-auto font-medium">CAUTION</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 border border-emerald-400" />
                  <span className="text-neutral-800 font-medium">Safe (&lt;38% Bust / High Conf)</span>
                  <span className="text-[10px] text-emerald-700 ml-auto font-semibold">RELIABLE</span>
                </div>
              </div>

              {/* IMD Weather Conditions Legend (As per IMD Reference) */}
              {showWeatherLayer && (
                <div className="mt-2.5 pt-2 border-t border-neutral-200">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold mb-1.5 flex items-center justify-between">
                    <span>IMD Forecast Glyphs</span>
                    <span className="text-[9px] text-sky-600 font-mono">Layer ON</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <div className="flex items-center gap-1.5 bg-neutral-50 px-2 py-1 rounded-lg border border-neutral-100">
                      <span className="text-xs">☀️</span>
                      <div>
                        <span className="font-bold text-neutral-900 block leading-none">Heat Wave</span>
                        <span className="text-[8px] text-neutral-400">Extreme Heat</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-neutral-50 px-2 py-1 rounded-lg border border-neutral-100">
                      <span className="text-xs">⛅</span>
                      <div>
                        <span className="font-bold text-neutral-900 block leading-none">Mod. Heat</span>
                        <span className="text-[8px] text-neutral-400">Above Normal</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-neutral-50 px-2 py-1 rounded-lg border border-neutral-100">
                      <span className="text-xs">🌧️</span>
                      <div>
                        <span className="font-bold text-neutral-900 block leading-none">Mod. Rain</span>
                        <span className="text-[8px] text-neutral-400">Many Places</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-neutral-50 px-2 py-1 rounded-lg border border-neutral-100">
                      <span className="text-xs">⛈️</span>
                      <div>
                        <span className="font-bold text-neutral-900 block leading-none">Heavy Rain</span>
                        <span className="text-[8px] text-neutral-400">Storm / Deluge</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selected Region Quick Floating Card with AnimatePresence */}
        <AnimatePresence>
          {selectedSubdivision && dismissedSubId !== selectedSubdivision.id && (
            <motion.div
              key={selectedSubdivision.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xl border border-neutral-200 p-4 rounded-2xl text-xs z-[1000] shadow-xl w-76"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-medium">TARGET REGION</span>
                  <h3 className="font-bold text-neutral-900 text-sm font-sans truncate">{selectedSubdivision.name}</h3>
                  <span className="text-[11px] text-neutral-500">{selectedSubdivision.zone} &bull; {selectedSubdivision.code}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-xs"
                    style={{
                      backgroundColor: selectedSubdivision.risk_color,
                      color: selectedSubdivision.risk_level === 'CAUTION' ? '#000000' : '#ffffff'
                    }}
                  >
                    {selectedSubdivision.risk_level}
                  </span>
                  <button
                    onClick={() => setDismissedSubId(selectedSubdivision.id)}
                    className="h-6 w-6 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors"
                    title="Dismiss region card"
                    aria-label="Dismiss region card"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-neutral-200">
                <div className="bg-rose-50 p-2 rounded-xl border border-rose-200">
                  <span className="text-[10px] text-rose-700 block font-semibold">Bust Risk</span>
                  <span className="text-lg font-bold font-mono text-rose-700">
                    <AnimatedNumber value={selectedSubdivision.bust_probability} decimals={1} suffix="%" />
                  </span>
                </div>
                <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 block font-semibold">Confidence</span>
                  <span className="text-lg font-bold font-mono text-emerald-700">
                    <AnimatedNumber value={selectedSubdivision.confidence_score} decimals={1} suffix="%" />
                  </span>
                </div>
              </div>

              {/* DEM Elevation & Orographic Metrics */}
              {selectedSubdivision.elevation_mean_m !== undefined && (
                <div className="mt-2.5 pt-2 border-t border-neutral-200 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-neutral-50 p-1.5 rounded-lg border border-neutral-200">
                    <span className="text-neutral-500 block text-[10px]">Elevation (DEM)</span>
                    <strong className="text-neutral-900 font-mono">{selectedSubdivision.elevation_mean_m}m</strong>
                    <span className="text-[9px] text-neutral-400 block">Peak: {selectedSubdivision.elevation_max_m}m</span>
                  </div>
                  <div className="bg-neutral-50 p-1.5 rounded-lg border border-neutral-200">
                    <span className="text-neutral-500 block text-[10px]">Orographic Lift</span>
                    <strong className="text-neutral-900 font-mono">{Math.round((selectedSubdivision.orographic_lift_factor || 0) * 100)}%</strong>
                    <span className="text-[9px] text-neutral-400 block">
                      {(selectedSubdivision.orographic_lift_factor || 0) > 0.7 ? 'High Forcing' : 'Moderate'}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
};

export default ConfidenceMap;
