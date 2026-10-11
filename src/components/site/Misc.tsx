import { useState, useEffect, useCallback, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { ApiCategory } from "../../api";
import { Button } from "../ui/Button";
import { Input, Textarea } from "../ui/index";
import { useToast } from "../../context/ToastContext";
import { apiSubmitMessage } from "../../api";

/* ── CategoryCard (circular icon layout) ── */
const loadedCategoryImages = new Set<string>();

export function CategoryCard({ category }: { category: ApiCategory }) {
  const [imgLoaded, setImgLoaded] = useState(() => loadedCategoryImages.has(category.image));

  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="cat-item group flex flex-col items-center gap-3 text-center focus-visible:outline-none"
      aria-label={category.name}
    >
      {/* Circle container */}
      <div
        className="cat-circle relative flex items-center justify-center rounded-full bg-white"
        style={{
          width: "clamp(96px, 12vw, 140px)",
          height: "clamp(96px, 12vw, 140px)",
          border: "1.5px solid rgba(184, 112, 62, 0.25)",
          boxShadow: "0 2px 12px 0 rgba(23,20,15,0.06), 0 0 0 4px rgba(255,255,255,0.8)",
          willChange: "transform",
        }}
      >
        {!imgLoaded && (
          <div className="absolute inset-0 rounded-full skeleton-shimmer" />
        )}
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          decoding="async"
          onLoad={() => {
            loadedCategoryImages.add(category.image);
            setImgLoaded(true);
          }}
          className={`rounded-full object-cover transition-opacity duration-500 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Label */}
      <span
        className="cat-label max-w-[120px] text-center text-sm font-semibold leading-snug text-charcoal-950"
        style={{ wordBreak: "break-word", hyphens: "auto" }}
      >
        {category.name}
      </span>
    </Link>
  );
}

/** Shimmer skeleton matching the new circular category layout */
export function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="rounded-full skeleton-shimmer"
        style={{ width: "clamp(96px, 12vw, 140px)", height: "clamp(96px, 12vw, 140px)" }}
      />
      <div className="h-4 w-20 rounded-full skeleton-shimmer" />
    </div>
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
              B2B &amp; Commercial
            </span>
            <h2 className="mt-3 font-display text-4xl leading-tight text-cream-50 sm:text-5xl">
              Planning a
              <br />
              <span className="copper-shimmer-text">Large Project?</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-stone-400">
              Whether you're a retailer, contractor, interior designer or business,
              talk to us about bulk requirements for kitchen racks, trolleys, shelves and other
              storage products. We support orders of all sizes.
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
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      subject: "Website Contact Form",
      message: String(fd.get("message") ?? ""),
    };

    setSubmitting(true);
    try {
      await apiSubmitMessage(payload);
      setSubmitted(true);
      showToast("Message sent! We'll get back to you within one business day.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send message. Please try again.";
      showToast(message);
    } finally {
      setSubmitting(false);
    }
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
        <Input name="name" label="Name" placeholder="Your full name" required />
        <Input name="email" label="Email" type="email" placeholder="you@company.com" required />
      </div>
      <Input name="phone" label="Phone" type="tel" placeholder="+91 98765 43210" />
      <Textarea name="message" label="Message" placeholder="Tell us how we can help…" rows={5} required />
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}

/* ── ProductGallery ── */
export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  // Track which image URLs have already been loaded — avoids re-showing skeleton
  // for cached/previously-seen images when the user switches back
  const [loadedUrls, setLoadedUrls] = useState<Set<string>>(new Set());

  // Reset when the images array itself changes (navigating to a different product)
  useEffect(() => {
    setLoadedUrls(new Set());
    setActive(0);
  }, [images]);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleNext = () => setActive((prev) => (prev + 1) % images.length);
  const handlePrev = () => setActive((prev) => (prev - 1 + images.length) % images.length);

  const activeUrl = images[active];
  const isMainLoaded = loadedUrls.has(activeUrl);

  const markLoaded = (url: string) =>
    setLoadedUrls((prev) => new Set([...prev, url]));

  return (
    <div>
      {/* Main image */}
      <div className="group relative aspect-square overflow-hidden rounded-2xl bg-beige-100 shadow-xl">
        {/* Shimmer only while this specific URL hasn't loaded yet */}
        {!isMainLoaded && (
          <div className="absolute inset-0 skeleton-shimmer" />
        )}
        <img
          src={activeUrl}
          alt={name}
          onLoad={() => markLoaded(activeUrl)}
          className={`h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${isMainLoaded ? "opacity-100" : "opacity-0"}`}
        />
        {/* Copper frame on hover */}
        <div className="absolute inset-0 rounded-2xl ring-0 ring-copper-400/30 transition-all duration-300 group-hover:ring-2 pointer-events-none" />

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-charcoal-950 backdrop-blur-sm transition-all hover:bg-white hover:text-copper-600 opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-charcoal-950 backdrop-blur-sm transition-all hover:bg-white hover:text-copper-600 opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <ThumbnailButton
              key={img + i}
              src={img}
              index={i}
              active={active}
              preloaded={loadedUrls.has(img)}
              onLoaded={() => markLoaded(img)}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Individual thumbnail with its own load state */
function ThumbnailButton({
  src, index, active, preloaded, onLoaded, onClick,
}: {
  src: string; index: number; active: number;
  preloaded: boolean; onLoaded: () => void; onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(preloaded);

  // Callback ref: if the image is already browser-cached when React mounts
  // the element, node.complete is true immediately — skip skeleton.
  const thumbRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && !loaded) { setLoaded(true); onLoaded(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoad = () => { setLoaded(true); onLoaded(); };

  return (
    <button
      onClick={onClick}
      className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 hover:opacity-100 ${
        active === index
          ? "border-copper-500 opacity-100 shadow-md shadow-copper-500/20"
          : "border-transparent opacity-60"
      }`}
      aria-label={`View image ${index + 1}`}
    >
      {!loaded && <div className="absolute inset-0 skeleton-shimmer" />}
      <img
        ref={thumbRef}
        src={src}
        alt=""
        onLoad={handleLoad}
        className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </button>
  );
}

