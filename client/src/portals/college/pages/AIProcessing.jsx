import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AIProcessing() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {
    submittedCount: 4,
    flaggedCount: 3,
    fileName: 'conflicts_edge_cases.csv',
  };

  const steps = [
    {
      title: 'Batch Extraction & Field Standardization',
      desc: 'Extracted student identifiers, course codes, and quota declarations.',
      status: 'COMPLETE',
      time: '0.4s',
    },
    {
      title: 'APAAR Checksum & DigiLocker Handshake',
      desc: 'Validated 12-digit format and queried National Academic Depository (NAD).',
      status: 'WARNING',
      note: '1 record failed Verhoeff checksum algorithm.',
      time: '1.2s',
    },
    {
      title: 'Intra-Batch De-Duplication',
      desc: 'Screened against duplicate submissions within the institutional batch.',
      status: 'WARNING',
      note: '1 duplicate entry detected for APAAR 9821-4567-8910.',
      time: '0.6s',
    },
    {
      title: 'National Cross-Institution Conflict Scan',
      desc: 'Screened all active full-time enrolments across 12,000+ AICTE approved colleges.',
      status: 'ALERT',
      note: 'CRITICAL: Concurrent active enrollment detected at Apex Institute of Engineering.',
      time: '1.8s',
    },
    {
      title: 'Intake Capacity & Quota Reconciliation',
      desc: 'Reconciled branch enrollment against approved statutory seat matrix.',
      status: 'ALERT',
      note: 'Total enrolled (138) exceeds statutory approved cap (120). Intake breach +18.',
      time: '0.5s',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                AICTE Validation Engine Execution
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                Processed Batch
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Automated multi-tier verification results for batch: <strong className="font-mono text-slate-700">{state.fileName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/college/deficiencies')}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Inspect Flagged Deficiencies</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Processed Records</div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{state.submittedCount} Students</div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">Ingested into Central Ledger</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Anomalies Detected</div>
          <div className="mt-2 text-3xl font-extrabold text-red-600">{state.flaggedCount} Flagged</div>
          <div className="mt-1 text-xs text-red-500 font-medium">Requires Institutional Resolution</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pipeline Latency</div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">4.5 Seconds</div>
          <div className="mt-1 text-xs text-slate-500">Real-time National Cross-check</div>
        </div>
      </div>

      {/* Step by step timeline */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Automated Validation Pipeline</h2>
          <span className="text-xs font-medium text-slate-500 font-mono">5 Stages Executed</span>
        </div>

        {/* Scanning Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-500 h-1.5 rounded-full w-full animate-scan" />
        </div>

        <div className="space-y-3 pt-2">
          {steps.map((st, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 90}ms` }}
              className={`p-4 rounded-xl border transition-all animate-slide-up ${
                st.status === 'ALERT'
                  ? 'border-red-300 bg-red-50/60'
                  : st.status === 'WARNING'
                  ? 'border-amber-300 bg-amber-50/60'
                  : 'border-emerald-200 bg-emerald-50/40'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                      st.status === 'ALERT'
                        ? 'bg-red-600 text-white'
                        : st.status === 'WARNING'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {st.status === 'ALERT' ? '!' : st.status === 'WARNING' ? '▲' : '✓'}
                  </div>

                  <div>
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span>{st.title}</span>
                      <span className="text-xs font-mono text-slate-500">({st.time})</span>
                    </div>
                    <div className="text-xs text-slate-700 mt-0.5">{st.desc}</div>
                    {st.note && (
                      <div className="mt-2 text-xs font-semibold text-red-900 bg-red-100/90 border border-red-200 px-3 py-1.5 rounded-lg inline-block shadow-2xs">
                        ⚠️ {st.note}
                      </div>
                    )}
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 border ${
                    st.status === 'ALERT'
                      ? 'bg-red-100 text-red-900 border-red-300'
                      : st.status === 'WARNING'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  }`}
                >
                  {st.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
