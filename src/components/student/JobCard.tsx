import React from 'react';
import { MapPin, Clock, ExternalLink } from 'lucide-react';

interface JobCardProps {
  companyLogoInitials: string;
  companyName: string;
  timeAgo: string;
  jobTitle: string;
  location: string;
  jobType: string;
  skills: string[];
  salaryRange: string;
  animationDelay?: string;
  logoColor?: string;
}

const JobCard: React.FC<JobCardProps> = ({
  companyLogoInitials,
  companyName,
  timeAgo,
  jobTitle,
  location,
  jobType,
  skills,
  salaryRange,
  animationDelay = '0ms',
  logoColor = 'bg-blue-500',
}) => {
  return (
    <div
      className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50/60 transition-all duration-200 cursor-pointer animate-fade-slide-up"
      style={{ animationDelay }}
    >
      {/* Top row: company + time */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-10 h-10 rounded-xl ${logoColor} flex items-center justify-center text-white font-bold text-sm shadow-sm`}
          >
            {companyLogoInitials}
          </div>
          <span className="text-sm font-medium text-slate-600">{companyName}</span>
        </div>
        <span className="text-xs text-slate-400">{timeAgo}</span>
      </div>

      {/* Job title */}
      <h3 className="text-base font-bold text-slate-900 mt-3 group-hover:text-indigo-700 transition-colors">
        {jobTitle}
      </h3>

      {/* Location + type */}
      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1.5">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{jobType}</span>
        </div>
      </div>

      {/* Skill tags */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full border border-slate-200"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Salary + Apply */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <span className="text-sm font-semibold text-emerald-600">{salaryRange}</span>
        <button className="flex items-center gap-1.5 text-xs bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-500 active:scale-95 transition-all font-medium shadow-sm shadow-indigo-200">
          Apply Now
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default JobCard;
