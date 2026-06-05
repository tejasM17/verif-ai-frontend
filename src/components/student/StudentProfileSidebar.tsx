import React, { useState, useEffect } from 'react';
import {
  FileText,
  Award,
  Github,
  Globe,
  Linkedin,
  Briefcase,
  GraduationCap,
  Camera,
  Plus,
  ExternalLink,
} from 'lucide-react';
import UploadRow from './UploadRow';
import { useAuthStore } from '../../store/authStore';
import { documentsApi } from '../../api/documents';
import { Document } from '../../types';

export function StudentProfileSidebar() {
  const [isHovering, setIsHovering] = useState(false);
  const { user } = useAuthStore();
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const response = await documentsApi.getAll();
        if (response.success) {
          setDocuments(response.data);
        }
      } catch (error) {
        console.error('Failed to load documents:', error);
      }
    };
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const resume = documents.find(doc => doc.type === 'resume');
  const certificatesCount = documents.filter(doc => doc.type === 'certificate').length;
  const github = documents.find(doc => doc.type === 'github');

  const initials = user?.display_name
    ? user.display_name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="w-80 flex-shrink-0 sticky top-6">
      <div className="glass-card rounded-3xl p-5">
        {/* Section A: Profile Header */}
        <div className="text-center">
          {/* Profile Image */}
          <div
            className="relative w-20 h-20 mx-auto"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.display_name}
                className="w-full h-full rounded-full object-cover profile-ring-hover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold profile-ring-hover">
                {initials}
              </div>
            )}

            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />

            {/* Camera icon on hover */}
            {isHovering && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30">
                <Camera className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          {/* Name */}
          <h3 className="text-lg font-semibold text-slate-900 mt-3">{user?.display_name || 'Anonymous User'}</h3>

          {/* Domain badge */}
          <p className="text-xs text-slate-500 mt-0.5">{user?.domain || 'Academic Profile'}</p>

          {/* Status chip */}
          <div className="inline-flex items-center gap-1 mt-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Verified Profile
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 my-4" />

        {/* Section B: Verification Documents */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Verification Documents
          </h4>

          <UploadRow
            icon={FileText}
            label="Resume"
            status={resume ? 'uploaded' : 'pending'}
            value={resume?.filename || 'No resume uploaded'}
          />
          <UploadRow 
            icon={Award} 
            label="Certificates" 
            status={certificatesCount > 0 ? 'uploaded' : 'pending'} 
            count={certificatesCount} 
          />
          <UploadRow
            icon={Github}
            label="GitHub"
            status={github ? 'connected' : 'pending'}
            value={github?.github_url?.replace('https://github.com/', '@') || 'Not connected'}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 my-4" />

        {/* Section C: Profile Links */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Profile Links
          </h4>

          {/* Portfolio */}
          {user?.portfolio_url && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">Portfolio</span>
              </div>
              <a 
                href={user.portfolio_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-indigo-500 hover:underline"
              >
                {user.portfolio_url.replace(/^https?:\/\//, '')}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* LinkedIn */}
          {user?.linkedin_url && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">LinkedIn</span>
              </div>
              <a 
                href={user.linkedin_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-indigo-500 hover:underline"
              >
                {user.linkedin_url.split('/').pop()}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {!user?.portfolio_url && !user?.linkedin_url && (
            <p className="text-xs text-slate-400 italic">No social links added</p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 my-4" />

        {/* Section D: Location & Skills */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Location
          </h4>
          <div className="flex items-center gap-2 py-2">
            <Globe className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-700">{user?.location || 'Not specified'}</span>
          </div>

          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-4 mb-3">
            Top Skills
          </h4>
          <div className="flex flex-wrap gap-1">
            {user?.skills?.slice(0, 5).map(skill => (
              <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium">
                {skill}
              </span>
            ))}
            {!user?.skills?.length && <span className="text-xs text-slate-400 italic">No skills added</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
