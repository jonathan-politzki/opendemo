"use client";

import { useMemo, useState } from "react";
import { Star } from "@/components/brand";
import {
  Console,
  CountUp,
  Pill,
  RunButton,
  useTimeline,
  type TraceLine,
} from "@/components/demo-kit";
import { DOSSIERS, PRESETS, resolveDossier } from "@/lib/prospector";

export function ProspectorDemo() {
  const [query, setQuery] = useState(PRESETS[0].name);
  const [target, setTarget] = useState(DOSSIERS[0]);

  // stage durations: one tick per trace line, then a beat to assemble
  const durations = useMemo(
    () => [...target.trace.map(() => 520), 400],
    [target],
  );
  const { step, running, run, reset, done } = useTimeline(durations);

  const traceLines: TraceLine[] = target.trace.map((t, i) => ({
    t,
    kind: i === target.trace.length - 1 ? "ok" : i < 2 ? "in" : "note",
  }));
  const visibleTrace = Math.min(step, target.trace.length);
  const assembled = step > target.trace.length; // results revealed

  function start(slug?: string) {
    const d = slug ? DOSSIERS.find((x) => x.slug === slug)! : resolveDossier(query);
    setTarget(d);
    setQuery(d.name);
    reset();
    // allow state to settle, then run on next frame
    requestAnimationFrame(() => requestAnimationFrame(run));
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      {/* control bar */}
      <div className="rounded-sm border border-line bg-card p-5">
        <label className="eyebrow" htmlFor="company">
          Target account
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="company"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && start()}
            placeholder="Company name…"
            className="mono flex-1 border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-mute focus:border-chicago"
          />
          <RunButton
            onClick={() => start()}
            running={running}
            done={done && assembled}
            idleLabel="Research account"
            runningLabel="Researching…"
            doneLabel="Research again"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="mono text-[0.66rem] uppercase tracking-[0.12em] text-mute">
            Try:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.slug}
              onClick={() => start(p.slug)}
              disabled={running}
              className="mono border border-line px-2.5 py-1 text-[0.72rem] text-slate transition-colors hover:border-chicago hover:text-chicago-deep disabled:opacity-50"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* working area */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* trace */}
        <div className="min-h-[340px]">
          {step === 0 ? (
            <div className="grid h-full min-h-[340px] place-items-center rounded-sm border border-dashed border-line bg-card p-8 text-center">
              <div>
                <span className="text-star">
                  <Star size={26} className="mx-auto" />
                </span>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate">
                  Pick an account and hit research. The agent works in the
                  open — every step it takes shows up here.
                </p>
              </div>
            </div>
          ) : (
            <Console
              lines={traceLines}
              visible={visibleTrace}
              running={running}
            />
          )}
        </div>

        {/* results */}
        <div className="min-h-[340px]">
          {!assembled ? (
            <div className="grid h-full min-h-[340px] place-items-center rounded-sm border border-line bg-card p-8">
              <p className="mono text-sm text-mute">
                {step === 0
                  ? "Dossier will assemble here →"
                  : "Assembling dossier…"}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* dossier head */}
              <div className="rise rounded-sm border border-line bg-card">
                <div className="border-b border-line p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl text-ink">
                        {target.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate">{target.sector}</p>
                    </div>
                    <Pill tone="good">match 96%</Pill>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.8rem] sm:grid-cols-4">
                    {[
                      ["HQ", target.hq],
                      ["Size", target.size],
                      ["Revenue", target.revenue],
                      ["History", target.founded],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="mono text-[0.62rem] uppercase tracking-[0.1em] text-mute">
                          {k}
                        </dt>
                        <dd className="mt-0.5 text-ink">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <p className="p-5 text-[0.9rem] leading-relaxed text-slate">
                  {target.summary}
                </p>
              </div>

              {/* signals */}
              <div className="rise rounded-sm border border-line bg-card p-5">
                <p className="eyebrow">Buying signals · ranked</p>
                <ul className="mt-3 space-y-3">
                  {target.signals.map((s) => (
                    <li key={s.label} className="flex gap-3">
                      <span className="mt-0.5 text-star">
                        <Star size={12} />
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[0.88rem] font-medium text-ink">
                            {s.label}
                          </span>
                          <Pill tone={s.weight === "high" ? "star" : "brass"}>
                            {s.weight === "high" ? "strong" : "supporting"}
                          </Pill>
                        </div>
                        <p className="mt-0.5 text-[0.8rem] text-slate">
                          {s.why}
                        </p>
                        <p className="mono mt-1 text-[0.68rem] text-mute">
                          {s.source}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* contact + email */}
              <div className="rise grid gap-5 sm:grid-cols-2">
                <div className="rounded-sm border border-line bg-card p-5">
                  <p className="eyebrow">Who to call</p>
                  <p className="mt-3 font-display text-xl text-ink">
                    {target.contact.name}
                  </p>
                  <p className="text-[0.84rem] text-slate">
                    {target.contact.title}
                  </p>
                  <p className="mono mt-1 text-[0.68rem] text-mute">
                    {target.contact.tenure}
                  </p>
                  <p className="mt-3 text-[0.82rem] leading-relaxed text-slate">
                    {target.contact.why}
                  </p>
                  <p className="mt-3 border-t border-line-soft pt-3 text-[0.78rem] text-chicago-deep">
                    {target.contact.channel}
                  </p>
                </div>
                <div className="flex flex-col rounded-sm border border-line bg-ink p-5 text-paper">
                  <p className="eyebrow text-mute">Drafted opener</p>
                  <p className="mono mt-3 text-[0.78rem] text-chicago">
                    Subject: {target.email.subject}
                  </p>
                  <div className="mt-3 space-y-2 text-[0.82rem] leading-relaxed text-paper/85">
                    {target.email.body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* impact strip */}
              <div className="rise grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-line bg-line">
                {[
                  { v: 19, suffix: " min", l: "Manual research time" },
                  { v: 31, suffix: " sec", l: "Calumet runtime" },
                  { v: 38, prefix: "", suffix: "×", l: "Faster, every account" },
                ].map((m) => (
                  <div key={m.l} className="bg-card p-4 text-center">
                    <p className="text-2xl text-ink">
                      <CountUp
                        value={m.v}
                        active
                        prefix={m.prefix ?? ""}
                        suffix={m.suffix}
                      />
                    </p>
                    <p className="mt-1 text-[0.72rem] leading-snug text-slate">
                      {m.l}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
