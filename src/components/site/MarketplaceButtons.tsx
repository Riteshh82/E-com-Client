import { ExternalLink } from "lucide-react";

const WHATSAPP_LINK = "https://wa.me/919876543210";

// Amazon icon
function AmazonIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.699-3.182v.685zm3.186 7.705c-.209.189-.512.201-.748.074-1.052-.875-1.238-1.28-1.814-2.114-1.734 1.768-2.962 2.297-5.209 2.297-2.66 0-4.731-1.641-4.731-4.925 0-2.565 1.391-4.309 3.37-5.164 1.715-.754 4.11-.891 5.942-1.095V6.4c0-.79.06-1.723-.4-2.406-.401-.604-1.166-.853-1.845-.853-1.254 0-2.371.641-2.646 1.972-.056.296-.274.587-.574.601l-3.213-.347c-.271-.061-.572-.28-.495-.696C5.678 1.082 8.39 0 11.29 0c1.485 0 3.424.394 4.597 1.518C17.179 2.796 17 4.523 17 6.4v5.82c0 1.748.726 2.518 1.409 3.463.24.337.293.739-.014 1.002l-1.251 1.11zm3.355 2.817c-.217.161-.404.072-.27-.162C20.897 18.69 21 17.438 21 16.2v-.547c0-.42-.03-.72-.09-1.006 0-.001-.001-.002-.001-.003-.208-.946-.814-1.656-1.656-1.656-1.152 0-1.795.881-1.795 2.009 0 1.062.576 2.002 1.51 2.49.154.08.305.128.449.155a6.35 6.35 0 0 1-.153.334l-.026.052c-.042.083-.085.167-.127.249-.178.343-.357.695-.357 1.08 0 .398.187.668.456.668.245 0 .475-.127.65-.349l.023-.03c.027-.036.053-.072.08-.108zM23.5 17.1c-.029-1.562-.205-2.878-.914-3.956-.756-1.148-1.978-1.847-3.367-1.847-1.382 0-2.6.699-3.357 1.847-.705 1.078-.88 2.394-.909 3.956-.02 1.065.089 2.049.403 2.762.535 1.212 1.698 1.938 2.938 1.938 1.243 0 2.405-.726 2.939-1.938.313-.713.422-1.697.403-2.762H23.5z" />
    </svg>
  );
}

// Flipkart icon
function FlipkartIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M21.5 0h-19C1.12 0 0 1.12 0 2.5v19C0 22.88 1.12 24 2.5 24h19c1.38 0 2.5-1.12 2.5-2.5v-19C24 1.12 22.88 0 21.5 0zM10.67 17.98L5.5 12l5.17-5.98 1.56 1.35-3.87 4.63 3.87 4.63-1.56 1.35zm4.22 0l-1.56-1.35L17.2 12l-3.87-4.63 1.56-1.35L20.06 12l-5.17 5.98z" />
    </svg>
  );
}

// WhatsApp icon
function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

interface MarketplaceButtonsProps {
  amazonUrl: string;
  flipkartUrl: string;
  size?: "sm" | "md";
}

export function MarketplaceButtons({
  amazonUrl,
  flipkartUrl,
  size = "md",
}: MarketplaceButtonsProps) {
  const isSm = size === "sm";
  return (
    <div className={`flex gap-2 ${isSm ? "flex-col sm:flex-row" : "flex-row"}`}>
      <a
        href={amazonUrl}
        target="_blank"
        rel="noreferrer"
        className={`group flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#FF9900]/30 bg-[#FF9900]/8 font-semibold text-[#B8700A] transition-all duration-200 hover:border-[#FF9900]/60 hover:bg-[#FF9900]/15 hover:-translate-y-0.5 hover:shadow-sm ${
          isSm ? "px-3 py-2 text-xs" : "px-5 py-2.5 text-sm"
        }`}
      >
        <AmazonIcon className={isSm ? "h-3.5 w-3.5" : "h-4 w-4"} />
        Amazon
        <ExternalLink className={`opacity-0 transition-opacity group-hover:opacity-60 ${isSm ? "h-2.5 w-2.5" : "h-3 w-3"}`} />
      </a>
      <a
        href={flipkartUrl}
        target="_blank"
        rel="noreferrer"
        className={`group flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#2874F0]/30 bg-[#2874F0]/8 font-semibold text-[#1a5cbf] transition-all duration-200 hover:border-[#2874F0]/60 hover:bg-[#2874F0]/15 hover:-translate-y-0.5 hover:shadow-sm ${
          isSm ? "px-3 py-2 text-xs" : "px-5 py-2.5 text-sm"
        }`}
      >
        <FlipkartIcon className={isSm ? "h-3.5 w-3.5" : "h-4 w-4"} />
        Flipkart
        <ExternalLink className={`opacity-0 transition-opacity group-hover:opacity-60 ${isSm ? "h-2.5 w-2.5" : "h-3 w-3"}`} />
      </a>
    </div>
  );
}

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm font-semibold text-emerald-800 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-100 hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white transition-transform group-hover:scale-110">
        <WhatsAppIcon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-xs font-medium text-emerald-600">Chat instantly on</span>
        <span className="text-base font-bold text-emerald-900">WhatsApp</span>
      </span>
    </a>
  );
}
