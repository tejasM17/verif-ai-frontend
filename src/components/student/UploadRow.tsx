import React from 'react';
import { FileText, Award, Github, CheckCircle2, ExternalLink } from 'lucide-react';

interface UploadRowProps {
  icon: 'resume' | 'certificate' | 'github';
  label: string;
  status: 'uploaded' | 'connected' | 'empty';
  value?: string; // e.g., filename for resume, username for github
}

const getIcon = (iconType: UploadRowProps['icon']) => {
  const iconClasses = 'w-4 h-4 text-indigo-400';
  switch (iconType) {
    case 'resume':
      return <FileText className={iconClasses} />;
    case 'certificate':
      return <Award className={iconClasses} />;
    case 'github':
      return <Github className={iconClasses} />;
    default:
      return null;
  }
};

const UploadRow: React.FC<UploadRowProps> = ({ icon, label, status, value }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        {getIcon(icon)}
        <span className="text-sm text-slate-700 font-medium">{label}</span>
      </div>
      <div>
        {status === 'empty' && (
          <button className="text-xs text-indigo-500 border border-dashed border-indigo-300 px-2.5 py-1 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition">
            {icon === 'github' ? 'Connect' : 'Upload PDF'}
          </button>
        )}
        {(status === 'uploaded' || status === 'connected') && value && (
          <div className="flex items-center gap-1">
            {status === 'uploaded' && (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span className="text-xs text-slate-400">{value}</span>
                {/* Edit icon can be added here if needed */}
              </>
            )}
            {status === 'connected' && icon === 'github' && (
              <>
                <a href={`https://github.com/${value}`} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-500 hover:underline cursor-pointer flex items-center gap-1">
                  @{value}
                  <ExternalLink className="w-3 h-3" />
                </a>
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              </>
            )}
            {status === 'connected' && icon === 'certificate' && (
              <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
                {value}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadRow;
