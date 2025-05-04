export interface Listing {
  id: string;
  itemName: string;
  platform: string;
  buyPrice: number;
  resalePrice: number;
  roi: number;
  listingUrl: string;
  imageUrl?: string;
  location?: string;
  datePosted?: string;
} 