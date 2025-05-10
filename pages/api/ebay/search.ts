import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : 'macbook';
    const url = `https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(q)}&limit=5`;

    const headers: Record<string, string> = {
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      'X-EBAY-C-ENDUSER-CONTEXT': 'contextualLocation=country=US',
      'Content-Type': 'application/json',
    };

    // Optional: Add Bearer token if available
    const bearerToken = process.env.EBAY_SANDBOX_BEARER_TOKEN;
    if (bearerToken) {
      headers['Authorization'] = `Bearer ${bearerToken}`;
    }

    const ebayRes = await fetch(url, { headers });
    if (!ebayRes.ok) {
      throw new Error(`eBay API error: ${ebayRes.statusText}`);
    }
    const data = await ebayRes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in eBay search:', error);
    res.status(500).json({ error: 'Failed to fetch eBay search results' });
  }
} 