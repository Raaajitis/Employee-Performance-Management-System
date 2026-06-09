import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import ProjectManagement from './pages/admin/ProjectManagement';
import OrganizationAttendance from './pages/admin/OrganizationAttendance';

// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import TeamAttendance from './pages/manager/TeamAttendance';
import SubmitReview from './pages/manager/SubmitReview';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MarkAttendance from './pages/employee/MarkAttendance';
import PerformanceScorecard from './pages/employee/PerformanceScorecard';

// Home helper component to auto-redirect users to their dashboards
const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'MANAGER') return <Navigate to="/manager/dashboard" replace />;
  return <Navigate to="/employee/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Core App Protected Routes under Layout */}
          <Route path="/" element={<Layout />}>
            {/* Landing index redirect */}
            <Route index element={<DashboardHome />} />

            {/* Admin Routes */}
            <Route 
              path="admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/employees" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <EmployeeManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/projects" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ProjectManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/attendance" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <OrganizationAttendance />
                </ProtectedRoute>
              } 
            />

            {/* Manager Routes */}
            <Route 
              path="manager/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['MANAGER']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="manager/attendance" 
              element={
                <ProtectedRoute allowedRoles={['MANAGER']}>
                  <TeamAttendance />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="manager/reviews" 
              element={
                <ProtectedRoute allowedRoles={['MANAGER']}>
                  <SubmitReview />
                </ProtectedRoute>
              } 
            />

            {/* Employee Routes */}
            <Route 
              path="employee/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="employee/attendance" 
              element={
                <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                  <MarkAttendance />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="employee/performance" 
              element={
                <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                  <PerformanceScorecard />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Catch-all Redirects to Landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
