import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import StudentDashboard from "./pages/StudentDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import CompanyDetail from "./pages/CompanyDetail";
import StudentAppliedCompanies from "./pages/StudentAppliedCompanies";
import CompanyJobs from "./pages/CompanyJobs";
import ApplicationForm from "./pages/ApplicationForm";
import ApplicationDetail from "./pages/ApplicationDetail";
import JobEditor from "./pages/JobEditor";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="company/:uid" element={<CompanyDetail />} />
            <Route path="applied" element={<StudentAppliedCompanies />} />
            <Route path="company/:uid/jobs" element={<CompanyJobs />} />
            <Route path="apply/:uid" element={<ApplicationForm />} />
            <Route path="application/:appId" element={<ApplicationDetail />} />
          </Route>

          {/* Recruiter Routes */}
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<RecruiterDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="company/:uid" element={<CompanyDetail />} />
            <Route path="jobs/new" element={<JobEditor />} />
            <Route path="jobs/:uid/edit" element={<JobEditor />} />
          </Route>

          {/* Dashboard redirect based on role */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleRedirect />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function RoleRedirect() {
  const { userRole } = useAuth();
  return <Navigate to={userRole === "recruiter" ? "/recruiter" : "/student"} replace />;
}