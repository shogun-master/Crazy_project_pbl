import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout/Layout';

// Auth Pages
import AuthPage from './pages/Auth/AuthPage';

// User Pages
import UserDashboard from './pages/User/UserDashboard';
import TaskDetailsPage from './pages/User/TaskDetailsPage';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageTasksPage from './pages/Admin/ManageTasksPage';
import CreateTaskPage from './pages/Admin/CreateTaskPage';
import PendingVerificationsPage from './pages/Admin/PendingVerificationsPage';
import TaskVerificationPage from './pages/Admin/TaskVerificationPage';
import UserVerificationPage from './pages/Admin/UserVerificationPage';

// Route Guards
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<AuthPage />} />
                
                {/* User Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/tasks" element={<ManageTasksPage />} />
                  <Route path="/tasks/:taskId" element={<TaskDetailsPage />} />
                </Route>
                
                {/* Admin Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/tasks" element={<ManageTasksPage />} />
                  <Route path="/admin/tasks/new" element={<CreateTaskPage />} />
                  <Route path="/admin/verification" element={<PendingVerificationsPage />} />
                  <Route path="/admin/verify/:taskId" element={<TaskVerificationPage />} />
                  <Route path="/admin/users/verify" element={<UserVerificationPage />} />
                </Route>
                
                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Route>
            </Routes>
          </Router>
        </NotificationProvider>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App