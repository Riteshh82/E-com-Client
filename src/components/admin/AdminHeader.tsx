import { useState } from "react";
import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { adminEmail, logout } = useAdminAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-charcoal-950/8 bg-cream-50/95 px-6 backdrop-blur">
      <button onClick={onMenuClick} className="text-charcoal-900 lg:hidden" aria-label="Open menu">
        <Menu className="h-6 w-6" />
      </button>

      <div className="hidden max-w-sm flex-1 items-center gap-2 rounded-full border border-charcoal-950/12 bg-white px-4 py-2.5 sm:flex">
        <Search className="h-4 w-4 text-stone-400" />
        <input
          placeholder="Search products, orders, messages…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setNotifOpen((s) => !s)}
            className="relative rounded-full p-2.5 text-charcoal-800 hover:bg-beige-100"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-copper-500" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-12 w-72 rounded-xl border border-charcoal-950/8 bg-white p-3 shadow-xl">
              <p className="px-2 py-1.5 text-xs font-medium text-stone-400">Notifications</p>
              {[
                "New bulk inquiry from Studio Mehta Architects",
                "New contact message from Neha Joshi",
                "Premium Copper Wall Tile is still in Draft",
              ].map((n) => (
                <div key={n} className="rounded-lg px-2 py-2 text-sm text-charcoal-800 hover:bg-beige-100">
                  {n}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 border-l border-charcoal-950/10 pl-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-copper-500 text-sm font-medium text-cream-50">
            {(adminEmail ?? "A")[0].toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-charcoal-950">{adminEmail ?? "Admin"}</p>
            <button
              onClick={() => {
                logout();
                navigate("/admin/login");
              }}
              className="flex items-center gap-1 text-xs text-stone-500 hover:text-copper-600"
            >
              <LogOut className="h-3 w-3" /> Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
