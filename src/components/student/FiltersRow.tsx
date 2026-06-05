import React, { useState } from 'react';

const skillsList = ['Python', 'React', 'Machine Learning', 'Node.js', 'Data Science', 'Java', 'TypeScript'];
const rolesList = ['Frontend Dev', 'Backend Dev', 'Full Stack', 'Data Analyst', 'ML Engineer', 'DevOps'];

const FiltersRow: React.FC = () => {
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [activeRoles, setActiveRoles] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    setActiveSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleRole = (role: string) => {
    setActiveRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const clearFilters = () => {
    setActiveSkills([]);
    setActiveRoles([]);
  };

  const isFilterActive = activeSkills.length > 0 || activeRoles.length > 0;

  const Chip: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({
    label,
    isActive,
    onClick,
  }) => (
    <button
      className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ease-in-out transform hover:scale-105 ${
        isActive
          ? 'bg-indigo-50 text-indigo-700 border-indigo-400 font-medium'
          : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-indigo-300'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white rounded-2xl px-4 py-3 border border-slate-100 shadow-sm overflow-x-auto no-scrollbar flex items-center">
      {/* Group 1: Filter by Skill */}
      <div className="flex items-center flex-shrink-0">
        <span className="text-xs text-slate-400 font-medium mr-2">Skills</span>
        <div className="flex gap-2">
          {skillsList.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              isActive={activeSkills.includes(skill)}
              onClick={() => toggleSkill(skill)}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-slate-200 mx-4 flex-shrink-0"></div>

      {/* Group 2: Filter by Role */}
      <div className="flex items-center flex-shrink-0">
        <span className="text-xs text-slate-400 font-medium mr-2">Role</span>
        <div className="flex gap-2">
          {rolesList.map((role) => (
            <Chip
              key={role}
              label={role}
              isActive={activeRoles.includes(role)}
              onClick={() => toggleRole(role)}
            />
          ))}
        </div>
      </div>

      {isFilterActive && (
        <button
          className="ml-auto text-xs text-indigo-500 hover:text-indigo-700 flex-shrink-0"
          onClick={clearFilters}
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export default FiltersRow;
