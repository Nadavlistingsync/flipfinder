import { ebay } from './config';

export interface EbaySearchParams {
  keywords: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  sortOrder?: 'PricePlusShippingLowest' | 'PricePlusShippingHighest' | 'BestMatch';
  limit?: number;
}

export interface EbayItem {
  itemId: string;
  title: string;
  price: {
    value: string;
    currency: string;
  };
  image: {
    imageUrl: string;
  };
  condition: string;
  itemWebUrl: string;
  seller: {
    username: string;
    feedbackPercentage: string;
    feedbackScore: number;
  };
  shippingOptions: {
    shippingCost: {
      value: string;
      currency: string;
    };
  }[];
}

interface EbayApiItemSummary {
  itemId: string;
  title: string;
  price: {
    value: string;
    currency: string;
  };
  image?: {
    imageUrl: string;
  };
  condition: string;
  itemWebUrl: string;
  seller: {
    username: string;
    feedbackPercentage: string;
    feedbackScore: number;
  };
  shippingOptions?: Array<{
    shippingCost: {
      value: string;
      currency: string;
    };
  }>;
}

interface EbayApiShippingOption {
  shippingCost: {
    value: string;
    currency: string;
  };
}

// Error handling and logging
class EbayServiceError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'EbayServiceError';
  }
}

// Performance monitoring
const performanceMetrics = {
  requests: 0,
  errors: 0,
  averageResponseTime: 0,
};

// Automatic feedback system
const feedbackSystem = {
  logError: (error: any, context: string) => {
    console.error(`[EbayService] ${context}:`, error);
    performanceMetrics.errors++;
    
    // Send error to monitoring service (implement your preferred service)
    if (process.env.NODE_ENV === 'production') {
      // Example: sendToMonitoringService(error, context);
    }
  },

  logPerformance: (startTime: number) => {
    const duration = Date.now() - startTime;
    performanceMetrics.requests++;
    performanceMetrics.averageResponseTime = 
      (performanceMetrics.averageResponseTime * (performanceMetrics.requests - 1) + duration) / 
      performanceMetrics.requests;
  },
};

export const searchItems = async (params: EbaySearchParams): Promise<EbayItem[]> => {
  const startTime = Date.now();
  
  try {
    // Input validation
    if (!params.keywords?.trim()) {
      throw new EbayServiceError('Search keywords are required');
    }

    // Prepare search parameters
    const searchParams = {
      q: params.keywords,
      category_ids: params.categoryId,
      filter: [
        params.minPrice ? `price:[${params.minPrice}..]` : null,
        params.maxPrice ? `price:[..${params.maxPrice}]` : null,
        params.condition ? `condition:${params.condition}` : null,
      ].filter(Boolean).join(','),
      sort: params.sortOrder || 'BestMatch',
      limit: String(params.limit || 50),
    };

    // Log search request
    console.log('[EbayService] Search request:', searchParams);

    // Make API request
    const response = await ebay.buy.browse.search(searchParams);

    // Log performance
    feedbackSystem.logPerformance(startTime);

    // Transform and validate response
    if (!response.itemSummaries) {
      throw new EbayServiceError('Invalid response format from eBay API');
    }

    return response.itemSummaries.map((item: any) => ({
      itemId: item.itemId,
      title: item.title,
      price: {
        value: item.price.value,
        currency: item.price.currency,
      },
      image: {
        imageUrl: item.image?.imageUrl || '',
      },
      condition: item.condition,
      itemWebUrl: item.itemWebUrl,
      seller: {
        username: item.seller.username,
        feedbackPercentage: item.seller.feedbackPercentage,
        feedbackScore: item.seller.feedbackScore,
      },
      shippingOptions: item.shippingOptions?.map((option: any) => ({
        shippingCost: {
          value: option.shippingCost.value,
          currency: option.shippingCost.currency,
        },
      })) || [],
    }));
  } catch (error) {
    feedbackSystem.logError(error, 'searchItems');
    throw new EbayServiceError(
      'Failed to search eBay items',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

export const getItemDetails = async (itemId: string): Promise<EbayItem> => {
  const startTime = Date.now();

  try {
    if (!itemId) {
      throw new EbayServiceError('Item ID is required');
    }

    const response = await ebay.buy.browse.getItem(itemId);
    feedbackSystem.logPerformance(startTime);

    if (!response) {
      throw new EbayServiceError('Item not found');
    }

    return {
      itemId: response.itemId,
      title: response.title,
      price: {
        value: response.price.value,
        currency: response.price.currency,
      },
      image: {
        imageUrl: response.image?.imageUrl || '',
      },
      condition: response.condition,
      itemWebUrl: response.itemWebUrl,
      seller: {
        username: response.seller.username,
        feedbackPercentage: response.seller.feedbackPercentage,
        feedbackScore: response.seller.feedbackScore,
      },
      shippingOptions: response.shippingOptions?.map((option: any) => ({
        shippingCost: {
          value: option.shippingCost.value,
          currency: option.shippingCost.currency,
        },
      })) || [],
    };
  } catch (error) {
    feedbackSystem.logError(error, 'getItemDetails');
    throw new EbayServiceError(
      'Failed to get eBay item details',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

// Export performance metrics for monitoring
export const getPerformanceMetrics = () => ({ ...performanceMetrics }); 