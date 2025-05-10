import type { NextApiRequest, NextApiResponse } from 'next';
import { getEbayAccessToken } from '@/utils/getEbayAccessToken';
import { createRequestLogger } from '@/utils/logger';

interface SearchParams {
  keywords: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  sortOrder?: string;
  limit?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const log = createRequestLogger(req as any);
  
  if (req.method !== 'POST') {
    log.warn('Invalid request method', { method: req.method });
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const params = req.body as SearchParams;

  if (!params.keywords) {
    log.warn('Missing keywords parameter');
    return res.status(400).json({ error: 'Keywords parameter is required' });
  }

  try {
    log.info('Processing eBay search request', { params });
    
    const token = await getEbayAccessToken();
    
    // Build the eBay API URL with filters
    const url = new URL('https://api.ebay.com/buy/browse/v1/item_summary/search');
    url.searchParams.append('q', params.keywords);
    if (params.minPrice) url.searchParams.append('filter=price:[', params.minPrice.toString());
    if (params.maxPrice) url.searchParams.append('filter=price:..', params.maxPrice.toString());
    if (params.condition) url.searchParams.append('filter=conditions:', params.condition);
    if (params.sortOrder) url.searchParams.append('sort', params.sortOrder);
    if (params.limit) url.searchParams.append('limit', params.limit.toString());
    
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
      }
    });

    if (!response.ok) {
      throw new Error(`eBay API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    log.info('Search completed successfully', {
      totalItems: data.total,
      items: data.itemSummaries?.length || 0
    });

    return res.status(200).json({
      items: data.itemSummaries || [],
      total: data.total || 0
    });
  } catch (error) {
    log.error('Search request failed', error as Error, { params });

    return res.status(500).json({
      error: 'Failed to fetch eBay items',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 