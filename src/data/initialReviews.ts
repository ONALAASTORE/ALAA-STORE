import { ProductReview } from '../types';

export const INITIAL_REVIEWS_SEED: Record<string, ProductReview[]> = {
  default: [
    {
      id: 'rev-seed-1',
      productId: 'default',
      authorName: 'Karim H.',
      city: 'Achrafieh, Beirut',
      rating: 5,
      comment: 'Super fast delivery to Achrafieh! Original sealed box with official agent warranty and barcode sticker intact. Battery health is at 100% and build quality is immaculate. Highly recommended!',
      date: 'Aug 28, 2026',
      verifiedBuyer: true,
      helpfulCount: 19,
      variantInfo: 'Official Lebanese Agency Stock',
      photos: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80'
      ],
    },
    {
      id: 'rev-seed-2',
      productId: 'default',
      authorName: 'Nour El Dine B.',
      city: 'Mina, Tripoli',
      rating: 5,
      comment: 'Received within 24 hours via Jadra warehouse direct dispatch. Tested serial number on the manufacturer portal, 100% genuine sealed. Paid cash on delivery in fresh USD with exact change.',
      date: 'Aug 15, 2026',
      verifiedBuyer: true,
      helpfulCount: 14,
      variantInfo: 'Factory Sealed Box',
      photos: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80'
      ],
    },
    {
      id: 'rev-seed-3',
      productId: 'default',
      authorName: 'Maya S.',
      city: 'Saida',
      rating: 5,
      comment: 'Great customer service on WhatsApp before buying. Alaa guided me through the specs and provided real photos before dispatching. Premium feel and top performance.',
      date: 'Jul 29, 2026',
      verifiedBuyer: true,
      helpfulCount: 8,
      variantInfo: 'Verified Hardware',
      photos: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
      ],
    },
    {
      id: 'rev-seed-4',
      productId: 'default',
      authorName: 'Ziad Khoury',
      city: 'Jounieh / Keserwan',
      rating: 4,
      comment: 'Arrived the next afternoon properly packaged with bubble wrap. Device works smoothly, exactly as described. Very solid store for tech in Lebanon.',
      date: 'Jul 12, 2026',
      verifiedBuyer: true,
      helpfulCount: 5,
      variantInfo: 'Standard Packaging',
    },
  ],
};

export const REVIEWS_STORAGE_KEY = 'on_alaa_store_product_reviews';

export const getStoredReviews = (): Record<string, ProductReview[]> => {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse stored reviews', err);
  }
  return {};
};

export const saveStoredReviews = (reviews: Record<string, ProductReview[]>) => {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (err) {
    console.error('Failed to save reviews', err);
  }
};
