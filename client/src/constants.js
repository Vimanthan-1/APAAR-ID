/**
 * Authoritative constants and status vocabulary for AICTE APAAR Student Data Platform (SIH26263).
 * Problem Statement 26263: Development of an APAAR ID-Based Student Data Management and Verification Platform.
 * Organization: AICTE · Department: Regulation Bureau · Theme: Smart Automation.
 */

// PS status vocabulary (Non-negotiable domain rule #4)
export const FINDING_STATUS = {
  VERIFIED: 'VERIFIED',
  MISMATCH_DETECTED: 'MISMATCH_DETECTED',
  EXPIRED: 'EXPIRED',
  VERIFICATION_PENDING: 'VERIFICATION_PENDING',
  SOURCE_UNAVAILABLE: 'SOURCE_UNAVAILABLE',
  MANUAL_REVIEW_REQUIRED: 'MANUAL_REVIEW_REQUIRED',
};

export const FINDING_STATUS_LABELS = {
  [FINDING_STATUS.VERIFIED]: 'Verified',
  [FINDING_STATUS.MISMATCH_DETECTED]: 'Mismatch detected',
  [FINDING_STATUS.EXPIRED]: 'Expired',
  [FINDING_STATUS.VERIFICATION_PENDING]: 'Verification pending',
  [FINDING_STATUS.SOURCE_UNAVAILABLE]: 'Source unavailable',
  [FINDING_STATUS.MANUAL_REVIEW_REQUIRED]: 'Manual review required',
};

// Application lifecycle statuses
export const APPLICATION_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  AI_VALIDATING: 'AI_VALIDATING',
  VALIDATION_COMPLETE: 'VALIDATION_COMPLETE',
  UNDER_OFFICER_REVIEW: 'UNDER_OFFICER_REVIEW',
  APPROVED: 'APPROVED',
  INFO_REQUESTED: 'INFO_REQUESTED',
  SENT_FOR_INSPECTION: 'SENT_FOR_INSPECTION',
};

export const APPLICATION_STATUS_LABELS = {
  [APPLICATION_STATUS.DRAFT]: 'Draft',
  [APPLICATION_STATUS.SUBMITTED]: 'Submitted',
  [APPLICATION_STATUS.AI_VALIDATING]: 'AI Validating',
  [APPLICATION_STATUS.VALIDATION_COMPLETE]: 'Validation Complete',
  [APPLICATION_STATUS.UNDER_OFFICER_REVIEW]: 'Under Officer Review',
  [APPLICATION_STATUS.APPROVED]: 'Approved',
  [APPLICATION_STATUS.INFO_REQUESTED]: 'More Info Requested',
  [APPLICATION_STATUS.SENT_FOR_INSPECTION]: 'Sent for Inspection',
};

// Severity levels
export const SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const SEVERITY_LABELS = {
  [SEVERITY.LOW]: 'Low Severity',
  [SEVERITY.MEDIUM]: 'Medium Severity',
  [SEVERITY.HIGH]: 'High Severity',
};

// Officer decision types
export const DECISION_TYPE = {
  APPROVE: 'APPROVE',
  REQUEST_MORE_INFO: 'REQUEST_MORE_INFO',
  SEND_FOR_INSPECTION: 'SEND_FOR_INSPECTION',
};

export const DECISION_LABELS = {
  [DECISION_TYPE.APPROVE]: 'Approve',
  [DECISION_TYPE.REQUEST_MORE_INFO]: 'Request more info',
  [DECISION_TYPE.SEND_FOR_INSPECTION]: 'Send for inspection',
};

// Mapping from officer decision to resulting application status
export const DECISION_TO_APPLICATION_STATUS = {
  [DECISION_TYPE.APPROVE]: APPLICATION_STATUS.APPROVED,
  [DECISION_TYPE.REQUEST_MORE_INFO]: APPLICATION_STATUS.INFO_REQUESTED,
  [DECISION_TYPE.SEND_FOR_INSPECTION]: APPLICATION_STATUS.SENT_FOR_INSPECTION,
};

// Audit event actors & actions
export const AUDIT_ACTOR = {
  SYSTEM: 'system',
  OFFICER: 'officer-01',
};

export const AUDIT_ACTION = {
  APPLICATION_RECEIVED: 'APPLICATION_RECEIVED',
  DOCUMENTS_CLASSIFIED: 'DOCUMENTS_CLASSIFIED',
  FIELDS_EXTRACTED: 'FIELDS_EXTRACTED',
  RULE_APPLIED: 'RULE_APPLIED',
  RECORD_CHECKED: 'RECORD_CHECKED',
  SOURCE_RESPONSE: 'SOURCE_RESPONSE',
  ALERT_RAISED: 'ALERT_RAISED',
  VALIDATION_COMPLETE: 'VALIDATION_COMPLETE',
  DECISION_SUBMITTED: 'DECISION_SUBMITTED',
  APPLICATION_STATUS_UPDATED: 'APPLICATION_STATUS_UPDATED',
  // APAAR Domain Audit Actions
  APAAR_VALIDATED: 'APAAR_VALIDATED',
  DUPLICATE_ENROLMENT_FLAGGED: 'DUPLICATE_ENROLMENT_FLAGGED',
  INTAKE_BREACH_DETECTED: 'INTAKE_BREACH_DETECTED',
  STUDENT_BATCH_UPLOADED: 'STUDENT_BATCH_UPLOADED',
  STAKEHOLDER_VERIFICATION: 'STAKEHOLDER_VERIFICATION',
  SHOW_CAUSE_ISSUED: 'SHOW_CAUSE_ISSUED',
  CONSENT_RECORDED: 'CONSENT_RECORDED',
  CERTIFICATE_GENERATED: 'CERTIFICATE_GENERATED',
};

export const AUDIT_ACTION_LABELS = {
  [AUDIT_ACTION.APPLICATION_RECEIVED]: 'Application Received',
  [AUDIT_ACTION.DOCUMENTS_CLASSIFIED]: 'Documents Classified',
  [AUDIT_ACTION.FIELDS_EXTRACTED]: 'Fields Extracted',
  [AUDIT_ACTION.RULE_APPLIED]: 'Rule Applied',
  [AUDIT_ACTION.RECORD_CHECKED]: 'Record Checked',
  [AUDIT_ACTION.SOURCE_RESPONSE]: 'Source Response',
  [AUDIT_ACTION.ALERT_RAISED]: 'Alert Raised',
  [AUDIT_ACTION.VALIDATION_COMPLETE]: 'Validation Complete',
  [AUDIT_ACTION.DECISION_SUBMITTED]: 'Decision Submitted',
  [AUDIT_ACTION.APPLICATION_STATUS_UPDATED]: 'Status Transitioned',
  // APAAR Domain Labels
  [AUDIT_ACTION.APAAR_VALIDATED]: 'APAAR Registry Verification',
  [AUDIT_ACTION.DUPLICATE_ENROLMENT_FLAGGED]: 'Duplicate Enrolment Flagged',
  [AUDIT_ACTION.INTAKE_BREACH_DETECTED]: 'Intake Quota Breach',
  [AUDIT_ACTION.STUDENT_BATCH_UPLOADED]: 'Student Batch Ingested',
  [AUDIT_ACTION.STAKEHOLDER_VERIFICATION]: 'Stakeholder Identity Query',
  [AUDIT_ACTION.SHOW_CAUSE_ISSUED]: 'Regulatory Notice Issued',
  [AUDIT_ACTION.CONSENT_RECORDED]: 'DPDP Student Consent Archived',
  [AUDIT_ACTION.CERTIFICATE_GENERATED]: 'Verifiable Certificate Generated',
};

// Standard disclaimers & UI labels
export const DISCLAIMER_ADVISORY = 'AI findings are advisory. The decision rests with the officer.';
export const DISCLAIMER_PRELIMINARY = 'Preliminary indicator. Human verification required.';
export const DEMO_RIBBON_TEXT = 'Concept demo · synthetic data';

// Fixed demo anchor date (All expiry/expiring soon calculations use DEMO_TODAY)
export const DEMO_TODAY = '2026-10-21';

// Portal roles (Multi-portal repo conventions, AGENTS.md Section 13)
export const ROLE = {
  OFFICER: 'officer',
  COLLEGE: 'college',
  ADMIN: 'admin',
  VERIFIER: 'verifier',
};

export const ROLE_LABELS = {
  [ROLE.OFFICER]: 'AICTE Scrutiny Officer',
  [ROLE.COLLEGE]: 'Institution Registrar / College',
  [ROLE.ADMIN]: 'AICTE Administrator',
  [ROLE.VERIFIER]: 'Authorized Stakeholder / Verifier',
};

// Cross-Institution Link & Anomaly Types for LinkGraph
export const LINK_TYPE = {
  DUPLICATE_IDENTIFIER: 'DUPLICATE_IDENTIFIER',
  TEMPORAL_CONFLICT: 'TEMPORAL_CONFLICT',
  SHARED_TRUST: 'SHARED_TRUST',
  CROSS_ENROLMENT: 'CROSS_ENROLMENT',
  INTAKE_BREACH: 'INTAKE_BREACH',
};

export const LINK_TYPE_LABELS = {
  [LINK_TYPE.DUPLICATE_IDENTIFIER]: 'Duplicate APAAR Identifier',
  [LINK_TYPE.TEMPORAL_CONFLICT]: 'Concurrent Admission Overlap',
  [LINK_TYPE.SHARED_TRUST]: 'Shared Academic Depository',
  [LINK_TYPE.CROSS_ENROLMENT]: 'Cross-Institution Dual Enrolment',
  [LINK_TYPE.INTAKE_BREACH]: 'Approved Intake Exceeded',
};

export const RULE_CROSS_INSTITUTION_LINK = 'CROSS_INSTITUTION_LINK';

// APAAR Specific Enrolment and Verification Statuses
export const APAAR_STATUS = {
  VERIFIED: 'VERIFIED',
  DUPLICATE_CROSS_INSTITUTE: 'DUPLICATE_CROSS_INSTITUTE',
  INTAKE_QUOTA_BREACH: 'INTAKE_QUOTA_BREACH',
  INVALID_APAAR: 'INVALID_APAAR',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
};

export const APAAR_STATUS_LABELS = {
  [APAAR_STATUS.VERIFIED]: 'Verified Academic ID',
  [APAAR_STATUS.DUPLICATE_CROSS_INSTITUTE]: 'Cross-Institute Duplicate',
  [APAAR_STATUS.INTAKE_QUOTA_BREACH]: 'Approved Intake Exceeded',
  [APAAR_STATUS.INVALID_APAAR]: 'Invalid APAAR Checksum',
  [APAAR_STATUS.PENDING_VERIFICATION]: 'Pending Verification',
};

// Admission Quota Categories
export const ADMISSION_CATEGORIES = {
  GENERAL: 'GENERAL',
  SUPERNUMERARY: 'SUPERNUMERARY',
  NRI: 'NRI',
  OCI: 'OCI',
  FN: 'FN',
};

export const ADMISSION_CATEGORY_LABELS = {
  [ADMISSION_CATEGORIES.GENERAL]: 'General / Open Merit',
  [ADMISSION_CATEGORIES.SUPERNUMERARY]: 'Supernumerary (TFWS / EWS / PWD)',
  [ADMISSION_CATEGORIES.NRI]: 'Non-Resident Indian (NRI)',
  [ADMISSION_CATEGORIES.OCI]: 'Overseas Citizen of India (OCI)',
  [ADMISSION_CATEGORIES.FN]: 'Foreign National (FN)',
};

