import type { NextApiRequest, NextApiResponse } from 'next';
import { getEbayAccessToken } from '@/utils/getEbayAccessToken';
import { createRequestLogger } from '@/utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const log = createRequestLogger(req as any);
  
  if (req.method !== 'GET') {
    log.warn('Invalid request method', { method: req.method });
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, page = '1' } = req.query;

  if (!query || typeof query !== 'string') {
    log.warn('Missing or invalid query parameter', { query });
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    log.info('Processing eBay search request', { query, page });
    
    const pageNumber = parseInt(page as string, 10);
    if (isNaN(pageNumber) || pageNumber < 1) {
      log.warn('Invalid page number', { page });
      return res.status(400).json({ error: 'Invalid page number' });
    }

    const results = await searchEbayItems(query, pageNumber);
    
    log.info('Search completed successfully', {
      totalItems: results.total,
      page: pageNumber
    });

    return res.status(200).json(results);
  } catch (error) {
    log.error('Search request failed', error as Error, {
      query,
      page
    });

    return res.status(500).json({
      error: 'Failed to fetch eBay items',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 