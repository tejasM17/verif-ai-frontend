import React from 'react';
import { Clock, MapPin } from 'lucide-react';

interface JobCardProps {
  company: string;
  logo: string;
  title: string;
  location: string;
  type: string;
  skills: string[];
  salary: string;
  postedTime: string;
  index: number;
  onApply?: () => void;
}

const getAvatarColor = (company: string) => {
  const colors = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-indigo-400 to-indigo-600',
    'from-pink-400 to-pink-600',
  ];
  return colors[company.charCodeAt(0) % colors.length];
};

export function JobCard({
  company,
  title,
  location,
  type,
  skills,
  salary,
  postedTime,
  index,
  onApply,
}: JobCardProps) {
  const avatarBg = getAvatarColor(company);
  const initials = company
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-sm hover:shadow-indigo-50 transition duration-200 cursor-pointer animate-fade-slide-up animation-delay-${index * 100}`}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Row 1: Company logo, name, posted time */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${avatarBg} flex items-center justify-center text-white text-xs font-bold`}
          >
            {initials}
          </div>
          <span className="text-sm text-slate-500">{company}</span>
        </div>
        <span className="text-xs text-slate-400">{postedTime}</span>
      </div>

      {/* Row 2: Job title */}
      <h3 className="text-base font-semibold text-slate-900 mt-2">{title}</h3>

      {/* Row 3: Location and type */}
      <div className="flex items-center gap-3 mt-1">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="w-3 h-3" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="w-3 h-3" />
          <span>{type}</span>
        </div>
      </div>

      {/* Row 4: Skills tags */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Row 5: Salary and Apply button */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <span className="text-sm font-medium text-emerald-600">{salary}</span>
        <button
          onClick={onApply}
          className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-500 transition font-medium"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}
