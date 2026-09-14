import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Shield, UserCheck, Landmark, UserPlus, LogIn, CheckCircle2, AlertCircle, ArrowRight, KeyRound, Mail, User } from 'lucide-react';
import Button from '../../../components/ui/Button';

export const LoginForm = ({ onSuccess }) => {
  const { login, signup, user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  // Top role selection: 'citizen' or 'admin'
  const [authRole, setAuthRole] = useState('citizen');
  // Mode for citizen: 'login' or 'signup'
  const [citizenMode, setCitizenMode] = useState('login');

  // Form states
  const [citizenEmail, setCitizenEmail] = useState('ramesh.patil@example.in');
  const [citizenPassword, setCitizenPassword] = useState('citizen123');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // Admin form state
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCitizenSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (citizenMode === 'signup') {
        if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
          setErrorMsg('Please fill in all required fields (Name, Email, Password).');
          return;
        }
        await signup({
          name: signupName.trim(),
          email: signupEmail.trim(),
          password: signupPassword,
          role: 'citizen',
        });
        setSuccessMsg('Account created successfully! Welcome to GeoBharat.');
      } else {
        await login('citizen', {
          email: citizenEmail.trim(),
          password: citizenPassword,
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate(redirectPath || '/portal');
      }
    } catch (err) {
      setErrorMsg(err.error || err.message || 'Authentication failed. Please verify details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await login('admin', {
        username: adminUsername.trim(),
        password: adminPassword,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate(redirectPath || '/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.error || err.message || 'Invalid admin credentials. (Hint: admin / admin123)');
    } finally {
      setLoading(false);
    }
  };

  // Quick helper pills for demo review
  const selectDemoAccount = (type) => {
    setErrorMsg('');
    if (type === 'citizen-a') {
      setAuthRole('citizen');
      setCitizenMode('login');
      setCitizenEmail('ramesh.patil@example.in');
      setCitizenPassword('citizen123');
    } else if (type === 'citizen-b') {
      setAuthRole('citizen');
      setCitizenMode('login');
      setCitizenEmail('sunita.gaikwad@example.in');
      setCitizenPassword('citizen123');
    } else if (type === 'admin') {
      setAuthRole('admin');
      setAdminUsername('admin');
      setAdminPassword('admin123');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-gov-navy text-white flex items-center justify-center mx-auto mb-3 shadow-md">
          <Landmark className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">GeoBharat Authentication</h2>
        <p className="text-xs text-slate-500 mt-1">National Cadastral Land Records & Revenue Portal</p>
      </div>

      {/* Role Selector: Citizen vs Admin */}
      <div className="grid grid-cols-2 gap-2.5 p-1 bg-slate-100 rounded-xl border border-slate-200 mb-5">
        <button
          type="button"
          onClick={() => {
            setAuthRole('citizen');
            setErrorMsg('');
          }}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            authRole === 'citizen'
              ? 'bg-white text-gov-navy shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className={`w-4 h-4 ${authRole === 'citizen' ? 'text-gov-navy' : 'text-slate-400'}`} />
          <span>Citizen Portal</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthRole('admin');
            setErrorMsg('');
          }}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            authRole === 'admin'
              ? 'bg-white text-gov-navy shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className={`w-4 h-4 ${authRole === 'admin' ? 'text-gov-amber-dark' : 'text-slate-400'}`} />
          <span>Admin Login</span>
        </button>
      </div>

      {/* Error / Success Notifications */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* CITIZEN TAB */}
      {authRole === 'citizen' && (
        <div className="space-y-4">
          {/* Sub-mode toggle: Sign In vs Sign Up */}
          <div className="flex border-b border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => {
                setCitizenMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 font-semibold text-center border-b-2 transition-all ${
                citizenMode === 'login'
                  ? 'border-gov-navy text-gov-navy'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In (Existing Citizen)
            </button>
            <button
              type="button"
              onClick={() => {
                setCitizenMode('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 font-semibold text-center border-b-2 transition-all ${
                citizenMode === 'signup'
                  ? 'border-gov-navy text-gov-navy'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account (Sign Up)
            </button>
          </div>

          <form onSubmit={handleCitizenSubmit} className="space-y-3 text-xs">
            {citizenMode === 'signup' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Dnyandev Patil"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-navy"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@example.in"
                  value={citizenMode === 'signup' ? signupEmail : citizenEmail}
                  onChange={(e) =>
                    citizenMode === 'signup' ? setSignupEmail(e.target.value) : setCitizenEmail(e.target.value)
                  }
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-navy"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={citizenMode === 'signup' ? signupPassword : citizenPassword}
                  onChange={(e) =>
                    citizenMode === 'signup' ? setSignupPassword(e.target.value) : setCitizenPassword(e.target.value)
                  }
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-navy"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
              icon={citizenMode === 'signup' ? UserPlus : LogIn}
            >
              {citizenMode === 'signup' ? 'Complete Sign Up & Open Portal' : 'Citizen Sign In'}
            </Button>
          </form>

          {/* Quick Demo Credentials for presentation */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Instant Demo Fill:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => selectDemoAccount('citizen-a')}
                className="text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] transition-all"
              >
                <div className="font-semibold text-slate-800">Citizen A (Ramesh)</div>
                <div className="text-[10px] text-slate-500">Owns Plot 45/1A</div>
              </button>
              <button
                type="button"
                onClick={() => selectDemoAccount('citizen-b')}
                className="text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] transition-all"
              >
                <div className="font-semibold text-slate-800">Citizen B (Sunita)</div>
                <div className="text-[10px] text-slate-500">Owns Plot 45/1B</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN TAB */}
      {authRole === 'admin' && (
        <div className="space-y-4">
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <Shield className="w-4 h-4 text-gov-amber-dark flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Official Jurisdictional Console</span>
              <span className="text-[11px] text-amber-800">
                Restricted to authorized Revenue Officers (SDO, Tehsildar, Town Planners)
              </span>
            </div>
          </div>

          <form onSubmit={handleAdminSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Admin Username / Official Email *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-navy"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="admin123"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-navy"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
              icon={Shield}
            >
              Authenticate & Access Dashboard
            </Button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Pre-configured Demo Credentials:
            </span>
            <button
              type="button"
              onClick={() => selectDemoAccount('admin')}
              className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs transition-all flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-slate-800">SDO / Prant Officer (Admin)</div>
                <div className="text-[10px] text-slate-500 font-mono">admin / admin123</div>
              </div>
              <span className="text-[10px] bg-gov-navy text-white px-2 py-0.5 rounded font-medium">Quick Fill</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
