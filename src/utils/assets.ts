/**
 * Universal asset URL resolver.
 * Handles:
 * - Localhost dev server (http://localhost:3000/)
 * - GitHub Pages subpath (https://<username>.github.io/<repo>/)
 * - AI Studio preview / custom domain
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
      // Determine canonical base pathname ensuring trailing slash on folders
      let pathname = window.location.pathname;
      if (!pathname.endsWith('/') && !pathname.includes('.')) {
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

// Canonical asset constants
export const RESUME_PDF_URL = getAssetUrl('Portfolio/assets/resource/SAJAL_SAXENA_RESUME_3b56c39e.pdf');
export const PROFILE_IMAGE_URL = getAssetUrl('{Portfolio/assets/resource/image_18e25f87.png');
