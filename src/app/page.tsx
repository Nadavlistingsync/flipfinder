'use client';

import { useState, useMemo } from 'react';
import { mockListings } from '@/data/mockListings';
import Filters from '@/components/Filters';
import ListingRow from '@/components/ListingRow';

export default function Home() {
  const [filters, setFilters] = useState({
    searchQuery: '',
    platforms: [] as string[],
    minROI: 0,
  });

  const filteredListings = useMemo(() => {
    return mockListings.filter((listing) => {
      const matchesSearch = listing.itemName
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase());
      
      const matchesPlatform = filters.platforms.length === 0 || 
        filters.platforms.includes(listing.platform);
      
      const matchesROI = listing.roi >= filters.minROI;

      return matchesSearch && matchesPlatform && matchesROI;
    });
  }, [filters]);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">FlipFinder</h1>
          <p className="mt-2 text-lg text-gray-600">
            Find the best resale deals across multiple marketplaces
          </p>
        </div>

        <Filters onFilterChange={setFilters} />

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buy Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resale Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROI
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredListings.map((listing) => (
                  <ListingRow key={listing.id} listing={listing} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
