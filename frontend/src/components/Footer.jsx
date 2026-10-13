import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Cpu, Blocks, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs sm:text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4 text-teal-200" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                Bhoomi<span className="text-teal-400">Shield</span>
              </span>
            </div>
            <p className="text-slate-300 font-medium text-xs sm:text-sm">
              “Verify Property. Secure Ownership. Prevent Disputes.”
            </p>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A responsive blockchain-based property verification and litigation prevention platform engineered for citizens, financial institutions, and revenue authorities.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                <Blocks className="w-3 h-3 text-teal-400" /> Solidity Registry
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                <Cpu className="w-3 h-3 text-purple-400" /> AI Risk Engine
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                <Lock className="w-3 h-3 text-amber-400" /> SHA-256 Off-Chain
              </span>
            </div>
          </div>

          {/* Citizen Quick Links */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Citizen Services</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/verify" className="hover:text-teal-400 transition-colors">Verify Title Deed</Link></li>
              <li><Link to="/register-property" className="hover:text-teal-400 transition-colors">Register Property Parcel</Link></li>
              <li><Link to="/history" className="hover:text-teal-400 transition-colors">Ownership Audit Trail</Link></li>
              <li><Link to="/blockchain" className="hover:text-teal-400 transition-colors">Blockchain Ledger Explorer</Link></li>
              <li><Link to="/risk-analysis" className="hover:text-teal-400 transition-colors">AI Risk Calculator</Link></li>
            </ul>
          </div>

          {/* Governance & Authority */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Revenue Authority</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/authority" className="hover:text-teal-400 transition-colors">Sub-Registrar Console</Link></li>
              <li><Link to="/alerts" className="hover:text-teal-400 transition-colors">Alert & Caveat Center</Link></li>
              <li><Link to="/dashboard" className="hover:text-teal-400 transition-colors">Citizen Portal</Link></li>
              <li><Link to="/login" className="hover:text-teal-400 transition-colors">Role-Based Access</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box (Strict requirement) */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-[11px] sm:text-xs text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              Legal & Cryptographic Notice
            </div>
            <p className="leading-relaxed">
              Cryptographic SHA-256 deed hashing and blockchain immutability verify document integrity and historical mutation logs without exposing confidential deeds on a public network. Formal legal ownership rights remain subject to jurisdictional revenue cadastral survey records and official Sub-Registrar stamp validation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 mt-4 gap-2">
            <span>© 2026 BhoomiShield Platform. Open Engineering Ideathon Implementation.</span>
            <span>All devices supported: Desktop, Tablet, Mobile (320px–1920px)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
