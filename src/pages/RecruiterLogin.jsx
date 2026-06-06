import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Mail, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuth } from '../context/AuthContext';
import { recruiterLoginSchema } from '../lib/validators';
import {
  AuthCard, AuthHeader, AuthInput, PasswordInput, Divider,
  FormError, LoadingButton, AuthFooter, RetryBanner,
} from '../components/auth';

export default function RecruiterLogin() {
  const { login, isAuthenticated, role, isLoading: authLoading, isRetrying, retryMessage } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recruiterLoginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  useEffect(() => {
    if (!authLoading && isAuthenticated && role === 'recruiter') {
      navigate('/recruiter/dashboard', { replace: true });
    }
  }, [authLoading, isAuthenticated, role, navigate]);

  if (authLoading) {
    return null;
  }

  if (isAuthenticated && role === 'recruiter') {
    return <Navigate to="/recruiter/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await login(data.email, data.password);
      const targetRole = result.role;
      if (targetRole === 'recruiter') {
        navigate('/recruiter/dashboard', { replace: true });
      } else if (targetRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/recruiter/dashboard', { replace: true });
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
          icon={Building2}
          title="Recruiter sign in"
          subtitle="Access your recruitment dashboard"
        />

        <FormError message={error} />
        <RetryBanner message={isRetrying ? retryMessage : null} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <AuthInput
            label="Work Email"
            type="email"
            placeholder="you@company.com"
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
          text="Don't have a recruiter account?"
          linkText="Register your company"
          linkTo="/auth/recruiter/signup"
        />

        <div className="mt-3 text-center">
          <Link
            to="/auth/student/login"
            className="text-xs text-muted hover:text-foreground dark:text-dark-muted dark:hover:text-dark-foreground transition-colors"
          >
            Looking for a job? Sign in as a student
          </Link>
        </div>
      </AuthCard>
    </motion.div>
  );
}
