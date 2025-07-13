export interface Vendor {
  id: string;
  name: string;
  image: string;
  category?: string;
  isFeatured?: boolean;
  rating?: number;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  tags?: string[];
  priceRange?: string;
  openingHours?: {
    open: string;
    close: string;
  };
  description?: string;
}