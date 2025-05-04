import { useState } from 'react';

interface CraigslistSearchFormProps {
  onSearch: (params: { searchQuery: string; minROI: number }) => void;
  isLoading: boolean;
}

export default function CraigslistSearchForm({ onSearch, isLoading }: CraigslistSearchFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [minROI, setMinROI] = useState(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ searchQuery, minROI });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
      <div className="flex flex-col space-y-4">
        <div>
          <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
            Search Query
          </label>
          <input
            type="text"
            id="searchQuery"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter search terms..."
            required
          />
        </div>
        
        <div>
          <label htmlFor="minROI" className="block text-sm font-medium text-gray-700 mb-1">
            Minimum ROI (%)
          </label>
          <input
            type="number"
            id="minROI"
            value={minROI}
            onChange={(e) => setMinROI(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            min="0"
            max="1000"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Searching...' : 'Search Craigslist'}
        </button>
      </div>
    </form>
  );
} 