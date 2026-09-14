import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../../../store';
import { parcelApi } from '../../../api/parcelApi';
import { getPolygonBounds } from '../../../utils/geojsonHelpers';

export const useParcelSearch = () => {
  const [query, setQuery] = useState('');
  const { parcelsGeoJson, setParcelsGeoJson, setSelectedUlpin, setFlyToTarget } = useAppStore();
  const navigate = useNavigate();

  // Ensure parcels are loaded even before map is mounted
  useEffect(() => {
    if (!parcelsGeoJson) {
      parcelApi.getParcels().then((data) => {
        if (data) setParcelsGeoJson(data);
      }).catch((err) => {
        console.warn('Could not preload parcels in search:', err);
      });
    }
  }, [parcelsGeoJson, setParcelsGeoJson]);

  const results = useMemo(() => {
    if (!query || query.trim().length < 1 || !parcelsGeoJson?.features) {
      return [];
    }

    const q = query.trim().toLowerCase();

    return parcelsGeoJson.features.filter((feature) => {
      const p = feature.properties || {};
      const ulpin = String(p.ulpin || '').toLowerCase();
      const owner = String(p.owner_name || '').toLowerCase();
      const village = String(p.village || '').toLowerCase();
      const surveyNo = String(p.survey_no || '').toLowerCase();
      const district = String(p.district || '').toLowerCase();
      const recordType = String(p.record_type || '').toLowerCase();

      return (
        ulpin.includes(q) ||
        owner.includes(q) ||
        village.includes(q) ||
        surveyNo.includes(q) ||
        district.includes(q) ||
        recordType.includes(q)
      );
    });
  }, [query, parcelsGeoJson]);

  const selectResult = (feature) => {
    const ulpin = feature.properties?.ulpin;
    setSelectedUlpin(ulpin);

    // Calculate bounding box and set flyToTarget
    if (feature.geometry?.coordinates) {
      const bounds = getPolygonBounds(feature.geometry.coordinates);
      if (bounds) {
        setFlyToTarget({ bounds });
      }
    }

    setQuery(''); // Reset search input on selection
    // Navigate immediately to map to view the parcel and detail drawer
    navigate('/map');
  };

  return {
    query,
    setQuery,
    results,
    selectResult,
  };
};

export default useParcelSearch;
