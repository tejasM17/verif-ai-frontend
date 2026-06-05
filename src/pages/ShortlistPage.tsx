import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ExternalLink, Loader2, Search } from 'lucide-react';
import Layout from '../components/Layout';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { discoverApi } from '../api/discover';
import { PublicProfile } from '../types';
import toast from 'react-hot-toast';

const ShortlistPage: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<PublicProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const loadShortlisted = async () => {
      setIsLoading(true);
      try {
        const response = await discoverApi.getShortlist();
        if (response.success) {
          setStudents(response.data.students || []);
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to load shortlisted students');
      } finally {
        setIsLoading(false);
      }
    };
    loadShortlisted();
  }, []);

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      await discoverApi.removeFromShortlist(id);
      setStudents(prev => prev.filter(s => s.id !== id));
      toast.success('Removed from shortlist');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from shortlist');
    } finally {
      setRemovingId(null);
    }
  };

  const handleViewProfile = (id: string) => {
    navigate(`/profile/${id}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Shortlist</h1>
          <p className="text-gray-500 mt-2">
            Students you have shortlisted for your opportunities
          </p>
        </div>

        {/* Shortlisted Students */}
        {students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <Card key={student.id} bordered hover className="cursor-pointer transition-all" onClick={() => handleViewProfile(student.id)}>
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

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-grow"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProfile(student.id);
                      }}
                    >
                      View Profile
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(student.id);
                      }}
                      isLoading={removingId === student.id}
                    >
                      Remove
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card bordered>
            <CardBody className="text-center py-12">
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No students shortlisted yet</p>
              <p className="text-gray-400 text-sm mt-2">Start discovering and shortlist verified students</p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => navigate('/discover')}
              >
                <Search className="w-4 h-4 mr-2" />
                Discover Students
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ShortlistPage;