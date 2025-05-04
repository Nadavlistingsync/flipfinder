// ✅ Official API (eBay Buy API)

import axios from 'axios';
import { Listing } from '@/types/listing';
import { calculateROI } from '@/utils/roiCalc';

const EBAY_API_BASE_URL = 'https://api.ebay.com/buy/browse/v1';

interface EbayItemSummary {
  itemId: string;
  title: string;
  price: {
    value: string;
    currency: string;
  };
  itemWebUrl: string;
  image?: {
    imageUrl: string;
  };
  seller?: {
    username: string;
    feedbackPercentage: string;
  };
  condition?: string;
  location?: {
    country: string;
    postalCode: string;
  };
}

/**
 * Fetches listings from eBay using the eBay Buy API
 * @param searchQuery - The search term to look for
 * @param minROI - Minimum ROI percentage to filter results
 * @returns Promise<Listing[]> - Array of listings matching the criteria
 */
export async function getListings(searchQuery: string, minROI: number): Promise<Listing[]> {
  const bearerToken = process.env.EBAY_BEARER_TOKEN;
  
  if (!bearerToken) {
    console.error('EBAY_BEARER_TOKEN is not set in environment variables');
    return [];
  }

  try {
    const response = await axios.get(`${EBAY_API_BASE_URL}/item_summary/search`, {
      params: {
        q: searchQuery,
        limit: 10,
        filter: 'price:[0..10000]', // Filter out items with no price or extremely high prices
      },
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US', // US marketplace
      },
    });

    const items: EbayItemSummary[] = response.data.itemSummaries || [];
    
    return items
      .map(item => {
        const buyPrice = parseFloat(item.price.value);
        const resalePrice = buyPrice * 1.5; // Estimate resale price at 50% markup
        const roi = calculateROI(buyPrice, resalePrice);

        return {
          id: item.itemId,
          itemName: item.title,
          platform: 'eBay',
          buyPrice,
          resalePrice,
          roi,
          listingUrl: item.itemWebUrl,
          imageUrl: item.image?.imageUrl,
          location: item.location ? `${item.location.postalCode}, ${item.location.country}` : undefined,
        };
      })
      .filter(listing => listing.roi >= minROI);
  } catch (error) {
    console.error('Error fetching eBay listings:', error);
    return [];
  }
} 