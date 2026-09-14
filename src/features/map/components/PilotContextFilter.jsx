import React, { useState, useMemo } from 'react';
import useAppStore from '../../../store';
import useTranslation from '../../../hooks/useTranslation';
import { Landmark, Compass, MapPin, Building, Trees, Globe, Check, ChevronRight, Layers } from 'lucide-react';
import { getPolygonBounds } from '../../../utils/geojsonHelpers';

// Region configuration for Pan-India Cadastral Drill-down
const REGIONS = [
  {
    id: 'Maharashtra',
    name: 'Maharashtra',
    center: [18.9000, 74.5000],
    zoom: 7,
    districts: [
      {
        id: 'Pune',
        name: 'Pune (Haveli / Wagholi)',
        center: [18.5782, 73.9809],
        zoom: 15,
        parcels: [
          { ulpin: '27250010045001', label: 'Survey 45/1A (Patil)', sub: 'Wagholi, Pune' },
          { ulpin: '27250010045002', label: 'Survey 45/1B (Gaikwad)', sub: 'Wagholi, Pune' },
        ],
      },
      {
        id: 'Mumbai',
        name: 'Mumbai (Bandra BKC)',
        center: [19.0620, 72.8566],
        zoom: 15,
        parcels: [
          { ulpin: '27200040019007', label: 'CTS 1904/A Ward 7', sub: 'Bandra East, Mumbai' },
          { ulpin: '27200040019008', label: 'CTS 1905 Ward 7', sub: 'Bandra East, Mumbai' },
        ],
      },
    ],
  },
  {
    id: 'Uttar Pradesh',
    name: 'Uttar Pradesh',
    center: [26.8467, 80.9462],
    zoom: 8,
    districts: [
      {
        id: 'Lucknow',
        name: 'Lucknow (Mohanlalganj)',
        center: [26.6773, 80.9849],
        zoom: 15,
        parcels: [
          { ulpin: '09030020114003', label: 'Khasra 114/2 (Yadav)', sub: 'Mohanlalganj, Lucknow' },
          { ulpin: '09030020114004', label: 'Khasra 115 (Sharma)', sub: 'Mohanlalganj, Lucknow' },
        ],
      },
    ],
  },
  {
    id: 'Tamil Nadu',
    name: 'Tamil Nadu',
    center: [12.9672, 79.9450],
    zoom: 9,
    districts: [
      {
        id: 'Kanchipuram',
        name: 'Kanchipuram (Sriperumbudur)',
        center: [12.9672, 79.9450],
        zoom: 15,
        parcels: [
          { ulpin: '33010050082005', label: 'Patta 428 / S.No 82/3', sub: 'Sriperumbudur' },
          { ulpin: '33010050082006', label: 'Patta 512 / S.No 83/1', sub: 'Sriperumbudur' },
        ],
      },
    ],
  },
  {
    id: 'Karnataka',
    name: 'Karnataka',
    center: [12.9235, 77.6436],
    zoom: 9,
    districts: [
      {
        id: 'Bengaluru Urban',
        name: 'Bengaluru Urban (South Lake)',
        center: [12.9235, 77.6436],
        zoom: 15,
        parcels: [
          { ulpin: '29040030018009', label: 'Sy. No. 18/2 (RTC Pahani)', sub: 'Bellandur / South' },
        ],
      },
    ],
  },
  {
    id: 'Telangana',
    name: 'Telangana',
    center: [17.4405, 78.3496],
    zoom: 9,
    districts: [
      {
        id: 'Ranga Reddy',
        name: 'Ranga Reddy (Gachibowli)',
        center: [17.4405, 78.3496],
        zoom: 15,
        parcels: [
          { ulpin: '36020010077010', label: 'Plot 77 / TSLR Block D', sub: 'Gachibowli, Hyderabad' },
        ],
      },
    ],
  },
  {
    id: 'Chandigarh',
    name: 'Chandigarh UT',
    center: [30.7405, 76.7834],
    zoom: 14,
    districts: [
      {
        id: 'Chandigarh',
        name: 'Chandigarh (Sector 17)',
        center: [30.7405, 76.7834],
        zoom: 16,
        parcels: [
          { ulpin: '04010010017011', label: 'Plot 17-C / Sector 17-D', sub: 'Sector 17, Chandigarh' },
        ],
      },
    ],
  },
];

export const PilotContextFilter = () => {
  const {
    parcelsGeoJson,
    selectedUlpin,
    setSelectedUlpin,
    setFlyToTarget,
    cadastreContext,
    setCadastreContext,
  } = useAppStore();

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // Current districts for selected state
  const currentDistricts = useMemo(() => {
    if (!selectedState) return [];
    const st = REGIONS.find((r) => r.id === selectedState);
    return st?.districts || [];
  }, [selectedState]);

  // Current parcels for selected district
  const currentParcels = useMemo(() => {
    if (!selectedDistrict) {
      // Return all parcels for the selected state
      return currentDistricts.flatMap((d) => d.parcels);
    }
    const dist = currentDistricts.find((d) => d.id === selectedDistrict);
    return dist?.parcels || [];
  }, [selectedDistrict, currentDistricts]);

  // Handle State selection
  const handleStateChange = (stateId) => {
    setSelectedState(stateId);
    setSelectedDistrict('');
    if (!stateId) {
      setSelectedUlpin(null);
      setFlyToTarget({ lat: 22.5000, lng: 79.2000, zoom: 5 });
      return;
    }

    const reg = REGIONS.find((r) => r.id === stateId);
    if (reg) {
      setFlyToTarget({ lat: reg.center[0], lng: reg.center[1], zoom: reg.zoom });
    }
  };

  // Handle District selection
  const handleDistrictChange = (districtId) => {
    setSelectedDistrict(districtId);
    if (!districtId) {
      if (selectedState) handleStateChange(selectedState);
      return;
    }

    const dist = currentDistricts.find((d) => d.id === districtId);
    if (dist) {
      setFlyToTarget({ lat: dist.center[0], lng: dist.center[1], zoom: dist.zoom });
    }
  };

  // Handle Parcel selection
  const handleParcelChange = (ulpin) => {
    if (!ulpin) return;
    setSelectedUlpin(ulpin);

    // Zoom directly to parcel
    if (parcelsGeoJson?.features) {
      const match = parcelsGeoJson.features.find((f) => String(f.properties?.ulpin) === String(ulpin));
      if (match?.geometry?.coordinates) {
        const bounds = getPolygonBounds(match.geometry.coordinates);
        if (bounds) setFlyToTarget({ bounds });
      }
    }
  };

  const handleResetToIndia = () => {
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedUlpin(null);
    setFlyToTarget({ lat: 22.5000, lng: 79.2000, zoom: 5 });
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 border border-slate-200/90 shadow-xl text-xs flex flex-wrap items-center gap-2.5 select-none max-w-2xl">
      {/* 1. All India Reset Pill */}
      <button
        type="button"
        onClick={handleResetToIndia}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold transition-all ${
          !selectedState
            ? 'bg-gov-navy text-white shadow-xs'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
        title="Reset zoom to All-India Geographic Overview"
      >
        <span className="text-sm">🇮🇳</span>
        <span>India</span>
      </button>

      <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />

      {/* 2. State Dropdown */}
      <div className="flex items-center gap-1">
        <select
          value={selectedState}
          onChange={(e) => handleStateChange(e.target.value)}
          className="bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-gov-navy cursor-pointer transition-all"
        >
          <option value="">— Select State —</option>
          {REGIONS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* 3. District Dropdown (Visible when State selected) */}
      {selectedState && currentDistricts.length > 0 && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
          <div className="flex items-center gap-1">
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-gov-navy cursor-pointer transition-all"
            >
              <option value="">— Select District —</option>
              {currentDistricts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* 4. Cadastral Parcel Quick Jump */}
      {selectedState && currentParcels.length > 0 && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
          <div className="flex items-center gap-1">
            <select
              value={selectedUlpin || ''}
              onChange={(e) => handleParcelChange(e.target.value)}
              className="bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-amber-900 focus:outline-none focus:ring-1 focus:ring-gov-amber cursor-pointer transition-all"
            >
              <option value="">— Pick Parcel —</option>
              {currentParcels.map((p) => (
                <option key={p.ulpin} value={p.ulpin}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* Rural vs Urban Context Filter */}
      <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-slate-200">
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
          <button
            onClick={() => setCadastreContext('all')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all ${
              cadastreContext === 'all'
                ? 'bg-white text-gov-navy shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setCadastreContext('rural')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all ${
              cadastreContext === 'rural'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Trees className="w-3 h-3 text-emerald-600" />
            <span>Rural</span>
          </button>
          <button
            onClick={() => setCadastreContext('urban')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all ${
              cadastreContext === 'urban'
                ? 'bg-white text-blue-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-3 h-3 text-blue-600" />
            <span>Urban</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PilotContextFilter;
