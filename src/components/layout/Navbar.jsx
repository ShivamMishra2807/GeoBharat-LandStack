import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../features/auth/hooks/useAuth';
import SearchBar from '../../features/parcel-search/components/SearchBar';
import UniversalUnitConverter from '../../features/parcel-search/components/UniversalUnitConverter';
import LanguageSwitcher from './LanguageSwitcher';
import LandStackLogo from '../common/LandStackLogo';
import useTranslation from '../../hooks/useTranslation';
import useDarkMode from '../../hooks/useDarkMode';
import { Landmark, Shield, User, LogOut, Scale, Sun, Moon } from 'lucide-react';

export const Navbar = () => {
  const { user, role, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <>
      <header className="h-16 bg-gov-navy text-white px-4 sm:px-6 flex items-center justify-between border-b border-gov-navy-light/40 z-40 relative shadow-sm">
        {/* Brand Identity with LandStack Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <LandStackLogo size="md" lightText={true} />
          </Link>
        </div>

        {/* Center Search Bar */}
        <div className="hidden md:block flex-1 max-w-lg mx-6">
          <SearchBar />
        </div>

        {/* Right Controls: Language Switcher, Unit Converter, Role Switcher, Profile */}
        <div className="flex items-center gap-2.5">
          {/* Language Switcher for India's Diversity */}
          <LanguageSwitcher />

          {/* Dark Mode Switcher */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 transition-all text-xs text-white"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-200" />
            )}
          </button>

          {/* Universal Unit Converter & Terminology Lexicon Trigger */}
          <button
            onClick={() => setIsConverterOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 transition-all text-xs text-white"
            title="Pan-Indian Unit Converter & Terminology Glossary"
          >
            <Scale className="w-3.5 h-3.5 text-gov-amber-light" />
            <span className="hidden sm:inline font-medium">{t('unit_normalizer')}</span>
          </button>

          {/* Authenticated User Capsule or Login CTA */}
          {user ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-white/15 text-xs">
              {/* Role badge */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                role === 'admin' || role === 'official'
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
                  : 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
              }`}>
                {role === 'admin' || role === 'official' ? (
                  <Shield className="w-3.5 h-3.5 text-amber-300" />
                ) : (
                  <User className="w-3.5 h-3.5 text-emerald-300" />
                )}
                <span className="capitalize">{role === 'admin' || role === 'official' ? 'Administrator' : 'Citizen'}</span>
              </span>

              {/* User Name & Info */}
              <div className="hidden lg:block text-right">
                <span className="font-semibold text-slate-100 block leading-tight">{user.name}</span>
                <span className="text-[10px] text-slate-300">
                  {role === 'admin' || role === 'official' ? user.designation || 'Revenue Officer' : user.email}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-rose-600/30 border border-rose-400/30 transition-colors text-xs ml-1"
                title="Log Out of Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gov-amber hover:bg-gov-amber-dark text-gov-navy font-bold text-xs shadow-sm transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login / Sign Up</span>
            </Link>
          )}
        </div>
      </header>

      {/* Universal Unit Normalizer & Glossary Modal */}
      <UniversalUnitConverter
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
      />
    </>
  );
};

export default Navbar;
