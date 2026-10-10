import { useEffect, useState, useRef } from "react";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, UploadCloud, Loader2 } from "lucide-react";
import { apiGetAdminNewlyAddeds, apiCreateNewlyAdded, apiUpdateNewlyAdded, apiDeleteNewlyAdded, apiGetCategories, apiUploadImage, type ApiNewlyAdded, type ApiCategory } from "../../api";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";

const loadedAdminNewlyAddedImages = new Set<string>();

function AdminCategoryImage({ src, alt }: { src: string, alt: string }) {
  const [loaded, setLoaded] = useState(() => loadedAdminNewlyAddedImages.has(src));
  return (
    <div className="relative h-40 w-full bg-beige-100">
      {!loaded && <div className="absolute inset-0 skeleton-shimmer" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => {
          loadedAdminNewlyAddedImages.add(src);
          setLoaded(true);
        }}
        className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

export default function NewlyAddedsAdmin() {
  const [newlyAddeds, setNewlyAddeds] = useState<ApiNewlyAdded[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editNewlyAddedId, setEditNewlyAddedId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    imageUrl: "",
    categorySlug: "",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [bans, cats] = await Promise.all([
        apiGetAdminNewlyAddeds(),
        apiGetCategories(),
      ]);
      setNewlyAddeds(bans);
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/avif"];
    if (!validTypes.includes(file.type)) {
      showToast("Only JPG, PNG, WebP and AVIF images are allowed.");
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      showToast("Image size should be less than 10 MB.");
      return;
    }

    setUploadingImage(true);
    try {
      const res = await apiUploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: res.url }));
      showToast("Image uploaded successfully.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      showToast(message);
    } finally {
      setUploadingImage(false);
    }
  };

  function handleAddNew() {
    setIsEditing(true);
    setEditNewlyAddedId(null);
    setFormData({
      imageUrl: "",
      categorySlug: "",
      isActive: true,
      order: newlyAddeds.length,
    });
  }

  function handleEdit(b: ApiNewlyAdded) {
    setIsEditing(true);
    setEditNewlyAddedId(b._id);
    setFormData({
      imageUrl: b.imageUrl,
      categorySlug: b.categorySlug,
      isActive: b.isActive,
      order: b.order,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this Banner?")) return;
    try {
      await apiDeleteNewlyAdded(id);
      setNewlyAddeds((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editNewlyAddedId) {
        const updated = await apiUpdateNewlyAdded(editNewlyAddedId, formData);
        setNewlyAddeds((prev) => prev.map((b) => (b._id === editNewlyAddedId ? updated : b)));
      } else {
        const created = await apiCreateNewlyAdded(formData);
        setNewlyAddeds([created, ...newlyAddeds]);
      }
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    }
  }

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-950">New Launched</h1>
          <p className="text-sm text-stone-500">Manage homepage New Launched.</p>
        </div>
        {!isEditing && (
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="max-w-2xl rounded-2xl border border-charcoal-950/10 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">{editNewlyAddedId ? "Edit New Launched" : "New Launched"}</h2>
          
          <div className="mb-4 space-y-1.5">
            <label className="text-sm font-medium text-charcoal-900">Banner Image</label>
            <div
              onClick={() => !uploadingImage && fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-6 text-center transition-colors ${
                uploadingImage ? "opacity-50 cursor-not-allowed border-charcoal-950/15" : "border-charcoal-950/15 hover:bg-stone-50"
              }`}
            >
              {uploadingImage ? (
                <Loader2 className="h-6 w-6 animate-spin text-copper-500" />
              ) : (
                <UploadCloud className="h-6 w-6 text-stone-400" />
              )}
              <p className="text-sm text-stone-500">
                {uploadingImage ? "Uploading..." : "Click to select an image"}
              </p>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/jpeg, image/png, image/webp, image/avif"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileSelect(e.target.files[0]);
                    e.target.value = '';
                  }
                }}
              />
            </div>
            {formData.imageUrl && (
              <div className="mt-3 relative h-32 w-full overflow-hidden rounded-lg border border-charcoal-950/10">
                <img src={formData.imageUrl} alt="Banner Preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormData({ ...formData, imageUrl: "" });
                  }}
                  className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-charcoal-950 shadow-sm transition-all hover:bg-white hover:text-red-600"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Category Link</label>
            <select
              required
              value={formData.categorySlug}
              onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-copper-500"
            >
              <option value="" disabled>Select a category</option>
              {categories.map((c) => (
                <option key={c._id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium">Order</label>
              <input
                type="number"
                required
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-copper-500"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium">Status</label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                <span>Active</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditing(false)} type="button">
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {newlyAddeds.map((b) => {
            const cat = categories.find((c) => c.slug === b.categorySlug);
            return (
              <div key={b._id} className="overflow-hidden rounded-2xl border border-charcoal-950/10 bg-white shadow-sm">
                <AdminCategoryImage src={b.imageUrl} alt="NewlyAdded" />
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-charcoal-950">
                      Link: {cat ? cat.name : b.categorySlug}
                    </span>
                    {b.isActive ? (
                      <span className="flex items-center text-xs text-green-600"><CheckCircle2 className="mr-1 h-3 w-3" /> Active</span>
                    ) : (
                      <span className="flex items-center text-xs text-red-500"><XCircle className="mr-1 h-3 w-3" /> Inactive</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>Order: {b.order}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(b)} className="hover:text-copper-600"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(b._id)} className="hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {newlyAddeds.length === 0 && (
            <p className="col-span-full py-10 text-center text-stone-500">No New Added Product found.</p>
          )}
        </div>
      )}
    </div>
  );
}
