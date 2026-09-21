import { useState, useEffect, useRef, type DragEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UploadCloud, Star, X, Loader2 } from "lucide-react";
import { Input, Select, Textarea } from "../../components/ui/index";
import { Button } from "../../components/ui/Button";
import {
  apiGetProducts,
  apiGetCategories,
  apiCreateProduct,
  apiUpdateProduct,
  apiUploadImage,
  type ApiProduct,
  type ApiCategory,
} from "../../api";
import { slugify } from "../../lib/utils";
import { useToast } from "../../context/ToastContext";

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [existing, setExisting] = useState<ApiProduct | null>(null);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [productCode, setProductCode] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [bulkAvailable, setBulkAvailable] = useState(true);
  const [published, setPublished] = useState(true);
  const [whatsappOrder, setWhatsappOrder] = useState(true); // default ON for new products

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Always load categories
    apiGetCategories().then(setCategories).catch(() => {});

    if (!isEdit || !id) { setLoadingData(false); return; }

    // Fetch the product being edited (by _id via listing with limit)
    // We query the full list and find by ID since there's no GET /products/:id endpoint
    apiGetProducts({ limit: "200" })
      .then((r) => {
        const p = r.products.find((x) => x._id === id);
        if (!p) { navigate("/admin/products"); return; }
        setExisting(p);
        setName(p.name);
        setPrice(p.price != null ? String(p.price) : "");
        setProductCode(p.productCode ?? "");
        setImages(p.images ?? []);
        setFeatured(p.featured);
        setBulkAvailable(p.bulkAvailable);
        setPublished(p.status === "Published");
        setWhatsappOrder(p.whatsappOrder ?? true);
      })
      .catch(() => navigate("/admin/products"))
      .finally(() => setLoadingData(false));
  }, [id, isEdit, navigate]);

  const addImageUrl = () => {
    const url = imageUrl.trim();
    if (url) { setImages((prev) => [...prev, url]); setImageUrl(""); }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    
    // Check if it's a file drop
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileSelect(e.dataTransfer.files[0]);
      return;
    }

    // Fallback to text
    const text = e.dataTransfer.getData("text/plain");
    if (text.startsWith("http")) setImages((prev) => [...prev, text]);
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    
    // Basic validation
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      showToast("Only JPG, PNG and WebP images are allowed.");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size should be less than 5MB.");
      return;
    }

    setUploadingImage(true);
    try {
      const res = await apiUploadImage(file);
      setImages((prev) => [...prev, res.url]);
      showToast("Image uploaded successfully.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      showToast(message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    // ── Client-side validation ──────────────────────────────────────────────
    const errors: Record<string, string> = {};
    if (images.length === 0) {
      errors.images = "At least one product photo is required.";
    }
    const priceVal = parseFloat(String(fd.get("price") ?? "0"));
    if (!priceVal || priceVal <= 0) {
      errors.price = "Price must be greater than ₹0.";
    }
    const categoryVal = String(fd.get("category") ?? "").trim();
    if (!categoryVal) {
      errors.category = "Please select a category.";
    }
    const productCodeVal = String(fd.get("productCode") ?? "").trim();
    if (!productCodeVal) {
      errors.productCode = "Product code is required.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Scroll to first error
      const firstErrorId = Object.keys(errors)[0];
      document.getElementById(`field-${firstErrorId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setValidationErrors({});
    // ── End validation ──────────────────────────────────────────────────────

    const applicationsRaw = String(fd.get("applications") ?? "");
    const finishesRaw = String(fd.get("finishes") ?? "");

    const payload: Partial<ApiProduct> = {
      name: String(fd.get("name") ?? ""),
      slug: slugify(String(fd.get("name") ?? "")),
      category: String(fd.get("category") ?? ""),
      shortDescription: String(fd.get("shortDescription") ?? ""),
      fullDescription: String(fd.get("fullDescription") ?? ""),
      price: parseFloat(String(fd.get("price") ?? "0")) || 0,
      productCode: String(fd.get("productCode") ?? "").trim(),
      images,
      specifications: {
        material: String(fd.get("material") ?? ""),
        finish: String(fd.get("specFinish") ?? ""),
        dimensions: String(fd.get("dimensions") ?? ""),
        weight: String(fd.get("weight") ?? ""),
        color: String(fd.get("color") ?? ""),
        applications: applicationsRaw.split(",").map((s) => s.trim()).filter(Boolean),
      },
      finishes: finishesRaw.split(",").map((s) => s.trim()).filter(Boolean),
      amazonUrl: String(fd.get("amazonUrl") ?? ""),
      flipkartUrl: String(fd.get("flipkartUrl") ?? ""),
      myntraUrl: String(fd.get("myntraUrl") ?? ""),
      featured,
      bulkAvailable,
      whatsappOrder,
      status: published ? "Published" : "Draft",
    };

    setSubmitting(true);
    try {
      if (isEdit && existing) {
        await apiUpdateProduct(existing._id, payload);
        showToast("Product updated.");
      } else {
        await apiCreateProduct(payload);
        showToast("Product created.");
      }
      navigate("/admin/products");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Save failed.";
      showToast(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-copper-500" />
      </div>
    );
  }

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
              id="field-name"
              label="Product Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Classic Copper Tile"
              required
            />
            <Input label="Slug" value={slugify(name || "")} readOnly placeholder="auto-generated" />
            <div id="field-category">
              <Select
                label="Category *"
                name="category"
                defaultValue={existing?.category ?? ""}
                required
                onChange={() => setValidationErrors((prev) => ({ ...prev, category: "" }))}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </Select>
              {validationErrors.category && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.category}</p>
              )}
            </div>
            <div />
            <div id="field-price">
              <Input
                label="Price (₹) *"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => { setPrice(e.target.value); setValidationErrors((prev) => ({ ...prev, price: "" })); }}
                placeholder="e.g. 1999"
              />
              {validationErrors.price && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.price}</p>
              )}
            </div>
            <div id="field-productCode">
              <Input
                label="Product Code *"
                name="productCode"
                value={productCode}
                onChange={(e) => { setProductCode(e.target.value); setValidationErrors((prev) => ({ ...prev, productCode: "" })); }}
                placeholder="e.g. NSI-CU-001"
              />
              {validationErrors.productCode && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.productCode}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Textarea
                label="Short Description"
                name="shortDescription"
                defaultValue={existing?.shortDescription}
                rows={2}
                placeholder="One or two lines shown on product cards"
              />
            </div>
            <div className="sm:col-span-2">
              <Textarea
                label="Full Description"
                name="fullDescription"
                defaultValue={existing?.fullDescription}
                rows={5}
                placeholder="Detailed description shown on the product page"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-charcoal-950/8 bg-white p-6">
          <h2 className="font-display text-lg text-charcoal-950">Images <span className="text-red-500">*</span></h2>
          {/* Images required error */}
          {validationErrors.images && (
            <p id="field-images" className="mt-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {validationErrors.images}
            </p>
          )}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => !uploadingImage && fileInputRef.current?.click()}
            className={`mt-5 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
              dragActive ? "border-copper-500 bg-copper-50" : "border-charcoal-950/15 hover:bg-stone-50"
            } ${uploadingImage ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {uploadingImage ? (
              <Loader2 className="h-7 w-7 animate-spin text-copper-500" />
            ) : (
              <UploadCloud className="h-7 w-7 text-stone-400" />
            )}
            <p className="text-sm text-stone-500">
              {uploadingImage ? "Uploading..." : "Click to select or drag and drop an image"}
            </p>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/jpeg, image/png, image/webp"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileSelect(e.target.files[0]);
                  e.target.value = ''; // Reset input
                }
              }}
            />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-stone-500">
            <span className="flex-1 border-t border-charcoal-950/10"></span>
            OR
            <span className="flex-1 border-t border-charcoal-950/10"></span>
          </div>
          <div className="mt-4 flex gap-2">
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.example.com/photo.jpg"
              className="flex-1 rounded-lg border border-charcoal-950/12 px-3 py-2 text-sm outline-none focus:border-copper-500"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImageUrl(); } }}
            />
            <Button type="button" variant="outline" size="sm" onClick={addImageUrl}>
              Add
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
            <Input name="material" label="Material" defaultValue={existing?.specifications.material} placeholder="99.9% Pure Copper" />
            <Input name="specFinish" label="Finish" defaultValue={existing?.specifications.finish} placeholder="Polished Smooth" />
            <Input name="dimensions" label="Dimensions" defaultValue={existing?.specifications.dimensions} placeholder="150mm x 150mm x 1.2mm" />
            <Input name="weight" label="Weight" defaultValue={existing?.specifications.weight} placeholder="0.24 kg / tile" />
            <Input name="color" label="Color" defaultValue={existing?.specifications.color} placeholder="Natural Copper" />
            <Input
              name="applications"
              label="Applications (comma-separated)"
              defaultValue={existing?.specifications.applications.join(", ")}
              placeholder="Kitchen Backsplash, Feature Walls"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-charcoal-950/8 bg-white p-6">
          <h2 className="font-display text-lg text-charcoal-950">Finishes &amp; Marketplace Links</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              name="finishes"
              label="Available Finishes (comma-separated)"
              defaultValue={existing?.finishes.join(", ")}
              placeholder="Polished, Satin, Matte"
              className="sm:col-span-2"
            />
            <Input name="amazonUrl" label="Amazon URL" type="url" defaultValue={existing?.amazonUrl} placeholder="https://www.amazon.in/…" />
            <Input name="flipkartUrl" label="Flipkart URL" type="url" defaultValue={existing?.flipkartUrl} placeholder="https://www.flipkart.com/…" />
            <Input name="myntraUrl" label="Myntra URL" type="url" defaultValue={existing?.myntraUrl} placeholder="https://www.myntra.com/…" />
          </div>
        </section>

        <section className="rounded-2xl border border-charcoal-950/8 bg-white p-6">
          <h2 className="font-display text-lg text-charcoal-950">Options</h2>
          <div className="mt-5 space-y-4">
            {[
              { label: "Featured Product", checked: featured, set: setFeatured },
              { label: "Bulk Order Available", checked: bulkAvailable, set: setBulkAvailable },
              { label: "WhatsApp Order Available", checked: whatsappOrder, set: setWhatsappOrder },
              { label: "Published", checked: published, set: setPublished },
            ].map((opt) => (
              <label key={opt.label} className="flex items-center justify-between rounded-xl border border-charcoal-950/8 px-4 py-3">
                <div>
                  <span className="text-sm font-medium text-charcoal-900">{opt.label}</span>
                  {opt.label === "WhatsApp Order Available" && (
                    <p className="text-xs text-stone-400 mt-0.5">Show "Order on WhatsApp" button for this product</p>
                  )}
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={opt.checked}
                  onClick={() => opt.set(!opt.checked)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-copper-500 ${opt.checked ? "bg-copper-500" : "bg-charcoal-950/15"}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
                      opt.checked ? "translate-x-5" : "translate-x-0"
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
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
