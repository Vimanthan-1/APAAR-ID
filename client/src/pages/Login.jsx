import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ROLE, DEMO_RIBBON_TEXT } from '../constants';

const portalCards = [
  {
    role: ROLE.OFFICER,
    title: 'AICTE Central Surveillance',
    subtitle: 'National Monitoring & Graph Scrutiny',
    description:
      'National student enrollment surveillance, intake quota cap enforcement, and cross-institution duplicate enrollment graph analysis.',
    route: '/officer/dashboard',
    color: 'from-[#0F2A4A] to-[#1a3d6b]',
    accentBorder: 'border-[#1F6FEB]',
    accentBg: 'bg-[#1F6FEB]',
    badge: '⭐ Central Authority',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    role: ROLE.COLLEGE,
    title: 'Institution Registrar',
    subtitle: 'APAAR Batch Upload & Seat Matrix',
    description:
      'Upload post-admission student records using 12-digit APAAR ID, monitor approved intake capacity, supernumerary quotas, and resolve flagged deficiencies.',
    route: '/college/application',
    color: 'from-[#064e3b] to-[#047857]',
    accentBorder: 'border-emerald-600',
    accentBg: 'bg-emerald-700',
    badge: 'Approved Institution',
    badgeColor: 'bg-emerald-50 text-emerald-900 border-emerald-300',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    role: ROLE.VERIFIER,
    title: 'Public Stakeholder',
    subtitle: 'Authorized Academic Verification',
    description:
      'Instant verification of APAAR IDs for employers, universities, and regulatory bodies with verifiable certificate generation.',
    route: '/verify',
    color: 'from-[#075985] to-[#0369a1]',
    accentBorder: 'border-sky-600',
    accentBg: 'bg-sky-700',
    badge: 'Public / Verifier',
    badgeColor: 'bg-sky-50 text-sky-900 border-sky-300',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
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
    <div className="min-h-screen bg-[#F3F6FA] flex flex-col">
      {/* Top Bar */}
      <header className="bg-[#0b172a] text-white border-b border-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0 shadow-sm">
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
              <div className="text-base font-semibold tracking-tight leading-tight text-white flex items-center gap-2">
                <span>AICTE Academic Identity Platform</span>
                <span className="hidden sm:inline-flex text-xs font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-700/50">
                  National Repository
                </span>
              </div>
              <div className="text-xs text-slate-300">
                Ministry of Education · AICTE National Student Registry · SIH26261
              </div>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-slate-800/90 text-slate-300 border border-slate-700">
            {DEMO_RIBBON_TEXT}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            APAAR ID Verification & Intake Surveillance
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Integrated Student Academic Identity &amp; Compliance Portal
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Real-time enrollment monitoring, institutional quota enforcement, and cross-institution duplicate enrollment graph scrutiny.
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          {portalCards.map((card) => (
            <button
              key={card.role}
              onClick={() => handleSelectRole(card)}
              className="group relative flex flex-col text-left rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-200 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer hover:-translate-y-1"
            >
              {/* Header */}
              <div className={`bg-gradient-to-br ${card.color} px-6 py-6 text-white relative`}>
                <div className="flex items-start justify-between">
                  <div className="text-white/90 group-hover:text-white transition-colors">
                    {card.icon}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>
                <h2 className="text-xl font-bold mt-4 leading-snug">{card.title}</h2>
                <p className="text-xs text-white/80 font-medium mt-1">{card.subtitle}</p>
              </div>

              {/* Body */}
              <div className="px-6 py-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {card.description}
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Access Portal
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${card.accentBg} text-white px-3.5 py-1.5 rounded-lg shadow-sm group-hover:opacity-95 transition-all`}>
                    <span>Proceed</span>
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Advisory Callout */}
        <div className="mt-12 text-center max-w-xl">
          <div className="inline-flex items-center space-x-2 text-xs text-slate-600 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
            <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Regulatory decisions rest with authorized officers. Dual enrolments flagged by graph scrutiny.</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>All India Council for Technical Education (AICTE) · Ministry of Education</div>
          <div className="text-slate-500 font-mono text-xs">SIH26261 · National APAAR Core</div>
        </div>
      </footer>
    </div>
  );
}
