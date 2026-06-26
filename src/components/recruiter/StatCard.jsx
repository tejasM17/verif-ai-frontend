const TONE_CLASSES = {
  default: {
    iconWrap: "bg-white/5 text-gray-300",
    accent: "text-white",
  },
  gold: {
    iconWrap: "bg-yellow-500/15 text-yellow-400",
    accent: "text-yellow-400",
  },
  blue: {
    iconWrap: "bg-blue-500/15 text-blue-400",
    accent: "text-blue-400",
  },
  amber: {
    iconWrap: "bg-amber-500/15 text-amber-400",
    accent: "text-amber-400",
  },
  green: {
    iconWrap: "bg-emerald-500/15 text-emerald-400",
    accent: "text-emerald-400",
  },
  red: {
    iconWrap: "bg-red-500/15 text-red-400",
    accent: "text-red-400",
  },
};

export default function StatCard({ label, value, hint, icon, tone = "default", loading }) {
  const toneClass = TONE_CLASSES[tone] || TONE_CLASSES.default;

  return (
    <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-4)] p-5 transition-all hover:border-[var(--border-medium)]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium">
            {label}
          </p>
          {loading ? (
            <div className="h-8 w-16 mt-2 rounded-md bg-white/5 animate-pulse" />
          ) : (
            <p className={`text-3xl font-semibold mt-1.5 ${toneClass.accent}`}>
              {value}
            </p>
          )}
          {hint && (
            <p className="text-[12px] text-[var(--text-muted)] mt-1.5 truncate">
              {hint}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${toneClass.iconWrap}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
