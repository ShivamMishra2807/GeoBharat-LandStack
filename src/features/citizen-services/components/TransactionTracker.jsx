import React, { useEffect, useState } from 'react';
import { authApi } from '../../../api/authApi';
import { formatULPIN, formatDate, getStatusBadgeColor } from '../../../utils/formatters';
import { History, CheckCircle2, Clock, ArrowRight, User, Shield, RefreshCw } from 'lucide-react';
import Badge from '../../../components/ui/Badge';

export const TransactionTracker = ({ refreshTrigger }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await authApi.getCitizenRequests();
      setRequests(res || []);
    } catch (err) {
      console.error('Failed to fetch citizen requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [refreshTrigger]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gov-navy/10 text-gov-navy flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Application Status Tracker
            </h3>
            <p className="text-xs text-slate-500">
              Real-time audit trail and stage progression for submitted land petitions
            </p>
          </div>
        </div>

        <button
          onClick={fetchRequests}
          disabled={loading}
          className="p-1.5 rounded-lg text-slate-500 hover:text-gov-navy hover:bg-slate-100 transition-colors"
          title="Refresh Applications"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading submitted applications...</div>
      ) : requests.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400">No applications on record yet.</div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-3 transition-all hover:bg-slate-50"
            >
              {/* Card Top */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-gov-navy">{req.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusBadgeColor(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 mt-1">{req.service_type}</h4>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Submitted On:</span>
                  <span className="text-xs font-medium text-slate-700">{formatDate(req.submission_date)}</span>
                </div>
              </div>

              {/* ULPIN & Official Assigner Bar */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/70">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-[11px]">Target ULPIN:</span>
                  <span className="font-mono font-semibold text-slate-800">{formatULPIN(req.ulpin)}</span>
                </div>
                {req.assigned_official && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Shield className="w-3 h-3 text-gov-navy" />
                    <span>Desk: <strong>{req.assigned_official}</strong></span>
                  </div>
                )}
              </div>

              {/* Stages Visual Stepper */}
              {req.stages && req.stages.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Workflow Stages
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {req.stages.map((stg, sIdx) => {
                      const isComplete = stg.completed;
                      const isCurrent = stg.current;
                      return (
                        <div
                          key={sIdx}
                          className={`p-2 rounded-lg border text-xs ${
                            isComplete
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                              : isCurrent
                              ? 'bg-amber-50/70 border-amber-300 text-amber-900 ring-1 ring-amber-300'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                            {isComplete ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            ) : (
                              <Clock className={`w-3.5 h-3.5 ${isCurrent ? 'text-amber-600' : 'text-slate-300'} flex-shrink-0`} />
                            )}
                            <span className="truncate">{stg.name}</span>
                          </div>
                          <span className="text-[10px] block mt-1 opacity-80">{stg.date}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {req.remarks && !req.remarks.toLowerCase().includes('api connection test') && (
                <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60">
                  Notes: {req.remarks}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionTracker;
