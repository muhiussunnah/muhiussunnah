/**
 * <PrintWatermark>
 * ----------------
 * Faded institution-logo watermark that sits behind every downloadable
 * form, receipt, marksheet, admit card, certificate, etc. Renders as a
 * fixed-position centered image at ~22% opacity so the page text stays
 * readable but the logo is clearly visible — exactly the "জলছাপ" feel
 * users expect on official school papers.
 *
 * Print-safe: relies on `-webkit-print-color-adjust: exact` (handled in
 * the parent print container's CSS) so the watermark survives browser
 * "remove backgrounds" defaults.
 *
 * No-op when the school has not uploaded a logo yet — the page just
 * prints clean without a placeholder ghost.
 */
type Props = {
  /** Direct URL to the school's uploaded logo (Supabase Storage etc.). */
  logoUrl?: string | null;
  /** Watermark opacity (0–1). Default 0.22 — visible but doesn't fight text. */
  opacity?: number;
  /** Square side length in CSS units. Default 60% of the smaller page side. */
  size?: string;
};

export function PrintWatermark({ logoUrl, opacity = 0.22, size = "min(60vh, 60vw)" }: Props) {
  if (!logoUrl) return null;
  return (
    <div
      aria-hidden
      className="print-watermark pointer-events-none fixed inset-0 z-0 flex items-center justify-center print:flex"
      style={{
        // Center the wrapper covers the whole printable area.
        // Each individual sheet gets the same centered logo.
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt=""
        style={{
          width: size,
          height: size,
          maxWidth: "60%",
          maxHeight: "60%",
          objectFit: "contain",
          opacity,
          // Force the print engine to keep the image's tonality
          // (browsers strip background colors and faded images by
          // default). These two properties tell Chrome / Edge / Safari
          // to render exact colors when printing.
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          filter: "saturate(0.9)",
        }}
      />
    </div>
  );
}
