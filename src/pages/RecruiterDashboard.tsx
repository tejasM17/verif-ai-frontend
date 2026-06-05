import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
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
  onView: (id: string) => void;
  onShortlist: (id: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onView, onShortlist }) => {
  const [isShortlisting, setIsShortlisting] = useState(false);

  const handleShortlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShortlisting(true);
    try {
      await discoverApi.shortlist(student.id);
      toast.success('Added to shortlist');
      onShortlist(student.id);
    } catch (error: any) {
      toast.error(error.message || 'Failed to shortlist');
    } finally {
      setIsShortlisting(false);
    }
  };

  return (
    <Card
      bordered
      hover
      className="cursor-pointer transition-all"
      onClick={() => onView(student.id)}
    >
      <CardBody className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {student.avatar_url ? (
              <img
                src={student.avatar_url}
                alt={student.display_name}
                className="h-12 w-12 rounded-lg object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {student.display_name
                  .split(' ')
                  .map((n) => n.charAt(0))
                  .join('')}
              </div>
            )}
            <div className="flex-grow">
              <h3 className="font-bold text-gray-900">{student.display_name}</h3>
              <p className="text-xs text-gray-500">
                Trust Score: {student.trust_score.score}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-500">
              {student.trust_score.score}
            </div>
            <Badge variant={student.trust_score.level === 'excellent' ? 'success' : 'info'} size="sm">
              {student.trust_score.level}
            </Badge>
          </div>
        </div>

        {student.bio && <p className="text-sm text-gray-500">{student.bio}</p>}

        {student.skills && student.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {student.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" size="sm">
                {skill}
              </Badge>
            ))}
            {student.skills.length > 3 && (
              <Badge variant="secondary" size="sm">
                +{student.skills.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-grow"
            onClick={() => onView(student.id)}
          >
            View Profile
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleShortlist}
            isLoading={isShortlisting}
          >
            +
          </Button>
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
    page: 1,
    limit: 12,
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
    setFilters((prev) => ({
      ...prev,
      query: query || undefined,
      page: 1,
    }));
    setPage(1);
  };

  const handleViewProfile = (id: string) => {
    navigate(`/profile/${id}`);
  };

  const handleShortlist = (id: string) => {
    // Refresh the list to update shortlist status
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discover Talent</h1>
          <p className="text-gray-500 mt-2">
            Find and shortlist verified students for your opportunities
          </p>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-grow">
              <Input
                size="md"
                placeholder="Search students by name, skills..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card bordered>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    size="sm"
                    label="Min Trust Score"
                    type="number"
                    min="0"
                    max="100"
                    value={filters.minTrustScore || ''}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minTrustScore: e.target.value ? parseInt(e.target.value) : undefined,
                      }))
                    }
                  />
                  <Input
                    size="sm"
                    label="Max Trust Score"
                    type="number"
                    min="0"
                    max="100"
                    value={filters.maxTrustScore || ''}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxTrustScore: e.target.value ? parseInt(e.target.value) : undefined,
                      }))
                    }
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Sort By</label>
                    <select
                      value={filters.sortBy || 'relevance'}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          sortBy: e.target.value as 'trust_score' | 'recent' | 'relevance',
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="trust_score">Trust Score (High to Low)</option>
                      <option value="recent">Recently Joined</option>
                    </select>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Students Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-gray-500">Loading students...</div>
          </div>
        ) : students.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onView={handleViewProfile}
                  onShortlist={handleShortlist}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  setFilters((prev) => ({
                    ...prev,
                    page: Math.max(1, page - 1),
                  }));
                }}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-gray-500">Page {page}</span>
              <Button
                variant="ghost"
                onClick={() => {
                  setPage((p) => p + 1);
                  setFilters((prev) => ({
                    ...prev,
                    page: page + 1,
                  }));
                }}
                disabled={students.length < 12}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <Card bordered>
            <CardBody className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No students found matching your criteria</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters</p>
            </CardBody>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default RecruiterDashboard;