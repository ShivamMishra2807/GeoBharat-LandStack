import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../auth/hooks/useAuth';
import LandStackLogo from '../../components/common/LandStackLogo';
import {
  FileText,
  Map,
  Search,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  UserCheck,
  Shield,
  KeyRound,
  Mail,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Scale,
  Landmark,
  Zap,
  Check,
  ChevronRight
} from 'lucide-react';
import Button from '../../components/ui/Button';

export const LandingPage = () => {
  const { user, login, signup, logout, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  // Mode: 'login' | 'signup'
  const [authMode, setAuthMode] = useState('login');
  // Role: 'citizen' | 'admin'
  const [userRole, setUserRole] = useState('citizen');

  // Form states
  const [citizenEmail, setCitizenEmail] = useState('ramesh.patil@example.in');
  const [citizenPassword, setCitizenPassword] = useState('citizen123');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');

  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCitizenSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (authMode === 'signup') {
        if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
          setErrorMsg('Please fill all required fields (Name, Email, Password).');
          return;
        }
        await signup({
          name: signupName.trim(),
          email: signupEmail.trim(),
          password: signupPassword,
          phone: signupPhone.trim() || '+91 98000 00000',
          role: 'citizen',
        });
        setSuccessMsg('Account registered successfully! Redirecting to your personal dashboard...');
      } else {
        await login('citizen', {
          email: citizenEmail.trim(),
          password: citizenPassword,
        });
      }
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.error || err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await login('admin', {
        username: adminUsername.trim(),
        password: adminPassword,
      });
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.error || err.message || 'Invalid admin credentials. (Hint: admin / admin123)');
    } finally {
      setLoading(false);
    }
  };

  const selectDemoAccount = async (type) => {
    setErrorMsg('');
    setLoading(true);
    try {
      if (type === 'citizen-a') {
        await login('citizen', { email: 'ramesh.patil@example.in', password: 'citizen123' });
        navigate('/dashboard');
      } else if (type === 'citizen-b') {
        await login('citizen', { email: 'sunita.gaikwad@example.in', password: 'citizen123' });
        navigate('/dashboard');
      } else if (type === 'admin') {
        await login('admin', { username: 'admin', password: 'admin123' });
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg('Failed to log in with demo account.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToAuth = (mode = 'login', targetRole = 'citizen') => {
    setAuthMode(mode);
    setUserRole(targetRole);
    setErrorMsg('');
    setSuccessMsg('');
    const el = document.getElementById('auth-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans selection:bg-amber-200 overflow-x-hidden">
      {/* Top Navbar */}
      <header className="bg-gov-navy text-white px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-gov-navy-light/50 sticky top-0 z-50 shadow-md">
        <LandStackLogo size="md" lightText={true} />

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => scrollToAuth('login', 'citizen')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={() => scrollToAuth('signup', 'citizen')}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gov-amber hover:bg-gov-amber-dark text-gov-navy shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>
      </header>

      {/* Main Landing Content */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-gov-navy via-slate-900 to-slate-800 text-white py-14 sm:py-20 px-4 sm:px-8 border-b border-slate-700">
          {/* Subtle background tech grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-gov-amber-light" />
              <span>National Digital Land Records & Cadastral GIS Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Land Information Made <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-200">
                Transparent, Digital & Visual
              </span>
            </h1>

            {/* 1. What is GeoBharat? */}
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md border border-white/15 p-5 sm:p-6 rounded-2xl shadow-xl">
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300 font-bold block mb-1">
                What is GeoBharat?
              </span>
              <p className="text-sm sm:text-base text-slate-100 font-normal leading-relaxed">
                <strong>GeoBharat</strong> is a digital land-record and land-parcel management platform designed to make land information easier to access, visualize, and manage.
              </p>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => scrollToAuth('login', 'citizen')}
                className="px-6 py-3 rounded-xl bg-gov-amber hover:bg-gov-amber-dark text-gov-navy font-bold text-sm shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Access Citizen Portal (Login / Sign Up)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* 2. WHAT DOES THE PLATFORM DO? */}
        <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-gov-navy font-mono text-xs font-bold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-gov-amber-dark" />
              <span>Next-Gen Cadastral Infrastructure</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              What does the platform do?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              GeoBharat modernizes India's land administration by bridging spatial GIS technology, sub-registrar deed registries, and municipal taxation into an intuitive, transparent platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: View Land Records */}
            <div
              onClick={() => scrollToAuth('login', 'citizen')}
              className="group relative bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Record of Rights
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    View Land Records
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                    Securely inspect your official Record of Rights (7/12, Khatauni, Patta, PR Card) and certified mutation entries online with instant cryptographic verification.
                  </p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span>Digital DSC-signed extracts</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span>Normalized across all 28 States & UTs</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100/80 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>Inspect your records</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 2: Visualize Parcel on Map */}
            <div
              onClick={() => scrollToAuth('login', 'citizen')}
              className="group relative bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/25 group-hover:scale-110 transition-transform">
                    <Map className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    WGS84 GIS Map
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    Visualize Parcel on Map
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                    Explore high-precision cadastral boundaries, GPS corner demarcation stones, and satellite imagery overlays georeferenced to national cartographic standards.
                  </p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span>Interactive polygon boundaries</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span>Auto-zoom & survey stone beacons</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100/80 flex items-center justify-between text-xs font-bold text-blue-700">
                <span>View cadastral layers</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 3: Access Information by ULPIN */}
            <div
              onClick={() => scrollToAuth('login', 'citizen')}
              className="group relative bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/25 group-hover:scale-110 transition-transform">
                    <Search className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    14-Digit Bhu-Aadhaar
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                    Access Information by ULPIN
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                    Lookup any land parcel across India using its unique 14-digit Bhu-Aadhaar (ULPIN). Search by village, survey number, or verified landholder identity.
                  </p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>Instant universal search bar</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>Zero duplicate parcel ambiguity</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100/80 flex items-center justify-between text-xs font-bold text-amber-800">
                <span>Lookup your ULPIN</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 4: Manage Land Digitally */}
            <div
              onClick={() => scrollToAuth('login', 'citizen')}
              className="group relative bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-700 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/25 group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    Paperless Governance
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                    Manage Land Digitally
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                    Submit mutation petitions (Varas/Succession, Partition, Sub-Division), track real-time scrutiny stages from Talathi to Tehsildar, and download official certificates.
                  </p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                    <span>Real-time milestone tracker</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                    <span>Direct revenue official routing</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100/80 flex items-center justify-between text-xs font-bold text-purple-700">
                <span>Start online service</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 5: Pan-Indian Terminology Normalization */}
            <div
              onClick={() => scrollToAuth('login', 'citizen')}
              className="group relative bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-700 text-white flex items-center justify-center font-bold shadow-md shadow-cyan-500/25 group-hover:scale-110 transition-transform">
                    <Scale className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                    Unit Normalizer
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-800 transition-colors">
                    Standardized Units & Lexicon
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                    Effortlessly convert regional measurements like Bigha, Guntha, Ground, Kanal, and Marla into standardized Hectares and Square Meters across all state jurisdictions.
                  </p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
                    <span>State-specific conversion rates</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
                    <span>Bilingual land glossary (8+ languages)</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100/80 flex items-center justify-between text-xs font-bold text-cyan-800">
                <span>Explore converter</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 6: Encumbrance & Legal Transparency */}
            <div
              onClick={() => scrollToAuth('login', 'citizen')}
              className="group relative bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/25 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    Fraud Protection
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                    Encumbrance & Fraud Defense
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                    Instantly verify bank mortgage charges, civil court injunctions, and master plan zoning restrictions to safeguard property transactions against title disputes.
                  </p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <span>Real-time bank lien alerts</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <span>Auto cross-department sync simulator</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100/80 flex items-center justify-between text-xs font-bold text-rose-700">
                <span>Check title safety</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </section>

        {/* 2.5 CADASTRAL NATURE & TERRAIN PHOTO SHOWCASE */}
        <section className="py-14 sm:py-16 px-4 sm:px-8 bg-slate-100/60 border-t border-slate-200">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono flex items-center justify-center gap-1.5">
                <span>🌿 Natural Landscape & Cadastral Terrain</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                From Rural Farmlands to Digital Cadastre
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                GeoBharat maps India's diverse agro-climatic terrain, fertile agricultural parcels, and green vegetation belts into high-precision digital boundaries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 group">
                <div className="h-52 w-full overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80"
                    alt="Fertile Agricultural Farmlands"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-600/95 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs">
                    🌱 Fertile Farmland & Alluvial Soil
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-semibold block">
                      Agro-Cadastral Belt
                    </span>
                    <h4 className="text-base font-bold drop-shadow-sm">Agricultural Parcels</h4>
                  </div>
                </div>
                <div className="p-4 space-y-1.5">
                  <p className="text-xs text-slate-700 font-medium">
                    Continuous vegetative crop canopies mapped with high-precision demarcation vertices.
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Verified multi-crop agricultural zoning & irrigation channels
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 group">
                <div className="h-52 w-full overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1000&q=80"
                    alt="Drone Orthomosaic Land Survey"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-600/95 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs">
                    🛰️ Drone Orthomosaic 2cm
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-xs font-mono uppercase tracking-wider text-blue-300 font-semibold block">
                      Aerial Georeferencing
                    </span>
                    <h4 className="text-base font-bold drop-shadow-sm">GPS Boundary Demarcations</h4>
                  </div>
                </div>
                <div className="p-4 space-y-1.5">
                  <p className="text-xs text-slate-700 font-medium">
                    Centimeter-accurate ortho-rectified aerial surveys linked with Bhu-Aadhaar ULPIN.
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Permanent ground control points & boundary stone coordinates
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 group">
                <div className="h-52 w-full overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80"
                    alt="River Basin & Watershed Topography"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-600/95 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs">
                    💧 Natural Water Table & Aquifer
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold block">
                      Eco-Clear Validation
                    </span>
                    <h4 className="text-base font-bold drop-shadow-sm">Watershed & Soil Topography</h4>
                  </div>
                </div>
                <div className="p-4 space-y-1.5">
                  <p className="text-xs text-slate-700 font-medium">
                    Integrated natural terrain elevation, water bodies, and flood hazard zone clearance.
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Zero wetland encroachment certification under environmental norms
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. LANDSTACK LOGO & WHY THIS LOGO? */}
        <section className="py-12 px-4 sm:px-8 bg-white border-y border-slate-200">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm">
              <div className="flex-shrink-0">
                <LandStackLogo size="xl" showText={false} />
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-gov-navy">
                    Symbolism & Meaning
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                    Official Emblem
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Why this logo?</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  The GeoBharat logo represents the connection between <strong>land parcels</strong>, <strong>digital technology</strong>, and <strong>organized land records</strong>.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-500 font-medium">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                    <span className="text-emerald-700 font-bold block">1. Base Layer</span>
                    Cadastral Land Parcel
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                    <span className="text-blue-700 font-bold block">2. Middle Layer</span>
                    Digital Records Stack
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                    <span className="text-amber-700 font-bold block">3. Top Node</span>
                    GIS Mapping & GPS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. LOGIN & SIGN UP SECTION */}
        <section id="auth-section" className="py-14 sm:py-16 px-4 sm:px-8 bg-slate-100/70">
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 text-center">
              <div className="flex justify-center mb-2">
                <LandStackLogo size="md" showText={false} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Access GeoBharat</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sign in or register as a citizen, or access the admin console
              </p>

              {/* Citizen vs Admin switch */}
              <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-200/70 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setUserRole('citizen');
                    setErrorMsg('');
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    userRole === 'citizen'
                      ? 'bg-white text-gov-navy shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Citizen Portal</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserRole('admin');
                    setErrorMsg('');
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    userRole === 'admin'
                      ? 'bg-white text-gov-navy shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-gov-amber-dark" />
                  <span>Admin Login</span>
                </button>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-5 sm:p-6 space-y-4">
              {/* Error / Success Notifications */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* CITIZEN TAB */}
              {userRole === 'citizen' && (
                <div className="space-y-4">
                  {/* Mode toggle: Login vs Sign Up */}
                  <div className="flex border-b border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setErrorMsg('');
                      }}
                      className={`flex-1 pb-2 font-bold text-center border-b-2 transition-all ${
                        authMode === 'login'
                          ? 'border-gov-navy text-gov-navy'
                          : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      Login (Existing Citizen)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signup');
                        setErrorMsg('');
                      }}
                      className={`flex-1 pb-2 font-bold text-center border-b-2 transition-all ${
                        authMode === 'signup'
                          ? 'border-gov-navy text-gov-navy'
                          : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      Sign Up (New Account)
                    </button>
                  </div>

                  <form onSubmit={handleCitizenSubmit} className="space-y-3 text-xs">
                    {authMode === 'signup' && (
                      <>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Ramesh Dnyandev Patil"
                              value={signupName}
                              onChange={(e) => setSignupName(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-navy"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                            <input
                              type="tel"
                              placeholder="+91 98000 00000"
                              value={signupPhone}
                              onChange={(e) => setSignupPhone(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-navy"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="email"
                          required
                          placeholder="name@example.in"
                          value={authMode === 'signup' ? signupEmail : citizenEmail}
                          onChange={(e) =>
                            authMode === 'signup' ? setSignupEmail(e.target.value) : setCitizenEmail(e.target.value)
                          }
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-navy"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Password *</label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="password"
                          required
                          placeholder="Enter password"
                          value={authMode === 'signup' ? signupPassword : citizenPassword}
                          onChange={(e) =>
                            authMode === 'signup' ? setSignupPassword(e.target.value) : setCitizenPassword(e.target.value)
                          }
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-navy"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full mt-2 text-xs"
                      loading={loading}
                    >
                      {authMode === 'signup' ? 'Create Citizen Account' : 'Login to My Dashboard'}
                    </Button>
                  </form>

                  {/* 1-Click Demo Citizen Pill */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      1-Click Test Demo Logins:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => selectDemoAccount('citizen-a')}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all"
                      >
                        <span className="font-bold text-slate-800 text-[11px] block">Citizen A (Ramesh)</span>
                        <span className="text-[10px] text-slate-500">Owns Plot 45/1A</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => selectDemoAccount('citizen-b')}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all"
                      >
                        <span className="font-bold text-slate-800 text-[11px] block">Citizen B (Sunita)</span>
                        <span className="text-[10px] text-slate-500">Owns Plot 45/1B</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ADMIN TAB */}
              {userRole === 'admin' && (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <Shield className="w-4 h-4 text-gov-amber-dark flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Official Administration Console</span>
                      <span className="text-[11px] text-amber-800">
                        Reserved for Sub-Divisional Officers (SDO), Tehsildars, and Revenue Officials.
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleAdminSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Official Username *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="text"
                          required
                          placeholder="admin"
                          value={adminUsername}
                          onChange={(e) => setAdminUsername(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-navy"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Password *</label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="password"
                          required
                          placeholder="admin123"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-navy"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full mt-2 text-xs"
                      loading={loading}
                    >
                      Authenticate as Officer
                    </Button>
                  </form>

                  {/* 1-Click Demo Admin Pill */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => selectDemoAccount('admin')}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-800 text-xs block">SDO / Prant Officer</span>
                        <span className="text-[10px] text-slate-500 font-mono">admin / admin123</span>
                      </div>
                      <span className="text-[10px] bg-gov-navy text-white px-2 py-0.5 rounded font-medium">
                        Instant Fill & Login
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-8 text-center text-xs text-slate-500 space-y-1">
        <p className="font-medium text-slate-700">
          GeoBharat &mdash; Pan-Indian Digital Cadastral Normalization Engine
        </p>
        <p className="text-[11px] text-slate-400">
          Empowering citizens with transparent land records under Digital India Land Records Modernization Programme (DILRMP).
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
