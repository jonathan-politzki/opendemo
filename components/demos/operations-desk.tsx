"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Star } from "@/components/brand";
import { CountUp, Pill } from "@/components/demo-kit";
import {
  EVENTS,
  OUTCOME_META,
  KIND_LABEL,
  COMPANY,
  deskEconomics,
  type Artifact,
  type OpsEvent,
} from "@/lib/opsdesk";

const STEP_MS = 460;
const SETTLE_MS = 540;

function reduce() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function OperationsDesk() {
  const [active, setActive] = useState(0);
  const [sub, setSub] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [pinned, setPinned] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const start = useCallback(() => {
    clear();
    setStarted(true);
    setPinned(null);
    setActive(0);
    setSub(0);
    setRunning(true);

    if (reduce()) {
      setActive(EVENTS.length);
      setSub(0);
      setRunning(false);
      return;
    }

    let t = 0;
    const at = (ms: number, fn: () => void) =>
      timers.current.push(setTimeout(fn, ms));

    EVENTS.forEach((ev, i) => {
      t += 80;
      at(t, () => {
        setActive(i);
        setSub(0);
      });
      ev.steps.forEach((_, s) => {
        t += STEP_MS;
        at(t, () => setSub(s + 1));
      });
      t += SETTLE_MS;
      at(t, () => {
        setActive(i + 1);
        setSub(0);
      });
    });
    at(t, () => setRunning(false));
  }, [clear]);

  useEffect(() => clear, [clear]);

  const doneCount = Math.min(active, EVENTS.length);
  const done = EVENTS.slice(0, doneCount);
  const escalated = done.filter((e) => e.outcome === "escalated").length;
  const autonomous = doneCount - escalated;
  const minutesSaved = done.reduce((a, e) => a + e.saveMin, 0);
  const econ = deskEconomics(minutesSaved, doneCount);
  const finished = started && !running && active >= EVENTS.length;

  const focusIdx = pinned ?? Math.min(active, EVENTS.length - 1);
  const focus = EVENTS[focusIdx];
  const focusIsLive = focusIdx === active && running;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      {/* control bar */}
      <div className="flex flex-col gap-4 rounded-sm border border-line bg-ink p-5 text-paper sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            {running && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-good/70" />
            )}
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                running ? "bg-good" : finished ? "bg-good" : "bg-mute"
              }`}
            />
          </span>
          <div>
            <p className="font-display text-lg leading-none">
              {COMPANY} · Operations Desk
            </p>
            <p className="mono mt-1 text-[0.68rem] uppercase tracking-[0.14em] text-mute">
              {running
                ? "Autonomous · clearing the queue"
                : finished
                  ? "Shift complete · queue cleared"
                  : "Autonomous · idle"}
            </p>
          </div>
        </div>
        <button
          onClick={start}
          disabled={running}
          className="inline-flex items-center justify-center gap-2 bg-chicago px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-chicago-deep disabled:cursor-wait disabled:bg-slate"
        >
          {running ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Clearing…
            </>
          ) : finished ? (
            "Replay the shift →"
          ) : (
            "Start the shift →"
          )}
        </button>
      </div>

      {/* dashboard */}
      <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-line bg-line lg:grid-cols-4">
        {[
          {
            label: "Items cleared",
            el: <CountUp value={doneCount} active={started} duration={500} />,
            tone: "text-ink",
          },
          {
            label: "Done with zero staff",
            el: <CountUp value={autonomous} active={started} duration={500} />,
            tone: "text-good",
          },
          {
            label: "Pulled in a human",
            el: <CountUp value={escalated} active={started} duration={500} />,
            tone: "text-star",
          },
          {
            label: "Staff-hours reclaimed",
            el: (
              <CountUp
                value={minutesSaved / 60}
                active={started}
                decimals={1}
                duration={700}
              />
            ),
            tone: "text-ink",
          },
        ].map((t) => (
          <div key={t.label} className="bg-card p-4">
            <p className="mono text-[0.62rem] uppercase tracking-[0.1em] text-mute">
              {t.label}
            </p>
            <p className={`mt-1 font-display text-4xl ${t.tone}`}>{t.el}</p>
          </div>
        ))}
      </div>

      {/* FTE callout */}
      <div
        className={`mt-3 flex flex-col gap-2 rounded-sm border border-chicago/30 bg-chicago-wash px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
          started ? "" : "opacity-50"
        }`}
      >
        <p className="text-[0.92rem] text-ink">
          At this property&apos;s volume, the desk does the work of{" "}
          <span className="mono font-semibold text-chicago-deep">
            ≈ <CountUp value={econ.fte} active={started} decimals={1} /> FTE
          </span>{" "}
          — about{" "}
          <span className="mono font-semibold text-chicago-deep">
            $<CountUp value={econ.annualValue} active={started} />
          </span>{" "}
          a year, off the payroll.
        </p>
        <span className="mono shrink-0 text-[0.66rem] text-slate">
          ~70 items/day · $64k loaded/FTE · illustrative
        </span>
      </div>

      {/* main: feed + inspector */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        {/* FEED */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="eyebrow">Live queue</p>
            <span className="mono text-[0.66rem] text-mute">
              {started ? `${doneCount}/${EVENTS.length} processed` : "press start"}
            </span>
          </div>

          {!started ? (
            <div className="grid h-[420px] place-items-center rounded-sm border border-dashed border-line bg-card p-8 text-center">
              <div>
                <span className="text-star">
                  <Star size={26} className="mx-auto" />
                </span>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate">
                  Real events arrive here from tenants, vendors, the AP inbox,
                  and the lease calendar. Hit start and watch the desk finish
                  each one — take the action, then close it — with nobody
                  touching the keyboard.
                </p>
              </div>
            </div>
          ) : (
            <ol className="space-y-2.5">
              {EVENTS.map((ev, i) => (
                <FeedRow
                  key={ev.id}
                  ev={ev}
                  state={
                    i < active ? "done" : i === active && running ? "live" : "queued"
                  }
                  sub={sub}
                  selected={i === focusIdx}
                  onSelect={() => setPinned(i)}
                />
              ))}
            </ol>
          )}
        </div>

        {/* INSPECTOR */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="mb-3 flex items-center justify-between">
            <p className="eyebrow">The work it produced</p>
            {pinned !== null && (
              <button
                onClick={() => setPinned(null)}
                className="mono text-[0.66rem] uppercase tracking-[0.1em] text-chicago-deep hover:underline"
              >
                follow live →
              </button>
            )}
          </div>
          {!started ? (
            <div className="grid h-[420px] place-items-center rounded-sm border border-line bg-card p-8 text-center">
              <p className="mono text-sm text-mute">
                Every email, work order, and ledger entry the agent creates
                shows up here — the actual output, not a summary.
              </p>
            </div>
          ) : (
            <InspectorCard ev={focus} live={focusIsLive} sub={sub} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- feed row ---------------- */
function FeedRow({
  ev,
  state,
  sub,
  selected,
  onSelect,
}: {
  ev: OpsEvent;
  state: "queued" | "live" | "done";
  sub: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const om = OUTCOME_META[ev.outcome];
  return (
    <li
      className={`overflow-hidden rounded-sm border bg-card transition-colors ${
        state === "live"
          ? "border-chicago"
          : state === "queued"
            ? "border-line-soft opacity-55"
            : selected
              ? "border-ink"
              : "border-line"
      }`}
    >
      <button
        onClick={onSelect}
        disabled={state === "queued"}
        className="flex w-full items-start gap-3 p-3.5 text-left disabled:cursor-default"
      >
        <span
          className={`mt-0.5 ${
            state === "done"
              ? om.human
                ? "text-star"
                : "text-good"
              : state === "live"
                ? "text-chicago"
                : "text-mute"
          }`}
        >
          <Star size={13} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[0.9rem] font-medium text-ink">{ev.title}</span>
            <span className="mono text-[0.6rem] uppercase tracking-[0.08em] text-mute">
              {KIND_LABEL[ev.kind]}
            </span>
          </div>
          <p className="mono mt-0.5 text-[0.66rem] text-slate">
            {ev.source} · {ev.property}
          </p>

          {/* live steps */}
          {state === "live" && (
            <ul className="mt-2.5 space-y-1 border-l border-chicago/30 pl-3">
              {ev.steps.slice(0, sub).map((s, k) => (
                <li key={k} className="rise text-[0.78rem] text-graphite">
                  <span className="text-good">✓</span> {s}
                </li>
              ))}
              {sub < ev.steps.length && (
                <li className="text-[0.78rem] text-mute">
                  <span className="scan-cursor" />
                </li>
              )}
            </ul>
          )}

          {/* resolved summary */}
          {state === "done" && (
            <p className="mt-1.5 text-[0.78rem] text-slate">
              → {ev.outcomeLabel}
            </p>
          )}
        </div>

        <div className="shrink-0">
          {state === "done" ? (
            <Pill tone={om.tone}>{om.label}</Pill>
          ) : state === "live" ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-chicago/40 border-t-chicago" />
          ) : (
            <span className="mono text-[0.6rem] uppercase tracking-[0.1em] text-mute">
              queued
            </span>
          )}
        </div>
      </button>
    </li>
  );
}

/* ---------------- inspector ---------------- */
function InspectorCard({
  ev,
  live,
  sub,
}: {
  ev: OpsEvent;
  live: boolean;
  sub: number;
}) {
  const om = OUTCOME_META[ev.outcome];
  const revealArtifact = !live || sub >= ev.steps.length;
  return (
    <div className="overflow-hidden rounded-sm border border-line bg-card">
      <div className="border-b border-line p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mono text-[0.62rem] uppercase tracking-[0.1em] text-mute">
              {KIND_LABEL[ev.kind]} · {ev.source}
            </p>
            <h3 className="mt-1 font-display text-lg text-ink">{ev.title}</h3>
          </div>
          {revealArtifact ? (
            <Pill tone={om.tone}>{om.label}</Pill>
          ) : (
            <Pill tone="chicago">Working…</Pill>
          )}
        </div>
        <p className="mt-3 border-l-2 border-line pl-3 text-[0.82rem] italic leading-relaxed text-slate">
          {ev.trigger}
        </p>
      </div>

      <div className="p-4">
        {revealArtifact ? (
          <ArtifactView a={ev.artifact} />
        ) : (
          <div className="grid h-40 place-items-center">
            <p className="mono text-sm text-mute">
              <span className="scan-cursor">working</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ArtifactView({ a }: { a: Artifact }) {
  if (a.type === "email") {
    return (
      <div className="rise">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Sent · {a.channel}</p>
          <span className="text-good">✓ delivered</span>
        </div>
        <div className="mt-3 rounded-sm border border-line bg-paper p-4">
          <dl className="space-y-1 border-b border-line-soft pb-2 text-[0.76rem]">
            <div className="flex gap-2">
              <dt className="mono w-12 text-mute">From</dt>
              <dd className="text-ink">{COMPANY}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="mono w-12 text-mute">To</dt>
              <dd className="text-ink">{a.to}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="mono w-12 text-mute">Subj</dt>
              <dd className="font-medium text-ink">{a.subj}</dd>
            </div>
          </dl>
          <div className="mt-3 space-y-2 text-[0.84rem] leading-relaxed text-graphite">
            {a.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (a.type === "ledger" || a.type === "record") {
    const stamp = a.type === "record" ? a.status : "Posted";
    return (
      <div className="rise">
        <div className="flex items-center justify-between">
          <p className="eyebrow">{a.title}</p>
          <Pill tone="good">{stamp}</Pill>
        </div>
        <dl className="mt-3 divide-y divide-line-soft rounded-sm border border-line">
          {a.fields.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 px-3 py-2">
              <dt className="mono text-[0.7rem] uppercase tracking-[0.06em] text-mute">
                {k}
              </dt>
              <dd className="mono text-right text-[0.82rem] text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  // brief / escalation
  return (
    <div className="rise rounded-sm border border-star/30 bg-star/5 p-4">
      <div className="flex items-center gap-2 text-star">
        <Star size={13} />
        <p className="mono text-[0.66rem] uppercase tracking-[0.12em]">
          {a.title}
        </p>
      </div>
      <ul className="mt-3 space-y-2 text-[0.84rem] leading-relaxed text-graphite">
        {a.lines.map((l, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-star" />
            {l}
          </li>
        ))}
      </ul>
      <p className="mono mt-3 border-t border-star/20 pt-2 text-[0.68rem] text-star">
        The agent stopped here on purpose — this one needs a person.
      </p>
    </div>
  );
}
