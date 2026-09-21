import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGetProduct, apiGetProducts, type ApiProduct } from "../../api";
import { ProductGallery } from "../../components/site/Misc";
import { Badge } from "../../components/ui/index";
import { MarketplaceButtons } from "../../components/site/MarketplaceButtons";
import { Button } from "../../components/ui/Button";
import { ProductGrid, ProductGridSkeleton } from "../../components/site/ProductCard";
import { ChevronRight, CheckCircle2, Package, ArrowRight } from "lucide-react";

const specLabels: Record<string, string> = {
  material: "Material",
  finish: "Finish",
  dimensions: "Dimensions",
  weight: "Weight",
  color: "Color",
};

/** Returns true if value is non-empty (string, array, number) */
function hasValue(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0 && v.some((x) => String(x).trim().length > 0);
  if (typeof v === "number") return v > 0;
  return false;
}

/** Full-page skeleton that mirrors the ProductDetail layout */
function ProductDetailSkeleton() {
  return (
    <div className="bg-cream-50">
      {/* Breadcrumb skeleton */}
      <div className="border-b border-charcoal-950/8 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-3.5 lg:px-10">
          <div className="h-3 w-10 rounded skeleton-shimmer" />
          <div className="h-3 w-2 rounded skeleton-shimmer" />
          <div className="h-3 w-16 rounded skeleton-shimmer" />
          <div className="h-3 w-2 rounded skeleton-shimmer" />
          <div className="h-3 w-32 rounded skeleton-shimmer" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Gallery skeleton */}
          <div className="lg:max-w-[460px] mx-auto w-full space-y-4">
            <div className="aspect-square w-full rounded-2xl skeleton-shimmer shadow-xl" />
            <div className="flex gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-20 w-20 shrink-0 rounded-xl skeleton-shimmer" />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex gap-2">
              <div className="h-6 w-28 rounded-full skeleton-shimmer" />
              <div className="h-6 w-20 rounded-full skeleton-shimmer" />
            </div>
            {/* Title */}
            <div className="space-y-2 pt-1">
              <div className="h-8 w-4/5 rounded-lg skeleton-shimmer" />
              <div className="h-8 w-2/3 rounded-lg skeleton-shimmer" />
            </div>
            {/* Price */}
            <div className="flex items-center gap-3 pt-1">
              <div className="h-7 w-24 rounded-lg skeleton-shimmer" />
              <div className="h-5 w-20 rounded-full skeleton-shimmer" />
            </div>
            {/* Description */}
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full rounded skeleton-shimmer" />
              <div className="h-4 w-5/6 rounded skeleton-shimmer" />
              <div className="h-4 w-4/5 rounded skeleton-shimmer" />
              <div className="h-4 w-3/4 rounded skeleton-shimmer" />
            </div>
            {/* Specs table */}
            <div className="mt-4 overflow-hidden rounded-2xl border border-charcoal-950/8">
              <div className="h-10 skeleton-shimmer border-b border-charcoal-950/8" />
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-charcoal-950/6">
                  <div className="h-4 w-20 rounded skeleton-shimmer" />
                  <div className="h-4 w-32 rounded skeleton-shimmer" />
                </div>
              ))}
            </div>
            {/* Marketplace buttons */}
            <div className="flex gap-3 pt-2">
              <div className="h-11 flex-1 rounded-xl skeleton-shimmer" />
              <div className="h-11 flex-1 rounded-xl skeleton-shimmer" />
            </div>
            {/* Bulk panel */}
            <div className="h-32 w-full rounded-2xl skeleton-shimmer" />
          </div>
        </div>

        {/* Related products skeleton */}
        <div className="mt-28">
          <div className="mb-10">
            <div className="h-3 w-28 rounded skeleton-shimmer" />
            <div className="mt-2 h-8 w-48 rounded-lg skeleton-shimmer" />
          </div>
          <ProductGridSkeleton count={4} />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [related, setRelated] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    setProduct(null);
    setRelated([]);

    apiGetProduct(slug)
      .then((p) => {
        setProduct(p);
        // Load related products from same category
        return apiGetProducts({ category: p.category, status: "Published" }).then((r) =>
          setRelated(r.products.filter((x) => x._id !== p._id).slice(0, 4))
        );
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-copper-50 text-copper-400">
          <Package className="h-9 w-9" />
        </div>
        <h1 className="mt-6 font-display text-3xl text-charcoal-950">Product not found</h1>
        <p className="mt-3 text-stone-500">This product may have been moved or removed.</p>
        <Link to="/products" className="mt-8 inline-block">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  // Conditional specs — only show rows with actual values
  const specRows = Object.entries(specLabels).filter(([key]) =>
    hasValue(product.specifications[key as keyof typeof product.specifications])
  );
  const hasApplications = hasValue(product.specifications.applications);
  const hasAnySpec = specRows.length > 0 || hasApplications;

  return (
    <div className="bg-cream-50">
      {/* ── Breadcrumb ── */}
      <nav className="border-b border-charcoal-950/8 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-1.5 px-6 py-3.5 text-sm text-stone-500 lg:px-10">
          <Link to="/" className="hover:text-copper-600">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 text-stone-300" />
          <Link to="/products" className="hover:text-copper-600">Products</Link>
          <ChevronRight className="h-3.5 w-3.5 text-stone-300" />
          <Link to={`/products?category=${product.category.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-copper-600">
            {product.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-stone-300" />
          <span className="text-charcoal-950">{product.name}</span>
        </div>
      </nav>

      {/* ── Main product ── */}
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Gallery */}
          <div className="animate-fade-up lg:max-w-[460px] mx-auto w-full">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* Info */}
          <div className="animate-fade-up stagger-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="copper">{product.category}</Badge>
              {product.featured && (
                <Badge variant="dark">★ Featured</Badge>
              )}
              {product.bulkAvailable && (
                <Badge variant="neutral">Bulk Available</Badge>
              )}
            </div>

            <h1 className="mt-4 font-display text-3xl leading-tight text-charcoal-950 sm:text-4xl">
              {product.name}
            </h1>

            {/* Price & Product Code */}
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {product.price > 0 && (
                <span className="font-display text-2xl font-semibold text-copper-600">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              )}
              {product.productCode && (
                <span className="rounded-full border border-charcoal-950/10 bg-beige-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Code: {product.productCode}
                </span>
              )}
            </div>

            <p className="mt-5 text-sm leading-relaxed text-stone-600">
              {product.fullDescription}
            </p>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="neutral">{tag}</Badge>
              ))}
            </div>

            {/* Available finishes */}
            {product.finishes.length > 0 && (
              <div className="mt-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Available Finishes
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.finishes.map((f, i) => (
                    <button
                      key={f}
                      className={`rounded-full border px-4 py-2 text-sm transition-all ${
                        i === 0
                          ? "border-copper-500 bg-copper-500 text-white"
                          : "border-charcoal-950/15 text-charcoal-950 hover:border-copper-400"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specs table — only shown when at least one spec has a value */}
            {hasAnySpec && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-charcoal-950/8">
                <div className="bg-beige-100/60 px-5 py-3.5 border-b border-charcoal-950/8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Specifications
                  </p>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {specRows.map(([key, label], i) => (
                      <tr key={key} className={i % 2 === 0 ? "bg-white" : "bg-beige-100/30"}>
                        <td className="w-2/5 px-5 py-3 font-medium text-charcoal-800">{label}</td>
                        <td className="px-5 py-3 text-stone-600">
                          {String(product.specifications[key as keyof typeof product.specifications])}
                        </td>
                      </tr>
                    ))}
                    {hasApplications && (
                      <tr className={specRows.length % 2 === 0 ? "bg-white" : "bg-beige-100/30"}>
                        <td className="w-2/5 px-5 py-3 font-medium text-charcoal-800">Applications</td>
                        <td className="px-5 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {product.specifications.applications.filter((a) => a.trim()).map((a) => (
                              <span key={a} className="flex items-center gap-1 text-xs text-stone-600">
                                <CheckCircle2 className="h-3 w-3 text-copper-500" /> {a}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Buy online */}
            <div className="mt-9 border-t border-charcoal-950/8 pt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Buy Online
              </p>
              <p className="mt-1.5 text-sm text-stone-400">
                Available on leading Indian marketplaces.
              </p>
              <div className="mt-4">
                <MarketplaceButtons
                  amazonUrl={product.amazonUrl}
                  flipkartUrl={product.flipkartUrl}
                  myntraUrl={product.myntraUrl}
                  whatsappOrder={product.whatsappOrder}
                  productName={product.name}
                  productCode={product.productCode}
                />
              </div>
            </div>

            {/* Bulk panel */}
            <div className="mt-6 overflow-hidden rounded-2xl bg-charcoal-950 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-copper-500/15 text-copper-300">
                  <Package className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg text-cream-50">Need Bulk Quantity?</h3>
                  <p className="mt-1 text-sm text-stone-400">
                    Get project pricing for {product.name.toLowerCase()} at scale.
                    We support all commercial and residential bulk requirements.
                  </p>
                  <Link
                    to="/bulk-orders"
                    state={{ product: product.name }}
                    className="mt-4 inline-flex items-center gap-1.5"
                  >
                    <Button variant="primary" size="sm">
                      Request Bulk Quote
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-28">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-copper-600">
                  Same Collection
                </span>
                <h2 className="mt-2 font-display text-3xl text-charcoal-950">
                  You May Also Like
                </h2>
              </div>
              <Link
                to={`/products?category=${product.category.toLowerCase().replace(/\s+/g, "-")}`}
                className="hidden items-center gap-1.5 text-sm font-medium text-copper-600 hover:text-copper-700 sm:inline-flex"
              >
                View all in {product.category}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ProductGrid products={related} />
          </div>
        )}
      </div>
    </div>
  );
}
