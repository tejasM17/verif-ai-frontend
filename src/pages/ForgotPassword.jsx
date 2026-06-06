import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

import { forgotPasswordSchema } from '../lib/validators';
import { sendPasswordResetEmail } from '../lib/firebase';
import { AuthCard, AuthHeader, AuthInput, FormError, FormSuccess, LoadingButton, AuthFooter } from '../components/auth';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await sendPasswordResetEmail((await import('../lib/firebase')).auth, data.email);
      setSuccess(
        `Password reset email sent to ${data.email}. Please check your inbox and follow the instructions.`
      );
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please wait a few minutes before trying again.');
      } else {
        setError(err.message || 'Failed to send reset email. Please try again.');
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
        <div className="mb-4">
          <Link
            to="/auth/student/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground dark:text-dark-muted dark:hover:text-dark-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>

        <AuthHeader
          icon={ShieldCheck}
          title="Forgot password?"
          subtitle="Enter your email and we'll send you a reset link"
        />

        <FormError message={error} />
        <FormSuccess message={success} />

        {!success && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <AuthInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              error={errors.email?.message}
              autoComplete="email"
              {...register('email')}
            />

            <LoadingButton isLoading={isLoading} loadingText="Sending email...">
              Send reset link
            </LoadingButton>
          </form>
        )}

        {success && (
          <div className="text-center">
            <p className="text-xs text-muted dark:text-dark-muted">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                type="button"
                onClick={() => {
                  setSuccess('');
                  setError('');
                }}
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors"
              >
                try again
              </button>
            </p>
          </div>
        )}

        <AuthFooter
          text="Remember your password?"
          linkText="Sign in"
          linkTo="/auth/student/login"
        />
      </AuthCard>
    </motion.div>
  );
}