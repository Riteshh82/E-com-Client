import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductGrid, ProductGridSkeleton } from "../../components/site/ProductCard";
import { apiGetProducts, apiGetCategories, type ApiProduct, type ApiCategory } from "../../api";
import { cn } from "../../lib/utils";
import { Search, X } from "lucide-react";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "all";
  const newlyAddedOnly = searchParams.get("newlyAdded") === "true";
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load categories once
  useEffect(() => {
    apiGetCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
    return () => clearTimeout(handler);
  }, [query]);

  // Reload products when category or debounced query changes
  useEffect(() => {
    // If filtering by a specific category, wait until categories list is populated
    if (activeCategory !== "all" && categories.length === 0) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    const params: Record<string, string> = { status: "Published" };
    if (activeCategory !== "all") {
      const cat = categories.find((c) => c.slug === activeCategory);
      if (cat) params.category = cat.name;
    }
    if (newlyAddedOnly) params.isNewlyAdded = "true";
    if (debouncedQuery.trim()) params.q = debouncedQuery.trim();

    apiGetProducts(params, (r) => { if (isMounted) setProducts(r.products); })
      .then((r) => {
        if (!isMounted) return;
        setProducts(r.products);
        setLoading(false);
      })
      .catch((e: Error) => {
        if (!isMounted) return;
        setError(e.message);
        setLoading(false);
      });
      
    return () => { isMounted = false; };
  }, [activeCategory, newlyAddedOnly, debouncedQuery, categories]);

  const activeCategoryName = useMemo(
    () => categories.find((c) => c.slug === activeCategory)?.name,
    [categories, activeCategory]
  );

  return (
    <div>
      {/* ── Page header ── */}
      <section className="border-b border-charcoal-950/8 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-copper-600">
            Full Range
          </span>
          <h1 className="mt-2 font-display text-5xl text-charcoal-950">
            {newlyAddedOnly ? "Newly Added Products" : "Products"}
          </h1>
          <p className="mt-3 max-w-xl text-stone-500">
            {newlyAddedOnly 
              ? "Check out the latest additions to our kitchen and home storage range."
              : "Browse our full range of kitchen racks, trolleys, shelves, organizers and home storage products — built for everyday use in modern homes and businesses."
            }
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        {/* ── Filter bar ── */}
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSearchParams({})}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
                activeCategory === "all"
                  ? "border-charcoal-950 bg-charcoal-950 text-cream-50 shadow-sm"
                  : "border-charcoal-950/15 text-charcoal-800 hover:border-copper-400 hover:text-copper-600"
              )}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => setSearchParams({ category: c.slug })}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
                  activeCategory === c.slug
                    ? "border-copper-500 bg-copper-500 text-white shadow-sm"
                    : "border-charcoal-950/15 text-charcoal-800 hover:border-copper-400 hover:text-copper-600"
                )}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 lg:w-72 lg:flex-none">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                aria-label="Search products"
                className="w-full rounded-full border border-charcoal-950/15 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition-colors focus:border-copper-500 focus:ring-2 focus:ring-copper-500/15"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search query"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-charcoal-950"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Result count */}
        {!loading && !error && (
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm text-stone-500">
              {products.length} product{products.length !== 1 ? "s" : ""}{" "}
              {activeCategory !== "all" && activeCategoryName && (
                <span>
                  in{" "}
                  <span className="font-medium text-charcoal-950">{activeCategoryName}</span>
                </span>
              )}
              {query && (
                <span>
                  {" "}matching <span className="font-medium text-charcoal-950">"{query}"</span>
                </span>
              )}
            </p>
            {(activeCategory !== "all" || query) && (
              <button
                onClick={() => { setSearchParams({}); setQuery(""); }}
                className="flex items-center gap-1 text-xs text-stone-500 hover:text-copper-600"
              >
                <X className="h-3.5 w-3.5" /> Clear filters
              </button>
            )}
          </div>
        )}

        {/* States */}
        {loading && <ProductGridSkeleton count={8} />}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
            {error}
          </div>
        )}
        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-charcoal-950/12 py-20 text-center animate-fade-up">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-copper-50 text-copper-400">
              <Search className="h-7 w-7" />
            </div>
            <p className="font-display text-lg text-charcoal-950">No results found</p>
            <p className="mt-1.5 text-sm text-stone-500">
              {query
                ? `No products match "${query}". Try a different search term.`
                : "No products in this category yet."}
            </p>
            {(activeCategory !== "all" || query) && (
              <button
                onClick={() => { setSearchParams({}); setQuery(""); }}
                className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-charcoal-950/15 px-5 py-2 text-sm font-medium text-charcoal-950 transition-all hover:border-copper-400 hover:text-copper-600"
              >
                <X className="h-3.5 w-3.5" /> Clear filters
              </button>
            )}
          </div>
        )}
        {!loading && !error && products.length > 0 && <ProductGrid products={products} />}
      </div>
    </div>
  );
}
