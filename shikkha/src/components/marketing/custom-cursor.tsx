"use client";

import { useEffect, useRef } from "react";

/**
 * Premium custom cursor — follow-dot with an elastic outer ring that
 * expands on interactive elements. Hidden on touch devices.
 *
 * Technique:
 *   - Inner dot follows mouse directly (GPU transform, no React re-render).
 *   - Outer ring lerps toward dot at 0.15 per frame for trailing feel.
 *   - On hover over [data-cursor="lg"] / a / button, ring scales 2.5x + mixes.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId = 0;
    let ringScale = 1;
    let targetScale = 1;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ringScale += (targetScale - ringScale) * 0.2;
      ring.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0) scale(${ringScale})`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const interactive = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor="lg"]');
      if (interactive) {
        targetScale = 2.2;
        ring.classList.add("cursor-active");
      } else {
        targetScale = 1;
        ring.classList.remove("cursor-active");
      }
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed start-0 top-0 z-[9999] size-2 rounded-full bg-white mix-blend-difference transition-opacity duration-300"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed start-0 top-0 z-[9999] size-9 rounded-full border border-primary/60 mix-blend-difference transition-[opacity,border-color,background-color] duration-300"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
