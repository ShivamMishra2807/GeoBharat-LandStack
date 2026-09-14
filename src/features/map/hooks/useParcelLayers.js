import { useEffect, useState, useCallback, useMemo } from 'react';
import useAppStore from '../../../store';
import { parcelApi } from '../../../api/parcelApi';
import axiosClient from '../../../api/axiosClient';
import { getParcelStyle } from '../../../utils/geojsonHelpers';

export const useParcelLayers = () => {
  const {
    parcelsGeoJson,
    setParcelsGeoJson,
    utilitiesGeoJson,
    setUtilitiesGeoJson,
    selectedUlpin,
    setSelectedUlpin,
    gisTier,
    setGisTier,
    activeSubLayer,
    setActiveSubLayer,
    showUtilitiesOverlay,
    toggleUtilitiesOverlay,
    pilotFilter,
    setPilotFilter,
    cadastreContext,
    setCadastreContext,
    hoveredUlpin,
    setHoveredUlpin,
    flyToTarget,
    setFlyToTarget,
    user,
  } = useAppStore();

  const [loading, setLoading] = useState(!parcelsGeoJson);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchSpatialData = async () => {
      try {
        setLoading(true);
        const [pData, uData] = await Promise.all([
          parcelApi.getParcels(),
          axiosClient.get('/utilities').catch(() => null),
        ]);
        if (isMounted) {
          setParcelsGeoJson(pData);
          if (uData) setUtilitiesGeoJson(uData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load GIS spatial layers:', err);
          setError('Unable to load cadastral map layer.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (!parcelsGeoJson) {
      fetchSpatialData();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [parcelsGeoJson, setParcelsGeoJson, setUtilitiesGeoJson]);

  // Dynamically filter features based on DoLR Pilot and Rural/Urban context
  const filteredParcelsGeoJson = useMemo(() => {
    if (!parcelsGeoJson?.features) return parcelsGeoJson;
    const features = parcelsGeoJson.features.filter((f) => {
      const p = f.properties || {};
      if (pilotFilter === 'chandigarh' && !p.pilot_location?.includes('Chandigarh')) return false;
      if (pilotFilter === 'tamilnadu' && !p.pilot_location?.includes('Tamil Nadu')) return false;
      if (cadastreContext === 'rural' && p.context_type?.toLowerCase() !== 'rural') return false;
      if (cadastreContext === 'urban' && p.context_type?.toLowerCase() !== 'urban') return false;
      return true;
    });
    return { ...parcelsGeoJson, features };
  }, [parcelsGeoJson, pilotFilter, cadastreContext]);

  // Parcel styling callback based on 3-tier architecture
  const parcelStyleCallback = useCallback(
    (feature) => {
      const p = feature?.properties || {};
      const ulpin = p.ulpin;
      const isSelected = String(ulpin) === String(selectedUlpin);
      const isHovered = String(ulpin) === String(hoveredUlpin);
      const isMyParcel = user && String(p.ownerId) === String(user.id);

      let effectiveLayer = 'cadastral';
      if (gisTier === 'base') {
        effectiveLayer = 'cadastral';
      } else if (gisTier === 'essential') {
        effectiveLayer = activeSubLayer === 'encumbrance' ? 'encumbrance' : 'zoning';
      } else if (gisTier === 'usecase') {
        effectiveLayer = 'taxation';
      }

      return getParcelStyle(feature, effectiveLayer, isSelected, isHovered, isMyParcel);
    },
    [gisTier, activeSubLayer, selectedUlpin, hoveredUlpin, user]
  );

  // Utility line string styling callback
  const utilityStyleCallback = useCallback((feature) => {
    const type = feature?.properties?.utility_type || '';
    const color = feature?.properties?.color || '#0284C7';
    const isEco = type.includes('Ecological') || type.includes('Buffer');

    return {
      color,
      weight: isEco ? 4 : 3,
      dashArray: isEco ? '6, 6' : undefined,
      opacity: 0.9,
    };
  }, []);

  return {
    parcelsGeoJson: filteredParcelsGeoJson,
    rawParcelsGeoJson: parcelsGeoJson,
    utilitiesGeoJson,
    loading,
    error,
    gisTier,
    setGisTier,
    activeSubLayer,
    setActiveSubLayer,
    showUtilitiesOverlay,
    toggleUtilitiesOverlay,
    pilotFilter,
    setPilotFilter,
    cadastreContext,
    setCadastreContext,
    selectedUlpin,
    setSelectedUlpin,
    hoveredUlpin,
    setHoveredUlpin,
    flyToTarget,
    setFlyToTarget,
    parcelStyleCallback,
    utilityStyleCallback,
  };
};

export default useParcelLayers;
