import Link from "next/link";
import { Star } from "./brand";

const ALL = [
  { href: "/demos/prospector", name: "Prospector" },
  { href: "/demos/lease-desk", name: "Lease Desk" },
  { href: "/demos/back-office", name: "Back Office" },
];

export function DemoIntro({
  tag,
  name,
  blurb,
  proves,
  current,
}: {
  tag: string;
  name: string;
  blurb: string;
  proves: string[];
  current: string;
}) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-6xl px-5 pt-10 pb-12 sm:px-8">
        <Link
          href="/#work"
          className="mono text-[0.72rem] uppercase tracking-[0.14em] text-slate hover:text-ink"
        >
          ← All demos
        </Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-chicago-deep">
              <Star size={13} className="text-star" />
              <span className="mono text-[0.7rem] uppercase tracking-[0.16em]">
                {tag}
              </span>
            </div>
            <h1 className="mt-4 font-display text-[clamp(2.4rem,5vw,3.8rem)] text-ink">
              {name}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate">
              {blurb}
            </p>
          </div>
          <div className="border-l-2 border-chicago bg-card p-5">
            <p className="eyebrow">What this proves</p>
            <ul className="mt-3 space-y-2">
              {proves.map((p) => (
                <li key={p} className="flex gap-2 text-[0.86rem] text-ink">
                  <span className="text-good">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <nav className="mt-10 flex gap-px overflow-hidden rounded-sm border border-line bg-line text-center">
          {ALL.map((d) => (
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
