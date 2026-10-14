import { useEffect, useRef } from "react";

/**
 * Attaches IntersectionObserver to `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale`, `.reveal-fade` elements.
 * Uses a MutationObserver to automatically discover and animate elements added dynamically (e.g. after API fetches).
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const observedSet = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target); // animate once for a clean finish
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const observeTargets = () => {
      if (!root) return;
      const targets = root.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade"
      );
      targets.forEach((target) => {
        if (!observedSet.has(target) && !target.classList.contains("in-view")) {
          observedSet.add(target);
          observer.observe(target);
        }
      });
    };

    // Initial observation pass
    observeTargets();

    // Re-observe whenever elements mount dynamically (such as asynchronous API data)
    const mutationObserver = new MutationObserver(() => {
      observeTargets();
    });

    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return containerRef;
}
