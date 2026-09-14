import React, { useState, useRef, useEffect } from 'react';
import useTranslation from '../../hooks/useTranslation';
import { Globe, Check, ChevronDown } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { currentLanguage, setLanguage, languages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLangObj = languages.find((l) => l.code === currentLanguage) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 transition-all text-xs text-white"
        title="Change Language / भाषा बदला / மொழியை மாற்றவும்"
      >
        <Globe className="w-3.5 h-3.5 text-amber-300" />
        <span className="font-semibold text-amber-100">{activeLangObj.native}</span>
        <span className="text-[10px] text-slate-300 hidden md:inline">({activeLangObj.code.toUpperCase()})</span>
        <ChevronDown className={`w-3 h-3 text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-slate-800 animate-fadeIn">
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Select Language / भाषा
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-blue-50 text-blue-700 font-semibold font-mono">
              9 Languages
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
            {languages.map((lang) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 text-left flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-amber-50/80 text-gov-navy' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">{lang.native}</span>
                      <span className="text-[11px] text-slate-500 font-medium">({lang.name})</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {lang.region}
                    </span>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-gov-amber-light flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
