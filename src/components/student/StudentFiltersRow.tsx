import React, { useState } from 'react';

interface FiltersRowProps {
  onSkillsChange?: (skills: string[]) => void;
  onRolesChange?: (roles: string[]) => void;
}

const SKILLS = ['Python', 'React', 'Machine Learning', 'Node.js', 'Data Science', 'Java', 'TypeScript'];
const ROLES = ['Frontend Dev', 'Backend Dev', 'Full Stack', 'Data Analyst', 'ML Engineer', 'DevOps'];

export function FiltersRow({ onSkillsChange, onRolesChange }: FiltersRowProps) {
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [activeRoles, setActiveRoles] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    const updated = activeSkills.includes(skill)
      ? activeSkills.filter((s) => s !== skill)
      : [...activeSkills, skill];
    setActiveSkills(updated);
    onSkillsChange?.(updated);
  };

  const toggleRole = (role: string) => {
    const updated = activeRoles.includes(role)
      ? activeRoles.filter((r) => r !== role)
      : [...activeRoles, role];
    setActiveRoles(updated);
    onRolesChange?.(updated);
  };

  const clearAll = () => {
    setActiveSkills([]);
    setActiveRoles([]);
    onSkillsChange?.([]);
    onRolesChange?.([]);
  };

  const hasActiveFilters = activeSkills.length > 0 || activeRoles.length > 0;

  return (
    <div className="glass-card rounded-xl px-4 py-3 mt-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-4 min-w-max">
        {/* Skills Group */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-medium text-slate-400 uppercase">Skills</span>
          <div className="flex gap-2">
            {SKILLS.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`text-xs px-3 py-1.5 rounded-full transition duration-200 font-medium ${
                  activeSkills.includes(skill)
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-400'
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:border-indigo-300'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 flex-shrink-0" />

        {/* Roles Group */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-medium text-slate-400 uppercase">Role</span>
          <div className="flex gap-2">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => toggleRole(role)}
                className={`text-xs px-3 py-1.5 rounded-full transition duration-200 font-medium ${
                  activeRoles.includes(role)
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-400'
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:border-indigo-300'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <>
            <div className="w-px h-6 bg-slate-200 flex-shrink-0" />
            <button
              onClick={clearAll}
              className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex-shrink-0 whitespace-nowrap"
            >
              Clear filters
            </button>
          </>
        )}
      </div>
    </div>
  );
}
