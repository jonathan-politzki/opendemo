import Link from "next/link";
import { Star, Wordmark } from "./brand";

const NAV = [
  { href: "/#compare", label: "By hand vs. automatic" },
  { href: "/#report", label: "The map report" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Wordmark />
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="mono text-[0.72rem] uppercase tracking-[0.14em] text-slate transition-colors hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 bg-ink px-4 py-2 text-[0.78rem] font-medium text-paper transition-colors hover:bg-graphite"
        >
          Book a teardown
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-star">
              <Star size={18} />
            </span>
            <span className="font-display text-xl">CALUMET</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mute">
            AI built for real-estate developers — the reports, the sourcing, the
            due diligence — done in minutes. Built in Chicago.
          </p>
        </div>
        <div>
          <p className="eyebrow text-mute">What we build</p>
          <ul className="mt-4 space-y-2 text-sm text-paper/80">
            <li><Link className="hover:text-chicago" href="/#report">Market reports — shaded maps & memos</Link></li>
            <li><Link className="hover:text-chicago" href="/#compare">Deal sourcing — screen to your buy box</Link></li>
            <li><Link className="hover:text-chicago" href="/#contact">Due diligence — read the OM & leases</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-mute">Talk to us</p>
          <ul className="mt-4 space-y-2 text-sm text-paper/80">
            <li>312 · by appointment</li>
            <li>hello@calumet.work</li>
            <li className="text-mute">The Loop, Chicago IL</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-5 text-[0.72rem] text-mute sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="mono">© 2026 Calumet Operations LLC</span>
          <span className="mono">Demo environment · figures are illustrative</span>
        </div>
      </div>
    </footer>
  );
}
