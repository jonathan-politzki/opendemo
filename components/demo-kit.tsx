"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------------------------------------------------------------
   useTimeline — advance through stages on a per-stage duration.
   `step` = number of stages completed (0 = nothing yet).
   --------------------------------------------------------------- */
export function useTimeline(durations: number[]) {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const run = useCallback(() => {
    clear();
    setStep(0);
    setRunning(true);
    const reduce = prefersReducedMotion();
    let t = 0;
    durations.forEach((d, idx) => {
      t += reduce ? 1 : d;
      timers.current.push(
        setTimeout(() => {
          setStep(idx + 1);
          if (idx === durations.length - 1) setRunning(false);
        }, t),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clear, JSON.stringify(durations)]);

  const reset = useCallback(() => {
    clear();
    setStep(0);
    setRunning(false);
  }, [clear]);

  useEffect(() => clear, [clear]);

  return { step, running, run, reset, done: step >= durations.length };
}

/* ---------------------------------------------------------------
   CountUp — eases a number toward target when `active`.
   --------------------------------------------------------------- */
export function CountUp({
  value,
  active,
  duration = 1100,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number;
  active: boolean;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [n, setN] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setN(0);
      return;
    }
    if (prefersReducedMotion()) {
      setN(value);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [active, value, duration]);

  const formatted = n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return (
    <span className="mono tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/* ---------------------------------------------------------------
   Console — reveals trace lines as the timeline advances.
   --------------------------------------------------------------- */
export type TraceLine = { t: string; kind?: "in" | "out" | "ok" | "note" };

export function Console({
  lines,
  visible,
  running,
}: {
  lines: TraceLine[];
  visible: number;
  running: boolean;
}) {
  const shown = lines.slice(0, visible);
  return (
    <div className="console h-full overflow-hidden rounded-sm p-4 text-[0.78rem] leading-relaxed">
      <div className="mb-3 flex items-center gap-1.5 border-b border-white/10 pb-2">
        <span className="h-2 w-2 rounded-full bg-star/80" />
        <span className="h-2 w-2 rounded-full bg-brass/80" />
        <span className="h-2 w-2 rounded-full bg-good/80" />
        <span className="ml-2 text-[0.66rem] uppercase tracking-[0.18em] text-white/40">
          agent trace
        </span>
      </div>
      <div className="space-y-1">
        {shown.map((l, i) => (
          <div key={i} className="rise flex gap-2">
            <span
              className={
                l.kind === "ok"
                  ? "text-good"
                  : l.kind === "out"
                    ? "text-chicago"
                    : l.kind === "note"
                      ? "text-white/40"
                      : "text-white/55"
              }
            >
              {l.kind === "ok"
                ? "✓"
                : l.kind === "out"
                  ? "›"
                  : l.kind === "note"
                    ? "·"
                    : "»"}
            </span>
            <span
              className={
                l.kind === "note"
                  ? "text-white/45"
                  : l.kind === "out"
                    ? "text-white"
                    : "text-white/80"
              }
            >
              {l.t}
            </span>
          </div>
        ))}
        {running && (
          <div className="flex gap-2 text-white/40">
            <span>»</span>
            <span className="scan-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Small structural helpers reused across demos.
   --------------------------------------------------------------- */
export function Pill({
  children,
  tone = "ink",
}: {
  children: ReactNode;
  tone?: "ink" | "good" | "chicago" | "star" | "brass";
}) {
  const tones: Record<string, string> = {
    ink: "bg-ink text-paper",
    good: "bg-good/12 text-good ring-1 ring-good/25",
    chicago: "bg-chicago-wash text-chicago-deep ring-1 ring-chicago/25",
    star: "bg-star/10 text-star ring-1 ring-star/25",
    brass: "bg-brass/10 text-brass ring-1 ring-brass/25",
  };
  return (
    <span
      className={`mono inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[0.66rem] uppercase tracking-[0.12em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function RunButton({
  onClick,
  running,
  done,
  idleLabel,
  runningLabel = "Working…",
  doneLabel = "Run again",
}: {
  onClick: () => void;
  running: boolean;
  done: boolean;
  idleLabel: string;
  runningLabel?: string;
  doneLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={running}
      className="group inline-flex items-center gap-2.5 bg-chicago px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-chicago-deep disabled:cursor-wait disabled:bg-slate"
    >
      {running && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {running ? runningLabel : done ? doneLabel : idleLabel}
      {!running && (
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      )}
    </button>
  );
}
