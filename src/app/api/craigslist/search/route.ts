import { NextResponse } from 'next/server';
import { getListings } from '@/scrapers/craigslist';

export async function POST(request: Request) {
  try {
    const { searchQuery, minROI } = await request.json();

    if (!searchQuery || typeof minROI !== 'number') {
      return NextResponse.json(
        { error: 'Invalid search parameters' },
        { status: 400 }
      );
    }

    const listings = await getListings(searchQuery, minROI);
    return NextResponse.json({ items: listings });
  } catch (error) {
    console.error('Error searching Craigslist:', error);
    return NextResponse.json(
      { error: 'Failed to search Craigslist' },
      { status: 500 }
    );
  }
} 