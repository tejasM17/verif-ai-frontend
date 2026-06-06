import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthLayout } from './components/auth';

const StudentLogin = lazy(() => import('./pages/StudentLogin'));
const StudentSignup = lazy(() => import('./pages/StudentSignup'));
const RecruiterLogin = lazy(() => import('./pages/RecruiterLogin'));
const RecruiterSignup = lazy(() => import('./pages/RecruiterSignup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const SessionExpired = lazy(() => import('./pages/SessionExpired'));

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
          <Routes>
            <Route path="/" element={<Navigate to="/auth/student/login" replace />} />

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

            <Route path="*" element={<Navigate to="/auth/student/login" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}