import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Marker, Tooltip, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import useParcelLayers from '../hooks/useParcelLayers';
import useTranslation from '../../../hooks/useTranslation';
import LayerToggle from './LayerToggle';
import PilotContextFilter from './PilotContextFilter';
import { getPolygonBounds, getPolygonVertices, getPolygonCentroid } from '../../../utils/geojsonHelpers';
import { Loader2, Layers, MapPin, Zap, Droplets, ShieldCheck, Globe, Eye, Landmark, Compass, X, Info } from 'lucide-react';
import useAuth from '../../auth/hooks/useAuth';

// Fix default Leaflet icon assets
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Basemap Providers
const BASEMAP_PROVIDERS = {
  googleHybrid: {
    id: 'googleHybrid',
    nameKey: 'google_hybrid',
    defaultName: 'Google Hybrid',
    icon: '🛰️',
    url: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps &mdash; Satellite & Road Label Hybrid',
    maxZoom: 20,
    description: 'High-res Google satellite imagery overlaid with road networks, village names & administrative borders',
  },
  canvas: {
    id: 'canvas',
    nameKey: 'cadastral_canvas',
    defaultName: 'Cadastral Canvas',
    icon: '🗺️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16,
    description: 'High-contrast neutral canvas ideal for revenue survey boundaries & zoning',
  },
  osm: {
    id: 'osm',
    nameKey: 'street_map',
    defaultName: 'Street Map',
    icon: '📍',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    description: 'Standard OpenStreetMap road network and administrative topology',
  },
};

// Distinct Regional State Hub Clusters for Nationwide Overview (prevents label stacking)
const STATE_CLUSTERS = [
  {
    id: 'chandigarh',
    state: 'Chandigarh (UT)',
    region: 'Sector 17 Urban Commercial Hub',
    count: 1,
    badge: 'DoLR Pilot',
    icon: '✋',
    color: '#D97706',
    lat: 30.7405,
    lng: 76.7834,
    ulpin: '04010010017011',
    zoom: 16,
  },
  {
    id: 'up',
    state: 'Uttar Pradesh',
    region: 'Lucknow • Mohanlalganj',
    count: 2,
    badge: 'Khatauni / Khasra',
    icon: '🌾',
    color: '#2563EB',
    lat: 26.6773,
    lng: 80.9849,
    ulpin: '09030020114003',
    zoom: 15,
  },
  {
    id: 'mh-mumbai',
    state: 'Maharashtra',
    region: 'Mumbai • Bandra East (BKC)',
    count: 2,
    badge: 'Urban Land Card',
    icon: '🏢',
    color: '#7C3AED',
    lat: 19.0620,
    lng: 72.8566,
    ulpin: '27200040019007',
    zoom: 15,
  },
  {
    id: 'mh-pune',
    state: 'Maharashtra',
    region: 'Pune • Wagholi / Haveli',
    count: 2,
    badge: '7/12 & 8A',
    icon: '⚙️',
    color: '#0B2545',
    lat: 18.5782,
    lng: 73.9809,
    ulpin: '27250010045001',
    zoom: 15,
  },
  {
    id: 'telangana',
    state: 'Telangana',
    region: 'Hyderabad • Gachibowli IT',
    count: 1,
    badge: 'TSLR Card',
    icon: '💻',
    color: '#0284C7',
    lat: 17.4405,
    lng: 78.3496,
    ulpin: '36020010077010',
    zoom: 15,
  },
  {
    id: 'karnataka',
    state: 'Karnataka',
    region: 'Bengaluru • South Lake Buffer',
    count: 1,
    badge: 'RTC Pahani',
    icon: '🌿',
    color: '#0D9488',
    lat: 12.9235,
    lng: 77.6436,
    ulpin: '29040030018009',
    zoom: 15,
  },
  {
    id: 'tamilnadu',
    state: 'Tamil Nadu',
    region: 'Kanchipuram • Sriperumbudur',
    count: 2,
    badge: 'DoLR Pilot',
    icon: '🏛️',
    color: '#059669',
    lat: 12.9672,
    lng: 79.9450,
    ulpin: '33010050082005',
    zoom: 15,
  },
];

// Regional state cluster badge icon generator
const createRegionalClusterIcon = (cluster) => {
  return L.divIcon({
    className: `regional-cluster-marker cluster-${cluster.id}`,
    html: `
      <div style="display: flex; align-items: center; gap: 6px; background: rgba(11, 37, 69, 0.94); backdrop-filter: blur(8px); color: white; padding: 4px 10px; border-radius: 20px; border: 1.5px solid ${cluster.color}; box-shadow: 0 4px 14px rgba(0,0,0,0.38); cursor: pointer; white-space: nowrap; transform: translate(-50%, -50%); transition: all 0.2s ease;">
        <span style="font-size: 14px; line-height: 1;">${cluster.icon}</span>
        <div style="display: flex; flex-direction: column; align-items: flex-start; line-height: 1.15;">
          <span style="font-weight: 800; font-size: 11px; color: #F8FAFC; letter-spacing: 0.2px;">${cluster.state}</span>
          <span style="font-size: 9px; color: #94A3B8; font-weight: 500;">${cluster.region.split('•')[0].trim()} &bull; ${cluster.count} ${cluster.count === 1 ? 'Plot' : 'Plots'}</span>
        </div>
        ${cluster.badge.includes('Pilot') ? `<span style="font-size: 8px; font-weight: 800; background: ${cluster.color}; color: white; padding: 1px 5px; border-radius: 10px; margin-left: 2px;">PILOT</span>` : ''}
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

// Pilot unique icon generators using L.divIcon
const createPilotBeaconIcon = (type, title, stateLabel, badgeIcon, colorClass, gradientBg) => {
  return L.divIcon({
    className: `pilot-marker-wrapper pilot-marker-${type}`,
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 60px; height: 60px; pointer-events: auto; cursor: pointer;">
        <div class="beacon-wave" style="position: absolute; width: 48px; height: 48px; border-radius: 50%; background: ${colorClass};"></div>
        <div style="position: relative; z-index: 10; width: 34px; height: 34px; background: ${gradientBg}; border: 2.5px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.35);">
          <span style="font-size: 16px; line-height: 1;">${badgeIcon}</span>
        </div>
        <div style="position: absolute; bottom: -6px; z-index: 12; white-space: nowrap; background: #0B2545; color: #F8FAFC; font-size: 9px; font-weight: 800; padding: 1px 7px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.4); box-shadow: 0 2px 6px rgba(0,0,0,0.35); text-transform: uppercase; letter-spacing: 0.5px;">
          ${stateLabel}
        </div>
      </div>
    `,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
  });
};

// Map Controller for handling programmatic viewport transitions (flyTo)
const MapController = ({ flyToTarget, selectedFeature }) => {
  const map = useMap();

  useEffect(() => {
    if (flyToTarget) {
      if (flyToTarget.bounds) {
        map.flyToBounds(flyToTarget.bounds, { padding: [40, 40], maxZoom: 17, duration: 1.2 });
      } else if (flyToTarget.lat && flyToTarget.lng) {
        map.flyTo([flyToTarget.lat, flyToTarget.lng], flyToTarget.zoom || 16, { duration: 1.2 });
      }
    }
  }, [flyToTarget, map]);

  useEffect(() => {
    if (selectedFeature?.geometry?.coordinates) {
      const bounds = getPolygonBounds(selectedFeature.geometry.coordinates);
      if (bounds) {
        map.flyToBounds(bounds, { padding: [60, 60], maxZoom: 17, duration: 1.0 });
      }
    }
  }, [selectedFeature, map]);

  return null;
};

// Zoom Tracker component to update level of detail (LOD)
const ZoomWatcher = ({ onZoomChange }) => {
  const map = useMap();
  useEffect(() => {
    const handleZoom = () => {
      onZoomChange(map.getZoom());
    };
    map.on('zoomend', handleZoom);
    // Trigger initially
    onZoomChange(map.getZoom());
    return () => {
      map.off('zoomend', handleZoom);
    };
  }, [map, onZoomChange]);
  return null;
};

export const ParcelMap = () => {
  const {
    parcelsGeoJson,
    rawParcelsGeoJson,
    utilitiesGeoJson,
    loading,
    error,
    gisTier,
    activeSubLayer,
    showUtilitiesOverlay,
    selectedUlpin,
    setSelectedUlpin,
    hoveredUlpin,
    setHoveredUlpin,
    flyToTarget,
    setFlyToTarget,
    parcelStyleCallback,
    utilityStyleCallback,
  } = useParcelLayers();

  const { t } = useTranslation();
  const { user } = useAuth();

  const [activeBasemap, setActiveBasemap] = useState('googleHybrid');
  const [currentZoom, setCurrentZoom] = useState(5);
  const [indiaStatesGeoJson, setIndiaStatesGeoJson] = useState(null);
  const [isLegendCut, setIsLegendCut] = useState(false);
  const geoJsonRef = useRef(null);

  // Load Indian State Boundaries for nationwide administrative map overview
  useEffect(() => {
    let isMounted = true;
    fetch('/mock-data/india_states.geojson')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setIndiaStatesGeoJson(data);
      })
      .catch((err) => console.warn('Could not load India state boundaries:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  // Determine if map is at cadastral plot detail zoom level
  const isCadastralZoom = currentZoom >= 11;

  // Re-style GeoJSON layer whenever tier, subLayer or selectedUlpin changes
  useEffect(() => {
    if (geoJsonRef.current) {
      geoJsonRef.current.setStyle(parcelStyleCallback);
    }
  }, [gisTier, activeSubLayer, selectedUlpin, hoveredUlpin, parcelStyleCallback]);

  // Initial center set to Pan-India national geographic overview
  const defaultCenter = [22.5000, 79.2000];
  const defaultZoom = 5;

  // Automatic Parcel Zoom for Logged-In Citizen:
  // Flow: Login -> Load User -> Load User's Parcel -> Open India Map -> Find Geometry -> Automatically Fit Bounds -> Highlight Parcel
  useEffect(() => {
    if (user && (user.role === 'citizen' || !user.role) && !selectedUlpin && parcelsGeoJson?.features) {
      const myPlot = parcelsGeoJson.features.find(
        (f) => String(f.properties?.ownerId) === String(user.id)
      );
      if (myPlot) {
        setSelectedUlpin(myPlot.properties.ulpin);
        if (myPlot.geometry?.coordinates) {
          const bounds = getPolygonBounds(myPlot.geometry.coordinates);
          if (bounds) {
            setFlyToTarget({ bounds });
          }
        }
      }
    }
  }, [user, selectedUlpin, parcelsGeoJson, setSelectedUlpin, setFlyToTarget]);

  // Selected feature and its boundary corner vertices (demarcation survey stones)
  const selectedFeature = useMemo(() => {
    return parcelsGeoJson?.features?.find(
      (f) => String(f.properties?.ulpin) === String(selectedUlpin)
    );
  }, [parcelsGeoJson, selectedUlpin]);

  const selectedVertices = useMemo(() => {
    if (!selectedFeature?.geometry?.coordinates) return [];
    return getPolygonVertices(selectedFeature.geometry.coordinates);
  }, [selectedFeature]);

  // Pilot parcel centroids for unique symbol beacons
  const pilotFeatures = useMemo(() => {
    const list = [];
    const allFeatures = rawParcelsGeoJson?.features || parcelsGeoJson?.features || [];
    
    // Chandigarh UT Pilot (04010010017011)
    const chd = allFeatures.find((f) => String(f.properties?.ulpin) === '04010010017011');
    if (chd?.geometry?.coordinates) {
      list.push({
        type: 'chandigarh',
        ulpin: chd.properties.ulpin,
        title: 'DoLR Pilot: Chandigarh UT (Urban Cadastre)',
        stateLabel: 'Chandigarh UT',
        badgeIcon: '✋', // Open Hand Monument emblem
        colorClass: 'rgba(245, 158, 11, 0.45)',
        gradientBg: 'linear-gradient(135deg, #F59E0B, #D97706)',
        centroid: getPolygonCentroid(chd.geometry.coordinates),
        feature: chd,
      });
    }

    // Tamil Nadu Pilot (33010050082005)
    const tn = allFeatures.find((f) => String(f.properties?.ulpin) === '33010050082005');
    if (tn?.geometry?.coordinates) {
      list.push({
        type: 'tamilnadu',
        ulpin: tn.properties.ulpin,
        title: 'DoLR Pilot: Tamil Nadu (Rural & Urban Cadastre)',
        stateLabel: 'Tamil Nadu',
        badgeIcon: '🏛️', // Temple Gopuram emblem
        colorClass: 'rgba(16, 185, 129, 0.45)',
        gradientBg: 'linear-gradient(135deg, #10B981, #059669)',
        centroid: getPolygonCentroid(tn.geometry.coordinates),
        feature: tn,
      });
    }

    return list;
  }, [rawParcelsGeoJson, parcelsGeoJson]);

  const onEachFeature = useCallback((feature, layer) => {
    const p = feature.properties || {};

    layer.on({
      click: () => {
        setSelectedUlpin(p.ulpin);
      },
      mouseover: (e) => {
        setHoveredUlpin(p.ulpin);
        const target = e.target;
        target.bringToFront();
      },
      mouseout: () => {
        setHoveredUlpin(null);
      },
    });

    const stateBadge = p.state?.includes('Tamil') ? 'TN' :
                      p.state?.includes('Chandigarh') ? 'CHD' :
                      p.state?.includes('Uttar') ? 'UP' :
                      p.state?.includes('Karnataka') ? 'KA' :
                      p.state?.includes('Telangana') ? 'TS' :
                      p.state?.includes('Maharashtra') ? 'MH' : 'IN';

    const isMyPlot = user && String(p.ownerId) === String(user.id);

    // Tooltip binding:
    // Only permanent when zoomed in to cadastral scale (zoom >= 11) to prevent pin stacking on nationwide view!
    const tooltipHtml = isMyPlot
      ? `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none;">
          <div style="display: flex; align-items: center; gap: 3px;">
            <span style="font-size: 8px; font-weight: 800; background: #059669; color: #FFF; padding: 1px 4px; border-radius: 3px; box-shadow: 0 1px 3px rgba(0,0,0,0.25);">★ MY LAND</span>
            <span style="font-weight: 800; font-size: 11px; color: #047857;">${p.survey_no || 'Plot'}</span>
          </div>
          <span style="font-size: 8px; color: #065F46; font-family: monospace; font-weight: 700;">${p.village}</span>
        </div>`
      : `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none;">
          <div style="display: flex; align-items: center; gap: 3px;">
            <span style="font-size: 8px; font-weight: 800; background: #0B2545; color: #FFF; padding: 0 3px; border-radius: 3px;">${stateBadge}</span>
            <span style="font-weight: 800; font-size: 10.5px; color: #0B2545;">${p.survey_no || 'Plot'}</span>
          </div>
          <span style="font-size: 8px; color: #475569; font-family: monospace; font-weight: 600;">${p.village}</span>
        </div>`;

    layer.bindTooltip(tooltipHtml, {
      permanent: isCadastralZoom,
      direction: 'center',
      className: isCadastralZoom ? (isMyPlot ? 'leaflet-my-plot-badge' : 'leaflet-permanent-parcel-badge') : 'cadastral-tooltip',
    });
  }, [isCadastralZoom, setSelectedUlpin, setHoveredUlpin, user]);

  const onEachUtility = (feature, layer) => {
    const p = feature.properties || {};
    layer.bindTooltip(`
      <div style="font-family: inherit; font-size: 11px; padding: 2px 4px;">
        <strong style="color: #0B2545;">${p.utility_type}</strong>
        <div style="color: #475569;">${p.operator || p.restriction || 'Municipal Grid'}</div>
      </div>
    `, { sticky: true, opacity: 0.95 });
  };

  const currentBasemap = BASEMAP_PROVIDERS[activeBasemap] || BASEMAP_PROVIDERS.googleHybrid;

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-gov-amber-light animate-spin" />
          <p className="text-xs font-semibold text-white mt-2">Loading 3-Layer GIS Cadastral Data...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-2 rounded-lg shadow-md">
          {error}
        </div>
      )}

      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 z-20 hidden sm:block">
        <PilotContextFilter />
      </div>

      <div className="absolute top-4 right-4 z-20">
        <LayerToggle />
      </div>

      {/* 1-Click Basemap Switcher & Reset India View */}
      <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-1.5 border border-slate-200 shadow-xl flex items-center gap-1.5 text-xs select-none">
        <button
          onClick={() => {
            setSelectedUlpin(null);
            setFlyToTarget({ lat: 22.5000, lng: 79.2000, zoom: 5 });
          }}
          title="Zoom out to National Overview of India"
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200 mr-1"
        >
          <Compass className="w-3.5 h-3.5 text-gov-navy" />
          <span>{t('india_view')}</span>
        </button>

        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1.5 flex items-center gap-1 border-l border-slate-200">
          <Globe className="w-3.5 h-3.5 text-gov-navy" />
          {t('basemap_label')}:
        </span>
        {Object.values(BASEMAP_PROVIDERS).map((bm) => (
          <button
            key={bm.id}
            onClick={() => setActiveBasemap(bm.id)}
            title={bm.description}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
              activeBasemap === bm.id
                ? 'bg-gov-navy text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{bm.icon}</span>
            <span>{t(bm.nameKey) || bm.defaultName}</span>
          </button>
        ))}
      </div>

      {/* Map Information / 3-Layer Architecture Legend with Cut/Close Option */}
      {isLegendCut ? (
        <button
          onClick={() => setIsLegendCut(false)}
          className="absolute bottom-4 left-4 z-20 bg-white/95 hover:bg-white backdrop-blur-md rounded-2xl px-3 py-2 border border-slate-200 shadow-xl flex items-center gap-1.5 text-xs font-bold text-gov-navy select-none transition-all shadow-slate-900/10"
          title="Open Map Layer Legend"
        >
          <Layers className="w-4 h-4 text-gov-navy" />
          <span>Layer Info</span>
          <span className="text-[10px] bg-gov-navy/10 text-gov-navy px-1.5 py-0.5 rounded-full font-mono uppercase">
            {gisTier}
          </span>
        </button>
      ) : (
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-xl text-xs max-w-sm select-none text-slate-800 dark:text-slate-100">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-100">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-gov-navy dark:text-amber-400" />
              Active: {t(gisTier + '_layer')?.toUpperCase() || gisTier.toUpperCase() + ' LAYER'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">11 Cadastral Parcels</span>
              <button
                onClick={() => setIsLegendCut(true)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Cut / Hide Layer Info"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        <div className="mt-2 space-y-1.5 text-[11px]">
          {gisTier === 'base' && (
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                <strong>Base Cadastral Boundaries:</strong> Precision WGS84 polygon geometry with permanent Survey Number labels and GPS corner demarcation stones.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] text-slate-700 dark:text-slate-300 font-medium">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-[#10B981] border border-[#047857]"></span>My Land</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-[#0B2545]/40 border border-[#134074]"></span>{t('clear_title')}</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-[#F59E0B] border border-[#B45309]"></span>Selected Plot</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs border border-dashed border-rose-600 bg-rose-500/30"></span>{t('disputed')}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 border border-white"></span>Survey Stone (GPS)</span>
              </div>
            </div>
          )}

          {gisTier === 'essential' && (
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                <strong>Essential Governance Data:</strong> Record of Rights (7/12 & Khatauni), Sub-Registrar Deeds, and Master Plan Zoning.
              </p>
              {activeSubLayer === 'zoning' ? (
                <div className="grid grid-cols-2 gap-1.5 text-[11px] mt-2 text-slate-800 dark:text-slate-200 font-medium">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-[#3B82F6] flex-shrink-0"></span><span>Residential (R1/R2)</span></span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-[#EF4444] flex-shrink-0"></span><span>Commercial (C1/C2)</span></span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-[#16A34A] flex-shrink-0"></span><span>Agricultural Crop</span></span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-[#9333EA] flex-shrink-0"></span><span>Industrial Light</span></span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-1.5 text-[11px] mt-2 text-slate-800 dark:text-slate-200 font-medium">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-[#10B981] flex-shrink-0"></span><span>{t('clear_title')}</span></span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-[#8B5CF6] flex-shrink-0"></span><span>Bank Lien/Mortgage</span></span>
                  <span className="flex items-center gap-1.5 col-span-2"><span className="w-2.5 h-2.5 rounded-xs bg-[#E11D48] border border-dashed border-rose-900 flex-shrink-0"></span><span>Civil Court Injunction (Dashed)</span></span>
                </div>
              )}
            </div>
          )}

          {gisTier === 'usecase' && (
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                <strong>Use-Case Utilities & Property Tax:</strong> Water supply trunks, 11kV electrical feeders, tax recovery & NGT buffers.
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] mt-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-[#0284C7] rounded-full flex-shrink-0"></span><span>Water DI Trunk 600mm</span></span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-[#EAB308] rounded-full flex-shrink-0"></span><span>11kV Power Feeder</span></span>
                <span className="flex items-center gap-1.5 col-span-2"><span className="w-3 h-1 bg-[#14B8A6] border-b border-dashed border-teal-800 flex-shrink-0"></span><span>NGT 75m Lake Eco-Buffer</span></span>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Main Leaflet Map */}
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="w-full h-full"
        zoomControl={false}
      >
        <ZoomWatcher onZoomChange={setCurrentZoom} />

        {/* Dynamic Basemap Tile Layer */}
        <TileLayer
          key={`basemap-${activeBasemap}`}
          attribution={currentBasemap.attribution}
          url={currentBasemap.url}
          subdomains={currentBasemap.subdomains || ['a', 'b', 'c']}
          maxZoom={currentBasemap.maxZoom || 20}
        />

        {/* Indian National State Boundaries Layer */}
        {indiaStatesGeoJson && (
          <GeoJSON
            key="india-states-boundaries-layer"
            data={indiaStatesGeoJson}
            style={() => ({
              color: '#475569',
              weight: 1.2,
              opacity: 0.7,
              fillColor: '#0284C7',
              fillOpacity: 0.03,
              dashArray: '3, 4',
            })}
            onEachFeature={(feature, layer) => {
              const stateName = feature.properties?.ST_NM || 'State of India';
              layer.bindTooltip(
                `<div style="font-weight: 700; font-size: 11px; color: #0B2545;">${stateName}</div>`,
                { direction: 'center', sticky: true, opacity: 0.95 }
              );
              layer.on({
                mouseover: (e) => {
                  e.target.setStyle({ weight: 2.2, color: '#0B2545', fillOpacity: 0.12 });
                },
                mouseout: (e) => {
                  e.target.setStyle({ weight: 1.2, color: '#475569', fillOpacity: 0.03 });
                },
                click: (e) => {
                  const bounds = e.target.getBounds();
                  if (bounds) {
                    setFlyToTarget({ bounds });
                  }
                },
              });
            }}
          />
        )}

        {/* Parcels GeoJSON Layer */}
        {parcelsGeoJson && (
          <GeoJSON
            key={`geojson-parcels-${gisTier}-${activeSubLayer}-${isCadastralZoom ? 'zoom-in' : 'zoom-out'}-${parcelsGeoJson?.features?.length || 0}`}
            ref={geoJsonRef}
            data={parcelsGeoJson}
            style={parcelStyleCallback}
            onEachFeature={onEachFeature}
          />
        )}

        {/* Nationwide Regional Cluster Markers (Displayed when zoomed out to prevent pin stacking) */}
        {!isCadastralZoom &&
          STATE_CLUSTERS.map((cluster) => {
            const icon = createRegionalClusterIcon(cluster);
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                position={[cluster.lat, cluster.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => {
                    setSelectedUlpin(cluster.ulpin);
                    setFlyToTarget({ lat: cluster.lat, lng: cluster.lng, zoom: cluster.zoom });
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -15]}>
                  <div className="text-[11px] font-sans p-1">
                    <div className="font-bold text-gov-navy flex items-center gap-1">
                      <span>{cluster.icon}</span>
                      <span>{cluster.state} — {cluster.region}</span>
                    </div>
                    <div className="text-slate-600 text-[10px] mt-0.5">
                      Record: {cluster.badge} &bull; {cluster.count} {cluster.count === 1 ? 'Cadastral Parcel' : 'Cadastral Parcels'}
                    </div>
                    <div className="text-blue-600 font-bold text-[10px] mt-1">
                      Click to zoom down to Cadastral Boundaries
                    </div>
                  </div>
                </Tooltip>
              </Marker>
            );
          })}

        {/* Survey Demarcation Stones / Boundary Vertices for Selected Parcel (when zoomed in) */}
        {isCadastralZoom &&
          selectedVertices.map((v) => (
            <CircleMarker
              key={`vertex-pin-${v.id}-${v.lat}-${v.lng}`}
              center={[v.lat, v.lng]}
              radius={5.5}
              pathOptions={{
                fillColor: '#F59E0B',
                fillOpacity: 1,
                color: '#FFFFFF',
                weight: 2,
              }}
            >
              <Tooltip permanent={false} direction="top" offset={[0, -6]}>
                <div className="text-[11px] font-mono leading-tight p-0.5">
                  <div className="font-bold text-amber-700">{v.label} (Survey Demarcation Stone)</div>
                  <div className="text-slate-700 font-semibold mt-0.5">Lat: {v.lat.toFixed(6)}° N</div>
                  <div className="text-slate-700 font-semibold">Lng: {v.lng.toFixed(6)}° E</div>
                  <div className="text-[9.5px] text-emerald-600 font-bold mt-1">✓ WGS84 Georeferenced Cadastral Vertex</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

        {/* Unique DoLR Pilot Radar Beacons (when zoomed in) */}
        {isCadastralZoom &&
          pilotFeatures.map((p) => {
            const icon = createPilotBeaconIcon(
              p.type,
              p.title,
              p.stateLabel,
              p.badgeIcon,
              p.colorClass,
              p.gradientBg
            );

            return (
              <Marker
                key={`pilot-beacon-${p.type}`}
                position={p.centroid}
                icon={icon}
                eventHandlers={{
                  click: () => {
                    setSelectedUlpin(p.ulpin);
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -25]}>
                  <div className="text-[11px] font-sans p-1">
                    <div className="font-bold text-gov-navy flex items-center gap-1">
                      <span>{p.badgeIcon}</span>
                      <span>{p.title}</span>
                    </div>
                    <div className="text-slate-600 text-[10px] mt-0.5">
                      Survey: {p.feature.properties?.survey_no} &bull; ULPIN: {p.ulpin}
                    </div>
                    <div className="text-amber-600 font-bold text-[10px] mt-1">
                      Click to view Single-Window Land Passport
                    </div>
                  </div>
                </Tooltip>
              </Marker>
            );
          })}

        {/* Utility Vector Overlay (Visible in Use-Case tier or when enabled) */}
        {showUtilitiesOverlay && utilitiesGeoJson && (
          <GeoJSON
            key={`geojson-utilities`}
            data={utilitiesGeoJson}
            style={utilityStyleCallback}
            onEachFeature={onEachUtility}
          />
        )}

        <MapController
          flyToTarget={flyToTarget}
          selectedFeature={selectedFeature}
        />
      </MapContainer>
    </div>
  );
};

export default ParcelMap;
