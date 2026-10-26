import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { ROLE } from './constants';

// Shared / Public
import Login from './pages/Login';
import StakeholderVerification from './pages/StakeholderVerification';

// AICTE Central Surveillance Portal
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CrossEnrolmentGraphPage from './pages/CrossEnrolmentGraphPage';
import AuditTrail from './pages/AuditTrail';

// Institution Student Registry Portal
import CollegeLayout from './portals/college/CollegeLayout';
import StartApplication from './portals/college/pages/StartApplication';
import UploadDocuments from './portals/college/pages/UploadDocuments';
import AIProcessing from './portals/college/pages/AIProcessing';
import Deficiencies from './portals/college/pages/Deficiencies';

const isDevToolsEnabled = import.meta.env.VITE_DEV_TOOLS === 'true';

/**
 * Route guard component. Redirects to login if the user's current role
 * doesn't match the required role. No real auth — just Zustand state.
 */
function PortalGuard({ requiredRole, children }) {
  const currentRole = useAppStore((s) => s.currentRole);
  if (!currentRole) {
    return <Navigate to="/" replace />;
  }
  if (currentRole !== requiredRole) {
    // If logged in but wrong portal, redirect to their portal
    const portalRoutes = {
      [ROLE.OFFICER]: '/officer/dashboard',
      [ROLE.COLLEGE]: '/college/application',
      [ROLE.ADMIN]: '/admin/checklists',
      [ROLE.VERIFIER]: '/verify',
    };
    return <Navigate to={portalRoutes[currentRole] || '/'} replace />;
  }
  return children;
}

export default function App() {
  const currentRole = useAppStore((s) => s.currentRole);

  // Dynamically import ComponentsShowcase only when dev tools are enabled
  const ComponentsShowcase = isDevToolsEnabled
    ? React.lazy(() => import('./pages/ComponentsShowcase'))
    : null;

  return (
    <BrowserRouter>
      <Routes>
        {/* Login / Role Switcher */}
        <Route
          path="/"
          element={
            currentRole ? (
              <Navigate
                to={
                  currentRole === ROLE.OFFICER
                    ? '/officer/dashboard'
                    : currentRole === ROLE.COLLEGE
                    ? '/college/application'
                    : '/verify'
                }
                replace
              />
            ) : (
              <Login />
            )
          }
        />

        {/* ─── AICTE Central Surveillance Portal ─── */}
        <Route
          path="/officer"
          element={
            <PortalGuard requiredRole={ROLE.OFFICER}>
              <Layout />
            </PortalGuard>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="graph" element={<CrossEnrolmentGraphPage />} />
          <Route path="audit" element={<AuditTrail />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* ─── Institution Student Registry Portal ─── */}
        <Route
          path="/college"
          element={
            <PortalGuard requiredRole={ROLE.COLLEGE}>
              <CollegeLayout />
            </PortalGuard>
          }
        >
          <Route index element={<Navigate to="application" replace />} />
          <Route path="application" element={<StartApplication />} />
          <Route path="upload" element={<UploadDocuments />} />
          <Route path="processing" element={<AIProcessing />} />
          <Route path="deficiencies" element={<Deficiencies />} />
          <Route path="*" element={<Navigate to="application" replace />} />
        </Route>

        {/* ─── Stakeholder / Public Verification ─── */}
        <Route path="/verify" element={<StakeholderVerification />} />
        <Route path="/verify/:apaarId" element={<StakeholderVerification />} />

        {/* Global fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
