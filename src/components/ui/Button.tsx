import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-full disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<string, string> = {
  primary:
    "bg-copper-500 text-cream-50 hover:bg-copper-600 shadow-sm hover:shadow-md hover:-translate-y-0.5",
  secondary:
    "bg-charcoal-950 text-cream-50 hover:bg-charcoal-800 shadow-sm hover:shadow-md hover:-translate-y-0.5",
  outline:
    "border border-charcoal-950/20 text-charcoal-950 hover:border-copper-500 hover:text-copper-600 bg-transparent",
  ghost: "text-charcoal-950 hover:bg-beige-100",
  dark: "bg-cream-50/10 text-cream-50 border border-cream-50/25 hover:bg-cream-50/20 backdrop-blur-sm",
};

const sizes: Record<string, string> = {
  sm: "text-xs px-4 py-2",
  md: "text-sm px-6 py-3",
  lg: "text-base px-8 py-4",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
