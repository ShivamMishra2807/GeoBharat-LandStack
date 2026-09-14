import React, { useState } from 'react';
import useAppStore from '../../../store';
import { formatULPIN, formatArea, getStatusBadgeColor } from '../../../utils/formatters';
import {
  X,
  FileText,
  FileBadge2,
  Building2,
  IndianRupee,
  MapPin,
  ExternalLink,
  Scale,
  Sparkles,
  Activity,
  Satellite,
  Shield,
  ShieldCheck,
  BookOpen,
  Zap,
  User,
  CheckCircle2,
} from 'lucide-react';
import Tabs from '../../../components/ui/Tabs';
import RoRCard from './RoRCard';
import RegistrationCard from './RegistrationCard';
import PlanningCard from './PlanningCard';
import TaxationCard from './TaxationCard';
import LandHealthScore from './LandHealthScore';
import SatelliteChangeDetection from './SatelliteChangeDetection';
import LandPassportModal from './LandPassportModal';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hooks/useAuth';

export const ParcelDetailPanel = () => {
  const { selectedUlpin, selectedFeature, closeDetailPanel, isDetailOpen } = useAppStore();
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState('ror');
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const navigate = useNavigate();

  if (!isDetailOpen || !selectedUlpin) {
    return null;
  }

  const p = selectedFeature?.properties || {};
  const area = formatArea(p.area_sqm);
  const u = p.utilities || {};

  // Privacy rule: Owner or Administrator gets full dossier; others see public summary
  const isOwner = user && String(p.ownerId) === String(user.id);
  const isAdmin = user && (role === 'admin' || role === 'official');
  const hasFullAccess = isOwner || isAdmin;

  const tabs = [
    { id: 'ror', label: 'Record of Rights', icon: FileText, badge: 'Essential' },
    { id: 'registration', label: 'Registration & EC', icon: FileBadge2, badge: 'Essential' },
    { id: 'planning', label: 'Master Plan & FSI', icon: Building2, badge: 'Essential' },
    { id: 'taxation', label: 'Utilities & Taxes', icon: IndianRupee, badge: 'Use-Case' },
    { id: 'ai_insights', label: 'AI Risk & Satellite', icon: Sparkles, badge: 'AI/ML' },
  ];

  return (
    <>
      <aside className="w-full sm:w-[480px] lg:w-[500px] h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col z-30 animate-slideLeft transition-all text-slate-900">
        {/* Drawer Header - Clean Crisp Light White */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Bhu-Aadhaar (ULPIN)
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadgeColor(p.status)}`}>
                  {p.status || 'Active'}
                </span>
                {hasFullAccess ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    {isAdmin ? 'Official Access' : '★ My Verified Plot'}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-300">
                    Public Cadastral View
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-gov-navy font-mono tracking-tight mt-1">
                {formatULPIN(selectedUlpin)}
              </h3>
            </div>

            <button
              onClick={closeDetailPanel}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Location & Title Summary */}
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate font-medium">
              Survey/Khasra {p.survey_no || '—'} • {p.village}, {p.district} ({p.state})
            </span>
          </div>

          {/* Pan-Indian Measurement Normalization Bar */}
          <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-gov-amber-dark" />
                Standard SI Normalized Area:
              </span>
              <span className="font-bold text-slate-900">{area.sqm}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
              <span>Equivalent: <strong className="text-slate-800">{area.acres}</strong></span>
              {p.native_unit && (
                <span className="text-gov-amber-dark font-semibold">
                  Native: {p.native_unit}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Body: Full Tabs for Owner/Admin, Sanitized Public Card for Non-Owner */}
        {hasFullAccess ? (
          <>
            {/* Tabs Bar */}
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {/* Card Content Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeTab === 'ror' && <RoRCard ulpin={selectedUlpin} />}
              {activeTab === 'registration' && <RegistrationCard ulpin={selectedUlpin} />}
              {activeTab === 'planning' && <PlanningCard ulpin={selectedUlpin} />}
              {activeTab === 'taxation' && (
                <div className="space-y-4">
                  {/* Utility Infrastructure Card for Use-Case Layer */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 font-semibold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-gov-amber-dark" />
                        Municipal Utilities Connectivity
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        Use-Case Layer
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Water Supply Line:</span>
                        <span className="font-bold text-slate-800">
                          {u.water_connection ? `Connected (${u.water_pipe_dia_mm}mm)` : 'Not Connected'}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Power Load Grid:</span>
                        <span className="font-bold text-slate-800">
                          {u.electricity_load_kw > 0 ? `${u.electricity_load_kw} kW 3-Phase` : 'Off-grid'}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Drainage / Sewer:</span>
                        <span className="font-bold text-slate-800">
                          {u.sewage_connected ? 'Underground Main' : 'Septic / None'}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Broadband Fiber:</span>
                        <span className="font-bold text-slate-800">
                          {u.telecom_fiber ? 'BharatNet High-Speed' : 'Copper / RF'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Property Taxation Card */}
                  <TaxationCard ulpin={selectedUlpin} />
                </div>
              )}
              {activeTab === 'ai_insights' && (
                <div className="space-y-4">
                  <LandHealthScore feature={selectedFeature} />
                  <SatelliteChangeDetection feature={selectedFeature} />
                </div>
              )}
            </div>

            {/* Drawer Footer CTA */}
            <div className="p-3.5 border-t border-slate-200 bg-white flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setIsPassportOpen(true)}
                icon={BookOpen}
              >
                Digital Land Passport
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="text-xs"
                onClick={() => navigate(`/portal?ulpin=${selectedUlpin}`)}
                icon={ExternalLink}
              >
                Citizen Service
              </Button>
            </div>
          </>
        ) : (
          /* Sanitized Public Information View for Non-Owners */
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {/* Privacy Notification Banner */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5 shadow-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <Shield className="w-4 h-4 text-gov-amber-dark flex-shrink-0" />
                <span>Cadastral Public Registry Notice</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Public cadastral boundaries, verified landholder name, and municipal property tax status are accessible for verification. Highly confidential items (including verified Aadhaar, personal phone number, bank loan liens, and sale deed scan attachments) remain private under DPDP Act.
              </p>
            </div>

            {/* Public Parcel Overview Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-gov-navy" />
                  Public Land Registry Metadata
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified Record
                </span>
              </h4>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                {/* 1. Owner Name Section (Explicitly requested by user) */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 col-span-2">
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase tracking-wider">
                    Registered Landholder / Owner Name:
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <User className="w-4 h-4 text-gov-navy flex-shrink-0" />
                      {p.owner_name || 'Registered Citizen'}
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                      Revenue Registry Matched
                    </span>
                  </div>
                </div>

                {/* 2. Municipal Property Tax (Explicitly requested by user) */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] block">Property Tax Status:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {p.tax_status || 'Paid & Clear'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] block">Annual Assessment Demand:</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">
                    {p.tax_annual ? `₹ ${Number(p.tax_annual).toLocaleString()}` : (p.ulpin === '27250010045002' ? '₹ 68,400 / yr' : '₹ 14,200 / yr')}
                  </span>
                </div>

                {/* Cadastral Details */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] block">Survey / Khasra No:</span>
                  <span className="font-bold text-slate-800">{p.surveyNumber || p.survey_no || '—'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] block">Title Clearance Status:</span>
                  <span className="font-semibold text-emerald-700">{p.status || 'Active'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] block">Administrative State:</span>
                  <span className="font-medium text-slate-700">{p.state || 'India'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] block">Revenue District:</span>
                  <span className="font-medium text-slate-700">{p.district || '—'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] block">Taluka / Tehsil:</span>
                  <span className="font-medium text-slate-700">{p.taluka || '—'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] block">Cadastral Village:</span>
                  <span className="font-medium text-slate-700">{p.village || '—'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 col-span-2">
                  <span className="text-slate-400 text-[10px] block">Master Plan Zone Classification:</span>
                  <span className="font-semibold text-slate-800">{p.zone_type || 'General Cadastral'}</span>
                </div>
              </div>
            </div>

            {/* Ownership Privacy Indicator Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Confidential Deeds & Vault:</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">Protected</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {user
                  ? `You are viewing public registry records. Full certified copies (Sale Deeds, 7/12 extract downloads, and mortgage ledgers) require owner authorization.`
                  : `Sign in with your citizen account or administrator credentials to view complete authorized records.`}
              </p>
              {!user && (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full mt-1 text-xs"
                  onClick={() => navigate('/login')}
                >
                  Sign In to GeoBharat
                </Button>
              )}
            </div>

            {/* Public Service Extract CTA */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate(`/portal?ulpin=${selectedUlpin}`)}
                icon={ExternalLink}
              >
                Apply for Certified Public Extract
              </Button>
            </div>
          </div>
        )}
      </aside>

      {/* Land Passport Modal */}
      <LandPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        feature={selectedFeature}
      />
    </>
  );
};

export default ParcelDetailPanel;
