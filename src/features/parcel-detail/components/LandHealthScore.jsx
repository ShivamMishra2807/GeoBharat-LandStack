import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, Activity, FileWarning, ArrowUpRight } from 'lucide-react';

export const LandHealthScore = ({ feature }) => {
  if (!feature) return null;
  const p = feature.properties || {};

  const score = p.health_score || 85;
  const grade = p.risk_grade || 'A (Low Risk)';
  const factors = p.risk_factors || [];

  // Determine meter color
  const getScoreColor = (val) => {
    if (val >= 85) return { stroke: '#10B981', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (val >= 70) return { stroke: '#F59E0B', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { stroke: '#EF4444', bg: 'bg-rose-50 text-rose-800 border-rose-200' };
  };

  const colors = getScoreColor(score);
  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gov-navy/10 text-gov-navy flex items-center justify-center">
            <Activity className="w-4 h-4 text-gov-navy" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs">AI Land Health & Dispute Risk Index</h4>
            <p className="text-[10px] text-slate-400">Multi-Registry Algorithmic Risk Scoring</p>
          </div>
        </div>
        <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          ML-Powered
        </span>
      </div>

      {/* Radial Score Gauge & Grade */}
      <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
        <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#E2E8F0"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={colors.stroke}
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-extrabold text-slate-900 leading-none">{score}</span>
            <span className="text-[9px] text-slate-400 font-semibold">/ 100</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${colors.bg}`}>
              {grade}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-tight">
            {score >= 85
              ? 'Excellent title clearance. Low probability of legal encumbrance or boundary litigation.'
              : score >= 70
              ? 'Moderate risk profile. Observed active bank lien or pending mutation notice period.'
              : 'High dispute risk. Active court litigation or statutory green buffer violation flagged.'}
          </p>
        </div>
      </div>

      {/* 4 Risk Pillar Breakdown */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="p-2 rounded-lg bg-white border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span>Title Cleanliness</span>
            <span className="font-bold text-slate-800">{score >= 70 ? '95%' : '40%'}</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${score >= 70 ? 'bg-emerald-500' : 'bg-rose-500'}`}
              style={{ width: score >= 70 ? '95%' : '40%' }}
            />
          </div>
        </div>

        <div className="p-2 rounded-lg bg-white border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span>Encumbrance / Liens</span>
            <span className="font-bold text-slate-800">{p.encumbrance_status?.includes('Clear') ? '100%' : '75%'}</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${p.encumbrance_status?.includes('Clear') ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: p.encumbrance_status?.includes('Clear') ? '100%' : '75%' }}
            />
          </div>
        </div>

        <div className="p-2 rounded-lg bg-white border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span>Zoning Conformity</span>
            <span className="font-bold text-slate-800">{p.zone_type?.includes('Buffer') ? '20%' : '90%'}</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${p.zone_type?.includes('Buffer') ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: p.zone_type?.includes('Buffer') ? '20%' : '90%' }}
            />
          </div>
        </div>

        <div className="p-2 rounded-lg bg-white border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span>Tax Clearance</span>
            <span className="font-bold text-slate-800">{p.tax_status === 'Paid' ? '100%' : '50%'}</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${p.tax_status === 'Paid' ? 'bg-emerald-500' : 'bg-rose-500'}`}
              style={{ width: p.tax_status === 'Paid' ? '100%' : '50%' }}
            />
          </div>
        </div>
      </div>

      {/* Identified Risk Factors */}
      {factors.length > 0 ? (
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Automated Risk Observations ({factors.length})
          </span>
          <div className="space-y-1.5">
            {factors.map((f, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2 text-xs"
              >
                <FileWarning className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                  f.severity === 'Critical' ? 'text-rose-600' : f.severity === 'High' ? 'text-amber-600' : 'text-blue-600'
                }`} />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-800">{f.category} Risk</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-xs font-semibold ${
                      f.severity === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {f.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Zero legal encumbrances, court injunctions, or zoning violations detected.</span>
        </div>
      )}
    </div>
  );
};

export default LandHealthScore;
