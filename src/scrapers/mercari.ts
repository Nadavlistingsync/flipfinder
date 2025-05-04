import { Listing } from '@/types/listing';

/**
 * Scrapes listings from Mercari using Puppeteer
 * @param searchQuery - The search term to look for
 * @param minROI - Minimum ROI percentage to filter results
 * @returns Promise<Listing[]> - Array of listings matching the criteria
 */
export async function getListings(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchQuery: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  minROI: number
): Promise<Listing[]> {
  // TODO: Implement Mercari scraping using Puppeteer
  // Note: Be mindful of rate limiting and terms of service
  return [];
} 