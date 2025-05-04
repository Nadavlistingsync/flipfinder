import { Listing } from '@/types/listing';
import { formatCurrency, formatPercentage } from '@/utils/roiCalc';
import Image from 'next/image';
import Link from 'next/link';

interface ListingRowProps {
  listing: Listing;
}

export default function ListingRow({ listing }: ListingRowProps) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {listing.imageUrl && (
            <div className="flex-shrink-0 h-10 w-10 relative">
              <Image
                src={listing.imageUrl}
                alt={listing.itemName}
                fill
                className="rounded-full object-cover"
              />
            </div>
          )}
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{listing.itemName}</div>
            <div className="text-sm text-gray-500">{listing.location}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          {listing.platform}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatCurrency(listing.buyPrice)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatCurrency(listing.resalePrice)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          listing.roi >= 30 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {formatPercentage(listing.roi)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link
          href={listing.listingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-900"
        >
          View
        </Link>
      </td>
    </tr>
  );
} 