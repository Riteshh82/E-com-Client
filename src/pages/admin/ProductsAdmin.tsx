import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Eye, Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { apiGetProducts, apiGetCategories, apiDeleteProduct, type ApiProduct, type ApiCategory } from "../../api";
import { Badge } from "../../components/ui/index";
import { Button } from "../../components/ui/Button";
import { ConfirmDialog, EmptyState } from "../../components/ui/Overlay";
import { useToast } from "../../context/ToastContext";

export default function ProductsAdmin() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [featured, setFeatured] = useState("all");
  const [toDelete, setToDelete] = useState<ApiProduct | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const loadData = () => {
    setLoading(true);
    setError(null);
    Promise.all([apiGetProducts({ limit: "200" }), apiGetCategories()])
      .then(([productsRes, cats]) => {
        setProducts(productsRes.products);
        setCategories(cats);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (category !== "all" && p.category !== category) return false;
      if (status !== "all" && p.status !== status) return false;
      if (featured === "featured" && !p.featured) return false;
      if (featured === "not" && p.featured) return false;
      return true;
    });
  }, [products, query, category, status, featured]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await apiDeleteProduct(toDelete._id);
      setProducts((prev) => prev.filter((p) => p._id !== toDelete._id));
      showToast(`${toDelete.name} was deleted.`);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Delete failed.";
      showToast(message);
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-charcoal-950">Products</h1>
          <p className="mt-1 text-sm text-stone-500">{products.length} products in catalog</p>
        </div>
        <Link to="/admin/products/new">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-charcoal-950/8 bg-white p-4">
        <div className="flex items-center gap-2 rounded-lg border border-charcoal-950/12 px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-charcoal-950/12 px-3 py-2 text-sm outline-none focus:border-copper-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-charcoal-950/12 px-3 py-2 text-sm outline-none focus:border-copper-500"
          >
            <option value="all">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
          <select
            value={featured}
            onChange={(e) => setFeatured(e.target.value)}
            className="col-span-2 w-full rounded-lg border border-charcoal-950/12 px-3 py-2 text-sm outline-none focus:border-copper-500 sm:col-span-1"
          >
            <option value="all">Featured &amp; Not</option>
            <option value="featured">Featured Only</option>
            <option value="not">Not Featured</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-copper-500" />
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your search or filters, or add a new product."
              action={
                <Link to="/admin/products/new">
                  <Button size="sm">
                    <Plus className="h-4 w-4" /> Add Product
                  </Button>
                </Link>
              }
            />
          ) : (
            <>
              {/* ── Mobile card list (hidden on md+) ── */}
              <div className="space-y-3 md:hidden">
                {filtered.map((p) => (
                  <div key={p._id} className="rounded-2xl border border-charcoal-950/8 bg-white p-4">
                    <div className="flex items-start gap-3">
                      {p.images[0] ? (
                        <img src={p.images[0]} alt={p.name} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                      ) : (
                        <div className="h-14 w-14 shrink-0 rounded-xl bg-beige-100" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-charcoal-950">{p.name}</p>
                        <p className="mt-0.5 text-xs text-stone-500">{p.category}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <Badge variant={p.status === "Published" ? "success" : "warning"}>{p.status}</Badge>
                          {p.featured && <Badge variant="copper">Featured</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-charcoal-950/6 pt-3">
                      <div className="flex items-center gap-3 text-xs text-stone-500">
                        {p.amazonUrl && (
                          <a href={p.amazonUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-copper-600">
                            <ExternalLink className="h-3 w-3" /> Amazon
                          </a>
                        )}
                        {p.flipkartUrl && (
                          <a href={p.flipkartUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-copper-600">
                            <ExternalLink className="h-3 w-3" /> Flipkart
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/products/${p.slug}`}
                          target="_blank"
                          className="rounded-lg p-2 text-stone-500 hover:bg-beige-100 hover:text-charcoal-950"
                          aria-label="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/products/${p._id}/edit`}
                          className="rounded-lg p-2 text-stone-500 hover:bg-beige-100 hover:text-charcoal-950"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setToDelete(p)}
                          className="rounded-lg p-2 text-stone-500 hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Desktop table (hidden on mobile) ── */}
              <div className="hidden overflow-x-auto rounded-2xl border border-charcoal-950/8 bg-white md:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-charcoal-950/8 bg-beige-100/40 text-xs uppercase tracking-wide text-stone-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">Image</th>
                      <th className="px-5 py-3 font-medium">Product Name</th>
                      <th className="px-5 py-3 font-medium">Category</th>
                      <th className="px-5 py-3 font-medium">Amazon</th>
                      <th className="px-5 py-3 font-medium">Flipkart</th>
                      <th className="px-5 py-3 font-medium">Featured</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal-950/8">
                    {filtered.map((p) => (
                      <tr key={p._id} className="hover:bg-beige-100/30">
                        <td className="px-5 py-3">
                          {p.images[0] ? (
                            <img src={p.images[0]} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-beige-100" />
                          )}
                        </td>
                        <td className="px-5 py-3 font-medium text-charcoal-950">{p.name}</td>
                        <td className="px-5 py-3 text-stone-600">{p.category}</td>
                        <td className="px-5 py-3">
                          {p.amazonUrl ? (
                            <a href={p.amazonUrl} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-copper-600">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          ) : <span className="text-stone-300">—</span>}
                        </td>
                        <td className="px-5 py-3">
                          {p.flipkartUrl ? (
                            <a href={p.flipkartUrl} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-copper-600">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          ) : <span className="text-stone-300">—</span>}
                        </td>
                        <td className="px-5 py-3">
                          {p.featured ? <Badge variant="copper">Featured</Badge> : <Badge variant="neutral">—</Badge>}
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={p.status === "Published" ? "success" : "warning"}>{p.status}</Badge>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/products/${p.slug}`}
                              target="_blank"
                              className="rounded-lg p-2 text-stone-500 hover:bg-beige-100 hover:text-charcoal-950"
                              aria-label="View product"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/admin/products/${p._id}/edit`}
                              className="rounded-lg p-2 text-stone-500 hover:bg-beige-100 hover:text-charcoal-950"
                              aria-label="Edit product"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => setToDelete(p)}
                              className="rounded-lg p-2 text-stone-500 hover:bg-red-50 hover:text-red-600"
                              aria-label="Delete product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Delete product"
        description={`Are you sure you want to delete "${toDelete?.name}"? This cannot be undone.`}
        confirmLabel={deleting ? "Deleting…" : "Delete"}
        destructive
      />
    </div>
  );
}
