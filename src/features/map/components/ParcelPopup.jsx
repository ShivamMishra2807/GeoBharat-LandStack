import React from 'react';
import { formatULPIN, formatArea, getStatusBadgeColor } from '../../../utils/formatters';
import { ExternalLink, User, MapPin, Tag } from 'lucide-react';
import Button from '../../../components/ui/Button';

export const ParcelPopup = ({ feature, onInspect }) => {
  if (!feature) return null;
  const p = feature.properties || {};
  const area = formatArea(p.area_sqm);

  return (
    <div className="p-3.5 min-w-[260px] max-w-[300px] text-slate-800 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            Cadastral Parcel
          </span>
          <span className="text-xs font-bold text-gov-navy font-mono">
            {formatULPIN(p.ulpin)}
          </span>
        </div>
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadgeColor(
            p.status
          )}`}
        >
          {p.status || 'Active'}
        </span>
      </div>

      {/* Attributes */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="font-medium text-slate-800 truncate">{p.owner_name}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="truncate">
            S.No {p.survey_no}, {p.village}, {p.district}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <Tag className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-slate-700 font-medium">{p.zone_type}</span>
        </div>
      </div>

      {/* Measurement Normalization Pill */}
      <div className="mt-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200/80">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">Standard Area:</span>
          <span className="font-semibold text-slate-800">{area.sqm}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5">
          <span>Acres / Gunthas:</span>
          <span>{area.acres} ({area.gunthas})</span>
        </div>
        {p.native_unit && (
          <div className="mt-1 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
            <span className="text-gov-amber-dark font-medium">Native Unit:</span>
            <span className="font-semibold text-slate-700">{p.native_unit}</span>
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="mt-3">
        <Button
          size="sm"
          variant="primary"
          className="w-full text-xs py-1.5"
          onClick={() => onInspect && onInspect(p.ulpin)}
          icon={ExternalLink}
        >
          View Unified Layers
        </Button>
      </div>
    </div>
  );
};

export default ParcelPopup;
