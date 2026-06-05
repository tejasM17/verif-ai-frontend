import React, { useEffect, useState } from 'react';
import { FileText, Award, Link as LinkIcon, Loader2, ExternalLink, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { documentsApi, Document } from '../api/documents';
import toast from 'react-hot-toast';

const MyDocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      try {
        const response = await documentsApi.getAll();
        if (response.success) {
          setDocuments(response.data);
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to load documents');
      } finally {
        setIsLoading(false);
      }
    };
    loadDocuments();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-amber-500 animate-pulse" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done':
        return <Badge variant="success" size="sm">Verified</Badge>;
      case 'processing':
        return <Badge variant="warning" size="sm">Processing</Badge>;
      case 'failed':
        return <Badge variant="error" size="sm">Failed</Badge>;
      default:
        return <Badge variant="secondary" size="sm">{status}</Badge>;
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'resume':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'certificate':
        return <Award className="w-5 h-5 text-purple-500" />;
      case 'github':
        return <LinkIcon className="w-5 h-5 text-emerald-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getDocumentLabel = (type: string) => {
    switch (type) {
      case 'resume':
        return 'Resume';
      case 'certificate':
        return 'Certificate';
      case 'github':
        return 'GitHub';
      default:
        return type;
    }
  };

  const resumeDoc = documents.find(doc => doc.type === 'resume');
  const certificateDocs = documents.filter(doc => doc.type === 'certificate');
  const githubDoc = documents.find(doc => doc.type === 'github');

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
          <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
          <p className="text-gray-500 mt-2">
            View and manage your uploaded documents for verification
          </p>
        </div>

        {/* Resume */}
        <Card bordered>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Resume</h2>
            </div>
            {resumeDoc && getStatusBadge(resumeDoc.status)}
          </CardHeader>
          <CardBody>
            {resumeDoc ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(resumeDoc.status)}
                    <span className="text-sm text-gray-600">
                      {resumeDoc.filename || 'resume.pdf'}
                    </span>
                  </div>
                  {resumeDoc.file_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(resumeDoc.file_url, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View
                    </Button>
                  )}
                </div>
                {resumeDoc.verification_result && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Verification Result</p>
                    <p className="text-sm text-gray-900">{resumeDoc.verification_result}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No resume uploaded yet</p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-3"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Upload in Dashboard
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Certificates */}
        <Card bordered>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Award className="w-5 h-5 text-purple-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Certificates</h2>
            </div>
            <span className="text-sm text-gray-500">{certificateDocs.length} uploaded</span>
          </CardHeader>
          <CardBody>
            {certificateDocs.length > 0 ? (
              <div className="space-y-4">
                {certificateDocs.map((cert, index) => (
                  <div key={cert.document_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(cert.status)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Certificate {index + 1}
                        </p>
                        <p className="text-xs text-gray-500">
                          {cert.filename || 'certificate.pdf'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(cert.status)}
                      {cert.file_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(cert.file_url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Award className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No certificates uploaded yet</p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-3"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Upload in Dashboard
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* GitHub */}
        <Card bordered>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <LinkIcon className="w-5 h-5 text-emerald-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">GitHub Profile</h2>
            </div>
            {githubDoc && getStatusBadge(githubDoc.status)}
          </CardHeader>
          <CardBody>
            {githubDoc ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(githubDoc.status)}
                    <span className="text-sm text-gray-600 font-mono">
                      {githubDoc.github_url || 'GitHub URL'}
                    </span>
                  </div>
                  {githubDoc.github_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(githubDoc.github_url, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open
                    </Button>
                  )}
                </div>
                {githubDoc.verification_result && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Verification Result</p>
                    <p className="text-sm text-gray-900">{githubDoc.verification_result}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <LinkIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No GitHub URL linked yet</p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-3"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Add in Dashboard
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default MyDocumentsPage;