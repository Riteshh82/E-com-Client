import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Eye, Pencil, Trash2, ExternalLink } from "lucide-react";
import { products as initialProducts, categories, type Product } from "../../data/mockData";
import { Badge } from "../../components/ui/index";
import { Button } from "../../components/ui/Button";
import { ConfirmDialog, EmptyState } from "../../components/ui/Overlay";
import { useToast } from "../../context/ToastContext";

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [featured, setFeatured] = useState("all");
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const { showToast } = useToast();

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-charcoal-950">Products</h1>
          <p className="mt-1 text-sm text-stone-500">{products.length} products in catalog</p>
        </div>
        <Link to="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-charcoal-950/8 bg-white p-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-charcoal-950/12 px-3 py-2">
          <Search className="h-4 w-4 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-charcoal-950/12 px-3 py-2 text-sm outline-none focus:border-copper-500"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-charcoal-950/12 px-3 py-2 text-sm outline-none focus:border-copper-500"
        >
          <option value="all">All Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>
        <select
          value={featured}
          onChange={(e) => setFeatured(e.target.value)}
          className="rounded-lg border border-charcoal-950/12 px-3 py-2 text-sm outline-none focus:border-copper-500"
        >
          <option value="all">Featured &amp; Not</option>
          <option value="featured">Featured Only</option>
          <option value="not">Not Featured</option>
        </select>
      </div>

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
        <div className="overflow-x-auto rounded-2xl border border-charcoal-950/8 bg-white">
          <table className="w-full min-w-[900px] text-left text-sm">
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
                <tr key={p.id} className="hover:bg-beige-100/30">
                  <td className="px-5 py-3">
                    <img src={p.images[0]} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                  </td>
                  <td className="px-5 py-3 font-medium text-charcoal-950">{p.name}</td>
                  <td className="px-5 py-3 text-stone-600">{p.category}</td>
                  <td className="px-5 py-3">
                    <a href={p.amazonUrl} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-copper-600">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </td>
                  <td className="px-5 py-3">
                    <a href={p.flipkartUrl} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-copper-600">
                      <ExternalLink className="h-4 w-4" />
                    </a>
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
                        to={`/admin/products/${p.id}/edit`}
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
      )}

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          setProducts((prev) => prev.filter((p) => p.id !== toDelete?.id));
          showToast(`${toDelete?.name} was deleted.`);
        }}
        title="Delete product"
        description={`Are you sure you want to delete "${toDelete?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}
