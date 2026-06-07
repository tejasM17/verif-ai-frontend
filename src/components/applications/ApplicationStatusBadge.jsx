import { motion } from 'framer-motion';
import {
  Clock, Search, CheckCircle, XCircle, RefreshCw,
} from 'lucide-react';

const statusConfig = {
  submitted: {
    label: 'Submitted',
    icon: Clock,
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    dot: 'bg-blue-400',
  },
  reviewing: {
    label: 'Reviewing',
    icon: Search,
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    border: 'border-yellow-500/20',
    dot: 'bg-yellow-400',
  },
  selected: {
    label: 'Selected',
    icon: CheckCircle,
    bg: 'bg-secondary-500/10',
    text: 'text-secondary-400',
    border: 'border-secondary-500/20',
    dot: 'bg-secondary-400',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    bg: 'bg-error/10',
    text: 'text-error',
    border: 'border-error/20',
    dot: 'bg-error',
  },
  request_changes: {
    label: 'Changes Requested',
    icon: RefreshCw,
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning/20',
    dot: 'bg-warning',
  },
};

export default function ApplicationStatusBadge({ status, size = 'md' }) {
  const config = statusConfig[status] || statusConfig.submitted;
  const Icon = config.icon;

  const sizeStyles = size === 'sm'
    ? 'px-2 py-0.5 text-[10px] gap-1'
    : 'px-3 py-1 text-xs gap-1.5';

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center rounded-full border font-medium ${config.bg} ${config.text} ${config.border} ${sizeStyles}`}
    >
      <Icon className={size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3'} />
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </motion.span>
  );
}
