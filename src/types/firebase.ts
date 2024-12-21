import { Timestamp } from 'firebase/firestore';

export interface FirebaseShop {
  id: string;
  name: string;
  description: string;
  category: string;
  location: {
    floor: number;
    coordinates: {
      lat: number;
      lng: number;
    };
    position3D: {
      x: number;
      y: number;
      z: number;
    };
  };
  image: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseDiscount {
  id: string;
  shopId: string;
  title: string;
  description: string;
  percentage: number;
  validFrom: Timestamp;
  validUntil: Timestamp;
  createdAt: Timestamp;
}

export interface FirebaseUser {
  uid: string;
  email: string;
  displayName?: string;
  preferences: {
    categories: string[];
    favoriteShops: string[];
    notificationSettings: {
      deals: boolean;
      favorites: boolean;
      nearbyOffers: boolean;
    };
  };
  createdAt: Timestamp;
  lastLogin: Timestamp;
}