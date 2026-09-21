import { contours } from 'd3-contour';
import { Subdivision } from '../types';

export interface ContourTier {
  threshold: number;
  label: string;
  name: string;
  borderColor: string;
  fillColor: string;
  fillOpacity: number;
  isHatched: boolean;
}

export const SPC_TIERS: ContourTier[] = [
  {
    threshold: 10,
    label: '10%',
    name: 'Marginal Risk (10%)',
    borderColor: '#15803d',
    fillColor: '#22c55e',
    fillOpacity: 0.35,
    isHatched: false
  },
  {
    threshold: 25,
    label: '25%',
    name: 'Slight Risk (25%)',
    borderColor: '#78350f',
    fillColor: '#b45309',
    fillOpacity: 0.42,
    isHatched: false
  },
  {
    threshold: 45,
    label: '45%',
    name: 'Enhanced Risk (45%)',
    borderColor: '#ca8a04',
    fillColor: '#eab308',
    fillOpacity: 0.50,
    isHatched: false
  },
  {
    threshold: 60,
    label: '60%',
    name: 'Moderate Risk (60%)',
    borderColor: '#dc2626',
    fillColor: '#ef4444',
    fillOpacity: 0.58,
    isHatched: false
  },
  {
    threshold: 75,
    label: '75%',
    name: 'Significant Risk (75%+ Hatched)',
    borderColor: '#9333ea',
    fillColor: '#d946ef',
    fillOpacity: 0.65,
    isHatched: true
  }
];

export interface GeoJsonContourFeature {
  type: 'Feature';
  properties: {
    threshold: number;
    label: string;
    tierName: string;
    borderColor: string;
    fillColor: string;
    fillOpacity: number;
    isHatched: boolean;
    centerLat: number;
    centerLon: number;
  };
  geometry: {
    type: 'MultiPolygon';
    coordinates: number[][][][];
  };
}

export interface GeoJsonContourCollection {
  type: 'FeatureCollection';
  features: GeoJsonContourFeature[];
}

/**
 * Computes spatial probability contours using Inverse Distance Weighting (IDW)
 * and d3-contour marching squares, mimicking NOAA SPC Convective Outlook isopleths.
 */
export function generateSynopticContours(
  subdivisions: Subdivision[],
  gridWidth: number = 75,
  gridHeight: number = 80
): GeoJsonContourCollection {
  if (!subdivisions || subdivisions.length === 0) {
    return { type: 'FeatureCollection', features: [] };
  }

  // Geographic bounds of the Indian subcontinent
  const minLon = 67.5;
  const maxLon = 97.5;
  const minLat = 7.0;
  const maxLat = 37.0;

  const lonStep = (maxLon - minLon) / (gridWidth - 1);
  const latStep = (maxLat - minLat) / (gridHeight - 1);

  // 1. Generate 2D IDW Grid
  // d3-contour expects a 1D array of length gridWidth * gridHeight, indexed by y * gridWidth + x
  const gridValues: number[] = new Array<number>(gridWidth * gridHeight).fill(0);

  // Find max bust probability in current state
  const maxBust = Math.max(...subdivisions.map((s) => s.bust_probability || 0));

  for (let y = 0; y < gridHeight; y++) {
    const lat = minLat + y * latStep;
    for (let x = 0; x < gridWidth; x++) {
      const lon = minLon + x * lonStep;

      let weightedSum = 0;
      let totalWeight = 0;
      let minDistance = 999;

      for (const sub of subdivisions) {
        // Approximate Euclidean distance in degrees
        const dLat = lat - sub.lat;
        const dLon = lon - sub.lon;
        const dist = Math.sqrt(dLat * dLat + dLon * dLon);

        if (dist < minDistance) {
          minDistance = dist;
        }

        // Distance weight with Gaussian-like power falloff
        const weight = 1 / (Math.pow(dist, 2.6) + 0.35);
        const bustVal = sub.bust_probability || 0;

        weightedSum += bustVal * weight;
        totalWeight += weight;
      }

      let interpVal = totalWeight > 0 ? weightedSum / totalWeight : 0;

      // Apply maritime / land border decay if far from any subdivision centroid
      // Beyond ~4.5 degrees, smoothly attenuate to 0 so contours stay clustered over land
      if (minDistance > 2.8) {
        const decay = Math.max(0, 1 - (minDistance - 2.8) / 2.2);
        interpVal *= decay;
      }

      gridValues[y * gridWidth + x] = interpVal;
    }
  }

  // 2. Compute isopleth contours via d3-contour
  // Select active thresholds based on max bust value
  const thresholds = SPC_TIERS.map((t) => t.threshold).filter(
    (thresh) => thresh <= maxBust + 5
  );

  if (thresholds.length === 0) {
    thresholds.push(10);
  }

  const contourGenerator = contours()
    .size([gridWidth, gridHeight])
    .thresholds(thresholds);

  const rawContours = contourGenerator(gridValues);

  // 3. Transform grid coordinates to GeoJSON MultiPolygon in WGS84 [lon, lat]
  const features: GeoJsonContourFeature[] = [];

  for (const rawContour of rawContours) {
    const thresholdVal = rawContour.value;
    const tier = SPC_TIERS.find((t) => t.threshold === thresholdVal) || SPC_TIERS[0];

    // Transform all coordinates
    let sumLon = 0;
    let sumLat = 0;
    let pointCount = 0;

    const transformedCoords: number[][][][] = rawContour.coordinates.map((polygon) => {
      return polygon.map((ring) => {
        return ring.map(([gx, gy]) => {
          const lon = minLon + gx * lonStep;
          const lat = minLat + gy * latStep;
          sumLon += lon;
          sumLat += lat;
          pointCount++;
          return [Number(lon.toFixed(4)), Number(lat.toFixed(4))];
        });
      });
    });

    if (pointCount === 0 || transformedCoords.length === 0) continue;

    const centerLon = Number((sumLon / pointCount).toFixed(4));
    const centerLat = Number((sumLat / pointCount).toFixed(4));

    features.push({
      type: 'Feature',
      properties: {
        threshold: thresholdVal,
        label: `${thresholdVal}%`,
        tierName: tier.name,
        borderColor: tier.borderColor,
        fillColor: tier.fillColor,
        fillOpacity: tier.fillOpacity,
        isHatched: tier.isHatched,
        centerLat,
        centerLon
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: transformedCoords
      }
    });
  }

  // Sort largest to smallest so smaller inner contours render on top
  features.sort((a, b) => a.properties.threshold - b.properties.threshold);

  return {
    type: 'FeatureCollection',
    features
  };
}
