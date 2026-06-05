import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, Linkedin, Globe, Mail, ExternalLink } from 'lucide-react';
import Layout from '../components/Layout';
import { TrustScoreCard } from '../components/dashboard/TrustScoreCard';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { profileApi } from '../api/profile';
import { discoverApi } from '../api/discover';
import { PublicProfile } from '../types';
import toast from 'react-hot-toast';

const PublicProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [isShortlisting, setIsShortlisting] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const response = await profileApi.getPublic(userId);
        if (response.success) {
          setProfile(response.data);
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to load profile');
        navigate('/discover');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId, navigate]);

  const handleShortlist = async () => {
    if (!userId) return;

    setIsShortlisting(true);
    try {
      if (isShortlisted) {
        await discoverApi.removeFromShortlist(userId);
        setIsShortlisted(false);
        toast.success('Removed from shortlist');
      } else {
        await discoverApi.shortlist(userId);
        setIsShortlisted(true);
        toast.success('Added to shortlist');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update shortlist');
    } finally {
      setIsShortlisting(false);
    }
  };

  const handleSendMessage = () => {
    toast.success('Message feature coming soon!');
  };

  const handleOpenGitHub = () => {
    if (profile?.github_url) {
      window.open(profile.github_url, '_blank');
    } else {
      toast.error('GitHub URL not available');
    }
  };

  const handleOpenLinkedIn = () => {
    toast.success('LinkedIn integration coming soon!');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-96 gap-4">
          <div className="text-gray-500">Profile not found</div>
          <Button onClick={() => navigate('/discover')}>Back to Discovery</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>

        {/* Profile Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Info */}
          <div className="lg:col-span-2">
            <Card bordered>
              <CardBody>
                <div className="flex items-start gap-4">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.display_name}
                      className="h-24 w-24 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      {profile.display_name
                        .split(' ')
                        .map((n) => n.charAt(0))
                        .join('')}
                    </div>
                  )}
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">{profile.display_name}</h1>
                        <p className="text-gray-500 mt-1">Verified Student</p>
                      </div>
                      <Button
                        variant={isShortlisted ? 'secondary' : 'primary'}
                        onClick={handleShortlist}
                        isLoading={isShortlisting}
                      >
                        {isShortlisted ? 'Remove from Shortlist' : 'Shortlist'}
                      </Button>
                    </div>

                    {profile.bio && (
                      <p className="text-gray-600 mt-4 text-sm">{profile.bio}</p>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Trust Score Card */}
          <div>
            <TrustScoreCard trustScore={profile.trust_score} />
          </div>
        </div>

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <Card bordered>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">Skills & Expertise</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" size="md">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Contact Section */}
        <Card bordered>
          <CardHeader>
            <h2 className="text-lg font-bold text-gray-900">Connect</h2>
          </CardHeader>
          <CardBody>
            <div className="flex gap-3 flex-wrap">
              <Button variant="ghost" onClick={handleSendMessage} className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Send Message
              </Button>
              <Button variant="ghost" onClick={handleOpenGitHub} className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub
                {profile?.github_url && <ExternalLink className="h-3 w-3 ml-1" />}
              </Button>
              <Button variant="ghost" onClick={handleOpenLinkedIn} className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default PublicProfilePage;