import Link from "next/link";
import { Star } from "./brand";

export const DEMOS = [
  { href: "/deal-finder", name: "Deal Finder", tag: "Deal sourcing" },
  { href: "/diligence", name: "Diligence Reader", tag: "Due diligence" },
  { href: "/market-map", name: "Market Map", tag: "Report generation" },
];

export function DemoHeader({
  current,
  tag,
  title,
  blurb,
}: {
  current: string;
  tag: string;
  title: string;
  blurb: string;
}) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1240px] px-5 pt-10 sm:px-8">
        <Link
          href="/"
          className="mono text-[0.72rem] uppercase tracking-[0.14em] text-slate hover:text-ink"
        >
          ← All three
        </Link>
        <div className="mt-5 flex items-center gap-2 text-chicago-deep">
          <Star size={13} className="text-star" />
          <span className="mono text-[0.7rem] uppercase tracking-[0.16em]">{tag}</span>
        </div>
        <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] text-ink">{title}</h1>
        <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-slate">{blurb}</p>
        <nav className="mt-7 flex gap-px overflow-hidden rounded-sm border border-line bg-line text-center">
          {DEMOS.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className={`flex-1 px-3 py-2.5 text-[0.78rem] font-medium transition-colors ${
                d.name === current
                  ? "bg-ink text-paper"
                  : "bg-card text-slate hover:bg-paper hover:text-ink"
              }`}
            >
              {d.name}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
