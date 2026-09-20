import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Polygon, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import { Subdivision } from '../types';
import {
  Satellite,
  Radar
} from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';

interface ConfidenceMapProps {
  subdivisions: Subdivision[];
  selectedSubdivision: Subdivision | null;
  onSelectSubdivision: (sub: Subdivision) => void;
  leadTime: number;
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
  leadTime
}) => {
  const [filter, setFilter] = useState<'ALL' | 'DANGER' | 'SAFE'>('ALL');
  const [displayMetric, setDisplayMetric] = useState<'BUST_PROB' | 'CONFIDENCE'>('BUST_PROB');
  const [mapStyle, setMapStyle] = useState<'SATELLITE_HYBRID' | 'SATELLITE_PURE' | 'DARK'>('SATELLITE_HYBRID');
  const [showRadarOverlay, setShowRadarOverlay] = useState<boolean>(true);

  const filteredSubdivisions = subdivisions.filter((sub) => {
    if (filter === 'DANGER') return sub.risk_level === 'DANGER';
    if (filter === 'SAFE') return sub.risk_level === 'SAFE';
    return true;
  });

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[680px] relative">
      
      {/* Top Map Toolbar */}
      <div className="p-3 bg-neutral-950/85 backdrop-blur-xl border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 z-10">
        
        {/* Title & Satellite Mode Badge */}
        <div className="flex items-center space-x-2.5">
          <div className="h-7 w-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            <Satellite className="h-4 w-4 text-white" />
          </div>
          <span className="text-xs font-semibold text-white">
            High-Resolution Satellite Bust Radar
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ESRI World Imagery
          </span>
        </div>

        {/* Map Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Basemap Switcher */}
          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setMapStyle('SATELLITE_HYBRID')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                mapStyle === 'SATELLITE_HYBRID' ? 'bg-white text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
              title="Satellite with political borders and geographic labels"
            >
              Sat Hybrid
            </button>
            <button
              onClick={() => setMapStyle('SATELLITE_PURE')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                mapStyle === 'SATELLITE_PURE' ? 'bg-white text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
              title="Pure High-Resolution Satellite Imagery"
            >
              Pure Sat
            </button>
            <button
              onClick={() => setMapStyle('DARK')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                mapStyle === 'DARK' ? 'bg-white text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
              title="Dark Synoptic Chart"
            >
              Dark
            </button>
          </div>

          {/* Radar Sweep Toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRadarOverlay(!showRadarOverlay)}
            className={`px-2.5 py-1 rounded-xl border text-xs flex items-center gap-1.5 transition-colors ${
              showRadarOverlay
                ? 'bg-rose-950/40 border-rose-800 text-rose-300 font-medium'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title="Toggle animated radar sweep overlay"
          >
            <Radar className={`h-3.5 w-3.5 ${showRadarOverlay ? 'text-rose-400 animate-spin' : ''}`} />
            <span>Radar Sweep</span>
          </motion.button>

          {/* Metric Toggle */}
          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setDisplayMetric('BUST_PROB')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                displayMetric === 'BUST_PROB' ? 'bg-rose-600 text-white font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Bust %
            </button>
            <button
              onClick={() => setDisplayMetric('CONFIDENCE')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                displayMetric === 'CONFIDENCE' ? 'bg-emerald-600 text-white font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Conf %
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === 'ALL' ? 'bg-white text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              All (36)
            </button>
            <button
              onClick={() => setFilter('DANGER')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === 'DANGER' ? 'bg-rose-600 text-white font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Danger
            </button>
            <button
              onClick={() => setFilter('SAFE')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === 'SAFE' ? 'bg-emerald-600 text-white font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Safe
            </button>
          </div>

        </div>

      </div>

      {/* Leaflet Satellite Map */}
      <div className="flex-1 w-full h-full relative">
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
                      fillOpacity: fillOpacity,
                      dashArray: isSelected ? undefined : undefined
                    }}
                    eventHandlers={{
                      click: () => onSelectSubdivision(sub)
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                      <div className="bg-neutral-900 border border-neutral-800 text-white p-2 rounded-lg text-xs shadow-xl font-sans">
                        <div className="font-bold flex items-center justify-between gap-2">
                          <span>{sub.name}</span>
                          <span
                            className="px-1.5 py-0.2 rounded text-[10px] font-bold"
                            style={{ backgroundColor: sub.risk_color, color: sub.risk_level === 'CAUTION' ? '#000' : '#fff' }}
                          >
                            {sub.risk_level}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-300 mt-1 space-y-0.5">
                          <div>Bust Probability: <strong className="text-rose-400 font-mono">{sub.bust_probability}%</strong></div>
                          <div>Confidence: <strong className="text-emerald-400 font-mono">{sub.confidence_score}%</strong></div>
                          <div className="text-neutral-400 font-mono">Exp. Err: ~{sub.expected_error_km}km / ~{sub.expected_error_precip_mm}mm</div>
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
              </React.Fragment>
            );
          })}
        </MapContainer>

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
        <div className="absolute bottom-4 left-4 bg-neutral-950/90 backdrop-blur-xl border border-neutral-800 p-3.5 rounded-2xl text-xs z-[1000] shadow-2xl max-w-xs">
          <div className="text-[11px] text-neutral-400 font-medium mb-2 flex items-center justify-between border-b border-neutral-800/80 pb-1.5">
            <span className="flex items-center gap-1.5 text-white font-semibold">
              <Satellite className="h-3.5 w-3.5" />
              Satellite Bust Radar (Day {leadTime})
            </span>
            <span className="text-neutral-400 font-mono">IMD 36</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-rose-500 border border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.9)] animate-pulse" />
              <span className="text-white font-medium">Danger (&ge;65% Bust Risk)</span>
              <span className="text-[10px] text-rose-400 ml-auto font-semibold">UNRELIABLE</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-amber-400 border border-amber-300" />
              <span className="text-white font-medium">Caution (38–65% Uncertainty)</span>
              <span className="text-[10px] text-amber-400 ml-auto font-medium">CAUTION</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500 border border-emerald-400" />
              <span className="text-white font-medium">Safe (&lt;38% Bust / High Conf)</span>
              <span className="text-[10px] text-emerald-400 ml-auto font-semibold">RELIABLE</span>
            </div>
          </div>
        </div>

        {/* Selected Region Quick Floating Card with AnimatePresence */}
        <AnimatePresence>
          {selectedSubdivision && (
            <motion.div
              key={selectedSubdivision.id}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="absolute top-4 right-4 bg-neutral-950/95 backdrop-blur-xl border border-neutral-800 p-4 rounded-2xl text-xs z-[1000] shadow-2xl w-76"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-medium">TARGET REGION</span>
                  <h3 className="font-bold text-white text-sm font-sans">{selectedSubdivision.name}</h3>
                  <span className="text-[11px] text-neutral-400">{selectedSubdivision.zone} &bull; {selectedSubdivision.code}</span>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-sm"
                  style={{
                    backgroundColor: selectedSubdivision.risk_color,
                    color: selectedSubdivision.risk_level === 'CAUTION' ? '#000000' : '#ffffff'
                  }}
                >
                  {selectedSubdivision.risk_level}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
                <div className="bg-neutral-900/80 p-2 rounded-xl border border-rose-900/40">
                  <span className="text-[10px] text-rose-400 block font-semibold">Bust Risk</span>
                  <span className="text-lg font-bold font-mono text-rose-400">
                    <AnimatedNumber value={selectedSubdivision.bust_probability} decimals={1} suffix="%" />
                  </span>
                </div>
                <div className="bg-neutral-900/80 p-2 rounded-xl border border-emerald-900/40">
                  <span className="text-[10px] text-emerald-400 block font-semibold">Confidence</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    <AnimatedNumber value={selectedSubdivision.confidence_score} decimals={1} suffix="%" />
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
};

export default ConfidenceMap;
