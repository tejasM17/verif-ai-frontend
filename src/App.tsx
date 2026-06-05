import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import StudentHomePage from './pages/StudentHomePage';
import RecruiterDashboard from './pages/RecruiterDashboard';
import RecruiterHomePage from './pages/RecruiterHomePage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import MyDocumentsPage from './pages/MyDocumentsPage';
import ShortlistPage from './pages/ShortlistPage';
import PublicProfilePage from './pages/PublicProfilePage';
import SettingsPage from './pages/SettingsPage';
import { useAuthStore } from './store/authStore';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageTransition } from './components/PageTransition';

const ProtectedRoute: React.FC<{
  element: React.ReactNode;
  requiredRole?: 'student' | 'recruiter' | 'both';
}> = ({ element, requiredRole = 'both' }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole !== 'both' && user?.role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return <>{element}</>;
};

const App: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <ErrorBoundary>
      <Router>
        <Toaster position="top-right" />
        <PageTransition>
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={user?.role === 'student' ? '/home' : '/recruiter-home'} />} />
            <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to={user?.role === 'student' ? '/home' : '/recruiter-home'} />} />

            {/* Dashboard - Route based on role */}
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  user?.role === 'student' ? (
                    <ProtectedRoute element={<StudentDashboard />} requiredRole="student" />
                  ) : (
                    <ProtectedRoute element={<RecruiterDashboard />} requiredRole="recruiter" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Student Dashboard */}
            <Route
              path="/student"
              element={<ProtectedRoute element={<StudentDashboard />} requiredRole="student" />}
            />

            {/* Student Home Page - Job Search */}
            <Route
              path="/home"
              element={<ProtectedRoute element={<StudentHomePage />} requiredRole="student" />}
            />

            {/* Recruiter Discovery */}
            <Route
              path="/discover"
              element={<ProtectedRoute element={<RecruiterDashboard />} requiredRole="recruiter" />}
            />

            {/* Recruiter Home - Applications */}
            <Route
              path="/recruiter-home"
              element={<ProtectedRoute element={<RecruiterHomePage />} requiredRole="recruiter" />}
            />

            {/* Application Detail */}
            <Route
              path="/recruiter/application/:applicationId"
              element={<ProtectedRoute element={<ApplicationDetailPage />} requiredRole="recruiter" />}
            />

            {/* My Documents (Student) */}
            <Route
              path="/documents"
              element={<ProtectedRoute element={<MyDocumentsPage />} requiredRole="student" />}
            />

            {/* Shortlist (Recruiter) */}
            <Route
              path="/shortlist"
              element={<ProtectedRoute element={<ShortlistPage />} requiredRole="recruiter" />}
            />

            {/* Public Profile */}
            <Route
              path="/profile/:userId"
              element={<ProtectedRoute element={<PublicProfilePage />} requiredRole="recruiter" />}
            />

            {/* Settings */}
            <Route
              path="/settings"
              element={<ProtectedRoute element={<SettingsPage />} />}
            />

            <Route path="/" element={isAuthenticated ? <Navigate to={user?.role === 'student' ? '/home' : '/recruiter-home'} /> : <LandingPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </PageTransition>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
