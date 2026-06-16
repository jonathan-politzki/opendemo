import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/chrome";
import { Star } from "@/components/brand";
import { BeforeAfter } from "@/components/before-after";
import { ChicagoReport } from "@/components/chicago-report";

const USES = [
  {
    k: "Deal sourcing",
    d: "Hand it your buy box — office near industrial, distressed, redevelopable — and it screens the whole market for sites that fit.",
  },
  {
    k: "Due diligence",
    d: "Drop in an offering memo, rent roll, and leases. It reads them and hands back the summary, the numbers, and the red flags.",
  },
  {
    k: "Partner reporting",
    d: "The recurring updates your capital partners expect — the map, the thesis, the comps — refreshed on demand instead of over weeks.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="grid-paper pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 md:py-28">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 border border-line bg-card px-3 py-1.5">
            <span className="text-star">
              <Star size={12} />
            </span>
            <span className="eyebrow">For industrial real-estate developers</span>
          </div>
          <h1 className="font-display text-[clamp(2.6rem,6.5vw,4.6rem)] text-ink">
            Know where to build next.
            <br />
            Before the meeting, not after.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate">
            The research your team does by hand — the demographics, the vacancy,
            the maps, the memo your capital partners ask for — turned into a
            report that builds itself in minutes. Here&apos;s the exact one,
            start to finish.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#compare"
              className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-graphite"
            >
              See it built — by hand vs. automatic <span aria-hidden>↓</span>
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 border border-ink px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Book a teardown
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- BEFORE / AFTER ---------------- */}
      <section id="compare" className="border-b border-line">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">One example, two ways</p>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.8rem)] text-ink">
              Your capital partner asks for a report.
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-slate">
              Same request, same result. One way takes an analyst three weeks.
              The other finishes before your coffee&apos;s cold. Press play.
            </p>
          </div>
          <div className="mt-12">
            <BeforeAfter />
          </div>
        </div>
      </section>

      {/* ---------------- THE REPORT ---------------- */}
      <section id="report" className="border-b border-line bg-card">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">The report it produced</p>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.8rem)] text-ink">
              Where to deploy in Chicago — shaded on a map.
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-slate">
              Green is build here, red is stay away. Flip the metric — vacancy,
              rent growth, population — and the map, the ranking, and the memo
              update with it. This is the thing your partners actually flip
              through.
            </p>
          </div>
          <div className="mt-12">
            <ChicagoReport />
          </div>
        </div>
      </section>

      {/* ---------------- WHAT THIS MEANS ---------------- */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">It&apos;s not just this one report</p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,3.6vw,2.6rem)] text-ink">
              The same engine, pointed at the work your firm repeats.
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-slate">
              Build it for one firm, prove it, then deploy the playbook across a
              portfolio. The map is the demo — here&apos;s the rest.
            </p>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-3">
            {USES.map((u) => (
              <div key={u.k} className="bg-card p-6">
                <div className="flex items-center gap-2 text-star">
                  <Star size={13} />
                  <h3 className="font-display text-xl text-ink">{u.k}</h3>
                </div>
                <p className="mt-3 text-[0.88rem] leading-relaxed text-slate">
                  {u.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CONTACT ---------------- */}
      <section id="contact" className="relative overflow-hidden">
        <div className="hatch pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 md:py-28">
          <span className="text-star">
            <Star size={22} className="mx-auto" />
          </span>
          <h2 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,4.4vw,3.2rem)] text-ink">
            Tell us the report you dread building.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate">
            Show us one thing your team does by hand every quarter. We&apos;ll
            come back with a working version of it — built on your data, not a
            slide.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:hello@calumet.work?subject=Teardown%20request"
              className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-graphite"
            >
              hello@calumet.work
            </a>
            <Link
              href="#report"
              className="inline-flex items-center gap-2 border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Back to the map →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
