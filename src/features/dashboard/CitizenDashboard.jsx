import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../auth/hooks/useAuth';
import useAppStore from '../../store';
import useParcelLayers from '../map/hooks/useParcelLayers';
import ParcelMap from '../map/components/ParcelMap';
import ParcelDetailPanel from '../parcel-detail/components/ParcelDetailPanel';
import { getPolygonBounds } from '../../utils/geojsonHelpers';
import { formatULPIN, formatArea, getStatusBadgeColor } from '../../utils/formatters';
import {
  Shield,
  ShieldCheck,
  MapPin,
  Search,
  Layers,
  ArrowRight,
  User,
  Phone,
  Mail,
  CheckCircle2,
  ExternalLink,
  Lock,
  Eye,
  Building2,
  FileText,
  Compass,
  AlertCircle,
  Printer,
  Download,
  TreePine,
  Sprout,
  SunMedium,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import LandSummaryPrintModal from './LandSummaryPrintModal';

export const CitizenDashboard = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const {
    parcelsGeoJson,
    selectedUlpin,
    setSelectedUlpin,
    hoveredUlpin,
    setHoveredUlpin,
    setFlyToTarget,
    openDetailPanel,
    isDetailOpen,
  } = useAppStore();

  const navigate = useNavigate();
  const [searchUlpin, setSearchUlpin] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchedParcel, setSearchedParcel] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // If not authenticated, redirect to landing
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // If official admin, redirect to official dashboard console (admins have no personal land)
  useEffect(() => {
    if (role === 'admin' || role === 'official') {
      navigate('/admin');
    }
  }, [role, navigate]);

  // 1. My Land Parcels query: Parcel.ownerId === loggedInUser.id
  const myParcels = useMemo(() => {
    if (!parcelsGeoJson?.features || !user) return [];
    return parcelsGeoJson.features.filter(
      (f) => String(f.properties?.ownerId) === String(user.id)
    );
  }, [parcelsGeoJson, user]);

  // Total Land Area calculation
  const totalAreaStats = useMemo(() => {
    let totalSqm = 0;
    myParcels.forEach((p) => {
      totalSqm += Number(p.properties?.area_sqm || 0);
    });
    return formatArea(totalSqm);
  }, [myParcels]);

  // 2. Automatic Parcel Zoom on Login / Mount
  // Flow: Login -> Load User -> Load Parcel -> Find Geometry -> Automatically Fit Bounds -> Highlight
  useEffect(() => {
    if (myParcels.length > 0 && !selectedUlpin) {
      const primaryParcel = myParcels[0];
      const ulpin = primaryParcel.properties?.ulpin;
      setSelectedUlpin(ulpin);

      if (primaryParcel.geometry?.coordinates) {
        const bounds = getPolygonBounds(primaryParcel.geometry.coordinates);
        if (bounds) {
          setFlyToTarget({ bounds });
        }
      }
    }
  }, [myParcels, selectedUlpin, setSelectedUlpin, setFlyToTarget]);

  // Function to manually zoom to a specific parcel
  const handleZoomToParcel = (parcelFeature) => {
    const ulpin = parcelFeature.properties?.ulpin;
    setSelectedUlpin(ulpin);
    if (parcelFeature.geometry?.coordinates) {
      const bounds = getPolygonBounds(parcelFeature.geometry.coordinates);
      if (bounds) {
        setFlyToTarget({ bounds });
      }
    }
    setSearchedParcel(parcelFeature);
    openDetailPanel();
  };

  // 3. Search Parcel by ULPIN Handler
  const handleUlpinSearch = (e) => {
    if (e) e.preventDefault();
    setSearchError('');

    const queryClean = searchUlpin.trim().replace(/[-\s]/g, '');
    if (!queryClean) {
      setSearchError('Please enter a valid 14-digit ULPIN number.');
      return;
    }

    const allFeatures = parcelsGeoJson?.features || [];
    const match = allFeatures.find(
      (f) => String(f.properties?.ulpin).replace(/[-\s]/g, '') === queryClean
    );

    if (match) {
      setSearchedParcel(match);
      setSelectedUlpin(match.properties.ulpin);
      if (match.geometry?.coordinates) {
        const bounds = getPolygonBounds(match.geometry.coordinates);
        if (bounds) {
          setFlyToTarget({ bounds });
        }
      }
      openDetailPanel();
    } else {
      setSearchError(`No cadastral parcel found matching ULPIN "${searchUlpin}". Please try one of the demo suggestions.`);
    }
  };

  const handleQuickSearch = (ulpinVal) => {
    setSearchUlpin(ulpinVal);
    setSearchError('');
    const allFeatures = parcelsGeoJson?.features || [];
    const match = allFeatures.find(
      (f) => String(f.properties?.ulpin) === String(ulpinVal)
    );
    if (match) {
      setSearchedParcel(match);
      setSelectedUlpin(match.properties.ulpin);
      if (match.geometry?.coordinates) {
        const bounds = getPolygonBounds(match.geometry.coordinates);
        if (bounds) {
          setFlyToTarget({ bounds });
        }
      }
      openDetailPanel();
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Banner / Welcome Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 px-4 sm:px-8 py-5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gov-navy dark:bg-gov-navy-light text-amber-300 flex items-center justify-center font-black text-xl shadow-md border border-amber-400/30">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Welcome, {user?.name || 'Citizen User'}
                </h1>
                <span className="text-[11px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Aadhaar Verified Citizen
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                <span>User ID: <strong className="font-mono text-slate-700 dark:text-slate-200">{user?.id}</strong></span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {user?.email}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {user?.phone || '+91 98220 44102'}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {user?.village ? `${user.village}, ${user.district}` : 'Maharashtra'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="primary"
              size="sm"
              className="text-xs flex items-center gap-1.5 shadow-xs"
              onClick={() => setIsPrintModalOpen(true)}
              icon={Printer}
            >
              Print / Download Summary
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => navigate('/portal')}
              icon={FileText}
            >
              My Petitions & Requests
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="text-xs"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Metric Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
              My Land Parcels
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gov-navy dark:text-amber-400 font-mono">
                {myParcels.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Registered Plot{myParcels.length === 1 ? '' : 's'}</span>
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
              Active in GeoBharat Registry
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
              My Total Land Area
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                {totalAreaStats.acres}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-1 truncate">
              Equivalent: {totalAreaStats.sqm}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
              Title Clearance Status
            </span>
            <div className="flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100">Clear Title</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              RoR & Mutation Validated
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
              Primary Bhu-Aadhaar (ULPIN)
            </span>
            <div className="font-mono text-sm sm:text-base font-bold text-gov-navy dark:text-amber-400 pt-1 truncate">
              {myParcels[0]?.properties?.ulpin ? formatULPIN(myParcels[0].properties.ulpin) : '—'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 truncate">
              Survey No: {myParcels[0]?.properties?.survey_no || '45/1A'}
            </p>
          </div>
        </div>



        {/* SECTION: SEARCH PARCEL BY ULPIN (Important Feature) */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Search className="w-5 h-5 text-gov-navy dark:text-amber-400" />
                Search Parcel by ULPIN
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Lookup any registered cadastral plot across India using its unique 14-digit Bhu-Aadhaar number.
              </p>
            </div>
            <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full font-medium flex items-center gap-1 border border-slate-200 dark:border-slate-700">
              <Lock className="w-3 h-3 text-amber-500" />
              Privacy Protected Search
            </span>
          </div>

          {/* Search Bar Input */}
          <form onSubmit={handleUlpinSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
                <Search className="w-4 h-4 text-gov-navy dark:text-amber-400" />
              </div>
              <input
                type="text"
                value={searchUlpin}
                onChange={(e) => setSearchUlpin(e.target.value)}
                placeholder="Enter 14-digit ULPIN (e.g. 27250010045002)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-850 focus:bg-white dark:focus:bg-slate-850 text-xs sm:text-sm font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 dark:focus:ring-amber-400/20 focus:border-gov-navy dark:focus:border-amber-400 transition-all shadow-xs"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Search}
              className="px-6 text-xs sm:text-sm font-bold uppercase tracking-wider"
            >
              Search
            </Button>
          </form>

          {/* Error Message */}
          {searchError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <span>{searchError}</span>
            </div>
          )}
        </section>

        {/* SECTION: CADASTRAL MAP (INDIA MAP WITH AUTOMATIC PARCEL ZOOM) */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Compass className="w-5 h-5 text-gov-navy" />
                  Interactive India Cadastral Map
                </h2>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold border border-emerald-300">
                  Auto-Zoomed to Your Land
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Displays Pan-India state boundaries and high-precision cadastral polygon boundaries with GPS demarcation stones.
              </p>
            </div>

            {/* Quick Plot Zoom buttons for multi-parcel owners */}
            <div className="flex items-center gap-2 flex-wrap">
              {myParcels.map((parcel, idx) => (
                <button
                  key={parcel.properties?.ulpin}
                  onClick={() => handleZoomToParcel(parcel)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    String(selectedUlpin) === String(parcel.properties?.ulpin)
                      ? 'bg-gov-navy dark:bg-gov-navy-light text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <span>★ Zoom to Plot {parcel.properties?.survey_no || `#${idx + 1}`}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Map & Sliding Detail Container */}
          <div className="h-[460px] sm:h-[540px] w-full relative flex overflow-hidden">
            <div className="flex-1 h-full relative">
              <ParcelMap />
            </div>
            {/* Sliding Detail Drawer */}
            <ParcelDetailPanel />
          </div>
        </section>

        {/* SECTION: MY LAND (Most Important Section) */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                My Land Parcels & Private Records
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Hover over any parcel card for animated real-time map preview. Query: <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px] font-mono">Parcel.ownerId === loggedInUser.id</code>
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="primary"
                size="sm"
                className="text-xs flex items-center gap-1.5 shadow-xs"
                onClick={() => setIsPrintModalOpen(true)}
                icon={Printer}
              >
                Print / Download Summary
              </Button>
              <span className="text-xs bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl font-semibold shadow-xs">
                Total Holdings: {myParcels.length}
              </span>
            </div>
          </div>

          {myParcels.length === 0 ? (
            <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Land Parcels Registered Under Citizen ID {user?.id}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                No cadastral records currently match your account. Use the ULPIN Search above to lookup public parcels or apply for mutation linking.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myParcels.map((parcel) => {
                const p = parcel.properties || {};
                const isSelected = String(p.ulpin) === String(selectedUlpin);
                const isHovered = String(p.ulpin) === String(hoveredUlpin);
                return (
                  <div
                    key={p.ulpin}
                    /* Feature 12: Animated Map Fly-to Preview on Hover */
                    onMouseEnter={() => {
                      setHoveredUlpin(p.ulpin);
                      if (parcel.geometry?.coordinates) {
                        const bounds = getPolygonBounds(parcel.geometry.coordinates);
                        if (bounds) {
                          setFlyToTarget({ bounds });
                        }
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredUlpin(null);
                    }}
                    className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border transition-all duration-200 space-y-3 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 dark:border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                        : isHovered
                        ? 'border-amber-400 dark:border-amber-400 shadow-lg scale-[1.01] ring-2 ring-amber-400/20'
                        : 'border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
                          Bhu-Aadhaar (ULPIN)
                        </span>
                        <span className="text-base font-mono font-bold text-gov-navy dark:text-amber-400">
                          {formatULPIN(p.ulpin)}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          {p.status || 'Clear Title'}
                        </span>
                        <span className="text-[9px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded">
                          ★ My Verified Land
                        </span>
                      </div>
                    </div>

                    {/* Cadastral Details Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-750">
                        <span className="text-slate-400 dark:text-slate-400 text-[10px] block">Survey / Khasra No:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{p.surveyNumber || p.survey_no}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-750">
                        <span className="text-slate-400 dark:text-slate-400 text-[10px] block">Total Normalized Area:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">
                          {p.area_sqm ? `${p.area_sqm.toLocaleString()} sqm (${p.area_acres} ac)` : '—'}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-750">
                        <span className="text-slate-400 dark:text-slate-400 text-[10px] block">Jurisdiction:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{p.village}, {p.district}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-750">
                        <span className="text-slate-400 dark:text-slate-400 text-[10px] block">Zoning & Use:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{p.zone_type || 'Residential (R-1)'}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleZoomToParcel(parcel);
                        }}
                        icon={Compass}
                      >
                        Zoom on Map
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUlpin(p.ulpin);
                          openDetailPanel();
                        }}
                        icon={FileText}
                      >
                        Inspect Full Dossier
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Official Formatted PDF/Print Land Holding Extract Modal */}
      <LandSummaryPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        user={user}
        myParcels={myParcels}
        totalAreaStats={totalAreaStats}
      />
    </div>
  );
};

export default CitizenDashboard;
