import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TimelinePage from './pages/TimelinePage';
import DeliverablesPage from './pages/DeliverablesPage';
import ReportsPage from './pages/ReportsPage';
import MessagesPage from './pages/MessagesPage';
import ActivityPage from './pages/ActivityPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateProject from './pages/admin/CreateProject';
import UpdateProgress from './pages/admin/UpdateProgress';
import GenerateReport from './pages/admin/GenerateReport';

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <LoginPage />} />

      {/* Protected routes */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/deliverables" element={<DeliverablesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/activity" element={<ActivityPage />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/create-project" element={<AdminRoute><CreateProject /></AdminRoute>} />
        <Route path="/admin/update-progress" element={<AdminRoute><UpdateProgress /></AdminRoute>} />
        <Route path="/admin/generate-report" element={<AdminRoute><GenerateReport /></AdminRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
