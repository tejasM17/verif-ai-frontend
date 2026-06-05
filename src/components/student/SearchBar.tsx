import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <div className="glass-card rounded-2xl px-6 py-4 mb-6 transition-shadow duration-300 focus-within:shadow-lg">
      <form onSubmit={handleSearch} className="flex items-center gap-3">
        <Search className="text-slate-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jobs, companies, roles..."
          className="bg-transparent border-none outline-none flex-1 text-slate-800 text-base placeholder:text-slate-400 font-sans"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-500 transition font-medium text-sm whitespace-nowrap"
        >
          Find Jobs
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
