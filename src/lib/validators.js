import { z } from 'zod';

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

const phoneSchema = z
  .string()
  .min(10, 'Please enter a valid phone number')
  .max(15, 'Phone number is too long')
  .regex(/^\+?[\d\s-]+$/, 'Please enter a valid phone number');

const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name is too long');

export const studentLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const studentSignupSchema = z
  .object({
    fullName: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    collegeName: z.string().min(2, 'College name is required'),
    branch: z.string().min(2, 'Branch is required'),
    graduationYear: z
      .string()
      .regex(/^\d{4}$/, 'Please enter a valid year')
      .refine(
        (val) => {
          const year = parseInt(val, 10);
          const currentYear = new Date().getFullYear();
          return year >= currentYear - 1 && year <= currentYear + 6;
        },
        { message: 'Please enter a valid graduation year' }
      ),
    skills: z.string().min(1, 'Please enter at least one skill'),
    agreeToTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the terms' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const recruiterLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const recruiterSignupSchema = z
  .object({
    recruiterName: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    companyName: z.string().min(2, 'Company name is required'),
    companyWebsite: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    designation: z.string().min(2, 'Designation is required'),
    agreeToTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the terms' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

