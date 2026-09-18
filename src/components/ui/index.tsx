import { forwardRef, type HTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-charcoal-950/8 bg-white",
        className
      )}
      {...props}
    />
  );
}

export function Badge({
  className,
  variant = "copper",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: "copper" | "dark" | "outline" | "success" | "warning" | "neutral" }) {
  const variants: Record<string, string> = {
    copper: "bg-copper-500/10 text-copper-700 border border-copper-500/20",
    dark: "bg-charcoal-950 text-cream-50",
    outline: "border border-charcoal-950/15 text-charcoal-950",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    neutral: "bg-stone-500/10 text-stone-600 border border-stone-500/15",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <label className="block">
        {label && (
          <span className="mb-1.5 block text-sm font-medium text-charcoal-900">{label}</span>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-charcoal-950 placeholder:text-stone-400",
            "focus:border-copper-500 focus:ring-2 focus:ring-copper-500/20 outline-none transition-colors",
            error ? "border-red-400" : "border-charcoal-950/12",
            className
          )}
          {...props}
        />
        {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
      </label>
    );
  }
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <label className="block">
        {label && (
          <span className="mb-1.5 block text-sm font-medium text-charcoal-900">{label}</span>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-charcoal-950 placeholder:text-stone-400",
            "focus:border-copper-500 focus:ring-2 focus:ring-copper-500/20 outline-none transition-colors resize-none",
            error ? "border-red-400" : "border-charcoal-950/12",
            className
          )}
          {...props}
        />
        {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
      </label>
    );
  }
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { label?: string }>(
  ({ className, label, id, children, ...props }, ref) => {
    return (
      <label className="block">
        {label && (
          <span className="mb-1.5 block text-sm font-medium text-charcoal-900">{label}</span>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border border-charcoal-950/12 bg-white px-4 py-2.5 text-sm text-charcoal-950",
            "focus:border-copper-500 focus:ring-2 focus:ring-copper-500/20 outline-none transition-colors",
            className
          )}
          {...props}
        >
          {children}
        </select>
      </label>
    );
  }
);
Select.displayName = "Select";
