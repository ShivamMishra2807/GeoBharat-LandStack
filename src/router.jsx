import React, { useState } from 'react';
import { createBrowserRouter, Navigate, useNavigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ParcelMap from './features/map/components/ParcelMap';
import ParcelDetailPanel from './features/parcel-detail/components/ParcelDetailPanel';
import ServiceRequestForm from './features/citizen-services/components/ServiceRequestForm';
import TransactionTracker from './features/citizen-services/components/TransactionTracker';
import DepartmentQueue from './features/official-dashboard/components/DepartmentQueue';
import AnalyticsPanel from './features/official-dashboard/components/AnalyticsPanel';
import CrossDeptSyncSimulator from './features/official-dashboard/components/CrossDeptSyncSimulator';
import AdminUlpinSearchBar from './features/official-dashboard/components/AdminUlpinSearchBar';
import LoginForm from './features/auth/components/LoginForm';
import LandingPage from './features/landing/LandingPage';
import CitizenDashboard from './features/dashboard/CitizenDashboard';
import useAuth from './features/auth/hooks/useAuth';
import useAppStore from './store';
import { Shield, Sparkles, Scale, Info, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from './components/ui/Button';

// 1. Map Explorer View (Core View: 60-65% Map + 35-40% Sliding Detail Panel)
const MapView = () => {
  const { isDetailOpen } = useAppStore();

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden">
      {/* 3-Layer Architecture & Pan-Indian Normalization Banner */}
      <div className="bg-gradient-to-r from-gov-navy via-gov-navy-light to-gov-navy text-white px-4 py-2 flex items-center justify-between text-xs z-20 border-b border-gov-navy-light/60 shadow-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-gov-amber-light flex-shrink-0" />
          <span className="font-medium text-[11px] sm:text-xs">
            <strong>3-Layer GIS Architecture:</strong> Base (Cadastral & ULPIN) ➜ Essential (RoR, Deeds & Zoning) ➜ Use-Case (Utilities Grid & Property Tax). All regional records (7/12, Khatauni, Patta, PR Card) normalized to WGS84.
          </span>
        </div>
        <span className="hidden lg:inline-flex text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-200">
          OpenAPI 3.0 • OGC Standards
        </span>
      </div>

      {/* Main Map + Slide-in Drawer Container */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Map Viewport (60-65% when panel open, 100% when closed) */}
        <div className="flex-1 h-full relative transition-all duration-300">
          <ParcelMap />
        </div>

        {/* Sliding Detail Drawer */}
        <ParcelDetailPanel />
      </div>
    </div>
  );
};

// 2. Citizen Services Portal View (Protected by Citizen Auth Guard)
const CitizenPortalView = () => {
  const { user, isAuthenticated } = useAuth();
  const { parcelsGeoJson, setSelectedUlpin, setFlyToTarget } = useAppStore();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/portal" replace />;
  }

  // Strict Data Isolation: Query only records where LandRecord.ownerId === loggedInUser.id
  const myParcels = (parcelsGeoJson?.features || []).filter(
    (f) => String(f.properties?.ownerId) === String(user?.id)
  );

  const handleInspectParcel = (parcelFeature) => {
    const ulpin = parcelFeature.properties?.ulpin;
    setSelectedUlpin(ulpin);
    navigate('/');
  };

  return (
    <div className="h-full w-full overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Citizen Profile & Jurisdiction Banner */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gov-navy text-amber-300 flex items-center justify-center font-bold text-lg shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {user?.name || 'Citizen User'}
                </h1>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Aadhaar Verified Citizen
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Citizen ID: <span className="font-mono font-semibold text-slate-700">{user?.id}</span> &bull; {user?.email} &bull; {user?.district ? `${user.district}, ${user.state}` : 'National Land Registry'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl font-medium">
              Registered Holdings: <strong className="text-gov-navy">{myParcels.length} Plot{myParcels.length === 1 ? '' : 's'}</strong>
            </span>
          </div>
        </div>

        {/* Section: My Private Registered Land Holdings */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                My Private Land Holdings & Records
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Protected personal cadastral records & certified RoR extracts (visible exclusively to you)
              </p>
            </div>
          </div>

          {myParcels.length === 0 ? (
            <div className="p-6 bg-white rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Land Parcels Linked Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No cadastral parcels are currently registered under Citizen ID <span className="font-mono text-slate-700 font-semibold">{user?.id}</span>. You can submit a mutation request or link an existing ULPIN below.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myParcels.map((parcel) => {
                const p = parcel.properties || {};
                return (
                  <div
                    key={p.ulpin}
                    className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                          ULPIN (Bhu-Aadhaar)
                        </span>
                        <span className="text-sm font-mono font-bold text-gov-navy">
                          {p.ulpin}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                        {p.status || 'Clear Title'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Survey / Khasra No:</span>
                        <span className="font-bold text-slate-800">{p.surveyNumber || p.survey_no}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Jurisdiction:</span>
                        <span className="font-medium text-slate-700">{p.village}, {p.district}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Total Area:</span>
                        <span className="font-bold text-slate-800">{p.area_sqm ? `${p.area_sqm.toLocaleString()} sqm (${p.area_acres} ac)` : '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Zoning / Use:</span>
                        <span className="font-medium text-slate-700">{p.zone_type || 'Residential'}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => handleInspectParcel(parcel)}
                        icon={ArrowRight}
                      >
                        View on Cadastral Map
                      </Button>
                      <a
                        href="/"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedUlpin(p.ulpin);
                          window.location.href = '/';
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                      >
                        Inspect Dossier
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Section: Service Application Form & Status Tracker */}
        <section className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Land Administration Petitions & Requests
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Apply for succession mutations, certified 7/12 extracts, and track progress
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5">
              <ServiceRequestForm onSubmitted={() => setRefreshTrigger((prev) => prev + 1)} />
            </div>
            <div className="lg:col-span-7">
              <TransactionTracker refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// 3. Official Dashboard View (Protected by Strict Admin Role Guard)
const OfficialDashboardView = () => {
  const { user, role, isAuthenticated } = useAuth();
  const [syncCount, setSyncCount] = useState(0);
  const [simulatorUlpin, setSimulatorUlpin] = useState(null);

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/dashboard" replace />;
  }

  const isAdmin = role === 'admin' || role === 'official';

  if (!isAdmin) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6 bg-slate-100 dark:bg-slate-950">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Official Access Restricted</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              The Department Scrutiny Queue and Revenue Administration Console are strictly reserved for authorized Revenue Officers. As a citizen user ({user?.name || user?.email}), you cannot access official consoles.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <a
              href="/login?redirect=/dashboard"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gov-navy text-white text-xs font-semibold hover:bg-gov-navy-light transition-all shadow-sm"
            >
              Sign In as Administrator
            </a>
            <a
              href="/portal"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              Return to Citizen Portal
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Revenue Administration Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Sub-Divisional Revenue Console • Automated Cross-Departmental Workflows, Scrutiny Queue & Analytics
            </p>
          </div>
          <span className="text-xs bg-gov-navy text-white px-3 py-1 rounded-full font-medium flex items-center gap-1.5 shadow-xs">
            <Shield className="w-3.5 h-3.5 text-gov-amber-light" />
            Official Jurisdictional Console
          </span>
        </div>

        {/* Jurisdictional ULPIN Search Bar for Admin */}
        <section id="admin-search-section">
          <AdminUlpinSearchBar
            onSelectForSimulator={(ulpin) => {
              setSimulatorUlpin(ulpin);
              const el = document.getElementById('cross-dept-simulator');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </section>

        {/* USP 5: Cross-Departmental Interoperability Simulator */}
        <section id="cross-dept-simulator" className="space-y-2">
          <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-gov-amber-dark" />
            Automated Cross-Departmental Synchronization Simulator
          </h2>
          <CrossDeptSyncSimulator
            selectedUlpin={simulatorUlpin}
            onSyncCompleted={() => setSyncCount((c) => c + 1)}
          />
        </section>

        {/* Analytics Section */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Cadastral Performance & Analytics
          </h2>
          <AnalyticsPanel key={`analytics-${syncCount}`} />
        </section>

        {/* Scrutiny Queue Section */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Pending Scrutiny Dossiers
          </h2>
          <DepartmentQueue key={`queue-${syncCount}`} />
        </section>
      </div>
    </div>
  );
};

// 4. Login View
const LoginView = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <LandingPage />;
};

// Layout Dispatcher:
// If unauthenticated: First shows LandStack Landing Page explaining What is LandStack, What it does, Logo meaning, and Login/Signup.
// Layout Dispatcher:
// If unauthenticated: First shows GeoBharat Landing Page.
// If authenticated: Renders AppLayout with Navbar, Sidebar, and appropriate dashboard.
const AppLayoutDispatcher = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <LandingPage />;
  }
  return <AppLayout />;
};

// Role-based Dashboard Dispatcher:
// Admin goes directly to Official Jurisdictional Console (/admin)
// Citizen goes to personal Citizen Dashboard
const RoleDashboardDispatcher = () => {
  const { role } = useAuth();
  if (role === 'admin' || role === 'official') {
    return <OfficialDashboardView />;
  }
  return <CitizenDashboard />;
};

// Guard: Admins have no personal land, redirect them to admin console
const MyLandGuard = () => {
  const { role } = useAuth();
  if (role === 'admin' || role === 'official') {
    return <Navigate to="/admin" replace />;
  }
  return <CitizenDashboard />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/landing',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LandingPage />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: 'dashboard',
        element: <RoleDashboardDispatcher />,
      },
      {
        path: 'my-land',
        element: <MyLandGuard />,
      },
      {
        path: 'map',
        element: <MapView />,
      },
      {
        path: 'search',
        element: <RoleDashboardDispatcher />,
      },
      {
        path: 'portal',
        element: <CitizenPortalView />,
      },
      {
        path: 'admin',
        element: <OfficialDashboardView />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default router;
