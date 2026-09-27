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
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("nsi_admin_token");
      window.location.href = "/admin/login";
    }
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function apiUploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${BASE}/upload`, {
    method: "POST",
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
  
  const data = await res.json();
  // Ensure the URL is absolute by prepending the backend origin
  const backendOrigin = new URL(BASE, window.location.origin).origin;
  return { ...data, url: `${backendOrigin}${data.url}` };
}

export async function apiLogin(
  email: string,
  password: string
): Promise<{ token: string; admin: { id: string; email: string } }> {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ── Smart Cache System ────────────────────────────────────────────────────────

const apiCache = new Map<string, { data: any; timestamp: number }>();
const pendingRequests = new Map<string, Promise<any>>();

/**
 * Smart caching wrapper.
 * Returns cached data immediately if available.
 * If data is stale, triggers a background fetch and calls onRefresh with fresh data.
 */
async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  onRefresh?: (data: T) => void,
  ttlMs = 2 * 60 * 1000 // 2 minutes TTL
): Promise<T> {
  const cached = apiCache.get(key);
  const now = Date.now();

  const doFetch = async () => {
    if (pendingRequests.has(key)) return pendingRequests.get(key)!;
    const promise = fetcher().then((data) => {
      apiCache.set(key, { data, timestamp: Date.now() });
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
      return cached.data as T;
    }
    // Stale: background refresh
    doFetch().then((newData) => {
      if (onRefresh) onRefresh(newData);
    }).catch(() => {});
    return cached.data as T;
  }

  return doFetch();
}

export function clearApiCache(prefix?: string) {
  if (!prefix) {
    apiCache.clear();
  } else {
    for (const key of apiCache.keys()) {
      if (key.startsWith(prefix)) apiCache.delete(key);
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
