import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const query = req.method === 'GET' 
    ? req.query.q as string 
    : req.body?.q as string;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const response = await axios.get(
      `https://www.craigslist.org/search/sss?query=${encodeURIComponent(query)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
      }
    );

    const $ = cheerio.load(response.data);
    const results = [];

    $('.result-row').each((_, element) => {
      const $element = $(element);
      const title = $element.find('.result-title').text().trim();
      const price = $element.find('.result-price').text().trim();
      const link = $element.find('a').attr('href') || '';
      const image = $element.find('img').attr('src') || '';

      if (title) {
        results.push({
          title,
          price,
          link: link.startsWith('http') ? link : `https://www.craigslist.org${link}`,
          image,
        });
      }
    });

    return res.status(200).json({ results });
  } catch (error) {
    console.error('Error searching Craigslist:', error);
    return res.status(500).json({ 
      error: 'Failed to search Craigslist',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 