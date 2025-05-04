import { Listing } from '@/types/listing';

export const mockListings: Listing[] = [
  {
    id: '1',
    itemName: 'iPhone 13 Pro Max 256GB',
    platform: 'eBay',
    buyPrice: 650,
    resalePrice: 850,
    roi: 30.77,
    listingUrl: 'https://ebay.com/iphone13',
    imageUrl: 'https://example.com/iphone.jpg',
    location: 'New York, NY',
    datePosted: '2024-03-15'
  },
  {
    id: '2',
    itemName: 'Nintendo Switch OLED',
    platform: 'Facebook Marketplace',
    buyPrice: 200,
    resalePrice: 280,
    roi: 40.00,
    listingUrl: 'https://facebook.com/switch',
    imageUrl: 'https://example.com/switch.jpg',
    location: 'Los Angeles, CA',
    datePosted: '2024-03-14'
  },
  {
    id: '3',
    itemName: 'MacBook Pro M1 16GB',
    platform: 'Craigslist',
    buyPrice: 800,
    resalePrice: 1100,
    roi: 37.50,
    listingUrl: 'https://craigslist.org/macbook',
    imageUrl: 'https://example.com/macbook.jpg',
    location: 'Chicago, IL',
    datePosted: '2024-03-13'
  },
  {
    id: '4',
    itemName: 'Air Jordan 1 Retro High',
    platform: 'OfferUp',
    buyPrice: 150,
    resalePrice: 220,
    roi: 46.67,
    listingUrl: 'https://offerup.com/jordans',
    imageUrl: 'https://example.com/jordans.jpg',
    location: 'Miami, FL',
    datePosted: '2024-03-12'
  },
  {
    id: '5',
    itemName: 'Sony WH-1000XM4',
    platform: 'Mercari',
    buyPrice: 180,
    resalePrice: 250,
    roi: 38.89,
    listingUrl: 'https://mercari.com/sony',
    imageUrl: 'https://example.com/sony.jpg',
    location: 'Seattle, WA',
    datePosted: '2024-03-11'
  },
  {
    id: '6',
    itemName: 'RTX 3080 Graphics Card',
    platform: 'Reddit',
    buyPrice: 400,
    resalePrice: 550,
    roi: 37.50,
    listingUrl: 'https://reddit.com/rtx3080',
    imageUrl: 'https://example.com/rtx3080.jpg',
    location: 'Austin, TX',
    datePosted: '2024-03-10'
  }
]; 