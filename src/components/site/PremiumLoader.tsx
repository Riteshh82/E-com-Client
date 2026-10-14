import { useEffect, useState } from "react";

interface PremiumLoaderProps {
  isLoading: boolean;
  onExited?: () => void;
}

export function PremiumLoader({ isLoading, onExited }: PremiumLoaderProps) {
  // Should the loader DOM element stay mounted during exit animation?
  const [shouldRender, setShouldRender] = useState(isLoading);
  // Is the loader currently in the fading-out state?
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
      setIsFadingOut(false);
    } else if (shouldRender) {
      // Begin smooth fade-out only if it was rendered
      setIsFadingOut(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsFadingOut(false);
        onExited?.();
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [isLoading, onExited, shouldRender]);

  if (!shouldRender) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream-50 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] select-none pointer-events-auto ${
        isFadingOut ? "opacity-0 scale-[1.02] pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Subtle radial metallic warmth background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(217, 162, 104, 0.14) 0%, rgba(231, 194, 150, 0.05) 45%, transparent 70%)",
        }}
      />

      {/* Centerpiece: Precision Stainless-Steel Orbiting Rings */}
      <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44">
        {/* Outer subtle static ring track */}
        <div className="absolute inset-0 rounded-full border border-stone-300/40" />

        {/* Ring 1: Outer precision steel orbit */}
        <div
          className="absolute inset-0 rounded-full border-[1.5px] border-transparent border-t-copper-500/80 border-r-stone-400/50 steel-loader-spin-clockwise"
          style={{ willChange: "transform" }}
        />

        {/* Ring 2: Intermediate counter-rotating brushed steel ring */}
        <div
          className="absolute inset-3.5 sm:inset-4 rounded-full border-[1.5px] border-transparent border-b-copper-400/90 border-l-stone-400/60 steel-loader-spin-counter"
          style={{ willChange: "transform" }}
        />

        {/* Ring 3: Inner fast-orbiting metallic accent */}
        <div
          className="absolute inset-7 sm:inset-8 rounded-full border border-transparent border-t-copper-600/75 border-b-copper-300/60 steel-loader-spin-fast"
          style={{ willChange: "transform" }}
        />

        {/* Core: Precision metallic geometric nucleus with subtle breathing pulse */}
        <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11">
          {/* Subtle halo blur */}
          <div className="absolute inset-0 rounded-full bg-copper-400/20 blur-sm steel-loader-pulse" />

          {/* Central polished steel gem / rhombus */}
          <div
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-[4px] rotate-45 border border-copper-400/60 bg-gradient-to-tr from-stone-200 via-white to-copper-100 shadow-[0_2px_10px_rgba(184,112,62,0.22)] steel-loader-core-rotate"
            style={{ willChange: "transform" }}
          />

          {/* Pin-point focal node */}
          <div className="absolute w-1.5 h-1.5 rounded-full bg-copper-500/90 shadow-sm" />
        </div>
      </div>

      {/* Refined Minimalist Metallic Track Progress Indicator (No numbers/text) */}
      <div className="relative mt-10 w-36 sm:w-44 h-[2px] rounded-full overflow-hidden bg-stone-300/35">
        <div
          className="absolute top-0 bottom-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-copper-500 to-transparent steel-loader-shimmer-bar"
          style={{ willChange: "transform" }}
        />
      </div>
    </aside>
  );
}
