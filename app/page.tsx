import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/chrome";
import { Star } from "@/components/brand";
import { HeroLedger } from "@/components/hero-ledger";

const CAPABILITIES = [
  {
    href: "/demos/back-office",
    tag: "The math",
    name: "Back Office",
    body: "The same automation, as a sponsor model. Set the volume and read the FTE, payback, and margin math live.",
    metric: "Headcount → P&L, at any volume",
  },
  {
    href: "/demos/prospector",
    tag: "Reads & decides",
    name: "Prospector",
    body: "The research muscle: it reads the open web, ranks why an account would buy, and names who to call — the same skill the desk uses to size up a vendor or tenant.",
    metric: "20 min of research → 30 sec",
  },
  {
    href: "/demos/lease-desk",
    tag: "Reads documents",
    name: "Lease Desk",
    body: "The document muscle: it pulls the terms that matter out of 40-page leases into clean fields — how the desk knows a lease before it acts on it.",
    metric: "45 min per lease → 90 sec",
  },
];

const SECTORS = [
  "Commercial real estate",
  "Property management",
  "Insurance & claims BPO",
  "Title & escrow",
  "Wholesale distribution",
  "Healthcare revenue cycle",
  "Accounting & bookkeeping",
  "Logistics & freight",
];

const STEPS = [
  {
    k: "Teardown",
    d: "We sit with one team for a day and clock the repetitive work — the copying, keying, looking-up, and chasing that eats the week.",
  },
  {
    k: "Pilot",
    d: "We automate the single highest-volume task first and run it beside your team for two weeks. You keep the receipts.",
  },
  {
    k: "Deploy",
    d: "Once the numbers hold, it goes live inside the tools you already use. No rip-and-replace, no new system to learn.",
  },
  {
    k: "Run",
    d: "We own the upkeep. You get a weekly ledger of hours reclaimed and the next task worth taking off the board.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="grid-paper pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 border border-line bg-card px-3 py-1.5">
              <span className="text-star">
                <Star size={12} />
              </span>
              <span className="eyebrow">Built in Chicago · for the Midwest</span>
            </div>
            <h1 className="font-display text-[clamp(2.6rem,6vw,4.6rem)] text-ink">
              The back office
              <br />
              runs itself now.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate">
              Not a copilot. Calumet builds agents that take a whole back-office
              desk and run it — an event comes in, the work gets finished, the
              ticket closes — with nobody on the keyboard. A person steps in
              only when something truly needs judgment.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/demos/operations-desk"
                className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-graphite"
              >
                Watch a desk run itself <span aria-hidden>→</span>
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 border border-ink px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Book a teardown
              </Link>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
              {[
                ["8 / 9", "items cleared, no staff"],
                ["≈ 2.6", "FTE off the payroll"],
                ["0", "new systems to learn"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="mono text-2xl text-ink">{n}</dt>
                  <dd className="mt-1 text-[0.8rem] leading-snug text-slate">
                    {l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroLedger />
        </div>
      </section>

      {/* ---------------- THESIS BAND ---------------- */}
      <section className="border-b border-line bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <p className="max-w-4xl font-display text-[clamp(1.5rem,3.2vw,2.4rem)] leading-tight">
            Every Midwest service business runs on a layer of work nobody
            wants to do — and pays full salaries to do anyway.{" "}
            <span className="text-chicago">We take that layer.</span>
          </p>
          <div className="mt-10 flex flex-wrap gap-x-2 gap-y-3">
            {SECTORS.map((s) => (
              <span
                key={s}
                className="mono inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 text-[0.74rem] text-paper/75"
              >
                <span className="text-star">
                  <Star size={9} />
                </span>
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- WORK / DEMOS ---------------- */}
      <section id="work" className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">What we automate</p>
              <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] text-ink">
                Watch the whole desk run itself.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate">
              Start with the flagship — a property back office clearing its own
              queue. The three below are the muscles it&apos;s built from, each
              one its own demo.
            </p>
          </div>

          {/* flagship */}
          <Link
            href="/demos/operations-desk"
            className="group mt-12 grid overflow-hidden rounded-sm border border-ink bg-ink text-paper transition-colors hover:bg-graphite lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div className="p-8 sm:p-10">
              <div className="flex items-center gap-2">
                <span className="text-star">
                  <Star size={13} />
                </span>
                <span className="mono text-[0.66rem] uppercase tracking-[0.16em] text-chicago">
                  Flagship · fully autonomous
                </span>
              </div>
              <h3 className="mt-5 font-display text-[clamp(2rem,3.4vw,2.8rem)]">
                Operations Desk
              </h3>
              <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-paper/75">
                Events arrive from tenants, vendors, and the lease calendar.
                The agent finishes each one — dispatches the vendor, posts the
                invoice, sends the renewal, closes the ticket — and pulls in a
                person only when something genuinely needs judgment. You watch
                the queue clear in real time.
              </p>
              <span className="mt-7 inline-flex items-center gap-2 bg-chicago px-5 py-2.5 text-sm font-medium text-white transition-transform group-hover:translate-x-1">
                Start the shift →
              </span>
            </div>
            <div className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10 lg:border-l lg:border-t-0">
              {[
                ["8 / 9", "cleared with no staff"],
                ["1", "escalated, on purpose"],
                ["≈ 2.6", "FTE off the payroll"],
                ["$166k", "out of the run-rate / yr"],
              ].map(([n, l]) => (
                <div key={l} className="bg-ink p-6">
                  <p className="mono font-display text-3xl text-chicago">{n}</p>
                  <p className="mt-1.5 text-[0.78rem] leading-snug text-paper/65">
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </Link>

          {/* capabilities */}
          <p className="mono mt-10 text-[0.7rem] uppercase tracking-[0.14em] text-mute">
            The muscles behind it
          </p>
          <div className="mt-4 grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-3">
            {CAPABILITIES.map((d) => (
              <Link
                key={d.href}
                href={d.href}
                className="group relative flex flex-col bg-card p-7 transition-colors hover:bg-paper"
              >
                <span className="mono text-[0.66rem] uppercase tracking-[0.16em] text-chicago-deep">
                  {d.tag}
                </span>
                <h3 className="mt-4 font-display text-2xl text-ink">{d.name}</h3>
                <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-slate">
                  {d.body}
                </p>
                <div className="mt-6 border-t border-line-soft pt-4">
                  <p className="mono text-[0.78rem] text-ink">{d.metric}</p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-chicago transition-transform group-hover:translate-x-1">
                  Open demo →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PROCESS ---------------- */}
      <section className="border-b border-line bg-card">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
          <p className="eyebrow">How an engagement runs</p>
          <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.8rem,3.6vw,2.6rem)] text-ink">
            Start with one task. Earn the next one.
          </h2>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.k} className="bg-card p-6">
                <div className="flex items-center gap-2 text-star">
                  <Star size={14} />
                  <span className="mono text-[0.7rem] text-mute">
                    STEP {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl text-ink">{s.k}</h3>
                <p className="mt-2 text-[0.86rem] leading-relaxed text-slate">
                  {s.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- CONTACT ---------------- */}
      <section id="contact" className="relative overflow-hidden">
        <div className="hatch pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 text-center sm:px-8 md:py-28">
          <span className="text-star">
            <Star size={22} className="mx-auto" />
          </span>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2rem,4.4vw,3.4rem)] text-ink">
            Bring us your most boring afternoon.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate">
            Tell us the task your team dreads most. We&apos;ll come back with
            a teardown and a working demo of it — no slides.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:hello@calumet.work?subject=Teardown%20request"
              className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-graphite"
            >
              hello@calumet.work
            </a>
            <Link
              href="/demos/prospector"
              className="inline-flex items-center gap-2 border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Or just play with a demo →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
