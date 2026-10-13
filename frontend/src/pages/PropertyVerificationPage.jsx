import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  ShieldCheck,
  Building,
  MapPin,
  Calendar,
  Lock,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  FileText,
  FileCheck,
  Copy,
  Check,
  UploadCloud,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import api from '../services/api';
import RiskBadge from '../components/RiskBadge';

export default function PropertyVerificationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [propertyData, setPropertyData] = useState(null);
  const [error, setError] = useState('');
  const [copiedHash, setCopiedHash] = useState(false);

  // Hash Match Tool
  const [verifyHashInput, setVerifyHashInput] = useState('');
  const [hashVerificationResult, setHashVerificationResult] = useState(null);
  const [verifyingHash, setVerifyingHash] = useState(false);

  const sampleProperties = [
    { id: 'PROP-10234', label: 'Priya Sharma (Low 12)', color: 'emerald' },
    { id: 'PROP-44321', label: 'Arun Kumar (Med 48)', color: 'amber' },
    { id: 'PROP-9087', label: 'Meena Rao (High 87)', color: 'rose' },
    { id: 'PROP-7712', label: 'Kiran R (Low 8)', color: 'emerald' },
    { id: 'PROP-55321', label: 'Anil Kumar (Med 56)', color: 'amber' },
  ];

  const handleSearch = async (searchTerm) => {
    const clean = (searchTerm || query).trim();
    if (!clean || clean === 'undefined' || clean === 'null') {
      handleSearch('PROP-10234');
      return;
    }
    const term = clean;

    setLoading(true);
    setError('');
    setPropertyData(null);
    setHashVerificationResult(null);

    try {
      const res = await api.get(`/properties/${encodeURIComponent(term)}`);
      setPropertyData(res.data);
    } catch (err) {
      setError(
        err.userFriendlyMessage ||
        `No registered parcel found matching '${term}'. Verify the survey number or property ID.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qParam = params.get('q');
    if (qParam && qParam !== 'undefined' && qParam !== 'null') {
      setQuery(qParam);
      handleSearch(qParam);
    } else {
      // Default initial view to PROP-10234
      setQuery('PROP-10234');
      handleSearch('PROP-10234');
    }
  }, [location.search]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDocumentHashCheck = async (e) => {
    e.preventDefault();
    if (!verifyHashInput.trim() || !propertyData?.property) return;

    setVerifyingHash(true);
    try {
      const res = await api.post('/blockchain/verify-document', {
        propertyId: propertyData.property.propertyId,
        documentHash: verifyHashInput.trim(),
      });
      setHashVerificationResult(res.data);
    } catch (err) {
      console.error('Hash check error', err);
    } finally {
      setVerifyingHash(false);
    }
  };

  const handleFileHashCalc = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashHex = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      setVerifyHashInput(hashHex);
    } catch (err) {
      console.error('Failed to hash uploaded file', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold">
          <Search className="w-3.5 h-3.5" />
          Pre-Purchase Cadastral Title Audit
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Verify Property Title & Litigation Risk
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Query registered parcels by Property ID, Survey Number, or Deed Registration Number.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID (PROP-10234), Survey (SY-402/1A), or Reg (KA-BLR-2023-8901)"
              className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-300 focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-slate-900"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 min-h-[46px]"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Verify Title
          </button>
        </form>

        {/* Demo Selector Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
          <span className="font-medium text-slate-600">Sample Records:</span>
          {sampleProperties.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setQuery(p.id);
                handleSearch(p.id);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 border border-slate-200 text-xs font-mono font-medium transition-colors"
            >
              {p.id} ({p.label})
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3 animate-pulse">
          <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">Querying Immutable Blockchain Registry...</h3>
          <p className="text-xs text-slate-500">Checking title deeds, encumbrance hashes, and caveat records</p>
        </div>
      )}

      {/* Error Message */}
      {!loading && error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5 animate-fade-in">
          <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Query Result:</span> {error}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && !propertyData?.property && (
        <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs space-y-2">
          <Search className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700 text-sm">No Property Selected</p>
          <p className="text-xs text-slate-400">Search using a Property ID, Survey Number, or click one of the sample records above.</p>
        </div>
      )}

      {/* Verification Result Card */}
      {propertyData && propertyData.property && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Card */}
          <div
            className={`p-6 sm:p-8 rounded-3xl bg-white border shadow-sm space-y-6 ${
              propertyData.property.isConflictFlagged
                ? 'border-rose-300 ring-2 ring-rose-200'
                : 'border-slate-200'
            }`}
          >
            {/* Top row: Status, ID, Risk */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-extrabold text-sm sm:text-base text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                    {propertyData.property.propertyId}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    {propertyData.property.propertyType}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      propertyData.property.verificationStatus === 'Verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : propertyData.property.verificationStatus === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    ● {propertyData.property.verificationStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Cadastral Survey #{propertyData.property.surveyNumber} • Reg: {propertyData.property.registrationNumber}
                </p>
              </div>

              <div>
                <RiskBadge
                  level={propertyData.property.riskLevel}
                  score={propertyData.property.riskScore}
                  size="lg"
                />
              </div>
            </div>

            {/* Conflict Alert Warning if property is flagged */}
            {propertyData.property.isConflictFlagged && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 space-y-2">
                <div className="flex items-start gap-2.5">
                  <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm text-rose-900">
                      CRITICAL LEGAL DISPUTE ACTIVE ON THIS PARCEL
                    </h3>
                    <p className="text-xs text-rose-800 mt-0.5">
                      {propertyData.property.conflictDetails?.reason ||
                        'Conflicting title deed or adverse possession caveat detected.'}
                    </p>
                  </div>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
                  <span>
                    Recorded Title Holder: <strong>{propertyData.property.ownerName}</strong>
                  </span>
                  <span>
                    Competing Claimant: <strong className="text-rose-700">{propertyData.property.conflictDetails?.claimantName || 'Third Party'}</strong>
                  </span>
                  <span className="text-[11px] font-semibold text-rose-700">
                    Status: Transfer Locked
                  </span>
                </div>
              </div>
            )}

            {/* Core Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-medium">Recorded Legal Owner:</span>
                <p className="text-sm font-bold text-slate-900">{propertyData.property.ownerName}</p>
                <span className="text-[11px] text-slate-500">{propertyData.property.ownerContact}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-medium">Cadastral Location:</span>
                <p className="text-xs font-semibold text-slate-900 line-clamp-2">
                  {propertyData.property.address}, {propertyData.property.city}, {propertyData.property.state} - {propertyData.property.pinCode}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-medium">Parcel Area & Deed Date:</span>
                <p className="text-sm font-bold text-slate-900">
                  {propertyData.property.areaSqFt} Sq. Ft
                </p>
                <span className="text-[11px] text-slate-500">
                  Executed: {propertyData.property.purchaseDate}
                </span>
              </div>
            </div>

            {/* Document Hash Box */}
            <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-teal-900 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-teal-700" />
                  Immutable Registered Deed SHA-256 Digest:
                </span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                  Blockchain Ledger Match
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-teal-200/80 font-mono text-xs text-slate-800 break-all select-all">
                <span>{propertyData.property.documentHash}</span>
                <button
                  onClick={() => handleCopy(propertyData.property.documentHash)}
                  className="ml-2 p-1 text-slate-400 hover:text-slate-700 shrink-0"
                  title="Copy SHA-256 hash"
                >
                  {copiedHash ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-teal-700">
                Anchored off-chain in Karnataka Revenue Digital Archive: <strong>{propertyData.property.documentName}</strong>
              </p>
            </div>

            {/* AI Risk Breakdown Accordion / Recommendation */}
            {propertyData.riskAnalysis && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    AI Litigation Risk Evaluation Breakdown
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Score: {propertyData.riskAnalysis.riskScore}/100
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {propertyData.riskAnalysis.recommendation}
                </p>
                <div className="space-y-1.5 pt-1">
                  {propertyData.riskAnalysis.factors?.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white border border-slate-200 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-800">{f.factor}: </span>
                        <span className="text-slate-600">{f.description}</span>
                      </div>
                      <span className="font-mono font-bold text-[11px] text-slate-500 shrink-0">
                        {f.weight} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Document Re-Verification Tool */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-teal-600" />
                Interactive Deed Hash Verification Utility
              </h3>
              <p className="text-xs text-slate-500">
                Verify if a physical or PDF deed provided by a seller matches the official cryptographic record on-chain.
              </p>
            </div>

            <form onSubmit={handleDocumentHashCheck} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={verifyHashInput}
                  onChange={(e) => setVerifyHashInput(e.target.value)}
                  placeholder="Paste deed SHA-256 hash or calculate from file below"
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 font-mono text-slate-900"
                />
                <button
                  type="submit"
                  disabled={verifyingHash}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                >
                  {verifyingHash ? 'Comparing...' : 'Compare Hash'}
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Or compute from file:</span>
                <label className="text-teal-600 hover:underline cursor-pointer font-semibold">
                  Browse Document
                  <input type="file" onChange={handleFileHashCalc} className="hidden" accept=".pdf,.png,.jpg" />
                </label>
              </div>
            </form>

            {/* Hash Verification Result Banner */}
            {hashVerificationResult && (
              <div
                className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2 animate-fade-in ${
                  hashVerificationResult.isMatch
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {hashVerificationResult.isMatch ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>CRYPTOGRAPHIC MATCH CONFIRMED (100% Integrity)</span>
                    </>
                  ) : (
                    <>
                      <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
                      <span>CRITICAL MISMATCH: TAMPERED OR STALE DEED DETECTED!</span>
                    </>
                  )}
                </div>
                <p className="text-xs leading-relaxed">{hashVerificationResult.explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
