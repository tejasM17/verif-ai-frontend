import React, { useState, useEffect } from 'react';
import { MapPin, Clock, ExternalLink, Search, Briefcase, Loader2, Building2 } from 'lucide-react';
import Layout from '../components/Layout';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { jobsApi } from '../api/jobs';
import toast from 'react-hot-toast';

const JobCard: React.FC<{
  companyLogoInitials: string;
  companyName: string;
  timeAgo: string;
  jobTitle: string;
  location: string;
  jobType: string;
  skills: string[];
  salaryRange: string;
  animationDelay?: string;
  logoColor?: string;
  onApply?: () => void;
  isApplying?: boolean;
}> = ({
  companyLogoInitials,
  companyName,
  timeAgo,
  jobTitle,
  location,
  jobType,
  skills,
  salaryRange,
  animationDelay = '0ms',
  logoColor = 'bg-gradient-to-br from-blue-400 to-blue-600',
  onApply,
  isApplying,
}) => {
  return (
    <Card bordered hover className="animate-fade-slide-up glass-card rounded-2xl overflow-hidden" style={{ animationDelay }}>
      <CardBody>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${logoColor} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
              {companyLogoInitials}
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-700">{companyName}</span>
              <p className="text-xs text-gray-400">{timeAgo}</p>
            </div>
          </div>
          <Badge variant="secondary" size="sm">{jobType}</Badge>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {jobTitle}
        </h3>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{jobType}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" size="sm">{skill}</Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-base font-bold text-gray-900">{salaryRange}</span>
          <button
            onClick={onApply}
            disabled={isApplying}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 active:scale-95 transition-all font-medium shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Applying...
              </>
            ) : (
              <>
                Apply Now
                <ExternalLink className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </CardBody>
    </Card>
  );
};

const StudentHomePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        const response = await jobsApi.getJobs();
        if (response.success && response.data.length > 0) {
          setJobs(response.data);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error('Failed to load jobs:', error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadJobs();
  }, []);

  const handleApply = async (jobId: string) => {
    setApplyingJobId(jobId);
    try {
      await jobsApi.applyForJob(jobId);
      toast.success('Application submitted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setApplyingJobId(null);
    }
  };

  const filterJobs = (jobs: any[]) => {
    return jobs.filter((job: any) => {
      const matchesFilter = !activeFilter || job.jobType === activeFilter;
      const matchesSearch = !searchQuery ||
        job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.skills || []).some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  };

  const filteredJobs = filterJobs(jobs);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(prev => prev === filter ? null : filter);
  };

  const transformJob = (job: any) => {
    const initials = (job.company_name || 'C').substring(0, 2).toUpperCase();
    const timeAgo = job.created_at
      ? `${Math.floor((Date.now() - new Date(job.created_at).getTime()) / (1000 * 60 * 60))}h ago`
      : 'Recently posted';
    return {
      ...job,
      companyLogoInitials: initials,
      companyName: job.company_name,
      timeAgo,
      jobTitle: job.title,
      location: job.location || 'Remote',
      jobType: job.job_type,
      skills: job.skills || [],
      salaryRange: job.salary_range || 'Competitive',
      logoColor: 'bg-gradient-to-br from-blue-400 to-blue-600',
    };
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="glass-card rounded-2xl p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-gray-500 font-medium">Loading opportunities...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Briefcase className="w-6 h-6 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Job Opportunities</h1>
          </div>
          <p className="text-gray-500">
            Discover verified opportunities matching your skills
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs by title, company, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all shadow-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          {['Remote', 'Full-time', 'Part-time', 'Internship'].map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                activeFilter === filter
                  ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/25'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 shadow-sm'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Jobs Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-gray-900">Recommended for You</h2>
            </div>
            <span className="text-sm text-gray-500">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
              {activeFilter ? ` for ${activeFilter}` : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredJobs.map((job: any, index: number) => {
              const transformedJob = transformJob(job);
              return (
                <JobCard
                  key={job.id || index}
                  {...transformedJob}
                  animationDelay={`${index * 100}ms`}
                  onApply={() => job.id && handleApply(job.id)}
                  isApplying={applyingJobId === job.id}
                />
              );
            })}
          </div>

          {filteredJobs.length === 0 && (
            <div className="glass-card rounded-2xl text-center py-16">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No jobs match your current filters</p>
              <button
                onClick={() => { setActiveFilter(null); setSearchQuery(''); }}
                className="mt-3 text-sm text-blue-500 hover:text-blue-600 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentHomePage;
