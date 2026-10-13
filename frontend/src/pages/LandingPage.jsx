import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Search,
  FilePlus,
  Lock,
  Cpu,
  Blocks,
  AlertOctagon,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Scale,
  Database,
  FileText,
  Smartphone,
  Eye,
  Sparkles,
  Zap
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';

export default function LandingPage({ onOpenConflictModal }) {
  const [quickSearchId, setQuickSearchId] = useState('');
  const navigate = useNavigate();

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (quickSearchId.trim()) {
      navigate(`/verify?q=${encodeURIComponent(quickSearchId.trim())}`);
    } else {
      navigate('/verify');
    }
  };

  const sampleProps = [
    { id: 'PROP-10234', owner: 'Priya Sharma', risk: 'LOW', score: 12, type: 'Residential Villa' },
    { id: 'PROP-44321', owner: 'Arun Kumar', risk: 'MEDIUM', score: 48, type: 'Commercial Plot' },
    { id: 'PROP-9087', owner: 'Meena Rao', risk: 'HIGH', score: 87, type: 'Agricultural Land' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="relative pt-6 sm:pt-12 pb-12 sm:pb-20 overflow-hidden">
        {/* Background gradient decorative shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-teal-500/10 via-slate-100/50 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>Next-Gen Land Litigation Prevention Platform</span>
            </div>

            {/* Tagline & Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Bhoomi<span className="text-teal-600">Shield</span>
            </h1>

            <p className="text-lg sm:text-2xl font-bold text-navy-800 tracking-tight">
              “Verify Property. Secure Ownership. Prevent Disputes.”
            </p>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Combining tamper-evident Solidity smart contracts, off-chain SHA-256 deed hashing, and explainable AI risk scoring to identify suspicious land transactions and conflicting claims before you disburse funds.
            </p>

            {/* Search Bar on Hero */}
            <form onSubmit={handleQuickSearch} className="max-w-xl mx-auto pt-2">
              <div className="relative flex items-center shadow-lg rounded-2xl bg-white border-2 border-slate-200 focus-within:border-teal-500 transition-all p-1.5">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter Property ID (e.g., PROP-10234), Survey #, or Reg #"
                  value={quickSearchId}
                  onChange={(e) => setQuickSearchId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden bg-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shrink-0 shadow-xs"
                >
                  Verify Now
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2.5 text-xs text-slate-500">
                <span>Quick demo checks:</span>
                {sampleProps.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => navigate(`/verify?q=${p.id}`)}
                    className="font-mono text-teal-700 hover:underline bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 text-[11px]"
                  >
                    {p.id} ({p.risk})
                  </button>
                ))}
              </div>
            </form>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <Link
                to="/verify"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-navy-900 hover:bg-navy-950 text-white font-semibold text-sm shadow-md transition-all active:scale-95 min-h-[46px]"
              >
                <Search className="w-4 h-4 text-teal-400" />
                Verify Property Title
              </Link>

              <Link
                to="/register-property"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-xs transition-all active:scale-95 min-h-[46px]"
              >
                <FilePlus className="w-4 h-4 text-teal-600" />
                Register New Parcel
              </Link>

              <button
                type="button"
                onClick={onOpenConflictModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-sm border border-rose-200 shadow-xs transition-all active:scale-95 min-h-[46px]"
              >
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                Live Conflict Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Problem Statement */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/80 px-2.5 py-1 rounded-md border border-rose-800">
              The Real Estate Crisis
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Over 66% of Pending Civil Litigations in India Stem from Property Ownership Disputes
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Traditional land registries rely on manual paper deeds and fragmented records. Buyers fall prey to fraudulent Power of Attorney (POA) claims, unauthorized multiple sales of the same survey number, forged stamp papers, and undisclosed boundary disputes that drag on in courts for decades.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-rose-400 font-bold text-lg">15–20 Years</span>
                <p className="text-slate-400 text-xs">Average civil court resolution duration for land title lawsuits.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-amber-400 font-bold text-lg">Dual Conveyancing</span>
                <p className="text-slate-400 text-xs">Same property sold to multiple unaware buyers concurrently.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-teal-400 font-bold text-lg">Tampered Deeds</span>
                <p className="text-slate-400 text-xs">Physical alteration of survey coordinates and mutation dates.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Solution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
            Our Architectural Solution
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Cryptographic Integrity & AI-Driven Prevention
          </h2>
          <p className="text-sm text-slate-600">
            BhoomiShield stops fraudulent conveyances before registration by synchronizing off-chain deed hashes with an immutable blockchain ledger and an explainable AI risk engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">SHA-256 Off-Chain Security</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Confidential title deeds never touch the public blockchain. Instead, client-side cryptographic SHA-256 hashes are calculated to verify that any presented deed matches the original record byte-for-byte.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center">
              <Blocks className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">Immutable Smart Contract</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every title conveyance, survey mutation, and administrative caveat is recorded on a tamper-evident Solidity ledger (`PropertyRegistry.sol`), preventing backdated mutations or clandestine deed reassignments.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">AI Litigation Risk Engine</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              An explainable multi-factor scoring model flags rapid title flipping, competing claims, and unverified mutation intervals, classifying risk from 0–100 into LOW, MEDIUM, or HIGH with clear rationale.
            </p>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="bg-slate-100/70 py-12 sm:py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
              Workflow Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How BhoomiShield Protects Your Property
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 relative">
              <span className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Deed Hashing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                When a title deed is uploaded, a 256-bit cryptographic fingerprint is computed locally in the browser.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 relative">
              <span className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Blockchain Anchoring</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The smart contract logs the deed hash, survey parcel, and owner wallet to the chronological block chain.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 relative">
              <span className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h4 className="font-bold text-slate-900 text-sm">AI Anomaly Scan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The risk engine calculates transfer frequency, flags rapid turnovers, and checks for overlapping survey claims.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 relative">
              <span className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                4
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Conflict Sentinel</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an unauthorized transfer is attempted, the system immediately locks the parcel and alerts authorities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Key Features & Tech Stack */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              Key Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Built for High-Trust Real Estate Verification
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Mobile-First Responsive Layout:</strong> Seamless verification and conflict alerts across iPhone, Android, tablets, and 4K desktop monitors.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Role-Based Security:</strong> Dedicated portals for Citizen verification and Sub-Registrar / Revenue Authority dispute resolution.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Instant Hash Re-Verification:</strong> Upload any deed copy to verify whether it matches the registered blockchain hash instantly.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Transparent Audit Trail:</strong> Complete historical chain of title from genesis survey to current recorded owner.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-600" /> Technology Stack
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block">Frontend</span>
                <span className="text-slate-500 text-[11px]">React 19, Vite, Tailwind CSS, Recharts, Lucide</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block">Backend</span>
                <span className="text-slate-500 text-[11px]">Node.js, Express, REST APIs, JWT, bcrypt, Helmet</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block">Blockchain</span>
                <span className="text-slate-500 text-[11px]">Solidity, Smart Contracts, SHA-256 Hashing</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block">AI Engine</span>
                <span className="text-slate-500 text-[11px]">Explainable Rule Engine + Python FastAPI reference</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
              <span>Deterministic Blockchain Demo Mode:</span>
              <span className="font-bold font-mono">ACTIVE (No Gas Required)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Future Scope */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-navy-900 to-slate-900 text-white space-y-4">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Future Scope & National Rollout Roadmap
          </div>
          <h3 className="text-xl sm:text-2xl font-bold">
            Expanding BhoomiShield for State Cadastral GIS Integration
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Next iterations will synchronize high-resolution satellite GIS boundaries directly with district civil court caveats, enabling automated title verification for home loans in under 15 seconds without bureaucratic bottlenecks.
          </p>
        </div>
      </section>
    </div>
  );
}
