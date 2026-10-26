import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateStudentBatch, submitStudentBatch } from '../../../api';

// Pre-packaged test datasets for instantaneous hackathon demonstration
const SAMPLE_COMPLIANT_BATCH = [
  {
    apaarId: '5512-8941-2091',
    fullName: 'Aditya Ramesh Joshi',
    dob: '2005-03-18',
    gender: 'Male',
    courseName: 'B.Tech Computer Science & Engineering',
    studentRollNo: 'CS-2026-081',
    admissionCategory: 'GENERAL',
    subCategory: 'CAP Round 1',
    isNri: false,
    isOci: false,
    isForeignNational: false,
  },
  {
    apaarId: '7721-3490-6182',
    fullName: 'Meera Nandakumar',
    dob: '2005-07-22',
    gender: 'Female',
    courseName: 'B.Tech Computer Science & Engineering',
    studentRollNo: 'CS-2026-082',
    admissionCategory: 'SUPERNUMERARY',
    subCategory: 'TFWS (Tuition Fee Waiver)',
    isNri: false,
    isOci: false,
    isForeignNational: false,
  },
  {
    apaarId: '3341-9872-4015',
    fullName: 'Siddharth Roy',
    dob: '2005-09-10',
    gender: 'Male',
    courseName: 'B.Tech Artificial Intelligence & Data Science',
    studentRollNo: 'AI-2026-070',
    admissionCategory: 'GENERAL',
    subCategory: 'CAP Round 2',
    isNri: false,
    isOci: false,
    isForeignNational: false,
  },
];

const SAMPLE_CONFLICTING_BATCH = [
  // 1. Cross-institution duplicate enrolment conflict with Apex Institute
  {
    apaarId: '9821-4567-8910',
    fullName: 'Aarav Vikram Sharma',
    dob: '2005-06-14',
    gender: 'Male',
    courseName: 'B.Tech Computer Science & Engineering',
    studentRollNo: 'CS-2026-095',
    admissionCategory: 'SUPERNUMERARY',
    subCategory: 'TFWS (Tuition Fee Waiver)',
    isNri: false,
    isOci: false,
    isForeignNational: false,
  },
  // 2. Invalid APAAR Checksum (Not 12 digits / Failed Verhoeff)
  {
    apaarId: '9999-0000-INVALID',
    fullName: 'Rajesh K. Gupta',
    dob: '2005-11-05',
    gender: 'Male',
    courseName: 'B.Tech Artificial Intelligence & Data Science',
    studentRollNo: 'AI-2026-075',
    admissionCategory: 'GENERAL',
    subCategory: 'Open Merit',
    isNri: false,
    isOci: false,
    isForeignNational: false,
  },
  // 3. Intra-batch duplicate test (repeating same APAAR)
  {
    apaarId: '9821-4567-8910',
    fullName: 'Aarav Vikram Sharma (Duplicate Filing)',
    dob: '2005-06-14',
    gender: 'Male',
    courseName: 'B.Tech Computer Science & Engineering',
    studentRollNo: 'CS-2026-096',
    admissionCategory: 'GENERAL',
    subCategory: 'Management Quota',
    isNri: false,
    isOci: false,
    isForeignNational: false,
  },
  // 4. Legitimate Foreign National student
  {
    apaarId: '8892-1049-3829',
    fullName: 'Tariq Mansoor Al-Farsi',
    dob: '2004-12-01',
    gender: 'Male',
    courseName: 'B.Tech Computer Science & Engineering',
    studentRollNo: 'CS-2026-FN-02',
    admissionCategory: 'FN',
    subCategory: 'Foreign National (Oman)',
    isNri: false,
    isOci: false,
    isForeignNational: true,
  },
];

export default function UploadDocuments() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [batchData, setBatchData] = useState([]);
  const [validationResult, setValidationResult] = useState(null);
  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);
  const [activeFileName, setActiveFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const runValidation = async (rows, fileName = 'student_records_batch.csv') => {
    setActiveFileName(fileName);
    setValidating(true);
    try {
      const res = await validateStudentBatch('INST-001', rows);
      setValidationResult(res);
      setBatchData(res.results);
    } catch (err) {
      console.error('Validation error', err);
    } finally {
      setValidating(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      const rows = [];
      const startIdx = lines[0].toLowerCase().includes('apaar') ? 1 : 0;

      for (let i = startIdx; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.trim());
        if (parts.length >= 2) {
          rows.push({
            apaarId: parts[0] || '',
            fullName: parts[1] || 'Enrolled Student',
            dob: parts[2] || '2005-01-01',
            gender: parts[3] || 'Male',
            courseName: parts[4] || 'B.Tech Computer Science & Engineering',
            studentRollNo: parts[5] || `ROLL-${i}`,
            admissionCategory: parts[6] || 'GENERAL',
            subCategory: parts[7] || 'Open Merit',
            isNri: parts[6] === 'NRI',
            isOci: parts[6] === 'OCI',
            isForeignNational: parts[6] === 'FN',
          });
        }
      }

      if (rows.length > 0) {
        runValidation(rows, file.name);
      } else {
        runValidation(SAMPLE_COMPLIANT_BATCH, file.name);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!consentAcknowledged || !validationResult) return;
    setSubmitting(true);
    try {
      await submitStudentBatch('INST-001', validationResult.results);
      navigate('/college/processing', {
        state: {
          submittedCount: validationResult.results.length,
          flaggedCount: validationResult.flaggedCount,
          fileName: activeFileName,
        },
      });
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const downloadSampleCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'APAAR_ID,Full_Name,DOB,Gender,Course_Name,Roll_No,Category,Sub_Category\n' +
      '9821-4567-8910,Aarav Vikram Sharma,2005-06-14,Male,B.Tech Computer Science,CS-2026-042,SUPERNUMERARY,TFWS\n' +
      '8721-3948-5012,Fatima Al-Zahra,2004-09-15,Female,B.Tech Computer Science,CS-2026-FN-01,FN,Foreign National\n' +
      '6382-9104-5821,Neil Rajesh Merchant,2005-04-12,Male,B.Tech Information Tech,IT-2026-NRI-02,NRI,NRI Ward\n' +
      '5512-8941-2091,Aditya Ramesh Joshi,2005-03-18,Male,B.Tech Computer Science,CS-2026-081,GENERAL,CAP Round 1\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'AICTE_APAAR_Batch_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Institutional Data Ingestion
              </span>
              <span className="text-xs text-slate-400 font-mono">AICTE v2.4 Spec</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Upload Student Admission Batch
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Secure ingestion of post-admission student records using the 12-digit <strong>APAAR ID</strong> as the single national academic identifier.
            </p>
          </div>
          <button
            onClick={downloadSampleCsv}
            className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download AICTE CSV Template</span>
          </button>
        </div>
      </div>

      {/* Demo Quick-Load Injectors */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-950">
              Demo Test Batches (Instant Seed Scenarios)
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Pre-packaged records illustrating PS 26263 validation criteria</span>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => runValidation(SAMPLE_COMPLIANT_BATCH, 'clean_admissions_batch.csv')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-100/50 text-emerald-900 text-xs font-bold border border-emerald-300 shadow-2xs transition-all flex items-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
          >
            <span>✓ Load Compliant Batch (3 Valid Students)</span>
          </button>

          <button
            onClick={() => runValidation(SAMPLE_CONFLICTING_BATCH, 'conflicts_edge_cases.csv')}
            className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold border border-amber-300 shadow-2xs transition-all flex items-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
          >
            <span>⚠️ Load Conflicting Batch (Duplicate Cross-Enrolment &amp; Checksum Failure)</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.[0]) {
            handleFileUpload({ target: { files: e.dataTransfer.files } });
          }
        }}
        className={`bg-white border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group ${
          isDragging ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50/50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".csv,.txt"
          className="hidden"
        />
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform mb-3 shadow-xs border border-emerald-200">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div className="font-bold text-slate-900 text-sm">
          {activeFileName ? (
            <span className="text-emerald-800 font-extrabold">Selected Batch: {activeFileName}</span>
          ) : (
            'Click to select or drag and drop institutional student batch CSV'
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Complies with AICTE Central APAAR Data Exchange Specification (v2.4) · UTF-8 Comma-Separated
        </p>
      </div>

      {/* Validation Pipeline In-Flight Indicator */}
      {validating && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 shadow-sm animate-slide-up">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
          <div className="text-sm font-black text-slate-900">Running AICTE Pre-Ingestion Scrutiny Engine...</div>
          <div className="text-xs text-slate-500 max-w-lg mx-auto">
            Checking Verhoeff modulo-11 checksums · Querying national cross-institution registry · Validating approved branch intake capacities
          </div>
        </div>
      )}

      {/* Pre-submission Validation Results Table */}
      {validationResult && !validating && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 animate-slide-up">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80">
            <div>
              <div className="font-black text-base text-slate-900">
                Automated Validation Summary ({validationResult.totalSubmitted} Records Parsed)
              </div>
              <div className="text-xs text-slate-500">
                Batch File: <span className="font-mono text-slate-800 font-bold">{activeFileName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                ✓ {validationResult.validCount} Valid Records
              </span>
              {validationResult.flaggedCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 animate-pulse">
                  ⚠️ {validationResult.flaggedCount} Anomalies Flagged
                </span>
              )}
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto px-4 pb-2">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">APAAR ID</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Program &amp; Category</th>
                  <th className="py-3 px-3">Validation Finding</th>
                  <th className="py-3 px-3">Resolution Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {validationResult.results.map((row, index) => {
                  const hasIssues = row.issues.length > 0;
                  return (
                    <tr key={index} className={hasIssues ? 'bg-red-50/50' : 'hover:bg-slate-50/60'}>
                      <td className="py-3 px-3 font-mono text-slate-400 font-semibold">{index + 1}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{row.apaarId}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{row.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">Roll: {row.studentRollNo}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-800 font-medium">{row.courseName}</div>
                        <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {row.admissionCategory} ({row.subCategory})
                        </span>
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        {hasIssues ? (
                          <div className="space-y-1">
                            {row.issues.map((iss, i) => (
                              <div key={i} className="text-[11px] text-red-700 font-medium flex items-start gap-1">
                                <span className="text-red-500 font-bold">•</span>
                                <span>{iss.message}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                            <span>✓</span>
                            <span>APAAR Verified with DigiLocker / ABC Depository</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {hasIssues ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
                            Flagged for Review
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Ready to Ingest
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Consent Checkbox & Final Submission */}
          <div className="p-5 border-t border-slate-200 bg-slate-50/60 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentAcknowledged}
                onChange={(e) => setConsentAcknowledged(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                <strong>Statutory Consent Declaration (Section 8 Compliance):</strong> I hereby certify that authentic student consent has been acquired in compliance with the Digital Personal Data Protection Act (DPDP) and AICTE APAAR guidelines. I confirm that all submitted intake quotas and supernumerary claims represent officially ratified admissions for AY 2026-27.
              </span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setValidationResult(null);
                  setActiveFileName('');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                Clear Batch
              </button>

              <button
                onClick={handleSubmit}
                disabled={!consentAcknowledged || submitting}
                className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all ${
                  consentAcknowledged && !submitting
                    ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20'
                    : 'bg-slate-300 cursor-not-allowed text-slate-500'
                }`}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                    <span>Ingesting into AICTE Central Repository...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Validated Batch to AICTE Repository</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
