import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Clock,
  Users,
  ChevronRight,
  Plus,
  X,
  Loader2,
  Building2,
  User
} from 'lucide-react';
import Layout from '../components/Layout';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { applicationsApi } from '../api/applications';
import { profileApi } from '../api/profile';
import { PublicProfile } from '../types';
import toast from 'react-hot-toast';

interface Application {
  id: string;
  student_id: string;
  student: PublicProfile;
  job_id: string;
  job_title: string;
  company_name: string;
  applied_at: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
}

const RecruiterHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [recruiterProfile, setRecruiterProfile] = useState<any>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Job form state
  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [jobSalary, setJobSalary] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobSkills, setJobSkills] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const profileResponse = await profileApi.getMe();
        if (profileResponse.success) {
          setRecruiterProfile(profileResponse.data);
          setCompanyName(profileResponse.data.company_name || 'Your Company');
        }

        const appResponse = await applicationsApi.getApplications();
        if (appResponse.success) {
          setApplications(appResponse.data);
        }
      } catch (error: any) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePostJob = async () => {
    if (!jobTitle || !jobDescription) {
      toast.error('Please fill in required fields');
      return;
    }
    setIsPostingJob(true);
    try {
      await applicationsApi.postJob({
        title: jobTitle,
        company_name: companyName,
        location: jobLocation,
        job_type: jobType,
        salary_range: jobSalary,
        skills: jobSkills.split(',').map(s => s.trim()).filter(Boolean),
        description: jobDescription,
      });
      toast.success('Job posted successfully!');
      setShowProfileDropdown(false);
      setJobTitle('');
      setJobDescription('');
      setJobLocation('');
      setJobSalary('');
      setJobSkills('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to post job');
    } finally {
      setIsPostingJob(false);
    }
  };

  const filteredApplications = applications.filter(app =>
    app.student.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.job_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'reviewed':
        return <Badge variant="info" size="sm">Reviewed</Badge>;
      case 'shortlisted':
        return <Badge variant="success" size="sm">Shortlisted</Badge>;
      case 'rejected':
        return <Badge variant="error" size="sm">Rejected</Badge>;
      default:
        return <Badge variant="secondary" size="sm">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="glass-card rounded-2xl p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-gray-500 font-medium">Loading applications...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Applicant Dashboard</h1>
              <p className="text-sm text-gray-500">Manage student applications</p>
            </div>
          </div>
          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-200 hover:border-blue-300 rounded-xl transition-colors shadow-sm"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {companyName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-gray-700">{companyName}</span>
              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showProfileDropdown ? 'rotate-90' : ''}`} />
            </button>
            {/* Dropdown Panel */}
            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 animate-fade-slide-up overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-bold text-gray-900">Post a New Job</h3>
                  <p className="text-xs text-gray-500 mt-1">Create a job listing for students</p>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Job Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Frontend Engineer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Bangalore"
                        value={jobLocation}
                        onChange={(e) => setJobLocation(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Type</label>
                      <select
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Salary Range</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹20-30 LPA"
                      value={jobSalary}
                      onChange={(e) => setJobSalary(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Skills (comma separated)</label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, Node.js"
                      value={jobSkills}
                      onChange={(e) => setJobSkills(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description *</label>
                    <textarea
                      rows={3}
                      placeholder="Describe the role..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 resize-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="secondary" onClick={() => setShowProfileDropdown(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handlePostJob} isLoading={isPostingJob} className="flex-1 shadow-sm">
                      Post Job
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name or job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all shadow-sm"
          />
        </div>

        {/* Applications List */}
        {filteredApplications.length > 0 ? (
          <div className="grid gap-4">
            {filteredApplications.map((app) => (
              <Card
                key={app.id}
                bordered
                hover
                className="cursor-pointer transition-all hover:shadow-lg rounded-2xl overflow-hidden"
                onClick={() => navigate(`/recruiter/application/${app.id}`, { state: { application: app } })}
              >
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-bold text-lg">
                        {app.student.display_name.split(' ').map(n => n.charAt(0)).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{app.student.display_name}</h3>
                        <p className="text-sm text-gray-500">{app.job_title}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Applied {new Date(app.applied_at).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-400">Trust Score: {app.student.trust_score?.score || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(app.status)}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card bordered className="rounded-2xl">
            <CardBody className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No applications yet</p>
              <p className="text-sm text-gray-400 mt-1">Students who apply to your jobs will appear here</p>
            </CardBody>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default RecruiterHomePage;