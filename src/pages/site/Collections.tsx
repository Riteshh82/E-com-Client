import { useEffect, useState } from "react";
import { CategoryCard, CategoryCardSkeleton } from "../../components/site/Misc";
import { apiGetCategories, type ApiCategory } from "../../api";
import { ArrowDownRight } from "lucide-react";

export default function Collections() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-charcoal-950">
        <div className="pointer-events-none absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80"
            alt="Organised kitchen with storage racks and shelves"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal-950 via-charcoal-950/90 to-copper-900/30" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-copper-400/30 bg-copper-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-copper-300">
              Our Ranges
            </span>
            <h1 className="mt-5 font-display text-5xl leading-tight text-cream-50 sm:text-6xl lg:text-7xl">
              Categories
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-400">
              Browse our full range of kitchen and home storage categories — from racks and
              trolleys to shelves, baskets and utility stands.
            </p>
          </div>
          <div className="mt-10 flex items-center gap-2 text-sm text-copper-400 animate-float">
            <ArrowDownRight className="h-4 w-4" />
            <span>Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid grid-cols-3 gap-x-4 gap-y-12 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 justify-items-center">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))
            : categories.map((c, i) => (
                <div key={c._id} className={`animate-fade-up stagger-${Math.min(i + 1, 6)} flex justify-center`}>
                  <CategoryCard category={c} />
                </div>
              ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <div className="rounded-3xl border border-charcoal-950/8 bg-gradient-to-br from-beige-100 to-cream-50 p-10 text-center">
          <h2 className="font-display text-3xl text-charcoal-950">
            Can't find the right product?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-stone-500">
            Talk to our team about specific product requirements, availability or get a quote
            for bulk quantities before placing your order.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="/bulk-orders" className="inline-flex items-center gap-2 rounded-full bg-charcoal-950 px-6 py-3 text-sm font-semibold text-cream-50 transition-all hover:bg-copper-600 hover:-translate-y-0.5 hover:shadow-lg">
              Request Bulk Quote
            </a>
            <a href="/contact" className="inline-flex items-center gap-2 rounded-full border border-charcoal-950/15 px-6 py-3 text-sm font-semibold text-charcoal-950 transition-all hover:border-copper-400 hover:text-copper-600">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
