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
  Layers,
  Image,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

import { ADMIN_ROUTES, ADMIN_LOGIN_PATH, isValidAdminMobile } from "../config/adminRoute";
import { useParams } from "react-router-dom";
import NotFound from "../pages/site/NotFound";

const links = [
  { to: ADMIN_ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: ADMIN_ROUTES.heroBanners, label: "Hero Banners", icon: Layers },
  { to: ADMIN_ROUTES.products, label: "Products", icon: Package },
  { to: ADMIN_ROUTES.categories, label: "Categories", icon: FolderTree },
  { to: ADMIN_ROUTES.newlyAdded, label: "Newly Added", icon: Image },
  { to: ADMIN_ROUTES.bulkOrders, label: "Bulk Orders", icon: ClipboardList },
  { to: ADMIN_ROUTES.messages, label: "Contact Messages", icon: MessageSquare },
];

export function AdminLayout() {
  const { mobileNumber } = useParams<{ mobileNumber?: string }>();
  const { isAuthenticated, isLoading, admin } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If the URL segment does not match the configured client mobile number, return 404
  if (!isValidAdminMobile(mobileNumber)) {
    return <NotFound />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-cream-50">
        <div className="flex flex-col items-center gap-3 text-copper-600">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-xs font-semibold uppercase tracking-widest text-stone-500">
            Verifying Admin Authorization...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ADMIN_LOGIN_PATH} replace />;
  }

  // Ensure role is admin or superadmin
  if (admin && admin.role !== "admin" && admin.role !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-cream-100/60">
      <AdminSidebar />

      {/* Mobile sidebar overlay — portaled via fixed so it never causes layout shifts */}
      <div
        className={cn(
          "fixed inset-0 z-[9999] overflow-hidden lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          className={cn("absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300", mobileOpen ? "opacity-100" : "opacity-0")}
          onClick={() => setMobileOpen(false)}
        />
        {/* Drawer */}
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-72 bg-charcoal-950 transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
            <span className="font-display text-base text-cream-50">NEXT STEEL INNOVATION</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="rounded-lg p-1.5 text-stone-400 hover:bg-white/10 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="space-y-1 px-3 pt-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-400 transition-colors hover:bg-white/8 hover:text-cream-50",
                    isActive && "bg-copper-500/15 text-copper-300"
                  )
                }
              >
                <link.icon className="h-4 w-4 shrink-0" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
