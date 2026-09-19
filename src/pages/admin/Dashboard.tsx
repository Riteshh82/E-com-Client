import { useEffect, useState } from "react";
import { Package, Sparkles, ClipboardList, MessageSquare, Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { StatsCard } from "../../components/admin/StatsCard";
import { apiGetProducts, apiGetBulkOrders, apiGetMessages, type ApiBulkOrder } from "../../api";
import { Badge } from "../../components/ui/index";
import { formatDate } from "../../lib/utils";

const statusVariant: Record<string, "copper" | "success" | "warning" | "neutral" | "dark"> = {
  New: "copper",
  Contacted: "neutral",
  "In Progress": "warning",
  Quoted: "warning",
  Completed: "success",
  Cancelled: "neutral",
};

// Static trend charts — analytics endpoint not yet available
const productViewsChart = [
  { month: "Apr", views: 1240 },
  { month: "May", views: 1890 },
  { month: "Jun", views: 2100 },
  { month: "Jul", views: 2460 },
  { month: "Aug", views: 3020 },
  { month: "Sep", views: 3540 },
];

const bulkInquiriesChart = [
  { month: "Apr", inquiries: 4 },
  { month: "May", inquiries: 7 },
  { month: "Jun", inquiries: 5 },
  { month: "Jul", inquiries: 9 },
  { month: "Aug", inquiries: 12 },
  { month: "Sep", inquiries: 6 },
];

const marketplaceClicksChart = [
  { name: "Amazon", clicks: 1840 },
  { name: "Flipkart", clicks: 1320 },
];

export default function Dashboard() {
  const [stats, setStats] = useState({ totalProducts: 0, featuredProducts: 0, bulkInquiries: 0, contactMessages: 0 });
  const [recentOrders, setRecentOrders] = useState<ApiBulkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGetProducts(),
      apiGetBulkOrders(),
      apiGetMessages(),
    ])
      .then(([productsRes, ordersRes, messagesRes]) => {
        const products = productsRes.products;
        setStats({
          totalProducts: productsRes.total,
          featuredProducts: products.filter((p) => p.featured).length,
          bulkInquiries: ordersRes.total,
          contactMessages: messagesRes.total,
        });
        setRecentOrders(ordersRes.orders.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
        <p className="mt-1 text-sm text-stone-500">Welcome back — here's how Next Steel Innovation is performing.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={Package} label="Total Products" value={stats.totalProducts} trend="+2 this month" />
        <StatsCard icon={Sparkles} label="Featured Products" value={stats.featuredProducts} accent="dark" />
        <StatsCard icon={ClipboardList} label="Bulk Inquiries" value={stats.bulkInquiries} trend="+3 this week" />
        <StatsCard icon={MessageSquare} label="Contact Messages" value={stats.contactMessages} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-charcoal-950/8 bg-white p-6 lg:col-span-2">
          <h3 className="font-display text-lg text-charcoal-950">Product Views</h3>
          <p className="text-sm text-stone-500">Monthly product page views across the catalog</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productViewsChart}>
                <CartesianGrid stroke="#EDE3D3" vertical={false} />
                <XAxis dataKey="month" stroke="#7A7168" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#7A7168" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EDE3D3" }} />
                <Line type="monotone" dataKey="views" stroke="#B8703E" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-charcoal-950/8 bg-white p-6">
          <h3 className="font-display text-lg text-charcoal-950">Marketplace Clicks</h3>
          <p className="text-sm text-stone-500">Amazon vs Flipkart</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketplaceClicksChart}>
                <CartesianGrid stroke="#EDE3D3" vertical={false} />
                <XAxis dataKey="name" stroke="#7A7168" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#7A7168" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EDE3D3" }} />
                <Bar dataKey="clicks" fill="#B8703E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-charcoal-950/8 bg-white p-6 lg:col-span-1">
          <h3 className="font-display text-lg text-charcoal-950">Bulk Inquiries</h3>
          <p className="text-sm text-stone-500">Monthly inquiry volume</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bulkInquiriesChart}>
                <CartesianGrid stroke="#EDE3D3" vertical={false} />
                <XAxis dataKey="month" stroke="#7A7168" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#7A7168" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EDE3D3" }} />
                <Bar dataKey="inquiries" fill="#17140F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-charcoal-950/8 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-charcoal-950">Recent Bulk Inquiries</h3>
          </div>
          <div className="mt-4 divide-y divide-charcoal-950/8">
            {recentOrders.length === 0 ? (
              <p className="py-6 text-center text-sm text-stone-400">No inquiries yet.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-charcoal-950">{order.customerName}</p>
                    <p className="text-xs text-stone-500">
                      {order.product} · {order.quantity} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
