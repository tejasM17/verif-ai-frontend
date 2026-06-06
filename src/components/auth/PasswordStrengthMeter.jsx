import { useMemo } from 'react';
import { motion } from 'framer-motion';

const requirements = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'Uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'Lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { label: 'Number', test: (pw) => /[0-9]/.test(pw) },
  { label: 'Special character', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

function getStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 5);
}

const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

export default function PasswordStrengthMeter({ password = '' }) {
  const strength = useMemo(() => getStrength(password), [password]);
  const checks = useMemo(
    () => requirements.map((r) => ({ ...r, passed: r.test(password) })),
    [password],
  );

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: i < strength ? 1 : 0,
              opacity: i < strength ? 1 : 0.15,
            }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            className={`h-1.5 flex-1 rounded-full ${
              i < strength ? colors[strength] : 'bg-border dark:bg-dark-border'
            }`}
          />
        ))}
      </div>
      <p
        className={`text-xs font-medium ${
          strength >= 4
            ? 'text-green-600 dark:text-green-400'
            : strength >= 2
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-red-600 dark:text-red-400'
        }`}
        aria-live="polite"
      >
        {labels[strength]} password
      </p>
      <ul className="space-y-0.5" aria-label="Password requirements">
        {checks.map((req) => (
          <li
            key={req.label}
            className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${
              req.passed
                ? 'text-green-600 dark:text-green-400'
                : 'text-muted dark:text-dark-muted'
            }`}
          >
            <svg
              className={`h-3 w-3 ${req.passed ? 'text-green-500' : 'text-muted dark:text-dark-muted'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              {req.passed ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              )}
            </svg>
            {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
