import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudentByApaar } from '../api';
import { useAppStore } from '../store/useAppStore';

export default function StakeholderVerification() {
  const navigate = useNavigate();
  const logout = useAppStore((s) => s.logout);
  const { apaarId: paramApaar } = useParams();

  const [searchApaar, setSearchApaar] = useState(paramApaar || '4192-8736-2019');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleBackToPortals = () => {
    logout();
    navigate('/');
  };

  const fetchStudent = async (idToSearch) => {
    if (!idToSearch) return;
    setLoading(true);
    setSearched(true);
    try {
      const found = await getStudentByApaar(idToSearch);
      setStudent(found);
    } catch (err) {
      console.error('Lookup failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramApaar) {
      fetchStudent(paramApaar);
    } else {
      fetchStudent('4192-8736-2019'); // Default compliant student
    }
  }, [paramApaar]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudent(searchApaar);
  };

  const handleQuickLookup = (id) => {
    setSearchApaar(id);
    fetchStudent(id);
  };

  return (
    <div className="min-h-screen bg-[#F3F6FA] text-slate-800 antialiased font-sans flex flex-col">
      {/* Top Header */}
      <header className="bg-[#0F2A4A] text-white border-b border-blue-900/40 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#1F6FEB] flex items-center justify-center font-bold text-white text-base shadow-inner">
              AI
            </div>
            <div>
              <div className="text-base font-semibold leading-tight tracking-wide flex items-center gap-2">
                <span>AICTE National Academic Identity Verification</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-800 text-blue-200 border border-blue-600">
                  Public Stakeholder Portal
                </span>
              </div>
              <div className="text-xs text-blue-200/80">Authorized Verification for Employers, Regulators & Institutions</div>
            </div>
          </div>

          <button
            onClick={handleBackToPortals}
            className="text-xs sm:text-sm px-3.5 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-blue-100 border border-blue-700 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Back to Portal Selection</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 text-center space-y-4">
          <div className="max-w-2xl mx-auto space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Verify Student Academic Identity (APAAR)
            </h1>
            <p className="text-sm text-slate-600">
              Query the AICTE Central Repository using the student's 12-digit national <strong className="text-slate-800">APAAR ID</strong> to verify enrolment, quota entitlement, and authentic academic records.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchApaar}
                onChange={(e) => setSearchApaar(e.target.value)}
                placeholder="Enter 12-digit APAAR ID (e.g. 4192-8736-2019)"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-mono text-slate-900 tracking-wider shadow-inner outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Verify</span>
            </button>
          </form>

          {/* Quick Pre-fills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-slate-600 font-medium">Quick Demo Queries:</span>
            <button
              type="button"
              onClick={() => handleQuickLookup('4192-8736-2019')}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-medium cursor-pointer transition-colors"
            >
              ✓ Ananya Mehra (Compliant Student)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLookup('9821-4567-8910')}
              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-900 border border-red-300 font-semibold cursor-pointer transition-colors"
            >
              ⚠️ Aarav Sharma (Cross-Enrolment Conflict)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLookup('8721-3948-5012')}
              className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 font-medium cursor-pointer transition-colors"
            >
              ★ Fatima Al-Zahra (Foreign National Quota)
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            <div className="mt-3 text-sm font-semibold text-slate-800">Querying AICTE National Repository...</div>
          </div>
        )}

        {/* Result Card */}
        {!loading && searched && student && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden space-y-6">
            {/* Top Verification Status Bar */}
            <div
              className={`p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                student.verificationStatus === 'VERIFIED'
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-red-50/70 border-red-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 shadow-sm ${
                    student.verificationStatus === 'VERIFIED' ? 'bg-emerald-600' : 'bg-red-600 animate-pulse'
                  }`}
                >
                  {student.verificationStatus === 'VERIFIED' ? '✓' : '!'}
                </div>
                <div>
                  <div
                    className={`font-bold text-base ${
                      student.verificationStatus === 'VERIFIED' ? 'text-emerald-950' : 'text-red-950'
                    }`}
                  >
                    {student.verificationStatus === 'VERIFIED'
                      ? 'OFFICIALLY VERIFIED STUDENT RECORD'
                      : 'REGULATORY ANOMALY DETECTED'}
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      student.verificationStatus === 'VERIFIED' ? 'text-emerald-800' : 'text-red-800'
                    }`}
                  >
                    {student.verificationStatus === 'VERIFIED'
                      ? 'Authenticated against DigiLocker, ABC, and AICTE Institutional Approval Rolls.'
                      : student.violationDetails?.description || 'Active compliance investigation flag raised.'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCertificate(!showCertificate)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{showCertificate ? 'Hide Certificate' : 'View Verified Certificate'}</span>
                </button>
              </div>
            </div>

            {/* Student & Academic Information Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal & APAAR Identity */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    National Identity Details
                  </h3>

                  <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Full Name</span>
                      <span className="text-sm font-bold text-slate-900">{student.fullName}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">APAAR ID</span>
                      <span className="text-sm font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 tracking-wider">
                        {student.apaarId}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Date of Birth</span>
                      <span className="text-xs font-semibold text-slate-800">{student.dob}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">DigiLocker Verification</span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        {student.digilockerStatus}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Biometric / Aadhaar Seed</span>
                      <span className="text-xs font-semibold text-slate-800">
                        {student.biometricSeeded ? 'Seeded (eKYC Complete)' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Institutional Enrollment Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    AICTE Institutional Affiliation
                  </h3>

                  <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Institution</span>
                      <span className="text-xs font-bold text-slate-900 text-right max-w-[220px]">
                        {student.institutionName}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Program / Degree</span>
                      <span className="text-xs font-semibold text-slate-800 text-right">{student.courseName}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Student Roll No</span>
                      <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {student.studentRollNo}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Admission Quota</span>
                      <span className="text-xs font-bold text-blue-800">
                        {student.admissionCategory} ({student.subCategory})
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Academic Year</span>
                      <span className="text-xs font-semibold text-slate-800">{student.admissionYear}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cross-Institution Conflict Warning Banner if Flagged */}
              {student.verificationStatus === 'DUPLICATE_CROSS_INSTITUTE' && student.violationDetails && (
                <div className="p-5 rounded-xl border border-red-300 bg-red-50/80 space-y-3">
                  <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>CONCURRENT ACTIVE ADMISSION DETECTED</span>
                  </div>
                  <p className="text-xs text-red-800 leading-relaxed">
                    This APAAR ID holds an active full-time regular degree registration simultaneously at{' '}
                    <strong className="text-red-950 font-bold">{student.violationDetails.conflictingInstitution?.name}</strong> under Roll Number{' '}
                    <span className="font-mono font-bold">{student.violationDetails.conflictingInstitution?.rollNo}</span>.
                  </p>
                  <div className="text-xs text-red-700 italic">
                    {student.violationDetails.ruleViolated}
                  </div>
                </div>
              )}

              {/* Certificate Generator & Preview (Requirement 10) */}
              {showCertificate && (
                <div className="pt-6 border-t border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">
                        Official Academic Certificate Preview (With APAAR ID)
                      </h3>
                      <p className="text-xs text-slate-600">
                        Meets AICTE & UGC statutory mandate: APAAR ID printed prominently alongside Institutional Roll Number.
                      </p>
                    </div>

                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print Certificate
                    </button>
                  </div>

                  {/* High Fidelity Certificate Box */}
                  <div className="p-8 sm:p-12 border-4 border-amber-900/30 bg-amber-50/30 rounded-2xl relative shadow-md text-center space-y-6">
                    {/* Corner Emblems */}
                    <div className="flex items-center justify-between border-b border-amber-900/20 pb-4">
                      <div className="w-12 h-12 rounded-full border-2 border-amber-900/50 flex items-center justify-center font-serif font-extrabold text-amber-950 text-xs shadow-xs">
                        AICTE
                      </div>
                      <div className="text-center">
                        <div className="text-xs uppercase tracking-widest text-amber-950 font-bold">
                          All India Council for Technical Education
                        </div>
                        <div className="text-xs text-slate-600 font-medium">Ministry of Education, Government of India</div>
                      </div>
                      <div className="w-12 h-12 rounded-full border-2 border-amber-900/50 flex items-center justify-center font-serif font-extrabold text-amber-950 text-xs shadow-xs">
                        APAAR
                      </div>
                    </div>

                    <div className="space-y-2 py-4">
                      <div className="font-serif italic text-sm text-slate-700">This is to certify that</div>
                      <div className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-950 tracking-wide">
                        {student.fullName}
                      </div>
                      <div className="text-xs text-slate-700 max-w-lg mx-auto">
                        has been officially registered and verified in the national academic repository for the degree program of
                      </div>
                      <div className="text-lg font-bold text-[#0F2A4A] tracking-tight py-1">
                        {student.courseName}
                      </div>
                      <div className="text-xs text-slate-600">at {student.institutionName}</div>
                    </div>

                    {/* APAAR & Student ID Mandated Print Row */}
                    <div className="max-w-lg mx-auto grid grid-cols-2 gap-4 p-4 rounded-xl border border-amber-900/30 bg-white/90 shadow-xs">
                      <div className="text-left space-y-0.5">
                        <div className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                          Permanent APAAR ID
                        </div>
                        <div className="text-sm font-mono font-extrabold text-blue-700 tracking-wider">
                          {student.apaarId}
                        </div>
                      </div>

                      <div className="text-right space-y-0.5">
                        <div className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                          Student Roll Number
                        </div>
                        <div className="text-sm font-mono font-bold text-slate-900">
                          {student.studentRollNo}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Signatures & QR Verification */}
                    <div className="pt-6 flex items-center justify-between text-xs text-slate-600 border-t border-amber-900/20">
                      <div className="text-left space-y-1">
                        <div className="font-mono text-xs text-slate-600">Date: {student.enrolmentDate}</div>
                        <div className="text-xs font-semibold text-slate-800">Registrar Signatory</div>
                      </div>

                      {/* Verifiable QR Stamp */}
                      <div className="p-2 border border-slate-300 rounded-lg bg-white shadow-xs text-center flex flex-col items-center">
                        <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100" height="100" fill="white" />
                          {/* Corner Squares */}
                          <rect x="10" y="10" width="24" height="24" fill="#0f172a" />
                          <rect x="14" y="14" width="16" height="16" fill="white" />
                          <rect x="18" y="18" width="8" height="8" fill="#0f172a" />

                          <rect x="66" y="10" width="24" height="24" fill="#0f172a" />
                          <rect x="70" y="14" width="16" height="16" fill="white" />
                          <rect x="74" y="18" width="8" height="8" fill="#0f172a" />

                          <rect x="10" y="66" width="24" height="24" fill="#0f172a" />
                          <rect x="14" y="70" width="16" height="16" fill="white" />
                          <rect x="18" y="74" width="8" height="8" fill="#0f172a" />

                          {/* Data dots */}
                          <rect x="42" y="14" width="6" height="6" fill="#0f172a" />
                          <rect x="52" y="22" width="6" height="6" fill="#0f172a" />
                          <rect x="44" y="32" width="6" height="6" fill="#0f172a" />
                          <rect x="22" y="44" width="6" height="6" fill="#0f172a" />
                          <rect x="34" y="48" width="6" height="6" fill="#0f172a" />
                          <rect x="46" y="48" width="8" height="8" fill="#2563eb" />
                          <rect x="60" y="42" width="6" height="6" fill="#0f172a" />
                          <rect x="74" y="44" width="6" height="6" fill="#0f172a" />
                          <rect x="82" y="54" width="6" height="6" fill="#0f172a" />
                          <rect x="42" y="66" width="6" height="6" fill="#0f172a" />
                          <rect x="54" y="74" width="6" height="6" fill="#0f172a" />
                          <rect x="68" y="68" width="6" height="6" fill="#0f172a" />
                          <rect x="80" y="78" width="6" height="6" fill="#0f172a" />
                        </svg>
                        <div className="text-[10px] font-mono text-emerald-800 font-bold mt-1">VERIFIED REGISTRY</div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="font-mono text-xs text-slate-600">AICTE Ref: 2026-APAAR-001</div>
                        <div className="text-xs font-semibold text-slate-800">Member Secretary, AICTE</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Not Found State */}
        {!loading && searched && !student && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto text-xl font-bold">
              ?
            </div>
            <div className="text-base font-bold text-slate-900">No Student Found for APAAR: {searchApaar}</div>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Please check the 12-digit number or select one of the demonstration test queries above to see how verified and flagged records behave.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
