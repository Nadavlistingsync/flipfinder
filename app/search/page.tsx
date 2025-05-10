'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDebounce } from 'use-debounce';

interface EbayItem {
  itemId: string;
  title: string;
  price: {
    value: string;
    currency: string;
  };
  image: {
    imageUrl: string;
  };
  condition: string;
  itemWebUrl: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('macbook');
  const [debouncedQuery] = useDebounce(query, 500);
  const [items, setItems] = useState<EbayItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function searchItems() {
      if (!debouncedQuery) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/ebay/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
        const data = await response.json();
        setItems(data.itemSummaries || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    searchItems();
  }, [debouncedQuery]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">eBay Search</h1>
          <div className="max-w-xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for items..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <a
              key={item.itemId}
              href={item.itemWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              <div className="relative h-48 w-full">
                {item.image?.imageUrl ? (
                  <Image
                    src={item.image.imageUrl}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xl font-bold text-blue-600 mb-2">
                  {item.price.currency} {item.price.value}
                </p>
                <p className="text-sm text-gray-600">
                  Condition: {item.condition}
                </p>
              </div>
            </a>
          ))}
        </div>

        {!loading && !error && items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No items found. Try a different search term.
          </div>
        )}
      </div>
    </div>
  );
} 