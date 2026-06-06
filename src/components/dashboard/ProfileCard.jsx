import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Calendar,
  Globe,
  Briefcase,
  BadgeCheck,
} from 'lucide-react';

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfileCard({ profile }) {
  if (!profile) return null;

  const safe = (val, fallback = 'Not Available') =>
    val !== null && val !== undefined && val !== '' ? val : fallback;

  const fields = [
    {
      icon: Mail,
      label: 'Email',
      value: safe(profile?.email),
      href: profile?.email ? `mailto:${profile.email}` : null,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: safe(profile?.phone, 'Not provided'),
      href: profile?.phone ? `tel:${profile.phone}` : null,
    },
    { icon: GraduationCap, label: 'College', value: safe(profile?.college_name) },
    { icon: BookOpen, label: 'Branch', value: safe(profile?.branch) },
    {
      icon: Calendar,
      label: 'Graduation Year',
      value: safe(profile?.graduation_year, 'N/A'),
    },
    {
      icon: Globe,
      label: 'Resume',
      value: profile?.resume_url ? 'View Resume' : 'Not uploaded',
      href: profile?.resume_url || null,
    },
    { icon: Briefcase, label: 'Role', value: profile?.role || 'Student' },
    {
      icon: BadgeCheck,
      label: 'Status',
      value: profile?.account_status || 'Active',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border border-dark-border bg-dark-surface overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-primary-500/20 flex-shrink-0">
            {getInitials(profile.full_name)}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-dark-foreground truncate">
              {profile.full_name}
            </h2>
            <p className="text-sm text-dark-muted">Student Profile</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {fields.map((field) => (
            <div key={field.label} className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-dark-surface-muted p-2 flex-shrink-0">
                <field.icon className="h-4 w-4 text-primary-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-dark-muted uppercase tracking-wider">
                  {field.label}
                </p>
                {field.href ? (
                  <a
                    href={field.href}
                    target={field.href.startsWith('http') ? '_blank' : undefined}
                    rel={
                      field.href.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="text-sm text-primary-400 hover:text-primary-300 transition-colors truncate block"
                  >
                    {field.value}
                  </a>
                ) : (
                  <p className="text-sm text-dark-foreground truncate">
                    {field.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-dark-border">
          <p className="text-xs text-dark-muted uppercase tracking-wider mb-3">
            Skills
          </p>
          {Array.isArray(profile.skills) && profile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-dark-muted italic">No skills added</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
