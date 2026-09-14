import React from 'react';

export const LandStackLogo = ({ size = 'md', showText = true, lightText = false }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16',
  };

  const svgSizes = {
    sm: 18,
    md: 24,
    lg: 32,
    xl: 38,
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* LandStack Tech Emblem: Land Cadastre + Digital Stack + GIS Geolocation */}
      <div
        className={`${iconSizes[size] || iconSizes.md} rounded-xl bg-gradient-to-br from-gov-navy via-slate-900 to-gov-navy-light p-0.5 shadow-md flex items-center justify-center relative overflow-hidden border border-amber-400/40 group flex-shrink-0`}
      >
        {/* Cadastral Polygon Tech Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:6px_6px] opacity-25" />

        {/* Stack Layers Emblem */}
        <div className="relative z-10 flex items-center justify-center">
          <svg
            width={svgSizes[size] || 24}
            height={svgSizes[size] || 24}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transform transition-transform group-hover:scale-105"
          >
            {/* Base Layer: Cadastral Land Parcel Polygon (Green) */}
            <path
              d="M16 26L4 20L16 14L28 20L16 26Z"
              fill="#059669"
              fillOpacity="0.85"
              stroke="#34D399"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Middle Layer: Digital Records Stack (Blue) */}
            <path
              d="M16 20L5 14.5L16 9L27 14.5L16 20Z"
              fill="#2563EB"
              fillOpacity="0.85"
              stroke="#60A5FA"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Top Layer: GIS Geolocation Tech Surface (Amber / Gold) */}
            <path
              d="M16 14L6 9L16 4L26 9L16 14Z"
              fill="#F59E0B"
              fillOpacity="0.95"
              stroke="#FDE68A"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Center Demarcation GPS Node */}
            <circle cx="16" cy="9" r="2.2" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`font-black tracking-tight ${
                size === 'lg' ? 'text-2xl' : size === 'xl' ? 'text-3xl' : 'text-base'
              } ${lightText ? 'text-white' : 'text-slate-900'}`}
            >
              GEO<span className="text-gov-amber-light">BHARAT</span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              Bhu-Aadhaar
            </span>
          </div>
          <span
            className={`text-[10px] font-medium leading-tight truncate ${
              lightText ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Digital Cadastral GIS & Land Records Platform
          </span>
        </div>
      )}
    </div>
  );
};

export default LandStackLogo;
