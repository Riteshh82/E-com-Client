import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { apiLogin, apiGetMe, apiLogout } from "../api";

interface AdminUser {
  id: string;
  email: string;
  role: string;
  lastLoginAt?: string;
}

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  admin: AdminUser | null;
  adminEmail: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  verifySession: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Clean up legacy keys
  useEffect(() => {
    localStorage.removeItem("coppera_admin_token");
    localStorage.removeItem("coppera_admin_session");
  }, []);

  // Server-side session verification on initialization
  const verifySession = async (): Promise<boolean> => {
    try {
      const data = await apiGetMe();
      if (data?.admin) {
        setAdmin(data.admin);
        return true;
      }
      setAdmin(null);
      return false;
    } catch {
      setAdmin(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifySession();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await apiLogin(email, password);
      // Fallback local mirror for environments where cookies are restricted
      if (res.token) {
        localStorage.setItem("nsi_admin_token", res.token);
      }
      setAdmin({
        id: res.admin.id,
        email: res.admin.email,
        role: res.admin.role || "admin",
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to log in" };
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem("nsi_admin_token");
      setAdmin(null);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated: !!admin,
        isLoading,
        admin,
        adminEmail: admin?.email ?? null,
        login,
        logout,
        verifySession,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
