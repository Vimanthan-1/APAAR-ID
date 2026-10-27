import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';
import { resetDemo } from '../api';
import { useAppStore } from '../store/useAppStore';
import { AUDIT_ACTOR } from '../constants';

const isDevToolsEnabled = import.meta.env.VITE_DEV_TOOLS === 'true';

const NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Cross-Enrolment Conflict Detected',
    desc: 'APAAR 9821-4567-8910 enrolled concurrently at Demo Tech & Apex Institute.',
    time: '2 mins ago',
    type: 'critical',
    link: '/officer/graph',
  },
  {
    id: 'notif-2',
    title: 'Intake Quota Cap Exceeded',
    desc: 'B.Tech CSE at Demo Institute enrolled 72/60 approved seats (+12 breach).',
    time: '14 mins ago',
    type: 'warning',
    link: '/officer/dashboard',
  },
  {
    id: 'notif-3',
    title: 'Foreign National Quota Ratified',
    desc: 'Tariq Mansoor Al-Farsi verified under AICTE FN supernumerary scheme.',
    time: '1 hour ago',
    type: 'success',
    link: '/officer/audit',
  },
];

export default function Layout() {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const resetStore = useAppStore((state) => state.resetStore);
  const logout = useAppStore((state) => state.logout);

  const handleSwitchPortal = () => {
    logout();
    navigate('/');
  };

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: Alt+Shift+D
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setShowResetConfirm(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleConfirmReset = async () => {
    try {
      setResetting(true);
      await resetDemo();
      if (resetStore) resetStore();
      setResetMessage('Demo data restored to initial state');
      setTimeout(() => setResetMessage(null), 3500);

      window.dispatchEvent(new CustomEvent('aicte:reset-demo'));
      setShowResetConfirm(false);
      navigate('/officer/dashboard');
    } catch (err) {
      console.error('Failed to reset demo:', err);
    } finally {
      setResetting(false);
    }
  };

  const navItems = [
    {
      to: '/officer/dashboard',
      label: 'Intake Surveillance',
      sublabel: 'National Admissions Overview',
      icon: (
        <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      to: '/officer/graph',
      label: 'Cross-Enrolment Graph',
      sublabel: 'Multi-Institutional Network',
      badge: '1 Alert',
      badgeColor: 'bg-red-500 text-white',
      icon: (
        <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      to: '/officer/audit',
      label: 'National Audit Trail',
      sublabel: 'Immutable Compliance Ledger',
      icon: (
        <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  if (isDevToolsEnabled) {
    navItems.push({
      to: '/officer/_components',
      label: 'UI Components',
      sublabel: 'Design System Check',
      icon: (
        <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    });
  }

  // Get active breadcrumb name
  const currentNav = navItems.find((n) => location.pathname.startsWith(n.to)) || {
    label: location.pathname.includes('/applications') ? 'Application Scrutiny Dossier' : 'Surveillance Workspace',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 antialiased font-sans">
      {/* Top Sovereign Header Bar */}
      <header className="bg-[#0A192F] text-white border-b border-slate-800 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* P.R.A.M.A.N Logo & Brand */}
          <div className="flex items-center space-x-3.5">
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
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                  P.R.A.M.A.N
                </span>
                <span className="text-slate-500 font-normal">|</span>
                <span className="text-sm font-semibold text-slate-200 hidden sm:inline">
                  AICTE Central Surveillance
                </span>
                <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  SIH26263
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Regulation Bureau · Smart Automation
              </div>
            </div>
          </div>

          {/* Right Controls: Notifications, Reset, Role & Switch */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {resetMessage && (
              <span className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold bg-emerald-800 text-emerald-100 px-3 py-1 rounded-full border border-emerald-600 shadow-xs animate-slide-up">
                <span>✓</span>
                <span>{resetMessage}</span>
              </span>
            )}

            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors relative cursor-pointer"
                title="View real-time compliance alerts"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center border border-[#0A192F]">
                  3
                </span>
              </button>

              {/* Notification Flyout Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-scale-in text-slate-800">
                  <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                        Live Compliance Alerts (3)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">P.R.A.M.A.N Watchdog</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {NOTIFICATIONS.map((n) => (
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
                            n.type === 'critical' ? 'text-red-700' : n.type === 'warning' ? 'text-amber-800' : 'text-emerald-700'
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
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/officer/audit');
                      }}
                      className="text-xs font-bold text-blue-700 hover:text-blue-800 cursor-pointer"
                    >
                      View Immutable Audit Ledger →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Switch Portal */}
            <button
              type="button"
              onClick={handleSwitchPortal}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="font-semibold hidden sm:inline">Switch Portal</span>
            </button>

            {/* Reset Demo Button */}
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              disabled={resetting}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              title="Reset in-memory data (Alt+Shift+D)"
            >
              <svg className={`w-3.5 h-3.5 text-slate-400 ${resetting ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="font-semibold">{resetting ? 'Resetting...' : 'Reset'}</span>
            </button>

            {/* Officer Profile Badge */}
            <div className="flex items-center space-x-2.5 pl-2.5 border-l border-slate-700">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs ring-2 ring-blue-500/30">
                AK
              </div>
              <div className="leading-tight hidden md:block">
                <div className="text-xs font-bold text-slate-100">Dr. A. K. Sharma</div>
                <div className="text-[10px] font-mono text-slate-400">{AUDIT_ACTOR.OFFICER} · Central Bureau</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contextual Sub-Bar / Breadcrumbs */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">AICTE Regulatory Surveillance</span>
            <span>/</span>
            <span className="text-blue-700 font-bold">{currentNav.label}</span>
          </div>
          <div className="hidden sm:flex items-center space-x-3 text-[11px] font-mono text-slate-400">
            <span>Cycle: AY 2026-27</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">● Graph Scrutiny Engine Online</span>
          </div>
        </div>
      </div>

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <nav aria-label="Portal Navigation" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3 space-y-1.5 sticky top-24">
            <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Surveillance Suite
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-3.5 py-3 rounded-xl text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    isActive || (item.to.startsWith('/officer/applications') && location.pathname.startsWith('/officer/applications'))
                      ? 'bg-[#0A192F] text-white shadow-sm ring-1 ring-blue-500/30'
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
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-100 px-3">
              <div className="text-xs text-slate-600 space-y-1.5">
                <div className="font-semibold text-slate-800">Demonstration Reset:</div>
                <div className="font-mono text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg inline-block border border-slate-200">
                  Alt + Shift + D
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Content Outlet */}
        <main className="flex-1 min-w-0" id="main-content">
          <Outlet />
        </main>
      </div>

      {/* Persistent Reset Demo Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Restore All Demo Data?"
        confirmLabel="Reset Demo Data"
        cancelLabel="Keep Current State"
        variant="warning"
        confirmDisabled={resetting}
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetConfirm(false)}
      >
        <div className="space-y-3 text-base text-slate-600">
          <p>
            This action will restore all applications, synthetic documents, scrutiny findings, and audit trails back to their initial seed state.
          </p>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900 flex items-start space-x-2">
            <span className="text-amber-600 font-bold text-base leading-none">⚠</span>
            <span>
              Any regulatory decisions submitted during this demonstration session will be reverted to default.
            </span>
          </div>
        </div>
      </ConfirmDialog>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>P.R.A.M.A.N</strong> · Platform for Record Authentication, Monitoring and Academic Network (PS 26263)
          </div>
          <div className="text-slate-500 font-mono text-xs">
            Regulation Bureau · Smart Automation · DPDP Act Compliant
          </div>
        </div>
      </footer>
    </div>
  );
}
