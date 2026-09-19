import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Search, X, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { apiGetProducts, type ApiProduct } from "../../api";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Collections", to: "/collections" },
  { label: "About", to: "/about" },
  { label: "Bulk Orders", to: "/bulk-orders" },
  { label: "Contact", to: "/contact" },
];

interface HeaderProps {
  onMobileMenuChange?: (open: boolean) => void;
}

export function Header({ onMobileMenuChange }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleMobileOpen = (open: boolean) => {
    setMobileOpen(open);
    onMobileMenuChange?.(open);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!searchOpen) setQuery("");
  }, [searchOpen]);

  const [suggestions, setSuggestions] = useState<ApiProduct[]>([]);

  useEffect(() => {
    if (!searchOpen) { setSuggestions([]); return; }
    if (query.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(() => {
      apiGetProducts({ q: query, status: "Published", limit: "5" })
        .then((r) => setSuggestions(r.products))
        .catch(() => setSuggestions([]));
    }, 250);
    return () => clearTimeout(timer);
  }, [query, searchOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-400",
        scrolled || mobileOpen
          ? "bg-cream-50 border-b border-charcoal-950/8 shadow-[0_2px_20px_rgba(23,20,15,0.05)]"
          : "bg-cream-50/80 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5" aria-label="Next Steel Innovation home">
          <img src="/logo.png" alt="Next Steel Innovation Logo" className="h-12 w-16  object-cover transition-transform duration-300 group-hover:scale-105" />
          <span className="font-display text-xl tracking-wide text-charcoal-950">NEXT STEEL INNOVATION</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "copper-underline pb-1 text-sm font-medium text-charcoal-800 transition-colors hover:text-copper-600",
                  isActive && "text-copper-600"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            className="hidden rounded-full p-2.5 text-charcoal-800 transition-colors hover:bg-beige-100 hover:text-copper-600 lg:inline-flex"
            aria-label="Search products"
          >
            {searchOpen ? <X className="h-4.5 w-4.5" /> : <Search className="h-4.5 w-4.5" />}
          </button>
          <Link to="/bulk-orders" className="hidden lg:inline-flex">
            <Button size="sm">
              Bulk Order
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
          <button
            onClick={() => handleMobileOpen(true)}
            className="rounded-full p-2 text-charcoal-900 transition-colors hover:bg-beige-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="hidden border-t border-charcoal-950/8 bg-cream-50 px-6 py-4 lg:block">
          <div className="relative mx-auto max-w-2xl">
            <div className="flex items-center gap-3 rounded-2xl border border-charcoal-950/12 bg-white px-5 py-3 shadow-sm focus-within:border-copper-500 focus-within:shadow-md transition-all">
              <Search className="h-4 w-4 text-stone-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search copper tiles, panels, finishes…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-stone-400 hover:text-charcoal-950">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-charcoal-950/10 bg-white shadow-2xl">
                {suggestions.map((p) => (
                  <Link
                    key={p._id}
                    to={`/products/${p.slug}`}
                    onClick={() => { setSearchOpen(false); setQuery(""); }}
                    className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-beige-100"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-charcoal-950">{p.name}</p>
                      <p className="text-xs text-stone-500">{p.category}</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-stone-300" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-charcoal-950/50 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => handleMobileOpen(false)}
        />
        {/* Drawer panel — solid bg, slides in from right */}
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between border-b border-charcoal-950/8 px-6 py-5">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Next Steel Innovation Logo" className="h-9 w-9 rounded-full object-cover" />
              <span className="font-display text-lg text-charcoal-950">NEXT STEEL INNOVATION</span>
            </div>
            <button
              onClick={() => handleMobileOpen(false)}
              className="rounded-full p-2 text-charcoal-900 hover:bg-beige-100"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-1 flex-col px-4 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => handleMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3.5 text-base font-medium text-charcoal-900 transition-colors hover:bg-beige-100",
                    isActive && "bg-copper-50 text-copper-700"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA */}
          <div className="border-t border-charcoal-950/8 px-4 py-5">
            <Link to="/bulk-orders" onClick={() => handleMobileOpen(false)}>
              <Button className="w-full">Request Bulk Quote</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
