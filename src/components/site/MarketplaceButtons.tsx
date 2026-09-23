// import { ExternalLink, MessageCircle } from "lucide-react";
import { apiTrackMarketplaceClick } from "../../api";

const WHATSAPP_PHONE = import.meta.env.VITE_WHATSAPP_NUMBER || "919876543210";

// ── Icons ─────────────────────────────────────────────────────────────────────

function AmazonIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <img src="/amazon.png" alt="Amazon" className={`shrink-0 object-contain ${className}`} />;
}

function FlipkartIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <img src="/flipkart.png" alt="Flipkart" className={`shrink-0 object-contain ${className}`} />;
}

function MyntraIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <img src="/myntra.png" alt="Myntra" className={`shrink-0 object-contain ${className}`} />;
}

function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <img src="/whatsapp.png" alt="WhatsApp" className={`shrink-0 object-contain ${className}`} />;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isValidUrl(url?: string | null): boolean {
  return !!url && url.trim().length > 5;
}

function buildWhatsAppUrl(productName: string, productCode?: string): string {
  const label = productCode ? `${productName} (${productCode})` : productName;
  const text = `Hi, I would like to order ${label}.`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

// ── MarketplaceButtons ────────────────────────────────────────────────────────

interface MarketplaceButtonsProps {
  amazonUrl?: string;
  flipkartUrl?: string;
  myntraUrl?: string;
  /** When true, shows the "Order on WhatsApp" button */
  whatsappOrder?: boolean;
  /** Product name used for the WhatsApp pre-filled message */
  productName?: string;
  productCode?: string;
  productId?: string;
  size?: "sm" | "md";
}

export function MarketplaceButtons({
  amazonUrl,
  flipkartUrl,
  myntraUrl,
  whatsappOrder = false,
  productName = "",
  productCode,
  productId,
  size = "md",
}: MarketplaceButtonsProps) {
  const isSm = size === "sm";
  // sm = compact for product cards; md = full size for detail pages
  const px = isSm ? "px-2 py-1.5 text-[11px]" : "px-4 py-2.5 text-sm";
  const iconCls = isSm ? "h-3.5 w-3.5" : "h-4 w-4";

  // Build an ordered list of active buttons
  type BtnId = "amazon" | "flipkart" | "myntra" | "whatsapp";
  type Btn = { id: BtnId; href: string; cls: string; icon: React.ReactNode; label: string };
  const buttons: Btn[] = [];

  if (isValidUrl(amazonUrl))
    buttons.push({
      id: "amazon",
      href: amazonUrl!,
      cls: `border-[#FF9900]/30 bg-[#FF9900]/8 text-[#B8700A] hover:border-[#FF9900]/60 hover:bg-[#FF9900]/15`,
      icon: <AmazonIcon className={iconCls} />,
      label: "Amazon",
    });

  if (isValidUrl(flipkartUrl))
    buttons.push({
      id: "flipkart",
      href: flipkartUrl!,
      cls: `border-[#2874F0]/30 bg-[#2874F0]/8 text-[#1a5cbf] hover:border-[#2874F0]/60 hover:bg-[#2874F0]/15`,
      icon: <FlipkartIcon className={iconCls} />,
      label: "Flipkart",
    });

  if (isValidUrl(myntraUrl))
    buttons.push({
      id: "myntra",
      href: myntraUrl!,
      cls: `border-[#FF3F6C]/30 bg-[#FF3F6C]/8 text-[#cc2455] hover:border-[#FF3F6C]/60 hover:bg-[#FF3F6C]/15`,
      icon: <MyntraIcon className={iconCls} />,
      label: "Myntra",
    });

  if (whatsappOrder && !!productName)
    buttons.push({
      id: "whatsapp",
      href: buildWhatsAppUrl(productName, productCode),
      cls: `border-emerald-300/50 bg-emerald-50 text-emerald-800 hover:border-emerald-400 hover:bg-emerald-100`,
      icon: <WhatsAppIcon className={iconCls} />,
      label: "WhatsApp",
    });

  const count = buttons.length;
  if (count === 0) return null;

  // Grid: always 2 columns for 2+ buttons, 1 column for single button
  // For sm size, use auto-fill so buttons never overflow their column
  const gridClass = count === 1
    ? "grid-cols-1"
    : isSm
      ? "grid-cols-2"
      : "grid-cols-2";

  const gapClass = isSm ? "gap-1.5" : "gap-2";

  return (
    <div className={`grid w-full ${gapClass} ${gridClass}`}>
      {buttons.map((btn, i) => {
        // The last button spans 2 cols when the total count is odd (3 buttons)
        const isLastOfOdd = count % 2 === 1 && i === count - 1;
        return (
          <a
            key={btn.id}
            href={btn.href}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              if (productId) {
                apiTrackMarketplaceClick(productId, btn.id).catch(console.error);
              }
            }}
            className={`group flex items-center justify-center gap-1.5 rounded-xl border font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${btn.cls} ${px} ${isLastOfOdd ? "col-span-2" : ""}`}
          >
            <span className="shrink-0">{btn.icon}</span>
            <span className="leading-tight">{btn.label}</span>
          </a>
        );
      })}
    </div>
  );
}

/** Legacy standalone WhatsApp CTA — kept for backward compat */
export function WhatsAppCTA({
  productName,
  productCode,
}: {
  productName: string;
  productCode?: string;
}) {
  return (
    <a
      href={buildWhatsAppUrl(productName, productCode)}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm font-semibold text-emerald-800 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-100 hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white transition-transform group-hover:scale-110">
        <WhatsAppIcon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-xs font-medium text-emerald-600">Order via</span>
        <span className="text-base font-bold text-emerald-900">WhatsApp</span>
      </span>
    </a>
  );
}
