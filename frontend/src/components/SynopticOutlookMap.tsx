import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Subdivision, Scenario } from '../types';
import { generateSynopticContours, SPC_TIERS } from '../utils/synoptic_contours';
import { INDIAN_SYNOPTIC_STATIONS } from '../data/indian_stations';
import { ShieldAlert, Compass, Calendar, AlertTriangle, Layers, Info } from 'lucide-react';

interface SynopticOutlookMapProps {
  subdivisions: Subdivision[];
  selectedSubdivision: Subdivision | null;
  scenario?: Scenario;
  leadTime: number;
  onSelectSubdivision: (sub: Subdivision) => void;
}

// Map center on India
const INDIA_CENTER: [number, number] = [22.5, 80.5];
const INITIAL_ZOOM = 5;

// Custom Station Dot & Label DivIcon
function createStationIcon(name: string): L.DivIcon {
  return L.divIcon({
    className: 'synoptic-station-marker',
    html: `
      <div class="flex items-center gap-1 pointer-events-none select-none">
        <span class="w-1.5 h-1.5 bg-neutral-900 border border-white shadow-xs rounded-[1px] shrink-0"></span>
        <span class="text-[9px] font-sans font-bold tracking-tight text-neutral-800 uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)] whitespace-nowrap -mt-0.5">
          ${name}
        </span>
      </div>
    `,
    iconSize: [80, 16],
    iconAnchor: [0, 8]
  });
}

// Custom Contour Percentage Label DivIcon
function createContourLabelIcon(label: string, color: string, isHatched: boolean): L.DivIcon {
  return L.divIcon({
    className: 'contour-percentage-label',
    html: `
      <div class="pointer-events-none select-none flex items-center justify-center">
        <span class="px-1.5 py-0.5 rounded text-[11px] font-mono font-black italic tracking-wide ${
          isHatched 
            ? 'bg-purple-900 text-purple-100 border border-purple-400 shadow-md' 
            : 'bg-white/90 text-neutral-900 border border-neutral-400 shadow-xs'
        }" style="color: ${isHatched ? '#f3e8ff' : color};">
          ${label}
        </span>
      </div>
    `,
    iconSize: [40, 20],
    iconAnchor: [20, 10]
  });
}

// Map Resizer component
const MapResizer: React.FC = () => {
  const map = useMap();
  React.useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

export const SynopticOutlookMap: React.FC<SynopticOutlookMapProps> = ({
  subdivisions,
  selectedSubdivision,
  scenario,
  leadTime,
  onSelectSubdivision
}) => {
  const [showStations, setShowStations] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // Compute the spatial isopleth contours
  const contourData = useMemo(() => {
    return generateSynopticContours(subdivisions, 80, 85);
  }, [subdivisions]);

  // Find peak subdivision bust
  const maxBustSub = useMemo(() => {
    if (!subdivisions || subdivisions.length === 0) return null;
    return [...subdivisions].sort((a, b) => b.bust_probability - a.bust_probability)[0];
  }, [subdivisions]);

  // Style each GeoJSON contour feature
  const styleContour = (feature: any) => {
    if (!feature?.properties) {
      return {
        color: '#dc2626',
        weight: 2,
        fillColor: '#ef4444',
        fillOpacity: 0.4
      };
    }

    const { borderColor, fillColor, fillOpacity, isHatched } = feature.properties;

    return {
      color: borderColor,
      weight: isHatched ? 3 : 2.2,
      opacity: 0.95,
      fillColor: isHatched ? 'url(#spcHatchPattern)' : fillColor,
      fillOpacity: isHatched ? 0.75 : fillOpacity,
      lineCap: 'round' as const,
      lineJoin: 'round' as const,
      dashArray: isHatched ? '4, 2' : undefined
    };
  };

  return (
    <div className="relative w-full h-full bg-neutral-100 font-sans overflow-hidden">
      {/* SVG Definitions for NOAA-style Diagonal Hatching */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <pattern
            id="spcHatchPattern"
            width="8"
            height="8"
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="8" stroke="#9333ea" strokeWidth="2.5" />
            <rect width="8" height="8" fill="rgba(217, 70, 239, 0.45)" />
          </pattern>
        </defs>
      </svg>

      {/* Top Map Layer Controls */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2">
        <button
          onClick={() => setShowStations(!showStations)}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border backdrop-blur-md shadow-sm transition-all flex items-center gap-1.5 ${
            showStations
              ? 'bg-neutral-900 text-white border-neutral-800'
              : 'bg-white/90 text-neutral-700 border-neutral-300 hover:bg-white'
          }`}
          title="Toggle synoptic city stations"
        >
          <Compass className="h-3 w-3" />
          <span>Stations {showStations ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={() => setShowLabels(!showLabels)}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border backdrop-blur-md shadow-sm transition-all flex items-center gap-1.5 ${
            showLabels
              ? 'bg-neutral-900 text-white border-neutral-800'
              : 'bg-white/90 text-neutral-700 border-neutral-300 hover:bg-white'
          }`}
          title="Toggle contour probability % labels"
        >
          <Layers className="h-3 w-3" />
          <span>% Labels {showLabels ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Leaflet Map with ESRI Light Gray Canvas clean basemap (Free, No API Key Required) */}
      <MapContainer
        center={INDIA_CENTER}
        zoom={INITIAL_ZOOM}
        minZoom={4.5}
        maxZoom={8}
        className="w-full h-full"
        zoomControl={false}
      >
        <MapResizer />

        {/* Clean Paper-Style ESRI Light Gray Canvas Basemap */}
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
        />
        <TileLayer
          attribution='Labels &copy; Esri'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
          opacity={0.85}
        />

        {/* GeoJSON Probability Contour Polygons */}
        {contourData.features.length > 0 && (
          <GeoJSON
            key={`contours-day-${leadTime}-${scenario?.id || 'base'}`}
            data={contourData as any}
            style={styleContour}
            onEachFeature={(feature, layer) => {
              if (feature.properties) {
                const { label, tierName, isHatched } = feature.properties;
                layer.bindTooltip(
                  `<div class="text-xs font-sans">
                    <strong class="text-neutral-900">${tierName}</strong>
                    <div class="text-[10px] text-neutral-600 font-mono">Bust Threshold &ge; ${label}</div>
                    ${isHatched ? '<div class="text-[10px] text-purple-700 font-bold mt-0.5">&bull; SIGNIFICANT RISK AREA (HATCHED)</div>' : ''}
                  </div>`,
                  { sticky: true, className: 'synoptic-contour-tooltip' }
                );
              }
            }}
          />
        )}

        {/* Contour Percentage Labels positioned at contour centers */}
        {showLabels &&
          contourData.features.map((feat, idx) => {
            const { centerLat, centerLon, label, borderColor, isHatched } = feat.properties;
            if (!centerLat || !centerLon) return null;
            return (
              <Marker
                key={`label-${idx}-${label}`}
                position={[centerLat, centerLon]}
                icon={createContourLabelIcon(label, borderColor, isHatched)}
                interactive={false}
              />
            );
          })}

        {/* Indian Synoptic City Stations (Black/Red square dots with uppercase names) */}
        {showStations &&
          INDIAN_SYNOPTIC_STATIONS.map((station) => (
            <Marker
              key={station.id}
              position={[station.lat, station.lon]}
              icon={createStationIcon(station.name)}
              interactive={true}
            >
              <Tooltip direction="top" offset={[0, -5]} opacity={0.95}>
                <div className="text-xs font-sans">
                  <strong>{station.name}</strong> ({station.code})
                  <span className="block text-[10px] text-neutral-500 font-mono">
                    {station.state} &bull; {station.lat.toFixed(2)}&deg;N, {station.lon.toFixed(2)}&deg;E
                  </span>
                </div>
              </Tooltip>
            </Marker>
          ))}
      </MapContainer>

      {/* Official NOAA / IMD Style Forecast Outlook Bureau Box (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-[1000] pointer-events-none">
        <div className="bg-white/95 border-2 border-neutral-900 p-3 rounded-lg shadow-2xl backdrop-blur-md max-w-sm pointer-events-auto">
          <div className="flex items-center gap-2.5 pb-2 mb-2 border-b border-neutral-300">
            {/* Bureau Emblem Badge */}
            <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center font-black text-xs tracking-wider border-2 border-neutral-700 shrink-0">
              IMD
            </div>
            <div>
              <h4 className="text-xs font-black tracking-wider text-neutral-900 uppercase">
                PAWANSATYA DAY {leadTime} FORECAST BUST OUTLOOK
              </h4>
              <p className="text-[10px] text-neutral-600 font-mono leading-tight">
                SYNOPTIC PROBABILITY CONVECTIVE PLUME
              </p>
            </div>
          </div>

          <div className="space-y-1 text-[11px] font-mono text-neutral-800">
            <div className="flex justify-between">
              <span className="text-neutral-500 font-sans">ISSUED:</span>
              <span className="font-semibold">0600Z / CYCLE {leadTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 font-sans">VALID:</span>
              <span className="font-semibold">
                DAY {leadTime} (+{(leadTime - 1) * 24}h to +{leadTime * 24}h)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 font-sans">SCENARIO:</span>
              <span className="font-semibold text-rose-700 truncate max-w-[170px]">
                {scenario?.name || 'Monsoon Flow'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 font-sans">FORECASTER:</span>
              <span className="font-semibold text-sky-800">AI ENSEMBLE (LightGBM)</span>
            </div>
            {maxBustSub && (
              <div className="flex justify-between pt-1 border-t border-neutral-200 text-rose-700">
                <span className="text-neutral-500 font-sans">PEAK CORE:</span>
                <span className="font-bold">
                  {maxBustSub.name} ({maxBustSub.bust_probability}%)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Official NOAA / SPC Stepped Probability Legend Box (Bottom-Right) */}
      <div className="absolute bottom-4 right-4 z-[1000] pointer-events-none">
        <div className="bg-white/95 border-2 border-neutral-900 p-2.5 rounded-lg shadow-2xl backdrop-blur-md pointer-events-auto">
          <div className="text-[11px] font-bold text-neutral-900 mb-1.5 uppercase tracking-tight flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <span>Forecast Bust Probability Legend (in %):</span>
          </div>

          {/* Stepped Horizontal Color Bar matching NOAA SPC style */}
          <div className="flex items-center border border-neutral-900 rounded overflow-hidden text-[10px] font-mono font-bold text-white shadow-xs">
            {/* 10% */}
            <div
              className="px-2.5 py-1 text-center border-r border-neutral-900"
              style={{ backgroundColor: '#15803d' }}
              title="10% Marginal Risk"
            >
              10
            </div>
            {/* 25% */}
            <div
              className="px-2.5 py-1 text-center border-r border-neutral-900"
              style={{ backgroundColor: '#92400e' }}
              title="25% Slight Risk"
            >
              25
            </div>
            {/* 45% */}
            <div
              className="px-2.5 py-1 text-center border-r border-neutral-900 text-neutral-950"
              style={{ backgroundColor: '#eab308' }}
              title="45% Enhanced Risk"
            >
              45
            </div>
            {/* 60% */}
            <div
              className="px-2.5 py-1 text-center border-r border-neutral-900"
              style={{ backgroundColor: '#dc2626' }}
              title="60% Moderate Risk"
            >
              60
            </div>
            {/* 75% */}
            <div
              className="px-2.5 py-1 text-center border-r border-neutral-900"
              style={{ backgroundColor: '#d946ef' }}
              title="75% Significant Risk"
            >
              75
            </div>
            {/* Significant Hatched Area */}
            <div
              className="px-2.5 py-1 text-center bg-purple-900 text-purple-100 flex items-center gap-1 relative overflow-hidden"
              title="Hatched: Significant Model Bust Discrepancy (>=75%)"
            >
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, transparent 2px, transparent 6px)'
                }}
              />
              <span className="relative z-10">Sig ▨</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] text-neutral-500 font-sans mt-1.5 px-0.5">
            <span>Low Bust</span>
            <span>Critical Model Failure &bull; Hatched Core</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SynopticOutlookMap;
