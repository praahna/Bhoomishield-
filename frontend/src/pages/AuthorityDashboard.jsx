import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Building,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Search,
  Filter,
  Eye,
  Check,
  RefreshCw,
  PieChart as PieIcon,
  TrendingUp,
  FileText,
  Lock
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import api from '../services/api';
import RiskBadge from '../components/RiskBadge';

export default function AuthorityDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchAuthorityData = async () => {
    setLoading(true);
    try {
      const [statsRes, propRes] = await Promise.all([
        api.get('/properties/stats'),
        api.get('/properties'),
      ]);
      setStats(statsRes.data);
      setProperties(propRes.data.properties || []);
    } catch (err) {
      console.error('Failed to load authority data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthorityData();
  }, []);

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.propertyId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.surveyNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      p.verificationStatus?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const pieData = stats?.riskDistribution || [
    { name: 'Low Risk', value: 2, color: '#10b981' },
    { name: 'Medium Risk', value: 2, color: '#f59e0b' },
    { name: 'High Risk', value: 1, color: '#ef4444' },
  ];

  const trendData = stats?.monthlyTrends || [
    { month: 'Nov 2025', verified: 5, flagged: 1 },
    { month: 'Dec 2025', verified: 8, flagged: 0 },
    { month: 'Jan 2026', verified: 12, flagged: 2 },
    { month: 'Feb 2026', verified: 14, flagged: 1 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950 px-2.5 py-0.5 rounded border border-purple-800">
              Sub-Registrar Authority Console
            </span>
            <span className="text-xs text-slate-400">Government of Karnataka</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Revenue Department Verification Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Cadastral title inspection, litigation risk oversight, and fraudulent mutation interception.
          </p>
        </div>

        <button
          onClick={fetchAuthorityData}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
          Refresh Records
        </button>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-medium text-slate-500">Total Parcels</span>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">
            {stats?.totalProperties || properties.length}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-medium text-emerald-700">Verified Titles</span>
          <p className="text-2xl font-extrabold text-emerald-700 font-mono">
            {stats?.verifiedProperties || 2}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-medium text-amber-700">Pending Reviews</span>
          <p className="text-2xl font-extrabold text-amber-700 font-mono">
            {stats?.pendingReviews || 2}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-medium text-rose-700">High Risk Parcels</span>
          <p className="text-2xl font-extrabold text-rose-700 font-mono">
            {stats?.highRiskProperties || 1}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-medium text-rose-700">Flagged Disputes</span>
          <p className="text-2xl font-extrabold text-rose-700 font-mono">
            {stats?.flaggedProperties || 1}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-medium text-purple-700">Active Alerts</span>
          <p className="text-2xl font-extrabold text-purple-700 font-mono">
            {stats?.activeAlerts || 2}
          </p>
        </div>
      </div>

      {/* Visual Charts: Risk Distribution + Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Pie Chart */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-teal-600" />
              Registry Risk Distribution Breakdown
            </h3>
            <span className="text-xs text-slate-500 font-medium">All Monitored Parcels</span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Title Clearances vs Dispute Flags
            </h3>
            <span className="text-xs text-slate-500 font-medium">Monthly Velocity</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="verified" fill="#10b981" name="Verified Deeds" radius={[4, 4, 0, 0]} />
                <Bar dataKey="flagged" fill="#ef4444" name="Flagged Litigations" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Property Records Table / Mobile Responsive Cards */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Cadastral Registry Master Records</h3>
            <p className="text-xs text-slate-500">Official land parcel records under sub-registrar jurisdiction</p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search owner or ID..."
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 text-slate-900 w-44 sm:w-56"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-xl border border-slate-300 text-slate-900 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Flagged">Flagged</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View (>= 1024px) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Property ID</th>
                <th className="py-3 px-4">Recorded Owner</th>
                <th className="py-3 px-4">Survey #</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">AI Risk Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProperties.map((p) => (
                <tr key={p.propertyId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-teal-800">
                    {p.propertyId}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {p.ownerName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {p.surveyNumber}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                    {p.address}, {p.city}
                  </td>
                  <td className="py-3.5 px-4">
                    <RiskBadge level={p.riskLevel} score={p.riskScore} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        p.verificationStatus === 'Verified'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : p.verificationStatus === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {p.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/verify?q=${p.propertyId}`)}
                        className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold text-xs transition-colors"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => navigate(`/history?q=${p.propertyId}`)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                      >
                        Timeline
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile & Tablet Card Layout (< 1024px) - Requirement 5.J */}
        <div className="lg:hidden space-y-3">
          {filteredProperties.map((p) => (
            <div
              key={p.propertyId}
              className={`p-4 rounded-2xl border transition-all ${
                p.isConflictFlagged ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <span className="font-mono font-bold text-xs text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  {p.propertyId}
                </span>
                <RiskBadge level={p.riskLevel} score={p.riskScore} size="sm" />
              </div>

              <div className="py-2.5 space-y-1 text-xs">
                <p className="font-bold text-slate-900 text-sm">{p.ownerName}</p>
                <p className="text-slate-500">
                  Survey: <strong>{p.surveyNumber}</strong> • {p.city}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">Status:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.verificationStatus === 'Verified'
                        ? 'bg-emerald-50 text-emerald-700'
                        : p.verificationStatus === 'Pending'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {p.verificationStatus}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => navigate(`/verify?q=${p.propertyId}`)}
                  className="flex-1 py-2 text-center rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold text-xs transition-colors"
                >
                  Review Details
                </button>
                <button
                  onClick={() => navigate(`/history?q=${p.propertyId}`)}
                  className="flex-1 py-2 text-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Conveyance Log
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
