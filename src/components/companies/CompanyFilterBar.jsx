import { useState, useEffect, useRef } from 'react';
import { Search, X, SlidersHorizontal, Briefcase, GraduationCap } from 'lucide-react';

const HIRING_STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'hiring', label: 'Hiring' },
  { value: 'paused', label: 'Paused' },
  { value: 'closed', label: 'Not Hiring' },
];

const INTERNSHIP_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'true', label: 'Has Internships' },
  { value: 'false', label: 'No Internships' },
];

export default function CompanyFilterBar({ filters, onFilterChange, onClear, resultCount }) {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  const handleSearchChange = (value) => {
    setSearchInput(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onFilterChange({ search: value || '' });
    }, 300);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    onFilterChange({ search: '' });
  };

  const hasActiveFilters = filters.tech_stack || filters.skills || filters.hiring_status || filters.has_internships;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-muted pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search companies..."
            className="w-full rounded-lg border border-dark-border bg-dark-surface pl-9 pr-8 py-2.5 text-sm text-dark-foreground placeholder:text-dark-muted transition-colors duration-200 focus:border-primary-500/50 focus:outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-dark-muted hover:text-dark-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
            showFilters || hasActiveFilters
              ? 'border-primary-500/30 bg-primary-500/10 text-primary-400'
              : 'border-dark-border text-dark-muted hover:bg-dark-surface-hover hover:text-dark-foreground'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
              {(filters.tech_stack ? 1 : 0) + (filters.skills ? 1 : 0) + (filters.hiring_status ? 1 : 0) + (filters.has_internships ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="rounded-xl border border-dark-border bg-dark-surface p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-muted mb-1.5">Technology</label>
              <input
                type="text"
                value={filters.tech_stack || ''}
                onChange={(e) => onFilterChange({ tech_stack: e.target.value })}
                placeholder="e.g. Python, React"
                className="w-full rounded-lg border border-dark-border bg-dark-surface-muted px-3 py-2 text-sm text-dark-foreground placeholder:text-dark-muted transition-colors duration-200 focus:border-primary-500/50 focus:outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-muted mb-1.5">Skills</label>
              <input
                type="text"
                value={filters.skills || ''}
                onChange={(e) => onFilterChange({ skills: e.target.value })}
                placeholder="e.g. Python, SQL"
                className="w-full rounded-lg border border-dark-border bg-dark-surface-muted px-3 py-2 text-sm text-dark-foreground placeholder:text-dark-muted transition-colors duration-200 focus:border-primary-500/50 focus:outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-muted mb-1.5">
                <Briefcase className="h-3 w-3 inline mr-1" />
                Hiring Status
              </label>
              <select
                value={filters.hiring_status || ''}
                onChange={(e) => onFilterChange({ hiring_status: e.target.value })}
                className="w-full rounded-lg border border-dark-border bg-dark-surface-muted px-3 py-2 text-sm text-dark-foreground transition-colors duration-200 focus:border-primary-500/50 focus:outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
              >
                {HIRING_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-muted mb-1.5">
                <GraduationCap className="h-3 w-3 inline mr-1" />
                Internships
              </label>
              <select
                value={filters.has_internships || ''}
                onChange={(e) => onFilterChange({ has_internships: e.target.value })}
                className="w-full rounded-lg border border-dark-border bg-dark-surface-muted px-3 py-2 text-sm text-dark-foreground transition-colors duration-200 focus:border-primary-500/50 focus:outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
              >
                {INTERNSHIP_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-muted">
              {resultCount !== null ? `${resultCount} companies found` : ''}
            </span>
            {hasActiveFilters && (
              <button
                onClick={onClear}
                className="inline-flex items-center gap-1.5 rounded-lg bg-dark-surface-hover hover:bg-error/10 px-3 py-1.5 text-xs font-medium text-dark-muted hover:text-error transition-colors"
              >
                <X className="h-3 w-3" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
