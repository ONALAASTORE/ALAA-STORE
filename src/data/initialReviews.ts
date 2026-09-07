import { ProductReview } from '../types';

export const INITIAL_REVIEWS_SEED: Record<string, ProductReview[]> = {
  default: [
    {
      id: 'rev-seed-1',
      productId: 'default',
      authorName: 'Karim H.',
      city: 'Beirut',
      rating: 5,
      comment: 'Super fast delivery to Achrafieh! Original sealed box with official agent warranty. Highly recommended.',
      date: 'Aug 28, 2026',
      verifiedBuyer: true,
    },
    {
      id: 'rev-seed-2',
      productId: 'default',
      authorName: 'Nour El Dine',
      city: 'Tripoli',
      rating: 5,
      comment: 'Received within 24 hours. Excellent customer support on WhatsApp and paid exact cash on delivery.',
      date: 'Aug 15, 2026',
      verifiedBuyer: true,
    },
    {
      id: 'rev-seed-3',
      productId: 'default',
      authorName: 'Maya S.',
      city: 'Saida',
      rating: 4,
      comment: 'Great build quality and authentic device. Battery life is fantastic so far.',
      date: 'Jul 29, 2026',
      verifiedBuyer: true,
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
