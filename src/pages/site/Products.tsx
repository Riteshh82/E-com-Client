import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductGrid } from "../../components/site/ProductCard";
import { products, categories } from "../../data/mockData";
import { cn } from "../../lib/utils";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "all";
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (p.status !== "Published") return false;
      const matchesCategory =
        activeCategory === "all" ||
        categories.find((c) => c.slug === activeCategory)?.name === p.category;
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <div>
      {/* ── Page header ── */}
      <section className="border-b border-charcoal-950/8 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-copper-600">
            Full Range
          </span>
          <h1 className="mt-2 font-display text-5xl text-charcoal-950">Products</h1>
          <p className="mt-3 max-w-xl text-stone-500">
            Browse our full range of copper tiles, panels and architectural surfaces — each
            crafted to bring warmth and character to any space.
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
                className="w-full rounded-full border border-charcoal-950/15 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition-colors focus:border-copper-500 focus:ring-2 focus:ring-copper-500/15"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-charcoal-950"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Result count */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-stone-500">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}{" "}
            {activeCategory !== "all" && (
              <span>
                in{" "}
                <span className="font-medium text-charcoal-950">
                  {categories.find((c) => c.slug === activeCategory)?.name}
                </span>
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

        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
