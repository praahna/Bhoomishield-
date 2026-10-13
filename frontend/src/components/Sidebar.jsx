import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus,
  Search,
  History,
  Blocks,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Home,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isCollapsed, onToggleCollapse }) {
  const { isAuthority } = useAuth();

  const navLinks = [
    { to: '/', label: 'Home Page', icon: Home, exact: true },
    { to: '/dashboard', label: 'Citizen Dashboard', icon: LayoutDashboard },
    { to: '/register-property', label: 'Register Property', icon: FilePlus },
    { to: '/verify', label: 'Verify Property Title', icon: Search },
    { to: '/history', label: 'Ownership History', icon: History },
    { to: '/blockchain', label: 'Blockchain Records', icon: Blocks },
    { to: '/risk-analysis', label: 'AI Risk Engine', icon: Cpu },
  ];

  // Authority and Alert center links
  const authorityLinks = [
    { to: '/authority', label: 'Authority Console', icon: ShieldCheck, badge: 'Official' },
    { to: '/alerts', label: 'Alert Center', icon: AlertTriangle, badge: 'Live' },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 shrink-0 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top branding / toggle */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-slate-800/80">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-400 shrink-0" />
            <span className="font-bold text-white tracking-wide text-sm">Navigation</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
            isCollapsed ? 'mx-auto' : ''
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Citizen Services
            </p>
          )}
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0 text-teal-400" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </div>

        <div className="space-y-1 pt-3 border-t border-slate-800/80">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Verification & Audits
            </p>
          )}
          {authorityLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 text-purple-400" />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700/50">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom Info */}
      {!isCollapsed && (
        <div className="p-3 m-3 rounded-xl bg-slate-800/50 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span>Ledger Mode</span>
            <span className="text-teal-400">Demo Active</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Cryptographic SHA-256 enabled. Off-chain document safety.
          </p>
        </div>
      )}
    </aside>
  );
}
