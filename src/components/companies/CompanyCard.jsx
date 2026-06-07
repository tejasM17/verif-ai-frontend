import { motion } from 'framer-motion';
import { MapPin, Briefcase, GraduationCap, ChevronRight } from 'lucide-react';

const statusStyles = {
  hiring: 'bg-secondary-500/10 text-secondary-400 border-secondary-500/20',
  paused: 'bg-warning/10 text-warning border-warning/20',
  closed: 'bg-error/10 text-error border-error/20',
};

export default function CompanyCard({ company, index, onClick }) {
  const statusLabel = {
    hiring: 'Hiring',
    paused: 'Paused',
    closed: 'Not Hiring',
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onClick={() => onClick(company)}
      className="group relative w-full text-left rounded-xl border border-dark-border bg-dark-surface p-5 hover:border-primary-500/30 hover:bg-dark-surface-hover transition-all duration-200 active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/10 text-primary-400 font-bold text-sm">
            {(company.company_name || '?')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-dark-foreground truncate">
              {company.company_name}
            </h3>
            {company.location && (
              <p className="flex items-center gap-1 text-xs text-dark-muted mt-0.5">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{company.location}</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {company.hiring_status && (
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                statusStyles[company.hiring_status] || statusStyles.closed
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${
                company.hiring_status === 'hiring' ? 'bg-secondary-400' :
                company.hiring_status === 'paused' ? 'bg-warning' : 'bg-error'
              }`} />
              {statusLabel[company.hiring_status] || company.hiring_status}
            </span>
          )}
          <ChevronRight className="h-4 w-4 text-dark-muted group-hover:text-primary-400 transition-colors shrink-0" />
        </div>
      </div>

      {company.summary && (
        <p className="text-sm text-dark-muted leading-relaxed mb-3 line-clamp-2">
          {company.summary}
        </p>
      )}

      <div className="space-y-2">
        {company.tech_stack?.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-dark-muted font-medium mr-0.5">Tech:</span>
            {company.tech_stack.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-md bg-primary-500/8 px-2 py-0.5 text-xs font-medium text-primary-400"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {company.required_skills?.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-dark-muted font-medium mr-0.5">Skills:</span>
            {company.required_skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-md bg-dark-surface-hover px-2 py-0.5 text-xs font-medium text-dark-foreground"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-dark-border">
        {typeof company.has_internships === 'boolean' && (
          <span className={`inline-flex items-center gap-1 text-xs font-medium ${
            company.has_internships ? 'text-secondary-400' : 'text-dark-muted'
          }`}>
            <GraduationCap className="h-3.5 w-3.5" />
            {company.has_internships ? 'Internships Available' : 'No Internships'}
          </span>
        )}
        {typeof company.open_positions === 'number' && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-400">
            <Briefcase className="h-3.5 w-3.5" />
            {company.open_positions} {company.open_positions === 1 ? 'Opening' : 'Openings'}
          </span>
        )}
      </div>
    </motion.button>
  );
}
