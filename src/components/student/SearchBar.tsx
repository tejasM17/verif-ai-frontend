import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(query);
  };

  return (
    <div
      className={`bg-white rounded-2xl px-6 py-4 flex items-center gap-3 transition-shadow duration-200 border border-slate-100 ${
        isFocused ? 'shadow-lg shadow-indigo-100/50' : 'shadow-sm'
      }`}
    >
      <Search className="w-5 h-5 text-slate-400" />
      <input
        type="text"
        placeholder="Search jobs, companies, roles..."
        className="flex-1 bg-transparent border-none outline-none text-base text-slate-800"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <button
        className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-500 transition font-medium text-sm"
        onClick={handleSearchClick}
      >
        Find Jobs
      </button>
    </div>
  );
};

export default SearchBar;
