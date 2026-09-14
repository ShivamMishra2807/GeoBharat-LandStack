import React, { useState } from 'react';
import { authApi } from '../../../api/authApi';
import { formatULPIN, formatDate, formatINR } from '../../../utils/formatters';
import { Shield, CheckCircle2, XCircle, FileText, AlertTriangle, Stamp, FileSignature } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';

export const ApprovalWorkflow = ({ item, isOpen, onClose, onActionCompleted }) => {
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!item) return null;

  const handleAction = async (actionType) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await authApi.takeOfficialAction(item.id, {
        action: actionType,
        remarks: remarks || (actionType === 'approve' ? 'Sanctioned under statutory powers.' : 'Rejected due to title discrepancies.'),
      });
      if (onActionCompleted) onActionCompleted();
      onClose();
    } catch (err) {
      setErrorMsg('Failed to record official action. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Revenue Official Scrutiny & Order"
      subtitle={`Application: ${item.id} • ${item.service_type}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Parcel & Applicant Header */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-400 block text-[11px]">Subject ULPIN:</span>
              <span className="font-mono font-bold text-gov-navy text-xs">{formatULPIN(item.ulpin)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Location / Survey:</span>
              <span className="font-semibold text-slate-800">S.No {item.survey_no} ({item.village})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Applicant Name:</span>
              <span className="font-semibold text-slate-800">{item.applicant_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Deed / Reference No:</span>
              <span className="font-mono font-semibold text-slate-800">{item.deed_number || '—'}</span>
            </div>
          </div>
        </div>

        {/* Attached Verification Documents */}
        <div className="space-y-2">
          <span className="font-semibold text-slate-700 block">Scrutiny Dossier Documents:</span>
          <div className="grid grid-cols-2 gap-2">
            {item.documents?.map((doc, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-2 text-slate-700"
              >
                <FileText className="w-3.5 h-3.5 text-gov-navy flex-shrink-0" />
                <span className="truncate">{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Field Notes & Verification Audit */}
        <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 text-gov-amber-dark" />
            <span>Field Officer Memo / Verification Check</span>
          </div>
          <p className="text-[11px] text-slate-700 leading-relaxed">{item.notes}</p>
        </div>

        {/* Official Decision Note */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Officer Order / Reason for Decision:
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter reason for certification or specific defects observed..."
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            size="md"
            onClick={() => handleAction('reject')}
            loading={loading}
            icon={XCircle}
          >
            Reject / Query Back
          </Button>

          <Button
            variant="success"
            size="md"
            onClick={() => handleAction('approve')}
            loading={loading}
            icon={FileSignature}
          >
            Approve & Digital Sign
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ApprovalWorkflow;
