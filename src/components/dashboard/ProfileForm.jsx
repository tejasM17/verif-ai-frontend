import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Save, RotateCcw, AlertCircle } from 'lucide-react';
import { FormSkeleton } from './Skeletons';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z
    .string()
    .max(15, 'Phone number is too long')
    .regex(/^\+?[\d\s-]{0,15}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  college_name: z.string().min(2, 'College name is required'),
  branch: z.string().min(2, 'Branch is required'),
  graduation_year: z
    .string()
    .regex(/^\d{4}$/, 'Please enter a valid year')
    .refine(
      (val) => {
        const year = parseInt(val, 10);
        const currentYear = new Date().getFullYear();
        return year >= currentYear - 1 && year <= currentYear + 6;
      },
      { message: 'Please enter a valid graduation year' }
    )
    .optional()
    .or(z.literal('')),
  skills: z.string().optional().or(z.literal('')),
  resume_url: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
});

export default function ProfileForm({ profile, onSave, saving, error }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      college_name: '',
      branch: '',
      graduation_year: '',
      skills: '',
      resume_url: '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        college_name: profile.college_name || '',
        branch: profile.branch || '',
        graduation_year: profile.graduation_year?.toString() || '',
        skills: Array.isArray(profile.skills)
          ? profile.skills.join(', ')
          : profile.skills || '',
        resume_url: profile.resume_url || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data) => {
    const modifiedFields = {};
    for (const key of Object.keys(dirtyFields)) {
      if (key === 'skills') {
        modifiedFields[key] = data[key]
          ? data[key].split(',').map((s) => s.trim()).filter(Boolean)
          : [];
      } else {
        modifiedFields[key] = data[key];
      }
    }
    if (Object.keys(modifiedFields).length === 0) return;
    await onSave(modifiedFields);
  };

  const handleReset = () => {
    if (profile) {
      reset({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        college_name: profile.college_name || '',
        branch: profile.branch || '',
        graduation_year: profile.graduation_year?.toString() || '',
        skills: Array.isArray(profile.skills)
          ? profile.skills.join(', ')
          : profile.skills || '',
        resume_url: profile.resume_url || '',
      });
    }
  };

  if (!profile) {
    return <FormSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-dark-border bg-dark-surface overflow-hidden"
    >
      <div className="p-6 border-b border-dark-border">
        <h2 className="text-lg font-semibold text-dark-foreground">
          Edit Profile
        </h2>
        <p className="text-sm text-dark-muted mt-1">
          Update your personal information
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5" noValidate>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-sm text-error"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FieldGroup label="Full Name" error={errors.full_name?.message}>
            <input
              {...register('full_name')}
              className={`input-base dark:bg-dark-surface-muted dark:border-dark-border dark:text-dark-foreground dark:placeholder:text-dark-muted ${
                errors.full_name ? 'input-error' : ''
              }`}
              placeholder="John Doe"
            />
          </FieldGroup>

          <FieldGroup label="Phone" error={errors.phone?.message}>
            <input
              {...register('phone')}
              className={`input-base dark:bg-dark-surface-muted dark:border-dark-border dark:text-dark-foreground dark:placeholder:text-dark-muted ${
                errors.phone ? 'input-error' : ''
              }`}
              placeholder="+1 234 567 8900"
            />
          </FieldGroup>

          <FieldGroup label="College Name" error={errors.college_name?.message}>
            <input
              {...register('college_name')}
              className={`input-base dark:bg-dark-surface-muted dark:border-dark-border dark:text-dark-foreground dark:placeholder:text-dark-muted ${
                errors.college_name ? 'input-error' : ''
              }`}
              placeholder="University of Technology"
            />
          </FieldGroup>

          <FieldGroup label="Branch" error={errors.branch?.message}>
            <input
              {...register('branch')}
              className={`input-base dark:bg-dark-surface-muted dark:border-dark-border dark:text-dark-foreground dark:placeholder:text-dark-muted ${
                errors.branch ? 'input-error' : ''
              }`}
              placeholder="Computer Science"
            />
          </FieldGroup>

          <FieldGroup
            label="Graduation Year"
            error={errors.graduation_year?.message}
          >
            <input
              {...register('graduation_year')}
              className={`input-base dark:bg-dark-surface-muted dark:border-dark-border dark:text-dark-foreground dark:placeholder:text-dark-muted ${
                errors.graduation_year ? 'input-error' : ''
              }`}
              placeholder="2026"
              maxLength={4}
            />
          </FieldGroup>

          <FieldGroup label="Resume URL" error={errors.resume_url?.message}>
            <input
              {...register('resume_url')}
              className={`input-base dark:bg-dark-surface-muted dark:border-dark-border dark:text-dark-foreground dark:placeholder:text-dark-muted ${
                errors.resume_url ? 'input-error' : ''
              }`}
              placeholder="https://example.com/resume.pdf"
            />
          </FieldGroup>

          <FieldGroup label="Skills (comma separated)" error={errors.skills?.message}>
            <textarea
              {...register('skills')}
              className={`input-base dark:bg-dark-surface-muted dark:border-dark-border dark:text-dark-foreground dark:placeholder:text-dark-muted min-h-[80px] resize-y ${
                errors.skills ? 'input-error' : ''
              }`}
              placeholder="React, Python, Machine Learning"
            />
          </FieldGroup>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={!isDirty || saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.97]"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty || saving}
            className="inline-flex items-center gap-2 rounded-lg border border-dark-border px-5 py-2.5 text-sm font-medium text-dark-foreground hover:bg-dark-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.97]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function FieldGroup({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-dark-foreground">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-error mt-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}
