import React, { useState } from 'react';
import { Satellite, AlertTriangle, CheckCircle2, TrendingUp, Sliders, ShieldAlert, Sparkles } from 'lucide-react';
import Badge from '../../../components/ui/Badge';

export const SatelliteChangeDetection = ({ feature }) => {
  if (!feature) return null;
  const p = feature.properties || {};
  const sat = p.satellite_change || {
    baseline_year: 2020,
    current_year: 2024,
    historical_built_sqm: 0,
    current_built_sqm: 0,
    change_pct: 0,
    unapproved_construction_flag: false,
    encroachment_distance_m: 0.0,
    detected_features: 'Stable cadastral parcel with no unauthorized boundary deformation.',
  };

  const [sliderPos, setSliderPos] = useState(50); // 0 to 100

  const hasEncroachment = sat.unapproved_construction_flag;

  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Satellite className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs">Satellite AI Encroachment & Change Detection</h4>
            <p className="text-[10px] text-slate-400">Multispectral Temporal Change Analysis</p>
          </div>
        </div>
        <Badge variant={hasEncroachment ? 'danger' : 'success'} size="sm">
          {hasEncroachment ? 'Encroachment Flagged' : 'Footprint Verified'}
        </Badge>
      </div>

      {/* Interactive Before/After Split Comparison Simulation */}
      <div className="relative w-full h-56 rounded-xl overflow-hidden border border-slate-700 shadow-xl select-none bg-slate-950">
        {/* Baseline 2020 Satellite Image Layer */}
        <div className="absolute inset-0 bg-[#16271e]">
          {/* Earth/Farmland Satellite Texture Pattern */}
          <div 
            className="absolute inset-0 opacity-45"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 30% 40%, rgba(45, 90, 50, 0.8) 0%, transparent 60%),
                radial-gradient(ellipse at 75% 70%, rgba(100, 85, 45, 0.7) 0%, transparent 50%),
                repeating-linear-gradient(45deg, rgba(30,60,35,0.4) 0px, rgba(30,60,35,0.4) 15px, rgba(20,50,25,0.4) 15px, rgba(20,50,25,0.4) 30px)
              `
            }}
          />

          {/* Coordinate GIS Grid Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-2020" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#10B981" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-2020)" />
          </svg>

          {/* 2020 Cadastral Parcel Demarcation (Green Line) */}
          <div className="absolute inset-4 border-2 border-emerald-400/80 border-dashed rounded-lg pointer-events-none shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <div className="absolute top-2 left-2 text-[9px] font-mono text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
              Survey Boundary • 12,400 m²
            </div>
          </div>

          {/* 2020 Baseline Small Structure */}
          <div className="absolute top-14 left-14 w-16 h-12 bg-amber-900/60 border border-amber-500/80 rounded flex flex-col items-center justify-center text-[9px] text-amber-200 font-mono shadow-sm">
            <span>Plinth</span>
            <span className="text-[8px] text-amber-300/80">{sat.historical_built_sqm || 850}m²</span>
          </div>
          
          <div className="absolute top-2.5 left-2.5 bg-slate-900/90 backdrop-blur-md text-emerald-400 text-[10px] font-mono px-2 py-1 rounded-md border border-emerald-500/40 flex items-center gap-1.5 shadow-md z-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Sentinel-2: {sat.baseline_year} Baseline
          </div>

          <div className="absolute bottom-2.5 left-2.5 bg-slate-950/90 backdrop-blur-md text-emerald-300 text-[10px] font-mono px-2 py-1 rounded-md border border-emerald-500/30 shadow-md z-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Agricultural / Plinth State
          </div>
        </div>

        {/* Current 2024 Satellite Image Layer (Clipped by Slider) */}
        <div
          className="absolute inset-0 overflow-hidden bg-[#1e2338] transition-none"
          style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
        >
          {/* Dense Urban Satellite Texture */}
          <div 
            className="absolute inset-0 opacity-55"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 40% 30%, rgba(50, 70, 110, 0.9) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 60%, rgba(130, 60, 60, 0.7) 0%, transparent 50%),
                repeating-linear-gradient(-45deg, rgba(40,50,80,0.5) 0px, rgba(40,50,80,0.5) 12px, rgba(30,40,70,0.5) 12px, rgba(30,40,70,0.5) 24px)
              `
            }}
          />

          {/* Coordinate GIS Grid Lines 2024 */}
          <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-2024" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#60A5FA" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-2024)" />
          </svg>

          {/* Current Spatial Boundary Overlay */}
          <div className={`absolute inset-4 border-2 ${hasEncroachment ? 'border-rose-500' : 'border-blue-400'} rounded-lg pointer-events-none shadow-[0_0_15px_rgba(59,130,246,0.3)]`}>
            <div className={`absolute top-2 left-2 text-[9px] font-mono px-1.5 py-0.5 rounded border ${hasEncroachment ? 'text-rose-300 bg-rose-950/80 border-rose-500/50' : 'text-blue-300 bg-blue-950/80 border-blue-500/50'}`}>
              Spatial Boundary • Verified
            </div>
          </div>

          {/* Expanded 2024 Building Footprint (Visualizing New Construction) */}
          <div className="absolute top-12 left-12 w-28 h-20 bg-blue-600/40 border-2 border-blue-400 rounded-md flex flex-col items-center justify-center text-[10px] text-blue-100 font-mono shadow-lg backdrop-blur-2xs">
            <span className="font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              Built Footprint
            </span>
            <span className="text-[9px] text-blue-200 mt-0.5 font-semibold">
              {sat.current_built_sqm || 1420} m² (+{sat.change_pct || 67}%)
            </span>
          </div>

          {/* Encroachment Marker if flagged */}
          {hasEncroachment && (
            <div className="absolute top-12 left-44 w-12 h-16 bg-rose-600/50 border-2 border-rose-400 border-dashed rounded flex flex-col items-center justify-center text-[8px] text-rose-100 font-mono animate-pulse shadow-md">
              <span className="font-bold text-rose-300">ILLEGAL</span>
              <span>+{sat.encroachment_distance_m}m</span>
            </div>
          )}

          <div className="absolute top-2.5 right-2.5 bg-slate-900/90 backdrop-blur-md text-blue-400 text-[10px] font-mono px-2 py-1 rounded-md border border-blue-500/40 flex items-center gap-1.5 shadow-md z-1">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            PlanetScope: {sat.current_year} Current
          </div>

          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2 z-1">
            {hasEncroachment ? (
              <div className="bg-rose-950/95 backdrop-blur-md text-rose-200 border border-rose-500/70 px-2 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1 animate-pulse shadow-md">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Encroachment: +{sat.encroachment_distance_m}m</span>
              </div>
            ) : (
              <div className="bg-slate-950/90 backdrop-blur-md text-blue-300 text-[10px] font-mono px-2 py-1 rounded-md border border-blue-500/30 shadow-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                Built Area Expansion Detected
              </div>
            )}
          </div>
        </div>

        {/* Slider Split Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] z-10 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white text-slate-800 shadow-xl border-2 border-gov-navy flex items-center justify-center">
            <Sliders className="w-3.5 h-3.5 text-gov-navy" />
          </div>
        </div>

        {/* Transparent Range Input Slider */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        />
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <span>◀ Drag left for 2024 current</span>
        <span className="font-semibold text-slate-600">Comparison Slider ({sliderPos}%)</span>
        <span>Drag right for 2020 baseline ▶</span>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-[10px] text-slate-400 block">Historical Built Area:</span>
          <span className="font-bold text-slate-800">{sat.historical_built_sqm?.toLocaleString()} sq.m</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Baseline ({sat.baseline_year})</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-[10px] text-slate-400 block">Current Built Area:</span>
          <span className="font-bold text-gov-navy">{sat.current_built_sqm?.toLocaleString()} sq.m</span>
          <span className={`text-[10px] font-semibold mt-0.5 block ${sat.change_pct > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
            {sat.change_pct > 0 ? `+${sat.change_pct}% Expansion` : 'No Structural Change'}
          </span>
        </div>
      </div>

      {/* AI Detection Narrative */}
      <div className={`p-3 rounded-xl border ${hasEncroachment ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'} space-y-1`}>
        <div className="flex items-center gap-1.5 font-semibold text-[11px]">
          {hasEncroachment ? (
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          )}
          <span>{hasEncroachment ? 'Spatial Violation Detected' : 'Sanctioned Footprint Verified'}</span>
        </div>
        <p className="text-[11px] leading-relaxed opacity-90">{sat.detected_features}</p>
        {hasEncroachment && (
          <p className="text-[10px] text-rose-700 font-semibold pt-1 border-t border-rose-200">
            Action: Field notice recommended under Section 53 of MRTP Act 1966 / UP Revenue Code.
          </p>
        )}
      </div>
    </div>
  );
};

export default SatelliteChangeDetection;
