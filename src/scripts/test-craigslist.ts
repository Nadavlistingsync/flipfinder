import { getListings } from '../scrapers/craigslist';
import { formatCurrency, formatPercentage } from '../utils/roiCalc';

async function testCraigslistScraper() {
  console.log('Testing Craigslist scraper...\n');
  
  const searchQuery = 'iphone';
  const minROI = 10;
  
  console.log(`Searching for "${searchQuery}" with minimum ROI of ${minROI}%...\n`);
  
  try {
    const listings = await getListings(searchQuery, minROI);
    
    if (listings.length === 0) {
      console.log('No listings found. This could be due to:');
      console.log('1. No matching items in the searched cities');
      console.log('2. Craigslist blocking our requests');
      console.log('3. Network issues');
      console.log('\nTry adjusting the search query or minimum ROI.');
      return;
    }
    
    console.log(`Found ${listings.length} listings with ROI >= ${minROI}%:\n`);
    
    listings.forEach((listing, index) => {
      console.log(`Listing ${index + 1}:`);
      console.log(`Title: ${listing.itemName}`);
      console.log(`Location: ${listing.location}`);
      console.log(`Buy Price: ${formatCurrency(listing.buyPrice)}`);
      console.log(`Resale Price: ${formatCurrency(listing.resalePrice)}`);
      console.log(`ROI: ${formatPercentage(listing.roi)}`);
      console.log(`URL: ${listing.listingUrl}`);
      console.log('----------------------------------------');
    });
    
  } catch (error) {
    console.error('Error during test:', error);
  }
}

// Run the test
testCraigslistScraper(); 