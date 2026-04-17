/**
 * Inline payment method badges — brand-color filled with proper SVG logos
 * where possible (Apple/Google/Mastercard get real glyphs so the badge reads
 * instantly). BD methods use their wordmark + brand bg.
 */

function ApplePayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 24" className={className} fill="currentColor" aria-hidden>
      {/* Apple (scaled) */}
      <path d="M13.27 3.36c-.82 1-2.13 1.78-3.44 1.67-.18-1.3.48-2.67 1.22-3.52C11.89.51 13.3-.21 14.44-.25c.15 1.35-.38 2.67-1.17 3.61zm1.16 1.93c-1.9-.11-3.52 1.08-4.42 1.08-.92 0-2.3-1.03-3.8-1-1.95.03-3.76 1.14-4.76 2.88-2.04 3.52-.53 8.73 1.45 11.6.97 1.41 2.13 2.97 3.64 2.92 1.44-.06 2-.93 3.74-.93 1.74 0 2.24.93 3.76.9 1.56-.03 2.54-1.42 3.48-2.84 1.09-1.62 1.54-3.2 1.57-3.28-.04-.02-3.02-1.16-3.05-4.62-.03-2.9 2.37-4.28 2.47-4.34-1.36-1.99-3.47-2.22-4.21-2.27zM26 1h3.2c2.47 0 4.18 1.7 4.18 4.18 0 2.5-1.75 4.2-4.26 4.2h-2.8V14H26zm1.32 7.1h2.3c1.72 0 2.7-.93 2.7-2.56 0-1.63-.98-2.56-2.7-2.56h-2.3zm9.94 3.08c0-1.57 1.2-2.52 3.32-2.64l2.43-.14v-.69c0-.99-.67-1.58-1.8-1.58-1.06 0-1.73.5-1.9 1.3h-1.55c.1-1.61 1.5-2.8 3.5-2.8 1.97 0 3.24 1.04 3.24 2.68V14h-1.45v-1.39h-.04c-.5.93-1.56 1.52-2.66 1.52-1.65 0-2.8-1-2.8-2.47zm5.75-.8v-.7l-2.18.13c-1.09.08-1.7.56-1.7 1.3 0 .77.63 1.27 1.6 1.27 1.26 0 2.28-.87 2.28-2zM46.4 16.67v-1.21c.11.02.37.03.5.03.69 0 1.07-.29 1.3-1.04 0-.01.13-.45.13-.45L45.75 6.3h1.65l1.85 5.93h.03l1.84-5.93h1.6l-2.68 7.52c-.62 1.73-1.33 2.29-2.83 2.29-.12 0-.5-.01-.61-.04z" />
    </svg>
  );
}

function VisaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 16" className={className} aria-hidden>
      <path fill="#F7B600" d="M20.5 15.4h-3.9l2.5-15.1h3.9z" />
      <path fill="#fff" d="M34.2.5c-.8-.3-2-.6-3.5-.6-3.9 0-6.6 2-6.6 5 0 2.2 2 3.4 3.5 4.1 1.5.8 2 1.3 2 2 0 1-1.3 1.5-2.5 1.5-1.7 0-2.5-.2-3.9-.8l-.5-.3-.6 3.5c1 .5 2.8.8 4.7.9 4.1 0 6.8-2 6.8-5.2 0-1.7-1-3-3.3-4.1-1.4-.7-2.2-1.2-2.2-1.9 0-.6.7-1.3 2.2-1.3 1.3 0 2.2.3 3 .6l.4.2zM40.6.3h-3c-.9 0-1.7.3-2 1.2l-5.8 13.9h4.1l.8-2.3h5l.5 2.3h3.6zm-4.8 9.6l2.1-5.7 1.2 5.7zM17.3.3L13.4 10.5l-.4-2.1C12.1 5.9 9.5 3.2 6.6 1.8l3.6 13.6h4.1L20.5.3z" />
      <path fill="#F7B600" d="M8.9.3H2.6L2.5.6c5 1.3 8.2 4.3 9.6 8l-1.4-7c-.2-1-.9-1.3-1.8-1.3z" />
    </svg>
  );
}

function MastercardLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden>
      <circle cx="18" cy="16" r="12" fill="#EB001B" />
      <circle cx="30" cy="16" r="12" fill="#F79E1B" />
      <path fill="#FF5F00" d="M24 6a11.97 11.97 0 010 20 11.97 11.97 0 010-20z" />
    </svg>
  );
}

function GPayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 20" className={className} aria-hidden>
      <path fill="#4285F4" d="M22.5 9.7v5.8h-1.9V1.1h4.9c1.2 0 2.3.4 3.2 1.3.9.8 1.3 1.8 1.3 3s-.4 2.2-1.3 3c-.9.9-2 1.3-3.2 1.3zm0-6.8v5h3c.7 0 1.3-.2 1.8-.7.5-.5.8-1.1.8-1.8 0-.7-.3-1.3-.8-1.8-.5-.5-1.1-.7-1.8-.7z" />
      <path fill="#EA4335" d="M35.6 5.2c1.4 0 2.5.4 3.3 1.1.8.8 1.2 1.8 1.2 3.1v6.2h-1.8v-1.4h-.1c-.8 1.2-1.8 1.7-3.1 1.7-1.1 0-2-.3-2.7-1-.7-.6-1.1-1.4-1.1-2.4 0-1 .4-1.8 1.2-2.5.8-.6 1.8-.9 3.2-.9 1.1 0 2.1.2 2.8.6v-.4c0-.7-.3-1.2-.8-1.7-.5-.4-1.2-.6-1.9-.6-1.1 0-2 .5-2.7 1.4l-1.6-1c1-1.4 2.4-2.2 4.1-2.2z" />
      <path fill="#FBBC04" d="M48 5.5l-6.3 14.4h-2l2.3-5.1-4.1-9.3h2.1l3 7.2h.1l2.9-7.2z" />
      <path fill="#34A853" d="M15.8 9c0-.7-.1-1.3-.2-1.9H8v3.5h4.4c-.2 1-.7 1.9-1.6 2.5v2h2.6c1.5-1.4 2.4-3.4 2.4-6z" />
      <path fill="#4285F4" d="M8 16.9c2.2 0 4-.7 5.4-2l-2.6-2c-.7.5-1.6.8-2.8.8-2.1 0-4-1.4-4.7-3.4H.8v2C2.2 15 5 16.9 8 16.9z" />
      <path fill="#FBBC04" d="M3.3 10.4c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V4.6H.8C.1 5.8 0 7.3 0 8.5s.1 2.7.8 3.9z" />
      <path fill="#EA4335" d="M8 3.2c1.2 0 2.3.4 3.1 1.3l2.3-2.3C12 .8 10.2 0 8 0 5 0 2.2 1.9.8 4.6l2.5 2c.7-2 2.6-3.4 4.7-3.4z" />
    </svg>
  );
}

const methods = [
  { name: "bKash",      label: "bKash",   bg: "bg-[#E2136E]", text: "text-white" },
  { name: "Nagad",      label: "Nagad",   bg: "bg-[#EC1C24]", text: "text-white" },
  { name: "Rocket",     label: "Rocket",  bg: "bg-[#8A1D88]", text: "text-white" },
  { name: "Upay",       label: "Upay",    bg: "bg-[#00A651]", text: "text-white" },
  { name: "SSLCOMMERZ", label: "SSL",     bg: "bg-[#1D63ED]", text: "text-white" },
  { name: "VISA",       logo: VisaLogo,   bg: "bg-[#1A1F71]", text: "text-white" },
  { name: "Mastercard", logo: MastercardLogo, bg: "bg-white dark:bg-neutral-100", text: "" },
  { name: "AMEX",       label: "AMEX",    bg: "bg-[#006FCF]", text: "text-white" },
  { name: "PayPal",     label: "PayPal",  bg: "bg-[#003087]", text: "text-[#009CDE]" },
  { name: "Google Pay", logo: GPayLogo,   bg: "bg-white dark:bg-neutral-100", text: "" },
  { name: "Apple Pay",  logo: ApplePayLogo, bg: "bg-black",   text: "text-white" },
  { name: "Stripe",     label: "Stripe",  bg: "bg-[#635BFF]", text: "text-white" },
] as const;

export function PaymentIcons() {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
      {methods.map((m) => {
        const LogoComp = "logo" in m ? m.logo : null;
        return (
          <div
            key={m.name}
            title={m.name}
            className={`${m.bg} ${m.text} rounded-lg px-2.5 h-9 flex items-center justify-center text-center text-[10px] font-bold border border-border/40 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
          >
            {LogoComp ? <LogoComp className="h-4 w-auto" /> : (m as { label: string }).label}
          </div>
        );
      })}
    </div>
  );
}
