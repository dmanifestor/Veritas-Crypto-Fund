import React, { useState, useEffect } from 'react';
import { X, Lock, User, MapPin, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { UserAccount } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'register' | 'change-password';
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  currentUser: UserAccount | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'login',
  onClose,
  onLoginSuccess,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'change-password'>(initialTab);

  // Login form state
  const [loginUsername, setLoginUsername] = useState('testing-test-2');
  const [loginPassword, setLoginPassword] = useState('testing-today');

  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regName, setRegName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regGender, setRegGender] = useState('male');
  const [regLocation, setRegLocation] = useState('Chennai');

  // Change password form state
  const [cpUsername, setCpUsername] = useState(currentUser?.username || 'testing-test-2');
  const [cpOldPassword, setCpOldPassword] = useState('');
  const [cpNewPassword, setCpNewPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (currentUser?.username) {
      setCpUsername(currentUser.username);
    }
  }, [initialTab, isOpen, currentUser]);

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.text();
      let parsed: any;
      try {
        parsed = JSON.parse(data);
      } catch {
        parsed = { message: data };
      }

      if (!res.ok) {
        throw new Error(parsed.message || data || 'Login failed');
      }

      const userAccount: UserAccount = parsed.user || {
        username: loginUsername.trim(),
        name: loginUsername.trim(),
        gender: 'not specified',
        location: 'Remote',
      };

      setSuccessMessage('Logged in successfully!');
      onLoginSuccess(userAccount);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (regPassword.length < 5) {
      setErrorMessage('Password is too short (minimum 5 characters required)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: regUsername.trim(),
          name: regName.trim(),
          password: regPassword,
          gender: regGender,
          location: regLocation.trim(),
        }),
      });

      const message = await res.text();
      if (!res.ok) {
        throw new Error(message || 'Registration failed');
      }

      setSuccessMessage('Account created successfully! Logging you in...');
      // Auto login
      const userAccount: UserAccount = {
        username: regUsername.trim(),
        name: regName.trim(),
        gender: regGender,
        location: regLocation.trim(),
      };
      onLoginSuccess(userAccount);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  // Handle Change Password
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (cpNewPassword.length < 5) {
      setErrorMessage('New password is too short (minimum 5 characters)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cpUsername.trim(),
          oldPassword: cpOldPassword,
          newPassword: cpNewPassword,
        }),
      });

      const message = await res.text();
      if (!res.ok) {
        throw new Error(message || 'Password update failed');
      }

      setSuccessMessage('Password updated successfully in SQLite database!');
      setCpOldPassword('');
      setCpNewPassword('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-[#090e1b] border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col"
        id="auth-modal-dialog"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#080d19]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">User Authentication</h2>
              <p className="text-[11px] text-slate-400 font-mono">SQLite Account System (userData.db)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-900/40 text-xs font-semibold text-slate-400">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'login'
                ? 'border-emerald-400 text-emerald-400 bg-slate-800/40'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'register'
                ? 'border-emerald-400 text-emerald-400 bg-slate-800/40'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => {
              setActiveTab('change-password');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'change-password'
                ? 'border-emerald-400 text-emerald-400 bg-slate-800/40'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            Change Password
          </button>
        </div>

        {/* Alerts */}
        <div className="px-5 pt-3">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-5 flex-1">
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={e => setLoginUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full bg-[#0d1424] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-[#0d1424] border border-slate-700/80 rounded-lg pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Demo Account Fillers */}
              <div className="pt-1">
                <div className="text-[10px] text-slate-400 mb-1.5 flex items-center justify-between font-mono">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Quick Accounts from SQLite:</span>
                  </div>
                  <span className="text-[9px] text-emerald-400">Attached PDF User Added</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginUsername('Berginjoshua1@gmail.com');
                      setLoginPassword('Thatguy12@');
                    }}
                    className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/40 hover:border-emerald-400 text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                        <span>Berginjoshua1@gmail.com</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-normal">
                          PDF User ($47,986)
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans">Joshua James Bergin • pw: Thatguy12@</div>
                    </div>
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginUsername('testing-test-2');
                        setLoginPassword('testing-today');
                      }}
                      className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors"
                    >
                      <div className="text-cyan-400 font-semibold truncate">testing-test-2</div>
                      <div className="text-[10px] text-slate-400">pw: testing-today</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginUsername('cliffordhayes');
                        setLoginPassword('password123');
                      }}
                      className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors"
                    >
                      <div className="text-slate-300 font-semibold truncate">cliffordhayes</div>
                      <div className="text-[10px] text-slate-400">Clifford • LA</div>
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-emerald-500/20"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={e => setRegUsername(e.target.value)}
                    placeholder="e.g. alex99"
                    className="w-full bg-[#0d1424] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-[#0d1424] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Password <span className="text-slate-500">(minimum 5 characters)</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={5}
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Choose password"
                    className="w-full bg-[#0d1424] border border-slate-700/80 rounded-lg pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Gender</label>
                  <select
                    value={regGender}
                    onChange={e => setRegGender(e.target.value)}
                    className="w-full bg-[#0d1424] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      required
                      value={regLocation}
                      onChange={e => setRegLocation(e.target.value)}
                      placeholder="e.g. Chennai"
                      className="w-full bg-[#0d1424] border border-slate-700/80 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-emerald-500/20"
              >
                {loading ? 'Creating Account...' : 'Register to userData.db'}
              </button>
            </form>
          )}

          {activeTab === 'change-password' && (
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={cpUsername}
                  onChange={e => setCpUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-[#0d1424] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={cpOldPassword}
                  onChange={e => setCpOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-[#0d1424] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  New Password <span className="text-slate-500">(minimum 5 characters)</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={5}
                  value={cpNewPassword}
                  onChange={e => setCpNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-[#0d1424] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-emerald-500/20"
              >
                {loading ? 'Updating Password...' : 'Update Password in SQLite'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
