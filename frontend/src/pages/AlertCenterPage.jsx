import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ShieldAlert,
  AlertOctagon,
  CheckCircle2,
  Clock,
  MessageSquare,
  RefreshCw,
  Send,
  Eye,
  Filter,
  Check
} from 'lucide-react';
import api from '../services/api';

export default function AlertCenterPage() {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [newRemark, setNewRemark] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/alerts');
      setAlerts(res.data.alerts || []);
      if (res.data.alerts?.length > 0 && !selectedAlert) {
        setSelectedAlert(res.data.alerts[0]);
      }
    } catch (err) {
      console.error('Failed to load alerts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAddRemark = async (e) => {
    e.preventDefault();
    if (!newRemark.trim() || !selectedAlert) return;

    setUpdating(true);
    try {
      const res = await api.post(`/alerts/${selectedAlert.alertId}/remarks`, {
        comment: newRemark.trim(),
      });
      setSelectedAlert(res.data.alert);
      setNewRemark('');
      fetchAlerts();
    } catch (err) {
      console.error('Failed to add remark', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedAlert) return;

    setUpdating(true);
    try {
      const res = await api.patch(`/alerts/${selectedAlert.alertId}/status`, {
        status,
        remarks: `Status updated to '${status}' by Sub-Registrar Reviewer.`
      });
      setSelectedAlert(res.data.alert);
      fetchAlerts();
    } catch (err) {
      console.error('Status update failed', err);
    } finally {
      setUpdating(false);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (statusFilter === 'ALL') return true;
    return a.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            <AlertOctagon className="w-3.5 h-3.5" />
            Caveat & Dispute Sentinel
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Property Litigation Alert Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review active conflicting claims, add registrar remarks, and resolve adjudicated title caveats.
          </p>
        </div>

        <button
          onClick={fetchAlerts}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
          Refresh Alerts
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        {['ALL', 'ACTIVE', 'UNDER REVIEW', 'RESOLVED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
              statusFilter === st
                ? 'bg-navy-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Main Split: Alert List & Selected Alert Review Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Alerts List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200">
              Fetching dispute caveats...
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200">
              No dispute alerts found under selected filter.
            </div>
          ) : (
            filteredAlerts.map((alt) => (
              <div
                key={alt.alertId}
                onClick={() => setSelectedAlert(alt)}
                className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                  selectedAlert?.alertId === alt.alertId
                    ? 'border-purple-500 bg-purple-50/20 shadow-md ring-2 ring-purple-200'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <span className="font-mono font-bold text-xs text-slate-800">
                    {alt.alertId}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      alt.status === 'Active'
                        ? 'bg-rose-100 text-rose-700'
                        : alt.status === 'Under Review'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    ● {alt.status}
                  </span>
                </div>

                <div className="py-2 space-y-1">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                    {alt.alertType}: {alt.propertyId}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-2">
                    {alt.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-medium">
                  <span>Claimant: {alt.claimantName}</span>
                  <span>{new Date(alt.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Detailed Dossier & Adjudication Controls (7 cols) */}
        <div className="lg:col-span-7">
          {selectedAlert ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {selectedAlert.propertyId}
                    </span>
                    <span className="font-mono text-xs text-slate-500 font-semibold">
                      Ref: {selectedAlert.alertId}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    {selectedAlert.alertType}
                  </h2>
                </div>

                <span
                  className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold ${
                    selectedAlert.status === 'Active'
                      ? 'bg-rose-100 text-rose-800'
                      : selectedAlert.status === 'Under Review'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {selectedAlert.status}
                </span>
              </div>

              {/* Dispute Description Banner */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Cadastral Dispute Narrative</span>
                </div>
                <p className="leading-relaxed text-rose-900">
                  {selectedAlert.description}
                </p>
              </div>

              {/* Competing Claim Parties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-slate-400 font-medium">Recorded Legal Title Holder:</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedAlert.recordedOwner}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-slate-400 font-medium">Competing Claimant / Caveator:</span>
                  <p className="font-bold text-rose-800 text-sm">{selectedAlert.claimantName}</p>
                </div>
              </div>

              {/* Status Update Action Bar */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-700 block">Adjudication Action:</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus('Under Review')}
                    disabled={updating || selectedAlert.status === 'Under Review'}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors disabled:opacity-50"
                  >
                    Mark Under Review
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('Resolved')}
                    disabled={updating || selectedAlert.status === 'Resolved'}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Resolve & Clear Title
                  </button>
                  <button
                    onClick={() => navigate(`/verify?q=${selectedAlert.propertyId}`)}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold transition-colors"
                  >
                    Inspect Parcel
                  </button>
                </div>
              </div>

              {/* Remarks History */}
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                  Official Investigation Notes & Remarks ({selectedAlert.remarks?.length || 0})
                </h3>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedAlert.remarks?.map((r, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <strong className="text-slate-800">{r.author}</strong>
                        <span>{new Date(r.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-700">{r.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Add new remark */}
                <form onSubmit={handleAddRemark} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newRemark}
                    onChange={(e) => setNewRemark(e.target.value)}
                    placeholder="Add official inquiry note or judicial docket reference..."
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 text-slate-900"
                  />
                  <button
                    type="submit"
                    disabled={updating || !newRemark.trim()}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Add Note
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              Select an alert from the left column to view dossier and case remarks.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
