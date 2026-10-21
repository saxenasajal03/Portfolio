/**
 * Universal asset URL resolver for GitHub Pages, local dev, and custom domains.
 * Solves the GitHub Pages subpath issue (e.g. /Portfolio/ vs /).
 */
export function getAssetUrl(relativePath: string): string {
  if (!relativePath) return '';
  if (
    relativePath.startsWith('http://') ||
    relativePath.startsWith('https://') ||
    relativePath.startsWith('data:') ||
    relativePath.startsWith('blob:')
  ) {
    return relativePath;
  }

  // Strip leading slash
  const clean = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;

  if (typeof window !== 'undefined') {
    try {
      let pathname = window.location.pathname;
      if (pathname.endsWith('.html')) {
        pathname = pathname.substring(0, pathname.lastIndexOf('/') + 1);
      } else if (!pathname.endsWith('/')) {
        pathname += '/';
      }
      const origin = window.location.origin;
      const baseHref = `${origin}${pathname}`;
      return new URL(clean, baseHref).href;
    } catch {
      // Graceful fallback
    }
  }

  const base = import.meta.env.BASE_URL || './';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${clean}`;
}

export const RESUME_PDF_PATH = 'assets/resource/SAJAL_SAXENA_RESUME_3b56c39e.pdf';
export const PROFILE_IMAGE_PATH = 'assets/resource/image_18e25f87.png';
