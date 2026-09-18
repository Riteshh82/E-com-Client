import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "../../data/mockData";
import { Button } from "../ui/Button";
import { Input, Textarea } from "../ui/index";
import { useToast } from "../../context/ToastContext";

/* ── CategoryCard ── */
export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="group relative flex h-[460px] flex-col justify-end overflow-hidden rounded-2xl"
    >
      <img
        src={category.image}
        alt={category.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-107"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/95 via-charcoal-950/40 to-transparent transition-opacity duration-400 group-hover:from-charcoal-950/80" />

      {/* Copper accent line */}
      <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-copper-400 to-copper-600 transition-all duration-500 group-hover:w-full" />

      <div className="relative p-7">
        {/* Product count badge */}
        <span className="mb-3 inline-flex items-center rounded-full bg-copper-500/20 px-3 py-1 text-[11px] font-medium text-copper-200 backdrop-blur-sm">
          {category.productCount} product{category.productCount !== 1 ? "s" : ""}
        </span>

        <h3 className="font-display text-2xl text-cream-50 transition-transform duration-300 group-hover:-translate-y-1">
          {category.name}
        </h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-stone-300 opacity-80 transition-opacity group-hover:opacity-100">
          {category.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-copper-300 transition-all duration-300 group-hover:gap-3 group-hover:text-copper-200">
          Explore
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
        </span>
      </div>
    </Link>
  );
}

/* ── BulkOrderCTA ── */
export function BulkOrderCTA() {
  const bullets = [
    "Bulk quantities at scale",
    "Custom project requirements",
    "Architect & contractor support",
    "Commercial grade orders",
  ];
  return (
    <section className="dark-section relative overflow-hidden">
      {/* Decorative copper ring */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full border border-copper-500/10" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border border-copper-500/8" />

      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-12 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-copper-400">
              B2B & Commercial
            </span>
            <h2 className="mt-3 font-display text-4xl leading-tight text-cream-50 sm:text-5xl">
              Planning a
              <br />
              <span className="copper-shimmer-text">Large Project?</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-stone-400">
              Whether you're an architect, contractor, interior designer, builder or business,
              talk to us about bulk copper tile requirements. We support projects of all scales —
              from a single restaurant to a large commercial facade.
            </p>
            <ul className="mt-7 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {bullets.map((point) => (
                <li key={point} className="flex items-center gap-2.5 text-sm text-stone-300">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-copper-400" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="shrink-0">
            <Link to="/bulk-orders">
              <Button size="lg" className="shadow-lg shadow-copper-500/25">
                Request Bulk Quote
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <p className="mt-3 text-center text-xs text-stone-500">
              Respond within 1 business day
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── ContactForm ── */
export function ContactForm() {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast("Message sent! We'll get back to you within one business day.");
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-copper-500/20 bg-gradient-to-br from-copper-50 to-white p-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-copper-100 text-copper-600">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="mt-4 font-display text-xl text-charcoal-950">Message Sent!</h3>
        <p className="mt-2 text-sm text-stone-600">
          Thank you for reaching out. Our team will get back to you within one business day.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-5 text-sm font-medium text-copper-600 hover:text-copper-700"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input label="Name" placeholder="Your full name" required />
        <Input label="Email" type="email" placeholder="you@company.com" required />
      </div>
      <Input label="Phone" type="tel" placeholder="+91 98765 43210" />
      <Textarea label="Message" placeholder="Tell us how we can help…" rows={5} required />
      <Button type="submit" className="w-full">
        Send Message
      </Button>
    </form>
  );
}

/* ── ProductGallery ── */
export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      {/* Main image */}
      <div className="group relative aspect-square overflow-hidden rounded-2xl bg-beige-100 shadow-xl">
        <img
          src={images[active]}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Copper frame on hover */}
        <div className="absolute inset-0 rounded-2xl ring-0 ring-copper-400/30 transition-all duration-300 group-hover:ring-2" />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 hover:opacity-100 ${
                active === i
                  ? "border-copper-500 opacity-100 shadow-md shadow-copper-500/20"
                  : "border-transparent opacity-60"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
