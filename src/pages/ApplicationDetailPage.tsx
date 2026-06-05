import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Award,
  Link as LinkIcon,
  Linkedin,
  Globe,
  Github,
  Bot,
  Loader2,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Layout from '../components/Layout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { applicationsApi } from '../api/applications';
import toast from 'react-hot-toast';

type TabType = 'profile' | 'ai-analyzer';

interface AnalysisResult {
  overall_score: number;
  summary: string;
  strengths: string[];
  concerns: string[];
  recommendation: string;
}

const ApplicationDetailPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [application, setApplication] = useState<any>(location.state?.application || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      // Simulate AI analysis - backend will provide actual analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalysisResult({
        overall_score: 78,
        summary: "Strong technical background with verified certifications. Demonstrates expertise in frontend development with good problem-solving skills. GitHub activity shows consistent contributions to personal and open-source projects.",
        strengths: [
          "Verified backend development skills through certificates",
          "Active GitHub profile with multiple project contributions",
          "Strong TypeScript and React expertise matching job requirements",
          "Good communication skills as evidenced by project documentation"
        ],
        concerns: [
          "Limited exposure to large-scale distributed systems",
          "No visible experience with cloud infrastructure (AWS/GCP)",
          "Junior level position only - may require mentorship"
        ],
        recommendation: "Recommended for interview. Technical skills align well with requirements. Consider for mid-level role or internship position."
      });
      setHasAnalyzed(true);
      toast.success('Analysis complete!');
    } catch (error: any) {
      toast.error(error.message || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: FileText },
    { id: 'ai-analyzer' as TabType, label: 'AI Analyzer', icon: Bot },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/recruiter-home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Applications
        </button>

        {/* Applicant Header */}
        {application && (
          <Card bordered>
            <CardBody>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl">
                    {application.student?.display_name?.split(' ').map(n => n.charAt(0)).join('') || 'S'}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{application.student?.display_name || 'Student'}</h1>
                    <p className="text-sm text-gray-500">Applied for: {application.job_title}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant={application.student?.trust_score?.level === 'excellent' ? 'success' : 'info'} size="sm">
                        Trust Score: {application.student?.trust_score?.score || 0}
                      </Badge>
                      <span className="text-xs text-gray-400">Applied {new Date(application.applied_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && application?.student && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              {application.student.bio && (
                <Card bordered>
                  <CardHeader>
                    <h2 className="text-base font-semibold text-gray-900">About</h2>
                  </CardHeader>
                  <CardBody>
                    <p className="text-sm text-gray-600">{application.student.bio}</p>
                  </CardBody>
                </Card>
              )}

              {/* Skills */}
              <Card bordered>
                <CardHeader>
                  <h2 className="text-base font-semibold text-gray-900">Skills</h2>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-wrap gap-2">
                    {application.student.skills?.map((skill: string) => (
                      <Badge key={skill} variant="secondary" size="md">{skill}</Badge>
                    )) || <p className="text-sm text-gray-400">No skills listed</p>}
                  </div>
                </CardBody>
              </Card>

              {/* Documents */}
              <Card bordered>
                <CardHeader>
                  <h2 className="text-base font-semibold text-gray-900">Documents</h2>
                </CardHeader>
                <CardBody className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Resume</p>
                        <p className="text-xs text-gray-400">resume.pdf</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Certificates</p>
                        <p className="text-xs text-gray-400">3 verified certificates</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Right - Quick Links */}
            <div className="space-y-6">
              <Card bordered>
                <CardHeader>
                  <h2 className="text-base font-semibold text-gray-900">Quick Links</h2>
                </CardHeader>
                <CardBody className="space-y-3">
                  {application.student.github_url && (
                    <a
                      href={application.student.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Github className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">GitHub</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                  )}
                  {application.student.linkedin_url && (
                    <a
                      href={application.student.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">LinkedIn</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                  )}
                  {application.student.portfolio_url && (
                    <a
                      href={application.student.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Globe className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Portfolio</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                  )}
                  {!application.student.github_url && !application.student.linkedin_url && !application.student.portfolio_url && (
                    <p className="text-sm text-gray-400 text-center py-4">No links available</p>
                  )}
                </CardBody>
              </Card>

              {/* Trust Score */}
              <Card bordered>
                <CardHeader>
                  <h2 className="text-base font-semibold text-gray-900">Trust Score</h2>
                </CardHeader>
                <CardBody>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">{application.student.trust_score?.score || 0}</div>
                    <Badge
                      variant={application.student.trust_score?.level === 'excellent' ? 'success' : 'info'}
                      size="sm"
                      className="mt-2"
                    >
                      {application.student.trust_score?.level || 'unknown'}
                    </Badge>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'ai-analyzer' && (
          <div className="space-y-6">
            <Card bordered>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Bot className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">AI Profile Analyzer</h2>
                    <p className="text-xs text-gray-500">AI-powered analysis of student profile</p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={handleAnalyze}
                  isLoading={isAnalyzing}
                  disabled={hasAnalyzed}
                >
                  {isAnalyzing ? 'Analyzing...' : hasAnalyzed ? 'Re-analyze' : 'Analyze Profile'}
                </Button>
              </CardHeader>
              <CardBody>
                {isAnalyzing && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-3" />
                    <p className="text-sm text-gray-500">Analyzing student profile...</p>
                    <p className="text-xs text-gray-400 mt-1">This may take a few moments</p>
                  </div>
                )}

                {!isAnalyzing && !analysisResult && !hasAnalyzed && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Bot className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500">Click "Analyze Profile" to get AI-powered insights</p>
                    <p className="text-xs text-gray-400 mt-1">Analysis includes skill matching, verification status, and recommendations</p>
                  </div>
                )}

                {analysisResult && (
                  <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl font-bold text-gray-900">{analysisResult.overall_score}</div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Overall Score</p>
                          <p className="text-xs text-gray-500">Based on verification & skills</p>
                        </div>
                      </div>
                      <Badge variant={analysisResult.overall_score >= 70 ? 'success' : 'warning'} size="md">
                        {analysisResult.overall_score >= 70 ? 'Recommended' : 'Needs Review'}
                      </Badge>
                    </div>

                    {/* Summary */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Summary</h3>
                      <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">{analysisResult.summary}</p>
                    </div>

                    {/* Strengths & Concerns */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-emerald-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <h3 className="text-sm font-semibold text-gray-900">Strengths</h3>
                        </div>
                        <ul className="space-y-2">
                          {analysisResult.strengths.map((strength, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-emerald-500 mt-0.5">•</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <h3 className="text-sm font-semibold text-gray-900">Areas of Concern</h3>
                        </div>
                        <ul className="space-y-2">
                          {analysisResult.concerns.map((concern, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-amber-500 mt-0.5">•</span>
                              {concern}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Recommendation</h3>
                      <p className="text-sm text-gray-600">{analysisResult.recommendation}</p>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ApplicationDetailPage;