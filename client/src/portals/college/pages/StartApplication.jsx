import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInstitutions, getStudents } from '../../../api';

export default function StartApplication() {
  const navigate = useNavigate();
  const [institution, setInstitution] = useState(null);
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, FLAGGED, VERIFIED, NRI_FN
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const instList = await getInstitutions();
        // Use Demo Institute of Technology (INST-001) as active college
        const currentInst = instList.find((i) => i.id === 'INST-001') || instList[0];
        setInstitution(currentInst);

        const studentList = await getStudents(currentInst.id);
        setStudents(studentList);
      } catch (err) {
        console.error('Failed to load institution data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !institution) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const summary = institution.summary;
  const isOverIntake = summary.totalActualEnrolment > summary.totalApprovedIntake;
  const excessCount = summary.totalActualEnrolment - summary.totalApprovedIntake;

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.apaarId.includes(search) ||
      s.studentRollNo.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'FLAGGED') return s.verificationStatus !== 'VERIFIED';
    if (filter === 'VERIFIED') return s.verificationStatus === 'VERIFIED';
    if (filter === 'NRI_FN') return s.isNri || s.isForeignNational || s.isOci;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Institution Overview Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{institution.name}</h1>
              {isOverIntake ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                  ⚠️ INTAKE BREACH (+{excessCount} Excess)
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ✓ COMPLIANT INTAKE
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
              <span><strong>AICTE ID:</strong> {institution.code}</span>
              <span>•</span>
              <span><strong>AISHE:</strong> {institution.aisheCode}</span>
              <span>•</span>
              <span><strong>Location:</strong> {institution.district}, {institution.state}</span>
              <span>•</span>
              <span><strong>Academic Cycle:</strong> {institution.academicYear}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/college/upload')}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Upload APAAR Batch
            </button>
            <button
              onClick={() => navigate('/college/deficiencies')}
              className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-sm border border-red-200 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              Inspect Anomalies ({summary.flaggedViolationsCount})
            </button>
          </div>
        </div>
      </div>

      {/* Critical Statutory Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Approved Intake vs Enrolment */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Approved vs Enrolled</span>
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{summary.totalActualEnrolment}</span>
            <span className="text-sm font-semibold text-slate-400">/ {summary.totalApprovedIntake} Seats</span>
          </div>
          <div className="mt-2 text-xs font-medium text-amber-600">
            {((summary.totalActualEnrolment / summary.totalApprovedIntake) * 100).toFixed(1)}% Capacity Utilization
          </div>
        </div>

        {/* Supernumerary Seats */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Supernumerary Seats</span>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">TFWS / EWS</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-700">{summary.supernumeraryEnrolled}</span>
            <span className="text-sm text-slate-400">Seats Granted</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Tuition Fee Waiver & Reserved Quotas
          </div>
        </div>

        {/* International & NRI */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>NRI / OCI / FN Quota</span>
            <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold">Embassy Clear</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-700">
              {summary.nriEnrolled + summary.ociEnrolled + summary.fnEnrolled}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              (NRI: {summary.nriEnrolled} · FN: {summary.fnEnrolled})
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            AICTE Section 21 International Quota
          </div>
        </div>

        {/* APAAR Verification Rate */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>APAAR Seeding Rate</span>
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">{summary.apaarVerificationRate}%</span>
            <span className="text-xs text-slate-400">DigiLocker Seeded</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            National Academic Depository Linkage
          </div>
        </div>
      </div>

      {/* Program-wise Seat Matrix Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-800 tracking-tight mb-4 flex items-center justify-between">
          <span>Program-wise Intake Utilization & Quota Allocation</span>
          <span className="text-xs font-normal text-slate-500">Statutory AICTE Approval Process Handbook Norms</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {institution.programs.map((prog) => {
            const pct = Math.round((prog.actualEnrolment / prog.approvedIntake) * 100);
            const isBreach = prog.actualEnrolment > prog.approvedIntake;
            return (
              <div key={prog.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-sm text-slate-800">{prog.name}</div>
                    <div className="text-xs text-slate-500">Program ID: {prog.id}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    isBreach ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isBreach ? `Over Cap (${pct}%)` : `Within Cap (${pct}%)`}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isBreach ? 'bg-red-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200">
                  <span>Approved: <strong>{prog.approvedIntake}</strong></span>
                  <span>Enrolled: <strong className={isBreach ? 'text-red-600' : 'text-slate-800'}>{prog.actualEnrolment}</strong></span>
                  <span>Supernumerary: <strong>{prog.supernumerarySeats}</strong></span>
                  <span>NRI/FN: <strong>{prog.nriSeats + prog.fnSeats}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enrolled Students Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/70">
          <div>
            <h3 className="font-bold text-base text-slate-800">Submitted Student-Level Records</h3>
            <p className="text-xs text-slate-500">Verified against National APAAR Registry & AICTE Central Database</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by APAAR, Name, Roll No..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {/* Filter Pills */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filter === 'ALL' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({students.length})
              </button>
              <button
                onClick={() => setFilter('FLAGGED')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filter === 'FLAGGED' ? 'bg-red-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Flagged ({students.filter((s) => s.verificationStatus !== 'VERIFIED').length})
              </button>
              <button
                onClick={() => setFilter('VERIFIED')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filter === 'VERIFIED' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Verified
              </button>
              <button
                onClick={() => setFilter('NRI_FN')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filter === 'NRI_FN' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                NRI / FN
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
                <th className="p-3.5">APAAR ID</th>
                <th className="p-3.5">Student Details</th>
                <th className="p-3.5">Course & Roll No</th>
                <th className="p-3.5">Quota Category</th>
                <th className="p-3.5">Verification Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => {
                const isFlagged = student.verificationStatus !== 'VERIFIED';
                return (
                  <tr key={student.id} className={`hover:bg-slate-50/80 transition-colors ${
                    isFlagged ? 'bg-red-50/30' : ''
                  }`}>
                    {/* APAAR ID */}
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-800 text-sm tracking-wide">
                        {student.apaarId}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        DigiLocker: {student.digilockerStatus}
                      </div>
                    </td>

                    {/* Student Details */}
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800">{student.fullName}</div>
                      <div className="text-slate-400 text-[11px]">DOB: {student.dob} · {student.gender}</div>
                    </td>

                    {/* Course */}
                    <td className="p-3.5">
                      <div className="text-slate-800 font-medium">{student.courseName}</div>
                      <div className="font-mono text-slate-500 text-[11px]">{student.studentRollNo}</div>
                    </td>

                    {/* Category */}
                    <td className="p-3.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        student.admissionCategory === 'SUPERNUMERARY'
                          ? 'bg-blue-100 text-blue-800'
                          : student.admissionCategory === 'FN'
                          ? 'bg-purple-100 text-purple-800'
                          : student.admissionCategory === 'NRI'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {student.admissionCategory}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-0.5">{student.subCategory}</div>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      {student.verificationStatus === 'VERIFIED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Verified Authentic
                        </span>
                      )}
                      {student.verificationStatus === 'DUPLICATE_CROSS_INSTITUTE' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          Duplicate Enrolment
                        </span>
                      )}
                      {student.verificationStatus === 'INTAKE_QUOTA_BREACH' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Excess Quota Seat
                        </span>
                      )}
                      {student.verificationStatus === 'INVALID_APAAR' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                          Invalid Checksum
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      {student.verificationStatus === 'DUPLICATE_CROSS_INSTITUTE' ? (
                        <button
                          onClick={() => navigate('/college/deficiencies')}
                          className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-medium text-xs transition-colors cursor-pointer"
                        >
                          Resolve Conflict →
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate('/college/deficiencies')}
                          className="text-slate-500 hover:text-slate-800 font-medium text-xs transition-colors cursor-pointer"
                        >
                          Details
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
