import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Building2, SearchX, AlertCircle, RefreshCw } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { companyService } from '../services/companyService';
import CompanyCard from '../components/companies/CompanyCard';
import CompanyFilterBar from '../components/companies/CompanyFilterBar';
import { CompanyGridSkeleton } from '../components/companies/CompanySkeleton';
import CompanyDetailPanel from '../components/companies/CompanyDetailPanel';

const PAGE_SIZE = 12;

export default function StudentCompanies({ onApplied }) {
  const { isLoading: authLoading } = useAuth();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    tech_stack: '',
    skills: '',
    hiring_status: '',
    has_internships: '',
  });
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadSentinelRef = useRef(null);

  const fetchCompanies = useCallback(async (pageNum = 1, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    const params = { page: pageNum, page_size: PAGE_SIZE };
    if (filters.search) params.search = filters.search;
    if (filters.tech_stack) params.tech_stack = filters.tech_stack;
    if (filters.skills) params.skills = filters.skills;
    if (filters.hiring_status) params.hiring_status = filters.hiring_status;
    if (filters.has_internships) params.has_internships = filters.has_internships;

    try {
      const res = await companyService.listCompanies(params);
      const data = res.data;
      const list = data.companies || data.items || data || [];
      const total = data.total || data.total_count || list.length;
      const pages = data.total_pages || data.pages || Math.ceil(total / PAGE_SIZE) || 1;

      if (append) {
        setCompanies((prev) => [...prev, ...list]);
      } else {
        setCompanies(list);
      }
      setTotalPages(pages);
      setTotalCount(total);
      setPage(pageNum);
    } catch (err) {
      setError(err.message || 'Failed to load companies');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCompanies(1);
  }, [fetchCompanies]);

  useEffect(() => {
    if (!loadSentinelRef.current || loadingMore || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages && !loadingMore) {
          fetchCompanies(page + 1, true);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loadSentinelRef.current);
    return () => observer.disconnect();
  }, [page, totalPages, loadingMore, loading, fetchCompanies]);

  const handleFilterChange = useCallback((partial) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      tech_stack: '',
      skills: '',
      hiring_status: '',
      has_internships: '',
    });
  }, []);

  const handleRetry = useCallback(() => {
    fetchCompanies(1);
  }, [fetchCompanies]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-foreground">Companies</h1>
        <p className="text-sm text-dark-muted mt-1">Discover companies hiring and their open opportunities</p>
      </div>

      <CompanyFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
        resultCount={totalCount}
      />

      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-error/20 bg-error/5 p-6 text-center"
        >
          <AlertCircle className="h-8 w-8 text-error mx-auto mb-3" />
          <p className="text-error font-medium text-sm">Failed to load companies</p>
          <p className="text-xs text-dark-muted mt-1">{error}</p>
          <button
            onClick={handleRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </motion.div>
      )}

      {loading && !loadingMore ? (
        <CompanyGridSkeleton count={6} />
      ) : !error && companies.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="rounded-2xl bg-dark-surface-muted p-4 mb-4">
            {filters.search || filters.tech_stack || filters.skills || filters.hiring_status || filters.has_internships ? (
              <SearchX className="h-10 w-10 text-dark-muted" />
            ) : (
              <Building2 className="h-10 w-10 text-dark-muted" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-dark-foreground">
            {filters.search || filters.tech_stack || filters.skills || filters.hiring_status || filters.has_internships
              ? 'No matching companies'
              : 'No companies yet'}
          </h3>
          <p className="text-sm text-dark-muted mt-1 max-w-xs">
            {filters.search || filters.tech_stack || filters.skills || filters.hiring_status || filters.has_internships
              ? 'Try adjusting your search or filters to find more companies.'
              : 'Companies will appear here once recruiters create their profiles.'}
          </p>
          {(filters.search || filters.tech_stack || filters.skills || filters.hiring_status || filters.has_internships) && (
            <button
              onClick={handleClearFilters}
              className="mt-4 rounded-lg bg-dark-surface-hover px-4 py-2 text-sm font-medium text-dark-foreground hover:bg-dark-border transition-colors"
            >
              Clear Filters
            </button>
          )}
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {companies.map((company, i) => (
              <CompanyCard
                key={company.id || company.company_id || i}
                company={company}
                index={i}
                onClick={(c) => setSelectedCompanyId(c.id || c.company_id)}
              />
            ))}
          </div>

          {loadingMore && (
            <div className="pt-2">
              <CompanyGridSkeleton count={3} />
            </div>
          )}

          {page < totalPages && !loadingMore && (
            <div ref={loadSentinelRef} className="h-10" />
          )}

          {page >= totalPages && companies.length > 0 && (
            <p className="text-center text-xs text-dark-muted py-4">
              Showing all {totalCount} companies
            </p>
          )}
        </>
      )}

      <CompanyDetailPanel
        companyId={selectedCompanyId}
        onClose={() => setSelectedCompanyId(null)}
        onApplied={onApplied}
      />
    </div>
  );
}
