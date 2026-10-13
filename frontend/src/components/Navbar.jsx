import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Menu,
  Bell,
  User,
  Zap,
  LogOut,
  ChevronDown,
  ShieldAlert,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenMobileMenu, onOpenConflictModal }) {
  const { user, isAuthority, demoLogin, logout, isAuthenticated } = useAuth();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const handleRoleToggle = () => {
    if (isAuthority) {
      demoLogin('citizen');
      navigate('/dashboard');
    } else {
      demoLogin('authority');
      navigate('/authority');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors focus:outline-hidden"
              aria-label="Open mobile navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-navy-900 to-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-900/10 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-teal-350" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                    Bhoomi<span className="text-teal-600">Shield</span>
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-teal-50 text-teal-700 border border-teal-200 rounded">
                    v2.4
                  </span>
                </div>
                <span className="hidden md:block text-[10px] text-slate-500 font-medium tracking-tight">
                  Verify Property • Secure Ownership • Prevent Disputes
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Quick actions, Role Switch, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Conflict Simulation Quick CTA */}
            <button
              onClick={onOpenConflictModal}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold rounded-lg sm:rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all active:scale-95 shadow-xs"
              title="Test the conflict simulation scenario"
            >
              <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 shrink-0" />
              <span className="hidden xs:inline">Simulate</span> Conflict
            </button>

            {/* Role Switcher Pill */}
            <button
              onClick={handleRoleToggle}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                isAuthority
                  ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="Click to switch between Citizen and Revenue Authority demo roles"
            >
              <span className={`w-2 h-2 rounded-full ${isAuthority ? 'bg-purple-600 animate-pulse' : 'bg-emerald-500'}`} />
              <span>{isAuthority ? 'Authority Mode' : 'Citizen Mode'}</span>
            </button>

            {/* Notifications link */}
            <Link
              to="/alerts"
              className="relative p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              title="View Security & Dispute Alerts"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </Link>

            {/* Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-navy-800 text-white flex items-center justify-center text-xs font-bold">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline-block text-xs font-medium max-w-[100px] truncate">
                    {user?.name || 'User'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-100 text-slate-700">
                        {user?.role}
                      </span>
                    </div>

                    <button
                      onClick={handleRoleToggle}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                    >
                      <span>Switch to {isAuthority ? 'Citizen' : 'Authority'}</span>
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                    </button>

                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdown(false)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      My Dashboard
                    </Link>

                    {isAuthority && (
                      <Link
                        to="/authority"
                        onClick={() => setProfileDropdown(false)}
                        className="block px-4 py-2 text-xs text-purple-700 hover:bg-purple-50 font-medium"
                      >
                        Authority Console
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-navy-800 hover:bg-navy-900 rounded-lg shadow-xs transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
