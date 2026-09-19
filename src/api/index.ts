/**
 * Next Steel Innovation Frontend API Service
 *
 * All functions call the real backend at VITE_API_URL (default: http://localhost:5000/api).
 * Admin routes require a Bearer JWT stored in localStorage under "nsi_admin_token".
 */

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

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
  productCode: string;
  amazonUrl: string;
  flipkartUrl: string;
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
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function apiLogin(
  email: string,
  password: string
): Promise<{ token: string; admin: { id: string; email: string } }> {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ── Products ─────────────────────────────────────────────────────────────────

export async function apiGetProducts(
  params?: Record<string, string>
): Promise<{ products: ApiProduct[]; total: number; page: number; limit: number }> {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  return apiFetch(`/products${qs}`);
}

/** Fetch a single product by its slug (public). */
export async function apiGetProduct(slug: string): Promise<ApiProduct> {
  return apiFetch(`/products/${slug}`);
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

export async function apiCreateProduct(
  data: Partial<ApiProduct>
): Promise<ApiProduct> {
  return apiFetch("/products", { method: "POST", body: JSON.stringify(data) });
}

export async function apiUpdateProduct(
  id: string,
  data: Partial<ApiProduct>
): Promise<ApiProduct> {
  return apiFetch(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function apiDeleteProduct(id: string): Promise<{ message: string }> {
  return apiFetch(`/products/${id}`, { method: "DELETE" });
}

// ── Categories ───────────────────────────────────────────────────────────────

export async function apiGetCategories(): Promise<ApiCategory[]> {
  return apiFetch("/categories");
}

export async function apiCreateCategory(
  data: Partial<ApiCategory>
): Promise<ApiCategory> {
  return apiFetch("/categories", { method: "POST", body: JSON.stringify(data) });
}

export async function apiUpdateCategory(
  id: string,
  data: Partial<ApiCategory>
): Promise<ApiCategory> {
  return apiFetch(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function apiDeleteCategory(id: string): Promise<{ message: string }> {
  return apiFetch(`/categories/${id}`, { method: "DELETE" });
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

export async function apiGetSettings(): Promise<ApiSiteSettings> {
  return apiFetch("/settings");
}

export async function apiUpdateSettings(
  data: Partial<ApiSiteSettings>
): Promise<ApiSiteSettings> {
  return apiFetch("/settings", { method: "PUT", body: JSON.stringify(data) });
}
