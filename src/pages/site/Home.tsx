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
import { apiGetProducts, apiGetCategories, apiGetNewlyAddeds, type ApiProduct, type ApiCategory, type ApiNewlyAdded } from "../../api";

const features = [
  {
    icon: ShieldCheck,
    title: "Durable Quality",
    desc: "Sturdy steel construction built to handle everyday kitchen and home use.",
  },
  {
    icon: Sparkles,
    title: "Practical Design",
    desc: "Every product is designed to maximise space and simplify organisation.",
  },
  {
    icon: PackageCheck,
    title: "Bulk Orders",
    desc: "Built for retailers, contractors and large-scale procurement.",
  },
  {
    icon: Handshake,
    title: "Marketplace Partners",
    desc: "Reliably stocked on Amazon, Flipkart and Myntra.",
  },
];

const whyPoints = [
  "Durable steel and metal construction",
  "Space-saving designs for modern kitchens",
  "Wide range of storage and organizer products",
  "Suitable for residential and commercial use",
  "Bulk quantity support & project pricing",
  "Available on Amazon, Flipkart & Myntra",
];

const stats = [
  { value: "200+", label: "Product" },
  { value: "D2C", label: "Bulk Ready" },
  { value: "B2B", label: "Bulk Ready" },
];
export default function Home() {
  const [featured, setFeatured] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [newlyAddeds, setNewlyAddeds] = useState<ApiNewlyAdded[]>([]);

  useEffect(() => {
    let isMounted = true;
    apiGetNewlyAddeds((data) => { if (isMounted) setNewlyAddeds(data); })
      .then((data) => { if (isMounted) setNewlyAddeds(data); })
      .catch(() => {});
      
    apiGetProducts({ featured: "true", status: "Published" }, (r) => { if (isMounted) setFeatured(r.products); })
      .then((r) => {
        if (!isMounted) return;
        setFeatured(r.products);
        setLoadingProducts(false);
      })
      .catch(() => { if (isMounted) setLoadingProducts(false); });
      
    apiGetCategories((data) => { if (isMounted) setCategories(data); })
      .then((data) => {
        if (!isMounted) return;
        setCategories(data);
        setLoadingCategories(false);
      })
      .catch(() => { if (isMounted) setLoadingCategories(false); });

    return () => { isMounted = false; };
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/4 translate-x-1/4 rounded-full bg-copper-300/10 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 -translate-x-1/3 translate-y-1/3 rounded-full bg-copper-500/8 blur-[80px]" />

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:gap-10 lg:px-10 lg:py-16">
          {/* Left */}
          <div className="relative z-10 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-copper-500/20 bg-copper-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-copper-700">
              <span className="h-1.5 w-1.5 animate-pulse-copper rounded-full bg-copper-500" />
              Kitchen &amp; Home Storage Solutions
            </span>

            <h1 className="mt-7 font-display text-5xl leading-[1.05] text-charcoal-950 sm:text-6xl lg:text-[3.5rem] xl:text-[4rem]">
              Smart Storage
              <br />
              <span className="copper-gradient-text">for a Better</span>
              <br />
              Kitchen.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-stone-600">
              Practical kitchen racks, trolleys, organizers and storage solutions designed to
              make everyday spaces more functional, tidy and easy to use.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="shadow-lg shadow-copper-500/20">
                  Shop Products
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/collections">
                <Button size="lg" variant="outline">
                  Explore Categories
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
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=85"
                alt="Well-organised modern kitchen with storage racks and shelves"
                className="h-full w-full object-cover"
              />
              {/* Subtle warm overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-copper-500/5 via-transparent to-transparent" />
            </div>

            {/* Floating cards */}
            <div className="absolute -bottom-2 -left-6 hidden animate-float rounded-2xl border border-charcoal-950/8 bg-white p-5 shadow-2xl sm:block">
              <p className="font-display text-3xl text-copper-600">50+</p>
              <p className="mt-0.5 text-xs text-stone-500">Storage product variants</p>
            </div>

            <div className="absolute -right-5 top-1/8 hidden animate-float rounded-2xl border border-charcoal-950/8 bg-white p-4 shadow-xl sm:block" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <p className="text-xs font-medium text-charcoal-950">Bulk ready</p>
              </div>
              <p className="mt-1 text-[10px] text-stone-400">For retailers &amp; businesses</p>
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

      {/* ── Shop by Categories ── */}
      <section className="bg-white border-y border-charcoal-950/6">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          {/* Section heading */}
          <div className="mb-12 text-center">
            <h2 className="font-display text-4xl text-charcoal-950">
              Shop by{" "}
              <span className="font-bold underline decoration-copper-500 underline-offset-4">Categories</span>
            </h2>
            <p className="mt-3 text-stone-500 text-sm">Discover storage and organizer solutions for every room</p>
          </div>

          {/* Circular category grid */}
          <div className="grid grid-cols-3 gap-x-4 gap-y-10 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 justify-items-center">
            {loadingCategories
              ? Array.from({ length: 8 }).map((_, i) => <CategoryCardSkeleton key={i} />)
              : categories.map((c, i) => (
                <div key={c._id} className={`animate-fade-up stagger-${Math.min(i + 1, 6)} flex justify-center`}>
                  <CategoryCard category={c} />
                </div>
              ))
            }
          </div>
        </div>
      </section>


      {/* ── NewlyAddeds / Newly Added Products ── */}
      {newlyAddeds.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="mb-10 text-center">
            <h2 className="font-display text-4xl text-charcoal-950">
              Newly Added <span className="font-bold underline decoration-copper-500 underline-offset-4">Products</span>
            </h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {newlyAddeds.map((b, i) => {
              // If total is odd, the last item spans full width
              const isLastAndOdd = newlyAddeds.length % 2 !== 0 && i === newlyAddeds.length - 1;
              
              return (
                <Link
                  key={b._id}
                  to={`/products?category=${b.categorySlug}&newlyAdded=true`}
                  className={`group relative block overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-lg ${isLastAndOdd ? "md:col-span-2" : ""}`}
                >
                  {/* Keep an aspect ratio to avoid layout shifts, but full width */}
                  <div className={`relative w-full overflow-hidden ${isLastAndOdd ? "aspect-[21/9]" : "aspect-[16/9]"}`}>
                    <img 
                      src={b.imageUrl} 
                      alt="New product collection" 
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Featured Products ── */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-copper-600">
              Our Products
            </span>
            <h2 className="mt-2 font-display text-4xl text-charcoal-950">
              Best Sellers
            </h2>
            <p className="mt-2.5 text-stone-500">
              Our most popular kitchen storage and organizer products.
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

      
      {/* ── Why Choose Us ── */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Image side */}
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-copper-100/60 blur-3xl" />
            <div className="relative aspect-[5/6] overflow-hidden rounded-[2rem] shadow-[0_24px_64px_-12px_rgba(23,20,15,0.18)]">
              <img
                src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=85"
                alt="Organised kitchen with racks and storage solutions"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-charcoal-950/10 to-transparent" />
            </div>
            {/* Accent card */}
            <div className="absolute -bottom-6 right-6 rounded-2xl border border-charcoal-950/8 bg-white p-5 shadow-2xl">
              <p className="text-xs text-stone-500">Est.</p>
              <p className="font-display text-2xl text-charcoal-950">2018</p>
              <p className="mt-1 text-xs text-stone-400">Kitchen &amp; home storage</p>
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
              <span className="copper-gradient-text">Stay Organised</span>
            </h2>
            <p className="mt-5 text-stone-500 leading-relaxed">
              We design and supply kitchen storage products with practical functionality in mind —
              not just aesthetics. Every rack, trolley and organizer is built to make daily life
              easier and your kitchen more efficient.
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
