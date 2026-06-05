import React, { useState } from 'react';
import { Camera, Briefcase, GraduationCap, Globe, Linkedin, ExternalLink } from 'lucide-react';
import UploadRow from './UploadRow';
import { useAuthStore } from '../../store/authStore';

const ProfileSidebar: React.FC = () => {
  const [isHoveringProfile, setIsHoveringProfile] = useState(false);
  const { user } = useAuthStore();

  const getInitials = () => {
    if (user?.display_name) {
      return user.display_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="w-80 flex-shrink-0 sticky top-6">
      <div className="glass-card rounded-3xl p-5 border border-slate-200 bg-white">
        {/* SECTION A — Profile Header */}
        <div className="text-center">
          <div
            className="relative w-20 h-20 mx-auto rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md profile-ring-hover cursor-pointer transition-transform hover:scale-105"
            onMouseEnter={() => setIsHoveringProfile(true)}
            onMouseLeave={() => setIsHoveringProfile(false)}
          >
            <span className="text-2xl font-bold text-white tracking-wide">{getInitials()}</span>
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white"></div>
            {isHoveringProfile && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] transition-all">
                <Camera className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-800 mt-3 truncate px-2">
            {user?.display_name || user?.email?.split('@')[0] || 'Student User'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 truncate px-2">{user?.email || 'Student'}</p>
          <div className="inline-flex items-center gap-1.5 mt-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>Open to Work</span>
          </div>
        </div>

        <div className="border-t border-slate-100 my-4"></div>

        {/* SECTION B — Upload Documents */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Verification Documents
          </h4>
          <UploadRow icon="resume" label="Resume" status="uploaded" value="resume_priya.pdf" />
          <UploadRow icon="certificate" label="Certificates" status="connected" value="3 uploaded" />
          <UploadRow icon="github" label="GitHub" status="connected" value="priya-sharma" />
        </div>

        <div className="border-t border-slate-100 my-4"></div>

        {/* SECTION C — Links */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Profile Links
          </h4>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700">Portfolio</span>
            </div>
            <a href="#" className="text-xs text-indigo-500 hover:underline cursor-pointer flex items-center gap-1">
              priya.dev <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700">LinkedIn</span>
            </div>
            <a href="#" className="text-xs text-indigo-500 hover:underline cursor-pointer flex items-center gap-1">
              linkedin.com/in/priya <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="border-t border-slate-100 my-4"></div>

        {/* SECTION D — Current Status */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Currently
          </h4>
          <div className="flex items-center gap-2 py-1">
            <Briefcase className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-700">Working at Infosys</span>
          </div>
          <div className="flex items-center gap-2 py-1">
            <GraduationCap className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-700">Studying B.Tech CSE</span>
          </div>
          <button className="text-xs text-indigo-400 hover:text-indigo-600 mt-1">
            + Edit Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
