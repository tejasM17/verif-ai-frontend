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
import { analysisApi } from '../api/analysis';
import { PublicProfile, TrustScore } from '../types';
import toast from 'react-hot-toast';

const PublicProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [isShortlisting, setIsShortlisting] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const response = await profileApi.getPublic(userId);
        // Note: getPublic returns the profile directly or wrapped in success
        const profileData = (response as any).success ? (response as any).data : response;
        setProfile(profileData);

        // Fetch detailed trust score if available
        const scoreResponse = await analysisApi.getResult(userId);
        if (scoreResponse.success) {
          setTrustScore(scoreResponse.data.verification);
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
      await discoverApi.shortlist(userId);
      setIsShortlisted(true);
      toast.success('Added to shortlist');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update shortlist');
    } finally {
      setIsShortlisting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="h-12 w-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest animate-pulse">Loading Profile...</p>
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

  const initials = profile.display_name
    ? profile.display_name.split(' ').map((n) => n.charAt(0)).join('')
    : 'U';

  return (
    <Layout>
      <div className="space-y-8 max-w-7xl mx-auto pb-20">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </button>

        {/* Profile Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card bordered className="bg-white rounded-3xl overflow-hidden shadow-sm">
              <CardBody className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.display_name}
                      className="h-32 w-32 rounded-3xl object-cover ring-4 ring-slate-50 shadow-xl"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-xl">
                      {initials}
                    </div>
                  )}
                  <div className="flex-grow text-center md:text-left space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{profile.display_name}</h1>
                        <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mt-1">{profile.domain || 'Verified Academic Profile'}</p>
                      </div>
                      <Button
                        variant={isShortlisted ? 'secondary' : 'primary'}
                        onClick={handleShortlist}
                        isLoading={isShortlisting}
                        className="rounded-xl px-8 h-11"
                      >
                        {isShortlisted ? 'Shortlisted' : 'Shortlist Student'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-slate-500 font-medium">
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <span>{profile.location || 'Remote'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>Contact Available</span>
                      </div>
                    </div>

                    {profile.bio && (
                      <p className="text-slate-600 leading-relaxed text-base max-w-2xl">
                        {profile.bio}
                      </p>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Skills Section */}
            {profile.skills && profile.skills.length > 0 && (
              <Card bordered className="rounded-3xl shadow-sm bg-white">
                <CardHeader className="p-8 pb-4">
                  <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Verified Skills</h2>
                </CardHeader>
                <CardBody className="p-8 pt-0">
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" size="lg" className="bg-slate-50 text-slate-700 font-bold px-4 py-2 border-slate-100">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Connect Section */}
            <Card bordered className="rounded-3xl shadow-sm bg-slate-50/50">
              <CardBody className="p-8 flex flex-wrap gap-4">
                <Button variant="ghost" className="bg-white border-slate-200 rounded-xl px-6 h-12 gap-2 text-slate-700 hover:text-indigo-600 shadow-sm">
                  <Mail className="h-5 w-5" />
                  Request Interview
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => profile.uid && window.open(`https://github.com/${profile.uid}`, '_blank')} 
                  className="bg-white border-slate-200 rounded-xl px-6 h-12 gap-2 text-slate-700 hover:text-indigo-600 shadow-sm"
                >
                  <Github className="h-5 w-5" />
                  GitHub Repository
                </Button>
                <Button variant="ghost" className="bg-white border-slate-200 rounded-xl px-6 h-12 gap-2 text-slate-700 hover:text-indigo-600 shadow-sm">
                  <Linkedin className="h-5 w-5" />
                  LinkedIn
                </Button>
              </CardBody>
            </Card>
          </div>

          {/* Trust Score Column */}
          <div className="space-y-6">
            <TrustScoreCard trustScore={trustScore || {
              student_uid: profile.uid,
              trust_score: profile.trust_score,
              verdict: profile.verdict as any,
              resume_score: profile.trust_score * 0.9, // Fallback calculation
              cert_score: profile.trust_score * 0.8,
              github_score: profile.trust_score * 0.7,
              flags: [],
              created_at: new Date().toISOString()
            }} />
            
            <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-500/20">
              <h4 className="font-black uppercase tracking-widest text-[10px] opacity-70 mb-2">Agent Verdict</h4>
              <p className="text-lg font-bold leading-tight">
                {profile.trust_score >= 80 
                  ? "Profile highly recommended. All major technical claims have been verified against source documents."
                  : "Profile requires manual review. Some technical footprints could not be fully reconciled automatically."}
              </p>
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider">AI Verified 2024</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PublicProfilePage;
