import React from 'react';
import { LucideIcon, Check, Edit2 } from 'lucide-react';

interface UploadRowProps {
  icon: LucideIcon;
  label: string;
  status: 'uploaded' | 'connected' | 'empty';
  value?: string;
}

const UploadRow: React.FC<UploadRowProps> = ({ icon: Icon, label, status, value }) => {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2">
        <Icon className="text-indigo-400 w-4 h-4" />
        <span className="text-sm text-slate-700 font-medium">{label}</span>
      </div>

      {status === 'empty' ? (
        <button className="text-[10px] text-indigo-500 border border-dashed border-indigo-300 px-2.5 py-1 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition font-medium">
          Upload PDF
        </button>
      ) : (
        <div className="flex items-center gap-2">
          {status === 'uploaded' ? (
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] text-slate-400 max-w-[80px] truncate">{value}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-indigo-500 font-medium">{value}</span>
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            </div>
          )}
          <button className="text-slate-300 hover:text-indigo-500 transition">
            <Edit2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadRow;
