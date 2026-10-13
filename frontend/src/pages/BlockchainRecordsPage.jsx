import React, { useState, useEffect } from 'react';
import {
  Blocks,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  ShieldCheck,
  RefreshCw,
  Search,
  ExternalLink,
  Lock,
  Layers,
  Cpu
} from 'lucide-react';
import api from '../services/api';

export default function BlockchainRecordsPage() {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.get('/blockchain/records');
      setRecords(res.data.records || []);
      setStatus(res.data.status || null);
    } catch (err) {
      console.error('Blockchain records fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const filteredRecords = records.filter((r) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'GENESIS') return r.transactionType?.toLowerCase().includes('genesis');
    if (filterType === 'TRANSFER') return r.transactionType?.toLowerCase().includes('transfer');
    if (filterType === 'DISPUTE') return r.transactionType?.toLowerCase().includes('dispute');
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold">
          <Blocks className="w-3.5 h-3.5" />
          Tamper-Evident Distributed Ledger
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          BhoomiShield Blockchain Ledger Explorer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Immutable block records, cryptographic transaction hashes, and smart contract verification logs.
        </p>
      </div>

      {/* Network & Ledger Status Banner (Requirement 6: Clearly distinguish demo mode vs real blockchain) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-white shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            <h2 className="font-bold text-sm sm:text-base">
              {status?.modeLabel || 'Deterministic Blockchain Demo Mode'}
            </h2>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-teal-900 text-teal-300 border border-teal-700">
              Zero Gas Simulation
            </span>
          </div>

          <button
            onClick={fetchRecords}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Ledger
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1 border-t border-slate-800 text-slate-300">
          <div>
            <span className="text-slate-500 block">Smart Contract Address:</span>
            <span className="font-mono text-teal-300 font-semibold break-all text-[11px]">
              {status?.contractAddress || '0x5FbDB2315678afecb367f032d93F642f64180aa3'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Block Height:</span>
            <span className="font-mono text-white font-bold">#{status?.latestBlock || 18492042}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Confidentiality Guarantee:</span>
            <span className="text-slate-300 text-[11px]">Deeds stored off-chain; SHA-256 on-chain</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['ALL', 'GENESIS', 'TRANSFER', 'DISPUTE'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
              filterType === type
                ? 'bg-navy-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {type === 'ALL' ? 'All Transactions' : `${type} Records`}
          </button>
        ))}
      </div>

      {/* Records List / Responsive Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            Querying blockchain transaction receipts...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No transactions matching selected category.
          </div>
        ) : (
          filteredRecords.map((r, idx) => {
            const isDispute = r.transactionType?.toLowerCase().includes('dispute');
            return (
              <div
                key={r.transactionId || idx}
                className={`p-5 sm:p-6 rounded-3xl bg-white border transition-all hover:shadow-md space-y-4 ${
                  isDispute ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs sm:text-sm text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                      {r.propertyId}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isDispute
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-teal-50 text-teal-800 border border-teal-200'
                      }`}
                    >
                      {r.transactionType}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-500">
                      Block #{r.blockNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(r.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                {/* Conveyance Ownership Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <span className="text-slate-400 font-medium">From / Origin:</span>
                    <p className="font-semibold text-slate-800 text-sm">{r.fromOwner}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <span className="text-slate-400 font-medium">To / Grantee:</span>
                    <p className="font-bold text-teal-900 text-sm">{r.toOwner}</p>
                  </div>
                </div>

                {/* Hashes: Transaction Hash, Previous Tx, and Document Hash */}
                <div className="space-y-2 text-xs">
                  {/* Tx Hash */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-medium">Transaction Hash (Receipt):</span>
                      <button
                        onClick={() => handleCopy(r.txHash, `tx-${idx}`)}
                        className="text-teal-600 hover:underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        {copiedId === `tx-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === `tx-${idx}` ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 font-mono text-[11px] text-slate-700 break-all border border-slate-200/70 select-all">
                      {r.txHash}
                    </div>
                  </div>

                  {/* Document Hash */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-medium">Document SHA-256 Digest:</span>
                      <button
                        onClick={() => handleCopy(r.documentHash, `doc-${idx}`)}
                        className="text-teal-600 hover:underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        {copiedId === `doc-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === `doc-${idx}` ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="p-2.5 rounded-xl bg-teal-50/40 font-mono text-[11px] text-teal-900 break-all border border-teal-200/60 select-all">
                      {r.documentHash}
                    </div>
                  </div>
                </div>

                {/* Footer specs */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-400 font-mono border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span>Status: <strong className="text-emerald-600 font-sans">Confirmed</strong></span>
                    <span>Confirmations: <strong>{r.confirmations || 12}</strong></span>
                  </div>
                  <span>Gas Consumed: {r.gasUsed || '142,850 Gwei'}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
