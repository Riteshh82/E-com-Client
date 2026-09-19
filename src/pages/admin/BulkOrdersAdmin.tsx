import { useEffect, useMemo, useState } from "react";
import { Paperclip, Phone, Mail, Building2, MapPin, Calendar, Package, StickyNote, Send, Loader2 } from "lucide-react";
import {
  apiGetBulkOrders,
  apiUpdateBulkOrder,
  type ApiBulkOrder,
  type InquiryStatus,
} from "../../api";
import { Badge } from "../../components/ui/index";
import { Button } from "../../components/ui/Button";
import { Drawer } from "../../components/ui/Overlay";
import { Textarea } from "../../components/ui/index";
import { formatDate } from "../../lib/utils";
import { useToast } from "../../context/ToastContext";

const statuses: InquiryStatus[] = ["New", "Contacted", "In Progress", "Quoted", "Completed", "Cancelled"];

const statusVariant: Record<InquiryStatus, "copper" | "success" | "warning" | "neutral"> = {
  New: "copper",
  Contacted: "neutral",
  "In Progress": "warning",
  Quoted: "warning",
  Completed: "success",
  Cancelled: "neutral",
};

const statusColors: Record<InquiryStatus, string> = {
  New: "bg-copper-500 text-white",
  Contacted: "bg-stone-500 text-white",
  "In Progress": "bg-amber-500 text-white",
  Quoted: "bg-blue-500 text-white",
  Completed: "bg-emerald-500 text-white",
  Cancelled: "bg-stone-300 text-stone-700",
};

export default function BulkOrdersAdmin() {
  const [orders, setOrders] = useState<ApiBulkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<ApiBulkOrder | null>(null);
  const [note, setNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    apiGetBulkOrders({ limit: "200" })
      .then((r) => setOrders(r.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => orders.filter((o) => statusFilter === "all" || o.status === statusFilter),
    [orders, statusFilter]
  );

  const updateStatus = async (id: string, status: InquiryStatus) => {
    setUpdatingStatus(true);
    try {
      const updated = await apiUpdateBulkOrder(id, { status });
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
      setSelected((prev) => (prev && prev._id === id ? updated : prev));
      showToast(`Status updated to "${status}".`);
    } catch {
      showToast("Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const addNote = async () => {
    if (!selected || !note.trim()) return;
    setAddingNote(true);
    try {
      const updated = await apiUpdateBulkOrder(selected._id, { note: note.trim() });
      setOrders((prev) => prev.map((o) => (o._id === selected._id ? updated : o)));
      setSelected(updated);
      setNote("");
      showToast("Note added.");
    } catch {
      showToast("Failed to add note.");
    } finally {
      setAddingNote(false);
    }
  };

  // Status counts
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: orders.length };
    statuses.forEach((s) => { map[s] = orders.filter((o) => o.status === s).length; });
    return map;
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-charcoal-950">Bulk Orders</h1>
          <p className="mt-1 text-sm text-stone-500">{orders.length} total inquiries received</p>
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
            statusFilter === "all"
              ? "border-charcoal-950 bg-charcoal-950 text-cream-50"
              : "border-charcoal-950/15 text-charcoal-800 hover:border-charcoal-950"
          }`}
        >
          All ({counts["all"]})
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
              statusFilter === s
                ? "border-charcoal-950 bg-charcoal-950 text-cream-50"
                : "border-charcoal-950/15 text-charcoal-800 hover:border-charcoal-950"
            }`}
          >
            {s} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-copper-500" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-charcoal-950/8 bg-white">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-charcoal-950/8 bg-beige-100/40 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-5 py-3.5 font-medium">Customer</th>
                <th className="px-5 py-3.5 font-medium">Company</th>
                <th className="px-5 py-3.5 font-medium">Product</th>
                <th className="px-5 py-3.5 font-medium">Quantity</th>
                <th className="px-5 py-3.5 font-medium">City</th>
                <th className="px-5 py-3.5 font-medium">Date</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-950/6">
              {filtered.map((o) => (
                <tr
                  key={o._id}
                  className="cursor-pointer hover:bg-beige-100/40 transition-colors"
                  onClick={() => setSelected(o)}
                >
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-charcoal-950">{o.customerName}</p>
                    <p className="text-xs text-stone-400">{o.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-stone-600">{o.company}</td>
                  <td className="px-5 py-3.5 text-stone-600">{o.product}</td>
                  <td className="px-5 py-3.5 text-stone-600">{o.quantity}</td>
                  <td className="px-5 py-3.5 text-stone-600">{o.city}</td>
                  <td className="px-5 py-3.5 text-stone-500 text-xs">{formatDate(o.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={statusVariant[o.status]}>{o.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => { e.stopPropagation(); setSelected(o); }}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-stone-400">
              No inquiries matching this status.
            </div>
          )}
        </div>
      )}

      {/* Detail Drawer */}
      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Inquiry Details">
        {selected && (
          <div className="space-y-7">
            {/* Customer header */}
            <div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl text-charcoal-950">{selected.customerName}</h3>
                  <div className="mt-0.5 flex items-center gap-1.5 text-sm text-stone-500">
                    <Building2 className="h-3.5 w-3.5" />
                    {selected.company}
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusColors[selected.status]}`}>
                  {selected.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`tel:${selected.phone}`}
                  className="flex items-center gap-2 rounded-lg border border-charcoal-950/10 bg-white px-3.5 py-2 text-sm text-charcoal-800 hover:border-copper-400 hover:text-copper-600 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {selected.phone}
                </a>
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-2 rounded-lg border border-charcoal-950/10 bg-white px-3.5 py-2 text-sm text-charcoal-800 hover:border-copper-400 hover:text-copper-600 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {selected.email}
                </a>
              </div>
            </div>

            {/* Order details grid */}
            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-charcoal-950/8 bg-beige-100/40 p-5">
              {[
                { label: "Product", value: selected.product, icon: Package },
                { label: "Quantity", value: selected.quantity, icon: Package },
                { label: "City", value: selected.city, icon: MapPin },
                { label: "Project Type", value: selected.projectType, icon: Building2 },
                { label: "Date", value: formatDate(selected.createdAt), icon: Calendar },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label}>
                  <p className="flex items-center gap-1 text-xs text-stone-400">
                    <Icon className="h-3 w-3" />
                    {label}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-charcoal-950">{value || "—"}</p>
                </div>
              ))}
            </div>

            {/* Message */}
            <div>
              <p className="flex items-center gap-1.5 text-sm font-medium text-charcoal-900">
                <Mail className="h-3.5 w-3.5" /> Customer Message
              </p>
              <p className="mt-2 rounded-2xl border border-charcoal-950/8 bg-white p-4 text-sm leading-relaxed text-stone-600">
                {selected.message || "No message provided."}
              </p>
            </div>

            {/* Status update */}
            <div>
              <p className="text-sm font-medium text-charcoal-900">Update Status</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => !updatingStatus && updateStatus(selected._id, s)}
                    disabled={updatingStatus}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${
                      selected.status === s
                        ? `${statusColors[s]} border-transparent`
                        : "border-charcoal-950/12 text-charcoal-800 hover:border-copper-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <p className="flex items-center gap-1.5 text-sm font-medium text-charcoal-900">
                <StickyNote className="h-3.5 w-3.5" /> Notes
              </p>
              <div className="mt-2 space-y-2">
                {selected.notes.length === 0 ? (
                  <p className="text-sm text-stone-400">No notes yet. Add your first note below.</p>
                ) : (
                  selected.notes.map((n, i) => (
                    <p key={i} className="rounded-xl border border-charcoal-950/8 bg-white p-3 text-sm text-stone-600">
                      {n}
                    </p>
                  ))
                )}
              </div>
              <div className="mt-3 space-y-2">
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="Add a note about this inquiry…"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={addNote} disabled={addingNote} className="flex items-center gap-1.5">
                    <StickyNote className="h-3.5 w-3.5" /> {addingNote ? "Adding…" : "Add Note"}
                  </Button>
                  <a href={`mailto:${selected.email}?subject=Re: ${selected.product} bulk inquiry`}>
                    <Button size="sm" variant="outline" className="flex items-center gap-1.5">
                      <Send className="h-3.5 w-3.5" /> Email Customer
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
