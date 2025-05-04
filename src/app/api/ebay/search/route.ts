import { NextResponse } from 'next/server';
import { searchItems } from '@/services/ebay/service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { keywords, minPrice, maxPrice, condition, sortOrder, limit } = body;

    const items = await searchItems({
      keywords,
      minPrice,
      maxPrice,
      condition,
      sortOrder,
      limit,
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error in eBay search API:', error);
    return NextResponse.json(
      { error: 'Failed to search eBay items' },
      { status: 500 }
    );
  }
} 