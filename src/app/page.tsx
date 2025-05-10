'use client';

import { useState } from 'react';
import EbaySearchForm from '@/components/EbaySearchForm';
import EbaySearchResults from '@/components/EbaySearchResults';
import CraigslistSearchForm from '@/components/CraigslistSearchForm';
import CraigslistSearchResults from '@/components/CraigslistSearchResults';
import { EbayItem } from '@/services/ebay/service';
import { Listing } from '@/scrapers/craigslist';

export default function Home() {
  const [ebayItems, setEbayItems] = useState<EbayItem[]>([]);
  const [craigslistItems, setCraigslistItems] = useState<Listing[]>([]);
  const [isLoadingEbay, setIsLoadingEbay] = useState(false);
  const [isLoadingCraigslist, setIsLoadingCraigslist] = useState(false);
  const [errorEbay, setErrorEbay] = useState<string | null>(null);
  const [errorCraigslist, setErrorCraigslist] = useState<string | null>(null);

  const handleEbaySearch = async (params: {
    keywords: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    sortOrder?: string;
    limit?: number;
  }) => {
    setIsLoadingEbay(true);
    setErrorEbay(null);

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
      setErrorEbay(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoadingEbay(false);
    }
  };

  const handleCraigslistSearch = async (params: {
    searchQuery: string;
    minROI: number;
  }) => {
    setIsLoadingCraigslist(true);
    setErrorCraigslist(null);

    try {
      const response = await fetch('/api/craigslist/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to search Craigslist items');
      }

      const data = await response.json();
      setCraigslistItems(data.items);
    } catch (err) {
      setErrorCraigslist(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoadingCraigslist(false);
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
            Find the best deals across multiple platforms for resale opportunities
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-blue-400 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              eBay Deals
            </h2>
            <EbaySearchForm onSearch={handleEbaySearch} isLoading={isLoadingEbay} />
            <div className="mt-6">
              <EbaySearchResults items={ebayItems} isLoading={isLoadingEbay} error={errorEbay} />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-purple-400 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Craigslist Deals
            </h2>
            <CraigslistSearchForm onSearch={handleCraigslistSearch} isLoading={isLoadingCraigslist} />
            <div className="mt-6">
              <CraigslistSearchResults items={craigslistItems} isLoading={isLoadingCraigslist} error={errorCraigslist} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
