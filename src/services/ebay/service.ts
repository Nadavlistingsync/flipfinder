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

export const searchItems = async (params: EbaySearchParams): Promise<EbayItem[]> => {
  try {
    const response = await ebay.buy.browse.search({
      q: params.keywords,
      category_ids: params.categoryId,
      filter: `price:[${params.minPrice || 0}..${params.maxPrice || ''}],condition:${params.condition || 'NEW'}`,
      sort: params.sortOrder || 'BestMatch',
      limit: params.limit || 50,
    });

    return response.itemSummaries.map((item: EbayApiItemSummary) => ({
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
      shippingOptions: item.shippingOptions?.map((option: EbayApiShippingOption) => ({
        shippingCost: {
          value: option.shippingCost.value,
          currency: option.shippingCost.currency,
        },
      })) || [],
    }));
  } catch (error) {
    console.error('Error searching eBay items:', error);
    throw error;
  }
};

export const getItemDetails = async (itemId: string): Promise<EbayItem> => {
  try {
    const response = await ebay.buy.browse.getItem(itemId);
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
      shippingOptions: response.shippingOptions?.map((option: EbayApiShippingOption) => ({
        shippingCost: {
          value: option.shippingCost.value,
          currency: option.shippingCost.currency,
        },
      })) || [],
    };
  } catch (error) {
    console.error('Error getting eBay item details:', error);
    throw error;
  }
}; 