import { Product, Currency } from '../types';
import { formatPrice } from './currency';

/**
 * Safely encodes an array of product IDs into a clean URL-safe base64 string.
 */
export function encodeWishlistIds(ids: string[]): string {
  if (!ids || ids.length === 0) return '';
  const cleanIds = Array.from(new Set(ids.filter(Boolean)));
  if (cleanIds.length === 0) return '';
  const joined = cleanIds.join(',');

  try {
    // Unicode-safe base64
    const utf8Bytes = encodeURIComponent(joined).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    );
    const b64 = btoa(utf8Bytes);
    // Make URL-safe by replacing + with -, / with _, and stripping trailing =
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return encodeURIComponent(joined);
  }
}

/**
 * Decodes wishlist IDs from an encoded URL parameter string (supports URL-safe base64, standard base64, and comma-separated).
 */
export function decodeWishlistIds(encoded: string): string[] {
  if (!encoded) return [];
  const trimmed = encoded.trim();
  if (!trimmed) return [];

  // 1. Try URL-safe base64 decoding
  try {
    let b64 = trimmed.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4 !== 0) {
      b64 += '=';
    }
    const binary = atob(b64);
    const decoded = decodeURIComponent(
      Array.from(binary)
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    if (decoded) {
      const parts = decoded.split(',').map((s) => s.trim()).filter(Boolean);
      if (parts.length > 0) {
        return Array.from(new Set(parts));
      }
    }
  } catch {
    // Fallback if not valid base64
  }

  // 2. Try simple URI decoding with comma separation
  try {
    const raw = decodeURIComponent(trimmed);
    const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
    return Array.from(new Set(parts));
  } catch {
    return [];
  }
}

/**
 * Generates the absolute or relative shareable URL containing encoded wishlist IDs.
 */
export function buildWishlistShareUrl(ids: string[]): string {
  if (!ids || ids.length === 0) {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.pathname, window.location.origin);
      url.searchParams.delete('wishlist');
      return url.toString();
    }
    return '';
  }

  const encoded = encodeWishlistIds(ids);
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.pathname, window.location.origin);
    url.searchParams.set('wishlist', encoded);
    return url.toString();
  }
  return `?wishlist=${encoded}`;
}

/**
 * Formats a friendly WhatsApp & messaging text summary with product names, prices, and the share link.
 */
export function formatWishlistShareMessage(
  products: Product[],
  shareUrl: string,
  currency: Currency
): string {
  const count = products.length;
  const totalUSD = products.reduce((sum, p) => sum + p.basePriceUSD, 0);

  const productLines = products
    .slice(0, 10)
    .map((p, idx) => `  ${idx + 1}. *${p.name}* (${p.brand}) — ${formatPrice(p.basePriceUSD, currency)}`)
    .join('\n');

  const overflowNote = count > 10 ? `\n  ... and ${count - 10} more items!` : '';

  return (
    `🛍️ *My Wishlist on ON ALAA STORE Lebanon*\n` +
    `Check out the ${count} item${count > 1 ? 's' : ''} I saved!\n\n` +
    `*Items:*\n` +
    productLines +
    overflowNote +
    `\n\n` +
    `💰 *Estimated Total:* ${formatPrice(totalUSD, currency)}\n` +
    `🔗 *View Full Wishlist Here:*\n${shareUrl}\n\n` +
    `100% Official Agency Warranty & Fast Delivery across Lebanon 🇱🇧`
  );
}

/**
 * Generates a WhatsApp share URL that prompts the user to send the wishlist to any contact or group.
 */
export function buildWhatsAppShareWishlistUrl(
  products: Product[],
  shareUrl: string,
  currency: Currency
): string {
  const message = formatWishlistShareMessage(products, shareUrl, currency);
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}
