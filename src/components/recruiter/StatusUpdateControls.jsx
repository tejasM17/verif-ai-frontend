import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Search,
  CheckCircle,
  XCircle,
  RefreshCw,
  Save,
  RotateCcw,
} from 'lucide-react';

const statusOptions = [
  { value: 'submitted', label: 'Submitted', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { value: 'reviewing', label: 'Reviewing', icon: Search, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  { value: 'selected', label: 'Selected', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-error', bg: 'bg-error/10', border: 'border-error/30' },
  { value: 'request_changes', label: 'Changes Requested', icon: RefreshCw, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
];

export default function StatusUpdateControls({
  currentStatus,
  onSave,
  saving,
  savedStatus,
}) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [error, setError] = useState(null);
  const hasChanged = selectedStatus !== (savedStatus || currentStatus);

  const handleSave = async () => {
    setError(null);
    try {
      await onSave(selectedStatus);
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  const currentConfig = statusOptions.find((s) => s.value === currentStatus);
  const CurrentIcon = currentConfig?.icon || Clock;

  return (
    <div className="rounded-xl border border-dark-border bg-dark-surface p-5">
      <h3 className="text-sm font-semibold text-dark-foreground mb-4">Application Status</h3>

      <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-dark-surface-muted border border-dark-border">
        <CurrentIcon className="h-5 w-5 text-primary-400" />
        <div>
          <p className="text-sm font-medium text-dark-foreground">Current Status</p>
          <p className="text-xs text-dark-muted capitalize">{currentStatus?.replace(/_/g, ' ') || 'Unknown'}</p>
        </div>
      </div>

      <div className="space-y-1.5 mb-4">
        {statusOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedStatus === option.value;
          const isCurrent = currentStatus === option.value;

          return (
            <button
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              disabled={saving}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? `${option.bg} ${option.color} ${option.border} border`
                  : 'text-dark-muted hover:bg-dark-surface-hover hover:text-dark-foreground border border-transparent'
              } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                isSelected ? option.bg : 'bg-dark-surface-muted'
              }`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className="flex-1 text-left">{option.label}</span>
              {isCurrent && (
                <span className="text-[10px] text-dark-muted bg-dark-surface-muted px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-error mb-3"
        >
          {error}
        </motion.p>
      )}

      <button
        onClick={handleSave}
        disabled={!hasChanged || saving}
        className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ${
          hasChanged && !saving
            ? 'bg-primary-600 text-white hover:bg-primary-500 active:scale-[0.98]'
            : 'bg-dark-surface-muted text-dark-muted cursor-not-allowed'
        }`}
      >
        {saving ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save Changes
          </>
        )}
      </button>

      {!hasChanged && savedStatus && (
        <p className="text-[10px] text-dark-muted text-center mt-2">Current status is up to date</p>
      )}
    </div>
  );
}
