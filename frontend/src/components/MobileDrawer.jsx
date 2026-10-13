import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  X,
  Shield,
  LayoutDashboard,
  FilePlus,
  Search,
  History,
  Blocks,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  Home,
  ShieldAlert,
  Zap,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MobileDrawer({ isOpen, onClose, onOpenConflictModal }) {
  const { user, isAuthority, demoLogin } = useAuth();

  if (!isOpen) return null;

  const handleLinkClick = () => {
    onClose();
  };

  const handleRoleToggle = () => {
    demoLogin(isAuthority ? 'citizen' : 'authority');
  };

  const handleConflictClick = () => {
    onClose();
    if (onOpenConflictModal) onOpenConflictModal();
  };

  const citizenLinks = [
    { to: '/', label: 'Home Page', icon: Home, exact: true },
    { to: '/dashboard', label: 'Citizen Dashboard', icon: LayoutDashboard },
    { to: '/register-property', label: 'Register Property', icon: FilePlus },
    { to: '/verify', label: 'Verify Property Title', icon: Search },
    { to: '/history', label: 'Ownership History', icon: History },
    { to: '/blockchain', label: 'Blockchain Records', icon: Blocks },
    { to: '/risk-analysis', label: 'AI Risk Engine', icon: Cpu },
  ];

  const adminLinks = [
    { to: '/authority', label: 'Authority Console', icon: ShieldCheck },
    { to: '/alerts', label: 'Alert Center', icon: AlertTriangle },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-4/5 max-w-xs bg-slate-900 text-slate-200 h-full shadow-2xl flex flex-col z-10 animate-slide-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">BhoomiShield</h2>
              <p className="text-[10px] text-teal-400 font-medium">Mobile Navigation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card & Role Switcher */}
        <div className="p-4 bg-slate-800/60 border-b border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Current Profile:</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-900/60 text-teal-300 border border-teal-700/60">
              {user?.role || 'Citizen'}
            </span>
          </div>
          <p className="font-semibold text-white text-sm truncate">{user?.name || 'Priya Sharma'}</p>

          <button
            onClick={handleRoleToggle}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 transition-colors min-h-[40px]"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Switch to {isAuthority ? 'Citizen Mode' : 'Authority Mode'}
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Citizen Portal
            </p>
            {citizenLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                      isActive
                        ? 'bg-teal-600/30 text-teal-300 font-semibold border border-teal-500/40'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-800">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Revenue & Alerts
            </p>
            {adminLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                      isActive
                        ? 'bg-purple-600/30 text-purple-300 font-semibold border border-purple-500/40'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Quick conflict simulation button */}
          <div className="pt-2">
            <button
              onClick={handleConflictClick}
              className="w-full flex items-center justify-center gap-2 py-3 px-3 text-xs font-bold rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 transition-colors min-h-[44px]"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Simulate Conflict Demo
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 text-[10px] text-slate-500 text-center">
          BhoomiShield • Responsive Mobile v2.4
        </div>
      </div>
    </div>
  );
}
