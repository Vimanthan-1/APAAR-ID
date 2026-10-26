import React, { useState } from 'react';
import LinkGraph from '../../../components/LinkGraph.jsx';

export default function Deficiencies() {
  const [showGraphModal, setShowGraphModal] = useState(false);
  const [resolvedIds, setResolvedIds] = useState(new Set());
  const [actionNotices, setActionNotices] = useState({});
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, CRITICAL, RESOLVED

  const anomalies = [
    {
      id: 'ANOM-001',
      studentName: 'Aarav Vikram Sharma',
      apaarId: '9821-4567-8910',
      rollNo: 'CS-2026-042',
      type: 'CONCURRENT_DUAL_ENROLMENT',
      category: 'Dual Regular Registration',
      severity: 'HIGH',
      badgeColor: 'bg-red-50 text-red-800 border-red-200',
      title: 'Cross-Institution Duplicate Enrolment Conflict',
      description:
        'APAAR 9821-4567-8910 is simultaneously enrolled in two distinct full-time AICTE-approved regular programs.',
      conflictingInstitute: 'Apex Institute of Engineering & Technology (Bengaluru)',
      conflictingCourse: 'B.Tech Information Technology (Roll: IT-2026-118)',
      statutoryRule:
        'AICTE Approval Process Handbook (Section 3.4.1): Prohibits simultaneous registration in two regular degree programs. Dual TFWS government scholarship claim detected.',
      actions: [
        { label: 'Upload Student Transfer Certificate (TC)', key: 'tc' },
        { label: 'Revoke Duplicate Admission Seat', key: 'revoke' },
        { label: 'Issue Show-Cause Notice to Candidate', key: 'notice' },
      ],
      hasGraph: true,
    },
    {
      id: 'ANOM-002',
      studentName: 'Priya Sundaram Patel & 11 Others',
      apaarId: '1092-8374-6512',
      rollNo: 'CS-2026-071',
      type: 'INTAKE_CAPACITY_BREACH',
      category: 'Intake Quota Violation',
      severity: 'HIGH',
      badgeColor: 'bg-red-50 text-red-800 border-red-200',
      title: 'Approved Intake Cap Exceeded (+12 Students in B.Tech CSE)',
      description:
        'Admissions enrolled (72) exceed the statutory approved intake cap of 60 (+ 8 supernumerary).',
      statutoryRule:
        'AICTE Regulation on Intake Quota Compliance (Sub-clause 7.2): Unapproved excess intake invalidates statutory degree registration.',
      actions: [
        { label: 'Reallocate to Supernumerary Vacancy', key: 'reallocate' },
        { label: 'Submit Penalty Regularization Appeal', key: 'appeal' },
      ],
      hasGraph: false,
    },
    {
      id: 'ANOM-003',
      studentName: 'Rohan Kumar Verma',
      apaarId: '9999-0000-1111',
      rollNo: 'AI-2026-064',
      type: 'INVALID_APAAR_FORMAT',
      category: 'Identity Depository Desync',
      severity: 'MEDIUM',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      title: 'Invalid APAAR Format / Verhoeff Checksum Failure',
      description:
        'APAAR ID failed Verhoeff checksum algorithm and has no matching DigiLocker / ABC seeded identity in national registry.',
      statutoryRule:
        'Mandatory APAAR linkage protocol for AICTE technical education registries.',
      actions: [
        { label: 'Re-trigger DigiLocker SMS OTP', key: 'otp' },
        { label: 'Update Corrected APAAR ID', key: 'update' },
      ],
      hasGraph: false,
    },
  ];

  const handleExecuteAction = (id, actionLabel) => {
    setActionNotices((prev) => ({
      ...prev,
      [id]: `Remediation initiated: ${actionLabel}. Transmitted to AICTE Regulation Bureau.`,
    }));
    setTimeout(() => {
      setResolvedIds((prev) => new Set([...prev, id]));
    }, 900);
  };

  const handleUndoResolve = (id) => {
    setResolvedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setActionNotices((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const filtered = anomalies.filter((a) => {
    if (activeTab === 'RESOLVED') return resolvedIds.has(a.id);
    if (activeTab === 'CRITICAL') return a.severity === 'HIGH' && !resolvedIds.has(a.id);
    return !resolvedIds.has(a.id);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                {anomalies.length - resolvedIds.size} Active Conflicts
              </span>
              <span className="text-xs text-slate-400 font-mono">Cycle AY 2026-27</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Flagged Enrolment Deficiencies &amp; Remediation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Automated AICTE scrutiny rules identified statutory discrepancies requiring institutional action before ratification.
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'ALL' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({anomalies.length - resolvedIds.size})
            </button>
            <button
              onClick={() => setActiveTab('CRITICAL')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'CRITICAL' ? 'bg-white shadow-xs text-red-700 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              High Severity
            </button>
            <button
              onClick={() => setActiveTab('RESOLVED')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'RESOLVED' ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Remediated ({resolvedIds.size})
            </button>
          </div>
        </div>
      </div>

      {/* Anomalies List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 animate-scale-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
              ✓
            </div>
            <div className="font-bold text-slate-900 text-lg">
              {activeTab === 'RESOLVED' ? 'No Deficiencies Remediated Yet' : 'All Deficiencies Remediated!'}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Institutional student enrollment records comply with AICTE Approval Process Handbook (AY 2026-27).
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const isResolved = resolvedIds.has(item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4 hover:border-slate-300 transition-all animate-slide-up"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${item.badgeColor}`}>
                        {item.severity} SEVERITY
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-600">
                        {item.category}
                      </span>
                      <span className="font-mono text-xs text-slate-400">ID: {item.id}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">{item.title}</h2>
                    <div className="text-xs text-slate-600">
                      Candidate: <strong className="text-slate-800">{item.studentName}</strong> · APAAR ID:{' '}
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {item.apaarId}
                      </span>{' '}
                      · Roll No: <span className="font-mono font-semibold text-slate-700">{item.rollNo}</span>
                    </div>
                  </div>

                  {item.hasGraph && (
                    <button
                      onClick={() => setShowGraphModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 shadow-2xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Investigate in Admission Graph</span>
                    </button>
                  )}
                </div>

                {/* Conflict Description Box */}
                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
                  <div className="text-slate-700 leading-relaxed font-medium">{item.description}</div>
                  {item.conflictingInstitute && (
                    <div className="pt-2 border-t border-slate-200 text-red-700 font-semibold flex items-start gap-1.5">
                      <span className="text-red-500 font-bold">⚠️</span>
                      <span>
                        Simultaneous Enrolment: <strong>{item.conflictingInstitute}</strong> ({item.conflictingCourse})
                      </span>
                    </div>
                  )}
                  <div className="pt-1 text-slate-500 italic">
                    <strong>Statutory Rule Reference:</strong> {item.statutoryRule}
                  </div>
                </div>

                {/* In-Flight Action Feedback Notice */}
                {actionNotices[item.id] && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-slide-up">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>{actionNotices[item.id]}</span>
                  </div>
                )}

                {/* Remediation Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                      Remediation Actions:
                    </span>
                    {!isResolved ? (
                      item.actions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleExecuteAction(item.id, act.label)}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold shadow-2xs transition-all cursor-pointer hover:border-slate-400 active:scale-98"
                        >
                          {act.label}
                        </button>
                      ))
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300">
                        <span>✓ Remediated &amp; Synchronized with Central Registry</span>
                      </span>
                    )}
                  </div>

                  <div>
                    {!isResolved ? (
                      <button
                        onClick={() => handleExecuteAction(item.id, 'Formal Compliance Ratification')}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                      >
                        Ratify &amp; Resolve Deficiency ✓
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUndoResolve(item.id)}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Undo Remediation
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cross-Institution Graph Modal */}
      {showGraphModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  TRACE
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    National APAAR Cross-Institution Enrolment Graph
                  </h3>
                  <p className="text-xs text-slate-300">
                    Investigating Simultaneous Regular Degree Registration · Candidate: <strong>Aarav Vikram Sharma (APAAR: 9821-4567-8910)</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowGraphModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-lg font-bold cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Graph Visualizer Canvas */}
            <div className="flex-1 w-full h-full relative">
              <LinkGraph appId="APP-001" />
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span> Student (APAAR)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-slate-800"></span> Technical College
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-600"></span> Academic Depository
                </span>
                <span className="flex items-center gap-1.5 text-red-600 font-bold">
                  <span className="w-3 h-3 rounded bg-red-500 animate-pulse"></span> Regulatory Conflict
                </span>
              </div>

              <button
                onClick={() => setShowGraphModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Close Visualizer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
