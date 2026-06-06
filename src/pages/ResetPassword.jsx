import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import { resetPasswordSchema } from '../lib/validators';
import { confirmPasswordReset, verifyPasswordResetCode } from '../lib/firebase';
import { AuthCard, AuthHeader, PasswordInput, FormError, FormSuccess, LoadingButton } from '../components/auth';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get('oobCode');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isValidCode, setIsValidCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    async function verifyCode() {
      if (!oobCode) {
        setError('Invalid or missing reset code. Please request a new password reset link.');
        setIsVerifying(false);
        return;
      }
      try {
        const { auth } = await import('../lib/firebase');
        await verifyPasswordResetCode(auth, oobCode);
        setIsValidCode(true);
      } catch {
        setError('This reset link is invalid or has expired. Please request a new one.');
      } finally {
        setIsVerifying(false);
      }
    }
    verifyCode();
  }, [oobCode]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    if (!oobCode) return;
    setIsLoading(true);
    setError('');
    try {
      const { auth } = await import('../lib/firebase');
      await confirmPasswordReset(auth, oobCode, data.password);
      setSuccess('Password reset successful!');
      setTimeout(() => {
        navigate('/auth/student/login', { replace: true });
      }, 2000);
    } catch (err) {
      if (err.code === 'auth/weak-password') {
        setError('Password is too weak.');
      } else {
        setError(err.message || 'Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <AuthCard>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            <p className="mt-4 text-sm text-muted dark:text-dark-muted">Verifying your reset link...</p>
          </div>
        </AuthCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AuthCard>
        <AuthHeader
          icon={ShieldCheck}
          title="Reset your password"
          subtitle={isValidCode ? 'Enter your new password below' : ''}
        />

        {!isValidCode && error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-error-border bg-error-light p-3 text-sm text-error">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p>{error}</p>
              <Link
                to="/auth/forgot-password"
                className="mt-1 inline-block font-medium underline hover:no-underline"
              >
                Request new reset link
              </Link>
            </div>
          </div>
        )}

        <FormError message={error} />
        <FormSuccess message={success} />

        {isValidCode && !success && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              error={errors.password?.message}
              {...register('password')}
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm new password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <LoadingButton isLoading={isLoading} loadingText="Resetting password...">
              Reset password
            </LoadingButton>
          </form>
        )}

        {success && (
          <div className="text-center">
            <p className="text-xs text-muted dark:text-dark-muted">
              Redirecting you to sign in...
            </p>
          </div>
        )}
      </AuthCard>
    </motion.div>
  );
}