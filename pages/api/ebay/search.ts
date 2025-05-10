import { NextApiRequest, NextApiResponse } from 'next';
import { getEbayAccessToken } from '../../../src/utils/getEbayAccessToken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const query = req.query.q as string || req.body.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const limit = parseInt(req.query.limit as string) || 5;
    const accessToken = await getEbayAccessToken();

    const headers = {
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      'X-EBAY-C-ENDUSER-CONTEXT': 'contextualLocation=country=US',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    console.log('Making request to eBay API with headers:', headers);
    
    const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    console.log('URL:', url);

    const ebayRes = await fetch(url, { headers });

    if (!ebayRes.ok) {
      const errorText = await ebayRes.text();
      console.error('eBay API error response:', errorText);
      throw new Error(`eBay API error: ${ebayRes.statusText} - ${errorText}`);
    }

    const data = await ebayRes.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in eBay search:', error);
    return res.status(500).json({ error: error.message });
  }
} 