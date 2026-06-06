import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Mail,
  User,
  Phone,
  GraduationCap,
  BookOpen,
  Calendar,
  Code2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, sendEmailVerification } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { studentSignupSchema } from '../lib/validators';
import {
  AuthCard,
  AuthHeader,
  AuthInput,
  PasswordInput,
  FormError,
  LoadingButton,
  AuthFooter,
} from '../components/auth';

export default function StudentSignup() {
  const { register: registerUser, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSignupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      collegeName: '',
      branch: '',
      graduationYear: '',
      skills: '',
      agreeToTerms: false,
    },
  });

  if (isAuthenticated && role === 'student') {
    return <Navigate to="/student/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      const firebaseAction = createUserWithEmailAndPassword(
        (await import('../lib/firebase')).auth,
        data.email,
        data.password
      ).then(async (cred) => {
        await sendEmailVerification(cred.user);
        return cred;
      });

      await registerUser(firebaseAction, {
        full_name: data.fullName,
        phone: data.phone,
        college_name: data.collegeName,
        branch: data.branch,
        graduation_year: parseInt(data.graduationYear, 10),
        skills: data.skills,
      }, 'student');

      navigate('/verify-email', { replace: true });
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please sign in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
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
          icon={GraduationCap}
          title="Create student account"
          subtitle="Join thousands of students landing their dream roles"
        />

        <FormError message={error} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AuthInput
              label="Full Name"
              placeholder="John Doe"
              icon={User}
              error={errors.fullName?.message}
              {...register('fullName')}
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
            label="Email"
            type="email"
            placeholder="you@college.edu"
            icon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AuthInput
              label="College Name"
              placeholder="Massachusetts Institute of Technology"
              icon={GraduationCap}
              error={errors.collegeName?.message}
              {...register('collegeName')}
            />
            <AuthInput
              label="Branch"
              placeholder="Computer Science"
              icon={BookOpen}
              error={errors.branch?.message}
              {...register('branch')}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AuthInput
              label="Graduation Year"
              type="text"
              placeholder="2025"
              icon={Calendar}
              error={errors.graduationYear?.message}
              {...register('graduationYear')}
            />
            <AuthInput
              label="Skills"
              placeholder="Python, JavaScript, AI"
              icon={Code2}
              error={errors.skills?.message}
              {...register('skills')}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <PasswordInput
              label="Password"
              placeholder="Create a strong password"
              error={errors.password?.message}
              {...register('password')}
            />
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
            Create account
          </LoadingButton>
        </form>

        <AuthFooter
          text="Already have an account?"
          linkText="Sign in"
          linkTo="/auth/student/login"
        />
      </AuthCard>
    </motion.div>
  );
}