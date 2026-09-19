import { createContext, useContext, useState, type ReactNode } from "react";
import { apiLogin } from "../api";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const STORAGE_KEY = "coppera_admin_session";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    // Clear any stale old token key from before renaming
    localStorage.removeItem("coppera_admin_token");
    return localStorage.getItem(STORAGE_KEY);
  });

  const login = async (email: string, password: string) => {
    try {
      const { token } = await apiLogin(email, password);
      localStorage.setItem("nsi_admin_token", token);
      localStorage.setItem(STORAGE_KEY, email);
      setAdminEmail(email);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("nsi_admin_token");
    localStorage.removeItem(STORAGE_KEY);
    setAdminEmail(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{ isAuthenticated: !!adminEmail, adminEmail, login, logout }}
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
