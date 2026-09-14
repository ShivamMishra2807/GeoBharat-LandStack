/**
 * GeoJSON and Leaflet spatial utility helpers
 */

/**
 * Compute the simple bounding box centroid of a GeoJSON Polygon
 */
export const getPolygonCentroid = (coordinates) => {
  if (!coordinates || !coordinates.length || !coordinates[0].length) {
    return [21.8000, 79.0000];
  }
  const ring = coordinates[0];
  let sumLat = 0;
  let sumLng = 0;
  const count = ring.length;

  for (let i = 0; i < count; i++) {
    sumLng += ring[i][0];
    sumLat += ring[i][1];
  }

  return [sumLat / count, sumLng / count];
};

/**
 * Get Leaflet bounds object for polygon coordinates
 */
export const getPolygonBounds = (coordinates) => {
  if (!coordinates || !coordinates.length || !coordinates[0].length) return null;
  const ring = coordinates[0];
  let minLat = Infinity, maxLat = -Infinity;
  let minLng = Infinity, maxLng = -Infinity;

  ring.forEach(([lng, lat]) => {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  });

  return [
    [minLat, minLng],
    [maxLat, maxLng]
  ];
};

/**
 * Extract unique boundary corner vertex coordinates [lat, lng] for Survey Stones
 */
export const getPolygonVertices = (coordinates) => {
  if (!coordinates || !coordinates.length || !coordinates[0].length) return [];
  const ring = coordinates[0];
  // Ignore closing vertex which duplicates first vertex
  const uniqueRing = ring.slice(0, ring.length - 1);
  return uniqueRing.map(([lng, lat], idx) => ({
    id: idx + 1,
    lat,
    lng,
    label: `Vertex V${idx + 1}`,
  }));
};

/**
 * Zone-to-Color palette matching standard Master Plan norms
 */
export const ZONE_COLORS = {
  'Residential (R-1)': '#3B82F6', // Blue
  'Residential (R-2)': '#60A5FA', // Light Blue
  'Residential (High Rise R-4)': '#2563EB', // Royal Blue
  'Commercial (C-1)': '#EF4444', // Red
  'Commercial (C-2)': '#DC2626', // Crimson Red
  'Commercial (City Centre C-1)': '#B91C1C', // Deep Red
  'Commercial (Logistics)': '#EA580C', // Orange
  'Commercial (IT/ITES)': '#0284C7', // Sky Blue
  'Agricultural (Prime Crop)': '#16A34A', // Green
  'Industrial (Light Engg)': '#9333EA', // Purple
  'Eco-sensitive (Lake Buffer)': '#0D9488', // Teal
};

/**
 * Resolve parcel polygon styling based on active layer
 */
export const getParcelStyle = (feature, activeLayer = 'cadastral', isSelected = false, isHovered = false, isMyParcel = false) => {
  const props = feature?.properties || {};
  const isDisputed = props.status === 'Disputed' || props.dispute_status?.includes('Court');

  // Default base styling
  let fillColor = '#0B2545';
  let fillOpacity = 0.22;
  let borderColor = '#134074';
  let weight = 1.8;
  let dashArray = undefined;

  switch (activeLayer) {
    case 'zoning': {
      const zone = props.zone_type || '';
      fillColor = ZONE_COLORS[zone] || '#64748B';
      borderColor = fillColor;
      fillOpacity = 0.55;
      break;
    }
    case 'taxation': {
      if (props.tax_status === 'Paid') {
        fillColor = '#10B981'; // Emerald
        borderColor = '#059669';
        fillOpacity = 0.5;
      } else {
        fillColor = '#F43F5E'; // Rose
        borderColor = '#E11D48';
        fillOpacity = 0.55;
      }
      break;
    }
    case 'encumbrance': {
      const enc = props.encumbrance_status || '';
      if (enc.toLowerCase().includes('clear')) {
        fillColor = '#10B981';
        borderColor = '#059669';
        fillOpacity = 0.45;
      } else if (enc.toLowerCase().includes('injunction') || enc.toLowerCase().includes('court') || isDisputed) {
        fillColor = '#E11D48';
        borderColor = '#9F1239';
        fillOpacity = 0.6;
        dashArray = '5, 5';
      } else {
        fillColor = '#8B5CF6'; // Purple for mortgage/lien
        borderColor = '#6D28D9';
        fillOpacity = 0.5;
      }
      break;
    }
    case 'cadastral':
    default: {
      if (isMyParcel) {
        fillColor = '#10B981';
        borderColor = '#047857';
        fillOpacity = 0.32;
        weight = 2.4;
      } else {
        fillColor = '#0B2545';
        borderColor = '#134074';
        fillOpacity = 0.20;
      }
      break;
    }
  }

  // If parcel is disputed in any view, give it distinctive boundary dashes
  if (isDisputed && activeLayer !== 'zoning') {
    borderColor = '#DC2626';
    dashArray = '5, 5';
    weight = 2.5;
  }

  // Highlight if selected
  if (isSelected) {
    fillColor = '#F59E0B'; // Amber accent
    borderColor = '#B45309';
    weight = 3.5;
    fillOpacity = 0.65;
    dashArray = '4, 4';
  } else if (isHovered) {
    weight = 2.8;
    fillOpacity = Math.min(fillOpacity + 0.2, 0.85);
  }

  return {
    fillColor,
    fillOpacity,
    color: borderColor,
    weight,
    dashArray,
  };
};
