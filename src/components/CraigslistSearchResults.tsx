import { Listing } from '@/scrapers/craigslist';
import { formatCurrency, formatPercentage } from '@/utils/roiCalc';

interface CraigslistSearchResultsProps {
  items: Listing[];
  isLoading: boolean;
  error: string | null;
}

export default function CraigslistSearchResults({ items, isLoading, error }: CraigslistSearchResultsProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Searching for deals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No deals found matching your criteria.</p>
        <p className="text-sm text-gray-500 mt-2">Try adjusting your search terms or minimum ROI threshold.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">{item.itemName}</h3>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Buy Price:</span>{' '}
              {formatCurrency(item.buyPrice)}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Resale Price:</span>{' '}
              {formatCurrency(item.resalePrice)}
            </p>
            <p className="text-green-600 font-medium">
              <span className="font-medium">ROI:</span>{' '}
              {formatPercentage(item.roi)}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Location:</span>{' '}
              {item.location}
            </p>
            <a
              href={item.listingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              View Listing →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
} 