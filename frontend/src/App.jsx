
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LoginPage from './pages/auth/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import MarkAttendance from './pages/dashboard/MarkAttendance';
import AttendanceHistory from './pages/dashboard/AttendanceHistory';
import CorrectionRequests from './pages/dashboard/CorrectionRequests';
import StudentAnalytics from './pages/dashboard/StudentAnalytics';
import DayShortageCalculator from './pages/dashboard/DayShortageCalculator';
import StudentCorrectionRequests from './pages/dashboard/StudentCorrectionRequests';

import ProtectedRoute from './components/common/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import ManageSubjects from './pages/admin/ManageSubjects';
import ManageFaculty from './pages/admin/ManageFaculty';
import ManageSections from './pages/admin/ManageSections';
import ManageDepartments from './pages/admin/ManageDepartments';
import InstituteProfile from './pages/admin/InstituteProfile';
import AdminReports from './pages/admin/AdminReports';

function RoleBasedCorrectionRequests() {
  const { role } = useAuth();

  if (role === 'student') {
    return <StudentCorrectionRequests />;
  }

  if (role === 'faculty') {
    return <CorrectionRequests />;
  }

  return <Navigate to="/dashboard" replace />;
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />

          {/* Admin Pages */}
          <Route path="subjects" element={<ManageSubjects />} />
          <Route path="faculty" element={<ManageFaculty />} />
          <Route path="sections" element={<ManageSections />} />
          <Route path="departments" element={<ManageDepartments />} />
          <Route path="institute" element={<InstituteProfile />} />
          <Route path="reports" element={<AdminReports />} />

          {/* Faculty Pages */}
          <Route path="mark-attendance" element={<MarkAttendance />} />
          <Route path="history" element={<AttendanceHistory />} />

          {/* Student Pages */}
          <Route path="analytics" element={<StudentAnalytics />} />
          <Route path="calculator" element={<DayShortageCalculator />} />

          {/* Role-based Correction Requests */}
          <Route
            path="corrections"
            element={<RoleBasedCorrectionRequests />}
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
