import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Link2, Linkedin, Globe, Plus, X } from 'lucide-react';
import Layout from '../components/Layout';
import { UploadPanel } from '../components/dashboard/UploadPanel';
import { TrustScoreCard } from '../components/dashboard/TrustScoreCard';
import { ResearchLogFeed } from '../components/dashboard/ResearchLogFeed';
import { Button } from '../components/ui/Button';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAnalysisStream } from '../hooks/useAnalysisStream';
import { analysisApi } from '../api/analysis';
import { documentsApi } from '../api/documents';
import { profileApi } from '../api/profile';
import { TrustScore, Document } from '../types';
import toast from 'react-hot-toast';

const StudentDashboard: React.FC = () => {
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [websocketUrl, setWebsocketUrl] = useState<string | null>(null);
  const [isLoadingTrustScore, setIsLoadingTrustScore] = useState(false);
  const [isStartingAnalysis, setIsStartingAnalysis] = useState(false);
  const [isAnalysisReady, setIsAnalysisReady] = useState(false);
  const [analysisReadiness, setAnalysisReadiness] = useState<{ has_resume: boolean; has_certificate: boolean; has_github: boolean; is_ready: boolean; missing: string[] } | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isSavingLinks, setIsSavingLinks] = useState(false);
  const [socialLinks, setSocialLinks] = useState<{ linkedin?: string; portfolio?: string }>({});

  const { logs, isConnected, isLoading, error, agentStatuses, clearLogs } =
    useAnalysisStream(websocketUrl);

  const checkReadiness = useCallback(async () => {
    try {
      const response = await documentsApi.getReadiness();
      if (response.success) {
        setAnalysisReadiness(response.data);
        setIsAnalysisReady(response.data.is_ready);
      }
    } catch (error) {
      console.error('Failed to fetch analysis readiness:', error);
      toast.error('Failed to load analysis readiness status.');
    }
  }, []);

  // Load social links on mount
  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const response = await profileApi.getMe();
        if (response.success) {
          setSocialLinks({
            linkedin: response.data.linkedin_url,
            portfolio: response.data.portfolio_url,
          });
          setLinkedinUrl(response.data.linkedin_url || '');
          setPortfolioUrl(response.data.portfolio_url || '');
        }
      } catch (error) {
        console.error('Failed to load social links:', error);
      }
    };
    loadSocialLinks();
  }, []);

  const handleSaveLinks = async () => {
    setIsSavingLinks(true);
    try {
      const response = await profileApi.update({
        linkedin_url: linkedinUrl || undefined,
        portfolio_url: portfolioUrl || undefined,
      });
      if (response.success) {
        setSocialLinks({
          linkedin: linkedinUrl || undefined,
          portfolio: portfolioUrl || undefined,
        });
        toast.success('Links updated successfully!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update links');
    } finally {
      setIsSavingLinks(false);
    }
  };

  // Load trust score and initial readiness on mount
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoadingTrustScore(true);
      try {
        const scoreResponse = await analysisApi.getTrustScore();
        if (scoreResponse.success) {
          setTrustScore(scoreResponse.data);
        }
      } catch (error) {
        console.error('Failed to load trust score:', error);
        // It's ok if trust score doesn't exist yet
      } finally {
        setIsLoadingTrustScore(false);
      }
      checkReadiness();
    };
    loadInitialData();
  }, [checkReadiness]);

  const handleStartAnalysis = async () => {
    setIsStartingAnalysis(true);
    clearLogs();
    setTrustScore(null); // Clear previous trust score

    try {
      const allDocsResponse = await documentsApi.getAll();
      if (!allDocsResponse.success) {
        throw new Error(allDocsResponse.message || 'Failed to fetch uploaded documents.');
      }

      const uploadedDocs = allDocsResponse.data;
      const resumeDoc = uploadedDocs.find(doc => doc.type === 'resume' && doc.status === 'done');
      const certificateDocs = uploadedDocs.filter(doc => doc.type === 'certificate' && doc.status === 'done');
      const githubDoc = uploadedDocs.find(doc => doc.type === 'github' && doc.status === 'done');

      if (!resumeDoc || certificateDocs.length === 0 || !githubDoc) {
        toast.error('Please ensure all required documents (resume, certificates, GitHub URL) are uploaded and processed.');
        setIsStartingAnalysis(false);
        return;
      }

      const cert_doc_ids = certificateDocs.map(doc => doc.document_id);
      const resume_document_id = resumeDoc.document_id;
      const github_url = githubDoc.github_url || '';

      const response = await analysisApi.start(resume_document_id, cert_doc_ids, github_url);
      if (response.success) {
        setJobId(response.data.job_id);
        setWebsocketUrl(response.data.websocket_url);
        toast.success('Analysis started! Check the log below.');
      } else {
        throw new Error(response.message || 'Failed to start analysis');
      }
    } catch (error: any) {
      let errorMsg = error.message;
      if (!errorMsg && error.detail) {
        if (Array.isArray(error.detail)) {
          errorMsg = error.detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
        } else if (typeof error.detail === 'string') {
          errorMsg = error.detail;
        }
      }
      toast.error(errorMsg || error.error || 'Failed to start analysis');
    } finally {
      setIsStartingAnalysis(false);
    }
  };

  useEffect(() => {
    // When analysis completes, fetch the new trust score
    if (logs.some(log => log.type === 'analysis_complete')) {
      const fetchFinalTrustScore = async () => {
        setIsLoadingTrustScore(true);
        try {
          const response = await analysisApi.getTrustScore();
          if (response.success) {
            setTrustScore(response.data);
            toast.success('Analysis complete! Trust score updated.');
          }
        } catch (error) {
          console.error('Failed to fetch final trust score:', error);
          toast.error('Could not fetch final trust score.');
        } finally {
          setIsLoadingTrustScore(false);
        }
      };
      fetchFinalTrustScore();
    }
  }, [logs]);

  const missingDocsMessage = analysisReadiness?.missing.length
    ? `Missing: ${analysisReadiness.missing.join(', ')}`
    : 'All documents uploaded!';

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-500 mt-2">
            Upload your documents and verify your skills with AI
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Section */}
            <Card bordered>
              <CardHeader>
                <h2 className="text-lg font-bold text-gray-900">Upload Documents</h2>
              </CardHeader>
              <CardBody>
                <UploadPanel
                  onAnalysisReady={setIsAnalysisReady}
                />
              </CardBody>
            </Card>

            {/* Social Links Section */}
            <Card bordered>
              <CardHeader>
                <h2 className="text-lg font-bold text-gray-900">Social Links</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                      <Linkedin className="w-4 h-4 text-blue-500" />
                      LinkedIn Profile
                    </label>
                    <Input
                      size="sm"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                      <Globe className="w-4 h-4 text-emerald-500" />
                      Portfolio / Website
                    </label>
                    <Input
                      size="sm"
                      placeholder="https://yourportfolio.com"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveLinks}
                      isLoading={isSavingLinks}
                    >
                      Save Links
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Research Log */}
            {websocketUrl && (
              <ResearchLogFeed
                logs={logs}
                agentStatuses={agentStatuses}
                isConnected={isConnected}
                isLoading={isLoading}
                error={error}
              />
            )}
          </div>

          {/* Right Column - Trust Score */}
          <div>
            <TrustScoreCard trustScore={trustScore} isLoading={isLoadingTrustScore} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;