import React, { useEffect, useState } from 'react';
import { ownershipApi } from '../../../api/ownershipApi';
import { formatINR, formatDate, getStatusBadgeColor } from '../../../utils/formatters';
import { FileText, Users, MapPin, Scale, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import Badge from '../../../components/ui/Badge';

export const RoRCard = ({ ulpin }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchRoR = async () => {
      if (!ulpin) return;
      try {
        setLoading(true);
        setError(null);
        const res = await ownershipApi.getRoRByUlpin(ulpin);
        if (isMounted) setData(res);
      } catch (err) {
        if (isMounted) {
          setData(null);
          setError('No Record of Rights found for this parcel.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRoR();
    return () => {
      isMounted = false;
    };
  }, [ulpin]);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-gov-navy mb-2" />
        <span className="text-xs">Fetching Record of Rights...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200">
        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-700">Record Not Available</p>
        <p className="text-[11px] text-slate-400 mt-1">{error || 'No matching cadastral ledger entry found.'}</p>
      </div>
    );
  }

  const mutationList = (data.mutation_history || []).filter(
    (mut) =>
      !mut.remarks?.toLowerCase().includes('sih 2026') &&
      !mut.remarks?.toLowerCase().includes('test new owner') &&
      !mut.type?.toLowerCase().includes('sih 2026')
  );

  return (
    <div className="space-y-4">
      {/* Title & Record Type Header */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">{data.record_type}</span>
          </div>
          <Badge variant="navy" size="sm">
            {data.state}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-slate-200/60 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 block">Khata / Patta No:</span>
            <span className="font-semibold text-slate-800">{data.khata_number}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Survey / Khasra No:</span>
            <span className="font-semibold text-slate-800">{data.survey_number}</span>
          </div>
        </div>
      </div>

      {/* Ownership & Co-owners */}
      <div className="p-3.5 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
          <Users className="w-4 h-4 text-gov-navy" />
          <span>Registered Title Holders</span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">{data.owner_name}</span>
              <span className="text-[11px] text-slate-500">S/o, W/o: {data.father_spouse_name}</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800">
              Primary
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{data.occupant_class}</span>
          </div>
        </div>

        {/* Co-owners share distribution */}
        {data.co_owners && data.co_owners.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-slate-500 block">Shareholding Breakdown:</span>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden text-xs">
              {data.co_owners.map((co, idx) => (
                <div key={idx} className="p-2 flex items-center justify-between bg-white">
                  <span className="text-slate-700 font-medium">{co.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">({co.relation})</span>
                    <span className="font-semibold text-gov-navy">{co.share}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Land Measure & Normalization Block */}
      <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
          <div className="flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-gov-amber-dark" />
            <span>Land Stack Unit Normalization</span>
          </div>
          <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded-xs font-mono">
            Unified
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white p-2.5 rounded-lg border border-amber-200/60">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
              Native Record Unit
            </span>
            <span className="font-bold text-slate-900 block mt-0.5">{data.native_area?.raw}</span>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {data.native_area?.breakdown || data.native_area?.unit}
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-amber-200/60">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
              Standard SI Metric
            </span>
            <span className="font-bold text-gov-emerald block mt-0.5">
              {data.normalized_area?.sqm?.toLocaleString()} sq.m
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block font-medium">
              {data.normalized_area?.acres} Acres ({data.normalized_area?.hectares} Ha)
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-amber-200/60">
          <span>Soil Classification: <strong>{data.soil_type}</strong></span>
          <span>Revenue Assessment: <strong>{formatINR(data.land_revenue_assessment_inr)}</strong></span>
        </div>
      </div>

      {/* Mutation History Ledger */}
      <div className="p-3.5 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gov-navy" />
            <span>Mutation Audit Ledger (Ferfar)</span>
          </div>
          <span className="text-[10px] text-slate-400">
            {mutationList.length} Entries
          </span>
        </div>

        <div className="space-y-2">
          {mutationList.map((mut, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-gov-navy text-[11px]">{mut.mutation_id}</span>
                <span className="text-[10px] text-slate-400">{formatDate(mut.date)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">{mut.type}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${getStatusBadgeColor(mut.status)}`}>
                  {mut.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 italic mt-1 leading-snug">{mut.remarks}</p>
              {mut.officer && (
                <span className="text-[10px] text-slate-400 block mt-0.5">Sanctioned By: {mut.officer}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoRCard;
