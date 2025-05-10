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
    
    // Log environment check
    console.log('Environment check:', {
      hasAppId: !!process.env.EBAY_PROD_APP_ID,
      hasCertId: !!process.env.EBAY_PROD_CERT_ID,
      nodeEnv: process.env.NODE_ENV
    });

    const accessToken = await getEbayAccessToken();
    console.log('Successfully obtained access token');

    const headers = {
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      'X-EBAY-C-ENDUSER-CONTEXT': 'contextualLocation=country=US',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    console.log('Making request to eBay API:', { url, headers: { ...headers, Authorization: 'Bearer [REDACTED]' } });

    const ebayRes = await fetch(url, { headers });

    if (!ebayRes.ok) {
      const errorText = await ebayRes.text();
      console.error('eBay API error response:', {
        status: ebayRes.status,
        statusText: ebayRes.statusText,
        error: errorText
      });
      throw new Error(`eBay API error: ${ebayRes.status} ${ebayRes.statusText} - ${errorText}`);
    }

    const data = await ebayRes.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in eBay search:', error);
    return res.status(500).json({ 
      error: error.message,
      details: error.stack
    });
  }
} 