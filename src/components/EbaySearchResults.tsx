import Image from 'next/image';
import { EbayItem } from '@/services/ebay/service';

interface EbaySearchResultsProps {
  items: EbayItem[];
  isLoading: boolean;
  error: string | null;
}

export default function EbaySearchResults({ items, isLoading, error }: EbaySearchResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
            <div className="aspect-w-16 aspect-h-9 bg-gray-700" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-700 rounded w-1/2" />
              <div className="h-4 bg-gray-700 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">Error loading results</div>
        <div className="text-gray-400 text-sm">{error}</div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400">No items found</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item.itemId} className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <a href={item.itemWebUrl} target="_blank" rel="noopener noreferrer" className="block">
            <div className="aspect-w-16 aspect-h-9 relative">
              <Image
                src={item.image.imageUrl || '/placeholder.png'}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-white">{item.title}</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-bold text-green-400">
                  {item.price.currency} {item.price.value}
                </span>
                <span className="text-sm text-gray-400">{item.condition}</span>
              </div>
              <div className="text-sm text-gray-400">
                <p>Seller: {item.seller.username}</p>
                <p>Feedback: {item.seller.feedbackPercentage}% ({item.seller.feedbackScore})</p>
              </div>
              {item.shippingOptions.length > 0 && (
                <div className="mt-2 text-sm text-gray-400">
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