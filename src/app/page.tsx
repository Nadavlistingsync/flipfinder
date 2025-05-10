'use client';

import { useState } from 'react';
import EbaySearchForm from '@/components/EbaySearchForm';
import EbaySearchResults from '@/components/EbaySearchResults';

type EbayItem = any; // quick placeholder

export default function Home() {
  const [ebayItems, setEbayItems] = useState<EbayItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (params: {
    keywords: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    sortOrder?: string;
    limit?: number;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ebay/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to search eBay items');
      }

      const data = await response.json();
      setEbayItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            FlipFinder
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find the best deals on eBay for resale opportunities
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-blue-400 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              eBay Deals
            </h2>
            <EbaySearchForm onSearch={handleSearch} isLoading={isLoading} />
            <div className="mt-6">
              <EbaySearchResults items={ebayItems} isLoading={isLoading} error={error} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
