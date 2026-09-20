import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, Loader2, UploadCloud } from "lucide-react";
import {
  apiGetCategories,
  apiCreateCategory,
  apiUpdateCategory,
  apiDeleteCategory,
  apiUploadImage,
  type ApiCategory,
} from "../../api";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/index";
import { Modal, ConfirmDialog } from "../../components/ui/Overlay";
import { useToast } from "../../context/ToastContext";
import { slugify } from "../../lib/utils";

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ApiCategory | "new" | null>(null);
  const [toDelete, setToDelete] = useState<ApiCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const loadCategories = () => {
    setLoading(true);
    apiGetCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCategories(); }, []);

  const openModal = (category: ApiCategory | "new") => {
    setEditing(category);
    setUploadedImageUrl(category !== "new" && category.image ? category.image : "");
  };

  const closeModal = () => {
    setEditing(null);
    setUploadedImageUrl("");
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    
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
      setUploadedImageUrl(res.url);
      showToast("Image uploaded successfully.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      showToast(message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (formData: FormData) => {
    const name = String(formData.get("name") ?? "");
    const description = String(formData.get("description") ?? "");
    const image = uploadedImageUrl;

    setSaving(true);
    try {
      if (editing === "new") {
        const newCat = await apiCreateCategory({
          name,
          slug: slugify(name),
          description,
          image: image || "https://images.unsplash.com/photo-1622467827417-bec7da96f1ba?auto=format&fit=crop&w=1200&q=80",
          productCount: 0,
        });
        setCategories((prev) => [...prev, newCat]);
        showToast("Category added.");
      } else if (editing) {
        const updated = await apiUpdateCategory(editing._id, { name, description, image: image || editing.image });
        setCategories((prev) => prev.map((c) => (c._id === editing._id ? updated : c)));
        showToast("Category updated.");
      }
      closeModal();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Save failed.";
      showToast(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await apiDeleteCategory(toDelete._id);
      setCategories((prev) => prev.filter((c) => c._id !== toDelete._id));
      showToast(`${toDelete.name} was deleted.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Delete failed.";
      showToast(message);
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-charcoal-950">Categories</h1>
          <p className="mt-1 text-sm text-stone-500">{categories.length} categories</p>
        </div>
        <Button onClick={() => openModal("new")}>
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-copper-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c._id} className="overflow-hidden rounded-2xl border border-charcoal-950/8 bg-white">
              <div className="aspect-[16/9] overflow-hidden">
                {c.image ? (
                  <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-beige-100" />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg text-charcoal-950">{c.name}</h3>
                  <span className="text-xs text-stone-400">{c.productCount} products</span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm text-stone-500">{c.description}</p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openModal(c)}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => setToDelete(c)}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={closeModal}
        title={editing === "new" ? "Add Category" : `Edit ${(editing as ApiCategory | null)?.name ?? ""}`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave(new FormData(e.currentTarget));
          }}
          className="space-y-5"
        >
          <Input
            name="name"
            label="Category Name"
            defaultValue={(editing as ApiCategory | null)?.name ?? ""}
            required
          />
          <Textarea
            name="description"
            label="Description"
            rows={3}
            defaultValue={(editing as ApiCategory | null)?.description ?? ""}
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-charcoal-900">Category Image</label>
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
                accept="image/jpeg, image/png, image/webp"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileSelect(e.target.files[0]);
                    e.target.value = '';
                  }
                }}
              />
            </div>
            {uploadedImageUrl && (
              <div className="mt-3 relative h-32 w-full overflow-hidden rounded-lg border border-charcoal-950/10">
                <img src={uploadedImageUrl} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save Category"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Delete category"
        description={`Delete "${toDelete?.name}"? Products in this category will remain but lose their category tag.`}
        confirmLabel={deleting ? "Deleting…" : "Delete"}
        destructive
      />
    </div>
  );
}
