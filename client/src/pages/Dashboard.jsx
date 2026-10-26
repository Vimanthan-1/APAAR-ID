import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { getInstitutions } from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, BREACH, COMPLIANT
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getInstitutions();
        setInstitutions(data);
      } catch (err) {
        console.error('Failed to load institutions', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 animate-pulse">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <div className="text-sm font-bold text-slate-700">Loading National Surveillance Telemetry...</div>
        </div>
      </div>
    );
  }

  // Aggregate National Totals
  const totalApproved = institutions.reduce((acc, i) => acc + i.summary.totalApprovedIntake, 0);
  const totalEnrolled = institutions.reduce((acc, i) => acc + i.summary.totalActualEnrolment, 0);
  const totalSupernumerary = institutions.reduce((acc, i) => acc + i.summary.supernumeraryEnrolled, 0);
  const totalNriFn = institutions.reduce(
    (acc, i) => acc + i.summary.nriEnrolled + i.summary.fnEnrolled + i.summary.ociEnrolled,
    0
  );
  const breachCollegesCount = institutions.filter((i) => i.summary.status === 'INTAKE_BREACH_DETECTED').length;

  // Chart Data
  const chartData = institutions.map((inst) => ({
    name: inst.name.split(' ')[0] + ' ' + (inst.name.split(' ')[1] || ''),
    approved: inst.summary.totalApprovedIntake,
    enrolled: inst.summary.totalActualEnrolment,
    isBreach: inst.summary.totalActualEnrolment > inst.summary.totalApprovedIntake,
  }));

  // Filtered List
  const filteredInstitutions = institutions.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.code.includes(search) ||
      inst.aisheCode.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'BREACH') return inst.summary.status === 'INTAKE_BREACH_DETECTED';
    if (filter === 'COMPLIANT') return inst.summary.status === 'COMPLIANT';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0A192F] text-white">
                TRACE Central Surveillance
              </span>
              <span className="text-xs text-slate-400 font-mono">Academic Cycle 2026-27</span>
              <span className="hidden sm:inline-flex text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                ● Live Central Ingestion
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
              National Student Admission &amp; Intake Scrutiny Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
              Real-time monitoring of APAAR student registrations, intake quota overruns, supernumerary allocations (NRI, OCI, FN, TFWS), and cross-institution duplicate enrolment graph investigation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/officer/graph')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Launch Cross-Enrolment Graph</span>
            </button>
            <button
              onClick={() => navigate('/verify')}
              className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300 transition-all cursor-pointer"
            >
              Public Verifier Portal →
            </button>
          </div>
        </div>
      </div>

      {/* Critical National Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Approved vs Enrolled */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>National Enrolment vs Intake</span>
            <span className="p-1 rounded-lg bg-blue-50 text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-mono">{totalEnrolled}</span>
            <span className="text-xs text-slate-400 font-semibold">/ {totalApproved} Approved</span>
          </div>
          <div className="text-xs text-amber-700 font-semibold flex items-center gap-1">
            <span>⚠️</span>
            <span>+{(totalEnrolled - totalApproved)} Net National Overrun</span>
          </div>
        </div>

        {/* Flagged Cross-Institution Conflicts */}
        <div
          onClick={() => navigate('/officer/graph')}
          className="bg-red-50/60 border border-red-200 rounded-2xl p-5 shadow-sm cursor-pointer hover:bg-red-100/50 transition-all group space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-bold text-red-700 uppercase tracking-wider">
            <span>Dual Enrolment Conflict</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
          </div>
          <div className="text-3xl font-black text-red-700 font-mono">1 Critical Case</div>
          <div className="text-xs text-red-600 font-semibold group-hover:underline flex items-center gap-1">
            <span>Aarav Sharma · Inspect Graph Network</span>
            <span>→</span>
          </div>
        </div>

        {/* Supernumerary Allocations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Supernumerary Seats</span>
            <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="text-3xl font-black text-emerald-700 font-mono">{totalSupernumerary}</div>
          <div className="text-xs text-slate-500 font-medium">
            TFWS, EWS &amp; State Concessions Ratified
          </div>
        </div>

        {/* NRI & Foreign Nationals */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>International &amp; NRI</span>
            <span className="p-1 rounded-lg bg-purple-50 text-purple-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            </span>
          </div>
          <div className="text-3xl font-black text-purple-700 font-mono">{totalNriFn}</div>
          <div className="text-xs text-slate-500 font-medium">
            AICTE Section 21 Foreign National Clearance
          </div>
        </div>
      </div>

      {/* Analytics Chart & Active Anomaly Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Institution Intake vs Reported Enrolment Distribution</h2>
              <p className="text-xs text-slate-500">Statutory Approved Intake Cap vs Actual Reported Enrolments</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-3 h-3 rounded bg-slate-300"></span> Approved Intake
              </span>
              <span className="flex items-center gap-1.5 text-blue-700 font-bold">
                <span className="w-3 h-3 rounded bg-blue-600"></span> Actual Enrolled
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A192F',
                    borderRadius: '12px',
                    color: '#fff',
                    border: '1px solid #1E293B',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="approved" fill="#CBD5E1" radius={[4, 4, 0, 0]} name="Approved Intake" />
                <Bar dataKey="enrolled" fill="#2563EB" radius={[4, 4, 0, 0]} name="Actual Enrolled">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isBreach ? '#DC2626' : '#2563EB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High Severity Anomalies Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Active Regulatory Alerts</h2>
            <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-300">
              {breachCollegesCount + 1} Flags
            </span>
          </div>

          <div className="space-y-3">
            {/* Alert 1 */}
            <div
              onClick={() => navigate('/officer/graph')}
              className="p-3.5 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-100/50 transition-all cursor-pointer space-y-1.5 animate-slide-up"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white">
                  DUAL ENROLMENT
                </span>
                <span className="text-[11px] font-mono text-slate-400">APAAR 9821-4567-8910</span>
              </div>
              <div className="text-xs font-bold text-slate-900">
                Aarav Sharma enrolled at Demo Tech &amp; Apex Institute simultaneously.
              </div>
              <div className="text-[11px] text-red-700 font-semibold flex items-center gap-1">
                <span>Click to inspect Admission Graph</span>
                <span>→</span>
              </div>
            </div>

            {/* Alert 2 */}
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5 animate-slide-up">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-600 text-white">
                  INTAKE OVERRUN
                </span>
                <span className="text-[11px] font-mono text-slate-400">INST-001</span>
              </div>
              <div className="text-xs font-bold text-slate-900">
                Demo Institute of Technology exceeded approved intake by +18 students.
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Statutory notice issued to Registrar.</div>
            </div>

            {/* Alert 3 */}
            <div className="p-3.5 rounded-xl border border-orange-200 bg-orange-50/50 space-y-1.5 animate-slide-up">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-orange-600 text-white">
                  CHECKSUM ERROR
                </span>
                <span className="text-[11px] font-mono text-slate-400">Rohan Verma</span>
              </div>
              <div className="text-xs font-bold text-slate-900">
                Invalid 12-digit APAAR checksum. Failed DigiLocker handshake.
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Pending institutional correction.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Institutions Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/80">
          <div>
            <h3 className="font-bold text-base text-slate-900">Approved Technical Institutions Registry</h3>
            <p className="text-xs text-slate-500">Live surveillance of statutory intake quotas &amp; student batches</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search by Institution, Code, AISHE..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
            />

            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 text-xs shadow-2xs">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  filter === 'ALL' ? 'bg-[#0A192F] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({institutions.length})
              </button>
              <button
                onClick={() => setFilter('BREACH')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  filter === 'BREACH' ? 'bg-red-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Breaches ({breachCollegesCount})
              </button>
              <button
                onClick={() => setFilter('COMPLIANT')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  filter === 'COMPLIANT' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Compliant
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <th className="p-3.5">Institution Name &amp; Code</th>
                <th className="p-3.5">State &amp; District</th>
                <th className="p-3.5">Approved Intake</th>
                <th className="p-3.5">Actual Enrolled</th>
                <th className="p-3.5">Supernumerary</th>
                <th className="p-3.5">NRI / FN</th>
                <th className="p-3.5">Compliance Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInstitutions.map((inst) => {
                const isBreach = inst.summary.status === 'INTAKE_BREACH_DETECTED';
                return (
                  <tr key={inst.id} className={isBreach ? 'bg-red-50/40 hover:bg-red-50/60' : 'hover:bg-slate-50/60'}>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 text-sm">{inst.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        AICTE ID: {inst.code} · AISHE: {inst.aisheCode}
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-600 font-medium">
                      {inst.district}, {inst.state}
                    </td>

                    <td className="p-3.5 font-bold text-slate-700 font-mono">{inst.summary.totalApprovedIntake}</td>

                    <td className="p-3.5">
                      <span className={`font-black font-mono ${isBreach ? 'text-red-600' : 'text-slate-900'}`}>
                        {inst.summary.totalActualEnrolment}
                      </span>
                      {isBreach && (
                        <span className="text-[10px] text-red-500 font-bold ml-1 font-mono">
                          (+{inst.summary.totalActualEnrolment - inst.summary.totalApprovedIntake})
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-blue-700 font-bold font-mono">{inst.summary.supernumeraryEnrolled}</td>

                    <td className="p-3.5 text-purple-700 font-bold font-mono">
                      {inst.summary.nriEnrolled + inst.summary.fnEnrolled}
                    </td>

                    <td className="p-3.5">
                      {isBreach ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-300">
                          Intake Cap Exceeded
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          ✓ Compliant Intake
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right">
                      {inst.id === 'INST-001' ? (
                        <button
                          onClick={() => navigate('/officer/graph')}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                        >
                          View Graph →
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate('/verify')}
                          className="text-slate-500 hover:text-slate-800 font-semibold text-xs cursor-pointer"
                        >
                          Verify Records
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
