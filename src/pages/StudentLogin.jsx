import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Mail, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuth } from '../context/AuthContext';
import { studentLoginSchema } from '../lib/validators';
import { AuthCard, AuthHeader, AuthInput, PasswordInput, Divider, FormError, AuthFooter, LoadingButton } from '../components/auth';

export default function StudentLogin() {
  const { login, isAuthenticated, role, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentLoginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  if (authLoading) {
    return null;
  }

  if (isAuthenticated && role === 'student') {
    return <Navigate to="/student/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      await login(data.email, data.password, 'student');
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError('Google sign-in coming soon');
  };

  const handleLinkedinLogin = () => {
    setError('LinkedIn sign-in coming soon');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AuthCard>
        <AuthHeader
          icon={GraduationCap}
          title="Welcome back"
          subtitle="Sign in to your student account to continue"
        />

        <FormError message={error} />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <AuthInput
            label="Email"
            type="email"
            placeholder="you@college.edu"
            icon={Mail}
            error={errors.email?.message}
            autoComplete="email"
            {...register('email')}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                error={errors.password?.message}
                autoComplete="current-password"
                {...register('password')}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
                  {...register('rememberMe')}
                />
                <span className="text-xs text-muted dark:text-dark-muted">Remember me</span>
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-xs font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <LoadingButton isLoading={isLoading} loadingText="Signing in...">
            Sign in
          </LoadingButton>
        </form>

        <Divider />

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-surface-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-border dark:bg-dark-surface dark:text-dark-foreground dark:hover:bg-dark-surface-hover"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
          <button
            type="button"
            onClick={handleLinkedinLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-surface-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-border dark:bg-dark-surface dark:text-dark-foreground dark:hover:bg-dark-surface-hover"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Continue with LinkedIn
          </button>
        </div>

        <AuthFooter
          text="Don't have a student account?"
          linkText="Create one"
          linkTo="/auth/student/signup"
        />
      </AuthCard>
    </motion.div>
  );
}