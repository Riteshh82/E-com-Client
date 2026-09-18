import { useState, type DragEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UploadCloud, Star, X } from "lucide-react";
import { Input, Select, Textarea } from "../../components/ui/index";
import { Button } from "../../components/ui/Button";
import { products, categories } from "../../data/mockData";
import { slugify } from "../../lib/utils";
import { useToast } from "../../context/ToastContext";

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const existing = isEdit ? products.find((p) => p.id === id) : undefined;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [name, setName] = useState(existing?.name ?? "");
  const [images, setImages] = useState<string[]>(existing?.images ?? []);
  const [dragActive, setDragActive] = useState(false);
  const [featured, setFeatured] = useState(existing?.featured ?? false);
  const [bulkAvailable, setBulkAvailable] = useState(existing?.bulkAvailable ?? true);
  const [published, setPublished] = useState((existing?.status ?? "Published") === "Published");

  const addMockImage = () => {
    setImages((prev) => [
      ...prev,
      `https://images.unsplash.com/photo-1622467827417-bec7da96f1ba?auto=format&fit=crop&w=800&q=80&sig=${prev.length}`,
    ]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    addMockImage();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    showToast(isEdit ? "Product updated." : "Product created.");
    navigate("/admin/products");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl text-charcoal-950">
          {isEdit ? "Edit Product" : "Add Product"}
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          {isEdit ? "Update the details of this product." : "Create a new product for the catalog."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-2xl border border-charcoal-950/8 bg-white p-6">
          <h2 className="font-display text-lg text-charcoal-950">Basic Information</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Classic Copper Tile"
              required
            />
            <Input label="Slug" value={slugify(name || "")} readOnly placeholder="auto-generated" />
            <Select label="Category" defaultValue={existing?.category ?? ""} required>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </Select>
            <div />
            <div className="sm:col-span-2">
              <Textarea
                label="Short Description"
                defaultValue={existing?.shortDescription}
                rows={2}
                placeholder="One or two lines shown on product cards"
              />
            </div>
            <div className="sm:col-span-2">
              <Textarea
                label="Full Description"
                defaultValue={existing?.fullDescription}
                rows={5}
                placeholder="Detailed description shown on the product page"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-charcoal-950/8 bg-white p-6">
          <h2 className="font-display text-lg text-charcoal-950">Images</h2>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`mt-5 flex flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
              dragActive ? "border-copper-500 bg-copper-50" : "border-charcoal-950/15"
            }`}
          >
            <UploadCloud className="h-7 w-7 text-stone-400" />
            <p className="text-sm text-stone-500">Drag and drop images here, or</p>
            <Button type="button" variant="outline" size="sm" onClick={addMockImage}>
              Browse Files
            </Button>
          </div>
          {images.length > 0 && (
            <div className="mt-5 grid grid-cols-3 gap-4 sm:grid-cols-5">
              {images.map((img, i) => (
                <div key={img + i} className="group relative aspect-square overflow-hidden rounded-xl border border-charcoal-950/10">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-charcoal-950/80 px-2 py-0.5 text-[10px] text-copper-300">
                      <Star className="h-2.5 w-2.5 fill-current" /> Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute right-1.5 top-1.5 rounded-full bg-charcoal-950/70 p-1 text-cream-50 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-charcoal-950/8 bg-white p-6">
          <h2 className="font-display text-lg text-charcoal-950">Specifications</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label="Material" defaultValue={existing?.specifications.material} placeholder="99.9% Pure Copper" />
            <Input label="Finish" defaultValue={existing?.specifications.finish} placeholder="Polished Smooth" />
            <Input label="Dimensions" defaultValue={existing?.specifications.dimensions} placeholder="150mm x 150mm x 1.2mm" />
            <Input label="Weight" defaultValue={existing?.specifications.weight} placeholder="0.24 kg / tile" />
            <Input label="Color" defaultValue={existing?.specifications.color} placeholder="Natural Copper" />
            <Input
              label="Applications"
              defaultValue={existing?.specifications.applications.join(", ")}
              placeholder="Kitchen Backsplash, Feature Walls"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-charcoal-950/8 bg-white p-6">
          <h2 className="font-display text-lg text-charcoal-950">Marketplace Links</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label="Amazon URL" type="url" defaultValue={existing?.amazonUrl} placeholder="https://www.amazon.in/…" />
            <Input label="Flipkart URL" type="url" defaultValue={existing?.flipkartUrl} placeholder="https://www.flipkart.com/…" />
          </div>
        </section>

        <section className="rounded-2xl border border-charcoal-950/8 bg-white p-6">
          <h2 className="font-display text-lg text-charcoal-950">Options</h2>
          <div className="mt-5 space-y-4">
            {[
              { label: "Featured Product", checked: featured, set: setFeatured },
              { label: "Bulk Order Available", checked: bulkAvailable, set: setBulkAvailable },
              { label: "Published", checked: published, set: setPublished },
            ].map((opt) => (
              <label key={opt.label} className="flex items-center justify-between rounded-xl border border-charcoal-950/8 px-4 py-3">
                <span className="text-sm font-medium text-charcoal-900">{opt.label}</span>
                <button
                  type="button"
                  onClick={() => opt.set(!opt.checked)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${opt.checked ? "bg-copper-500" : "bg-charcoal-950/15"}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      opt.checked ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </label>
            ))}
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate("/admin/products")}>
            Cancel
          </Button>
          <Button type="submit">Save Product</Button>
        </div>
      </form>
    </div>
  );
}
