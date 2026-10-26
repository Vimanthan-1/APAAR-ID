import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ROLE, DEMO_RIBBON_TEXT } from '../constants';

const portalCards = [
  {
    role: ROLE.OFFICER,
    title: 'AICTE Central Surveillance',
    subtitle: 'National Monitoring & Graph Scrutiny',
    tag: 'Regulatory Authority',
    description:
      'Real-time student enrolment surveillance, approved intake quota cap enforcement, and automated cross-institution duplicate enrolment graph investigation.',
    route: '/officer/dashboard',
    color: 'from-[#0A192F] via-[#112240] to-[#1E3A8A]',
    accentBorder: 'border-blue-500/40',
    accentBg: 'bg-blue-600 hover:bg-blue-700',
    badge: '⭐ Central Authority',
    badgeColor: 'bg-blue-50 text-blue-900 border-blue-200',
    metrics: '8,940 Institutions · Live Graph Scrutiny',
    icon: (
      <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    role: ROLE.COLLEGE,
    title: 'Institution Registration Portal',
    subtitle: 'Batch Ingestion & Quota Matrix',
    tag: 'Academic Institution',
    description:
      'Ingest post-admission batches with 12-digit APAAR IDs, validate Verhoeff checksums, manage supernumerary quotas (NRI, OCI, FN, TFWS), and remediate anomalies.',
    route: '/college/application',
    color: 'from-[#042f2e] via-[#064e3b] to-[#047857]',
    accentBorder: 'border-emerald-500/40',
    accentBg: 'bg-emerald-700 hover:bg-emerald-800',
    badge: 'Approved Institution',
    badgeColor: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    metrics: 'AY 2026-27 Intake · Batch CSV Engine',
    icon: (
      <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    role: ROLE.VERIFIER,
    title: 'Public Stakeholder & Employer',
    subtitle: 'Instant APAAR Attestation & QR Scrutiny',
    tag: 'Verification Stakeholder',
    description:
      'Instant third-party verification for employers, embassies, and higher-ed institutions. Validate DigiLocker-linked APAAR credentials with cryptographic QR seals.',
    route: '/verify',
    color: 'from-[#082f49] via-[#0369a1] to-[#0284c7]',
    accentBorder: 'border-sky-500/40',
    accentBg: 'bg-sky-700 hover:bg-sky-800',
    badge: 'Public Verifier',
    badgeColor: 'bg-sky-50 text-sky-900 border-sky-200',
    metrics: 'Cryptographic QR Seal · Instant Attestation',
    icon: (
      <svg className="w-8 h-8 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
];

export default function Login() {
  const navigate = useNavigate();
  const setRole = useAppStore((state) => state.setRole);

  const handleSelectRole = (card) => {
    setRole(card.role);
    navigate(card.route);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800 antialiased font-sans">
      {/* Top Sovereign Header Bar */}
      <header className="bg-[#0A192F] text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            {/* TRACE Logo Shield */}
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-400/40 flex items-center justify-center shrink-0 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-blue-400"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <div className="text-base font-bold tracking-tight leading-tight text-white flex items-center gap-2">
                <span>TRACE</span>
                <span className="text-slate-400 font-normal">|</span>
                <span className="text-sm font-semibold text-slate-200">AICTE Student Verification Platform</span>
                <span className="hidden sm:inline-flex text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-700/50">
                  SIH26263
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Trust, Reconciliation, Audit &amp; Compliance Engine · Regulation Bureau
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></span>
              Central APAAR API Live
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-slate-800/90 text-amber-300 border border-slate-700">
              {DEMO_RIBBON_TEXT}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-14 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <div className="text-center mb-10 max-w-3xl animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 mb-4 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Problem Statement 26263 · Smart Automation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
            National APAAR-Based Student Data Management &amp; Verification Platform
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Ensuring authentic, verifiable student admissions for AICTE-approved institutions using the 12-digit <strong>APAAR ID</strong> as the single academic identifier. Real-time quota enforcement, supernumerary tracking, and cross-institution duplicate enrolment graph investigation.
          </p>

          {/* Key System Statistics Strip */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-xs">
              <div className="text-lg sm:text-xl font-black text-slate-900 font-mono">4.2M+</div>
              <div className="text-[11px] text-slate-500 font-medium">APAAR IDs Seeded</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-xs">
              <div className="text-lg sm:text-xl font-black text-blue-700 font-mono">8,940</div>
              <div className="text-[11px] text-slate-500 font-medium">AICTE Institutions</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-xs">
              <div className="text-lg sm:text-xl font-black text-emerald-700 font-mono">99.8%</div>
              <div className="text-[11px] text-slate-500 font-medium">Verhoeff Checksum Rate</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-xs">
              <div className="text-lg sm:text-xl font-black text-slate-900 font-mono">DPDP &apos;23</div>
              <div className="text-[11px] text-slate-500 font-medium">Data Privacy Protected</div>
            </div>
          </div>
        </div>

        {/* Portal Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {portalCards.map((card) => (
            <button
              key={card.role}
              onClick={() => handleSelectRole(card)}
              className="group relative flex flex-col text-left rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-200 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer hover:-translate-y-1.5"
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-br ${card.color} p-6 text-white relative`}>
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 shadow-2xs group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${card.badgeColor} shadow-2xs`}>
                    {card.badge}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/70">
                    {card.tag}
                  </span>
                  <h2 className="text-xl font-black tracking-tight leading-snug mt-0.5">{card.title}</h2>
                  <p className="text-xs text-white/80 font-medium mt-1">{card.subtitle}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {card.description}
                </p>

                <div className="space-y-3 pt-2">
                  <div className="text-[11px] font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center justify-between">
                    <span>Scope:</span>
                    <span className="font-semibold text-slate-700">{card.metrics}</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Launch Workspace
                    </span>
                    <span className={`inline-flex items-center gap-2 text-xs font-bold ${card.accentBg} text-white px-4 py-2 rounded-xl shadow-xs group-hover:shadow-sm transition-all`}>
                      <span>Enter</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Regulatory Governance Callout */}
        <div className="mt-12 text-center max-w-2xl">
          <div className="inline-flex items-center space-x-2 text-xs text-slate-600 bg-white border border-slate-200/90 rounded-full px-5 py-2.5 shadow-2xs">
            <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong>Statutory Compliance:</strong> In accordance with AICTE Approval Process Handbook (Section 3.4) and DPDP Act 2023.
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-600 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>All India Council for Technical Education (AICTE) · Regulation Bureau · New Delhi</div>
          <div className="text-slate-500 font-mono text-xs">
            TRACE Engine · SIH26263 · Smart Automation
          </div>
        </div>
      </footer>
    </div>
  );
}
