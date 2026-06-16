import Link from "next/link";

/** Chicago six-pointed star — the recurring status / step marker. */
export function Star({
  size = 16,
  className = "",
  filled = true,
}: {
  size?: number;
  className?: string;
  filled?: boolean;
}) {
  const R = 50;
  const r = 50 / Math.sqrt(3); // regular {6/2} hexagram inner radius
  const pts: string[] = [];
  for (let i = 0; i < 12; i++) {
    const radius = i % 2 === 0 ? R : r;
    const a = (-90 + i * 30) * (Math.PI / 180);
    pts.push(`${(50 + radius * Math.cos(a)).toFixed(2)},${(50 + radius * Math.sin(a)).toFixed(2)}`);
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={className}
    >
      <polygon
        points={pts.join(" ")}
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 7}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="text-star transition-transform duration-300 group-hover:rotate-[18deg]">
        <Star size={18} />
      </span>
      <span className="font-display text-[1.35rem] tracking-tight text-ink">
        CALUMET
      </span>
    </Link>
  );
}
