import { useState } from 'react';

interface CraigslistSearchFormProps {
  onSearch: (params: {
    searchQuery: string;
    minROI: number;
  }) => void;
  isLoading: boolean;
}

export default function CraigslistSearchForm({ onSearch, isLoading }: CraigslistSearchFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [minROI, setMinROI] = useState('30');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      searchQuery,
      minROI: parseFloat(minROI),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-300 mb-1">
          Search Keywords
        </label>
        <input
          type="text"
          id="searchQuery"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
          placeholder="Enter search terms..."
          required
        />
      </div>

      <div>
        <label htmlFor="minROI" className="block text-sm font-medium text-gray-300 mb-1">
          Minimum ROI (%)
        </label>
        <div className="relative">
          <input
            type="number"
            id="minROI"
            value={minROI}
            onChange={(e) => setMinROI(e.target.value)}
            className="w-full pl-8 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
            min="0"
            max="1000"
            step="1"
          />
          <span className="absolute right-3 top-2 text-gray-400">%</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Searching...
          </>
        ) : (
          'Search Craigslist'
        )}
      </button>
    </form>
  );
} 