import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowLeftRight, 
  Wallet, 
  Layers, 
  SlidersHorizontal, 
  Bell, 
  ChevronDown, 
  ShieldCheck, 
  Zap, 
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Settings,
  Terminal,
  User,
  LogOut,
  Key,
  Menu,
  X
} from 'lucide-react';
import { ActiveTab, UserWallet, UserAccount } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  wallet: UserWallet;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenSwap: () => void;
  latency: number;
  currentUser: UserAccount | null;
  onOpenAuth: (tab?: 'login' | 'register' | 'change-password') => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  wallet,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenSwap,
  latency,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="border-b border-slate-800/80 bg-[#090e1b]/95 backdrop-blur-md sticky top-0 z-40 px-2 sm:px-4 lg:px-6 h-14 flex items-center justify-between select-none">
        {/* Left: Brand & Desktop Navigation */}
        <div className="flex items-center gap-2 sm:gap-6">
          {/* Mobile Hamburger Toggle (Touch target 44px) */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden touch-target text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            onClick={() => handleNavClick('trade')}
            className="flex items-center gap-2 cursor-pointer group"
            id="brand-logo-btn"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#070b14] rounded-[6px] flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-extrabold text-xs sm:text-base tracking-tight text-white whitespace-nowrap">
                  BIT TRADE <span className="text-emerald-400 font-black">NET</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  PRO
                </span>
              </div>
              <span className="text-[9px] font-medium text-slate-400 tracking-wider hidden lg:block">
                Trade Smarter. Move Faster.
              </span>
            </div>
          </div>

          {/* Desktop Primary Nav Items */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              id="nav-spot-btn"
              onClick={() => handleNavClick('trade')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'trade' 
                  ? 'bg-slate-800 text-emerald-400 font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Spot
            </button>
            <button
              id="nav-perps-btn"
              onClick={() => handleNavClick('perps')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'perps' 
                  ? 'bg-slate-800 text-emerald-400 font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Futures
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1 py-0.2 rounded font-mono font-bold">
                100x
              </span>
            </button>
            <button
              id="nav-swap-btn"
              onClick={onOpenSwap}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'swap' 
                  ? 'bg-slate-800 text-emerald-400 font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Instant Swap
            </button>
            <button
              id="nav-markets-btn"
              onClick={() => handleNavClick('markets')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'markets' 
                  ? 'bg-slate-800 text-emerald-400 font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Markets
            </button>
            <button
              id="nav-portfolio-btn"
              onClick={() => handleNavClick('portfolio')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'portfolio' 
                  ? 'bg-slate-800 text-emerald-400 font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Wallet className="w-3.5 h-3.5 text-slate-400" />
              Portfolio
            </button>
            <button
              id="nav-client-dashboard-btn"
              onClick={() => handleNavClick('client-dashboard')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'client-dashboard' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Client Dashboard</span>
              <span className="text-[10px] px-1 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">$48k</span>
            </button>
            <button
              id="nav-api-btn"
              onClick={() => handleNavClick('api-docs')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'api-docs' 
                  ? 'bg-slate-800 text-emerald-400 font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>API & DB Console</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </button>
          </nav>
        </div>

        {/* Right: Actions, Balance & System Status */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Network & Latency Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">L2 Engine:</span>
            <span className="text-emerald-400 font-medium">{latency}ms</span>
          </div>

          {/* Deposit Button (Touch-friendly) */}
          <button
            id="quick-deposit-btn"
            onClick={onOpenDeposit}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 min-h-[36px] sm:min-h-[38px] bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs rounded-lg shadow-sm shadow-emerald-500/20 transition-all touch-manipulation"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">Deposit</span>
          </button>

          {/* Withdraw Button */}
          <button
            id="quick-withdraw-btn"
            onClick={onOpenWithdraw}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 transition-all touch-manipulation"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Withdraw</span>
          </button>

          {/* Wallet Balance Dropdown Trigger */}
          <div className="relative">
            <button
              id="wallet-dropdown-trigger"
              onClick={() => setShowWalletDropdown(!showWalletDropdown)}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 text-xs transition-colors min-h-[36px] sm:min-h-[38px]"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-slate-400 font-mono leading-none hidden sm:block">Balance</span>
                <span className="font-mono font-bold text-white text-[11px] sm:text-xs leading-tight">
                  ${wallet.totalUsd >= 1000 ? `${(wallet.totalUsd / 1000).toFixed(1)}k` : wallet.totalUsd.toFixed(0)}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {/* Wallet Dropdown Panel */}
            {showWalletDropdown && (
              <div 
                id="wallet-dropdown-menu"
                className="absolute right-0 mt-2 w-64 sm:w-72 max-w-[calc(100vw-1rem)] bg-[#0d1424] border border-slate-800 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                  <span className="text-xs font-semibold text-slate-300">Wallet Overview</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-medium">
                    +${wallet.unrealizedPnl.toFixed(2)} (PnL)
                  </span>
                </div>
                <div className="py-2.5 space-y-2 max-h-48 overflow-y-auto">
                  {Object.entries(wallet.balances).map(([asset, data]) => (
                    <div key={asset} className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-200">{asset}</span>
                      <div className="text-right font-mono">
                        <div className="text-slate-100 font-medium">{data.free} {asset}</div>
                        <div className="text-[10px] text-slate-400">${data.usdValue.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-800 flex gap-2">
                  <button
                    onClick={() => {
                      setShowWalletDropdown(false);
                      handleNavClick('portfolio');
                    }}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg transition-colors text-center"
                  >
                    Manage Portfolio
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Account / Session Profile */}
          <div className="relative">
            {currentUser ? (
              <div>
                <button
                  id="user-profile-trigger"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 min-h-[36px] sm:min-h-[38px] rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-[11px] font-semibold text-white leading-none truncate max-w-[90px]">
                      {currentUser.name || currentUser.username}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {currentUser.location || 'Trader'}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5 shrink-0" />
                </button>

                {/* User Dropdown */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-60 sm:w-64 max-w-[calc(100vw-1rem)] bg-[#0d1424] border border-slate-800 rounded-xl shadow-2xl p-3 z-50 text-xs">
                    <div className="pb-2.5 border-b border-slate-800/80">
                      <div className="font-bold text-white text-sm truncate">{currentUser.name}</div>
                      <div className="text-[11px] font-mono text-emerald-400 truncate">@{currentUser.username}</div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                        <span className="capitalize">{currentUser.gender}</span>
                        <span>•</span>
                        <span className="truncate">{currentUser.location}</span>
                      </div>
                    </div>

                    <div className="py-2 space-y-1">
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onOpenAuth('change-password');
                        }}
                        className="w-full text-left px-2 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2 transition-colors min-h-[40px]"
                      >
                        <Key className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Change Password</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          handleNavClick('api-docs');
                        }}
                        className="w-full text-left px-2 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2 transition-colors min-h-[40px]"
                      >
                        <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>API & DB Console</span>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onLogout();
                        }}
                        className="w-full text-left px-2 py-2 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 flex items-center gap-2 transition-colors min-h-[40px]"
                      >
                        <LogOut className="w-3.5 h-3.5 shrink-0" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="sign-in-header-btn"
                onClick={() => onOpenAuth('login')}
                className="px-2.5 sm:px-3 py-1.5 min-h-[36px] sm:min-h-[38px] rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Slide-Down Navigation Menu (Drawer for screens < 768px) */}
      {mobileMenuOpen && (
        <div 
          id="mobile-navigation-drawer"
          className="md:hidden fixed inset-x-0 top-14 bottom-0 bg-[#070b14]/95 backdrop-blur-md z-30 flex flex-col p-4 border-b border-slate-800 overflow-y-auto animate-in slide-in-from-top duration-200"
        >
          <div className="flex flex-col gap-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider px-2 pt-1 pb-1">
              Navigation
            </div>
            
            <button
              onClick={() => handleNavClick('trade')}
              className={`touch-target w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'trade' 
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700' 
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>Spot Trading</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">Live Pro Terminal</span>
            </button>

            <button
              onClick={() => handleNavClick('perps')}
              className={`touch-target w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'perps' 
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700' 
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Futures (Perpetuals)</span>
              </div>
              <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-mono font-bold">
                100x
              </span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSwap();
              }}
              className="touch-target w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between text-slate-300 hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ArrowLeftRight className="w-5 h-5 text-amber-400" />
                <span>Instant Token Swap</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">Zero Gas</span>
            </button>

            <button
              onClick={() => handleNavClick('markets')}
              className={`touch-target w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'markets' 
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700' 
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-indigo-400" />
                <span>Market Screener</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">Quotes & 24h stats</span>
            </button>

            <button
              onClick={() => handleNavClick('portfolio')}
              className={`touch-target w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'portfolio' 
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700' 
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-purple-400" />
                <span>Portfolio & Balances</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                ${wallet.totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </button>

            {/* Special Client Dashboard Nav Item */}
            <button
              onClick={() => handleNavClick('client-dashboard')}
              className={`touch-target w-full px-4 py-3.5 rounded-xl text-sm font-bold flex items-center justify-between transition-all ${
                activeTab === 'client-dashboard' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10' 
                  : 'bg-emerald-950/20 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-900/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div>Joshua James Bergin</div>
                  <div className="text-[11px] text-emerald-400/80 font-normal">Client Dashboard Project</div>
                </div>
              </div>
              <span className="text-xs font-mono font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-md">
                $47,986.00
              </span>
            </button>

            <button
              onClick={() => handleNavClick('api-docs')}
              className={`touch-target w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'api-docs' 
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700' 
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <span>API & DB Console</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">
                SQLite
              </span>
            </button>

            {/* Mobile Actions: Deposit & Withdraw */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 mt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDeposit();
                }}
                className="touch-target py-3 px-3 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>Deposit Funds</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWithdraw();
                }}
                className="touch-target py-3 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Withdraw</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
