import React, { useState, useRef, useEffect } from 'react';
import useParcelSearch from '../hooks/useParcelSearch';
import useAuth from '../../auth/hooks/useAuth';
import { Search, X, MapPin, User, ArrowRight } from 'lucide-react';
import { formatULPIN, getStatusBadgeColor } from '../../../utils/formatters';

export const SearchBar = () => {
  const { query, setQuery, results, selectResult } = useParcelSearch();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0) {
        selectResult(results[0]);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4 text-gov-navy dark:text-amber-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search by 14-digit ULPIN, Owner, Survey / Khasra No, Village..."
          className="w-full pl-10 pr-9 py-2 bg-slate-50 hover:bg-white focus:bg-white dark:bg-slate-800 dark:hover:bg-slate-800 dark:focus:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-300/80 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 dark:focus:ring-amber-400/20 focus:border-gov-navy dark:focus:border-amber-400 transition-all shadow-xs"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Results Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200/90 dark:border-slate-800 overflow-hidden z-50 max-h-80 overflow-y-auto animate-fadeIn">
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Search Results ({results.length})</span>
            <span>Press Enter to inspect</span>
          </div>

          {results.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
              No matching parcels found for <span className="font-semibold text-slate-700 dark:text-slate-200">"{query}"</span>.
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Try searching for 'Wagholi', 'Patil', 'Bandra', or '2725...'</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {results.map((feature) => {
                const p = feature.properties || {};
                return (
                  <button
                    key={p.ulpin}
                    onClick={() => {
                      selectResult(feature);
                      setIsOpen(false);
                    }}
                    className="w-full p-3 text-left hover:bg-slate-50/90 dark:hover:bg-slate-800/80 transition-colors flex items-start justify-between gap-2 group"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gov-navy dark:text-amber-400 font-mono">
                          {formatULPIN(p.ulpin)}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium">
                          {p.record_type}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200 font-medium truncate">
                        <User className="w-3.5 h-3.5 text-gov-navy dark:text-amber-400 flex-shrink-0" />
                        <span className="truncate font-semibold">
                          {p.owner_name || 'Registered Landholder'}
                          {user && p.ownerId === user.id ? (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold ml-1.5 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                              ★ My Land
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 font-medium ml-1.5 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                              Verified Owner
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span>
                          S.No {p.survey_no} • {p.village}, {p.district}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadgeColor(p.status)}`}>
                        {p.status}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-gov-navy dark:group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all mt-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
