import { BanglaDigit } from "@/components/ui/bangla-digit";

type ClassSlice = {
  id: string;
  name: string;
  count: number;
};

/**
 * Class-wise student distribution donut. Pure SSR'd SVG — no charting
 * library, zero JS cost. Each class gets a distinct hue from a rotating
 * palette, `<title>` children provide accessible native tooltips, and a
 * subtle legend below names each slice with its count + percentage.
 */
export function ClassDonut({
  classes,
  totalLabel = "মোট ছাত্র-ছাত্রী",
}: {
  classes: ClassSlice[];
  totalLabel?: string;
}) {
  const total = classes.reduce((s, c) => s + c.count, 0);

  if (total === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/50 p-6 text-center">
        <div className="size-14 rounded-full border-4 border-dashed border-primary/30" />
        <p className="mt-3 text-sm font-semibold text-foreground">এখনও কোন শিক্ষার্থী নেই</p>
        <p className="mt-1 text-xs text-muted-foreground">
          শিক্ষার্থী যোগ করলে এখানে ক্লাস অনুযায়ী বিতরণ দেখাবে।
        </p>
      </div>
    );
  }

  // Sort largest first so the legend reads top-down by class size.
  const sorted = [...classes].sort((a, b) => b.count - a.count);

  // SVG donut geometry
  const size = 220;
  const strokeWidth = 36;
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = sorted.map((c, i) => {
    const frac = c.count / total;
    const length = frac * circumference;
    const seg = {
      ...c,
      color: sliceColor(i),
      pct: frac * 100,
      length,
      offset,
      rotation: (offset / circumference) * 360,
    };
    offset += length;
    return seg;
  });

  return (
    <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card to-primary/5 p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          ক্লাস অনুযায়ী শিক্ষার্থী বিতরণ
        </h3>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          <BanglaDigit value={classes.length} /> ক্লাস
        </span>
      </div>

      <div className="flex flex-col items-center gap-5 md:flex-row md:items-center md:gap-8">
        {/* SVG Donut */}
        <div className="relative shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            {/* Background ring */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted/40"
            />
            {/* Slices */}
            {segments.map((s) => (
              <circle
                key={s.id}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${s.length} ${circumference}`}
                strokeDashoffset={-s.offset}
                className="transition-all duration-300 hover:brightness-110 hover:drop-shadow-[0_0_8px_currentColor]"
              >
                <title>
                  {s.name}: {s.count} জন ({s.pct.toFixed(1)}%)
                </title>
              </circle>
            ))}
          </svg>

          {/* Centre label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-extrabold tabular-nums bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
              <BanglaDigit value={total} />
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {totalLabel}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2 max-h-56 overflow-y-auto pr-1">
          {segments.map((s) => (
            <div
              key={s.id}
              className="group/seg flex items-center justify-between gap-3 rounded-lg border border-transparent px-2 py-1.5 text-sm transition hover:border-border/60 hover:bg-muted/40"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span
                  className="inline-block size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: s.color }}
                  aria-hidden
                />
                <span className="truncate font-medium">{s.name}</span>
              </div>
              <div className="flex shrink-0 items-baseline gap-2 tabular-nums">
                <span className="font-semibold text-foreground">
                  <BanglaDigit value={s.count} />
                </span>
                <span className="text-xs text-muted-foreground">
                  ({s.pct.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 12-colour palette tuned to feel cohesive with the app's primary/accent
 * brand. Cycles when there are more classes than colours.
 */
function sliceColor(i: number): string {
  const palette = [
    "#7c5cff", // primary
    "#22d3ee", // accent
    "#22c55e", // green
    "#f59e0b", // amber
    "#ec4899", // pink
    "#8b5cf6", // purple
    "#14b8a6", // teal
    "#f97316", // orange
    "#3b82f6", // blue
    "#a855f7", // violet
    "#06b6d4", // cyan
    "#eab308", // yellow
  ];
  return palette[i % palette.length];
}
