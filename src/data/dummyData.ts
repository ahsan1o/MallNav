import { Timestamp } from 'firebase/firestore';
import type { FirebaseShop, FirebaseDiscount } from '../types/firebase';

export const dummyShops: FirebaseShop[] = [
  {
    id: 'shop1',
    name: 'Nike Store',
    description: 'Premium athletic footwear and sportswear',
    category: 'Sports & Fitness',
    location: {
      floor: 1,
      coordinates: { lat: 51.505, lng: -0.09 },
      position3D: { x: 10, y: 0, z: 5 }
    },
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    createdAt: Timestamp.fromDate(new Date('2024-01-01')),
    updatedAt: Timestamp.fromDate(new Date('2024-02-15'))
  },
  {
    id: 'shop2',
    name: 'Zara',
    description: 'Contemporary fashion for men and women',
    category: 'Fashion',
    location: {
      floor: 2,
      coordinates: { lat: 51.506, lng: -0.091 },
      position3D: { x: -5, y: 3, z: 15 }
    },
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050',
    createdAt: Timestamp.fromDate(new Date('2024-01-01')),
    updatedAt: Timestamp.fromDate(new Date('2024-02-15'))
  },
  {
    id: 'shop3',
    name: 'Apple Store',
    description: 'Latest Apple products and accessories',
    category: 'Electronics',
    location: {
      floor: 1,
      coordinates: { lat: 51.507, lng: -0.092 },
      position3D: { x: 0, y: 0, z: 20 }
    },
    image: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b',
    createdAt: Timestamp.fromDate(new Date('2024-01-01')),
    updatedAt: Timestamp.fromDate(new Date('2024-02-15'))
  }
];

export const dummyDiscounts: FirebaseDiscount[] = [
  {
    id: 'disc1',
    shopId: 'shop1',
    title: 'Spring Sale',
    description: 'Get up to 30% off on selected running shoes',
    percentage: 30,
    validFrom: Timestamp.fromDate(new Date('2024-03-01')),
    validUntil: Timestamp.fromDate(new Date('2024-04-01')),
    createdAt: Timestamp.fromDate(new Date('2024-02-15'))
  },
  {
    id: 'disc2',
    shopId: 'shop2',
    title: 'New Collection Discount',
    description: 'Save 20% on new arrivals',
    percentage: 20,
    validFrom: Timestamp.fromDate(new Date('2024-03-01')),
    validUntil: Timestamp.fromDate(new Date('2024-03-15')),
    createdAt: Timestamp.fromDate(new Date('2024-02-15'))
  }
];