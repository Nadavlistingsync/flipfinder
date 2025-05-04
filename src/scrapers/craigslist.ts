// ✅ Scraper for Craigslist search listings
// ⚠️ This uses static HTML scraping with cheerio

import puppeteer from 'puppeteer';
import { calculateROI } from '../utils/roiCalc';

export interface Listing {
  id: string;
  itemName: string;
  platform: string;
  buyPrice: number;
  resalePrice: number;
  roi: number;
  listingUrl: string;
  location: string;
}

interface ScrapedItem {
  id: string;
  title: string;
  price: string;
  link: string;
  location: string;
}

const CRAIGSLIST_LOCATIONS = [
  'newyork',
  'losangeles',
  'chicago',
  'houston',
  'phoenix',
  'philadelphia',
  'sanantonio',
  'sandiego',
  'dallas',
  'sanfrancisco'
];

/**
 * Scrapes listings from Craigslist using Puppeteer
 * @param searchQuery - The search term to look for
 * @param minROI - Minimum ROI percentage to filter results
 * @returns Promise<Listing[]> - Array of listings matching the criteria
 */
export async function getListings(searchQuery: string, minROI: number): Promise<Listing[]> {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const allListings: Listing[] = [];

  try {
    const page = await browser.newPage();
    
    // Set a reasonable viewport
    await page.setViewport({ width: 1280, height: 800 });

    // Set a user agent to look more like a real browser
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    
    // Search across multiple locations
    for (const location of CRAIGSLIST_LOCATIONS) {
      console.log(`\nSearching in ${location}...`);
      const url = `https://${location}.craigslist.org/search/sss?query=${encodeURIComponent(searchQuery)}&sort=date`;
      console.log(`URL: ${url}`);
      
      try {
        // Navigate to the page
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        
        // Wait for the results to load
        await page.waitForSelector('.rows > .cl-static-search-result, .rows > .gallery-card', { timeout: 10000 })
          .catch(() => console.log('Timeout waiting for results - continuing anyway'));

        // Take a screenshot for debugging
        await page.screenshot({ path: `debug-${location}.png` });
        
        // Get all listings
        const listings = await page.evaluate(() => {
          const items: ScrapedItem[] = [];
          
          // Try different selectors for the new Craigslist layout
          document.querySelectorAll('.rows > .cl-static-search-result, .rows > .gallery-card').forEach((el) => {
            const titleEl = el.querySelector('h3, .title');
            const priceEl = el.querySelector('.price, .priceinfo');
            const linkEl = el.querySelector('a.posting-title, a.titlestring');
            const locationEl = el.querySelector('.meta .location');
            
            if (titleEl && priceEl) {
              items.push({
                id: el.id || '',
                title: titleEl.textContent?.trim() || '',
                price: priceEl.textContent?.trim() || '',
                link: linkEl?.getAttribute('href') || '',
                location: locationEl?.textContent?.trim() || ''
              });
            }
          });
          
          return items;
        });
        
        console.log(`Found ${listings.length} results in ${location}`);
        
        // Process each listing
        for (const item of listings) {
          console.log(`\nProcessing listing: "${item.title}"`);
          console.log(`Price text: ${item.price}`);
          
          // Extract price from text (e.g., "$100" -> 100)
          const buyPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
          console.log(`Extracted buy price: ${buyPrice}`);
          
          // Skip if no price found
          if (buyPrice <= 0) {
            console.log('Skipping - no valid price');
            continue;
          }
          
          // Calculate resale price (1.5x buy price)
          const resalePrice = buyPrice * 1.5;
          
          // Calculate ROI
          const roi = calculateROI(buyPrice, resalePrice);
          console.log(`Calculated ROI: ${roi}%`);

          // Only include listings that meet the minimum ROI threshold
          if (roi >= minROI) {
            console.log('Adding to results - meets ROI threshold');
            allListings.push({
              id: item.id,
              itemName: item.title,
              platform: 'Craigslist',
              buyPrice,
              resalePrice,
              roi,
              listingUrl: item.link.startsWith('http') ? item.link : `https://${location}.craigslist.org${item.link}`,
              location: item.location || location
            });
          } else {
            console.log('Skipping - below ROI threshold');
          }
        }
      } catch (error) {
        console.error(`Error processing ${location}:`, error);
      }

      // Add a small delay between locations
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Sort by ROI in descending order
    return allListings.sort((a, b) => b.roi - a.roi);
  } catch (error) {
    console.error('Error scraping Craigslist:', error);
    return [];
  } finally {
    await browser.close();
  }
} 