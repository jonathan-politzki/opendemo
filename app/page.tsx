import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/chrome";
import { Star } from "@/components/brand";
import { SiteEngine } from "@/components/site-engine";

const STEPS = [
  {
    k: "It reads the data",
    d: "Census demographics, CoStar rents and vacancy, county parcels, traffic and rail access — the same sources your team already pays for, pulled fresh.",
  },
  {
    k: "It applies your thesis",
    d: "You decide what matters — intermodal access, rent growth, cheap land — by moving a few sliders. The model scores every county in the metro in milliseconds.",
  },
  {
    k: "It renders the answer",
    d: "A shaded map, a ranked build list, and a written read for your capital partners — that all change the instant you change your mind.",
  },
];

const ELSE = [
  { k: "Deal sourcing", d: "Hand it your buy box; it screens the market for sites that fit." },
  { k: "Due diligence", d: "Drop in an OM, rent roll, and leases; get the summary and the red flags." },
  { k: "Partner reporting", d: "The recurring LP updates, refreshed on demand instead of over weeks." },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      {/* ---------------- HERO ---------------- */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-16">
          <div className="flex items-center gap-2">
            <span className="text-star">
              <Star size={12} />
            </span>
            <span className="eyebrow">Calumet · Chicago industrial site selection</span>
          </div>
          <div className="mt-6 grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-end">
            <h1 className="max-w-2xl font-display text-[clamp(1.9rem,3.8vw,3rem)] leading-[1.04] text-ink">
              Where to build next — scored live on the map, not in a three-week
              study.
            </h1>
            <p className="text-[0.95rem] leading-relaxed text-slate md:pb-1.5">
              The site-selection work your analysts do by hand, rebuilt as a
              model you drive in real time. Real Chicago counties, real factors,
              right below.
              <span className="mt-4 flex flex-wrap items-center gap-3">
                <Link
                  href="#engine"
                  className="inline-flex items-center gap-2 bg-ink px-4 py-2 text-[0.8rem] font-medium text-paper transition-colors hover:bg-graphite"
                >
                  Drive the model ↓
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 text-[0.8rem] font-medium text-chicago-deep hover:underline"
                >
                  Book a teardown
                </Link>
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- THE ENGINE ---------------- */}
      <section id="engine" className="border-b border-line bg-paper">
        <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 md:py-16">
          <div className="mb-6 flex flex-col gap-2 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-[clamp(1.4rem,2.4vw,1.9rem)] text-ink">
              Move a slider. Watch the map rethink itself.
            </h2>
            <p className="max-w-md text-[0.84rem] leading-relaxed text-slate">
              Weight what your firm cares about, or pick a thesis — the score,
              the ranking, and the memo recompute live across all twelve
              counties.
            </p>
          </div>
          <SiteEngine />
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section id="how" className="border-b border-line bg-card">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
          <div className="max-w-2xl">
            <p className="eyebrow">How a computer does the analyst&apos;s job</p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,3.6vw,2.6rem)] text-ink">
              No magic. Three plain steps.
            </h2>
          </div>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.k} className="bg-card p-7">
                <div className="flex items-center gap-2 text-star">
                  <Star size={14} />
                  <span className="mono text-[0.7rem] text-mute">
                    STEP {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl text-ink">{s.k}</h3>
                <p className="mt-3 text-[0.88rem] leading-relaxed text-slate">
                  {s.d}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-14 border-t border-line pt-10">
            <p className="text-[0.95rem] text-slate">
              <span className="font-medium text-ink">
                And it&apos;s not just this map.
              </span>{" "}
              The same engine, pointed at the other work your firm repeats:
            </p>
            <div className="mt-5 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-3">
              {ELSE.map((e) => (
                <div key={e.k} className="bg-card p-5">
                  <h4 className="font-display text-lg text-ink">{e.k}</h4>
                  <p className="mt-1.5 text-[0.84rem] leading-relaxed text-slate">
                    {e.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CONTACT ---------------- */}
      <section id="contact" className="relative overflow-hidden">
        <div className="hatch pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 md:py-32">
          <span className="text-star">
            <Star size={22} className="mx-auto" />
          </span>
          <h2 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,4.4vw,3.2rem)] text-ink">
            Tell us the study you dread running.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate">
            Show us one thing your team rebuilds by hand every quarter. We&apos;ll
            come back with a working version — built on your data, not a slide.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:hello@calumet.work?subject=Teardown%20request"
              className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-graphite"
            >
              hello@calumet.work
            </a>
            <Link
              href="#engine"
              className="inline-flex items-center gap-2 border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Back to the model →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
