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
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">FlipFinder</h1>
        <p className="text-center text-gray-600 mb-8">
          Find the best deals across multiple platforms for resale opportunities
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">eBay Deals</h2>
            <EbaySearchForm onSearch={handleEbaySearch} isLoading={isLoadingEbay} />
            <EbaySearchResults items={ebayItems} isLoading={isLoadingEbay} error={errorEbay} />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Craigslist Deals</h2>
            <CraigslistSearchForm onSearch={handleCraigslistSearch} isLoading={isLoadingCraigslist} />
            <CraigslistSearchResults items={craigslistItems} isLoading={isLoadingCraigslist} error={errorCraigslist} />
          </div>
        </div>
      </div>
    </main>
  );
}
