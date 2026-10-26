import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

const COLLEGE_NOTIFICATIONS = [
  {
    id: 'col-notif-1',
    title: 'Statutory Deficiencies Flagged',
    desc: '4 anomalies detected by AICTE scrutiny engine (Duplicate TFWS, Quota breach).',
    time: '5 mins ago',
    type: 'critical',
    link: '/college/deficiencies',
  },
  {
    id: 'col-notif-2',
    title: 'Batch Ingestion Acknowledged',
    desc: 'CSV Batch student_records_batch.csv passed Verhoeff checksum validation.',
    time: '20 mins ago',
    type: 'success',
    link: '/college/processing',
  },
];

const navItems = [
  {
    to: '/college/application',
    label: 'Intake & Admissions',
    sublabel: 'Approved vs Actual Quotas',
    badge: '138 / 120',
    icon: (
      <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    to: '/college/upload',
    label: 'Upload APAAR Batch',
    sublabel: 'CSV Data Ingestion & Pre-check',
    icon: (
      <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
  {
    to: '/college/processing',
    label: 'Validation Engine',
    sublabel: 'Automated Rule Execution',
    icon: (
      <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    to: '/college/deficiencies',
    label: 'Flagged Anomalies',
    sublabel: 'Remediation & Resolution',
    badge: '4 alerts',
    badgeColor: 'bg-red-500 text-white',
    icon: (
      <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
];

export default function CollegeLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAppStore((s) => s.logout);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentNav = navItems.find((n) => location.pathname.startsWith(n.to)) || {
    label: 'College Workspace',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 antialiased font-sans">
      {/* Top Header Bar */}
      <header className="bg-[#0c4a2f] text-white border-b border-emerald-500/30 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white text-base shadow-sm border border-emerald-400/40 shrink-0">
              <svg className="w-5 h-5 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <div className="text-base font-bold leading-tight tracking-tight flex items-center gap-2">
                <span>TRACE</span>
                <span className="text-emerald-300 font-normal">|</span>
                <span className="text-sm font-semibold text-emerald-100">Institution Portal</span>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-800 text-emerald-200 border border-emerald-600">
                  AY 2026-27
                </span>
              </div>
              <div className="text-xs text-emerald-200/90">
                Demo Institute of Technology · AISHE: C-49210
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-600 transition-colors relative cursor-pointer"
                title="Institutional Alerts"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center border border-[#0c4a2f]">
                  2
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-scale-in text-slate-800">
                  <div className="p-3.5 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-900">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                      Institution Alerts (2)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300">Central AICTE Sync</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {COLLEGE_NOTIFICATIONS.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          setShowNotifications(false);
                          navigate(n.link);
                        }}
                        className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-xs font-bold leading-snug ${
                            n.type === 'critical' ? 'text-red-700' : 'text-emerald-700'
                          }`}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {n.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Switch Portal */}
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 hover:text-white border border-emerald-600 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="font-semibold hidden sm:inline">Switch Portal</span>
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center space-x-2.5 pl-2.5 border-l border-emerald-600/80">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-emerald-400/30">
                RV
              </div>
              <div className="leading-tight hidden md:block">
                <div className="text-xs font-bold text-emerald-50">R. K. Verma</div>
                <div className="text-[10px] font-mono text-emerald-200">College Registrar</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb Contextual Sub-Bar */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">Institution Operations</span>
            <span>/</span>
            <span className="text-emerald-700 font-bold">{currentNav.label}</span>
          </div>
          <div className="hidden sm:flex items-center space-x-3 text-[11px] font-mono text-slate-400">
            <span>Quota Status: <strong className="text-amber-700">+12 Overrun in CSE</strong></span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">● DigiLocker API Connected</span>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <nav aria-label="College Navigation" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3 space-y-1.5 sticky top-24">
            <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Registrar Workflow
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-3.5 py-3 rounded-xl text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                    isActive
                      ? 'bg-[#0c4a2f] text-white shadow-sm ring-1 ring-emerald-500/30'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {item.icon}
                <div className="leading-tight flex-1">
                  <div>{item.label}</div>
                  {item.sublabel && (
                    <div className="text-[11px] opacity-80 font-normal">{item.sublabel}</div>
                  )}
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-100 px-3">
              <div className="text-xs text-slate-500 space-y-1">
                <div className="font-semibold text-slate-700">Institution Code:</div>
                <div className="font-mono text-slate-600 text-xs">INST-001 (AICTE Approved)</div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0" id="college-main-content">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>TRACE</strong> · Institutional APAAR Ingestion &amp; Regulatory Compliance Engine
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Approval Process Handbook 2026-27 · Smart Automation
          </div>
        </div>
      </footer>
    </div>
  );
}
