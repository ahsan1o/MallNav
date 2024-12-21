export interface Shop {
  id: string;
  name: string;
  description: string;
  category: string;
  location: {
    floor: number;
    coordinates: [number, number];
  };
  image: string;
  discounts: Discount[];
}

export interface Discount {
  id: string;
  shopId: string;
  title: string;
  description: string;
  percentage: number;
  validUntil: string;
}

export interface User {
  id: string;
  email: string;
  preferences: {
    categories: string[];
    favoriteShops: string[];
  };
}