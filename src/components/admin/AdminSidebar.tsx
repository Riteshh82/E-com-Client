import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ClipboardList,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "../../lib/utils";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/bulk-orders", label: "Bulk Orders", icon: ClipboardList },
  { to: "/admin/messages", label: "Contact Messages", icon: MessageSquare },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-charcoal-950/8 bg-charcoal-950 lg:flex">
      <div className="flex h-20 items-center gap-2.5 px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-copper-500 font-display text-base text-charcoal-950">
          C
        </span>
        <span className="font-display text-lg tracking-wide text-cream-50">COPPERA</span>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-400 transition-colors hover:bg-cream-50/5 hover:text-cream-50",
                isActive && "bg-copper-500/15 text-copper-300"
              )
            }
          >
            <link.icon className="h-4.5 w-4.5" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-cream-50/10 px-6 py-5">
        <p className="text-xs text-stone-500">Coppera Admin v1.0</p>
      </div>
    </aside>
  );
}
