import React from 'react';

export const Tabs = ({ tabs = [], activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex bg-slate-50 border-b border-slate-200 overflow-x-auto no-scrollbar ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-all duration-150 ${
              isActive
                ? 'border-gov-navy text-gov-navy bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-gov-navy' : 'text-slate-400'}`} />}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-gov-navy text-white' : 'bg-slate-200/80 text-slate-700'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
