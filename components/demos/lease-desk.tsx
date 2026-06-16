"use client";

import { useMemo } from "react";
import { Star } from "@/components/brand";
import {
  CountUp,
  Pill,
  RunButton,
  useTimeline,
} from "@/components/demo-kit";
import { LEASES, ABSTRACT_FIELDS } from "@/lib/lease";

const STAGE_MS = 720;

export function LeaseDeskDemo() {
  // one stage per document, plus a final settle stage
  const durations = useMemo(
    () => [...LEASES.map(() => STAGE_MS), 300],
    [],
  );
  const { step, running, run, done } = useTimeline(durations);

  const processed = Math.min(step, LEASES.length);
  const finished = step > LEASES.length;
  const flags = LEASES.slice(0, processed).filter((l) => l.flag);
  const minutesSaved = processed * 43; // ~45 min/lease manual, ~90s machine

  function docStatus(i: number) {
    if (i < processed) return "done";
    if (i === processed && running) return "reading";
    return "queued";
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      {/* control bar */}
      <div className="flex flex-col gap-4 rounded-sm border border-line bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Inbox · {LEASES.length} documents</p>
          <p className="mt-1 text-sm text-slate">
            A real-shaped stack: office, retail, and industrial leases plus an
            estoppel. Hit run and watch them become one clean table.
          </p>
        </div>
        <RunButton
          onClick={run}
          running={running}
          done={done && finished}
          idleLabel="Process stack"
          runningLabel="Abstracting…"
          doneLabel="Run again"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* document stack */}
        <div className="space-y-2.5">
          <p className="eyebrow">Document queue</p>
          {LEASES.map((l, i) => {
            const st = docStatus(i);
            return (
              <div
                key={l.id}
                className={`rounded-sm border bg-card p-3 transition-colors ${
                  st === "reading"
                    ? "sweep-line border-chicago"
                    : st === "done"
                      ? "border-line"
                      : "border-line-soft opacity-60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="mono truncate text-[0.72rem] text-ink">
                    {l.file}
                  </span>
                  {st === "done" ? (
                    <span className="text-good">✓</span>
                  ) : st === "reading" ? (
                    <span className="h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-chicago/40 border-t-chicago" />
                  ) : (
                    <span className="mono text-[0.66rem] text-mute">queued</span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="mono text-[0.64rem] uppercase tracking-[0.1em] text-mute">
                    {l.type} · {l.pages}p
                  </span>
                  {st === "done" && (
                    <span
                      className={`mono text-[0.64rem] ${
                        l.confidence >= 95
                          ? "text-good"
                          : l.confidence >= 88
                            ? "text-brass"
                            : "text-star"
                      }`}
                    >
                      {l.confidence}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* abstraction output */}
        <div className="space-y-6">
          {processed === 0 ? (
            <div className="grid h-[320px] place-items-center rounded-sm border border-dashed border-line bg-card text-center">
              <div>
                <span className="text-star">
                  <Star size={26} className="mx-auto" />
                </span>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate">
                  The abstraction table builds here, one document at a time —
                  the same view your lease admin reviews instead of types.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-sm border border-line bg-card">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <p className="eyebrow">Lease abstraction · live</p>
                <span className="mono text-[0.68rem] text-mute">
                  {processed}/{LEASES.length} keyed
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-[0.76rem]">
                  <thead>
                    <tr className="border-b border-line">
                      {ABSTRACT_FIELDS.map((f) => (
                        <th
                          key={f.key}
                          className="mono whitespace-nowrap px-3 py-2.5 text-[0.62rem] font-medium uppercase tracking-[0.08em] text-mute"
                        >
                          {f.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {LEASES.slice(0, processed).map((l) => (
                      <tr
                        key={l.id}
                        className="rise border-b border-line-soft last:border-0 hover:bg-paper"
                      >
                        {ABSTRACT_FIELDS.map((f) => (
                          <td
                            key={f.key}
                            className={`whitespace-nowrap px-3 py-2.5 align-top ${
                              f.key === "tenant"
                                ? "font-medium text-ink"
                                : "text-slate"
                            }`}
                          >
                            {l[f.key]}
                            {f.key === "tenant" && l.flag && (
                              <span
                                className="ml-1.5 text-star"
                                title={l.flag}
                              >
                                ★
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* review queue */}
          {processed > 0 && (
            <div className="rounded-sm border border-line bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Review queue · human-in-the-loop</p>
                <Pill tone={flags.length ? "star" : "good"}>
                  {flags.length
                    ? `${flags.length} to confirm`
                    : "nothing flagged yet"}
                </Pill>
              </div>
              <ul className="mt-3 space-y-2.5">
                {flags.length === 0 && (
                  <li className="text-[0.84rem] text-slate">
                    Clean so far. The agent only escalates the clauses that
                    actually need a person — not every field.
                  </li>
                )}
                {flags.map((l) => (
                  <li key={l.id} className="rise flex gap-3">
                    <span className="mt-0.5 text-star">
                      <Star size={12} />
                    </span>
                    <div>
                      <p className="text-[0.86rem] font-medium text-ink">
                        {l.tenant}{" "}
                        <span className="mono text-[0.7rem] text-mute">
                          {l.file}
                        </span>
                      </p>
                      <p className="text-[0.82rem] text-slate">{l.flag}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* impact */}
          {finished && (
            <div className="rise grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-line bg-line">
              {[
                {
                  el: <CountUp value={minutesSaved / 60} active decimals={1} suffix=" hrs" />,
                  l: "Saved on this stack",
                },
                {
                  el: <CountUp value={90} active suffix=" sec" />,
                  l: "Avg per document",
                },
                {
                  el: <CountUp value={flags.length} active suffix=" / 5" />,
                  l: "Needed a human",
                },
              ].map((m, i) => (
                <div key={i} className="bg-card p-4 text-center">
                  <p className="text-2xl text-ink">{m.el}</p>
                  <p className="mt-1 text-[0.72rem] leading-snug text-slate">
                    {m.l}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
