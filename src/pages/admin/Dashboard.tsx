import { Package, Sparkles, ClipboardList, MessageSquare } from "lucide-react";
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
import {
  dashboardStats,
  productViewsChart,
  bulkInquiriesChart,
  marketplaceClicksChart,
  bulkOrders,
} from "../../data/mockData";
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

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-charcoal-950">Dashboard</h1>
        <p className="mt-1 text-sm text-stone-500">Welcome back — here's how Coppera is performing.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={Package} label="Total Products" value={dashboardStats.totalProducts} trend="+2 this month" />
        <StatsCard icon={Sparkles} label="Featured Products" value={dashboardStats.featuredProducts} accent="dark" />
        <StatsCard icon={ClipboardList} label="Bulk Inquiries" value={dashboardStats.bulkInquiries} trend="+3 this week" />
        <StatsCard icon={MessageSquare} label="Contact Messages" value={dashboardStats.contactMessages} />
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
            {bulkOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium text-charcoal-950">{order.customerName}</p>
                  <p className="text-xs text-stone-500">
                    {order.product} · {order.quantity} · {formatDate(order.date)}
                  </p>
                </div>
                <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
