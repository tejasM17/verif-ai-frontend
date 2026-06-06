import { motion } from 'framer-motion';
import { Target, Code2, ShieldCheck, Clock } from 'lucide-react';

const statConfigs = [
  {
    key: 'completion',
    icon: Target,
    label: 'Profile Completion',
    color: 'text-primary-400',
    bg: 'bg-primary-500/10',
  },
  {
    key: 'skills',
    icon: Code2,
    label: 'Skills',
    color: 'text-secondary-400',
    bg: 'bg-secondary-500/10',
  },
  {
    key: 'status',
    icon: ShieldCheck,
    label: 'Account Status',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    key: 'updated',
    icon: Clock,
    label: 'Last Updated',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
];

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function StatsCards({ profile, completion }) {
  const stats = [
    { value: `${completion}%`, key: 'completion' },
    { value: Array.isArray(profile?.skills) ? profile.skills.length : 0, key: 'skills' },
    {
      value: profile?.account_status || 'Active',
      key: 'status',
    },
    {
      value: profile?.updated_at ? formatDate(profile.updated_at) : 'N/A',
      key: 'updated',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const config = statConfigs[i];
        const Icon = config.icon;
        return (
          <motion.div
            key={config.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="group relative rounded-xl border border-dark-border bg-dark-surface p-5 transition-all duration-300 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/5"
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-lg ${config.bg} p-2.5`}>
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-semibold text-dark-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-dark-muted">{config.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
