import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../../../store';
import { parcelApi } from '../../../api/parcelApi';
import { getPolygonBounds } from '../../../utils/geojsonHelpers';
import { formatULPIN, formatArea, getStatusBadgeColor } from '../../../utils/formatters';
import {
  Search,
  X,
  MapPin,
  User,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Building2,
  FileText,
  AlertCircle,
  Layers,
  Scale,
} from 'lucide-react';
import Button from '../../../components/ui/Button';

export const AdminUlpinSearchBar = ({ onSelectForSimulator }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [searchError, setSearchError] = useState('');
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const {
    parcelsGeoJson,
    setParcelsGeoJson,
    setSelectedUlpin,
    setFlyToTarget,
    openDetailPanel,
  } = useAppStore();

  // Preload parcels if not loaded yet
  useEffect(() => {
    if (!parcelsGeoJson) {
      parcelApi.getParcels().then((data) => {
        if (data) setParcelsGeoJson(data);
      }).catch((err) => {
        console.warn('Could not preload parcels in admin search:', err);
      });
    }
  }, [parcelsGeoJson, setParcelsGeoJson]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter matching parcels
  const matches = React.useMemo(() => {
    if (!query || query.trim().length < 1 || !parcelsGeoJson?.features) {
      return [];
    }
    const q = query.trim().toLowerCase().replace(/[-\s]/g, '');

    return parcelsGeoJson.features.filter((feature) => {
      const p = feature.properties || {};
      const ulpin = String(p.ulpin || '').toLowerCase().replace(/[-\s]/g, '');
      const owner = String(p.owner_name || '').toLowerCase();
      const village = String(p.village || '').toLowerCase();
      const surveyNo = String(p.survey_no || p.surveyNumber || '').toLowerCase();
      const district = String(p.district || '').toLowerCase();
      const state = String(p.state || '').toLowerCase();
      const status = String(p.status || '').toLowerCase();

      return (
        ulpin.includes(q) ||
        owner.includes(query.trim().toLowerCase()) ||
        village.includes(query.trim().toLowerCase()) ||
        surveyNo.includes(query.trim().toLowerCase()) ||
        district.includes(query.trim().toLowerCase()) ||
        state.includes(query.trim().toLowerCase()) ||
        status.includes(query.trim().toLowerCase())
      );
    });
  }, [query, parcelsGeoJson]);

  const handleSelectFeature = (feature) => {
    setSelectedParcel(feature);
    setSearchError('');
    setIsOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    if (matches.length > 0) {
      handleSelectFeature(matches[0]);
    } else {
      setSearchError(`No cadastral parcel found matching "${query}". Please check the 14-digit ULPIN or try a sample suggestion below.`);
      setSelectedParcel(null);
    }
  };

  const handleInspectOnMap = (feature) => {
    const ulpin = feature.properties?.ulpin;
    setSelectedUlpin(ulpin);

    if (feature.geometry?.coordinates) {
      const bounds = getPolygonBounds(feature.geometry.coordinates);
      if (bounds) {
        setFlyToTarget({ bounds });
      }
    }
    openDetailPanel();
    navigate('/map');
  };

  const sampleUlpins = [
    { ulpin: '27250010045001', label: 'Wagholi (Clear Title)', state: 'Maharashtra' },
    { ulpin: '27250010045002', label: 'Wagholi (Sunita Gaikwad)', state: 'Maharashtra' },
    { ulpin: '09030020114004', label: 'Lucknow (Boundary Dispute)', state: 'Uttar Pradesh' },
    { ulpin: '33010050082006', label: 'Kanchi (Patta Regularization)', state: 'Tamil Nadu' },
    { ulpin: '04010010017011', label: 'Chandigarh (Commercial Pilot)', state: 'Chandigarh' },
  ];

  const handleQuickChipClick = (ulpinVal) => {
    setQuery(ulpinVal);
    setSearchError('');
    const all = parcelsGeoJson?.features || [];
    const match = all.find((f) => String(f.properties?.ulpin) === String(ulpinVal));
    if (match) {
      handleSelectFeature(match);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gov-navy dark:bg-amber-400 text-amber-300 dark:text-slate-900 flex items-center justify-center font-bold shadow-xs">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Jurisdictional ULPIN & Cadastral Record Search
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Instant Bhu-Aadhaar lookup across revenue subdivisions, title status & spatial boundaries
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full font-medium border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-gov-navy dark:text-amber-400" />
            <span>Pan-India Cadastre ({parcelsGeoJson?.features?.length || 11} Registered Plots)</span>
          </span>
        </div>
      </div>

      {/* Main Search Input Form */}
      <div ref={containerRef} className="relative">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4 text-gov-navy dark:text-amber-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
                setSearchError('');
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Enter 14-digit ULPIN, Owner Name, Survey / Khasra No, Village, or District..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-850 focus:bg-white dark:focus:bg-slate-850 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 dark:focus:ring-amber-400/20 focus:border-gov-navy dark:focus:border-amber-400 transition-all shadow-xs"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedParcel(null);
                  setIsOpen(false);
                }}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                title="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Search}
            className="px-6 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xs"
          >
            Search ULPIN
          </Button>
        </form>

        {/* Live Autocomplete Results Dropdown */}
        {isOpen && query.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 max-h-80 overflow-y-auto">
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span>Matching Jurisdictional Parcels ({matches.length})</span>
              <span>Click to preview record</span>
            </div>

            {matches.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                No matching cadastral parcel found for <span className="font-semibold text-slate-700 dark:text-slate-200">"{query}"</span>.
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  Try searching by full ULPIN or choose a sample ULPIN chip below.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {matches.map((feature) => {
                  const p = feature.properties || {};
                  return (
                    <button
                      key={p.ulpin}
                      type="button"
                      onClick={() => handleSelectFeature(feature)}
                      className="w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-start justify-between gap-3 group"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-gov-navy dark:text-amber-400 font-mono">
                            {formatULPIN(p.ulpin)}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-sm border font-semibold ${getStatusBadgeColor(p.status)}`}>
                            {p.status || 'Clear Title'}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {p.record_type}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                          <span className="font-semibold flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            {p.owner_name}
                          </span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            Survey #{p.survey_no || p.surveyNumber}, {p.village}, {p.district}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 block">
                          {p.area_acres ? `${p.area_acres} ac` : `${p.area_sqm} m²`}
                        </span>
                        <span className="text-[10px] text-gov-navy dark:text-amber-400 font-semibold group-hover:underline inline-flex items-center gap-0.5 mt-1">
                          Inspect <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Notice */}
      {searchError && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
          <span>{searchError}</span>
        </div>
      )}

      {/* Quick Test Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Quick ULPINs:</span>
        {sampleUlpins.map((sample) => (
          <button
            key={sample.ulpin}
            type="button"
            onClick={() => handleQuickChipClick(sample.ulpin)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-mono transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
          >
            <span className="font-semibold text-gov-navy dark:text-amber-400">{sample.ulpin.slice(0, 6)}...</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">({sample.label})</span>
          </button>
        ))}
      </div>

      {/* Selected Parcel Dossier Preview Card */}
      {selectedParcel && (
        <div className="mt-4 p-4 sm:p-5 rounded-xl border border-gov-navy/20 dark:border-amber-400/30 bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-850 dark:to-slate-900 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  Bhu-Aadhaar ULPIN
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getStatusBadgeColor(selectedParcel.properties?.status)}`}>
                  {selectedParcel.properties?.status || 'Clear Title'}
                </span>
                {selectedParcel.properties?.risk_grade && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-700">
                    Grade: {selectedParcel.properties?.risk_grade}
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-mono font-black text-gov-navy dark:text-amber-400">
                {formatULPIN(selectedParcel.properties?.ulpin)}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                className="text-xs font-semibold shadow-xs"
                onClick={() => handleInspectOnMap(selectedParcel)}
                icon={MapPin}
              >
                Inspect on Cadastral Map
              </Button>
              {onSelectForSimulator && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-semibold"
                  onClick={() => onSelectForSimulator(selectedParcel.properties?.ulpin)}
                  icon={Sparkles}
                >
                  Load in Sync Simulator
                </Button>
              )}
              <button
                type="button"
                onClick={() => setSelectedParcel(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                title="Close dossier"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Cadastral Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Primary Title Holder</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm truncate block">
                {selectedParcel.properties?.owner_name || '—'}
              </span>
              <span className="text-[10px] text-slate-500">Record: {selectedParcel.properties?.record_type}</span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Survey / Khasra No</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm block">
                {selectedParcel.properties?.survey_no || selectedParcel.properties?.surveyNumber || '—'}
              </span>
              <span className="text-[10px] text-slate-500">
                {selectedParcel.properties?.village}, {selectedParcel.properties?.district}
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Cadastral Area</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm block">
                {selectedParcel.properties?.area_sqm?.toLocaleString()} m²
              </span>
              <span className="text-[10px] text-slate-500">
                ({selectedParcel.properties?.area_acres} Acres)
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Master Plan Zoning</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm truncate block">
                {selectedParcel.properties?.zone_type || 'Residential'}
              </span>
              <span className="text-[10px] text-slate-500">
                Tax: {selectedParcel.properties?.tax_status || 'Paid'} &bull; Lien: {selectedParcel.properties?.encumbrance_status || 'None'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUlpinSearchBar;
