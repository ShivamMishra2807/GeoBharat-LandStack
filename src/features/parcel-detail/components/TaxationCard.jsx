import React, { useEffect, useState } from 'react';
import { taxationApi } from '../../../api/taxationApi';
import { formatINR, formatDate, getStatusBadgeColor } from '../../../utils/formatters';
import { IndianRupee, Receipt, CreditCard, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Button from '../../../components/ui/Button';

export const TaxationCard = ({ ulpin }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTax = async () => {
      if (!ulpin) return;
      try {
        setLoading(true);
        setError(null);
        setPaySuccess(false);
        const res = await taxationApi.getTaxationByUlpin(ulpin);
        if (isMounted) setData(res);
      } catch (err) {
        if (isMounted) {
          setData(null);
          setError('No property tax assessment record found.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTax();
    return () => {
      isMounted = false;
    };
  }, [ulpin]);

  const handlePayTax = async () => {
    if (!ulpin) return;
    setPaying(true);
    try {
      const updated = await taxationApi.payTax(ulpin, { amount: data.tax_due_inr });
      setData(updated);
      setPaySuccess(true);
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-gov-navy mb-2" />
        <span className="text-xs">Fetching Municipal Taxation Record...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200">
        <IndianRupee className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-700">Tax Data Not Available</p>
        <p className="text-[11px] text-slate-400 mt-1">{error || 'No property tax record found for this parcel.'}</p>
      </div>
    );
  }

  const isDue = (data.tax_due_inr || 0) > 0;

  return (
    <div className="space-y-4">
      {/* Local Body & Assessment Header */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Property Tax Assessment
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadgeColor(data.payment_status)}`}>
            {data.payment_status}
          </span>
        </div>

        <div>
          <h4 className="text-xs font-bold text-gov-navy font-mono">{data.property_tax_id}</h4>
          <p className="text-[11px] text-slate-600 mt-0.5">{data.local_body}</p>
        </div>
        <div className="text-[10px] text-slate-400">{data.rate_zone}</div>
      </div>

      {/* Demand & Dues Card */}
      <div className={`p-4 rounded-xl border ${isDue ? 'border-rose-200 bg-rose-50/40' : 'border-emerald-200 bg-emerald-50/30'} space-y-3`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
              Current Tax Due
            </span>
            <span className={`text-2xl font-bold tracking-tight ${isDue ? 'text-rose-600' : 'text-emerald-700'}`}>
              {formatINR(data.tax_due_inr)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Annual Assessment:</span>
            <span className="text-xs font-semibold text-slate-700">{formatINR(data.annual_demand_inr)}</span>
          </div>
        </div>

        {paySuccess && (
          <div className="p-2.5 bg-emerald-100/80 border border-emerald-300 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Tax cleared successfully! Digital receipt generated.</span>
          </div>
        )}

        {isDue && !paySuccess && (
          <Button
            size="sm"
            variant="success"
            className="w-full text-xs font-semibold py-2"
            onClick={handlePayTax}
            loading={paying}
            icon={CreditCard}
          >
            Pay Tax Online (₹ {data.tax_due_inr?.toLocaleString()})
          </Button>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60">
          <div>
            <span className="text-[10px] text-slate-400 block">Assessed Capital Value:</span>
            <span className="font-semibold text-slate-800">{formatINR(data.assessed_value_inr)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Last Paid Date:</span>
            <span className="font-semibold text-slate-800">{formatDate(data.last_paid_date)}</span>
          </div>
        </div>
      </div>

      {/* Payment History & Receipts */}
      <div className="p-3.5 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
          <div className="flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-gov-navy" />
            <span>Receipts & Payment History</span>
          </div>
          <span className="text-[10px] text-slate-400">
            {data.payment_history?.length || 0} Records
          </span>
        </div>

        <div className="space-y-2">
          {data.payment_history?.map((rec, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-slate-800 block">FY {rec.financial_year}</span>
                <span className="text-[10px] text-slate-400 font-mono">{rec.receipt_no}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{rec.mode}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-gov-emerald block">{formatINR(rec.paid_inr)}</span>
                <span className="text-[10px] text-slate-400">{formatDate(rec.paid_date)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaxationCard;
