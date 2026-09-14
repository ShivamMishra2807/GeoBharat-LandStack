import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAppStore from '../../../store';
import { authApi } from '../../../api/authApi';
import { FileCheck, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import Button from '../../../components/ui/Button';

export const ServiceRequestForm = ({ onSubmitted }) => {
  const [searchParams] = useSearchParams();
  const urlUlpin = searchParams.get('ulpin');
  const { selectedUlpin, user } = useAppStore();

  const [formData, setFormData] = useState({
    ulpin: urlUlpin || selectedUlpin || user?.ulpin_associated || '27250010045001',
    service_type: 'Mutation Application (Varas/Succession)',
    applicant_name: user?.name || 'Ramesh Dnyandev Patil',
    applicant_phone: user?.phone || '+91 98220 44102',
    applicant_email: user?.email || 'ramesh.patil@example.in',
    remarks: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (urlUlpin) {
      setFormData((prev) => ({ ...prev, ulpin: urlUlpin }));
    }
  }, [urlUlpin]);

  const serviceOptions = [
    'Mutation Application (Varas/Succession)',
    'Mutation Application (Registered Sale Deed)',
    'Digitally Signed 7/12 & 8A / Khatauni Extract',
    'Cadastral Boundary Demarcation (Mojani/Tatima)',
    'Non-Agricultural (NA) Land Conversion NOC',
    'Encumbrance Certificate (Form 15 Search)',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ulpin) {
      setErrorMsg('Please enter a valid 14-digit ULPIN.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await authApi.createCitizenRequest(formData);
      setSuccessMsg(`Service request ${res.id} submitted successfully! Assigned to revenue desk.`);
      if (onSubmitted) onSubmitted(res);
      setFormData((prev) => ({ ...prev, remarks: '' }));
    } catch (err) {
      setErrorMsg('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
        <div className="w-9 h-9 rounded-lg bg-gov-navy/10 text-gov-navy flex items-center justify-center">
          <FileCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Apply for Land Administration Service
          </h3>
          <p className="text-xs text-slate-500">
            Submit mutation petitions, digitally certified extracts, and survey demarcation requests
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
        {/* ULPIN field */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Land Parcel ULPIN (Bhu-Aadhaar) *
          </label>
          <input
            type="text"
            required
            value={formData.ulpin}
            onChange={(e) => setFormData({ ...formData, ulpin: e.target.value })}
            placeholder="14-digit ULPIN e.g. 27250010045001"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy transition-all"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            The unique 14-character alphanumeric identifier printed on cadastral map and property card.
          </span>
        </div>

        {/* Service Type */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Service Requested *
          </label>
          <select
            value={formData.service_type}
            onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy transition-all"
          >
            {serviceOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Applicant Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Applicant Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.applicant_name}
              onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy transition-all"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Contact Mobile (+91) *
            </label>
            <input
              type="tel"
              required
              value={formData.applicant_phone}
              onChange={(e) => setFormData({ ...formData, applicant_phone: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy transition-all"
            />
          </div>
        </div>

        {/* Remarks / Supporting Info */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Application Narrative / Case Reference Notes
          </label>
          <textarea
            rows={3}
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            placeholder="Specify reason, deed registration number, or heirship details..."
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy transition-all"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          icon={Send}
          className="w-full"
        >
          Submit Application to Revenue Desk
        </Button>
      </form>
    </div>
  );
};

export default ServiceRequestForm;
