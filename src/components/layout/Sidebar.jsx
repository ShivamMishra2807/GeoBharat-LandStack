import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../features/auth/hooks/useAuth';
import {
  LayoutDashboard,
  Shield,
  Map,
  Search,
  FileText,
  LogIn,
  LogOut,
  Layers,
  Sparkles
} from 'lucide-react';

export const Sidebar = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = role === 'admin' || role === 'official';

  const navItems = [
    {
      to: isAdmin ? '/admin' : '/dashboard',
      label: isAdmin ? 'Admin Console' : 'Dashboard',
      icon: LayoutDashboard,
      description: isAdmin ? 'Jurisdiction & Scrutiny Queue' : 'Personal Land Overview',
    },
    {
      to: '/my-land',
      label: 'My Land',
      icon: Shield,
      description: 'Private Registered Parcels',
      requiresAuth: true,
      citizenOnly: true, // NEVER SHOW TO ADMIN
    },
    {
      to: '/map',
      label: 'India Cadastral Map',
      icon: Map,
      description: 'Spatial Boundary Explorer',
    },
    {
      to: '/search',
      label: 'Search by ULPIN',
      icon: Search,
      description: 'Nationwide Bhu-Aadhaar Lookup',
    },
    {
      to: '/portal',
      label: 'Citizen Petitions',
      icon: FileText,
      description: 'Mutations & RoR Extracts',
      requiresAuth: true,
      citizenOnly: true,
    },
    {
      to: '/admin',
      label: 'Admin Scrutiny',
      icon: Sparkles,
      description: 'Revenue Queue & Analytics',
      requiresAdmin: true,
    },
  ];

  return (
    <aside className="w-16 md:w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between py-4 select-none z-30 transition-colors flex-shrink-0">
      <div className="space-y-1 px-2.5">
        <div className="px-2 pb-2 hidden md:block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation Menu
          </span>
        </div>

        {navItems
          .filter((item) => {
            if (item.requiresAdmin && role !== 'admin' && role !== 'official') return false;
            if (item.citizenOnly && (role === 'admin' || role === 'official')) return false;
            if (item.requiresAuth && !isAuthenticated) return false;
            return true;
          })
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-gov-navy dark:bg-gov-navy-light text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                      }`}
                    />
                    <div className="hidden md:block min-w-0">
                      <span className="truncate block">{item.label}</span>
                      <span
                        className={`text-[10px] font-normal truncate block leading-tight ${
                          isActive ? 'text-slate-300' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {item.description}
                      </span>
                    </div>
                    {item.requiresAdmin && (
                      <span className="hidden md:inline ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                        Gov
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
      </div>

      {/* Bottom Session Control */}
      <div className="px-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        {isAuthenticated ? (
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="hidden md:inline">Logout</span>
          </button>
        ) : (
          <NavLink
            to="/login"
            className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-gov-navy dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <LogIn className="w-4 h-4 flex-shrink-0" />
            <span className="hidden md:inline">Login / Sign Up</span>
          </NavLink>
        )}

        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 text-[10px] text-slate-500 dark:text-slate-400 hidden md:block">
          <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
            <span>GeoBharat Core</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono">v1.2-Active</span>
          </div>
          <p className="leading-tight text-slate-400 dark:text-slate-500 mt-0.5">
            Pan-Indian Cadastral Normalization Engine
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
