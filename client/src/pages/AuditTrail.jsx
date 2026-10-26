import React, { useEffect, useState, useMemo } from 'react';
import { getAudit, getInstitutions } from '../api';
import AuditTimeline from '../portals/officer/components/AuditTimeline';
import { AUDIT_ACTION, AUDIT_ACTION_LABELS, AUDIT_ACTOR } from '../constants';

/**
 * Global National Audit Trail Page (Route: /officer/audit).
 * Complete immutable, tamper-evident timeline of APAAR admissions,
 * automated anomaly detections, quota breaches, and regulatory actions.
 */
export default function AuditTrail() {
  const [events, setEvents] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'ANOMALIES' | 'BATCHES' | 'VERIFICATIONS'
  const [instFilter, setInstFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [allAudit, allInsts] = await Promise.all([
        getAudit(),
        getInstitutions(),
      ]);
      setEvents(allAudit || []);
      setInstitutions(allInsts || []);
      document.title = 'National APAAR Audit Trail & Compliance Ledger · AICTE Central Portal';
    } catch (err) {
      console.error('Failed to load audit trail:', err);
      setError('Unable to retrieve immutable audit trail records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen to reset demo events
    const handleReset = () => loadData();
    window.addEventListener('aicte:reset-demo', handleReset);
    return () => {
      window.removeEventListener('aicte:reset-demo', handleReset);
    };
  }, []);

  // Summary counts for top overview tiles
  const metrics = useMemo(() => {
    const total = events.length;
    const anomaliesFlagged = events.filter(
      (e) =>
        e.action === AUDIT_ACTION.DUPLICATE_ENROLMENT_FLAGGED ||
        e.action === AUDIT_ACTION.INTAKE_BREACH_DETECTED ||
        e.severity === 'high'
    ).length;
    const batchesIngested = events.filter(
      (e) => e.action === AUDIT_ACTION.STUDENT_BATCH_UPLOADED
    ).length;
    const stakeholderQueries = events.filter(
      (e) =>
        e.action === AUDIT_ACTION.STAKEHOLDER_VERIFICATION ||
        e.action === AUDIT_ACTION.CERTIFICATE_GENERATED
    ).length;

    return { total, anomaliesFlagged, batchesIngested, stakeholderQueries };
  }, [events]);

  // Filtered events calculation
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // 1. Quick Category Tab Filter
      if (categoryFilter === 'ANOMALIES') {
        const isAnomaly =
          evt.action === AUDIT_ACTION.DUPLICATE_ENROLMENT_FLAGGED ||
          evt.action === AUDIT_ACTION.INTAKE_BREACH_DETECTED ||
          evt.severity === 'high';
        if (!isAnomaly) return false;
      } else if (categoryFilter === 'BATCHES') {
        if (evt.action !== AUDIT_ACTION.STUDENT_BATCH_UPLOADED) return false;
      } else if (categoryFilter === 'VERIFICATIONS') {
        const isVerify =
          evt.action === AUDIT_ACTION.STAKEHOLDER_VERIFICATION ||
          evt.action === AUDIT_ACTION.CERTIFICATE_GENERATED ||
          evt.action === AUDIT_ACTION.APAAR_VALIDATED;
        if (!isVerify) return false;
      }

      // 2. Institution Filter
      if (instFilter !== 'ALL' && evt.applicationId !== instFilter) {
        return false;
      }

      // 3. Action type filter
      if (actionFilter !== 'ALL' && evt.action !== actionFilter) {
        return false;
      }

      // 4. Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchDetail = (evt.detail || '').toLowerCase().includes(q);
        const matchRef = (evt.ref || '').toLowerCase().includes(q);
        const matchInst = (evt.applicationId || '').toLowerCase().includes(q);
        const matchAction = (evt.action || '').toLowerCase().includes(q);
        const matchActor = (evt.actor || '').toLowerCase().includes(q);
        if (!matchDetail && !matchRef && !matchInst && !matchAction && !matchActor) return false;
      }

      return true;
    });
  }, [events, categoryFilter, instFilter, actionFilter, searchQuery]);

  const hasActiveFilters =
    categoryFilter !== 'ALL' || instFilter !== 'ALL' || actionFilter !== 'ALL' || searchQuery.trim() !== '';

  const clearFilters = () => {
    setCategoryFilter('ALL');
    setInstFilter('ALL');
    setActionFilter('ALL');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* 1. Page Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-800">
                Immutable Statutory Ledger &middot; Section 8 &amp; 14 AICTE Mandate
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2A4A] tracking-tight">
              National APAAR Audit Trail &amp; Compliance Ledger
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              Chronological, tamper-evident audit trail recording student batch ingestions, Verhoeff checksum queries, cross-institution duplicate enrolments, and statutory regulatory directives.
            </p>
          </div>

          <div className="flex items-center space-x-2.5 self-start sm:self-auto shrink-0">
            <span className="text-xs font-mono font-bold px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg">
              {events.length} Events Logged
            </span>
            <button
              onClick={loadData}
              disabled={loading}
              className="text-xs font-bold text-slate-700 hover:text-[#0F2A4A] bg-white hover:bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
              title="Refresh timeline records"
            >
              <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#1F6FEB]' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* 2. Top Metric Overview Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5 pt-5 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Logged</span>
              <span className="text-2xl font-extrabold text-[#0F2A4A] tabular-nums">{metrics.total}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
              #
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider block">Flagged Anomalies</span>
              <span className="text-2xl font-extrabold text-red-950 tabular-nums">{metrics.anomaliesFlagged}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-red-200 text-red-900 flex items-center justify-center font-bold text-xs">
              !
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">Batches Ingested</span>
              <span className="text-2xl font-extrabold text-blue-950 tabular-nums">{metrics.batchesIngested}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-200 text-blue-900 flex items-center justify-center font-bold text-xs">
              📁
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">Stakeholder Queries</span>
              <span className="text-2xl font-extrabold text-purple-950 tabular-nums">{metrics.stakeholderQueries}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-200 text-purple-900 flex items-center justify-center font-bold text-xs">
              ✓
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Filter & Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
        {/* Quick Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-1">
          <button
            type="button"
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              categoryFilter === 'ALL'
                ? 'bg-[#0F2A4A] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Events ({metrics.total})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('ANOMALIES')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              categoryFilter === 'ANOMALIES'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Flagged Anomalies ({metrics.anomaliesFlagged})</span>
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('BATCHES')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              categoryFilter === 'BATCHES'
                ? 'bg-[#1F6FEB] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Batch Ingestions ({metrics.batchesIngested})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('VERIFICATIONS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              categoryFilter === 'VERIFICATIONS'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Verifications &amp; Certificates ({metrics.stakeholderQueries})</span>
          </button>
        </div>

        {/* Dropdowns + Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 pt-1">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by APAAR ID, student name, institution, or keyword..."
              className="w-full pl-9.5 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1F6FEB] focus:border-[#1F6FEB]"
            />
          </div>

          {/* Institution Filter */}
          <div className="sm:col-span-3">
            <select
              value={instFilter}
              onChange={(e) => setInstFilter(e.target.value)}
              className="w-full text-xs sm:text-sm font-semibold bg-white border border-slate-300 rounded-xl p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1F6FEB] focus:border-[#1F6FEB] cursor-pointer"
            >
              <option value="ALL">All Institutions &amp; Queries</option>
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.id} &middot; {inst.name}
                </option>
              ))}
              <option value="PUBLIC-VERIFY">PUBLIC-VERIFY &middot; Stakeholder Queries</option>
            </select>
          </div>

          {/* Action Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full text-xs sm:text-sm font-semibold bg-white border border-slate-300 rounded-xl p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1F6FEB] focus:border-[#1F6FEB] cursor-pointer"
            >
              <option value="ALL">All Action Types</option>
              {Object.keys(AUDIT_ACTION).map((actKey) => (
                <option key={actKey} value={actKey}>
                  {AUDIT_ACTION_LABELS[actKey] || actKey}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary & Clear Control */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-600">
              Showing <strong>{filteredEvents.length}</strong> of {events.length} audit records matching active filters
            </span>
            <button
              onClick={clearFilters}
              className="text-[#1F6FEB] hover:underline font-semibold cursor-pointer"
            >
              Clear All Filters ✕
            </button>
          </div>
        )}
      </div>

      {/* 4. Timeline Output Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <AuditTimeline events={filteredEvents} />
      </div>
    </div>
  );
}
