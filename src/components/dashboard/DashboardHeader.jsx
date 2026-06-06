import { Menu } from 'lucide-react';

export default function DashboardHeader({
  title,
  subtitle,
  onMobileMenuOpen,
  actions,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-dark-surface-hover transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-dark-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-dark-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-dark-muted mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 ml-9 sm:ml-0">{actions}</div>}
    </div>
  );
}
