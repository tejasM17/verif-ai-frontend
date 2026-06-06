import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Mail, User, Phone, Building2, Globe, Briefcase,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { recruiterSignupSchema } from '../lib/validators';
import {
  AuthCard, AuthHeader, AuthInput, PasswordInput,
  FormError, LoadingButton, AuthFooter, RetryBanner, PasswordStrengthMeter,
} from '../components/auth';

export default function RecruiterSignup() {
  const { register: registerUser, isAuthenticated, role, isRetrying, retryMessage } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recruiterSignupSchema),
    defaultValues: {
      recruiterName: '', email: '', phone: '', password: '',
      confirmPassword: '', companyName: '', companyWebsite: '',
      designation: '', agreeToTerms: false,
    },
  });

  const watchedPassword = useWatch({ control, name: 'password' });

  useEffect(() => {
    if (!isLoading && isAuthenticated && role === 'recruiter') {
      navigate('/recruiter/dashboard', { replace: true });
    }
  }, [isAuthenticated, role, isLoading, navigate]);

  if (isAuthenticated && role === 'recruiter') {
    return <Navigate to="/recruiter/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      await registerUser(data.email, data.password, {
        company_name: data.companyName,
        recruiter_name: data.recruiterName,
        phone: data.phone,
        company_website: data.companyWebsite || null,
        company_logo: null,
        designation: data.designation,
      }, 'recruiter');

      navigate('/verify-email', { replace: true });
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
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
          title="Register your company"
          subtitle="Start hiring top verified talent today"
        />

        <FormError message={error} />
        <RetryBanner message={isRetrying ? retryMessage : null} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AuthInput
              label="Your Name"
              placeholder="Jane Smith"
              icon={User}
              error={errors.recruiterName?.message}
              {...register('recruiterName')}
            />
            <AuthInput
              label="Phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              icon={Phone}
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>

          <AuthInput
            label="Work Email"
            type="email"
            placeholder="you@company.com"
            icon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AuthInput
              label="Company Name"
              placeholder="Google"
              icon={Building2}
              error={errors.companyName?.message}
              {...register('companyName')}
            />
            <AuthInput
              label="Designation"
              placeholder="Technical Recruiter"
              icon={Briefcase}
              error={errors.designation?.message}
              {...register('designation')}
            />
          </div>

          <AuthInput
            label="Company Website (optional)"
            type="url"
            placeholder="https://google.com"
            icon={Globe}
            error={errors.companyWebsite?.message}
            {...register('companyWebsite')}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <PasswordInput
                label="Password"
                placeholder="Create a strong password"
                error={errors.password?.message}
                {...register('password')}
              />
              <PasswordStrengthMeter password={watchedPassword || ''} />
            </div>
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
              {...register('agreeToTerms')}
            />
            <span className="text-xs leading-relaxed text-muted dark:text-dark-muted">
              I agree to the{' '}
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="text-xs text-error" role="alert">{errors.agreeToTerms.message}</p>
          )}

          <LoadingButton isLoading={isLoading} loadingText="Creating account...">
            Create company account
          </LoadingButton>
        </form>

        <AuthFooter
          text="Already have a recruiter account?"
          linkText="Sign in"
          linkTo="/auth/recruiter/login"
        />
      </AuthCard>
    </motion.div>
  );
}
