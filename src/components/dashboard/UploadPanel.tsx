import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Award, Github, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardBody } from '../ui/Card';
import { documentsApi } from '../../api/documents';
import { Document } from '../../types';
import toast from 'react-hot-toast';

interface UploadPanelProps {
  onUploadSuccess?: (document: Document[]) => void;
  onAnalysisReady?: (isReady: boolean) => void;
}

type DocType = 'resume' | 'certificate' | 'github';

const docTypeConfig: Record<DocType, { icon: React.ComponentType<any>; label: string; color: string }> = {
  resume: { icon: FileText, label: 'Resume', color: 'text-blue-400' },
  certificate: { icon: Award, label: 'Certificate', color: 'text-purple-400' },
  github: { icon: Github, label: 'GitHub URL', color: 'text-green-400' },
};

export const UploadPanel: React.FC<UploadPanelProps> = ({ onUploadSuccess, onAnalysisReady }) => {
  const [selectedDocType, setSelectedDocType] = useState<DocType>('resume');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([]);
  const [isAnalysisCheckLoading, setIsAnalysisCheckLoading] = useState(false);

  useEffect(() => {
    // Fetch initial documents and readiness status when component mounts
    const fetchInitialData = async () => {
      try {
        const docsResponse = await documentsApi.getAll();
        if (docsResponse.success) {
          setUploadedDocuments(docsResponse.data);
        }
        const readinessResponse = await documentsApi.getReadiness();
        if (readinessResponse.success && onAnalysisReady) {
          onAnalysisReady(readinessResponse.data.is_ready);
        }
      } catch (error) {
        console.error('Failed to fetch initial document data or readiness:', error);
        toast.error('Failed to load document status.');
      }
    };
    fetchInitialData();
  }, [onAnalysisReady]);

  const onDropResume = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setResumeFile(acceptedFiles[0]);
    }
  }, []);

  const onDropCertificates = useCallback((acceptedFiles: File[]) => {
    setCertificateFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps: getResumeRootProps, getInputProps: getResumeInputProps, isDragActive: isResumeDragActive } = useDropzone({
    onDrop: onDropResume,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const { getRootProps: getCertRootProps, getInputProps: getCertInputProps, isDragActive: isCertDragActive } = useDropzone({
    onDrop: onDropCertificates,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
  });

  const handleDocumentUpload = async (files: File[], type: 'resume' | 'certificate') => {
    if (files.length === 0) {
      toast.error(`Please select a file to upload for ${type}.`);
      return;
    }

    setIsUploading(true);
    const uploadToastId = toast.loading(`Uploading ${files.length} ${type}(s)...`);

    try {
      const response = await documentsApi.upload(files, type);
      if (response.success) {
        setUploadedDocuments((prev) => {
          // Filter out old documents of the same type if it's a resume
          const filtered = type === 'resume' ? prev.filter(doc => doc.type !== 'resume') : prev;
          return [...filtered, ...response.data];
        });
        toast.success(`${files.length} ${type}(s) uploaded successfully!`, { id: uploadToastId });
        onUploadSuccess?.(response.data);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Upload failed';
      toast.error(errorMsg, { id: uploadToastId });
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      // After upload, re-check readiness
      checkAnalysisReadiness();
    }
  };

  const handleGithubUrlSubmit = async () => {
    if (!githubUrl) {
      toast.error('Please enter a GitHub URL.');
      return;
    }
    setIsUploading(true);
    const githubToastId = toast.loading('Submitting GitHub URL...');
    try {
      const response = await documentsApi.submitGithub(githubUrl);
      if (response.success) {
        setUploadedDocuments((prev) => {
          // Filter out old github url if exists
          const filtered = prev.filter(doc => doc.type !== 'github');
          return [...filtered, response.data];
        });
        toast.success('GitHub URL submitted successfully!', { id: githubToastId });
      } else {
        throw new Error(response.message || 'GitHub URL submission failed');
      }
    } catch (error: any) {
      const errorMsg = error.message || 'GitHub URL submission failed';
      toast.error(errorMsg, { id: githubToastId });
      console.error('GitHub URL submission error:', error);
    } finally {
      setIsUploading(false);
      checkAnalysisReadiness();
    }
  };

  const checkAnalysisReadiness = async () => {
    setIsAnalysisCheckLoading(true);
    try {
      const response = await documentsApi.getReadiness();
      if (response.success && onAnalysisReady) {
        onAnalysisReady(response.data.is_ready);
      }
    } catch (error) {
      console.error('Failed to check analysis readiness:', error);
    } finally {
      setIsAnalysisCheckLoading(false);
    }
  };

  const removeCertificateFile = (index: number) => {
    setCertificateFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const hasUploadedType = (type: DocType) => {
    return uploadedDocuments.some(doc => doc.type === type && (doc.status === 'processed' || doc.status === 'done'));
  };

  const renderDropzone = (type: DocType) => {
    const config = docTypeConfig[type];
    const Icon = config.icon;
    const isDragActive = type === 'resume' ? isResumeDragActive : isCertDragActive;
    const getRootProps = type === 'resume' ? getResumeRootProps : getCertRootProps;
    const getInputProps = type === 'resume' ? getResumeInputProps : getCertInputProps;

    let displayFiles: File[] = [];
    let fileAccept: string = '';
    let instructions: string = '';

    if (type === 'resume') {
      if (resumeFile) displayFiles = [resumeFile];
      fileAccept = '.pdf';
      instructions = 'Drag and drop your resume (PDF only) here, or click to browse.';
    } else if (type === 'certificate') {
      displayFiles = certificateFiles;
      fileAccept = '.pdf,.jpeg,.jpg,.png';
      instructions = 'Drag and drop your certificates (PDF, JPG, PNG) here, or click to browse.';
    }

    return (
      <Card bordered hover={false}>
        <CardBody>
          <div
            {...getRootProps()}
            className={`
              p-8 rounded-lg border-2 border-dashed transition-all cursor-pointer
              ${
                isDragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600/30 bg-slate-800/20 hover:border-slate-500/50'
              }
            `}
          >
            <input {...getInputProps()} disabled={isUploading} />

            <div className="flex flex-col items-center gap-3">
              <Icon className={`h-8 w-8 ${config.color}`} />
              <div className="text-center">
                <p className="text-white font-semibold">
                  {isUploading && selectedDocType === type ? 'Uploading...' : instructions}
                </p>
                <p className="text-xs text-slate-400 mt-1">Accepted: {fileAccept}</p>
              </div>
            </div>
          </div>
          {displayFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-slate-300">Selected files:</p>
              {displayFiles.map((file, index) => (
                <div key={file.name} className="flex items-center justify-between bg-slate-700/50 p-2 rounded-md">
                  <span className="text-sm text-white truncate">{file.name}</span>
                  {type === 'certificate' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent dropzone click
                        removeCertificateFile(index);
                      }}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Document Type Selector */}
      <div className="flex gap-3">
        {(Object.entries(docTypeConfig) as [DocType, typeof docTypeConfig[DocType]][]).map(
          ([type, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={type}
                onClick={() => setSelectedDocType(type)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                  ${
                    selectedDocType === type
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/50'
                      : 'bg-slate-700/30 text-slate-400 border border-slate-600/30 hover:border-slate-500/50'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {config.label}
              </button>
            );
          }
        )}
      </div>

      {/* Upload/Input Area */}
      {selectedDocType === 'resume' && (
        <>
          {renderDropzone('resume')}
          <Button
            variant="primary"
            onClick={() => handleDocumentUpload(resumeFile ? [resumeFile] : [], 'resume')}
            disabled={!resumeFile || isUploading || hasUploadedType('resume')}
            isLoading={isUploading && selectedDocType === 'resume'}
            className="w-full"
          >
            {hasUploadedType('resume') ? 'Resume Uploaded' : 'Upload Resume'}
          </Button>
          {hasUploadedType('resume') && (
            <p className="text-sm text-green-400 text-center">
              Your resume has been uploaded successfully.
            </p>
          )}
        </>
      )}

      {selectedDocType === 'certificate' && (
        <>
          {renderDropzone('certificate')}
          <Button
            variant="primary"
            onClick={() => handleDocumentUpload(certificateFiles, 'certificate')}
            disabled={certificateFiles.length === 0 || isUploading}
            isLoading={isUploading && selectedDocType === 'certificate'}
            className="w-full"
          >
            Upload Certificates
          </Button>
          {hasUploadedType('certificate') && (
            <p className="text-sm text-green-400 text-center">
              Your certificates have been uploaded.
            </p>
          )}
        </>
      )}

      {selectedDocType === 'github' && (
        <Card bordered hover={false}>
          <CardBody>
            <div className="space-y-4">
              <label htmlFor="github-url" className="block text-sm font-medium text-slate-300">
                GitHub Profile URL
              </label>
              <div className="mt-1">
                <input
                  type="url"
                  id="github-url"
                  className="block w-full rounded-md bg-slate-700 border-slate-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="https://github.com/username"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  disabled={isUploading || hasUploadedType('github')}
                />
              </div>
              <Button
                variant="primary"
                onClick={handleGithubUrlSubmit}
                disabled={!githubUrl || isUploading || hasUploadedType('github')}
                isLoading={isUploading && selectedDocType === 'github'}
                className="w-full"
              >
                {hasUploadedType('github') ? 'GitHub URL Submitted' : 'Submit GitHub URL'}
              </Button>
              {hasUploadedType('github') && (
                <p className="text-sm text-green-400 text-center">
                  Your GitHub URL has been submitted.
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Uploaded Documents List */}
      {uploadedDocuments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Your Documents</h3>
          {uploadedDocuments.map((doc) => (
            <Card key={doc.document_id} bordered>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-grow">
                    {doc.type === 'resume' && <FileText className="h-5 w-5 text-blue-400" />}
                    {doc.type === 'certificate' && <Award className="h-5 w-5 text-purple-400" />}
                    {doc.type === 'github' && <Github className="h-5 w-5 text-green-400" />}
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-white">
                        {doc.type === 'github' ? doc.github_url : doc.file_name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {doc.status === 'pending' || doc.status === 'analyzing' ? (
                      <Badge variant="warning" size="sm" className="flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Processing...
                      </Badge>
                    ) : doc.status === 'processed' || doc.status === 'done' ? (
                      <Badge variant="success" size="sm" className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Done
                      </Badge>
                    ) : doc.status === 'failed' ? (
                      <Badge variant="error" size="sm" className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Failed
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Analyze button should be handled by parent (StudentDashboard) */}
    </div>
  );
};

UploadPanel.displayName = 'UploadPanel';
