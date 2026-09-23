import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import type { ApiProduct } from "../../api";
import { Badge } from "../ui/index";
import { MarketplaceButtons } from "./MarketplaceButtons";

export function ProductCard({ product }: { product: ApiProduct }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const imgCallbackRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) setImgLoaded(true);
  }, []);

  const imageSrc = product.images?.[0];

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-charcoal-950/8 bg-white transition-all duration-500 hover:-translate-y-1.5 hover:border-copper-400/50 hover:shadow-[0_24px_48px_-12px_rgba(23,20,15,0.18),0_0_0_1px_rgba(184,112,62,0.2)]">
      {/* Entire card is clickable via this overlay link */}
      <Link
        to={`/products/${product.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${product.name}`}
      />

      {/* Image */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-beige-100">
        {!imgLoaded && imageSrc && (
          <div className="absolute inset-0 skeleton-shimmer" />
        )}
        {imageSrc ? (
          <img
            ref={imgCallbackRef}
            src={imageSrc}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-beige-100">
            <Package className="h-8 w-8 text-stone-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/30 via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

        <div className="absolute left-2 top-2 sm:left-3 sm:top-3 scale-90 sm:scale-100 origin-top-left">
          <Badge variant="copper">{product.category}</Badge>
        </div>

        {product.featured && (
          <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-charcoal-950/80 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-semibold uppercase tracking-wider text-copper-300 backdrop-blur-sm">
              ★ Featured
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-3 sm:p-4 md:p-5">

        {/* Title area */}
        <div className="min-h-[2.5rem] sm:min-h-[3rem]">
          <h3 className="line-clamp-2 font-display text-sm sm:text-base md:text-[1.05rem] leading-snug text-charcoal-950 transition-colors group-hover:text-copper-600">
            {product.name}
          </h3>
        </div>

        {/* Price & Code row */}
        <div className="mt-1 sm:mt-2 flex items-center justify-between gap-1 sm:gap-2">
          {product.price > 0 ? (
            <span className="font-display text-base sm:text-lg font-semibold text-copper-600">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          ) : (
            <span />
          )}
          {product.productCode && (
            <span className="shrink-0 rounded-full bg-beige-100 px-1.5 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              {product.productCode}
            </span>
          )}
        </div>

        {/* Description area */}
        <div className="mt-1 sm:mt-2 min-h-[2.5rem] sm:min-h-[2.75rem]">
          <p className="line-clamp-2 text-xs sm:text-sm leading-relaxed text-stone-500">
            {product.shortDescription || "\u00A0"}
          </p>
        </div>

        {/* Marketplace Buttons — z-20 so they sit above the card overlay link */}
        <div className="relative z-20 mt-auto pt-3 sm:pt-4">
          <MarketplaceButtons
            amazonUrl={product.amazonUrl}
            flipkartUrl={product.flipkartUrl}
            myntraUrl={product.myntraUrl}
            whatsappOrder={product.whatsappOrder}
            productName={product.name}
            productCode={product.productCode}
            productId={product._id}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: ApiProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-charcoal-950/12 py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-copper-50 text-copper-400">
          <Package className="h-7 w-7" />
        </div>
        <p className="font-display text-lg text-charcoal-950">No products found</p>
        <p className="mt-1.5 text-sm text-stone-500">Try adjusting your filters.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {products.map((product, i) => (
        <div
          key={product._id}
          className={`h-full animate-fade-up stagger-${Math.min(i + 1, 6)}`}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-charcoal-950/8 bg-white">
      <div className="aspect-[4/3] w-full shrink-0 skeleton-shimmer" />
      <div className="flex flex-1 flex-col p-3 sm:p-5 gap-2 sm:gap-3">
        <div className="h-4 w-16 sm:w-20 rounded-full skeleton-shimmer" />
        <div className="h-4 sm:h-5 w-3/4 rounded-lg skeleton-shimmer" />
        <div className="flex items-center justify-between gap-2">
          <div className="h-5 sm:h-6 w-20 sm:w-24 rounded-lg skeleton-shimmer" />
          <div className="h-3 sm:h-4 w-12 sm:w-16 rounded-full skeleton-shimmer" />
        </div>
        <div className="mt-1 space-y-2">
          <div className="h-2 sm:h-3 w-full rounded skeleton-shimmer" />
          <div className="h-2 sm:h-3 w-5/6 rounded skeleton-shimmer" />
        </div>
        <div className="mt-auto border-t border-charcoal-950/8 pt-3 sm:pt-4">
          <div className="h-3 sm:h-4 w-20 sm:w-24 rounded-full skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

/** Grid of skeleton product cards */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
