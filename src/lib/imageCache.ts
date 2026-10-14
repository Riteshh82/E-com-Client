/**
 * In-memory registry tracking loaded image URLs across the application.
 * Prevents skeleton shimmer flashes when images have already been preloaded or cached.
 */

const loadedProductImageUrls = new Set<string>();
const loadedCategoryImageUrls = new Set<string>();

export function isProductImageLoaded(url?: string | null): boolean {
  if (!url) return false;
  return loadedProductImageUrls.has(url);
}

export function markProductImageLoaded(url?: string | null): void {
  if (url) loadedProductImageUrls.add(url);
}

export function isCategoryImageLoaded(url?: string | null): boolean {
  if (!url) return false;
  return loadedCategoryImageUrls.has(url);
}

export function markCategoryImageLoaded(url?: string | null): void {
  if (url) loadedCategoryImageUrls.add(url);
}
