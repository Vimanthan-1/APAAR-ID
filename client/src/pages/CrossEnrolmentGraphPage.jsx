import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LinkGraph from '../components/LinkGraph';

export default function CrossEnrolmentGraphPage() {
  const navigate = useNavigate();
  const [selectedCase, setSelectedCase] = useState('AARAV'); // AARAV, FATIMA, PRIYA
  const [actionNotice, setActionNotice] = useState(null);

  const cases = {
    AARAV: {
      name: 'Aarav Vikram Sharma',
      apaarId: '9821-4567-8910',
      anomalyType: 'CONCURRENT_DUAL_ENROLMENT',
      severity: 'HIGH',
      description:
        'APAAR ID 9821-4567-8910 holds simultaneous active regular full-time admissions in two approved institutions.',
      institutions: [
        'Demo Institute of Technology (B.Tech CSE - TFWS Quota)',
        'Apex Institute of Engineering & Technology (B.Tech IT - General Quota)',
      ],
      rule: 'AICTE Approval Process Handbook (Section 3.4.1): Simultaneous enrolment in more than one full-time technical program is strictly prohibited.',
    },
    FATIMA: {
      name: 'Fatima Al-Zahra',
      apaarId: '8721-3948-5012',
      anomalyType: 'INTERNATIONAL_QUOTA_AUDIT',
      severity: 'COMPLIANT',
      description: 'Foreign National (FN) quota allocation verified authentic with valid embassy clearance.',
      institutions: ['Demo Institute of Technology (B.Tech CSE - FN Quota)'],
      rule: 'AICTE International Student Admission Guidelines (Section 21).',
    },
    PRIYA: {
      name: 'Priya Sundaram Patel',
      apaarId: '1092-8374-6512',
      anomalyType: 'INTAKE_CAPACITY_OVERRUN',
      severity: 'HIGH',
      description: 'Student enrolled under management quota exceeding approved institutional intake cap.',
      institutions: ['Demo Institute of Technology (B.Tech CSE - Seat #71/60)'],
      rule: 'AICTE Regulation on Intake Quota Compliance (Sub-clause 7.2).',
    },
  };

  const currentCase = cases[selectedCase];

  const handleAction = (label) => {
    setActionNotice(`Statutory determination logged: "${label}" has been issued to concerned institutions.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1F6FEB]/10 text-[#1F6FEB] border border-[#1F6FEB]/30">
                AICTE Graph Intelligence
              </span>
              <span className="text-xs text-slate-400 font-mono">Module: Cross-Institution Enrolment Visualizer</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              National APAAR Cross-Institution Enrolment Graph
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Interactive entity relationship graph detecting concurrent dual enrolments, seat blocking, and regulatory intake quota breaches.
            </p>
          </div>

          {/* Case Switcher */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">Investigation Subject:</span>
            <button
              onClick={() => setSelectedCase('AARAV')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCase === 'AARAV'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚠️ Aarav Sharma (Duplicate)
            </button>
            <button
              onClick={() => setSelectedCase('FATIMA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCase === 'FATIMA'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✓ Fatima (Foreign National)
            </button>
            <button
              onClick={() => setSelectedCase('PRIYA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCase === 'PRIYA'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ▲ Priya Patel (Intake Breach)
            </button>
          </div>
        </div>
      </div>

      {/* Case Details Alert Banner */}
      <div
        className={`rounded-2xl border p-5 transition-all ${
          currentCase.severity === 'HIGH'
            ? 'bg-red-50/70 border-red-200 text-red-950'
            : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  currentCase.severity === 'HIGH' ? 'bg-red-500 animate-ping' : 'bg-emerald-500'
                }`}
              ></span>
              <span className="font-bold text-sm">
                Target: {currentCase.name} · APAAR:{' '}
                <span className="font-mono">{currentCase.apaarId}</span>
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  currentCase.severity === 'HIGH'
                    ? 'bg-red-200 text-red-800'
                    : 'bg-emerald-200 text-emerald-800'
                }`}
              >
                {currentCase.anomalyType.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed max-w-4xl">{currentCase.description}</p>
            <div className="text-[11px] text-slate-500 italic">
              <strong>Regulatory Reference:</strong> {currentCase.rule}
            </div>
          </div>

          {/* Action Buttons for AICTE Officers */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => handleAction('Issue Show-Cause Notice')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Issue Show-Cause Notice
            </button>
            <button
              onClick={() => handleAction('Order Secondary Seat Cancellation')}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Order Seat Cancellation
            </button>
          </div>
        </div>

        {actionNotice && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <span>✓</span>
            <span>{actionNotice}</span>
          </div>
        )}
      </div>

      {/* Main Interactive Graph Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[650px] relative">
        {/* Canvas Toolbar */}
        <div className="p-3.5 px-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700">Legend:</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1F6FEB]"></span> Student (APAAR Identity)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#0F2A4A]"></span> AICTE Approved College
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-600"></span> Academic Depository (CBSE / ABC)
            </span>
            <span className="flex items-center gap-1.5 text-red-600 font-bold">
              <span className="w-2.5 h-2.5 rounded bg-red-500 animate-pulse"></span> Regulatory Anomaly
            </span>
          </div>

          <div className="text-slate-400 font-mono text-[11px]">
            Click any node or connector to view authoritative entity payload
          </div>
        </div>

        {/* Embedded LinkGraph Component */}
        <div className="flex-1 w-full h-full relative">
          <LinkGraph appId="APP-001" />
        </div>
      </div>
    </div>
  );
}
