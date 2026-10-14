const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

// ── Shared types ────────────────────────────────────────────────────────────

export interface ApiProduct {
  _id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  tags: string[];
  images: string[];
  specifications: {
    material: string;
    finish: string;
    dimensions: string;
    weight: string;
    color: string;
    applications: string[];
  };
  finishes: string[];
  price: number;
  mrp?: number;
  sellingPrice?: number;
  productCode: string;
  amazonUrl: string;
  flipkartUrl: string;
  myntraUrl: string;
  whatsappOrder: boolean;
  featured: boolean;
  isNewlyAdded: boolean;
  bulkAvailable: boolean;
  status: "Published" | "Draft";
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiNewlyAdded {
  _id: string;
  imageUrl: string;
  categorySlug: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiHeroBannerImageMeta {
  filename?: string;
  size?: number;
  width?: number;
  height?: number;
  format?: string;
  mimeType?: string;
}

export interface ApiHeroBanner {
  _id: string;
  name: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
  desktopImageKey?: string;
  mobileImageKey?: string;
  desktopMetadata?: ApiHeroBannerImageMeta;
  mobileMetadata?: ApiHeroBannerImageMeta;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  order: number;
  status: "Active" | "Inactive";
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiUploadImageResult {
  url: string;
  key?: string;
  metadata?: ApiHeroBannerImageMeta;
}

export type InquiryStatus =
  | "New"
  | "Contacted"
  | "In Progress"
  | "Quoted"
  | "Completed"
  | "Cancelled";

export type MessageStatus = "Unread" | "Read" | "Replied";

export interface ApiBulkOrder {
  _id: string;
  customerName: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  product: string;
  quantity: string;
  projectType: string;
  message: string;
  status: InquiryStatus;
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
}

// ── Token helpers ────────────────────────────────────────────────────────────

function getToken(): string | null {
  return localStorage.getItem("nsi_admin_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Core fetch wrapper ───────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    if (res.status === 401 && !path.startsWith("/auth/login")) {
      localStorage.removeItem("nsi_admin_token");
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function apiUploadImage(
  file: File,
  targetOrOptions?: string | { productId?: string; folder?: string; identifier?: string }
): Promise<ApiUploadImageResult> {
  const formData = new FormData();
  formData.append("image", file);

  const queryParams = new URLSearchParams();
  if (typeof targetOrOptions === "string") {
    queryParams.set("productId", targetOrOptions);
  } else if (targetOrOptions) {
    if (targetOrOptions.productId) queryParams.set("productId", targetOrOptions.productId);
    if (targetOrOptions.identifier) queryParams.set("identifier", targetOrOptions.identifier);
    if (targetOrOptions.folder) queryParams.set("folder", targetOrOptions.folder);
  }

  const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";

  const res = await fetch(`${BASE}/upload${qs}`, {
    method: "POST",
    credentials: "include",
    headers: {
      ...authHeaders(),
    },
    body: formData,
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("nsi_admin_token");
      window.location.href = "/admin/login";
    }
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? res.statusText);
  }

  // R2 returns an absolute public URL — no origin prepending needed.
  return res.json() as Promise<ApiUploadImageResult>;
}

export async function apiLogin(
  email: string,
  password: string
): Promise<{ token: string; admin: { id: string; email: string; role?: string } }> {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function apiGetMe(): Promise<{ admin: { id: string; email: string; role: string; lastLoginAt?: string } }> {
  return apiFetch("/auth/me");
}

export async function apiLogout(): Promise<{ message: string }> {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
}

/**
 * Delete an image from R2 by its public URL.
 * Only works for images owned by this bucket (validated on the backend).
 */
export async function apiDeleteProductImage(url: string): Promise<void> {
  await apiFetch("/upload", {
    method: "DELETE",
    body: JSON.stringify({ url }),
  });
}


// ── Smart Cache System ────────────────────────────────────────────────────────

const SESSION_CACHE_PREFIX = "nsi_api_cache_";
const apiCache = new Map<string, { data: any; timestamp: number }>();
const pendingRequests = new Map<string, Promise<any>>();

// Helper to read cached payload from memory first, then sessionStorage
function getCachedPayload<T>(key: string): { data: T; timestamp: number } | null {
  if (apiCache.has(key)) {
    return apiCache.get(key) as { data: T; timestamp: number };
  }
  if (typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem(SESSION_CACHE_PREFIX + key);
      if (raw) {
        const parsed = JSON.parse(raw);
        apiCache.set(key, parsed);
        return parsed;
      }
    } catch {}
  }
  return null;
}

// Helper to save payload to both memory and sessionStorage
function setCachedPayload(key: string, data: any, timestamp: number) {
  const item = { data, timestamp };
  apiCache.set(key, item);
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(SESSION_CACHE_PREFIX + key, JSON.stringify(item));
    } catch {}
  }
}

/**
 * Smart caching wrapper.
 * Returns cached data immediately if available.
 * If data is stale, triggers a background fetch and calls onRefresh with fresh data.
 */
async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  onRefresh?: (data: T) => void,
  ttlMs = 5 * 60 * 1000 // 5 minutes TTL
): Promise<T> {
  const cached = getCachedPayload<T>(key);
  const now = Date.now();

  const doFetch = async () => {
    if (pendingRequests.has(key)) return pendingRequests.get(key)!;
    const promise = fetcher().then((data) => {
      setCachedPayload(key, data, Date.now());
      pendingRequests.delete(key);
      return data;
    }).catch(err => {
      pendingRequests.delete(key);
      throw err;
    });
    pendingRequests.set(key, promise);
    return promise;
  };

  if (cached) {
    if (now - cached.timestamp < ttlMs) {
      return cached.data;
    }
    // Stale: background refresh
    doFetch().then((newData) => {
      if (onRefresh) onRefresh(newData);
    }).catch(() => {});
    return cached.data;
  }

  return doFetch();
}

export function clearApiCache(prefix?: string) {
  if (!prefix) {
    apiCache.clear();
    if (typeof window !== "undefined") {
      try {
        const keys = Object.keys(sessionStorage);
        for (const k of keys) {
          if (k.startsWith(SESSION_CACHE_PREFIX)) sessionStorage.removeItem(k);
        }
      } catch {}
    }
  } else {
    for (const key of apiCache.keys()) {
      if (key.startsWith(prefix)) apiCache.delete(key);
    }
    if (typeof window !== "undefined") {
      try {
        const keys = Object.keys(sessionStorage);
        for (const k of keys) {
          if (k.startsWith(SESSION_CACHE_PREFIX + prefix)) sessionStorage.removeItem(k);
        }
      } catch {}
    }
  }
}

// ── Products ─────────────────────────────────────────────────────────────────

export async function apiGetProducts(
  params?: Record<string, string>,
  onRefresh?: (data: { products: ApiProduct[]; total: number; page: number; limit: number }) => void
): Promise<{ products: ApiProduct[]; total: number; page: number; limit: number }> {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  return cachedFetch(
    `products:${qs}`,
    () => apiFetch(`/products${qs}`),
    onRefresh
  );
}

export async function apiGetProduct(
  slug: string,
  onRefresh?: (data: ApiProduct) => void
): Promise<ApiProduct> {
  return cachedFetch(`product:${slug}`, () => apiFetch(`/products/${slug}`), onRefresh);
}

/** Fetch a single product by its MongoDB _id (admin edit). */
export async function apiGetProductById(id: string): Promise<ApiProduct> {
  // The backend GET /:slug handler also matches _id strings; use a dedicated
  // query instead so we don't accidentally increment view counts.
  return apiFetch<{ products: ApiProduct[]; total: number }>(`/products?_id=${id}`).then(
    (r) => {
      const p = r.products[0];
      if (!p) throw new Error("Product not found");
      return p;
    }
  );
}

export async function apiTrackMarketplaceClick(
  id: string,
  marketplace: "amazon" | "flipkart" | "myntra" | "whatsapp"
): Promise<{ message: string; clicks: number }> {
  return apiFetch(`/products/${id}/click`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ marketplace }),
  });
}

export async function apiCreateProduct(
  data: Partial<ApiProduct>
): Promise<ApiProduct> {
  const res = await apiFetch<ApiProduct>("/products", { method: "POST", body: JSON.stringify(data) });
  clearApiCache("products");
  return res;
}

export async function apiUpdateProduct(
  id: string,
  data: Partial<ApiProduct>
): Promise<ApiProduct> {
  const res = await apiFetch<ApiProduct>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
  clearApiCache("product");
  return res;
}

export async function apiDeleteProduct(id: string): Promise<{ message: string }> {
  const res = await apiFetch<{ message: string }>(`/products/${id}`, { method: "DELETE" });
  clearApiCache("product");
  return res;
}

// ── Categories ───────────────────────────────────────────────────────────────

export async function apiGetCategories(
  onRefresh?: (data: ApiCategory[]) => void
): Promise<ApiCategory[]> {
  return cachedFetch("categories", () => apiFetch("/categories"), onRefresh, 1000 * 60 * 60 * 24); // 24h
}

export async function apiCreateCategory(
  data: Partial<ApiCategory>
): Promise<ApiCategory> {
  const res = await apiFetch<ApiCategory>("/categories", { method: "POST", body: JSON.stringify(data) });
  clearApiCache("categories");
  return res;
}

export async function apiUpdateCategory(
  id: string,
  data: Partial<ApiCategory>
): Promise<ApiCategory> {
  const res = await apiFetch<ApiCategory>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) });
  clearApiCache("categories");
  return res;
}

export async function apiDeleteCategory(id: string): Promise<{ message: string }> {
  const res = await apiFetch<{ message: string }>(`/categories/${id}`, { method: "DELETE" });
  clearApiCache("categories");
  return res;
}

// ── Bulk Orders ───────────────────────────────────────────────────────────────

export async function apiSubmitBulkOrder(data: {
  customerName: string;
  company?: string;
  phone: string;
  email: string;
  city: string;
  product?: string;
  quantity: string;
  projectType?: string;
  message?: string;
}): Promise<{ message: string; id: string }> {
  return apiFetch("/bulk-orders", { method: "POST", body: JSON.stringify(data) });
}

export async function apiGetBulkOrders(
  params?: Record<string, string>
): Promise<{ orders: ApiBulkOrder[]; total: number }> {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  return apiFetch(`/bulk-orders${qs}`);
}

export async function apiUpdateBulkOrder(
  id: string,
  data: { status?: InquiryStatus; note?: string }
): Promise<ApiBulkOrder> {
  return apiFetch(`/bulk-orders/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

// ── Contact Messages ──────────────────────────────────────────────────────────

export async function apiSubmitMessage(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<{ message: string; id: string }> {
  return apiFetch("/messages", { method: "POST", body: JSON.stringify(data) });
}

export async function apiGetMessages(
  params?: Record<string, string>
): Promise<{ messages: ApiContactMessage[]; total: number }> {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  return apiFetch(`/messages${qs}`);
}

export async function apiUpdateMessage(
  id: string,
  status: MessageStatus
): Promise<ApiContactMessage> {
  return apiFetch(`/messages/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

// ── Site Settings ─────────────────────────────────────────────────────────────

export interface ApiSiteSettings {
  _id?: string;
  name: string;
  logoInitial: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  whatsapp: string;
  amazonStoreUrl: string;
  flipkartStoreUrl: string;
  notifyBulkOrders: boolean;
  notifyMessages: boolean;
  notifyWeeklySummary: boolean;
}

export async function apiGetSettings(
  onRefresh?: (data: ApiSiteSettings) => void
): Promise<ApiSiteSettings> {
  return cachedFetch("settings", () => apiFetch("/settings"), onRefresh, 1000 * 60 * 60 * 24);
}

export async function apiUpdateSettings(
  data: Partial<ApiSiteSettings>
): Promise<ApiSiteSettings> {
  const res = await apiFetch<ApiSiteSettings>("/settings", { method: "PUT", body: JSON.stringify(data) });
  clearApiCache("settings");
  return res;
}

// ── NewlyAddeds ─────────────────────────────────────────────────────────────────

export async function apiGetNewlyAddeds(
  onRefresh?: (data: ApiNewlyAdded[]) => void
): Promise<ApiNewlyAdded[]> {
  return cachedFetch("newlyadded:public", () => apiFetch("/newlyadded"), onRefresh);
}

export async function apiGetAdminNewlyAddeds(
  onRefresh?: (data: ApiNewlyAdded[]) => void
): Promise<ApiNewlyAdded[]> {
  return cachedFetch("newlyadded:admin", () => apiFetch("/newlyadded/all"), onRefresh);
}

export async function apiCreateNewlyAdded(data: Partial<ApiNewlyAdded>): Promise<ApiNewlyAdded> {
  const res = await apiFetch<ApiNewlyAdded>("/newlyadded", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  clearApiCache("newlyadded");
  return res;
}

export async function apiUpdateNewlyAdded(id: string, data: Partial<ApiNewlyAdded>): Promise<ApiNewlyAdded> {
  const res = await apiFetch<ApiNewlyAdded>(`/newlyadded/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  clearApiCache("newlyadded");
  return res;
}

export async function apiDeleteNewlyAdded(id: string): Promise<void> {
  await apiFetch(`/newlyadded/${id}`, { method: "DELETE" });
  clearApiCache("newlyadded");
}

// ── Hero Banners ─────────────────────────────────────────────────────────────

export async function apiGetHeroBanners(
  onRefresh?: (data: ApiHeroBanner[]) => void
): Promise<ApiHeroBanner[]> {
  return cachedFetch("hero-banners:public", () => apiFetch("/hero-banners"), onRefresh, 60 * 1000);
}

export async function apiGetAdminHeroBanners(): Promise<ApiHeroBanner[]> {
  return apiFetch<ApiHeroBanner[]>("/hero-banners/admin");
}

export async function apiGetHeroBannerById(id: string): Promise<ApiHeroBanner> {
  return apiFetch<ApiHeroBanner>(`/hero-banners/${id}`);
}

export async function apiCreateHeroBanner(data: Partial<ApiHeroBanner>): Promise<ApiHeroBanner> {
  const res = await apiFetch<ApiHeroBanner>("/hero-banners", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  clearApiCache("hero-banners");
  return res;
}

export async function apiUpdateHeroBanner(id: string, data: Partial<ApiHeroBanner>): Promise<ApiHeroBanner> {
  const res = await apiFetch<ApiHeroBanner>(`/hero-banners/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  clearApiCache("hero-banners");
  return res;
}

export async function apiDeleteHeroBanner(id: string): Promise<void> {
  await apiFetch(`/hero-banners/${id}`, { method: "DELETE" });
  clearApiCache("hero-banners");
}

export async function apiReorderHeroBanners(
  items: Array<{ id: string; order: number }>
): Promise<ApiHeroBanner[]> {
  const res = await apiFetch<ApiHeroBanner[]>("/hero-banners/reorder", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  clearApiCache("hero-banners");
  return res;
}

export async function apiToggleHeroBannerStatus(
  id: string,
  status: "Active" | "Inactive"
): Promise<ApiHeroBanner> {
  const res = await apiFetch<ApiHeroBanner>(`/hero-banners/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  clearApiCache("hero-banners");
  return res;
}

