import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Sparkles,
  ClipboardList,
  MessageSquare,
  Loader2,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { StatsCard } from "../../components/admin/StatsCard";
import {
  apiGetProducts,
  apiGetBulkOrders,
  apiGetMessages,
  type ApiProduct,
  type ApiBulkOrder,
  type ApiContactMessage,
} from "../../api";
import { Badge } from "../../components/ui/index";
import { formatDate } from "../../lib/utils";

// ── Helpers ────────────────────────────────────────────────────────────────────

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function lastNMonths(n: number): string[] {
  const now = new Date();
  const months: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`);
  }
  return months;
}

function toMonthLabel(iso: string) {
  const d = new Date(iso);
  return `${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`;
}

function countByMonth(dates: string[], months: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  months.forEach((m) => (map[m] = 0));
  dates.forEach((iso) => {
    const label = toMonthLabel(iso);
    if (label in map) map[label]++;
  });
  return map;
}

function shortLabel(label: string) {
  const [mon, year] = label.split(" ");
  return mon === "Jan" ? `${mon} '${year.slice(2)}` : mon;
}

const statusVariant: Record<string, "copper" | "success" | "warning" | "neutral" | "dark"> = {
  New: "copper",
  Contacted: "neutral",
  "In Progress": "warning",
  Quoted: "warning",
  Completed: "success",
  Cancelled: "neutral",
  Unread: "copper",
  Read: "neutral",
  Replied: "success",
};

const CHART_STYLE = { borderRadius: 12, border: "1px solid #EDE3D3", fontSize: 12 };

// ── Component ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [orders, setOrders] = useState<ApiBulkOrder[]>([]);
  const [messages, setMessages] = useState<ApiContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGetProducts({ limit: "500" }),
      apiGetBulkOrders({ limit: "500" }),
      apiGetMessages({ limit: "500" }),
    ])
      .then(([pRes, oRes, mRes]) => {
        setProducts(pRes.products);
        setOrders(oRes.orders);
        setMessages(mRes.messages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Derived stats ────────────────────────────────────────────────────────────
  const months6 = useMemo(() => lastNMonths(6), []);
  const now = new Date();
  const thisMonthLabel = `${MONTH_LABELS[now.getMonth()]} ${now.getFullYear()}`;

  const newProductsThisMonth = useMemo(
    () => products.filter((p) => toMonthLabel(p.createdAt) === thisMonthLabel).length,
    [products, thisMonthLabel]
  );
  const newOrdersThisMonth = useMemo(
    () => orders.filter((o) => toMonthLabel(o.createdAt) === thisMonthLabel).length,
    [orders, thisMonthLabel]
  );
  const newMessagesThisMonth = useMemo(
    () => messages.filter((m) => toMonthLabel(m.createdAt) === thisMonthLabel).length,
    [messages, thisMonthLabel]
  );
  const unreadCount = useMemo(() => messages.filter((m) => m.status === "Unread").length, [messages]);

  // ── Chart data ───────────────────────────────────────────────────────────────

  // Top 10 most-viewed products
  const topViewsChart = useMemo(() => {
    return [...products]
      .filter((p) => p.views > 0)
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)
      .map((p, i) => ({
        id: `${i}-${p._id ?? p.name}`,   // guaranteed unique key for recharts
        label: p.name.length > 18 ? p.name.slice(0, 16) + "…" : p.name,
        fullName: p.name,                 // full name shown on tooltip hover
        views: p.views,
      }));
  }, [products]);

  // Bulk inquiries by month (last 6 months)
  const inquiryByMonth = useMemo(() => {
    const counts = countByMonth(orders.map((o) => o.createdAt), months6);
    return months6.map((m) => ({ month: shortLabel(m), inquiries: counts[m] }));
  }, [orders, months6]);

  // Marketplace link clicks
  const marketplaceChart = useMemo(() => {
    let amazon = 0, flipkart = 0, myntra = 0, whatsapp = 0;
    products.forEach((p) => {
      amazon += (p as any).amazonClicks || 0;
      flipkart += (p as any).flipkartClicks || 0;
      myntra += (p as any).myntraClicks || 0;
      whatsapp += (p as any).whatsappClicks || 0;
    });

    return [
      { name: "Amazon", count: amazon, color: "#FF9900" },
      { name: "Flipkart", count: flipkart, color: "#2874F0" },
      { name: "Myntra", count: myntra, color: "#FF3F6C" },
      { name: "WhatsApp", count: whatsapp, color: "#10b981" },
    ].filter((d) => d.count > 0);
  }, [products]);

  // Inquiry status breakdown
  const orderStatusChart = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => { map[o.status] = (map[o.status] ?? 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [orders]);

  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [orders]
  );
  const recentMessages = useMemo(
    () => [...messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [messages]
  );

  // ── Render ───────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-copper-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-charcoal-950">Dashboard</h1>
        <p className="mt-1 text-sm text-stone-500">
          Welcome back — here's how Next Steel Innovation is performing.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={Package}
          label="Total Products"
          value={products.length}
          trend={newProductsThisMonth > 0 ? `+${newProductsThisMonth} this month` : undefined}
        />
        <StatsCard
          icon={Sparkles}
          label="Featured Products"
          value={products.filter((p) => p.featured).length}
          accent="dark"
        />
        <StatsCard
          icon={ClipboardList}
          label="Bulk Inquiries"
          value={orders.length}
          trend={newOrdersThisMonth > 0 ? `+${newOrdersThisMonth} this month` : undefined}
        />
        <StatsCard
          icon={MessageSquare}
          label="Contact Messages"
          value={messages.length}
          trend={
            unreadCount > 0
              ? `${unreadCount} unread`
              : newMessagesThisMonth > 0
              ? `+${newMessagesThisMonth} this month`
              : undefined
          }
        />
      </div>

      {/* Charts row 1: Product views + Marketplace */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-charcoal-950/8 bg-white p-5 lg:col-span-2">
          <h3 className="font-display text-base text-charcoal-950">Top Viewed Products</h3>
          <p className="text-xs text-stone-500">Ranked by total page views</p>
          <div className="mt-4 h-64">
            {topViewsChart.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-stone-400">
                No product views recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topViewsChart} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid stroke="#EDE3D3" horizontal={false} />
                  <XAxis type="number" stroke="#7A7168" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="id"
                    tickFormatter={(id: string) => {
                      const item = topViewsChart.find((d) => d.id === id);
                      return item?.label ?? id;
                    }}
                    stroke="#7A7168"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={CHART_STYLE}
                    formatter={(value: any) => [value, "views"]}
                    labelFormatter={(id: any) => {
                      const item = topViewsChart.find((d) => d.id === id);
                      return item?.fullName ?? id;
                    }}
                  />
                  <Bar dataKey="views" fill="#B8703E" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-charcoal-950/8 bg-white p-5">
          <h3 className="font-display text-base text-charcoal-950">Marketplace Links</h3>
          <p className="text-xs text-stone-500">Products listed per marketplace</p>
          <div className="mt-4 h-64">
            {marketplaceChart.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-stone-400">
                No marketplace URLs added yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketplaceChart}>
                  <CartesianGrid stroke="#EDE3D3" vertical={false} />
                  <XAxis dataKey="name" stroke="#7A7168" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#7A7168" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={CHART_STYLE} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {marketplaceChart.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Charts row 2: Monthly inquiries + Status breakdowns */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-charcoal-950/8 bg-white p-5">
          <h3 className="font-display text-base text-charcoal-950">Bulk Inquiries</h3>
          <p className="text-xs text-stone-500">Monthly volume — last 6 months</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inquiryByMonth}>
                <CartesianGrid stroke="#EDE3D3" vertical={false} />
                <XAxis dataKey="month" stroke="#7A7168" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#7A7168" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={CHART_STYLE} />
                <Bar dataKey="inquiries" fill="#17140F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-charcoal-950/8 bg-white p-5">
          <h3 className="font-display text-base text-charcoal-950">Inquiry Status</h3>
          <p className="text-xs text-stone-500">Breakdown by current status</p>
          <div className="mt-5 space-y-3">
            {orderStatusChart.length === 0 ? (
              <p className="py-6 text-center text-sm text-stone-400">No inquiries yet.</p>
            ) : (
              orderStatusChart.map(([status, count]) => (
                <div key={status} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-xs text-stone-600">{status}</span>
                  <div className="flex-1 overflow-hidden rounded-full bg-beige-100">
                    <div
                      className="h-2 rounded-full bg-copper-500 transition-all duration-500"
                      style={{ width: `${Math.round((count / orders.length) * 100)}%` }}
                    />
                  </div>
                  <span className="w-5 text-right text-xs font-semibold text-charcoal-950">{count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-charcoal-950/8 bg-white p-5">
          <h3 className="font-display text-base text-charcoal-950">Product Status</h3>
          <p className="text-xs text-stone-500">Catalog health overview</p>
          <div className="mt-5 space-y-3">
            {[
              { label: "Published", count: products.filter((p) => p.status === "Published").length, color: "bg-emerald-500" },
              { label: "Draft", count: products.filter((p) => p.status === "Draft").length, color: "bg-amber-400" },
              { label: "Featured", count: products.filter((p) => p.featured).length, color: "bg-copper-500" },
              { label: "WhatsApp on", count: products.filter((p) => p.whatsappOrder).length, color: "bg-emerald-400" },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-xs text-stone-600">{label}</span>
                <div className="flex-1 overflow-hidden rounded-full bg-beige-100">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${color}`}
                    style={{ width: products.length > 0 ? `${Math.round((count / products.length) * 100)}%` : "0%" }}
                  />
                </div>
                <span className="w-5 text-right text-xs font-semibold text-charcoal-950">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-charcoal-950/8 bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base text-charcoal-950">Recent Bulk Inquiries</h3>
            <Link to="/admin/bulk-orders" className="flex items-center gap-1 text-xs text-copper-600 hover:text-copper-700">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-4 divide-y divide-charcoal-950/8">
            {recentOrders.length === 0 ? (
              <p className="py-6 text-center text-sm text-stone-400">No inquiries yet.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-charcoal-950">{order.customerName}</p>
                    <p className="truncate text-xs text-stone-500">
                      {order.product} · {order.quantity} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-charcoal-950/8 bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base text-charcoal-950">Recent Messages</h3>
            <Link to="/admin/messages" className="flex items-center gap-1 text-xs text-copper-600 hover:text-copper-700">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-4 divide-y divide-charcoal-950/8">
            {recentMessages.length === 0 ? (
              <p className="py-6 text-center text-sm text-stone-400">No messages yet.</p>
            ) : (
              recentMessages.map((m) => (
                <div key={m._id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex min-w-0 items-center gap-2">
                    {m.status === "Unread" && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-copper-500" />
                    )}
                    <div className="min-w-0">
                      <p className={`truncate text-sm text-charcoal-950 ${m.status === "Unread" ? "font-semibold" : "font-medium"}`}>
                        {m.name}
                      </p>
                      <p className="truncate text-xs text-stone-500">
                        {m.subject} · {formatDate(m.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={statusVariant[m.status]}>{m.status}</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
