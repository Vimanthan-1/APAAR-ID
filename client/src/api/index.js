import { mockDb } from './mockDb.js';

const ARTIFICIAL_DELAY_MS = 300;

const delay = (ms = ARTIFICIAL_DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch all technical institution applications.
 * @returns {Promise<Array>}
 */
export async function getApplications() {
  await delay();
  return mockDb.getApplications();
}

/**
 * Fetch single application by its ID (e.g. 'APP-001').
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getApplication(id) {
  await delay();
  return mockDb.getApplicationById(id);
}

/**
 * Fetch findings for an application.
 * @param {string} appId
 * @returns {Promise<Array>}
 */
export async function getFindings(appId) {
  await delay();
  return mockDb.getFindingsByAppId(appId);
}

/**
 * Fetch a single finding by ID (e.g. 'F-003').
 * @param {string} fid
 * @returns {Promise<Object|null>}
 */
export async function getFinding(fid) {
  await delay();
  return mockDb.getFindingById(fid);
}

/**
 * Fetch audit events, optionally filtered by application ID.
 * @param {string} [appId]
 * @returns {Promise<Array>}
 */
export async function getAudit(appId) {
  await delay();
  return mockDb.getAuditEvents(appId);
}

/**
 * Submit officer scrutiny decision for an application.
 * @param {string} appId
 * @param {string|Object} decision
 * @param {string} [remarks]
 * @param {string} [officerId]
 * @returns {Promise<{ application: Object, auditEvents: Array }>}
 */
export async function submitDecision(appId, decision, remarks, officerId) {
  await delay();
  return mockDb.submitDecision(appId, decision, remarks, officerId);
}

/**
 * Fetch active alerts for the officer dashboard.
 * @returns {Promise<Array>}
 */
export async function getAlerts() {
  await delay();
  return mockDb.getAlerts();
}

/**
 * Reset demo state back to seed data.
 * @returns {Promise<boolean>}
 */
export async function resetDemo() {
  await delay(100);
  return mockDb.resetDemo();
}

/**
 * Fetch cross-institution relationship graph data.
 * @param {string} [id]
 * @returns {Promise<Object>}
 */
export async function getGraph(id) {
  await delay();
  return mockDb.getGraph(id);
}

export async function getApaarGraph(id) {
  await delay();
  return mockDb.getApaarGraph(id);
}

/**
 * Fetch all institutions with intake and APAAR status.
 * @returns {Promise<Array>}
 */
export async function getInstitutions() {
  await delay();
  return mockDb.getInstitutions();
}

/**
 * Fetch single institution by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getInstitution(id) {
  await delay();
  return mockDb.getInstitutionById(id);
}

/**
 * Fetch student roster, optionally filtered by institution.
 * @param {string} [institutionId]
 * @returns {Promise<Array>}
 */
export async function getStudents(institutionId) {
  await delay();
  return mockDb.getStudents(institutionId);
}

/**
 * Fetch single student by APAAR ID.
 * @param {string} apaarId
 * @returns {Promise<Object|null>}
 */
export async function getStudentByApaar(apaarId) {
  await delay();
  return mockDb.getStudentByApaar(apaarId);
}

/**
 * Run automated validation on a batch of students.
 * @param {string} institutionId
 * @param {Array} batchRows
 * @returns {Promise<Object>}
 */
export async function validateStudentBatch(institutionId, batchRows) {
  await delay(400); // Simulate AICTE validation pipeline latency
  return mockDb.validateStudentBatch(institutionId, batchRows);
}

/**
 * Submit validated student batch to the central AICTE repository.
 * @param {string} institutionId
 * @param {Array} validatedBatch
 * @returns {Promise<Object>}
 */
export async function submitStudentBatch(institutionId, validatedBatch) {
  await delay(500);
  return mockDb.submitStudentBatch(institutionId, validatedBatch);
}
