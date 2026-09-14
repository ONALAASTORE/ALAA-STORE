import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { StockNotificationRequest } from '../types';
import {
  isFirestoreQuotaExceeded,
  markFirestoreQuotaExceeded,
  isFirestoreQuotaError
} from './productService';

export const STOCK_NOTIFICATIONS_COLLECTION = 'stockNotifications';
const LOCAL_STORAGE_KEY = 'on_alaa_stock_notifications';

/**
 * Get locally cached restock alert requests
 */
export function getLocalStockNotifications(): StockNotificationRequest[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Check if the user has already requested notification for this product
 */
export function hasUserRequestedNotification(productId: string, variantId?: string): boolean {
  const localList = getLocalStockNotifications();
  return localList.some((item) => {
    if (variantId && item.variantId) {
      return item.productId === productId && item.variantId === variantId;
    }
    return item.productId === productId;
  });
}

/**
 * Save a new restock notification request to Cloud Firestore & local cache
 */
export async function createStockNotification(
  data: Omit<StockNotificationRequest, 'id' | 'createdAt' | 'status'>
): Promise<StockNotificationRequest> {
  const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const notification: StockNotificationRequest = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };

  // 1. Save to Local Storage immediately for responsive UI
  try {
    const localList = getLocalStockNotifications();
    const updatedLocal = [notification, ...localList.filter((item) => item.productId !== data.productId)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedLocal));
  } catch (err) {
    console.warn('[Notification] Failed to cache locally:', err);
  }

  // 2. Persist to Cloud Firestore if quota is available
  if (!isFirestoreQuotaExceeded()) {
    try {
      const docRef = doc(db, STOCK_NOTIFICATIONS_COLLECTION, id);
      await setDoc(docRef, notification);
      console.log(`[Firestore] Stock notification registered for "${data.productName}" (${data.contactType})`);
    } catch (err: any) {
      if (isFirestoreQuotaError(err)) {
        markFirestoreQuotaExceeded();
      }
      console.warn('[Firestore] Note on stock notification persistence:', err?.message || err);
    }
  }

  return notification;
}
