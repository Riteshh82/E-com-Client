import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

function useLockBody(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  useLockBody(open);
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-charcoal-950/50 backdrop-blur-sm animate-fade-up"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 w-full rounded-2xl bg-white shadow-2xl animate-fade-up max-h-[90vh] overflow-y-auto",
          maxWidth
        )}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-charcoal-950/8 bg-white px-6 py-4 rounded-t-2xl">
          <h3 className="font-display text-lg text-charcoal-950">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-stone-500 hover:bg-beige-100 hover:text-charcoal-950"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  useLockBody(open);
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-charcoal-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl"
        style={{ animation: "slide-in 0.3s ease-out" }}
      >
        <style>{`@keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-charcoal-950/8 bg-white px-6 py-4">
          <h3 className="font-display text-lg text-charcoal-950">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-stone-500 hover:bg-beige-100 hover:text-charcoal-950"
            aria-label="Close panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  destructive = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <p className="text-sm text-stone-600">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={destructive ? "primary" : "secondary"}
          className={destructive ? "bg-red-600 hover:bg-red-700" : ""}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-beige-100", className)} />;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-charcoal-950/12 px-6 py-16 text-center">
      {icon && <div className="mb-4 text-copper-400">{icon}</div>}
      <h3 className="font-display text-lg text-charcoal-950">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-stone-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
