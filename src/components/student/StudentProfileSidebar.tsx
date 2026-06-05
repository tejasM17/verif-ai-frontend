import React, { useState } from 'react';
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

export function StudentProfileSidebar() {
  const [isHovering, setIsHovering] = useState(false);

  const mockProfileData = {
    name: 'Priya Sharma',
    education: 'B.Tech CSE • NITK 2025',
    status: 'Open to Work',
    resume: 'resume_priya.pdf',
    certificates: 3,
    github: '@priya-sharma',
    portfolio: 'priya.dev',
    linkedin: 'linkedin.com/in/priya',
    work: 'Working at Infosys',
    studying: 'Studying B.Tech CSE',
  };

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
            <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold profile-ring-hover">
              PS
            </div>

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
          <h3 className="text-lg font-semibold text-slate-900 mt-3">{mockProfileData.name}</h3>

          {/* Education badge */}
          <p className="text-xs text-slate-500 mt-0.5">{mockProfileData.education}</p>

          {/* Status chip */}
          <div className="inline-flex items-center gap-1 mt-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            {mockProfileData.status}
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
            status="uploaded"
            value={mockProfileData.resume}
          />
          <UploadRow icon={Award} label="Certificates" status="uploaded" count={mockProfileData.certificates} />
          <UploadRow
            icon={Github}
            label="GitHub"
            status="connected"
            value={mockProfileData.github}
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
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">Portfolio</span>
            </div>
            <a href="#" className="flex items-center gap-1 text-xs text-indigo-500 hover:underline">
              {mockProfileData.portfolio}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* LinkedIn */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">LinkedIn</span>
            </div>
            <a href="#" className="flex items-center gap-1 text-xs text-indigo-500 hover:underline">
              {mockProfileData.linkedin}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 my-4" />

        {/* Section D: Current Status */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Currently
          </h4>

          <div className="flex items-center gap-2 py-2">
            <Briefcase className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-700">{mockProfileData.work}</span>
          </div>

          <div className="flex items-center gap-2 py-2">
            <GraduationCap className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-700">{mockProfileData.studying}</span>
          </div>

          <button className="text-xs text-indigo-400 hover:text-indigo-600 mt-1 flex items-center gap-1">
            <Plus className="w-3 h-3" />
            Edit Status
          </button>
        </div>
      </div>
    </div>
  );
}
