import { useState } from 'react';
import { EbayItem } from '@/services/ebay/service';

interface EbaySearchResultsProps {
  items: EbayItem[];
  isLoading: boolean;
  error: string | null;
}

export default function EbaySearchResults({ items, isLoading, error }: EbaySearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">
        No items found. Try adjusting your search criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {items.map((item) => (
        <div
          key={item.itemId}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <a href={item.itemWebUrl} target="_blank" rel="noopener noreferrer">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={item.image.imageUrl}
                alt={item.title}
                className="object-cover w-full h-48"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.title}</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-bold">
                  {item.price.currency} {item.price.value}
                </span>
                <span className="text-sm text-gray-500">{item.condition}</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Seller: {item.seller.username}</p>
                <p>Feedback: {item.seller.feedbackPercentage}% ({item.seller.feedbackScore})</p>
              </div>
              {item.shippingOptions.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>Shipping: {item.shippingOptions[0].shippingCost.currency} {item.shippingOptions[0].shippingCost.value}</p>
                </div>
              )}
            </div>
          </a>
        </div>
      ))}
    </div>
  );
} 