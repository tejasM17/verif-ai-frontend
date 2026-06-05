import React, { useState } from 'react';
import { 
  FileText, 
  Award, 
  Github, 
  Globe, 
  Linkedin, 
  ExternalLink, 
  Camera, 
  Briefcase, 
  GraduationCap 
} from 'lucide-react';
import UploadRow from './UploadRow';

const ProfileSidebar: React.FC = () => {
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  return (
    <aside className="w-80 flex-shrink-0 sticky top-24 h-fit">
      <div className="glass-card rounded-[32px] p-6">
        {/* SECTION A — Profile Header */}
        <div className="flex flex-col items-center">
          <div 
            className="relative w-24 h-24 profile-ring-hover cursor-pointer rounded-full"
            onMouseEnter={() => setIsHoveringAvatar(true)}
            onMouseLeave={() => setIsHoveringAvatar(false)}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-sm">
              PS
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white" />
            
            {isHoveringAvatar && (
              <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center transition-opacity duration-200">
                <Camera className="text-white w-6 h-6" />
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-4">Priya Sharma</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">B.Tech CSE • NITK 2025</p>
          
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-3 py-1 rounded-full flex items-center gap-1.5 mt-3 font-semibold uppercase tracking-wider">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Open to Work
          </div>
        </div>

        <div className="border-t border-slate-100 my-6" />

        {/* SECTION B — Upload Documents */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Verification Documents</h3>
          <div className="space-y-1">
            <UploadRow 
              icon={FileText} 
              label="Resume" 
              status="uploaded" 
              value="resume_priya.pdf" 
            />
            <UploadRow 
              icon={Award} 
              label="Certificates" 
              status="uploaded" 
              value="3 uploaded" 
            />
            <UploadRow 
              icon={Github} 
              label="GitHub" 
              status="connected" 
              value="@priya-sharma" 
            />
          </div>
        </div>

        <div className="border-t border-slate-100 my-6" />

        {/* SECTION C — Links */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Profile Links</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="text-slate-400 w-4 h-4" />
                <span className="text-sm text-slate-700 font-medium">Portfolio</span>
              </div>
              <div className="flex items-center gap-1 group cursor-pointer">
                <span className="text-xs text-indigo-500 group-hover:underline">priya.dev</span>
                <ExternalLink className="w-3 h-3 text-indigo-400" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Linkedin className="text-slate-400 w-4 h-4" />
                <span className="text-sm text-slate-700 font-medium">LinkedIn</span>
              </div>
              <div className="flex items-center gap-1 group cursor-pointer">
                <span className="text-xs text-indigo-500 group-hover:underline">in/priya</span>
                <ExternalLink className="w-3 h-3 text-indigo-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 my-6" />

        {/* SECTION D — Current Status */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Currently</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-slate-400" />
              </div>
              <span className="text-sm text-slate-700 font-medium">Working at Infosys</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-slate-400" />
              </div>
              <span className="text-sm text-slate-700 font-medium">Studying B.Tech CSE</span>
            </div>
          </div>

          <button className="w-full text-xs text-indigo-400 hover:text-indigo-600 font-medium mt-6 text-center transition-colors">
            + Edit Status
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
