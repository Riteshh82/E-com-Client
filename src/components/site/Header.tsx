import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink } from "react-router-dom";
import { Menu, Search, X, ArrowRight, Layers } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { apiGetProducts, apiGetCategories, type ApiProduct, type ApiCategory } from "../../api";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Categories", to: "/collections" },
  { label: "About", to: "/about" },
  // { label: "Bulk Orders", to: "/bulk-orders" },
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

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!searchOpen) setQuery("");
  }, [searchOpen]);

  const [productSuggestions, setProductSuggestions] = useState<ApiProduct[]>([]);
  const [categorySuggestions, setCategorySuggestions] = useState<ApiCategory[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Cache all categories once
  const allCategoriesRef = useRef<ApiCategory[]>([]);
  useEffect(() => {
    apiGetCategories().then((cats) => { allCategoriesRef.current = cats; }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!searchOpen) {
      setProductSuggestions([]);
      setCategorySuggestions([]);
      setHasSearched(false);
      return;
    }
    if (query.length < 2) {
      setProductSuggestions([]);
      setCategorySuggestions([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      setSearchLoading(true);
      setHasSearched(false);

      // Filter categories locally (by name)
      const lowerQ = query.toLowerCase();
      const matchedCats = allCategoriesRef.current.filter((c) =>
        c.name.toLowerCase().includes(lowerQ) || c.slug.toLowerCase().includes(lowerQ)
      );
      setCategorySuggestions(matchedCats.slice(0, 3));

      // Fetch product matches (name + productCode + text search)
      apiGetProducts({ q: query, status: "Published", limit: "5" })
        .then((r) => {
          setProductSuggestions(r.products);
        })
        .catch(() => setProductSuggestions([]))
        .finally(() => {
          setSearchLoading(false);
          setHasSearched(true);
        });
    }, 250);
    return () => clearTimeout(timer);
  }, [query, searchOpen]);

  const totalResults = productSuggestions.length + categorySuggestions.length;
  const showDropdown = query.length >= 2 && (hasSearched || searchLoading);

  return (
    <>
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
          {/* Mobile menu toggle — animated hamburger ↔ X */}
          <button
            onClick={() => handleMobileOpen(!mobileOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-charcoal-900 transition-colors hover:bg-beige-100 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <Menu
              className={cn(
                "absolute h-6 w-6 transition-all duration-200",
                mobileOpen ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
              )}
            />
            <X
              className={cn(
                "absolute h-6 w-6 transition-all duration-200",
                mobileOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
              )}
            />
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
                placeholder="Search by product name, code or category…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-stone-400 hover:text-charcoal-950">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Suggestions / No-results dropdown */}
            {showDropdown && (
              <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-charcoal-950/10 bg-white shadow-2xl animate-fade-up">

                {searchLoading ? (
                  <div className="flex items-center gap-3 px-5 py-4">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-copper-500 border-t-transparent" />
                    <span className="text-sm text-stone-400">Searching…</span>
                  </div>
                ) : totalResults === 0 ? (
                  /* No-results state */
                  <div className="px-5 py-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-beige-100 text-stone-400">
                      <Search className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-charcoal-950">No results for "{query}"</p>
                    <p className="mt-1 text-xs text-stone-500">Try a different name, product code, or category.</p>
                    <Link
                      to={`/products?q=${encodeURIComponent(query)}`}
                      onClick={() => { setSearchOpen(false); setQuery(""); }}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-charcoal-950/15 px-4 py-2 text-xs font-medium text-charcoal-950 transition-all hover:border-copper-400 hover:text-copper-600"
                    >
                      Browse all products <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ) : (
                  <div>
                    {/* Category results */}
                    {categorySuggestions.length > 0 && (
                      <div>
                        <p className="border-b border-charcoal-950/6 px-5 py-2 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                          Categories
                        </p>
                        {categorySuggestions.map((c) => (
                          <Link
                            key={c._id}
                            to={`/products?category=${c.slug}`}
                            onClick={() => { setSearchOpen(false); setQuery(""); }}
                            className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-beige-100"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-copper-50 text-copper-500">
                              <Layers className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-charcoal-950">{c.name}</p>
                              <p className="text-xs text-stone-500">{c.productCount} products</p>
                            </div>
                            <ArrowRight className="ml-auto h-4 w-4 text-stone-300" />
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Product results */}
                    {productSuggestions.length > 0 && (
                      <div>
                        {categorySuggestions.length > 0 && (
                          <p className="border-b border-t border-charcoal-950/6 px-5 py-2 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                            Products
                          </p>
                        )}
                        {productSuggestions.map((p) => (
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
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-charcoal-950">{p.name}</p>
                              <p className="text-xs text-stone-500">
                                {p.category}
                                {p.productCode && <span className="ml-2 font-mono text-[10px] text-stone-400">{p.productCode}</span>}
                              </p>
                            </div>
                            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-stone-300" />
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Footer: view all link */}
                    <div className="border-t border-charcoal-950/6 px-5 py-3">
                      <Link
                        to={`/products?q=${encodeURIComponent(query)}`}
                        onClick={() => { setSearchOpen(false); setQuery(""); }}
                        className="flex items-center gap-1.5 text-xs font-medium text-copper-600 hover:text-copper-700"
                      >
                        View all results for "{query}" <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>

    {/* Mobile drawer — portaled into document.body so it is completely
        decoupled from the sticky header's stacking context. This guarantees
        identical rendering whether the user is at the top of the page
        or has scrolled down. */}
    {createPortal(
      <div
        className={cn(
          "fixed inset-0 z-[9999] overflow-hidden lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
        aria-modal={mobileOpen}
        role="dialog"
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => handleMobileOpen(false)}
        />

        {/* Drawer panel */}
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out",
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
      </div>,
      document.body
    )}
  </>
  );
}
