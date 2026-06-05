import React, { useState, useEffect } from 'react';
import { Search, X, Filter, User, MapPin, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { discoverApi, SearchFilters } from '../api/discover';
import { PublicProfile } from '../types';
import toast from 'react-hot-toast';

interface StudentCardProps {
  student: PublicProfile;
  onView: (uid: string) => void;
  onShortlist: (uid: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onView, onShortlist }) => {
  const [isShortlisting, setIsShortlisting] = useState(false);

  const handleShortlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShortlisting(true);
    try {
      await discoverApi.shortlist(student.uid);
      toast.success('Added to shortlist');
      onShortlist(student.uid);
    } catch (error: any) {
      toast.error(error.message || 'Failed to shortlist');
    } finally {
      setIsShortlisting(false);
    }
  };

  const getTrustColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <Card
      bordered
      hover
      className="cursor-pointer transition-all group overflow-hidden"
      onClick={() => onView(student.uid)}
    >
      <CardBody className="p-0">
        {/* Top Accent Bar */}
        <div className={`h-1.5 w-full ${student.trust_score >= 80 ? 'bg-emerald-500' : 'bg-blue-500'}`} />
        
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {student.avatar_url ? (
                <img
                  src={student.avatar_url}
                  alt={student.display_name}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-slate-100"
                />
              ) : (
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                  {student.display_name
                    .split(' ')
                    .map((n) => n.charAt(0))
                    .join('')}
                </div>
              )}
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{student.display_name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <Briefcase className="h-3 w-3" />
                  <span>{student.domain || 'Tech Talent'}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-black ${getTrustColor(student.trust_score)}`}>
                {student.trust_score}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Trust Score</p>
            </div>
          </div>

          {student.bio && (
            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed h-10">
              {student.bio}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5 min-h-[56px]">
            {student.skills && student.skills.length > 0 ? (
              student.skills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="secondary" size="sm" className="bg-slate-50 text-slate-600 border-slate-100">
                  {skill}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No skills listed</span>
            )}
            {student.skills && student.skills.length > 4 && (
              <Badge variant="secondary" size="sm" className="bg-slate-50 text-slate-400">
                +{student.skills.length - 4}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="h-3 w-3" />
              <span>{student.location || 'Remote'}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-indigo-600"
                onClick={handleShortlist}
                isLoading={isShortlisting}
              >
                +
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="px-4 h-8 rounded-lg shadow-indigo-500/10 shadow-lg"
                onClick={() => onView(student.uid)}
              >
                Profile
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const RecruiterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<PublicProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({
    limit: 12,
    offset: 0,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Load students on component mount and when filters change
  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);
      try {
        const response = await discoverApi.search(filters);
        if (response.success) {
          setStudents(response.data.students);
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to load students');
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, [filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Real search would use domain or location if they were parts of a query
    setFilters((prev) => ({
      ...prev,
      domain: query || undefined, // Simple mapping for demo
      offset: 0,
    }));
    setPage(1);
  };

  const handleViewProfile = (uid: string) => {
    navigate(`/profile/${uid}`);
  };

  const handleShortlist = (uid: string) => {
    // Optionally update local state
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verified Talent Discovery</h1>
          <p className="text-slate-500 mt-2 font-medium">
            Browse through AI-verified academic and professional profiles.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by domain, role or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 rounded-2xl bg-white border-slate-200"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card bordered className="rounded-2xl bg-slate-50/50 border-slate-200">
              <CardBody className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Min Trust Score</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={filters.min_trust || 0}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        min_trust: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-500">
                    <span>0</span>
                    <span>{filters.min_trust || 0}</span>
                    <span>100</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Location</label>
                  <select
                    value={filters.location || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value || undefined }))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">Anywhere</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Remote">Remote</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Domain</label>
                  <select
                    value={filters.domain || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, domain: e.target.value || undefined }))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">All Domains</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-slate-400 hover:text-red-500"
                    onClick={() => {
                      setFilters({ limit: 12, offset: 0 });
                      setSearchQuery('');
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Students Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="h-12 w-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest animate-pulse">Scanning Talent Pool...</p>
          </div>
        ) : students.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <StudentCard
                  key={student.uid}
                  student={student}
                  onView={handleViewProfile}
                  onShortlist={handleShortlist}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-100">
              <p className="text-sm text-slate-500 font-medium">
                Showing <span className="text-slate-900">{(page - 1) * 12 + 1}</span> - <span className="text-slate-900">{Math.min(page * 12, students.length)}</span>
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-xl px-4"
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    setFilters((prev) => ({
                      ...prev,
                      offset: Math.max(0, (page - 2) * 12),
                    }));
                  }}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-xl px-4"
                  onClick={() => {
                    setPage((p) => p + 1);
                    setFilters((prev) => ({
                      ...prev,
                      offset: page * 12,
                    }));
                  }}
                  disabled={students.length < 12}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-24 text-center">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No students found</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">Try adjusting your filters or search terms to find more candidates.</p>
            <Button 
              variant="secondary" 
              className="mt-6 rounded-xl"
              onClick={() => {
                setFilters({ limit: 12, offset: 0 });
                setSearchQuery('');
              }}
            >
              Reset Search
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RecruiterDashboard;
