/**
 * Utility to compress image files or data URLs using HTML5 Canvas
 * Prevents localStorage and Firestore document size quota exceeded errors
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Compresses an image File using an offscreen canvas.
 * Reduces 3MB-10MB mobile camera photos to ~40KB - 120KB.
 */
export async function compressImageFile(
  file: File,
  options: CompressionOptions = {}
): Promise<string> {
  const { maxWidth = 1024, maxHeight = 1024, quality = 0.82 } = options;

  return new Promise((resolve, reject) => {
    // If SVG, no need to compress with canvas
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(width, 1);
        canvas.height = Math.max(height, 1);
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try modern WebP first (highly compressed)
        try {
          const webpData = canvas.toDataURL('image/webp', quality);
          if (webpData.startsWith('data:image/webp')) {
            resolve(webpData);
            return;
          }
        } catch {
          // fallback to JPEG below
        }

        resolve(canvas.toDataURL('image/jpeg', quality));
      };

      img.onerror = () => {
        // If image object fails to decode, fallback to original data url
        resolve(reader.result as string);
      };

      img.src = reader.result as string;
    };

    reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
