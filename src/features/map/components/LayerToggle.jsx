import React, { useState } from 'react';
import { Layers, MapPin, Building2, Zap, Droplets, IndianRupee, ShieldCheck, Check, Eye, X } from 'lucide-react';
import useAppStore from '../../../store';
import useTranslation from '../../../hooks/useTranslation';

export const LayerToggle = () => {
  const [isCut, setIsCut] = useState(false);
  const {
    gisTier,
    setGisTier,
    activeSubLayer,
    setActiveSubLayer,
    showUtilitiesOverlay,
    toggleUtilitiesOverlay,
  } = useAppStore();

  const { t } = useTranslation();

  const gisTiers = [
    {
      id: 'usecase',
      number: 'Layer 3',
      name: t('usecase_layer')?.toUpperCase() || 'USE-CASE LAYER',
      subtitle: 'Utilities, Property Tax, Land Valuation & Eco-Zones',
      icon: Zap,
      accentColor: 'text-amber-500',
      activeBg: 'bg-amber-50 border-amber-300 text-amber-950',
    },
    {
      id: 'essential',
      number: 'Layer 2',
      name: t('essential_layer')?.toUpperCase() || 'ESSENTIAL LAYER',
      subtitle: 'RoR (Ownership), Registration, Zoning & Encumbrances',
      icon: Building2,
      accentColor: 'text-blue-500',
      activeBg: 'bg-blue-50 border-blue-300 text-blue-950',
    },
    {
      id: 'base',
      number: 'Layer 1',
      name: t('base_layer')?.toUpperCase() || 'BASE LAYER',
      subtitle: 'Georeferenced Map, Cadastral Boundaries & ULPIN Mesh',
      icon: MapPin,
      accentColor: 'text-emerald-500',
      activeBg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
    },
  ];

  if (isCut) {
    return (
      <button
        onClick={() => setIsCut(false)}
        className="bg-white/95 hover:bg-white backdrop-blur-md rounded-2xl px-3 py-2 border border-slate-200 shadow-xl flex items-center gap-2 text-xs font-bold text-gov-navy hover:text-gov-navy-light transition-all select-none"
        title="Open 3-Layer GIS Architecture"
      >
        <Layers className="w-4 h-4 text-gov-navy" />
        <span>3-Layer GIS</span>
        <span className="text-[10px] bg-gov-navy/10 text-gov-navy px-1.5 py-0.5 rounded-full font-mono uppercase">
          {gisTier}
        </span>
      </button>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200 shadow-xl shadow-slate-900/10 w-80 sm:w-96 text-xs select-none">
      {/* Header with Cut / Close button */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Layers className="w-4 h-4 text-gov-navy" />
          <span>3-Layer GIS Architecture</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono bg-gov-navy/10 text-gov-navy px-2 py-0.5 rounded-full font-semibold">
            OGC / WGS84
          </span>
          <button
            onClick={() => setIsCut(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Cut / Hide 3-Layer GIS Architecture"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3-Layer Stack */}
      <div className="space-y-1.5">
        {gisTiers.map((tier) => {
          const isActive = gisTier === tier.id;
          const Icon = tier.icon;
          return (
            <div
              key={tier.id}
              onClick={() => setGisTier(tier.id)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? `${tier.activeBg} shadow-xs font-medium`
                  : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200/80 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-white shadow-xs' : 'bg-slate-200/70'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${tier.accentColor}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs tracking-tight">{tier.name}</span>
                      <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded-xs bg-slate-200/70 text-slate-600">
                        {tier.number}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{tier.subtitle}</p>
                  </div>
                </div>

                {isActive && (
                  <span className="w-4 h-4 rounded-full bg-gov-navy text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              {/* Sub-toggles when active */}
              {isActive && tier.id === 'essential' && (
                <div className="mt-2 pt-2 border-t border-blue-200/60 flex items-center gap-2 text-[10px]">
                  <span className="text-slate-500">Coloring:</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSubLayer('zoning');
                    }}
                    className={`px-2 py-0.5 rounded-md font-semibold ${
                      activeSubLayer === 'zoning'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    Master Plan Zoning
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSubLayer('encumbrance');
                    }}
                    className={`px-2 py-0.5 rounded-md font-semibold ${
                      activeSubLayer === 'encumbrance'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    Title Encumbrances
                  </button>
                </div>
              )}

              {isActive && tier.id === 'usecase' && (
                <div className="mt-2 pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleUtilitiesOverlay();
                    }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md font-semibold ${
                      showUtilitiesOverlay
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Utility Infrastructure Grid</span>
                  </button>
                  <span className="text-[10px] text-slate-500">Water • 11kV Power • Eco-Buffer</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LayerToggle;
