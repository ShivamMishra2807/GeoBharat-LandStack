import React, { useEffect, useState } from 'react';
import { planningApi } from '../../../api/planningApi';
import { getStatusBadgeColor } from '../../../utils/formatters';
import { Building2, Compass, Ruler, ShieldCheck, Loader2 } from 'lucide-react';
import Badge from '../../../components/ui/Badge';

export const PlanningCard = ({ ulpin }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPlanning = async () => {
      if (!ulpin) return;
      try {
        setLoading(true);
        setError(null);
        const res = await planningApi.getPlanningByUlpin(ulpin);
        if (isMounted) setData(res);
      } catch (err) {
        if (isMounted) {
          setData(null);
          setError('No planning or zoning record found for this parcel.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPlanning();
    return () => {
      isMounted = false;
    };
  }, [ulpin]);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-gov-navy mb-2" />
        <span className="text-xs">Fetching Master Plan & Sanction Details...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200">
        <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-700">Planning Data Not Available</p>
        <p className="text-[11px] text-slate-400 mt-1">{error || 'No urban development plan mapped for this parcel.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Master Plan & Authority Header */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Town & Country Planning
          </span>
          <Badge variant="primary" size="sm">
            {data.planning_authority?.split(' ')[0]}
          </Badge>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-800">{data.zone_type}</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">{data.master_plan_name}</p>
        </div>

        <div className="pt-2 border-t border-slate-200/60 text-xs">
          <span className="text-slate-500 text-[11px]">Permitted Use: </span>
          <span className="font-semibold text-slate-800">{data.proposed_land_use}</span>
        </div>
      </div>

      {/* Development Regulations (FSI / Road Width / Setbacks) */}
      <div className="p-3.5 rounded-xl border border-slate-200 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
          <Ruler className="w-4 h-4 text-gov-navy" />
          <span>Development Control Regulations (DCR)</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-slate-50 rounded-lg">
            <span className="text-[10px] text-slate-400 block">Base FSI / FAR:</span>
            <span className="font-bold text-gov-navy text-sm">{data.permissible_fsi}</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg">
            <span className="text-[10px] text-slate-400 block">Road Width:</span>
            <span className="font-bold text-slate-800 text-sm">{data.road_width_m} Meters</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg">
            <span className="text-[10px] text-slate-400 block">Max Ground Coverage:</span>
            <span className="font-bold text-slate-800">{data.max_ground_coverage_pct}%</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg">
            <span className="text-[10px] text-slate-400 block">Premium FSI / TDR:</span>
            <span className="font-semibold text-slate-700 text-[11px] truncate block">{data.premium_fsi_eligible}</span>
          </div>
        </div>
      </div>

      {/* Building Permissions / Layout Sanction */}
      <div className="p-3.5 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-gov-navy" />
            <span>Building Permissions & Layout Sanctions</span>
          </div>
          <span className="text-[10px] text-slate-400">
            {data.building_permissions?.length || 0} Records
          </span>
        </div>

        {data.building_permissions?.length > 0 ? (
          <div className="space-y-2">
            {data.building_permissions.map((bp, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-gov-navy text-[11px]">{bp.permission_no}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusBadgeColor(bp.status)}`}>
                    {bp.status}
                  </span>
                </div>
                <p className="font-medium text-slate-800">{bp.type}</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-200/50">
                  <span>Sanctioned Height: <strong>{bp.permitted_height_m}m</strong></span>
                  <span>Built Area: <strong>{bp.total_built_sqm?.toLocaleString()} sq.m</strong></span>
                </div>
                {bp.architect && (
                  <span className="text-[10px] text-slate-400 block">Architect / Engineer: {bp.architect}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic p-2 text-center bg-slate-50 rounded-lg">
            No building plan submitted for this parcel.
          </p>
        )}
      </div>
    </div>
  );
};

export default PlanningCard;
