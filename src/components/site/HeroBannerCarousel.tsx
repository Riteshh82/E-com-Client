import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "../ui/Button";
import type { ApiHeroBanner } from "../../api";

interface HeroBannerCarouselProps {
  banners: ApiHeroBanner[];
  loading?: boolean;
}

export function HeroBannerCarousel({ banners, loading = false }: HeroBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = banners.length;

  const nextSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // 5-second auto-rotation interval
  useEffect(() => {
    if (total <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000);

    return () => clearInterval(timer);
  }, [total]);

  // Touch swipe support for smartphones and tablets
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped left -> Next
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> Previous
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  // Skeleton state while loading
  if (loading) {
    return (
      <div className="relative w-full overflow-hidden bg-stone-100 h-[calc(100vh-5rem)] h-[calc(100dvh-5rem)] sm:h-auto sm:aspect-[16/9] lg:aspect-[21/9] animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200" />
      </div>
    );
  }

  // Graceful Fallback Hero if no active banners exist
  if (total === 0) {
    return (
      <section className="hero-gradient relative overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/4 translate-x-1/4 rounded-full bg-copper-300/10 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 -translate-x-1/3 translate-y-1/3 rounded-full bg-copper-500/8 blur-[80px]" />

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:gap-10 lg:px-10 lg:py-16">
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
                  Shop Products <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/collections">
                <Button size="lg" variant="outline">
                  Explore Categories
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-up stagger-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(23,20,15,0.22)]">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80"
                alt="Organized modern kitchen with high grade steel racks"
                width={800}
                height={1000}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentIndex];
  const isExternalUrl = currentBanner.ctaUrl?.startsWith("http");

  return (
    <div
      className="group relative w-full overflow-hidden bg-charcoal-950 select-none focus:outline-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotional Hero Banners"
    >
      {/* ── Banner Slides Container ── */}
      <div className="relative w-full h-[calc(100vh-5rem)] h-[calc(100dvh-5rem)] sm:h-auto sm:aspect-[16/9] lg:aspect-[21/9] sm:max-h-[660px]">
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={banner._id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
              }`}
              aria-hidden={!isActive}
            >
              {/* Responsive Image with <picture> element for optimal performance */}
              <picture className="block h-full w-full">
                {/* Mobile viewport source */}
                <source
                  media="(max-width: 767px)"
                  srcSet={banner.mobileImageUrl}
                  type={banner.mobileMetadata?.mimeType || undefined}
                />
                {/* Desktop and tablet viewport source */}
                <source
                  media="(min-width: 768px)"
                  srcSet={banner.desktopImageUrl}
                  type={banner.desktopMetadata?.mimeType || undefined}
                />
                {/* Fallback img */}
                <img
                  src={banner.desktopImageUrl}
                  alt={banner.title || banner.name}
                  width={banner.desktopMetadata?.width || 1920}
                  height={banner.desktopMetadata?.height || 820}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="h-full w-full object-cover object-center transform transition-transform duration-[6000ms] ease-out scale-100 group-hover:scale-[1.02]"
                />
              </picture>

              {/* Text & CTA Overlay (if banner has title or CTA) */}
              {(banner.title || banner.subtitle || banner.ctaText) && (
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent sm:bg-gradient-to-r sm:from-charcoal-950/45 sm:via-charcoal-950/15 sm:to-transparent flex items-end sm:items-center px-6 pb-16 sm:pb-0 sm:px-12 lg:px-20">
                  <div className="max-w-xl text-left space-y-3 sm:space-y-4 animate-fade-in">
                    {banner.title && (
                      <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] leading-tight">
                        {banner.title}
                      </h2>
                    )}
                    {banner.subtitle && (
                      <p className="text-xs sm:text-base text-stone-100 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
                        {banner.subtitle}
                      </p>
                    )}

                    {banner.ctaText && banner.ctaUrl && (
                      <div className="pt-2 sm:pt-4">
                        {isExternalUrl ? (
                          <a
                            href={banner.ctaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-copper-500 px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-xl shadow-copper-500/25 transition-all hover:bg-copper-600 hover:shadow-copper-500/40 active:scale-95"
                          >
                            {banner.ctaText}
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        ) : (
                          <Link
                            to={banner.ctaUrl}
                            className="inline-flex items-center gap-2 rounded-full bg-copper-500 px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-xl shadow-copper-500/25 transition-all hover:bg-copper-600 hover:shadow-copper-500/40 active:scale-95"
                          >
                            {banner.ctaText}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* If banner has ctaUrl but no text overlay, make whole banner clickable */}
              {!banner.title && !banner.ctaText && banner.ctaUrl && (
                isExternalUrl ? (
                  <a
                    href={banner.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-20"
                    aria-label={banner.name}
                  />
                ) : (
                  <Link
                    to={banner.ctaUrl}
                    className="absolute inset-0 z-20"
                    aria-label={banner.name}
                  />
                )
              )}
            </div>
          );
        })}
      </div>

      {/* ── Carousel Controls (Only visible when multiple banners exist) ── */}
      {total > 1 && (
        <>
          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous banner"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-charcoal-950/40 backdrop-blur-md text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 hover:bg-charcoal-950/70 hover:scale-105 active:scale-95 shadow-lg"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next banner"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-charcoal-950/40 backdrop-blur-md text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 hover:bg-charcoal-950/70 hover:scale-105 active:scale-95 shadow-lg"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Dot Navigation & Progress Indicators */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full bg-charcoal-950/40 backdrop-blur-md px-3 py-1.5 border border-white/10 shadow-lg">
            {banners.map((b, idx) => {
              const active = idx === currentIndex;
              return (
                <button
                  key={b._id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to banner slide ${idx + 1}`}
                  className={`relative h-2 rounded-full transition-all duration-300 ${
                    active
                      ? "w-7 bg-copper-500 shadow-sm"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
