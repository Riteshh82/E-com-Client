import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { categories as initialCategories, type Category } from "../../data/mockData";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/index";
import { Modal, ConfirmDialog } from "../../components/ui/Overlay";
import { useToast } from "../../context/ToastContext";
import { slugify } from "../../lib/utils";

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editing, setEditing] = useState<Category | "new" | null>(null);
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const { showToast } = useToast();

  const closeModal = () => setEditing(null);

  const handleSave = (formData: FormData) => {
    const name = String(formData.get("name") ?? "");
    const description = String(formData.get("description") ?? "");
    if (editing === "new") {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name,
        slug: slugify(name),
        description,
        image:
          "https://images.unsplash.com/photo-1622467827417-bec7da96f1ba?auto=format&fit=crop&w=1200&q=80",
        productCount: 0,
      };
      setCategories((prev) => [...prev, newCat]);
      showToast("Category added.");
    } else if (editing) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, name, description } : c))
      );
      showToast("Category updated.");
    }
    closeModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-charcoal-950">Categories</h1>
          <p className="mt-1 text-sm text-stone-500">{categories.length} categories</p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-2xl border border-charcoal-950/8 bg-white">
            <div className="aspect-[16/9] overflow-hidden">
              <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-charcoal-950">{c.name}</h3>
                <span className="text-xs text-stone-400">{c.productCount} products</span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-sm text-stone-500">{c.description}</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(c)}>
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

      <Modal
        open={!!editing}
        onClose={closeModal}
        title={editing === "new" ? "Add Category" : `Edit ${(editing as Category | null)?.name ?? ""}`}
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
            defaultValue={(editing as Category | null)?.name ?? ""}
            required
          />
          <Textarea
            name="description"
            label="Description"
            rows={3}
            defaultValue={(editing as Category | null)?.description ?? ""}
          />
          <div>
            <span className="mb-1.5 block text-sm font-medium text-charcoal-900">Category Image</span>
            <div className="rounded-xl border border-dashed border-charcoal-950/15 px-4 py-6 text-center text-sm text-stone-500">
              Click Save to use a placeholder image, or drop a file here (demo only)
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">Save Category</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          setCategories((prev) => prev.filter((c) => c.id !== toDelete?.id));
          showToast(`${toDelete?.name} was deleted.`);
        }}
        title="Delete category"
        description={`Delete "${toDelete?.name}"? Products in this category will remain but lose their category tag.`}
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}
