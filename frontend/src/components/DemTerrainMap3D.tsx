import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Map, Marker, MapLayerMouseEvent, GeoJSONSource } from 'maplibre-gl';
import { Subdivision } from '../types';
import {
  Compass,
  Mountain,
  Maximize2,
  Eye,
  Layers,
  Sparkles,
  Info,
  RotateCcw
} from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';
import { getWeatherConditionForSubdivision, getWeatherGlyphHtml } from './WeatherGlyph';

interface DemTerrainMap3DProps {
  subdivisions: Subdivision[];
  selectedSubdivision: Subdivision | null;
  onSelectSubdivision: (sub: Subdivision) => void;
  displayMetric: 'BUST_PROB' | 'CONFIDENCE';
  showWeatherLayer?: boolean;
  scenarioId?: string;
}

interface CameraPreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
}

const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'india_overview',
    name: 'India Overview',
    icon: '🌐',
    description: 'Subcontinent synoptic overview with 45° 3D elevation tilt',
    center: [78.9629, 22.5937],
    zoom: 4.6,
    pitch: 45,
    bearing: 0
  },
  {
    id: 'himalayas',
    name: 'Himalayan Arc',
    icon: '🏔️',
    description: 'Western Disturbances & extreme orographic snow barriers (HP, UTK, J&K)',
    center: [77.5, 31.8],
    zoom: 6.5,
    pitch: 65,
    bearing: -25
  },
  {
    id: 'western_ghats',
    name: 'Western Ghats',
    icon: '🌊',
    description: 'SW Monsoon orographic ramp & cloudburst hotspot (Konkan, Goa, Kerala)',
    center: [74.5, 14.8],
    zoom: 6.6,
    pitch: 68,
    bearing: 35
  },
  {
    id: 'northeast',
    name: 'Northeast Funnel',
    icon: '🌲',
    description: 'Mawsynram/Cherrapunji moisture trap & Brahmaputra orography',
    center: [93.2, 26.0],
    zoom: 6.4,
    pitch: 62,
    bearing: -15
  }
];

export const DemTerrainMap3D: React.FC<DemTerrainMap3DProps> = ({
  subdivisions,
  selectedSubdivision,
  onSelectSubdivision,
  displayMetric,
  showWeatherLayer = true,
  scenarioId
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const subdivisionsRef = useRef<Subdivision[]>(subdivisions);
  const selectedSubdivisionRef = useRef<Subdivision | null>(selectedSubdivision);
  subdivisionsRef.current = subdivisions;
  selectedSubdivisionRef.current = selectedSubdivision;

  const [activePreset, setActivePreset] = useState<string>('india_overview');
  const [currentPitch, setCurrentPitch] = useState<number>(45);
  const [currentBearing, setCurrentBearing] = useState<number>(0);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [exaggeration, setExaggeration] = useState<number>(2.2);

  // Helper to ensure coordinates are [lon, lat] for GeoJSON
  const toGeoJsonCoord = (coord: [number, number]): [number, number] => {
    // India longitude: 68° to 98°, latitude: 6° to 38°
    return coord[0] > coord[1] ? [coord[0], coord[1]] : [coord[1], coord[0]];
  };

  // Convert subdivisions to GeoJSON feature collection (polygons)
  const getSubdivisionsGeoJson = useCallback(() => {
    const list = subdivisionsRef.current.length > 0 ? subdivisionsRef.current : subdivisions;
    return {
      type: 'FeatureCollection' as const,
      features: list.map((sub) => {
        const isSelected = selectedSubdivisionRef.current?.id === sub.id;
        const coords = (sub.coordinates && sub.coordinates.length > 0)
          ? sub.coordinates.map(toGeoJsonCoord)
          : [];

        // Close polygon if not closed
        if (coords.length > 0 && (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])) {
          coords.push(coords[0]);
        }

        return {
          type: 'Feature' as const,
          id: sub.id,
          properties: {
            id: sub.id,
            name: sub.name,
            code: sub.code,
            zone: sub.zone,
            bust_probability: sub.bust_probability,
            confidence_score: sub.confidence_score,
            risk_level: sub.risk_level,
            risk_color: sub.risk_color,
            elevation_mean_m: sub.elevation_mean_m || 300,
            elevation_max_m: sub.elevation_max_m || 1000,
            orographic_lift_factor: sub.orographic_lift_factor || 0.35,
            terrain_ruggedness: sub.terrain_ruggedness || 0.3,
            isSelected
          },
          geometry: {
            type: 'Polygon' as const,
            coordinates: [coords]
          }
        };
      })
    };
  }, [subdivisions, selectedSubdivision]);

  // Convert subdivisions to GeoJSON feature collection for centroid circle marks (points)
  const getCentroidsGeoJson = useCallback(() => {
    const list = subdivisionsRef.current.length > 0 ? subdivisionsRef.current : subdivisions;
    return {
      type: 'FeatureCollection' as const,
      features: list.map((sub) => {
        const isSelected = selectedSubdivisionRef.current?.id === sub.id;
        const isDanger = sub.risk_level === 'DANGER';
        const isCaution = sub.risk_level === 'CAUTION';
        return {
          type: 'Feature' as const,
          id: sub.id,
          properties: {
            id: sub.id,
            name: sub.name,
            code: sub.code,
            zone: sub.zone,
            bust_probability: sub.bust_probability,
            confidence_score: sub.confidence_score,
            risk_level: sub.risk_level,
            risk_color: sub.risk_color,
            isSelected,
            isDanger,
            isCaution
          },
          geometry: {
            type: 'Point' as const,
            coordinates: [sub.lon, sub.lat]
          }
        };
      })
    };
  }, [subdivisions, selectedSubdivision]);

  // Initialize MapLibre GL 3D Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          // ESRI World Satellite Imagery
          'esri-satellite': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            attribution: 'Esri World Imagery'
          },
          // Boundaries and place labels overlay
          'esri-labels': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            attribution: 'Esri Labels'
          },
          // Global AWS Open Data Terrarium DEM Elevation Tiles (0 MB local disk usage)
          'terrain-dem': {
            type: 'raster-dem',
            tiles: [
              'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
            ],
            encoding: 'terrarium',
            tileSize: 256
          }
        },
        layers: [
          {
            id: 'satellite-layer',
            type: 'raster',
            source: 'esri-satellite',
            minzoom: 0,
            maxzoom: 19
          },
          {
            id: 'labels-layer',
            type: 'raster',
            source: 'esri-labels',
            minzoom: 0,
            maxzoom: 19,
            paint: {
              'raster-opacity': 0.75
            }
          }
        ],
        terrain: {
          source: 'terrain-dem',
          exaggeration: 2.2
        },
        sky: {
          'sky-color': '#111827',
          'sky-horizon-blend': 0.5,
          'horizon-color': '#374151',
          'horizon-fog-blend': 0.8,
          'fog-color': '#1f2937',
          'fog-ground-blend': 0.6
        }
      },
      center: [78.9629, 22.5937],
      zoom: 4.6,
      pitch: 45,
      bearing: 0,
      maxPitch: 82
    });

    mapRef.current = map;

    map.on('load', () => {
      setIsMapLoaded(true);

      // Add Subdivisions GeoJSON source
      map.addSource('subdivisions-source', {
        type: 'geojson',
        data: getSubdivisionsGeoJson()
      });

      // 3D Draped Polygon Fill Layer
      map.addLayer({
        id: 'subdivisions-fill',
        type: 'fill',
        source: 'subdivisions-source',
        paint: {
          'fill-color': ['get', 'risk_color'],
          'fill-opacity': [
            'case',
            ['get', 'isSelected'],
            0.75,
            ['==', ['get', 'risk_level'], 'DANGER'],
            0.55,
            ['==', ['get', 'risk_level'], 'CAUTION'],
            0.45,
            0.35
          ]
        }
      });

      // Regional Boundary Outlines Layer
      map.addLayer({
        id: 'subdivisions-outline',
        type: 'line',
        source: 'subdivisions-source',
        paint: {
          'line-color': [
            'case',
            ['get', 'isSelected'],
            '#ffffff',
            ['==', ['get', 'risk_level'], 'DANGER'],
            '#ef4444',
            ['==', ['get', 'risk_level'], 'CAUTION'],
            '#f59e0b',
            '#22c55e'
          ],
          'line-width': [
            'case',
            ['get', 'isSelected'],
            3.5,
            ['==', ['get', 'risk_level'], 'DANGER'],
            2.2,
            1.2
          ],
          'line-opacity': 0.9
        }
      });

      // Add Centroids Point Source for 3D Circle Marks (Green, Yellow, Red)
      map.addSource('subdivisions-centroids', {
        type: 'geojson',
        data: getCentroidsGeoJson()
      });

      // Outer Pulsing Glow Halo Circle Layer
      map.addLayer({
        id: 'subdivisions-circles-glow',
        type: 'circle',
        source: 'subdivisions-centroids',
        paint: {
          'circle-radius': [
            'case',
            ['get', 'isSelected'], 18,
            ['get', 'isDanger'], 14,
            0
          ],
          'circle-color': ['get', 'risk_color'],
          'circle-opacity': 0.45,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': ['get', 'risk_color'],
          'circle-pitch-alignment': 'viewport'
        }
      });

      // Main Vibrant Circle Dot Layer (Red, Yellow, Green matching 2D map)
      map.addLayer({
        id: 'subdivisions-circles',
        type: 'circle',
        source: 'subdivisions-centroids',
        paint: {
          'circle-radius': [
            'case',
            ['get', 'isSelected'], 10,
            ['get', 'isDanger'], 8.5,
            ['get', 'isCaution'], 7,
            6
          ],
          'circle-color': ['get', 'risk_color'],
          'circle-stroke-width': [
            'case',
            ['get', 'isSelected'], 3,
            2
          ],
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.95,
          'circle-pitch-alignment': 'viewport'
        }
      });

      // Click event on circles
      map.on('click', 'subdivisions-circles', (e: MapLayerMouseEvent) => {
        if (!e.features || e.features.length === 0) return;
        const subId = e.features[0].properties?.id;
        const targetSub = subdivisionsRef.current.find((s) => s.id === subId);
        if (targetSub) {
          onSelectSubdivision(targetSub);
        }
      });

      map.on('mouseenter', 'subdivisions-circles', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'subdivisions-circles', () => {
        map.getCanvas().style.cursor = '';
      });

      // Click event on polygons
      map.on('click', 'subdivisions-fill', (e: MapLayerMouseEvent) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const subId = feature.properties?.id;
        const targetSub = subdivisionsRef.current.find((s) => s.id === subId);
        if (targetSub) {
          onSelectSubdivision(targetSub);
        }
      });

      // Hover cursor
      map.on('mouseenter', 'subdivisions-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'subdivisions-fill', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    // Track camera pitch & bearing
    map.on('rotate', () => {
      setCurrentBearing(Math.round(map.getBearing()));
    });
    map.on('pitch', () => {
      setCurrentPitch(Math.round(map.getPitch()));
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update GeoJSON data when subdivisions or selectedSubdivision changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    const source = map.getSource('subdivisions-source') as maplibregl.GeoJSONSource;
    if (source) {
      source.setData(getSubdivisionsGeoJson());
    }

    const centroidsSource = map.getSource('subdivisions-centroids') as maplibregl.GeoJSONSource;
    if (centroidsSource) {
      centroidsSource.setData(getCentroidsGeoJson());
    }
  }, [subdivisions, selectedSubdivision, isMapLoaded, getSubdivisionsGeoJson, getCentroidsGeoJson]);

  // Update Centroid 3D HTML Circular Markers (Green, Red, Yellow dots + Weather Glyphs)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Render interactive circular marks for all 36 subdivisions
    subdivisions.forEach((sub) => {
      const isSelected = selectedSubdivision?.id === sub.id;
      const isDanger = sub.risk_level === 'DANGER';
      const isCaution = sub.risk_level === 'CAUTION';

      const size = isSelected ? 24 : isDanger ? 20 : isCaution ? 16 : 14;

      const weatherCond = getWeatherConditionForSubdivision(sub, scenarioId);
      const weatherGlyphHtml = showWeatherLayer
        ? getWeatherGlyphHtml(weatherCond, 22, false, sub.name, sub)
        : '';

      const el = document.createElement('div');
      el.className = 'group relative flex items-center justify-center cursor-pointer';
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;

      el.innerHTML = `
        ${isDanger ? `
          <span class="absolute inset-0 rounded-full animate-ping opacity-75" style="background-color: ${sub.risk_color};"></span>
          <span class="absolute -inset-1 rounded-full animate-pulse opacity-40" style="background-color: ${sub.risk_color};"></span>
        ` : ''}
        ${isSelected ? `
          <span class="absolute -inset-1.5 rounded-full border-2 border-white animate-pulse"></span>
        ` : ''}
        <span class="relative block w-full h-full rounded-full shadow-lg transition-transform duration-200 group-hover:scale-125" style="
          background-color: ${sub.risk_color};
          border: ${isSelected ? '3px solid #ffffff' : '2px solid #ffffff'};
          box-shadow: 0 0 8px ${sub.risk_color}, 0 2px 5px rgba(0,0,0,0.6);
        "></span>

        <!-- Weather Condition Cloud / Storm / Sun Glyph -->
        ${showWeatherLayer ? `
          <div class="absolute -top-3.5 -right-3.5 pointer-events-none drop-shadow-md">
            ${weatherGlyphHtml}
          </div>
        ` : ''}

        <!-- Hover Tooltip with Region Name, Bust %, and Real Weather Metrics -->
        <div class="pointer-events-none absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-50 whitespace-nowrap">
          <div class="bg-neutral-900/95 text-white text-[11px] font-sans px-2.5 py-1 rounded-lg shadow-xl border border-neutral-700 backdrop-blur-md flex flex-col gap-0.5">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full" style="background-color: ${sub.risk_color};"></span>
              <span class="font-semibold">${sub.name}</span>
              <span class="text-neutral-300 font-mono text-[10px]">(${sub.bust_probability}% bust)</span>
              ${showWeatherLayer ? `<span class="text-neutral-400 font-sans text-[10px]">&bull; ${weatherCond.replace('_', ' ')}</span>` : ''}
            </div>
            ${showWeatherLayer && (sub.weather_summary || sub.temperature_c !== undefined) ? `
              <div class="text-[9px] text-neutral-300 flex items-center gap-1.5 font-mono border-t border-neutral-800 pt-0.5 mt-0.5">
                ${sub.temperature_c !== undefined ? `<span>${sub.temperature_c}&deg;C</span>` : ''}
                ${sub.rainfall_mm !== undefined ? `<span>&bull; ${sub.rainfall_mm}mm/24h</span>` : ''}
                ${sub.wind_speed_kmh !== undefined ? `<span>&bull; ${sub.wind_speed_kmh}km/h</span>` : ''}
                ${sub.weather_summary ? `<span class="text-sky-300 font-sans italic">&bull; ${sub.weather_summary}</span>` : ''}
              </div>
            ` : ''}
          </div>
          <div class="w-1.5 h-1.5 bg-neutral-900 rotate-45 -mt-0.5 border-r border-b border-neutral-700"></div>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectSubdivision(sub);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([sub.lon, sub.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [subdivisions, selectedSubdivision, isMapLoaded, displayMetric, showWeatherLayer, scenarioId, onSelectSubdivision]);

  // Fly to selected subdivision when changed externally
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedSubdivision || !isMapLoaded) return;

    map.flyTo({
      center: [selectedSubdivision.lon, selectedSubdivision.lat],
      zoom: Math.max(map.getZoom(), 6.2),
      pitch: Math.max(map.getPitch(), 58),
      duration: 1200,
      essential: true
    });
  }, [selectedSubdivision, isMapLoaded]);

  // Camera preset handler
  const handlePresetSelect = (preset: CameraPreset) => {
    setActivePreset(preset.id);
    const map = mapRef.current;
    if (!map) return;

    map.flyTo({
      center: preset.center,
      zoom: preset.zoom,
      pitch: preset.pitch,
      bearing: preset.bearing,
      duration: 1800,
      essential: true
    });
  };

  // Adjust pitch
  const handlePitchChange = (delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    const newPitch = Math.min(80, Math.max(0, map.getPitch() + delta));
    map.setPitch(newPitch);
    setCurrentPitch(Math.round(newPitch));
  };

  // Reset bearing to North
  const handleResetNorth = () => {
    const map = mapRef.current;
    if (!map) return;
    map.resetNorthPitch({ duration: 800 });
  };

  // Toggle terrain exaggeration
  const handleToggleExaggeration = () => {
    const map = mapRef.current;
    if (!map) return;
    const nextExagg = exaggeration === 2.2 ? 1.2 : 2.2;
    setExaggeration(nextExagg);
    map.setTerrain({
      source: 'terrain-dem',
      exaggeration: nextExagg
    });
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-neutral-950 select-none">
      {/* 3D MapLibre Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top 3D Camera Presets Bar */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-10 pointer-events-none">
        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/90 backdrop-blur-xl p-1.5 rounded-2xl border border-neutral-200 shadow-lg pointer-events-auto">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-2 flex items-center gap-1">
            <Mountain className="h-3 w-3 text-neutral-900" />
            3D Topo Presets:
          </span>
          {CAMERA_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                activePreset === preset.id
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
              title={preset.description}
            >
              <span>{preset.icon}</span>
              <span>{preset.name}</span>
            </button>
          ))}
        </div>

        {/* 3D Camera Telemetry & Elevation Multiplier */}
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xl px-3 py-1.5 rounded-2xl border border-neutral-200 shadow-lg pointer-events-auto text-xs">
          <div className="flex items-center gap-2 text-neutral-700 font-mono text-[11px]">
            <span>
              Pitch: <strong className="text-neutral-900">{currentPitch}&deg;</strong>
            </span>
            <span className="text-neutral-300">|</span>
            <span>
              Bearing: <strong className="text-neutral-900">{currentBearing}&deg;</strong>
            </span>
          </div>

          <button
            onClick={handleToggleExaggeration}
            className="px-2 py-0.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-mono text-[10px] font-semibold transition-colors border border-neutral-200"
            title="Toggle DEM vertical height exaggeration (1.2x vs 2.2x)"
          >
            Height: {exaggeration}x
          </button>
        </div>
      </div>

      {/* Floating 3D Navigation & Pitch Controls */}
      <div className="absolute right-4 top-16 flex flex-col gap-2 z-10">
        {/* Reset North / Bearing */}
        <button
          onClick={handleResetNorth}
          className="h-9 w-9 bg-white/95 backdrop-blur-xl border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-700 hover:text-neutral-900 shadow-lg transition-transform active:scale-95"
          title="Reset camera heading to North (0°)"
        >
          <Compass className="h-4 w-4" style={{ transform: `rotate(${-currentBearing}deg)` }} />
        </button>

        {/* Increase Pitch (Tilt Up) */}
        <button
          onClick={() => handlePitchChange(10)}
          className="h-9 w-9 bg-white/95 backdrop-blur-xl border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-700 hover:text-neutral-900 shadow-lg transition-transform active:scale-95 font-bold text-xs"
          title="Tilt camera down (higher angle)"
        >
          +Tilt
        </button>

        {/* Decrease Pitch (Tilt Flat) */}
        <button
          onClick={() => handlePitchChange(-10)}
          className="h-9 w-9 bg-white/95 backdrop-blur-xl border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-700 hover:text-neutral-900 shadow-lg transition-transform active:scale-95 font-bold text-xs"
          title="Flatten camera angle"
        >
          -Tilt
        </button>
      </div>

      {/* 3D Topographic Elevation & Bust Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xl border border-neutral-200 p-3.5 rounded-2xl text-xs z-10 shadow-xl max-w-sm">
        <div className="text-[11px] text-neutral-500 font-medium mb-2 flex items-center justify-between border-b border-neutral-200 pb-1.5">
          <span className="flex items-center gap-1.5 text-neutral-900 font-semibold">
            <Mountain className="h-3.5 w-3.5 text-neutral-900" />
            3D DEM Topography & Orographic Radar
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
            AWS Open Data DEM
          </span>
        </div>

        {/* Orographic Elevation Gradient Scale */}
        <div className="mb-3">
          <div className="flex justify-between text-[10px] text-neutral-600 font-mono mb-1">
            <span>Sea Level (0m)</span>
            <span>Ghats (1500m)</span>
            <span>Himalayas (6000m+)</span>
          </div>
          <div className="h-2 rounded-full w-full bg-gradient-to-r from-emerald-600 via-amber-500 to-rose-700 opacity-90 shadow-inner" />
        </div>

        {/* Risk Classification Key */}
        <div className="space-y-1.5 pt-1 border-t border-neutral-100">
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-rose-500 border border-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse" />
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

        {/* IMD Weather Glyphs Key */}
        {showWeatherLayer && (
          <div className="mt-2 pt-2 border-t border-neutral-200">
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold mb-1 flex items-center justify-between">
              <span>IMD Weather Glyphs</span>
              <span className="text-[9px] text-sky-600 font-mono">Layer ON</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <div className="flex items-center gap-1 text-neutral-700">
                <span>☀️</span> <span>Heat Wave</span>
              </div>
              <div className="flex items-center gap-1 text-neutral-700">
                <span>⛅</span> <span>Mod. Heat</span>
              </div>
              <div className="flex items-center gap-1 text-neutral-700">
                <span>🌧️</span> <span>Mod. Rain</span>
              </div>
              <div className="flex items-center gap-1 text-neutral-700">
                <span>⛈️</span> <span>Heavy Storm</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-2.5 pt-2 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-500">
          <span>Tip: Right-click + drag to rotate 3D camera</span>
          <span className="font-mono text-neutral-700 font-medium">Zero Disk Space</span>
        </div>
      </div>
    </div>
  );
};

export default DemTerrainMap3D;
