import React from 'react';
import { formatULPIN, formatArea, formatINR, formatDate, getStatusBadgeColor } from '../../../utils/formatters';
import { Landmark, Printer, Download, ShieldCheck, CheckCircle2, QrCode, FileText, Scale, Zap, Droplets, Building2 } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';

export const LandPassportModal = ({ isOpen, onClose, feature }) => {
  if (!feature) return null;
  const p = feature.properties || {};
  const area = formatArea(p.area_sqm);
  const u = p.utilities || {};
  const val = p.valuation || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="National Land Passport (Bhu-Aadhaar)"
      subtitle="Single-Window Unified Digital Land Certification"
      maxWidth="max-w-3xl"
    >
      <div id="land-passport-document" className="space-y-6 text-xs text-slate-800 font-sans p-1">
        {/* Official Passport Header */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-gov-navy via-gov-navy-light to-gov-navy text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
              <Landmark className="w-7 h-7 text-gov-amber-light" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-300 block">
                Government of India • Ministry of Rural Development & Land Records
              </span>
              <h2 className="text-lg font-extrabold tracking-tight text-white mt-0.5">
                DIGITAL LAND PASSPORT (BHU-AADHAAR)
              </h2>
              <p className="text-[10px] text-amber-200 font-mono">
                ULPIN: {formatULPIN(p.ulpin)} • WGS84 Georeferenced
              </p>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-center bg-white p-2 rounded-xl text-slate-900 shadow-sm">
            <div className="w-14 h-14 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <QrCode className="w-10 h-10 text-white" />
            </div>
            <span className="text-[9px] font-mono font-bold mt-1">VERIFIED</span>
          </div>
        </div>

        {/* Section 1: Cadastral Identification & State Normalization */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-800 text-xs pb-1.5 border-b border-slate-200">
            <span className="flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-gov-navy" />
              1. Spatial Demarcation & Unified Measurements
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusBadgeColor(p.status)}`}>
              {p.status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div>
              <span className="text-[10px] text-slate-400 block">Survey / Khasra No:</span>
              <span className="font-bold text-slate-900">{p.survey_no}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Village & Taluka:</span>
              <span className="font-semibold text-slate-800">{p.village}, {p.taluka}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">District & State:</span>
              <span className="font-semibold text-slate-800">{p.district} ({p.state})</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Regional Record Type:</span>
              <span className="font-bold text-blue-700">{p.record_type}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-gov-amber-dark font-bold uppercase tracking-wider block">
                Native Land Measure:
              </span>
              <span className="text-sm font-extrabold text-slate-800">{p.native_unit || 'Standard'}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
                Standard SI Normalized Area:
              </span>
              <span className="text-sm font-extrabold text-emerald-700">{area.sqm} ({area.acres})</span>
            </div>
          </div>
        </div>

        {/* Section 2: Ownership & Title Authority */}
        <div className="p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-800 text-xs pb-1.5 border-b border-slate-100">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-gov-navy" />
              2. Title Ownership & Encumbrance Status
            </span>
            <span className="text-[10px] text-slate-500 font-mono">AI Health: {p.health_score || 90}/100</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div>
              <span className="text-[10px] text-slate-400 block">Primary Title Holder:</span>
              <span className="font-bold text-slate-900 text-sm">{p.owner_name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Title Encumbrance / Charge:</span>
              <span className="font-semibold text-purple-800">{p.encumbrance_status}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Litigation / Dispute State:</span>
              <span className="font-semibold text-rose-800">{p.dispute_status}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Master Plan Zoning & Building Permissions */}
        <div className="p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-800 text-xs pb-1.5 border-b border-slate-100">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-gov-navy" />
              3. Master Plan Zoning & Development Norms
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div>
              <span className="text-[10px] text-slate-400 block">Master Plan Zone:</span>
              <span className="font-bold text-slate-900">{p.zone_type}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Govt Circle Rate (per sqm):</span>
              <span className="font-bold text-slate-800">{formatINR(val.circle_rate_per_sqm)}/sq.m</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Total Assessed Value:</span>
              <span className="font-bold text-gov-emerald">{formatINR(val.total_valuation_inr)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Property Tax Status:</span>
              <span className={`font-bold ${p.tax_status === 'Paid' ? 'text-emerald-700' : 'text-rose-600'}`}>
                {p.tax_status}
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Use-Case Layer — Utility Grid Connectivity */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
          <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5 pb-1.5 border-b border-slate-200">
            <Zap className="w-4 h-4 text-gov-amber-dark" />
            4. Utility Infrastructure & Municipal Grid Connectivity
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${u.water_connection ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <div>
                <span className="font-medium text-slate-800 block">Water Trunk Line</span>
                <span className="text-[10px] text-slate-500">{u.water_connection ? `${u.water_pipe_dia_mm}mm Connection` : 'No Connection'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${u.electricity_load_kw > 0 ? 'bg-amber-500' : 'bg-slate-300'}`} />
              <div>
                <span className="font-medium text-slate-800 block">Electrical Grid</span>
                <span className="text-[10px] text-slate-500">{u.electricity_load_kw} kW Connected Load</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${u.sewage_connected ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <div>
                <span className="font-medium text-slate-800 block">Municipal Drainage</span>
                <span className="text-[10px] text-slate-500">{u.sewage_connected ? 'Connected' : 'Septic Tank'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${u.telecom_fiber ? 'bg-blue-500' : 'bg-slate-300'}`} />
              <div>
                <span className="font-medium text-slate-800 block">High-Speed Fiber</span>
                <span className="text-[10px] text-slate-500">{u.telecom_fiber ? 'Active BharatNet' : 'Unavailable'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Digital Signature Audit Stamp */}
        <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-[11px] text-slate-500">
          <div>
            <span>Digital Document ID: <strong>IN-PASSPORT-{p.ulpin}</strong></span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              Certified under National Land Records Modernization Programme (NLRMP) • Section 4 e-Governance Act
            </span>
          </div>
          <span className="font-mono text-gov-navy font-bold">{new Date().toISOString().split('T')[0]}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="md" onClick={handlePrint} icon={Printer}>
            Print / Save Official PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LandPassportModal;
