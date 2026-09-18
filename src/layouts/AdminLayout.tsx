import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { X } from "lucide-react";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminHeader } from "../components/admin/AdminHeader";
import { useAdminAuth } from "../context/AdminAuthContext";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ClipboardList,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "../lib/utils";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/bulk-orders", label: "Bulk Orders", icon: ClipboardList },
  { to: "/admin/messages", label: "Contact Messages", icon: MessageSquare },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout() {
  const { isAuthenticated } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-cream-100/60">
      <AdminSidebar />

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn("absolute inset-0 bg-charcoal-950/50 transition-opacity", mobileOpen ? "opacity-100" : "opacity-0")}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-72 bg-charcoal-950 transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-20 items-center justify-between px-6">
            <span className="font-display text-lg text-cream-50">COPPERA</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5 text-cream-50" />
            </button>
          </div>
          <nav className="space-y-1 px-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-400",
                    isActive && "bg-copper-500/15 text-copper-300"
                  )
                }
              >
                <link.icon className="h-4.5 w-4.5" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex min-h-screen flex-1 flex-col">
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-6 py-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
