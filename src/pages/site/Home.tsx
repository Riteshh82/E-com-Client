import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Sparkles,
  PackageCheck,
  Handshake,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { ProductGrid, ProductGridSkeleton } from "../../components/site/ProductCard";
import { CategoryCard, CategoryCardSkeleton, BulkOrderCTA } from "../../components/site/Misc";
import { apiGetProducts, apiGetCategories, type ApiProduct, type ApiCategory } from "../../api";

const features = [
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    desc: "99.9% pure copper, finished by hand in every piece.",
  },
  {
    icon: Sparkles,
    title: "Modern Designs",
    desc: "Curated finishes developed with leading architects.",
  },
  {
    icon: PackageCheck,
    title: "Bulk Orders",
    desc: "Built for contractors, designers and large-scale projects.",
  },
  {
    icon: Handshake,
    title: "Marketplace Partners",
    desc: "Reliably stocked on Amazon & Flipkart.",
  },
];

const whyPoints = [
  "99.9% pure copper materials",
  "Unique hand-finished surface finishes",
  "8+ signature design options",
  "Suitable for residential and commercial",
  "Bulk quantity support & project pricing",
  "Reliable Amazon & Flipkart availability",
];

const stats = [
  { value: "8+", label: "Copper Finishes" },
  { value: "20+", label: "Collections" },
  { value: "500+", label: "Projects Completed" },
  { value: "B2B", label: "Bulk Ready" },
];

export default function Home() {
  const [featured, setFeatured] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    apiGetProducts({ featured: "true", status: "Published" })
      .then((r) => setFeatured(r.products))
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
    apiGetCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoadingCategories(false));
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/4 translate-x-1/4 rounded-full bg-copper-300/10 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 -translate-x-1/3 translate-y-1/3 rounded-full bg-copper-500/8 blur-[80px]" />

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-10 lg:px-10 lg:py-28">
          {/* Left */}
          <div className="relative z-10 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-copper-500/20 bg-copper-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-copper-700">
              <span className="h-1.5 w-1.5 animate-pulse-copper rounded-full bg-copper-500" />
              Architectural Copper — Crafted for Modern Interiors
            </span>

            <h1 className="mt-7 font-display text-5xl leading-[1.05] text-charcoal-950 sm:text-6xl lg:text-[3.5rem] xl:text-[4rem]">
              Timeless Copper.
              <br />
              <span className="copper-gradient-text">Designed for</span>
              <br />
              Modern Spaces.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-stone-600">
              Premium copper tiles and architectural surfaces crafted to bring warmth, character
              and elegance to every space — from intimate residential interiors to grand commercial
              lobbies.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="shadow-lg shadow-copper-500/20">
                  Explore Products
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/bulk-orders">
                <Button size="lg" variant="outline">
                  Request Bulk Quote
                </Button>
              </Link>
            </div>

            {/* Stats strip */}
            <div className="mt-12 flex flex-wrap gap-8 border-t border-charcoal-950/8 pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl text-copper-600">{s.value}</p>
                  <p className="text-xs text-stone-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — hero image */}
          <div className="relative animate-fade-up stagger-2">
            {/* Rotating ring decoration */}
            <div className="absolute -right-8 -top-8 h-72 w-72 animate-spin-slow rounded-full border border-copper-300/20" />
            <div className="absolute -right-4 -top-4 h-52 w-52 rounded-full border border-copper-400/15" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(23,20,15,0.22)]">
              <img
                src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85"
                alt="Premium copper architectural surface in a warm luxury interior"
                className="h-full w-full object-cover"
              />
              {/* Subtle warm overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-copper-500/5 via-transparent to-transparent" />
            </div>

            {/* Floating cards */}
            <div className="absolute -bottom-5 -left-6 hidden animate-float rounded-2xl border border-charcoal-950/8 bg-white p-5 shadow-2xl sm:block">
              <p className="font-display text-3xl text-copper-600">8+</p>
              <p className="mt-0.5 text-xs text-stone-500">Signature copper finishes</p>
            </div>

            <div className="absolute -right-5 top-1/3 hidden animate-float rounded-2xl border border-charcoal-950/8 bg-white p-4 shadow-xl sm:block" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <p className="text-xs font-medium text-charcoal-950">Bulk ready</p>
              </div>
              <p className="mt-1 text-[10px] text-stone-400">For architects & contractors</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section className="relative border-y border-charcoal-950/8 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-0 divide-x divide-y divide-charcoal-950/6 px-0 lg:grid-cols-4 lg:divide-y-0">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`flex items-start gap-4 px-8 py-8 transition-colors hover:bg-copper-50/50 animate-fade-up stagger-${i + 1}`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-copper-50 text-copper-600">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal-950">{f.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-stone-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-copper-600">
              Our Product
            </span>
            <h2 className="mt-2 font-display text-4xl text-charcoal-950">
              Best Seller
            </h2>
            <p className="mt-2.5 text-stone-500">
              Explore our most popular copper designs, each crafted to make a statement.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-charcoal-950/15 px-5 py-2.5 text-sm font-medium text-charcoal-950 transition-all hover:border-copper-400 hover:text-copper-600"
          >
            View all products <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        {loadingProducts
          ? <ProductGridSkeleton count={4} />
          : <ProductGrid products={featured} />
        }
      </section>

      {/* ── Divider ── */}
      <div className="section-divider mx-auto max-w-7xl px-10" />

      {/* ── Collections ── */}
      <section className="bg-beige-100/50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-copper-600">
                Browse
              </span>
              <h2 className="mt-2 font-display text-4xl text-charcoal-950">
                Shop by Categories
              </h2>
              <p className="mt-2.5 text-stone-500">
                Six curated copper ranges, each engineered for a different feel.
              </p>
            </div>
            <Link
              to="/collections"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-charcoal-950/15 px-5 py-2.5 text-sm font-medium text-charcoal-950 transition-all hover:border-copper-400 hover:text-copper-600"
            >
              All Categories <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loadingCategories
              ? Array.from({ length: 3 }).map((_, i) => <CategoryCardSkeleton key={i} />)
              : categories.slice(0, 3).map((c, i) => (
                  <div key={c._id} className={`animate-fade-up stagger-${i + 1}`}>
                    <CategoryCard category={c} />
                  </div>
                ))
            }
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Image side */}
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-copper-100/60 blur-3xl" />
            <div className="relative aspect-[5/6] overflow-hidden rounded-[2rem] shadow-[0_24px_64px_-12px_rgba(23,20,15,0.18)]">
              <img
                src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=85"
                alt="Premium copper architectural detail"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-copper-900/10 to-transparent" />
            </div>
            {/* Accent card */}
            <div className="absolute -bottom-6 right-6 rounded-2xl border border-charcoal-950/8 bg-white p-5 shadow-2xl">
              <p className="text-xs text-stone-500">Est.</p>
              <p className="font-display text-2xl text-charcoal-950">2018</p>
              <p className="mt-1 text-xs text-stone-400">Crafting copper surfaces</p>
            </div>
          </div>

          {/* Text side */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-copper-600">
              Why Next Steel Innovation
            </span>
            <h2 className="mt-3 font-display text-4xl leading-tight text-charcoal-950 sm:text-5xl">
              Built for Spaces That
              <br />
              <span className="copper-gradient-text">Stand Out</span>
            </h2>
            <p className="mt-5 text-stone-500 leading-relaxed">
              We design copper surfaces with architects and interior designers — not for
              mass-market shelves but for projects that demand character and craft.
            </p>

            <ul className="mt-8 space-y-4">
              {whyPoints.map((point, i) => (
                <li
                  key={point}
                  className={`flex items-start gap-3.5 animate-fade-up stagger-${i + 1}`}
                >
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-copper-100 text-copper-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-stone-700">{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/about">
                <Button variant="outline">Our Story <ArrowRight className="ml-1 h-4 w-4" /></Button>
              </Link>
              <Link to="/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bulk CTA ── */}
      <BulkOrderCTA />
    </div>
  );
}
