import { useState } from "react";
import { contactMessages as initialMessages, type ContactMessage, type MessageStatus } from "../../data/mockData";
import { Badge } from "../../components/ui/index";
import { Drawer } from "../../components/ui/Overlay";
import { formatDate } from "../../lib/utils";
import { Mail, Phone, Reply, Eye, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";

const statusVariant: Record<MessageStatus, "copper" | "success" | "neutral"> = {
  Unread: "copper",
  Read: "neutral",
  Replied: "success",
};

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const { showToast } = useToast();

  const open = (m: ContactMessage) => {
    setSelected(m);
    if (m.status === "Unread") {
      setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, status: "Read" } : x)));
    }
  };

  const markReplied = () => {
    if (!selected) return;
    setMessages((prev) =>
      prev.map((x) => (x.id === selected.id ? { ...x, status: "Replied" } : x))
    );
    setSelected((prev) => (prev ? { ...prev, status: "Replied" } : prev));
    showToast("Message marked as replied.");
  };

  const unreadCount = messages.filter((m) => m.status === "Unread").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-charcoal-950">Contact Messages</h1>
          <p className="mt-1 text-sm text-stone-500">
            {messages.length} messages total
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-copper-500/10 px-2 py-0.5 text-xs font-medium text-copper-700">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-charcoal-950/8 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-charcoal-950/8 bg-beige-100/40 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-5 py-3.5 font-medium">Name</th>
              <th className="px-5 py-3.5 font-medium">Email</th>
              <th className="px-5 py-3.5 font-medium">Phone</th>
              <th className="px-5 py-3.5 font-medium">Subject</th>
              <th className="px-5 py-3.5 font-medium">Date</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
              <th className="px-5 py-3.5 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-950/6">
            {messages.map((m) => (
              <tr
                key={m.id}
                className={`cursor-pointer transition-colors hover:bg-beige-100/40 ${
                  m.status === "Unread" ? "font-medium" : ""
                }`}
                onClick={() => open(m)}
              >
                <td className="px-5 py-3.5 text-charcoal-950">
                  <div className="flex items-center gap-2">
                    {m.status === "Unread" && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-copper-500" />
                    )}
                    {m.name}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-stone-600">{m.email}</td>
                <td className="px-5 py-3.5 text-stone-600">{m.phone}</td>
                <td className="px-5 py-3.5 text-stone-700">{m.subject}</td>
                <td className="px-5 py-3.5 text-stone-500 text-xs">{formatDate(m.date)}</td>
                <td className="px-5 py-3.5">
                  <Badge variant={statusVariant[m.status]}>{m.status}</Badge>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={(e) => { e.stopPropagation(); open(m); }}
                    className="rounded-lg p-1.5 text-stone-400 hover:bg-beige-100 hover:text-charcoal-950"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Drawer */}
      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.subject ?? "Message"}>
        {selected && (
          <div className="space-y-6">
            {/* Sender */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl text-charcoal-950">{selected.name}</p>
                <div className="mt-2 space-y-1.5">
                  <a
                    href={`mailto:${selected.email}`}
                    className="flex items-center gap-2 text-sm text-stone-500 hover:text-copper-600"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {selected.email}
                  </a>
                  <a
                    href={`tel:${selected.phone}`}
                    className="flex items-center gap-2 text-sm text-stone-500 hover:text-copper-600"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {selected.phone}
                  </a>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={statusVariant[selected.status]}>{selected.status}</Badge>
                <span className="text-xs text-stone-400">{formatDate(selected.date)}</span>
              </div>
            </div>

            {/* Subject */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Subject</p>
              <p className="mt-1 font-medium text-charcoal-950">{selected.subject}</p>
            </div>

            {/* Message */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Message</p>
              <p className="mt-2 rounded-2xl border border-charcoal-950/8 bg-beige-100/30 p-5 text-sm leading-relaxed text-stone-700">
                {selected.message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 border-t border-charcoal-950/8 pt-5">
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                onClick={markReplied}
              >
                <Button size="sm" className="flex items-center gap-1.5">
                  <Reply className="h-3.5 w-3.5" />
                  Reply via Email
                </Button>
              </a>
              {selected.status !== "Replied" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={markReplied}
                  className="flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Mark as Replied
                </Button>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
