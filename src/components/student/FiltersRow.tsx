import React, { useState } from 'react';

const SKILLS = ['Python', 'React', 'Machine Learning', 'Node.js', 'Data Science', 'Java', 'TypeScript'];
const ROLES = ['Frontend Dev', 'Backend Dev', 'Full Stack', 'Data Analyst', 'ML Engineer', 'DevOps'];

const FiltersRow: React.FC = () => {
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [activeRoles, setActiveRoles] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    setActiveSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleRole = (role: string) => {
    setActiveRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const clearFilters = () => {
    setActiveSkills([]);
    setActiveRoles([]);
  };

  const hasActiveFilters = activeSkills.length > 0 || activeRoles.length > 0;

  return (
    <div className="glass-card rounded-xl px-4 py-3 flex items-center justify-between overflow-x-auto no-scrollbar">
      <div className="flex items-center">
        {/* GROUP 1 — Skills */}
        <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider whitespace-nowrap">Skills</span>
          <div className="flex gap-2">
            {SKILLS.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`text-xs px-3 py-1.5 rounded-full border transition whitespace-nowrap ${
                  activeSkills.includes(skill)
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-400 font-medium'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* GROUP 2 — Roles */}
        <div className="flex items-center gap-2 pl-4">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider whitespace-nowrap">Role</span>
          <div className="flex gap-2">
            {ROLES.map(role => (
              <button
                key={role}
                onClick={() => toggleRole(role)}
                className={`text-xs px-3 py-1.5 rounded-full border transition whitespace-nowrap ${
                  activeRoles.includes(role)
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-400 font-medium'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-xs text-indigo-500 hover:text-indigo-700 font-medium whitespace-nowrap ml-4"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export default FiltersRow;
