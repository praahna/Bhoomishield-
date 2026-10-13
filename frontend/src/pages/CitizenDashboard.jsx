import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FilePlus,
  Search,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Eye,
  FileText,
  MapPin,
  Lock
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import RiskBadge from '../components/RiskBadge';

export default function CitizenDashboard({ onOpenConflictModal }) {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const [propRes, txRes] = await Promise.all([
        api.get('/properties'),
        api.get('/blockchain/records')
      ]);
      setProperties(propRes.data.properties || []);
      setTransactions(txRes.data.records || []);
    } catch (err) {
      console.warn('Failed to load live properties, falling back to local dataset', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Filter or prioritize user's properties
  const myProperties = properties.filter(
    (p) => p.ownerName?.toLowerCase().includes('priya') || p.propertyId === 'PROP-10234'
  );
  const displayProperties = myProperties.length > 0 ? myProperties : properties.slice(0, 3);

  const totalProps = properties.length;
  const verifiedCount = properties.filter((p) => p.verificationStatus === 'Verified').length;
  const pendingCount = properties.filter((p) => p.verificationStatus === 'Pending').length;
  const flaggedCount = properties.filter((p) => p.isConflictFlagged || p.verificationStatus === 'Flagged').length;

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-slate-900 text-white shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-2.5 py-0.5 rounded border border-teal-800">
              Citizen Portal
            </span>
            <span className="text-xs text-slate-400">Bangalore Revenue Division</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Priya Sharma'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time cadastral verification and cryptographic title protection dashboard.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Refresh Registry Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-teal-400' : ''}`} />
            Refresh
          </button>

          <button
            onClick={onOpenConflictModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-transform active:scale-95"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Simulate Conflict Scenario
          </button>
        </div>
      </div>

      {/* 4 Responsive Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Card 1: Total Properties */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Total Properties</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalProps}</div>
          <p className="text-[11px] text-slate-500">Monitored in registry</p>
        </div>

        {/* Card 2: Verified */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-medium text-slate-500">Verified Deeds</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{verifiedCount}</div>
          <p className="text-[11px] text-emerald-600 font-medium">Clear title deeds</p>
        </div>

        {/* Card 3: Pending */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-medium text-slate-500">Pending Review</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-700">{pendingCount}</div>
          <p className="text-[11px] text-amber-600 font-medium">In field mutation</p>
        </div>

        {/* Card 4: Flagged / Risk Alerts */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-xs font-medium text-slate-500">Risk Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-700">{flaggedCount}</div>
          <p className="text-[11px] text-rose-600 font-medium">Disputes flagged</p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Quick Primary Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/register-property"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50/60 hover:bg-teal-50/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FilePlus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">Register Property</h4>
              <p className="text-[11px] text-slate-500">Hash and record deed</p>
            </div>
          </Link>

          <Link
            to="/verify"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50/60 hover:bg-teal-50/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-navy-100 text-navy-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">Verify Title Deed</h4>
              <p className="text-[11px] text-slate-500">Search survey or ID</p>
            </div>
          </Link>

          <button
            onClick={onOpenConflictModal}
            className="flex items-center gap-3 p-3.5 rounded-xl border border-rose-200 hover:border-rose-400 bg-rose-50/40 hover:bg-rose-50 transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-rose-900 text-xs sm:text-sm">Simulate Conflict</h4>
              <p className="text-[11px] text-rose-600">Rahul Verma vs Priya Sharma</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Grid: My Monitored Properties + Recent Ledger Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Properties */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Monitored Properties & Title Deeds
              </h2>
              <p className="text-xs text-slate-500">Immutable ledger records under your ownership</p>
            </div>
            <Link
              to="/verify"
              className="text-xs text-teal-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {displayProperties.map((prop) => (
              <div
                key={prop.propertyId}
                className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all hover:shadow-md ${
                  prop.isConflictFlagged
                    ? 'border-rose-300 ring-2 ring-rose-200/50 bg-rose-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs sm:text-sm font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {prop.propertyId}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {prop.propertyType}
                    </span>
                    {prop.isConflictFlagged && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-300 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Flagged Conflict
                      </span>
                    )}
                  </div>
                  <RiskBadge level={prop.riskLevel} score={prop.riskScore} size="sm" />
                </div>

                <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="truncate">{prop.address}, {prop.city}</span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                    <span>Survey: <strong className="text-slate-800">{prop.surveyNumber}</strong></span>
                    <span>Area: <strong className="text-slate-800">{prop.areaSqFt} sq.ft</strong></span>
                  </div>
                </div>

                {prop.isConflictFlagged && prop.conflictDetails && (
                  <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5 text-rose-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Active Legal Hold: Competing Claim Detected
                    </div>
                    <p className="text-[11px] text-rose-700 leading-tight">
                      Claimant: <strong>{prop.conflictDetails.claimantName}</strong> attempted unauthorized transfer. Transfer blocked; recorded owner remains {prop.ownerName}.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] truncate max-w-[200px] sm:max-w-xs font-mono">
                    <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Hash: {prop.documentHash?.slice(0, 16)}...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/verify?q=${prop.propertyId}`)}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <Search className="w-3 h-3" /> Verify
                    </button>
                    <button
                      onClick={() => navigate(`/history?q=${prop.propertyId}`)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> Audit Log
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Recent Transactions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Blockchain Ledger Feed
            </h2>
            <Link
              to="/blockchain"
              className="text-xs text-teal-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Explorer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 text-slate-500">
              <span>Latest Confirmed Blocks</span>
              <span className="font-mono text-teal-600 font-semibold">18,492,042</span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {transactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.transactionId || tx.txHash}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-700 text-[11px]">
                      {tx.propertyId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        tx.transactionType?.includes('Dispute')
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-teal-50 text-teal-700'
                      }`}
                    >
                      {tx.transactionType}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 truncate">
                    To: <strong className="text-slate-800">{tx.toOwner}</strong>
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-200/60">
                    <span>Block #{tx.blockNumber}</span>
                    <span className="text-teal-600">✓ {tx.confirmations || 12} conf</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
