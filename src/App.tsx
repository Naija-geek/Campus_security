import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import PersonnelDashboard from './pages/personnel/PersonnelDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import DutyPosts from './pages/personnel/DutyPosts';
import LeaveRequests from './pages/personnel/LeaveRequests';
import SalaryView from './pages/personnel/SalaryView';
import LoanRequests from './pages/personnel/LoanRequests';
import OvertimeRequests from './pages/personnel/OvertimeRequests';
import ManageLeaveRequests from './pages/manager/ManageLeaveRequests';
import AssignDuty from './pages/manager/AssignDuty';
import ViewPersonnel from './pages/manager/ViewPersonnel';
import ManageLoanRequests from './pages/manager/ManageLoanRequests';
import UserManagement from './pages/admin/UserManagement';
import PasswordManagement from './pages/admin/PasswordManagement';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import './styles/animations.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              
              {/* Personnel Routes */}
              <Route 
                path="/personnel" 
                element={
                  <ProtectedRoute allowedRoles={['personnel']}>
                    <PersonnelDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/personnel/duty-posts" 
                element={
                  <ProtectedRoute allowedRoles={['personnel']}>
                    <DutyPosts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/personnel/leave-requests" 
                element={
                  <ProtectedRoute allowedRoles={['personnel']}>
                    <LeaveRequests />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/personnel/salary" 
                element={
                  <ProtectedRoute allowedRoles={['personnel']}>
                    <SalaryView />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/personnel/loan-requests" 
                element={
                  <ProtectedRoute allowedRoles={['personnel']}>
                    <LoanRequests />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/personnel/overtime-requests" 
                element={
                  <ProtectedRoute allowedRoles={['personnel']}>
                    <OvertimeRequests />
                  </ProtectedRoute>
                } 
              />
              
              {/* Manager Routes */}
              <Route 
                path="/manager" 
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <ManagerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/manager/leave-requests" 
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <ManageLeaveRequests />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/manager/assign-duty" 
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <AssignDuty />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/manager/personnel" 
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <ViewPersonnel />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/manager/loan-requests" 
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <ManageLoanRequests />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/password-management" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <PasswordManagement />
                  </ProtectedRoute>
                } 
              />
              
              {/* Default Routes */}
              <Route path="/" element={<Navigate to="/register" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;