import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  History,
  Blocks,
  ArrowRight,
  Lock,
  User,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Search,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';

export default function OwnershipHistoryPage() {
  const location = useLocation();
  const [selectedPropId, setSelectedPropId] = useState('PROP-10234');
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedTx, setCopiedTx] = useState('');

  const sampleProperties = ['PROP-10234', 'PROP-44321', 'PROP-9087', 'PROP-7712', 'PROP-55321'];

  const fetchPropertyHistory = async (id) => {
    setLoading(true);
    try {
      const res = await api.get(`/properties/${id}`);
      setPropertyData(res.data);
    } catch (err) {
      console.error('History fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qParam = params.get('q');
    const target = qParam || 'PROP-10234';
    setSelectedPropId(target);
    fetchPropertyHistory(target);
  }, [location.search]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(id);
    setTimeout(() => setCopiedTx(''), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold">
          <History className="w-3.5 h-3.5" />
          Decentralized Conveyance Audit
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Property Ownership History & Chain of Title
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Chronological title conveyance timeline verified against the immutable blockchain ledger.
        </p>
      </div>

      {/* Property Selector Bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs">
        <span className="font-semibold text-slate-600 ml-1">Select Property:</span>
        {sampleProperties.map((pid) => (
          <button
            key={pid}
            onClick={() => {
              setSelectedPropId(pid);
              fetchPropertyHistory(pid);
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
              selectedPropId === pid
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {pid}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs">
          Loading immutable conveyance chain...
        </div>
      ) : propertyData?.property ? (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {propertyData.property.propertyId}
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                {propertyData.property.propertyType} • {propertyData.property.city}
              </h2>
              <p className="text-xs text-slate-500">
                Survey Number: <strong>{propertyData.property.surveyNumber}</strong> • Current Recorded Owner: <strong>{propertyData.property.ownerName}</strong>
              </p>
            </div>
            <div className="text-right sm:border-l sm:pl-6 border-slate-100 text-xs space-y-1">
              <span className="text-slate-500">Total Conveyances</span>
              <p className="text-2xl font-extrabold text-slate-900 font-mono">
                {propertyData.transactions?.length || 1}
              </p>
              <span className="text-[11px] text-teal-600 font-medium">Chain Intact</span>
            </div>
          </div>

          {/* Chronological Timeline */}
          <div className="relative pl-6 sm:pl-8 border-l-2 border-teal-500/30 space-y-8 sm:space-y-10 my-6">
            {propertyData.transactions?.map((tx, index) => {
              const isDispute = tx.transactionType?.toLowerCase().includes('dispute');
              return (
                <div key={tx.transactionId || index} className="relative group">
                  {/* Timeline Node Dot */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-xs ${
                      isDispute ? 'bg-rose-500' : 'bg-teal-600'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  {/* Timeline Event Card */}
                  <div
                    className={`p-5 rounded-2xl border transition-all ${
                      isDispute
                        ? 'bg-rose-50/60 border-rose-300'
                        : 'bg-white border-slate-200 shadow-xs hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isDispute
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-teal-50 text-teal-800 border border-teal-200'
                          }`}
                        >
                          {tx.transactionType}
                        </span>
                        <span className="font-mono text-xs text-slate-500 font-semibold">
                          Block #{tx.blockNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(tx.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Parties involved */}
                    <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-slate-400 font-medium">Grantor / Previous Title:</span>
                        <p className="font-semibold text-slate-800 text-sm">{tx.fromOwner}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-slate-400 font-medium">Grantee / New Conveyance:</span>
                        <p className="font-bold text-teal-800 text-sm">{tx.toOwner}</p>
                      </div>
                    </div>

                    {/* Hashes and references */}
                    <div className="pt-3 border-t border-slate-100/80 space-y-2 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono text-[11px] text-slate-500">
                        <span className="truncate max-w-sm">Tx Hash: {tx.txHash}</span>
                        <button
                          onClick={() => handleCopy(tx.txHash, `tx-${index}`)}
                          className="text-teal-600 hover:underline flex items-center gap-1 self-start sm:self-auto"
                        >
                          {copiedTx === `tx-${index}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedTx === `tx-${index}` ? 'Copied' : 'Copy Tx'}</span>
                        </button>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 font-mono text-[11px] text-slate-600 break-all border border-slate-200/60">
                        <span className="text-slate-400 font-sans font-medium mr-1">Deed Hash:</span>
                        {tx.documentHash}
                      </div>

                      {tx.remarks && (
                        <p className="text-xs text-rose-700 italic bg-rose-50 p-2 rounded-lg border border-rose-200">
                          {tx.remarks}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
