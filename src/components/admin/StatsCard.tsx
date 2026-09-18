import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

export function StatsCard({
  icon: Icon,
  label,
  value,
  trend,
  accent = "copper",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  accent?: "copper" | "dark";
}) {
  return (
    <div className="rounded-2xl border border-charcoal-950/8 bg-white p-6">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full",
            accent === "copper" ? "bg-copper-50 text-copper-600" : "bg-charcoal-950 text-copper-300"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        {trend && <span className="text-xs font-medium text-emerald-600">{trend}</span>}
      </div>
      <p className="mt-5 font-display text-3xl text-charcoal-950">{value}</p>
      <p className="mt-1 text-sm text-stone-500">{label}</p>
    </div>
  );
}
