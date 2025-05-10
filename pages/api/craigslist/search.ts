import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer-core';

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
    // Use Chrome AWS Lambda for Vercel environment
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.CHROME_EXECUTABLE_PATH || '/usr/bin/google-chrome',
      headless: 'new'
    });

    const page = await browser.newPage();
    await page.goto(`https://www.craigslist.org/search/sss?query=${encodeURIComponent(query)}`);
    
    // Wait for results to load
    await page.waitForSelector('.result-row', { timeout: 5000 });

    const results = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.result-row'));
      return items.map(item => {
        const titleElement = item.querySelector('.result-title');
        const priceElement = item.querySelector('.result-price');
        const linkElement = item.querySelector('a');
        const imageElement = item.querySelector('img');

        return {
          title: titleElement?.textContent?.trim() || '',
          price: priceElement?.textContent?.trim() || '',
          link: linkElement?.href || '',
          image: imageElement?.src || '',
        };
      });
    });

    await browser.close();
    return res.status(200).json({ results });
  } catch (error) {
    console.error('Error searching Craigslist:', error);
    return res.status(500).json({ 
      error: 'Failed to search Craigslist',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 