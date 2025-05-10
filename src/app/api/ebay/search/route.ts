import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'iphone';

    const headers = {
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      'X-EBAY-C-ENDUSER-CONTEXT': 'contextualLocation=country=US',
      'Content-Type': 'application/json',
    };

    // Add Bearer token if available
    const bearerToken = process.env.EBAY_SANDBOX_BEARER_TOKEN;
    if (bearerToken) {
      headers['Authorization'] = `Bearer ${bearerToken}`;
    }

    const response = await fetch(
      `https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}`,
      {
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`eBay API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in eBay search:', error);
    return NextResponse.json(
      { error: 'Failed to fetch eBay search results' },
      { status: 500 }
    );
  }
} 