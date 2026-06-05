import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export function StudentSearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    onSearch?.(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      className={`glass-card rounded-2xl px-6 py-4 transition-all duration-200 ${
        isFocused ? 'shadow-lg shadow-indigo-100' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search jobs, companies, roles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-base"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-500 transition font-medium text-sm flex-shrink-0"
        >
          Find Jobs
        </button>
      </div>
    </div>
  );
}
