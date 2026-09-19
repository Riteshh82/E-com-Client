import { Link } from "react-router-dom";
import { ArrowUpRight, Package } from "lucide-react";
import type { ApiProduct } from "../../api";
import { Badge } from "../ui/index";
import { MarketplaceButtons } from "./MarketplaceButtons";

export function ProductCard({ product }: { product: ApiProduct }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-charcoal-950/8 bg-white transition-all duration-500 hover:-translate-y-1.5 hover:border-copper-400/50 hover:shadow-[0_24px_48px_-12px_rgba(23,20,15,0.18),0_0_0_1px_rgba(184,112,62,0.2)]">
      {/* Image */}
      <Link
        to={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-beige-100"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/30 via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

        {/* Category badge */}
        <div className="absolute left-3 top-3">
          <Badge variant="copper">{product.category}</Badge>
        </div>

        {/* Featured badge */}
        {product.featured && (
          <div className="absolute right-3 top-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-charcoal-950/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-copper-300 backdrop-blur-sm">
              ★ Featured
            </span>
          </div>
        )}

        {/* Quick view on hover */}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <span className="flex-1 rounded-xl bg-white/90 px-3 py-2 text-center text-xs font-semibold text-charcoal-950 backdrop-blur-sm transition-colors hover:bg-copper-500 hover:text-white">
              Quick View
            </span>
          </div>
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-display text-[1.05rem] leading-snug text-charcoal-950 transition-colors group-hover:text-copper-600">
            {product.name}
          </h3>
        </Link>

        {/* Price & Code row */}
        <div className="mt-2 flex items-center justify-between gap-2">
          {product.price > 0 ? (
            <span className="font-display text-lg font-semibold text-copper-600">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          ) : (
            <span />
          )}
          {product.productCode && (
            <span className="rounded-full bg-beige-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              {product.productCode}
            </span>
          )}
        </div>

        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-stone-500">
          {product.shortDescription}
        </p>

        {/* Actions */}
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-2 border-t border-charcoal-950/8 pt-4">
            <Link
              to={`/products/${product.slug}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-charcoal-950 transition-colors hover:text-copper-600"
            >
              View Details
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-3">
            <MarketplaceButtons
              amazonUrl={product.amazonUrl}
              flipkartUrl={product.flipkartUrl}
              size="sm"
            />
          </div>
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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, i) => (
        <div
          key={product._id}
          className={`animate-fade-up stagger-${Math.min(i + 1, 6)}`}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
