import initialApplications from '../mock/applications.json';
import initialFindings from '../mock/findings.json';
import initialAudit from '../mock/audit.json';
import initialAlerts from '../mock/alerts.json';
import { INSTITUTIONS_DATA, STUDENT_RECORDS_DATA, APAAR_GRAPH_DATA, GRAPH_CASES } from '../mock/apaarData.js';
import {
  AUDIT_ACTION,
  AUDIT_ACTOR,
  DECISION_TO_APPLICATION_STATUS,
  APPLICATION_STATUS,
  FINDING_STATUS,
  SEVERITY,
  DEMO_TODAY,
} from '../constants.js';

// Deep clone helper
const clone = (data) => JSON.parse(JSON.stringify(data));

// In-memory state
let applications = clone(initialApplications);
let findings = clone(initialFindings);
let auditTrail = clone(initialAudit);
let alerts = clone(initialAlerts);
let institutions = clone(INSTITUTIONS_DATA);
let students = clone(STUDENT_RECORDS_DATA);
let apaarGraph = clone(APAAR_GRAPH_DATA);

function get90DaysLimit(anchorStr) {
  const d = new Date(anchorStr + 'T00:00:00Z');
  d.setDate(d.getDate() + 90);
  return d.toISOString().slice(0, 10);
}

/**
 * Enriches an application with derived computed fields:
 * - openFindings (count of findings whose status is not VERIFIED)
 * - highSeverityOpen (count of findings with status not VERIFIED and severity HIGH)
 * - hasExpired (boolean indicating if any document or finding has lapsed validity against DEMO_TODAY)
 * - lastUpdated (timestamp of latest audit event for this application)
 */
function enrichApplication(app) {
  const appFindings = findings.filter((f) => f.applicationId === app.id);

  // Open findings: status not VERIFIED
  const openFindings = appFindings.filter((f) => f.status !== FINDING_STATUS.VERIFIED).length;

  // High-severity open: status not VERIFIED and severity high
  const highSeverityOpen = appFindings.filter(
    (f) =>
      f.status !== FINDING_STATUS.VERIFIED &&
      (f.severity || '').toLowerCase() === SEVERITY.HIGH
  ).length;

  // Expired check: document status EXPIRED, doc.validUpto < DEMO_TODAY, or finding status EXPIRED
  const hasExpired = Boolean(
    app.documents?.some(
      (d) =>
        d.status === FINDING_STATUS.EXPIRED ||
        (d.validUpto && d.validUpto < DEMO_TODAY)
    ) ||
    appFindings.some((f) => f.status === FINDING_STATUS.EXPIRED)
  );

  // Latest audit event timestamp for application
  const appAudit = auditTrail.filter((e) => e.applicationId === app.id);
  let lastUpdated = app.submittedOn ? `${app.submittedOn}T10:00:00Z` : new Date().toISOString();
  if (appAudit.length > 0) {
    const sorted = [...appAudit].sort(
      (a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime()
    );
    lastUpdated = sorted[0].ts;
  }

  return {
    ...clone(app),
    openFindings,
    highSeverityOpen,
    hasExpired,
    lastUpdated,
  };
}

/**
 * Dynamically derives alerts from current data (AGENTS.md Section 5.4 & Step 8 instructions):
 * - Documents expiring within 90 days of DEMO_TODAY
 * - Documents with VERIFICATION_PENDING or SOURCE_UNAVAILABLE
 * - Unresolved high-severity discrepancies on applications with no decision yet
 * Applications with an officer decision no longer raise unresolved alerts.
 */
function deriveAlerts() {
  const limitDateStr = get90DaysLimit(DEMO_TODAY);
  const derivedList = [];

  for (const app of applications) {
    // Check if an officer decision has already been recorded
    const hasDecision = Boolean(
      app.decision ||
      app.lastDecision ||
      [
        APPLICATION_STATUS.APPROVED,
        APPLICATION_STATUS.INFO_REQUESTED,
        APPLICATION_STATUS.SENT_FOR_INSPECTION,
      ].includes(app.status)
    );

    // If decided, application no longer raises unresolved alerts
    if (hasDecision) {
      continue;
    }

    const appFindings = findings.filter((f) => f.applicationId === app.id);
    const handledDocIds = new Set();

    // 1. Documents expiring soon, expired, pending, or source unavailable
    if (Array.isArray(app.documents)) {
      for (const doc of app.documents) {
        // Expired check
        const isDocExpired =
          doc.status === FINDING_STATUS.EXPIRED ||
          (doc.validUpto && doc.validUpto < DEMO_TODAY);

        if (isDocExpired) {
          handledDocIds.add(doc.id);
          const finding = appFindings.find(
            (f) => f.docId === doc.id && f.status === FINDING_STATUS.EXPIRED
          );
          derivedList.push({
            id: `ALT-${app.id}-${doc.id}-expired`,
            type: 'DOCUMENT_EXPIRED',
            title: `${doc.type || 'Document'} Expired`,
            message: `${doc.type || 'Document'} expired${doc.validUpto ? ` on ${doc.validUpto}` : ''}. Extension of Approval requires valid statutory coverage.`,
            applicationId: app.id,
            institute: app.institute,
            severity: SEVERITY.HIGH,
            link: finding
              ? `/officer/applications/${app.id}/findings/${finding.id}`
              : `/officer/applications/${app.id}`,
            ts: app.submittedOn ? `${app.submittedOn}T10:15:00Z` : new Date().toISOString(),
          });
          continue;
        }

        // Expiring within 90 days of DEMO_TODAY
        if (doc.validUpto && doc.validUpto >= DEMO_TODAY && doc.validUpto <= limitDateStr) {
          handledDocIds.add(doc.id);
          derivedList.push({
            id: `ALT-${app.id}-${doc.id}-expiring-soon`,
            type: 'EXPIRING_SOON',
            title: `${doc.type || 'Document'} Expiring Soon`,
            message: `${doc.type || 'Document'} validity ends on ${doc.validUpto} (within 90 days of review). Verification needed.`,
            applicationId: app.id,
            institute: app.institute,
            severity: SEVERITY.MEDIUM,
            link: `/officer/applications/${app.id}`,
            ts: app.submittedOn ? `${app.submittedOn}T10:20:00Z` : new Date().toISOString(),
          });
          continue;
        }

        // Verification pending
        if (doc.status === FINDING_STATUS.VERIFICATION_PENDING) {
          handledDocIds.add(doc.id);
          derivedList.push({
            id: `ALT-${app.id}-${doc.id}-pending`,
            type: 'VERIFICATION_PENDING',
            title: `${doc.type || 'Document'} Verification Pending`,
            message: `Automated verification query queued with issuing authority for ${doc.type || 'document'}.`,
            applicationId: app.id,
            institute: app.institute,
            severity: SEVERITY.LOW,
            link: `/officer/applications/${app.id}`,
            ts: app.submittedOn ? `${app.submittedOn}T10:25:00Z` : new Date().toISOString(),
          });
          continue;
        }

        // Source unavailable
        if (doc.status === FINDING_STATUS.SOURCE_UNAVAILABLE) {
          handledDocIds.add(doc.id);
          derivedList.push({
            id: `ALT-${app.id}-${doc.id}-source-unavail`,
            type: 'SOURCE_UNAVAILABLE',
            title: `${doc.type || 'Document'} Issuing Source Unavailable`,
            message: `Issuing source repository unavailable for ${doc.type || 'document'}. Requires manual officer verification.`,
            applicationId: app.id,
            institute: app.institute,
            severity: SEVERITY.MEDIUM,
            link: `/officer/applications/${app.id}`,
            ts: app.submittedOn ? `${app.submittedOn}T10:30:00Z` : new Date().toISOString(),
          });
          continue;
        }
      }
    }

    // 2. Unresolved high-severity discrepancies on applications with no decision yet
    for (const f of appFindings) {
      if ((f.severity || '').toLowerCase() === SEVERITY.HIGH && f.status !== FINDING_STATUS.VERIFIED) {
        // If already added through doc expired check, avoid duplicate alert
        if (f.status === FINDING_STATUS.EXPIRED && f.docId && handledDocIds.has(f.docId)) {
          continue;
        }

        let alertType = 'UNRESOLVED_DISCREPANCY';
        if (f.status === FINDING_STATUS.EXPIRED) alertType = 'DOCUMENT_EXPIRED';
        else if (f.status === FINDING_STATUS.MANUAL_REVIEW_REQUIRED) alertType = 'MANUAL_REVIEW_REQUIRED';

        derivedList.push({
          id: `ALT-${app.id}-${f.id}`,
          type: alertType,
          title: `${f.rule.replace(/_/g, ' ')} Discrepancy`,
          message: f.explanation || 'Discrepancy detected during statutory rule validation.',
          applicationId: app.id,
          institute: app.institute,
          severity: SEVERITY.HIGH,
          link: `/officer/applications/${app.id}/findings/${f.id}`,
          ts: app.submittedOn ? `${app.submittedOn}T10:14:00Z` : new Date().toISOString(),
        });
      }
    }
  }

  // Sort by severity: HIGH first, then MEDIUM, then LOW
  const severityRank = {
    [SEVERITY.HIGH]: 0,
    [SEVERITY.MEDIUM]: 1,
    [SEVERITY.LOW]: 2,
  };

  derivedList.sort((a, b) => {
    const rankDiff = (severityRank[a.severity] ?? 9) - (severityRank[b.severity] ?? 9);
    if (rankDiff !== 0) return rankDiff;
    return new Date(b.ts).getTime() - new Date(a.ts).getTime();
  });

  return clone(derivedList);
}

export const mockDb = {
  getApplications: () => {
    return applications.map((app) => enrichApplication(app));
  },

  getApplicationById: (id) => {
    const app = applications.find((a) => a.id === id);
    return app ? enrichApplication(app) : null;
  },

  getFindingsByAppId: (appId) => {
    return clone(findings.filter((f) => f.applicationId === appId));
  },

  getFindingById: (fid) => {
    const finding = findings.find((f) => f.id === fid);
    return finding ? clone(finding) : null;
  },

  getAuditEvents: (appId) => {
    const list = appId
      ? auditTrail.filter((e) => e.applicationId === appId)
      : auditTrail;
    return clone(
      [...list].sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
    );
  },

  getAlerts: () => {
    return deriveAlerts();
  },

  /**
   * Submit officer decision. Supports both:
   * submitDecision(appId, decision, remarks, officerId)
   * and submitDecision(appId, { decision, remarks, officer })
   */
  submitDecision: (appId, decisionArg, remarksArg, officerIdArg) => {
    const appIndex = applications.findIndex((a) => a.id === appId);
    if (appIndex === -1) {
      throw new Error(`Application with id ${appId} not found`);
    }

    let decision, remarks, officerId;
    if (typeof decisionArg === 'object' && decisionArg !== null) {
      decision = decisionArg.decision;
      remarks = decisionArg.remarks;
      officerId = decisionArg.officer || decisionArg.officerId || AUDIT_ACTOR.OFFICER;
    } else {
      decision = decisionArg;
      remarks = remarksArg;
      officerId = officerIdArg || AUDIT_ACTOR.OFFICER;
    }

    // Determine target terminal status based on mapping in constants.js
    const newStatus =
      DECISION_TO_APPLICATION_STATUS[decision] || APPLICATION_STATUS.UNDER_OFFICER_REVIEW;

    const timestamp = new Date().toISOString();

    const decisionRecord = {
      decision,
      remarks,
      officer: officerId,
      ts: timestamp,
    };

    // Mutate application in memory
    applications[appIndex] = {
      ...applications[appIndex],
      status: newStatus,
      decision: decisionRecord,
      lastDecision: decisionRecord,
    };

    // 1. Append DECISION_SUBMITTED audit event
    const decisionEvent = {
      id: `AUD-${Date.now()}-1`,
      applicationId: appId,
      ts: timestamp,
      actor: officerId,
      action: AUDIT_ACTION.DECISION_SUBMITTED,
      detail: `Officer decision submitted: ${decision}. Remarks: ${remarks}`,
      ref: appId,
    };

    // 2. Append status-change audit event
    const statusEvent = {
      id: `AUD-${Date.now()}-2`,
      applicationId: appId,
      ts: new Date(Date.now() + 50).toISOString(),
      actor: officerId,
      action: 'APPLICATION_STATUS_UPDATED',
      detail: `Application status transitioned to ${newStatus}`,
      ref: appId,
    };

    auditTrail.unshift(statusEvent);
    auditTrail.unshift(decisionEvent);

    return {
      application: enrichApplication(applications[appIndex]),
      auditEvents: [decisionEvent, statusEvent],
    };
  },

  // ==========================================
  // APAAR STUDENT DATA & VERIFICATION METHODS
  // ==========================================

  getInstitutions: () => clone(institutions),

  getInstitutionById: (id) => clone(institutions.find((i) => i.id === id) || null),

  getStudents: (institutionId) => {
    let list = clone(students);
    if (institutionId) {
      list = list.filter((s) => s.institutionId === institutionId);
    }
    return list;
  },

  getStudentByApaar: (apaarId) => {
    if (!apaarId) return null;
    const clean = apaarId.replace(/[\s-]/g, '');
    const found = students.find((s) => s.apaarId.replace(/[\s-]/g, '') === clean);
    return found ? clone(found) : null;
  },

  getGraph: (id) => {
    if (id && GRAPH_CASES[id]) {
      return clone(GRAPH_CASES[id]);
    }
    return clone(apaarGraph);
  },
  getApaarGraph: (id) => {
    if (id && GRAPH_CASES[id]) {
      return clone(GRAPH_CASES[id]);
    }
    return clone(apaarGraph);
  },

  /**
   * Automated Student Batch Validation Engine
   * Validates APAAR format, intra-batch duplicates, cross-institution conflicts, and intake capacity.
   */
  validateStudentBatch: (institutionId, batchRows) => {
    const institution = institutions.find((i) => i.id === institutionId) || institutions[0];
    const results = [];
    const seenInBatch = new Set();
    let currentTotal = institution.summary.totalActualEnrolment;
    const approvedCap = institution.summary.totalApprovedIntake;

    for (const row of batchRows) {
      const cleanApaar = (row.apaarId || '').replace(/[\s-]/g, '');
      const issues = [];
      let status = 'VERIFIED';

      // 1. Check APAAR format (12 digits)
      if (!/^\d{12}$/.test(cleanApaar)) {
        issues.push({
          type: 'INVALID_APAAR_FORMAT',
          message: `Invalid APAAR format: "${row.apaarId}". Must be a valid 12-digit national academic ID.`,
          severity: 'high',
        });
        status = 'INVALID_APAAR';
      }

      // 2. Intra-batch duplicate check
      if (cleanApaar && seenInBatch.has(cleanApaar)) {
        issues.push({
          type: 'DUPLICATE_INTRA_BATCH',
          message: `Duplicate student entry in the same upload file for APAAR ${row.apaarId}.`,
          severity: 'high',
        });
        status = 'DUPLICATE_INTRA_INSTITUTE';
      }
      if (cleanApaar) seenInBatch.add(cleanApaar);

      // 3. Cross-institution duplicate check against existing national repository
      const crossConflict = students.find(
        (s) => s.apaarId.replace(/[\s-]/g, '') === cleanApaar && s.institutionId !== institutionId
      );
      if (crossConflict) {
        issues.push({
          type: 'CONCURRENT_DUAL_ENROLMENT',
          message: `CRITICAL: APAAR ${row.apaarId} already has an active full-time enrolment at ${crossConflict.institutionName} (${crossConflict.courseName}, Roll: ${crossConflict.studentRollNo}).`,
          severity: 'high',
          conflictingInstitution: crossConflict,
        });
        status = 'DUPLICATE_CROSS_INSTITUTE';
      }

      // 4. Intake Capacity Breach check
      if (currentTotal + 1 > approvedCap + 15) {
        issues.push({
          type: 'INTAKE_CAPACITY_BREACH',
          message: `Admitting student exceeds statutory approved intake cap (${approvedCap} seats).`,
          severity: 'medium',
        });
        if (status === 'VERIFIED') status = 'INTAKE_QUOTA_BREACH';
      }

      currentTotal += 1;

      results.push({
        ...row,
        cleanApaar,
        status,
        issues,
        isNri: Boolean(row.isNri || row.admissionCategory === 'NRI'),
        isOci: Boolean(row.isOci || row.admissionCategory === 'OCI'),
        isForeignNational: Boolean(row.isForeignNational || row.admissionCategory === 'FN'),
      });
    }

    return {
      institutionId,
      totalSubmitted: batchRows.length,
      validCount: results.filter((r) => r.status === 'VERIFIED').length,
      flaggedCount: results.filter((r) => r.status !== 'VERIFIED').length,
      results,
    };
  },

  /**
   * Submit validated student batch and update institution enrolment stats
   */
  submitStudentBatch: (institutionId, validatedBatch) => {
    const instIndex = institutions.findIndex((i) => i.id === institutionId);
    const inst = instIndex !== -1 ? institutions[instIndex] : institutions[0];

    const timestamp = new Date().toISOString();
    const newStudents = validatedBatch.map((s, idx) => ({
      id: `STU-${Date.now()}-${idx}`,
      apaarId: s.apaarId,
      fullName: s.fullName,
      dob: s.dob || '2005-01-01',
      gender: s.gender || 'Not specified',
      institutionId: inst.id,
      institutionName: inst.name,
      courseId: s.courseId || inst.programs[0]?.id || 'PRG-GEN',
      courseName: s.courseName || inst.programs[0]?.name || 'Engineering Curriculum',
      studentRollNo: s.studentRollNo || `ROLL-${Date.now()}-${idx}`,
      admissionYear: inst.academicYear,
      enrolmentDate: new Date().toISOString().slice(0, 10),
      admissionCategory: s.admissionCategory || 'GENERAL',
      subCategory: s.subCategory || 'Open Merit',
      isNri: Boolean(s.isNri),
      isOci: Boolean(s.isOci),
      isForeignNational: Boolean(s.isForeignNational),
      digilockerStatus: s.status === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
      biometricSeeded: s.status === 'VERIFIED',
      verificationStatus: s.status,
    }));

    // Update in-memory students
    students.unshift(...newStudents);

    // Update institution summary counts
    inst.summary.totalActualEnrolment += newStudents.length;
    if (inst.summary.totalActualEnrolment > inst.summary.totalApprovedIntake) {
      inst.summary.status = 'INTAKE_BREACH_DETECTED';
    }

    // Append to audit trail
    const auditEvent = {
      id: `AUD-APAAR-${Date.now()}`,
      applicationId: inst.id,
      ts: timestamp,
      actor: inst.name,
      action: 'STUDENT_BATCH_UPLOADED',
      detail: `Submitted ${newStudents.length} student records under APAAR identification protocol. Flagged: ${validatedBatch.filter(b => b.status !== 'VERIFIED').length}`,
      ref: inst.id,
    };
    auditTrail.unshift(auditEvent);

    return {
      success: true,
      addedCount: newStudents.length,
      institution: clone(inst),
    };
  },

  resetDemo: () => {
    applications = clone(initialApplications);
    findings = clone(initialFindings);
    auditTrail = clone(initialAudit);
    alerts = clone(initialAlerts);
    institutions = clone(INSTITUTIONS_DATA);
    students = clone(STUDENT_RECORDS_DATA);
    apaarGraph = clone(APAAR_GRAPH_DATA);
    return true;
  },
};
