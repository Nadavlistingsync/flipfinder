import { useState } from 'react';

interface FiltersProps {
  onFilterChange: (filters: {
    searchQuery: string;
    platforms: string[];
    minROI: number;
  }) => void;
}

const PLATFORMS = ['eBay', 'Facebook Marketplace', 'Craigslist', 'OfferUp', 'Mercari', 'Reddit'];

export default function Filters({ onFilterChange }: FiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [minROI, setMinROI] = useState(0);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onFilterChange({ searchQuery: value, platforms, minROI });
  };

  const handlePlatformChange = (platform: string) => {
    const newPlatforms = platforms.includes(platform)
      ? platforms.filter(p => p !== platform)
      : [...platforms, platform];
    setPlatforms(newPlatforms);
    onFilterChange({ searchQuery, platforms: newPlatforms, minROI });
  };

  const handleMinROIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setMinROI(value);
    onFilterChange({ searchQuery, platforms, minROI: value });
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Search items..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platforms
          </label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((platform) => (
              <button
                key={platform}
                onClick={() => handlePlatformChange(platform)}
                className={`px-3 py-1 rounded-full text-sm ${
                  platforms.includes(platform)
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="minROI" className="block text-sm font-medium text-gray-700">
            Minimum ROI (%)
          </label>
          <input
            type="number"
            id="minROI"
            value={minROI}
            onChange={handleMinROIChange}
            min="0"
            step="0.1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
} 