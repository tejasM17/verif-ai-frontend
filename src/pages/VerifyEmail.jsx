import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MailCheck, RefreshCw, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { auth, sendEmailVerification, signOut } from '../lib/firebase';
import { AuthCard, LoadingButton } from '../components/auth';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const checkingRef = useRef(false);
  const userEmail = auth.currentUser?.email || '';

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/auth/student/signup', { replace: true });
      return;
    }

    const checkInterval = setInterval(async () => {
      if (checkingRef.current) return;
      checkingRef.current = true;
      try {
        if (auth.currentUser) {
          await auth.currentUser.reload();
          if (auth.currentUser.emailVerified) {
            clearInterval(checkInterval);
            navigate('/auth/student/login', { replace: true });
          }
        }
      } finally {
        checkingRef.current = false;
      }
    }, 3000);

    return () => clearInterval(checkInterval);
  }, [navigate]);

  const handleResendEmail = async () => {
    setIsResending(true);
    setMessage('');
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setMessage('Verification email sent!');
      }
    } catch (err) {
      setMessage(err.message || 'Failed to resend. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsChecking(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          navigate('/auth/student/login', { replace: true });
        } else {
          setMessage('Email not yet verified. Please check your inbox.');
        }
      }
    } catch {
      setMessage('Failed to check verification status.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/auth/student/login', { replace: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AuthCard>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/20">
            <MailCheck className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground dark:text-dark-foreground">
            Verify your email
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted dark:text-dark-muted">
            We've sent a verification email to{' '}
            <span className="font-medium text-foreground dark:text-dark-foreground">
              {userEmail}
            </span>
            . Please check your inbox and click the verification link.
          </p>
        </motion.div>

        {message && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-xs text-muted dark:text-dark-muted"
          >
            {message}
          </motion.p>
        )}

        <div className="mt-8 space-y-3">
          <LoadingButton
            isLoading={isChecking}
            loadingText="Checking..."
            onClick={handleCheckVerification}
          >
            I've verified my email
          </LoadingButton>

          <button
            type="button"
            onClick={handleResendEmail}
            disabled={isResending}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-surface-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-border dark:bg-dark-surface dark:text-dark-foreground dark:hover:bg-dark-surface-hover"
          >
            <RefreshCw className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
            {isResending ? 'Sending...' : 'Resend verification email'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground dark:text-dark-muted dark:hover:text-dark-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </button>
        </div>
      </AuthCard>
    </motion.div>
  );
}