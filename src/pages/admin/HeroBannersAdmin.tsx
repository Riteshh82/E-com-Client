import { useEffect, useState, useRef } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  UploadCloud,
  Loader2,
  MoveUp,
  MoveDown,
  Monitor,
  Smartphone,
  Eye,
  ArrowUpRight,
  RefreshCw,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  X,
} from "lucide-react";
import {
  apiGetAdminHeroBanners,
  apiCreateHeroBanner,
  apiUpdateHeroBanner,
  apiDeleteHeroBanner,
  apiReorderHeroBanners,
  apiToggleHeroBannerStatus,
  apiUploadImage,
  type ApiHeroBanner,
  type ApiHeroBannerImageMeta,
} from "../../api";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "avif", "svg"];
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
];
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB

interface ImageUploadBoxProps {
  label: string;
  sublabel: string;
  aspectHint: string;
  imageUrl: string;
  metadata?: ApiHeroBannerImageMeta;
  onImageUploaded: (url: string, key?: string, meta?: ApiHeroBannerImageMeta) => void;
  onClear: () => void;
  isMobileAspect?: boolean;
}

function ImageUploadBox({
  label,
  sublabel,
  aspectHint,
  imageUrl,
  metadata,
  onImageUploaded,
  onClear,
  isMobileAspect = false,
}: ImageUploadBoxProps) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const processFile = async (file: File) => {
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_EXTENSIONS.includes(ext) && !ALLOWED_MIME_TYPES.includes(file.type)) {
      showToast("Unsupported format. Allowed: JPEG, PNG, WebP, GIF, AVIF, SVG.");
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      showToast("File exceeds 10MB size limit. Please choose a smaller image.");
      return;
    }

    // Read client-side image dimensions as immediate fallback/preview
    let clientWidth = 0;
    let clientHeight = 0;
    try {
      const objUrl = URL.createObjectURL(file);
      const img = new Image();
      await new Promise<void>((resolve) => {
        img.onload = () => {
          clientWidth = img.naturalWidth;
          clientHeight = img.naturalHeight;
          URL.revokeObjectURL(objUrl);
          resolve();
        };
        img.onerror = () => {
          URL.revokeObjectURL(objUrl);
          resolve();
        };
        img.src = objUrl;
      });
    } catch {
      // ignore
    }

    setUploading(true);
    setUploadProgress(30);

    try {
      setUploadProgress(65);
      const res = await apiUploadImage(file, { folder: "banners" });
      setUploadProgress(100);

      const finalMeta: ApiHeroBannerImageMeta = {
        filename: file.name,
        size: file.size,
        width: res.metadata?.width || clientWidth,
        height: res.metadata?.height || clientHeight,
        format: res.metadata?.format || ext,
        mimeType: res.metadata?.mimeType || file.type,
      };

      onImageUploaded(res.url, res.key, finalMeta);
      showToast(`${label} uploaded successfully.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      showToast(msg);
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-semibold text-charcoal-950">
          {label} <span className="text-red-500">*</span>
        </label>
        <span className="text-xs text-stone-500">{aspectHint}</span>
      </div>
      <p className="text-xs text-stone-500">{sublabel}</p>

      {imageUrl ? (
        <div className="group relative overflow-hidden rounded-2xl border border-charcoal-950/10 bg-stone-50 p-3 shadow-sm transition-all hover:border-copper-500/30">
          <div
            className={`relative w-full overflow-hidden rounded-xl bg-charcoal-900 ${
              isMobileAspect ? "aspect-[9/14] max-w-[240px] mx-auto" : "aspect-[21/9]"
            }`}
          >
            <img
              src={imageUrl}
              alt="Uploaded Banner Preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-medium text-charcoal-950 shadow hover:bg-white"
              >
                <RefreshCw className="h-3 w-3" /> Replace
              </button>
              <button
                type="button"
                onClick={onClear}
                className="flex items-center gap-1 rounded-lg bg-red-600/90 px-2.5 py-1 text-xs font-medium text-white shadow hover:bg-red-600"
              >
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            </div>
          </div>

          {/* Metadata pill strip */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-stone-600">
            {metadata?.filename && (
              <span className="max-w-[180px] truncate rounded-md bg-stone-200/70 px-2 py-0.5 font-mono">
                {metadata.filename}
              </span>
            )}
            {metadata?.format && (
              <span className="rounded-md bg-copper-100 px-2 py-0.5 font-bold uppercase text-copper-700">
                {metadata.format}
              </span>
            )}
            {metadata?.width && metadata?.height ? (
              <span className="rounded-md bg-stone-200/70 px-2 py-0.5 font-mono">
                {metadata.width} × {metadata.height}px
              </span>
            ) : null}
            {metadata?.size ? (
              <span className="rounded-md bg-stone-200/70 px-2 py-0.5">
                {(metadata.size / 1024).toFixed(0)} KB
              </span>
            ) : null}
            <span className="ml-auto inline-flex items-center text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Uploaded to R2
            </span>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
            dragOver
              ? "border-copper-500 bg-copper-50/50"
              : "border-charcoal-950/15 bg-white hover:border-copper-400 hover:bg-stone-50/60"
          } ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-copper-500" />
              <p className="text-sm font-medium text-charcoal-900">
                Uploading to Cloudflare R2...
              </p>
              {uploadProgress !== null && (
                <div className="h-1.5 w-40 overflow-hidden rounded-full bg-stone-200">
                  <div
                    className="h-full bg-copper-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-copper-50 text-copper-600 shadow-sm">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-semibold text-charcoal-900">
                Click or drag &amp; drop {label.toLowerCase()}
              </p>
              <p className="mt-1 text-xs text-stone-500">
                Supports WebP, JPEG, PNG, GIF (animated), AVIF &amp; SVG (Max 10MB)
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}

export default function HeroBannersAdmin() {
  const [banners, setBanners] = useState<ApiHeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<ApiHeroBanner | null>(null);

  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    desktopImageUrl: "",
    mobileImageUrl: "",
    desktopImageKey: "",
    mobileImageKey: "",
    desktopMetadata: {} as ApiHeroBannerImageMeta,
    mobileMetadata: {} as ApiHeroBannerImageMeta,
    title: "",
    subtitle: "",
    ctaText: "",
    ctaUrl: "",
    order: 0,
    status: "Active" as "Active" | "Inactive",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    setLoading(true);
    try {
      const data = await apiGetAdminHeroBanners();
      setBanners(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load hero banners.";
      showToast(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleAddNew() {
    setEditingBannerId(null);
    setFormData({
      name: "",
      desktopImageUrl: "",
      mobileImageUrl: "",
      desktopImageKey: "",
      mobileImageKey: "",
      desktopMetadata: {},
      mobileMetadata: {},
      title: "",
      subtitle: "",
      ctaText: "",
      ctaUrl: "",
      order: banners.length,
      status: "Active",
      startDate: "",
      endDate: "",
    });
    setIsFormOpen(true);
  }

  function handleEdit(b: ApiHeroBanner) {
    setEditingBannerId(b._id);
    setFormData({
      name: b.name,
      desktopImageUrl: b.desktopImageUrl,
      mobileImageUrl: b.mobileImageUrl,
      desktopImageKey: b.desktopImageKey || "",
      mobileImageKey: b.mobileImageKey || "",
      desktopMetadata: b.desktopMetadata || {},
      mobileMetadata: b.mobileMetadata || {},
      title: b.title || "",
      subtitle: b.subtitle || "",
      ctaText: b.ctaText || "",
      ctaUrl: b.ctaUrl || "",
      order: b.order,
      status: b.status,
      startDate: b.startDate ? b.startDate.substring(0, 10) : "",
      endDate: b.endDate ? b.endDate.substring(0, 10) : "",
    });
    setIsFormOpen(true);
  }

  async function handleToggleStatus(banner: ApiHeroBanner) {
    const nextStatus = banner.status === "Active" ? "Inactive" : "Active";
    try {
      const updated = await apiToggleHeroBannerStatus(banner._id, nextStatus);
      setBanners((prev) => prev.map((b) => (b._id === banner._id ? updated : b)));
      showToast(`Banner "${banner.name}" is now ${nextStatus}.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change status.";
      showToast(msg);
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const newBanners = [...banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[targetIndex];
    newBanners[targetIndex] = temp;

    // Recalculate order values
    const items = newBanners.map((b, idx) => ({ id: b._id, order: idx }));
    setBanners(newBanners);

    try {
      const updatedList = await apiReorderHeroBanners(items);
      setBanners(updatedList);
      showToast("Banner sequence updated.");
    } catch {
      showToast("Failed to save reorder. Reverting.");
      fetchBanners();
    }
  }

  async function confirmDelete() {
    if (!bannerToDelete) return;
    try {
      await apiDeleteHeroBanner(bannerToDelete._id);
      setBanners((prev) => prev.filter((b) => b._id !== bannerToDelete._id));
      showToast(`Banner "${bannerToDelete.name}" deleted.`);
      setBannerToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete banner.";
      showToast(msg);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast("Please enter a banner name.");
      return;
    }
    if (!formData.desktopImageUrl) {
      showToast("Please upload a desktop banner image.");
      return;
    }
    if (!formData.mobileImageUrl) {
      showToast("Please upload a mobile banner image.");
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<ApiHeroBanner> = {
        name: formData.name.trim(),
        desktopImageUrl: formData.desktopImageUrl,
        mobileImageUrl: formData.mobileImageUrl,
        desktopImageKey: formData.desktopImageKey,
        mobileImageKey: formData.mobileImageKey,
        desktopMetadata: formData.desktopMetadata,
        mobileMetadata: formData.mobileMetadata,
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        ctaText: formData.ctaText.trim(),
        ctaUrl: formData.ctaUrl.trim(),
        order: Number(formData.order),
        status: formData.status,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      };

      if (editingBannerId) {
        const updated = await apiUpdateHeroBanner(editingBannerId, payload);
        setBanners((prev) => prev.map((b) => (b._id === editingBannerId ? updated : b)));
        showToast("Hero banner updated successfully.");
      } else {
        const created = await apiCreateHeroBanner(payload);
        setBanners((prev) => [...prev, created].sort((a, b) => a.order - b.order));
        showToast("Hero banner created successfully.");
      }

      setIsFormOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save banner.";
      showToast(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8 pb-16">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold tracking-tight text-charcoal-950 sm:text-3xl">
              Hero Banners
            </h1>
            <span className="rounded-full bg-copper-100 px-2.5 py-0.5 text-xs font-semibold text-copper-800">
              {banners.length} {banners.length === 1 ? "Banner" : "Banners"}
            </span>
          </div>
          <p className="mt-1 text-sm text-stone-500">
            Manage dynamic homepage promotional banners for desktop and mobile, with automatic rotation.
          </p>
        </div>

        {!isFormOpen && (
          <div className="flex items-center gap-2.5">
            <Button onClick={handleAddNew} size="md">
              <Plus className="mr-1.5 h-4 w-4" /> Add New Banner
            </Button>
          </div>
        )}
      </div>

      {/* ── Banner Create / Edit Form ── */}
      {isFormOpen && (
        <div className="overflow-hidden rounded-3xl border border-charcoal-950/10 bg-white shadow-xl shadow-charcoal-950/5">
          <div className="flex items-center justify-between border-b border-charcoal-950/8 bg-stone-50/70 px-6 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-copper-100 text-copper-700">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-charcoal-950">
                  {editingBannerId ? "Edit Hero Banner" : "Create New Hero Banner"}
                </h2>
                <p className="text-xs text-stone-500">
                  Upload desktop and mobile assets, configure overlay text and CTA links.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsFormOpen(false)}
              className="rounded-xl p-2 text-stone-400 hover:bg-stone-200/60 hover:text-charcoal-900"
              title="Close form"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-copper-700">
                1. Identification &amp; Publishing
              </h3>
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-charcoal-950">
                    Banner Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Summer Kitchen Sale 2026"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-charcoal-950/15 bg-white px-4 py-2.5 text-sm text-charcoal-950 outline-none transition-all focus:border-copper-500 focus:ring-2 focus:ring-copper-500/20"
                  />
                  <p className="mt-1 text-xs text-stone-400">
                    Internal name used to organize and track banners in admin.
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-charcoal-950">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })
                    }
                    className="w-full rounded-xl border border-charcoal-950/15 bg-white px-3.5 py-2.5 text-sm text-charcoal-950 outline-none transition-all focus:border-copper-500 focus:ring-2 focus:ring-copper-500/20"
                  >
                    <option value="Active">Active (Published on Website)</option>
                    <option value="Inactive">Inactive (Saved as Draft)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Media Uploads */}
            <div className="space-y-4 border-t border-charcoal-950/8 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-copper-700">
                2. Desktop &amp; Mobile Creative Assets
              </h3>
              <div className="grid gap-6 lg:grid-cols-2">
                <ImageUploadBox
                  label="Desktop Banner Image"
                  sublabel="Displays on laptops, wide screens, and desktop viewports."
                  aspectHint="Recommended: 1920×600 or 21:9 ratio"
                  imageUrl={formData.desktopImageUrl}
                  metadata={formData.desktopMetadata}
                  onImageUploaded={(url, key, meta) =>
                    setFormData((prev) => ({
                      ...prev,
                      desktopImageUrl: url,
                      desktopImageKey: key || "",
                      desktopMetadata: meta || {},
                    }))
                  }
                  onClear={() =>
                    setFormData((prev) => ({
                      ...prev,
                      desktopImageUrl: "",
                      desktopImageKey: "",
                      desktopMetadata: {},
                    }))
                  }
                  isMobileAspect={false}
                />

                <ImageUploadBox
                  label="Mobile Banner Image"
                  sublabel="Displays on smartphones and narrow screens."
                  aspectHint="Recommended: 750×1000 or 4:5 ratio"
                  imageUrl={formData.mobileImageUrl}
                  metadata={formData.mobileMetadata}
                  onImageUploaded={(url, key, meta) =>
                    setFormData((prev) => ({
                      ...prev,
                      mobileImageUrl: url,
                      mobileImageKey: key || "",
                      mobileMetadata: meta || {},
                    }))
                  }
                  onClear={() =>
                    setFormData((prev) => ({
                      ...prev,
                      mobileImageUrl: "",
                      mobileImageKey: "",
                      mobileMetadata: {},
                    }))
                  }
                  isMobileAspect={true}
                />
              </div>
            </div>

            {/* Content & CTA */}
            <div className="space-y-4 border-t border-charcoal-950/8 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-copper-700">
                3. Optional Promotional Overlay &amp; CTA
              </h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-charcoal-950">
                    Heading / Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Smart Kitchen Racks &amp; Organizers"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-charcoal-950/15 bg-white px-4 py-2.5 text-sm text-charcoal-950 outline-none transition-all focus:border-copper-500 focus:ring-2 focus:ring-copper-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-charcoal-950">
                    Subtitle / Description (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Premium stainless steel craft with lifetime durability"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full rounded-xl border border-charcoal-950/15 bg-white px-4 py-2.5 text-sm text-charcoal-950 outline-none transition-all focus:border-copper-500 focus:ring-2 focus:ring-copper-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-charcoal-950">
                    CTA Button Text (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shop Best Sellers"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full rounded-xl border border-charcoal-950/15 bg-white px-4 py-2.5 text-sm text-charcoal-950 outline-none transition-all focus:border-copper-500 focus:ring-2 focus:ring-copper-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-charcoal-950">
                    Destination URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /products or /collections"
                    value={formData.ctaUrl}
                    onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                    className="w-full rounded-xl border border-charcoal-950/15 bg-white px-4 py-2.5 text-sm text-charcoal-950 outline-none transition-all focus:border-copper-500 focus:ring-2 focus:ring-copper-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Display Order & Scheduling */}
            <div className="space-y-4 border-t border-charcoal-950/8 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-copper-700">
                4. Sequence &amp; Campaign Dates
              </h3>
              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-charcoal-950">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full rounded-xl border border-charcoal-950/15 bg-white px-4 py-2.5 text-sm text-charcoal-950 outline-none transition-all focus:border-copper-500 focus:ring-2 focus:ring-copper-500/20"
                  />
                  <p className="mt-1 text-xs text-stone-400">Lower numbers appear first in rotation.</p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-charcoal-950">
                    Campaign Start Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full rounded-xl border border-charcoal-950/15 bg-white px-4 py-2.5 text-sm text-charcoal-950 outline-none transition-all focus:border-copper-500 focus:ring-2 focus:ring-copper-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-charcoal-950">
                    Campaign End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full rounded-xl border border-charcoal-950/15 bg-white px-4 py-2.5 text-sm text-charcoal-950 outline-none transition-all focus:border-copper-500 focus:ring-2 focus:ring-copper-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-charcoal-950/8 pt-6">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(true)}
                disabled={!formData.desktopImageUrl && !formData.mobileImageUrl}
                className="inline-flex items-center gap-2 rounded-xl border border-charcoal-950/15 px-4 py-2.5 text-sm font-semibold text-charcoal-900 transition-all hover:border-copper-500 hover:text-copper-600 disabled:opacity-40"
              >
                <Eye className="h-4 w-4" /> Live Preview Banner
              </button>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : editingBannerId ? (
                    "Save Changes"
                  ) : (
                    "Publish Banner"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── Banners List ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-stone-400">
          <Loader2 className="h-8 w-8 animate-spin text-copper-500" />
          <p className="mt-3 text-sm">Loading hero banners...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-charcoal-950/15 bg-white p-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-copper-50 text-copper-600">
            <Layers className="h-8 w-8" />
          </div>
          <h3 className="mt-4 font-display text-xl font-bold text-charcoal-950">
            No Hero Banners Yet
          </h3>
          <p className="mt-2 max-w-md text-sm text-stone-500">
            Create promotional hero banners with custom desktop and mobile imagery. They will automatically
            rotate every 5 seconds on the homepage.
          </p>
          <Button onClick={handleAddNew} className="mt-6">
            <Plus className="mr-2 h-4 w-4" /> Add First Banner
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500 px-2">
            <span>Arrange Rotation Sequence ({banners.length})</span>
            <span>Desktop &amp; Mobile Responsive</span>
          </div>

          <div className="space-y-3">
            {banners.map((b, index) => (
              <div
                key={b._id}
                className="group relative flex flex-col gap-4 rounded-2xl border border-charcoal-950/10 bg-white p-4 shadow-sm transition-all hover:border-copper-500/30 hover:shadow-md sm:flex-row sm:items-center"
              >
                {/* Position / Move Controls */}
                <div className="flex items-center gap-1.5 sm:flex-col">
                  <button
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    title="Move banner earlier"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-charcoal-950/10 text-charcoal-900 transition-colors hover:bg-copper-50 hover:text-copper-600 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <MoveUp className="h-4 w-4" />
                  </button>
                  <span className="font-mono text-xs font-bold text-stone-500">
                    #{index + 1}
                  </span>
                  <button
                    onClick={() => handleMove(index, "down")}
                    disabled={index === banners.length - 1}
                    title="Move banner later"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-charcoal-950/10 text-charcoal-900 transition-colors hover:bg-copper-50 hover:text-copper-600 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <MoveDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Thumbnails (Desktop + Mobile) */}
                <div className="flex items-center gap-3">
                  {/* Desktop Thumbnail */}
                  <div className="relative h-20 w-36 shrink-0 overflow-hidden rounded-xl border border-charcoal-950/10 bg-charcoal-900">
                    <img
                      src={b.desktopImageUrl}
                      alt={`${b.name} desktop`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-semibold text-white">
                      Desktop
                    </span>
                  </div>

                  {/* Mobile Thumbnail */}
                  <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl border border-charcoal-950/10 bg-charcoal-900">
                    <img
                      src={b.mobileImageUrl}
                      alt={`${b.name} mobile`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1 py-0.5 text-[8px] font-semibold text-white">
                      Mobile
                    </span>
                  </div>
                </div>

                {/* Info & Details */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-display text-base font-bold text-charcoal-950">
                      {b.name}
                    </h3>
                    <button
                      onClick={() => handleToggleStatus(b)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all ${
                        b.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {b.status === "Active" ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" /> Inactive / Draft
                        </>
                      )}
                    </button>
                  </div>

                  {b.title && (
                    <p className="truncate text-xs font-medium text-stone-700">
                      Title: <span className="text-charcoal-950 font-semibold">{b.title}</span>
                      {b.subtitle && ` — ${b.subtitle}`}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                    {b.ctaText && (
                      <span className="inline-flex items-center gap-1 text-copper-600 font-medium">
                        <ArrowUpRight className="h-3 w-3" /> CTA: {b.ctaText}
                      </span>
                    )}
                    {b.ctaUrl && (
                      <span className="truncate max-w-[200px] text-stone-400">
                        Link: {b.ctaUrl}
                      </span>
                    )}
                    {b.desktopMetadata?.format && (
                      <span className="uppercase font-mono text-[10px] text-stone-400">
                        Format: {b.desktopMetadata.format}
                      </span>
                    )}
                    {(b.startDate || b.endDate) && (
                      <span className="inline-flex items-center gap-1 text-stone-400 text-[11px]">
                        <Calendar className="h-3 w-3" />
                        {b.startDate ? new Date(b.startDate).toLocaleDateString() : "Any"} →{" "}
                        {b.endDate ? new Date(b.endDate).toLocaleDateString() : "Any"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 sm:pt-0">
                  <button
                    onClick={() => {
                      setFormData({
                        name: b.name,
                        desktopImageUrl: b.desktopImageUrl,
                        mobileImageUrl: b.mobileImageUrl,
                        desktopImageKey: b.desktopImageKey || "",
                        mobileImageKey: b.mobileImageKey || "",
                        desktopMetadata: b.desktopMetadata || {},
                        mobileMetadata: b.mobileMetadata || {},
                        title: b.title || "",
                        subtitle: b.subtitle || "",
                        ctaText: b.ctaText || "",
                        ctaUrl: b.ctaUrl || "",
                        order: b.order,
                        status: b.status,
                        startDate: b.startDate ? b.startDate.substring(0, 10) : "",
                        endDate: b.endDate ? b.endDate.substring(0, 10) : "",
                      });
                      setPreviewModalOpen(true);
                    }}
                    title="Live Preview"
                    className="rounded-xl border border-charcoal-950/10 p-2 text-stone-600 transition-colors hover:border-copper-500 hover:text-copper-600"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleEdit(b)}
                    title="Edit Banner"
                    className="rounded-xl border border-charcoal-950/10 p-2 text-stone-600 transition-colors hover:border-copper-500 hover:text-copper-600"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setBannerToDelete(b)}
                    title="Delete Banner"
                    className="rounded-xl border border-charcoal-950/10 p-2 text-stone-600 transition-colors hover:border-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Live Device Preview Modal ── */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/20 bg-charcoal-950 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-display text-lg font-bold">
                  Banner Live Simulation
                </h3>
                {/* Device switch buttons */}
                <div className="flex items-center rounded-xl bg-white/10 p-1">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                      previewDevice === "desktop"
                        ? "bg-copper-500 text-white"
                        : "text-stone-300 hover:text-white"
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5" /> Desktop View
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                      previewDevice === "mobile"
                        ? "bg-copper-500 text-white"
                        : "text-stone-300 hover:text-white"
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" /> Mobile View
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="rounded-xl p-1.5 text-stone-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Simulated Hero Carousel Section */}
            <div className="mt-6 flex justify-center">
              {previewDevice === "desktop" ? (
                <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black aspect-[21/9]">
                  <img
                    src={formData.desktopImageUrl || formData.mobileImageUrl}
                    alt="Desktop Simulation"
                    className="h-full w-full object-cover"
                  />
                  {/* Overlay text & CTA simulation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex items-center px-10">
                    <div className="max-w-md space-y-3">
                      {formData.title && (
                        <h2 className="font-display text-3xl font-bold text-white drop-shadow">
                          {formData.title}
                        </h2>
                      )}
                      {formData.subtitle && (
                        <p className="text-sm text-stone-200 line-clamp-2">
                          {formData.subtitle}
                        </p>
                      )}
                      {formData.ctaText && (
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-2 rounded-full bg-copper-500 px-5 py-2 text-xs font-bold text-white shadow-lg">
                            {formData.ctaText} <ArrowUpRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-[320px] overflow-hidden rounded-3xl border-4 border-stone-800 bg-black aspect-[9/16] shadow-2xl">
                  <img
                    src={formData.mobileImageUrl || formData.desktopImageUrl}
                    alt="Mobile Simulation"
                    className="h-full w-full object-cover"
                  />
                  {/* Mobile overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5 space-y-2">
                    {formData.title && (
                      <h2 className="font-display text-lg font-bold text-white">
                        {formData.title}
                      </h2>
                    )}
                    {formData.subtitle && (
                      <p className="text-xs text-stone-300 line-clamp-2">
                        {formData.subtitle}
                      </p>
                    )}
                    {formData.ctaText && (
                      <div className="pt-1">
                        <span className="inline-flex items-center justify-center w-full rounded-full bg-copper-500 py-2 text-xs font-bold text-white shadow">
                          {formData.ctaText}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-copper-400" />
                This simulates how your hero banner dynamically renders on user devices.
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="rounded-lg bg-white/10 px-4 py-1.5 font-medium text-white hover:bg-white/20"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirmation Modal for Deleting Banner ── */}
      {bannerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-charcoal-950/10 bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h3 className="mt-4 font-display text-lg font-bold text-charcoal-950">
              Delete Hero Banner?
            </h3>
            <p className="mt-2 text-sm text-stone-600">
              Are you sure you want to delete{" "}
              <strong className="text-charcoal-950">"{bannerToDelete.name}"</strong>?
              This will remove the banner from the website and automatically clean up associated
              image assets from Cloudflare R2 storage.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setBannerToDelete(null)}
              >
                Cancel
              </Button>
              <button
                onClick={confirmDelete}
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-red-700 transition-colors"
              >
                Yes, Delete Banner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
