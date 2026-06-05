import React from 'react';
import { MapPin, Clock } from 'lucide-react';

export interface JobCardProps {
  company: string;
  logoColor: string;
  logoInitials: string;
  title: string;
  location: string;
  type: string;
  postedAt: string;
  skills: string[];
  salary: string;
  animationDelayClass: string;
}

const JobCard: React.FC<JobCardProps> = ({
  company,
  logoColor,
  logoInitials,
  title,
  location,
  type,
  postedAt,
  skills,
  salary,
  animationDelayClass,
}) => {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-sm hover:shadow-indigo-50 transition duration-200 cursor-pointer animate-fade-slide-up opacity-0 ${animationDelayClass}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${logoColor}`}>
            {logoInitials}
          </div>
          <span className="text-sm text-slate-500">{company}</span>
        </div>
        <span className="text-xs text-slate-400">{postedAt}</span>
      </div>

      <h3 className="text-base font-semibold text-slate-900 mt-3">{title}</h3>
      
      <div className="flex gap-3 mt-1">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="w-3 h-3" />
          {location}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="w-3 h-3" />
          {type}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {skills.map((skill) => (
          <span
            key={skill}
            className="bg-slate-100 text-slate-600 text-[10px] px-2.5 py-1 rounded-full border border-slate-200"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center mt-5">
        <span className="text-sm font-medium text-emerald-600">{salary}</span>
        <button className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition font-medium">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobCard;
