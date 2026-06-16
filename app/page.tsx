import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/chrome";
import { Star } from "@/components/brand";

const DEMOS = [
  {
    href: "/deal-finder",
    tag: "Deal sourcing",
    name: "Deal Finder",
    line: "Describe the deal. It finds the deals.",
    body: "Set a buy box — distressed office near industrial, the right size and zoning — and the market filters down to what fits, ranked and mapped.",
    cta: "Screen the market",
  },
  {
    href: "/diligence",
    tag: "Due diligence",
    name: "Diligence Reader",
    line: "The offering memo, read in one pass.",
    body: "An OM and rent roll go in; the deal facts, the lease abstraction, the mark-to-market math, and the red flags come out — in seconds, not two days.",
    cta: "Read a memo",
  },
  {
    href: "/market-map",
    tag: "Report generation",
    name: "Market Map",
    line: "Where to build, scored live.",
    body: "Score every county on your thesis and shade the map in real time. Built on real Census demographics, ready for your CoStar feed.",
    cta: "Drive the model",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      {/* HERO */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20">
          <div className="flex items-center gap-2">
            <span className="text-star"><Star size={12} /></span>
            <span className="eyebrow">Calumet · AI for Chicago real estate</span>
          </div>
          <div className="mt-6 grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-end">
            <h1 className="max-w-2xl font-display text-[clamp(1.9rem,3.8vw,3rem)] leading-[1.05] text-ink">
              The three things a real-estate shop does by hand — sourcing,
              diligence, and reporting — done in seconds.
            </h1>
            <p className="text-[0.95rem] leading-relaxed text-slate md:pb-1.5">
              Three working demos, built on the Chicago industrial market. Pick
              one, drive it yourself, and see exactly how the analyst&apos;s
              week becomes a few keystrokes.
            </p>
          </div>
        </div>
      </section>

      {/* THE THREE */}
      <section id="demos" className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
          <div className="grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-3">
            {DEMOS.map((d, i) => (
              <Link
                key={d.href}
                href={d.href}
                className="group flex flex-col bg-card p-7 transition-colors hover:bg-paper"
              >
                <div className="flex items-center justify-between">
                  <span className="mono text-[0.66rem] uppercase tracking-[0.16em] text-chicago-deep">
                    {d.tag}
                  </span>
                  <span className="mono text-[0.66rem] text-mute">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h2 className="mt-5 font-display text-2xl text-ink">{d.name}</h2>
                <p className="mt-1 text-[0.92rem] font-medium text-slate">{d.line}</p>
                <p className="mt-4 flex-1 text-[0.9rem] leading-relaxed text-slate">
                  {d.body}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-chicago transition-transform group-hover:translate-x-1">
                  {d.cta} →
                </span>
              </Link>
            ))}
          </div>

          {/* honesty note */}
          <div className="mt-6 flex flex-col gap-2 rounded-sm border border-line bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.86rem] leading-relaxed text-slate">
              <span className="font-medium text-ink">On the data:</span> the
              county geography and population are real (US Census). Rents,
              vacancy, listings, and the sample deal are stand-ins for the
              CoStar, assessor, and proprietary feeds we connect on a real
              engagement — labeled throughout.
            </p>
            <span className="mono shrink-0 rounded-sm bg-good/12 px-2 py-1 text-[0.64rem] uppercase tracking-[0.1em] text-good">
              real + sample, marked
            </span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">The pattern behind all three</p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,3.6vw,2.6rem)] text-ink">
              Find the task. Map the data. Automate the judgment.
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-slate">
              Every one of these is a job your team does on a computer, over and
              over. We pin down the inputs, the steps, and the edge cases — then
              build software that runs it. Build it for one firm, prove it,
              deploy the playbook across a portfolio.
            </p>
            <Link
              href="#contact"
              className="mt-6 inline-flex items-center gap-2 bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-graphite"
            >
              Bring us a task →
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative overflow-hidden">
        <div className="hatch pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 md:py-28">
          <span className="text-star"><Star size={22} className="mx-auto" /></span>
          <h2 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,4.4vw,3rem)] text-ink">
            Tell us the work you rebuild by hand.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate">
            Sourcing, diligence, the quarterly report — whatever your team
            redoes every cycle. We&apos;ll come back with a working version,
            built on your data.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:hello@calumet.work?subject=Teardown%20request"
              className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-graphite"
            >
              hello@calumet.work
            </a>
            <Link
              href="/deal-finder"
              className="inline-flex items-center gap-2 border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Or open a demo →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
