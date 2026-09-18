/**
 * Coppera Frontend API Service
 *
 * Set VITE_USE_REAL_API=true in .env to switch from mock data to the real backend.
 * All functions are typed to match the mock data shapes in src/data/mockData.ts
 */

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
const USE_REAL = import.meta.env.VITE_USE_REAL_API === "true";

// ── Token helpers ──────────────────────────────────────────────────────────
function getToken(): string | null {
  return localStorage.getItem("coppera_admin_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

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

// ── Auth ───────────────────────────────────────────────────────────────────
export async function apiLogin(email: string, password: string): Promise<{ token: string }> {
  if (!USE_REAL) {
    if (email === "admin@coppera.in" && password === "admin123") {
      return { token: "mock-token" };
    }
    throw new Error("Invalid credentials");
  }
  return apiFetch<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ── Products ───────────────────────────────────────────────────────────────
export async function apiGetProducts(params?: Record<string, string>) {
  if (!USE_REAL) {
    const { products } = await import("../data/mockData");
    return { products, total: products.length };
  }
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  return apiFetch<{ products: unknown[]; total: number }>(`/products${qs}`);
}

export async function apiGetProduct(slug: string) {
  if (!USE_REAL) {
    const { products } = await import("../data/mockData");
    return products.find((p) => p.slug === slug) ?? null;
  }
  return apiFetch<unknown>(`/products/${slug}`);
}

export async function apiCreateProduct(data: unknown) {
  if (!USE_REAL) return data;
  return apiFetch<unknown>("/products", { method: "POST", body: JSON.stringify(data) });
}

export async function apiUpdateProduct(id: string, data: unknown) {
  if (!USE_REAL) return data;
  return apiFetch<unknown>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function apiDeleteProduct(id: string) {
  if (!USE_REAL) return { message: "Deleted" };
  return apiFetch<{ message: string }>(`/products/${id}`, { method: "DELETE" });
}

// ── Categories ─────────────────────────────────────────────────────────────
export async function apiGetCategories() {
  if (!USE_REAL) {
    const { categories } = await import("../data/mockData");
    return categories;
  }
  return apiFetch<unknown[]>("/categories");
}

// ── Bulk Orders ────────────────────────────────────────────────────────────
export async function apiSubmitBulkOrder(data: unknown) {
  if (!USE_REAL) return { message: "Inquiry received." };
  return apiFetch<{ message: string }>("/bulk-orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGetBulkOrders(params?: Record<string, string>) {
  if (!USE_REAL) {
    const { bulkOrders } = await import("../data/mockData");
    return { orders: bulkOrders, total: bulkOrders.length };
  }
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  return apiFetch<{ orders: unknown[]; total: number }>(`/bulk-orders${qs}`);
}

export async function apiUpdateBulkOrder(id: string, data: { status?: string; note?: string }) {
  if (!USE_REAL) return data;
  return apiFetch<unknown>(`/bulk-orders/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

// ── Contact Messages ───────────────────────────────────────────────────────
export async function apiSubmitMessage(data: unknown) {
  if (!USE_REAL) return { message: "Message received." };
  return apiFetch<{ message: string }>("/messages", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGetMessages(params?: Record<string, string>) {
  if (!USE_REAL) {
    const { contactMessages } = await import("../data/mockData");
    return { messages: contactMessages, total: contactMessages.length };
  }
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  return apiFetch<{ messages: unknown[]; total: number }>(`/messages${qs}`);
}

export async function apiUpdateMessage(id: string, status: string) {
  if (!USE_REAL) return { status };
  return apiFetch<unknown>(`/messages/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}
