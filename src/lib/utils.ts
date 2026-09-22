import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

/**
 * Generates a URL-safe, unique product slug.
 *
 * Priority:
 *  1. productCode alone  →  e.g. "nsi-024"
 *  2. name + productCode  →  e.g. "mesh-spice-rack-nsi-024"
 *  3. name + short hash   →  e.g. "mesh-spice-rack-a4f7b"
 *
 * Rules:
 *  - Lowercase, hyphens only
 *  - Max 80 chars
 *  - Always includes a unique suffix to prevent collisions
 */
export function generateProductSlug(
  name: string,
  productCode?: string
): string {
  const base = slugify(name);
  const code = productCode ? slugify(productCode) : "";
  const hash = Math.random().toString(36).slice(2, 7);

  let slug: string;
  if (code) {
    // Combine product code with random hash for absolute uniqueness
    slug = `${code}-${hash}`;
  } else {
    // Fallback: name + random hash
    slug = `${base}-${hash}`;
  }

  return slug.slice(0, 80);
}
