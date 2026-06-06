import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthLayout } from './components/auth';
import { RequireAuth, RequireRole } from './components/auth/RouteGuards';
import ErrorBoundary from './components/common/ErrorBoundary';

const StudentLogin = lazy(() => import('./pages/StudentLogin'));
const StudentSignup = lazy(() => import('./pages/StudentSignup'));
const RecruiterLogin = lazy(() => import('./pages/RecruiterLogin'));
const RecruiterSignup = lazy(() => import('./pages/RecruiterSignup'));
const RoleChooser = lazy(() => import('./pages/RoleChooser'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const SessionExpired = lazy(() => import('./pages/SessionExpired'));
const Forbidden = lazy(() => import('./pages/Forbidden'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const RecruiterDashboard = lazy(() => import('./pages/RecruiterDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function AuthPagesLayout() {
  return (
    <AuthLayout>
      <Suspense
        fallback={
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </AuthLayout>
  );
}

function LoadingFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background dark:bg-dark-background">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/20">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <ErrorBoundary title="Application Error" message="An unexpected error occurred. Please try refreshing the page.">
            <Routes>
            <Route path="/" element={<Navigate to="/role-chooser" replace />} />

            <Route path="/role-chooser" element={<RoleChooser />} />

            <Route path="/auth" element={<AuthPagesLayout />}>
              <Route path="student/login" element={<StudentLogin />} />
              <Route path="student/signup" element={<StudentSignup />} />
              <Route path="recruiter/login" element={<RecruiterLogin />} />
              <Route path="recruiter/signup" element={<RecruiterSignup />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>

            <Route path="/verify-email" element={
              <AuthLayout>
                <Suspense fallback={
                  <div className="flex min-h-[400px] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                  </div>
                }>
                  <VerifyEmail />
                </Suspense>
              </AuthLayout>
            } />

            <Route path="/reset-password" element={
              <AuthLayout>
                <Suspense fallback={
                  <div className="flex min-h-[400px] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                  </div>
                }>
                  <ResetPassword />
                </Suspense>
              </AuthLayout>
            } />

            <Route path="/session-expired" element={
              <AuthLayout>
                <Suspense fallback={
                  <div className="flex min-h-[400px] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                  </div>
                }>
                  <SessionExpired />
                </Suspense>
              </AuthLayout>
            } />

            <Route path="/forbidden" element={
              <Suspense fallback={<LoadingFallback />}>
                <Forbidden />
              </Suspense>
            } />

            <Route
              path="/student/dashboard"
              element={
                <RequireAuth>
                  <RequireRole role="student">
                    <Suspense fallback={
                      <div className="flex min-h-dvh items-center justify-center bg-dark-background">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                      </div>
                    }>
                      <StudentDashboard />
                    </Suspense>
                  </RequireRole>
                </RequireAuth>
              }
            />

            <Route
              path="/recruiter/dashboard"
              element={
                <RequireAuth>
                  <RequireRole role="recruiter">
                    <Suspense fallback={
                      <div className="flex min-h-dvh items-center justify-center bg-dark-background">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                      </div>
                    }>
                      <RecruiterDashboard />
                    </Suspense>
                  </RequireRole>
                </RequireAuth>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <RequireAuth>
                  <RequireRole role="admin">
                    <Suspense fallback={
                      <div className="flex min-h-dvh items-center justify-center bg-dark-background">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                      </div>
                    }>
                      <AdminDashboard />
                    </Suspense>
                  </RequireRole>
                </RequireAuth>
              }
            />

            <Route path="*" element={<Navigate to="/role-chooser" replace />} />
          </Routes>
          </ErrorBoundary>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
