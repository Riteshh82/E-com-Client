import { ExternalLink, MessageCircle } from "lucide-react";

const WHATSAPP_PHONE = import.meta.env.VITE_WHATSAPP_NUMBER || "919876543210";

// ── Icons ─────────────────────────────────────────────────────────────────────

function AmazonIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M443.4 421.5C232.1 522 100.9 437.9 16.9 386.8c-5.2-3.2-14 .8-6.4 9.6C38.6 430.3 130.2 512 249.9 512s191-65.3 199.9-76.7c8.8-11.3 2.5-17.6-6.4-13.8m59.3-32.8c-5.7-7.4-34.5-8.8-52.7-6.5-18.2 2.2-45.5 13.3-43.1 19.9 1.2 2.5 3.7 1.4 16.2.3 12.5-1.2 47.6-5.7 54.9 3.9s-11.2 55.4-14.6 62.8c-3.3 7.4 1.2 9.3 7.4 4.4 6.1-4.9 17-17.7 24.4-35.7 7.4-18.2 11.8-43.5 7.5-49.1" fill="#f90" />
      <path d="M301.3 216.3c0 26.4.7 48.4-12.7 71.8-10.8 19.1-27.8 30.8-46.9 30.8-26 0-41.2-19.8-41.2-49.1 0-57.7 51.7-68.2 100.7-68.2v14.7zm68.3 165.1c-4.5 4-11 4.3-16 1.6-22.5-18.7-26.5-27.3-38.9-45.2-37.2 37.9-63.4 49.3-111.7 49.3-57 0-101.4-35.2-101.4-105.6 0-55 29.8-92.4 72.2-110.7 36.8-16.2 88.1-19.1 127.4-23.5v-8.8c0-16.1 1.2-35.2-8.2-49.1-8.3-12.5-24.1-17.6-38-17.6-25.8 0-48.9 13.2-54.5 40.7-1.1 6.1-5.6 12.1-11.7 12.4l-65.7-7c-5.5-1.2-11.6-5.7-10.1-14.2C128.2 24 200.1 0 264.5 0c33 0 76 8.8 102 33.7 33 30.8 29.8 71.8 29.8 116.5v105.6c0 31.7 13.1 45.6 25.5 62.8 4.4 6.1 5.3 13.4-.2 18-13.8 11.5-38.4 33-51.9 45z" fill="#000" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

function FlipkartIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <img src="/flipkart.png" alt="Flipkart" className={className} />;
}

function MyntraIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <img src="/myntra.png" alt="Myntra" className={className} />;
}

function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
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
  size?: "sm" | "md";
}

export function MarketplaceButtons({
  amazonUrl,
  flipkartUrl,
  myntraUrl,
  whatsappOrder = false,
  productName = "",
  productCode,
  size = "md",
}: MarketplaceButtonsProps) {
  const isSm = size === "sm";
  const px = isSm ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm";
  const iconCls = isSm ? "h-3.5 w-3.5" : "h-4 w-4";
  const extCls = `opacity-0 transition-opacity group-hover:opacity-60 ${isSm ? "h-2.5 w-2.5" : "h-3 w-3"}`;

  const hasAmazon = isValidUrl(amazonUrl);
  const hasFlipkart = isValidUrl(flipkartUrl);
  const hasMyntra = isValidUrl(myntraUrl);
  const hasWhatsApp = whatsappOrder && !!productName;

  const count = [hasAmazon, hasFlipkart, hasMyntra, hasWhatsApp].filter(Boolean).length;
  if (count === 0) return null;

  const gridColsClass = count === 1 ? "grid-cols-1" : "grid-cols-2";

  return (
    <div className={`grid w-full gap-2 ${gridColsClass}`}>
      {/* Amazon */}
      {hasAmazon && (
        <a
          href={amazonUrl!}
          target="_blank"
          rel="noreferrer"
          className={`group flex items-center justify-center gap-2 rounded-xl border border-[#FF9900]/30 bg-[#FF9900]/8 font-semibold text-[#B8700A] transition-all duration-200 hover:border-[#FF9900]/60 hover:bg-[#FF9900]/15 hover:-translate-y-0.5 hover:shadow-sm ${px}`}
        >
          <AmazonIcon className={iconCls} />
          Amazon
          <ExternalLink className={extCls} />
        </a>
      )}

      {/* Flipkart */}
      {hasFlipkart && (
        <a
          href={flipkartUrl!}
          target="_blank"
          rel="noreferrer"
          className={`group flex items-center justify-center gap-2 rounded-xl border border-[#2874F0]/30 bg-[#2874F0]/8 font-semibold text-[#1a5cbf] transition-all duration-200 hover:border-[#2874F0]/60 hover:bg-[#2874F0]/15 hover:-translate-y-0.5 hover:shadow-sm ${px}`}
        >
          <FlipkartIcon className={iconCls} />
          Flipkart
          <ExternalLink className={extCls} />
        </a>
      )}

      {/* Myntra */}
      {hasMyntra && (
        <a
          href={myntraUrl!}
          target="_blank"
          rel="noreferrer"
          className={`group flex items-center justify-center gap-2 rounded-xl border border-[#FF3F6C]/30 bg-[#FF3F6C]/8 font-semibold text-[#cc2455] transition-all duration-200 hover:border-[#FF3F6C]/60 hover:bg-[#FF3F6C]/15 hover:-translate-y-0.5 hover:shadow-sm ${px}`}
        >
          <MyntraIcon className={iconCls} />
          Myntra
          <ExternalLink className={extCls} />
        </a>
      )}

      {/* WhatsApp Order */}
      {hasWhatsApp && (
        <a
          href={buildWhatsAppUrl(productName, productCode)}
          target="_blank"
          rel="noreferrer"
          className={`group flex items-center justify-center gap-2 rounded-xl border border-emerald-300/50 bg-emerald-50 font-semibold text-emerald-800 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-100 hover:-translate-y-0.5 hover:shadow-sm ${px}`}
        >
          <WhatsAppIcon className={iconCls} />
          WhatsApp
          <MessageCircle className={`${extCls} opacity-0`} />
        </a>
      )}
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
