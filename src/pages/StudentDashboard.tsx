import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import { UploadPanel } from '../components/dashboard/UploadPanel';
import { TrustScoreCard } from '../components/dashboard/TrustScoreCard';
import { ResearchLogFeed } from '../components/dashboard/ResearchLogFeed';
import { Button } from '../components/ui/Button';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { useAnalysisStream } from '../hooks/useAnalysisStream';
import { analysisApi } from '../api/analysis';
import { TrustScore, Document } from '../types';
import toast from 'react-hot-toast';

const StudentDashboard: React.FC = () => {
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [isLoadingTrustScore, setIsLoadingTrustScore] = useState(false);
  const [isStartingAnalysis, setIsStartingAnalysis] = useState(false);
  const [uploadedDocCount, setUploadedDocCount] = useState(0);

  const { logs, isConnected, isLoading, error, agentStatuses, clearLogs } =
    useAnalysisStream(analysisId);

  // Load trust score on mount
  useEffect(() => {
    const loadTrustScore = async () => {
      setIsLoadingTrustScore(true);
      try {
        const response = await analysisApi.getTrustScore();
        if (response.success) {
          setTrustScore(response.data);
        }
      } catch (error) {
        console.error('Failed to load trust score:', error);
        // It's ok if trust score doesn't exist yet
      } finally {
        setIsLoadingTrustScore(false);
      }
    };

    loadTrustScore();
  }, []);

  const handleUploadSuccess = (document: Document) => {
    setUploadedDocCount((prev) => prev + 1);
  };

  const handleStartAnalysis = async () => {
    if (uploadedDocCount === 0) {
      toast.error('Please upload at least one document first');
      return;
    }

    setIsStartingAnalysis(true);
    clearLogs();
    try {
      const response = await analysisApi.start();
      if (response.success) {
        setAnalysisId(response.data.analysis_id);
        toast.success('Analysis started! Check the log below.');
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

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
          <p className="text-slate-400 mt-2">
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
                <h2 className="text-lg font-bold text-white">Upload Documents</h2>
              </CardHeader>
              <CardBody>
                <UploadPanel onUploadSuccess={handleUploadSuccess} />
              </CardBody>
            </Card>

            {/* Start Analysis Button */}
            <Card bordered>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Ready to Verify?</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {uploadedDocCount === 0
                        ? 'Upload documents to get started'
                        : `${uploadedDocCount} document(s) ready`}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleStartAnalysis}
                    disabled={uploadedDocCount === 0}
                    isLoading={isStartingAnalysis}
                  >
                    {isStartingAnalysis ? 'Starting...' : 'Start Verification'}
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Research Log */}
            {analysisId && (
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

        {/* Info Card */}
        <Card bordered>
          <CardBody>
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">How It Works</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">1.</span>
                  <span>Upload your resume, certificates, and transcript</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">2.</span>
                  <span>Our AI agents verify your documents and validate your skills</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">3.</span>
                  <span>Get a trust score badge that recruiters can verify</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">4.</span>
                  <span>Make your profile public and get discovered by recruiters</span>
                </li>
              </ul>
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
