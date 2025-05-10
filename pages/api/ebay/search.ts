import type { NextApiRequest, NextApiResponse } from 'next';
import { getEbayAccessToken } from '@/utils/getEbayAccessToken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q as string) || 'macbook';
  try {
    const token = await getEbayAccessToken();
    const url   = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(q)}&limit=12`;

    const r  = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type': 'application/json',
      },
    });
    const j = await r.json();
    res.status(200).json(j);
  } catch (err: any) {
    console.error('[eBay]', err);
    res.status(500).json({ error: 'eBay fetch failed' });
  }
} 