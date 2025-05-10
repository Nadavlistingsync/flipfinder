import { useState } from 'react';

interface EbaySearchFormProps {
  onSearch: (params: {
    keywords: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    sortOrder?: string;
    limit?: number;
  }) => void;
  isLoading: boolean;
}

export default function EbaySearchForm({ onSearch, isLoading }: EbaySearchFormProps) {
  const [keywords, setKeywords] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [condition, setCondition] = useState('NEW');
  const [sortOrder, setSortOrder] = useState('PricePlusShippingLowest');
  const [limit, setLimit] = useState('10');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      keywords,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      condition,
      sortOrder,
      limit: parseInt(limit),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="keywords" className="block text-sm font-medium text-gray-300 mb-1">
          Search Keywords
        </label>
        <input
          type="text"
          id="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
          placeholder="Enter search terms..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-300 mb-1">
            Min Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-400">$</span>
            <input
              type="number"
              id="minPrice"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full pl-8 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-300 mb-1">
            Max Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-400">$</span>
            <input
              type="number"
              id="maxPrice"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full pl-8 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-300 mb-1">
            Condition
          </label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
          >
            <option value="NEW">New</option>
            <option value="USED">Used</option>
            <option value="OPEN_BOX">Open Box</option>
          </select>
        </div>
        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-300 mb-1">
            Sort By
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
          >
            <option value="PricePlusShippingLowest">Price: Low to High</option>
            <option value="PricePlusShippingHighest">Price: High to Low</option>
            <option value="BestMatch">Best Match</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="limit" className="block text-sm font-medium text-gray-300 mb-1">
          Number of Results
        </label>
        <input
          type="number"
          id="limit"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
          min="1"
          max="100"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
          'Search eBay'
        )}
      </button>
    </form>
  );
} 