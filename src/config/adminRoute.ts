/**
 * Centralized Admin Route Configuration
 * 
 * Provides single source of truth for the custom admin route.
 * Admin URL format: /admin/:mobile (default /admin/8840546629)
 */

export const ADMIN_MOBILE_SEGMENT = (
  import.meta.env.VITE_ADMIN_MOBILE_ROUTE || "8840546629"
).trim();

export const ADMIN_BASE_PATH = `/admin/${ADMIN_MOBILE_SEGMENT}`;
export const ADMIN_LOGIN_PATH = `${ADMIN_BASE_PATH}/login`;

export const ADMIN_ROUTES = {
  root: ADMIN_BASE_PATH,
  login: ADMIN_LOGIN_PATH,
  dashboard: ADMIN_BASE_PATH,
  heroBanners: `${ADMIN_BASE_PATH}/hero-banners`,
  products: `${ADMIN_BASE_PATH}/products`,
  productNew: `${ADMIN_BASE_PATH}/products/new`,
  productEdit: (id: string) => `${ADMIN_BASE_PATH}/products/${id}/edit`,
  categories: `${ADMIN_BASE_PATH}/categories`,
  newlyAdded: `${ADMIN_BASE_PATH}/newlyadded`,
  bulkOrders: `${ADMIN_BASE_PATH}/bulk-orders`,
  messages: `${ADMIN_BASE_PATH}/messages`,
} as const;

/**
 * Validates whether a given mobile route segment matches the configured custom admin route.
 */
export function isValidAdminMobile(segment?: string | null): boolean {
  if (!segment) return false;
  return segment === ADMIN_MOBILE_SEGMENT;
}
