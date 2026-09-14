/**
 * Utilities for the Web Share API and direct social platform sharing
 */

export interface ShareProductPayload {
  name: string;
  priceFormatted: string;
  priceUSDFormatted: string;
  priceLBPFormatted: string;
  brand?: string;
  condition?: string;
  url: string;
  imageUrl?: string;
}

/**
 * Converts an image URL (data URI, relative, or remote) into a File object
 * suitable for navigator.share({ files: [...] }) supported by Web Share API Level 2.
 */
export async function prepareProductShareImageFile(
  imageUrl: string,
  productName: string
): Promise<File | null> {
  if (!imageUrl || typeof window === 'undefined') return null;

  try {
    let blob: Blob | null = null;

    if (imageUrl.startsWith('data:')) {
      const res = await fetch(imageUrl);
      blob = await res.blob();
    } else {
      // 1. Try direct fetch with a 2-second timeout
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(imageUrl, { mode: 'cors', signal: controller.signal });
        clearTimeout(timer);
        if (res.ok) {
          blob = await res.blob();
        }
      } catch {
        // Fetch failed or timed out; fallback to HTML5 canvas below
      }

      // 2. Offscreen Canvas fallback
      if (!blob) {
        blob = await new Promise<Blob | null>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              const maxDim = 800;
              let w = img.naturalWidth || 600;
              let h = img.naturalHeight || 600;
              if (w > maxDim || h > maxDim) {
                if (w > h) {
                  h = Math.round((h * maxDim) / w);
                  w = maxDim;
                } else {
                  w = Math.round((w * maxDim) / h);
                  h = maxDim;
                }
              }
              canvas.width = Math.max(w, 1);
              canvas.height = Math.max(h, 1);
              const ctx = canvas.getContext('2d');
              if (!ctx) return resolve(null);
              ctx.drawImage(img, 0, 0, w, h);
              canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.85);
            } catch {
              resolve(null);
            }
          };
          img.onerror = () => resolve(null);
          img.src = imageUrl;
        });
      }
    }

    if (blob) {
      const safeName = productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 32);
      const mime = blob.type || 'image/jpeg';
      const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg';
      return new File([blob], `${safeName || 'product'}.${ext}`, { type: mime });
    }
  } catch (err) {
    console.warn('[WebShare] Image preparation skipped:', err);
  }

  return null;
}

/**
 * Checks if the browser supports the Web Share API
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Checks if the browser supports sharing files via Web Share API Level 2
 */
export function canShareFiles(file: File): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.canShare !== 'function') {
    return false;
  }
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

/**
 * Generates direct social sharing URLs for fallback or 1-tap direct sharing
 */
export function getSocialShareLinks(payload: ShareProductPayload) {
  const shareText = `Check out ${payload.name} on On Alaa Store!\nPrice: ${payload.priceUSDFormatted} (≈ ${payload.priceLBPFormatted})\nOfficial Lebanese Warranty • Fast Beirut Delivery\n${payload.url}`;
  const shortText = `${payload.name} - ${payload.priceFormatted} on On Alaa Store`;

  return {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(payload.url)}&text=${encodeURIComponent(shortText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(payload.url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shortText)}&url=${encodeURIComponent(payload.url)}`,
  };
}
