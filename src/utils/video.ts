/**
 * Converts various video platform links (YouTube, Vimeo, direct MP4) into safe embed or playable URLs.
 */
export function getEmbedVideoUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // YouTube watch link: https://www.youtube.com/watch?v=VIDEO_ID
  const ytWatchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  if (ytWatchMatch && ytWatchMatch[1]) {
    return `https://www.youtube.com/embed/${ytWatchMatch[1]}?autoplay=0&rel=0&modestbranding=1`;
  }

  // Vimeo: https://vimeo.com/VIDEO_ID
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return trimmed;
}

export function isDirectVideoFile(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg');
}
