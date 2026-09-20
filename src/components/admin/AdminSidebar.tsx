import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ClipboardList,
  MessageSquare,
} from "lucide-react";
import { cn } from "../../lib/utils";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/bulk-orders", label: "Bulk Orders", icon: ClipboardList },
  { to: "/admin/messages", label: "Contact Messages", icon: MessageSquare },
];

export function AdminSidebar() {
  return (
    <aside className="sticky top-0 h-screen hidden w-64 shrink-0 flex-col overflow-y-auto border-r border-charcoal-950/8 bg-charcoal-950 lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-charcoal-950/8 px-6">
        <Link to="/" className="flex items-center gap-2.5 outline-none" title="View Site">
          <img src="/logo.png" alt="Next Steel Innovation Logo" className="h-12 w-16 object-cover" />
          <span className="font-display text-lg tracking-wide text-cream-50">NEXT STEEL INNOVATION</span>
        </Link>
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
        <p className="text-xs text-stone-500">Next Steel Innovation Admin v1.0</p>
      </div>
    </aside>
  );
}
