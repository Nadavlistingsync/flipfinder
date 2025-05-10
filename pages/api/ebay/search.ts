import { NextApiRequest, NextApiResponse } from 'next';
import { getEbayAccessToken } from '../../../utils/getEbayAccessToken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get query from either query params or request body
  const query = req.method === 'GET' 
    ? req.query.q as string 
    : req.body?.q as string;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const accessToken = await getEbayAccessToken();
    
    // Log the request details for debugging
    console.log('Making eBay API request:', {
      query,
      method: req.method,
      hasToken: !!accessToken
    });
    
    const response = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=50`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('eBay API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`eBay API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error searching eBay:', error);
    return res.status(500).json({ 
      error: 'Failed to search eBay',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 