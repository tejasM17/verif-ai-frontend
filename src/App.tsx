import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import StudentHomePage from './pages/StudentHomePage';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PublicProfilePage from './pages/PublicProfilePage';
import { useAuthStore } from './store/authStore';

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
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
        
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

        {/* Public Profile */}
        <Route 
          path="/profile/:userId" 
          element={<ProtectedRoute element={<PublicProfilePage />} requiredRole="recruiter" />}
        />
        
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
