import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LinkGraph from '../../../components/LinkGraph.jsx';

export default function Deficiencies() {
  const navigate = useNavigate();
  const [showGraphModal, setShowGraphModal] = useState(false);
  const [resolvedIds, setResolvedIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, CRITICAL, PENDING

  const anomalies = [
    {
      id: 'ANOM-001',
      studentName: 'Aarav Vikram Sharma',
      apaarId: '9821-4567-8910',
      rollNo: 'CS-2026-042',
      type: 'CONCURRENT_DUAL_ENROLMENT',
      severity: 'HIGH',
      badgeColor: 'bg-red-100 text-red-800 border-red-300',
      title: 'Cross-Institution Duplicate Enrolment Conflict',
      description:
        'APAAR 9821-4567-8910 is simultaneously enrolled in two distinct full-time AICTE-approved regular programs.',
      conflictingInstitute: 'Apex Institute of Engineering & Technology (Bengaluru)',
      conflictingCourse: 'B.Tech Information Technology (Roll: IT-2026-118)',
      statutoryRule:
        'AICTE Approval Process Handbook (Section 3.4.1): Prohibits simultaneous registration in two regular degree programs. Dual TFWS government scholarship claim detected.',
      actions: [
        { label: 'Upload Student Transfer Certificate (TC)', type: 'upload' },
        { label: 'Revoke Duplicate Admission Seat', type: 'revoke' },
        { label: 'Issue Show-Cause Notice to Candidate', type: 'notice' },
      ],
      hasGraph: true,
    },
    {
      id: 'ANOM-002',
      studentName: 'Priya Sundaram Patel & 11 Others',
      apaarId: '1092-8374-6512',
      rollNo: 'CS-2026-071',
      type: 'INTAKE_CAPACITY_BREACH',
      severity: 'HIGH',
      badgeColor: 'bg-red-100 text-red-800 border-red-300',
      title: 'Approved Intake Cap Exceeded (+12 Students in B.Tech CSE)',
      description:
        'Admissions enrolled (72) exceed the statutory approved intake cap of 60 (+ 8 supernumerary).',
      statutoryRule:
        'AICTE Regulation on Intake Quota Compliance (Sub-clause 7.2): Unapproved excess intake invalidates statutory degree registration.',
      actions: [
        { label: 'Reallocate to Supernumerary Vacancy', type: 'reallocate' },
        { label: 'Submit Penalty Regularization Appeal', type: 'appeal' },
      ],
      hasGraph: false,
    },
    {
      id: 'ANOM-003',
      studentName: 'Rohan Kumar Verma',
      apaarId: '9999-0000-1111',
      rollNo: 'AI-2026-064',
      type: 'INVALID_APAAR_FORMAT',
      severity: 'MEDIUM',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      title: 'Invalid APAAR Format / Checksum Failure',
      description:
        'APAAR ID failed Verhoeff checksum algorithm and has no matching DigiLocker / ABC seeded identity.',
      statutoryRule:
        'Mandatory APAAR linkage protocol for AICTE technical registry.',
      actions: [
        { label: 'Re-trigger DigiLocker SMS OTP', type: 'otp' },
        { label: 'Update Corrected APAAR ID', type: 'update' },
      ],
      hasGraph: false,
    },
  ];

  const handleResolve = (id, actionLabel) => {
    setResolvedIds((prev) => new Set([...prev, id]));
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
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Flagged Enrolment Deficiencies</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                {anomalies.length - resolvedIds.size} Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              AICTE Automated Scrutiny Engine identified statutory conflicts requiring institutional remediation.
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'ALL' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Pending ({anomalies.length - resolvedIds.size})
            </button>
            <button
              onClick={() => setActiveTab('CRITICAL')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'CRITICAL' ? 'bg-white shadow-xs text-red-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              High Severity
            </button>
            <button
              onClick={() => setActiveTab('RESOLVED')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'RESOLVED' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-600 hover:text-slate-900'
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
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl">
              ✓
            </div>
            <div className="font-bold text-slate-800 text-base">All Filtered Deficiencies Remediated!</div>
            <p className="text-xs text-slate-500">Student enrollment registry is compliant with AICTE norms.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${item.badgeColor}`}>
                      {item.severity} SEVERITY
                    </span>
                    <span className="font-mono text-xs text-slate-400">ID: {item.id}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
                  <div className="text-xs text-slate-600">
                    Student: <strong className="text-slate-800">{item.studentName}</strong> · APAAR ID:{' '}
                    <span className="font-mono font-bold text-slate-800">{item.apaarId}</span> · Roll:{' '}
                    <span className="font-mono text-slate-600">{item.rollNo}</span>
                  </div>
                </div>

                {item.hasGraph && (
                  <button
                    onClick={() => setShowGraphModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1F6FEB] font-semibold text-xs border border-blue-200 shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>View Cross-Enrolment Graph</span>
                  </button>
                )}
              </div>

              {/* Description & Conflicting Details */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
                <div className="text-slate-700 leading-relaxed font-medium">{item.description}</div>
                {item.conflictingInstitute && (
                  <div className="pt-2 border-t border-slate-200 text-red-700 font-semibold flex items-start gap-1.5">
                    <span>⚠️</span>
                    <span>
                      Conflicting Record: {item.conflictingInstitute} ({item.conflictingCourse})
                    </span>
                  </div>
                )}
                <div className="pt-1 text-slate-500 italic">
                  <strong>Statutory Basis:</strong> {item.statutoryRule}
                </div>
              </div>

              {/* Remediation Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                    Institutional Actions:
                  </span>
                  {item.actions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleResolve(item.id, act.label)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleResolve(item.id, 'Mark Remediated')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Mark as Remediated ✓
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cross-Institution Graph Modal */}
      {showGraphModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  AI
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    National APAAR Cross-Institution Enrolment Graph
                  </h3>
                  <p className="text-xs text-slate-500">
                    Investigating Duplicate Full-Time Enrolment for APAAR: <strong>9821-4567-8910</strong> (Aarav Vikram Sharma)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowGraphModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-500 flex items-center justify-center text-lg font-bold cursor-pointer transition-colors"
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
                  <span className="w-3 h-3 rounded bg-red-500 animate-pulse"></span> Regulatory Anomaly
                </span>
              </div>

              <button
                onClick={() => setShowGraphModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Close Graph
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
