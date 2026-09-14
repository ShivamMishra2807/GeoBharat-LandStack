import React, { useEffect, useState } from 'react';
import { registrationApi } from '../../../api/registrationApi';
import { formatINR, formatDate, getStatusBadgeColor } from '../../../utils/formatters';
import { FileBadge2, Landmark, AlertTriangle, ShieldCheck, CheckCircle2, Loader2, Calendar } from 'lucide-react';
import Badge from '../../../components/ui/Badge';

export const RegistrationCard = ({ ulpin }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchReg = async () => {
      if (!ulpin) return;
      try {
        setLoading(true);
        setError(null);
        const res = await registrationApi.getRegistrationByUlpin(ulpin);
        if (isMounted) setData(res);
      } catch (err) {
        if (isMounted) {
          setData(null);
          setError('No registration record found for this parcel.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReg();
    return () => {
      isMounted = false;
    };
  }, [ulpin]);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-gov-navy mb-2" />
        <span className="text-xs">Fetching Registration & Encumbrance Record...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200">
        <FileBadge2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-700">Deed Record Not Available</p>
        <p className="text-[11px] text-slate-400 mt-1">{error || 'No registered deed matching ULPIN in SRO database.'}</p>
      </div>
    );
  }

  const hasEncumbrance = data.encumbrances && data.encumbrances.length > 0;

  return (
    <div className="space-y-4">
      {/* Sub-Registrar Office & Deed Identification */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Sub-Registrar Record (SRO)
          </span>
          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            {formatDate(data.registration_date)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-gov-navy font-mono">{data.deed_number}</h4>
            <p className="text-[11px] text-slate-600 mt-0.5">{data.document_type}</p>
          </div>
          <Badge variant="navy" size="sm">
            {data.sub_registrar_office}
          </Badge>
        </div>
      </div>

      {/* Financial Valuation & Stamp Duty Breakdown */}
      <div className="p-3.5 rounded-xl border border-slate-200 space-y-2.5">
        <span className="text-xs font-semibold text-slate-800 block">Valuation & Revenue Duty</span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-slate-50 rounded-lg">
            <span className="text-[10px] text-slate-400 block">Govt Ready Reckoner Value:</span>
            <span className="font-bold text-slate-800">{formatINR(data.market_value_inr)}</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg">
            <span className="text-[10px] text-slate-400 block">Consideration Amount:</span>
            <span className="font-bold text-slate-800">{formatINR(data.consideration_amount_inr)}</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg">
            <span className="text-[10px] text-slate-400 block">Stamp Duty Paid:</span>
            <span className="font-bold text-gov-emerald">{formatINR(data.stamp_duty_paid_inr)}</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg">
            <span className="text-[10px] text-slate-400 block">Registration Fee:</span>
            <span className="font-bold text-slate-800">{formatINR(data.registration_fee_inr)}</span>
          </div>
        </div>
      </div>

      {/* Encumbrance Certificate Status (Nil vs Liens) */}
      <div className="p-3.5 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
            {hasEncumbrance ? (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            )}
            <span>Encumbrance (EC) Status</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusBadgeColor(data.non_encumbrance_status)}`}>
            {data.non_encumbrance_status}
          </span>
        </div>

        {hasEncumbrance ? (
          <div className="space-y-2">
            {data.encumbrances.map((enc) => (
              <div
                key={enc.id}
                className="p-3 rounded-lg border border-purple-200 bg-purple-50/40 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-purple-900 flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-purple-700" />
                    {enc.financial_institution}
                  </span>
                  <span className="text-[10px] text-purple-700 font-mono px-1.5 py-0.5 bg-purple-100 rounded-sm">
                    {enc.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  <span>Mortgage Type: <strong>{enc.type}</strong></span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-700 pt-1 border-t border-purple-200/50">
                  <span>Charge Amount: <strong className="text-gov-navy">{formatINR(enc.amount_inr)}</strong></span>
                  <span className="text-[10px] text-slate-500">Ref: {enc.account_or_ref}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-semibold">Nil Encumbrance Certificate (Form 15)</p>
              <p className="text-[10px] text-emerald-600 mt-0.5">
                No active mortgage, attachment, or bank hypothecation detected. Valid till {formatDate(data.ec_valid_till)}.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationCard;
