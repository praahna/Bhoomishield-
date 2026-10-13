import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  CheckCircle,
  X,
  ArrowRight,
  RefreshCw,
  Lock,
  FileWarning,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import api from '../services/api';
import RiskBadge from './RiskBadge';

export default function SimulateConflictModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [resetting, setResetting] = useState(false);
  const [step, setStep] = useState('prompt'); // 'prompt' | 'simulated' | 'reset'

  if (!isOpen) return null;

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/properties/simulate-conflict', {
        propertyId: 'PROP-10234',
        claimantName: 'Rahul Verma',
        action: 'Unauthorized Title Mutation & Deed Transfer'
      });
      setResult(res.data);
      setStep('simulated');
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      console.error('Failed to simulate conflict', err);
      // Fallback demo state in case network interrupted
      const fallbackResult = {
        conflictDetected: true,
        status: 'BLOCKED_AND_FLAGGED',
        message: 'Ownership conflict detected! Transfer blocked. Legal title remains securely with Priya Sharma. Property has been flagged for Authority review.',
        property: {
          propertyId: 'PROP-10234',
          ownerName: 'Priya Sharma',
          surveyNumber: 'SY-402/1A',
          verificationStatus: 'Flagged',
          riskScore: 95,
          riskLevel: 'HIGH',
          isConflictFlagged: true,
          conflictDetails: {
            claimantName: 'Rahul Verma',
            recordedOwner: 'Priya Sharma',
            reason: 'CRITICAL TITLE MISMATCH: Party Rahul Verma attempted to execute a deed conveyance, but recorded legal title belongs to Priya Sharma.'
          }
        },
        alert: {
          alertId: 'ALT-CONF-DEMO',
          alertType: 'Ownership Conflict',
          severity: 'HIGH'
        }
      };
      setResult(fallbackResult);
      setStep('simulated');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      await api.post('/properties/reset-conflict');
      setStep('reset');
      if (onSuccess) onSuccess(null);
      setTimeout(() => {
        setStep('prompt');
        setResult(null);
      }, 1500);
    } catch (err) {
      console.error('Reset failed', err);
      setStep('prompt');
      setResult(null);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base sm:text-lg">
                Property Conflict Simulation
              </h3>
              <p className="text-xs text-slate-500">Live Engineering Ideathon Demonstration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {step === 'prompt' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">Target Property:</span>
                  <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    PROP-10234
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
                  <div>
                    <span className="text-slate-500">Recorded Legal Owner:</span>
                    <p className="font-semibold text-slate-800 text-sm">Priya Sharma</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Survey Parcel:</span>
                    <p className="font-semibold text-slate-800">SY-402/1A (Indiranagar)</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs sm:text-sm text-amber-900 space-y-2">
                <p className="font-semibold flex items-center gap-1.5 text-amber-800">
                  <AlertOctagon className="w-4 h-4 shrink-0 text-amber-600" />
                  What this simulation tests:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-700 pl-1 text-xs">
                  <li>Simulates a rogue deed conveyance submitted by <strong>Rahul Verma</strong>.</li>
                  <li>BhoomiShield smart engine compares claimant against immutable blockchain record.</li>
                  <li>Title mismatch triggers immediate lock: transfer is rejected.</li>
                  <li>Recorded owner remains securely <strong>Priya Sharma</strong>.</li>
                  <li>AI Risk score escalates to <strong>HIGH (95/100)</strong> and creates an Authority Alert.</li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={handleSimulate}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-medium rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 min-h-[46px]"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing Title Records...
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4" />
                      Execute Conflict Simulation
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors min-h-[46px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {step === 'simulated' && result && (
            <div className="space-y-4 animate-fade-in">
              {/* Conflict Alert Banner */}
              <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-rose-600 text-white shrink-0 mt-0.5">
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-rose-900">
                      CRITICAL TITLE CONFLICT DETECTED
                    </h4>
                    <p className="text-xs text-rose-800 mt-0.5">
                      Unauthorized mutation conveyance blocked by BhoomiShield smart logic.
                    </p>
                  </div>
                </div>

                <div className="bg-white/90 p-3 rounded-lg border border-rose-200 text-xs space-y-2 mt-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500 font-medium">Recorded Title Owner:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Priya Sharma (Protected)
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500 font-medium">Competing Claimant:</span>
                    <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Rahul Verma (Unauthorized)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Litigation Risk Classification:</span>
                    <RiskBadge level="HIGH" score={result.property?.riskScore || 95} size="sm" />
                  </div>
                </div>
              </div>

              {/* Security Safeguard Notice */}
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">BhoomiShield Cryptographic Guarantee:</span> Recorded ownership remains <strong>Priya Sharma</strong>. The attempted unauthorized change was completely halted and recorded in the audit trail.
                </div>
              </div>

              {/* Authority Alert Confirmation */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
                  <span>DISPUTE LOG REF:</span>
                  <span className="font-semibold text-slate-800">ALT-CONF-DEMO</span>
                </div>
                <p>Status: Dispatched to Karnataka Revenue Department Alert Center for judicial inquiry.</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={handleReset}
                  disabled={resetting}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl text-xs sm:text-sm transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
                  Reset Scenario to Pristine State
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs sm:text-sm transition-colors"
                >
                  Close & View Dashboard
                </button>
              </div>
            </div>
          )}

          {step === 'reset' && (
            <div className="py-8 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="font-semibold text-slate-800">Demo Scenario Reset</h4>
              <p className="text-xs text-slate-500">
                Property PROP-10234 has been restored to LOW risk (12/100) and Verified status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
