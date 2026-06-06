import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Mail, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuth } from '../context/AuthContext';
import { studentLoginSchema } from '../lib/validators';
import {
  AuthCard, AuthHeader, AuthInput, PasswordInput, Divider,
  FormError, AuthFooter, LoadingButton, RetryBanner,
} from '../components/auth';

export default function StudentLogin() {
  const { login, isAuthenticated, role, isLoading: authLoading, isRetrying, retryMessage } = useAuth();
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

  useEffect(() => {
    if (!authLoading && isAuthenticated && role === 'student') {
      navigate('/student/dashboard', { replace: true });
    }
  }, [authLoading, isAuthenticated, role, navigate]);

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
      const result = await login(data.email, data.password);
      const targetRole = result.role;
      if (targetRole === 'student') {
        navigate('/student/dashboard', { replace: true });
      } else if (targetRole === 'recruiter') {
        navigate('/recruiter/dashboard', { replace: true });
      } else if (targetRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError(err.message || 'Invalid email or password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
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
        <RetryBanner message={isRetrying ? retryMessage : null} />

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
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              error={errors.password?.message}
              autoComplete="current-password"
              {...register('password')}
            />
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

        <AuthFooter
          text="Don't have a student account?"
          linkText="Create one"
          linkTo="/auth/student/signup"
        />
      </AuthCard>
    </motion.div>
  );
}
