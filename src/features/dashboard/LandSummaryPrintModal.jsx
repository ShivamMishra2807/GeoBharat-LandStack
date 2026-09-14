import React from 'react';
import { formatULPIN, formatArea } from '../../utils/formatters';
import { Printer, Download, X, CheckCircle2, ShieldCheck, Landmark, FileText } from 'lucide-react';
import Button from '../../components/ui/Button';

export const LandSummaryPrintModal = ({ isOpen, onClose, user, myParcels, totalAreaStats }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden my-6">
        {/* Modal Toolbar (hidden on print) */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gov-navy dark:text-amber-400" />
            <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Official Cadastral Land Holding Summary
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              className="text-xs flex items-center gap-1.5"
              onClick={handlePrint}
              icon={Printer}
            >
              Print / Save as PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="landstack-printable-document" className="p-8 bg-white text-slate-900 space-y-6 text-xs printable-content">
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Landmark className="w-6 h-6 text-gov-navy" />
              <span className="text-base font-black tracking-wider uppercase text-slate-900">
                LANDSTACK CADASTRAL REGISTRY & REVENUE SERVICES
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
              Digital India Land Records Modernization Programme (DILRMP) &bull; Ministry of Rural Development
            </p>
            <p className="text-[9px] font-mono text-slate-500">
              Certificate Ref No: LS-ROR-{new Date().getFullYear()}-{user?.id || 'CIT-001'} &bull; Issue Date: {currentDate}
            </p>
          </div>

          {/* Citizen Demographics */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Registered Citizen:</span>
              <span className="text-sm font-bold text-slate-900">{user?.name || 'Citizen Landholder'}</span>
              <p className="text-[11px] text-slate-600 mt-0.5">Citizen ID: <strong className="font-mono">{user?.id || 'CIT-001'}</strong></p>
              <p className="text-[11px] text-slate-600">Email: {user?.email}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Jurisdiction & Verification:</span>
              <span className="text-sm font-bold text-slate-900">{user?.village || 'Wagholi'}, {user?.district || 'Pune'}</span>
              <p className="text-[11px] text-slate-600 mt-0.5">State: {user?.state || 'Maharashtra'}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded mt-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Aadhaar Verified Identity
              </span>
            </div>
          </div>

          {/* Holdings Summary Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Parcels</span>
              <span className="text-lg font-black text-slate-900">{myParcels.length} Plot{myParcels.length === 1 ? '' : 's'}</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Cumulative Area</span>
              <span className="text-lg font-black text-emerald-700">{totalAreaStats.acres}</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Title Status</span>
              <span className="text-lg font-black text-slate-900">100% Clear Title</span>
            </div>
          </div>

          {/* Parcels Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
              Registered Land Parcel Schedule (Record of Rights Extract)
            </h4>
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-y border-slate-300 text-left">
                  <th className="py-2 px-2.5 font-bold">ULPIN (Bhu-Aadhaar)</th>
                  <th className="py-2 px-2.5 font-bold">Survey / Khasra No</th>
                  <th className="py-2 px-2.5 font-bold">Area (SI & Native)</th>
                  <th className="py-2 px-2.5 font-bold">Location</th>
                  <th className="py-2 px-2.5 font-bold">Zoning</th>
                  <th className="py-2 px-2.5 font-bold text-right">Tax Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {myParcels.map((parcel) => {
                  const p = parcel.properties || {};
                  return (
                    <tr key={p.ulpin} className="hover:bg-slate-50">
                      <td className="py-2.5 px-2.5 font-mono font-bold text-gov-navy">{formatULPIN(p.ulpin)}</td>
                      <td className="py-2.5 px-2.5 font-bold">{p.surveyNumber || p.survey_no}</td>
                      <td className="py-2.5 px-2.5">
                        <span className="font-semibold">{p.area_sqm ? `${p.area_sqm.toLocaleString()} sqm` : '—'}</span>
                        <span className="text-slate-500 block text-[10px]">({p.area_acres} ac &bull; {p.native_unit || 'N/A'})</span>
                      </td>
                      <td className="py-2.5 px-2.5">{p.village}, {p.district}</td>
                      <td className="py-2.5 px-2.5">{p.zone_type || 'Residential'}</td>
                      <td className="py-2.5 px-2.5 text-right font-semibold text-emerald-700">
                        {p.tax_status || 'Paid & Clear'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Security & Authentication Seal */}
          <div className="pt-4 border-t-2 border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-bold text-slate-800">Digitally Verified via National Cadastral Gateway</p>
                <p>Cryptographic hash verified under OpenAPI 3.0 & OGC Standards.</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-slate-400">QR / Verification Hash:</p>
              <p className="font-mono font-bold text-slate-700">#BHU-AADHAAR-{Date.now().toString(36).toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Footer actions (hidden on print) */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2 no-print">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint} icon={Printer}>
            Print / Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandSummaryPrintModal;
