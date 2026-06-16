"use client";

import { useMemo, useState } from "react";
import { Star } from "@/components/brand";
import { CountUp, Pill, RunButton, useTimeline } from "@/components/demo-kit";
import {
  PROCESSES,
  computeModel,
  money,
  LOADED_COST,
} from "@/lib/backoffice";

export function BackOfficeDemo() {
  const [proc, setProc] = useState(PROCESSES[0]);
  const [volume, setVolume] = useState(PROCESSES[0].baseVolume);

  const durations = useMemo(
    () => [...proc.steps.map(() => 560), 300],
    [proc],
  );
  const { step, running, run, done } = useTimeline(durations);
  const ranOnce = step > 0;
  const finished = step > proc.steps.length;
  const stepsLit = Math.min(step, proc.steps.length);

  const model = computeModel(proc, volume);

  function pick(slug: string) {
    const p = PROCESSES.find((x) => x.slug === slug)!;
    setProc(p);
    setVolume(p.baseVolume);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      {/* process selector */}
      <div className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-3">
        {PROCESSES.map((p) => (
          <button
            key={p.slug}
            onClick={() => pick(p.slug)}
            className={`p-4 text-left transition-colors ${
              p.slug === proc.slug
                ? "bg-ink text-paper"
                : "bg-card text-ink hover:bg-paper"
            }`}
          >
            <div className="flex items-center gap-2">
              <Star
                size={11}
                className={p.slug === proc.slug ? "text-star" : "text-mute"}
              />
              <span className="font-display text-base">{p.name}</span>
            </div>
            <p
              className={`mt-1 text-[0.74rem] leading-snug ${
                p.slug === proc.slug ? "text-paper/65" : "text-slate"
              }`}
            >
              {p.forWhom}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* LEFT: pipeline + run */}
        <div className="space-y-6">
          <div className="rounded-sm border border-line bg-card p-5">
            <div className="flex items-center justify-between">
              <label htmlFor="vol" className="eyebrow">
                Monthly volume · {proc.unit}
              </label>
              <span className="mono text-lg text-ink">
                {volume.toLocaleString("en-US")}
              </span>
            </div>
            <input
              id="vol"
              type="range"
              min={proc.minVolume}
              max={proc.maxVolume}
              step={500}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="mt-3 w-full accent-chicago"
            />
            <div className="mono mt-1 flex justify-between text-[0.66rem] text-mute">
              <span>{proc.minVolume.toLocaleString()}</span>
              <span>{proc.maxVolume.toLocaleString()} / mo</span>
            </div>
          </div>

          <div className="rounded-sm border border-line bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="eyebrow">Process pipeline</p>
              <RunButton
                onClick={run}
                running={running}
                done={done && finished}
                idleLabel="Run the process"
                runningLabel="Running…"
                doneLabel="Run again"
              />
            </div>
            <ol className="mt-5 space-y-2.5">
              {proc.steps.map((s, i) => {
                const active = i < stepsLit;
                const current = i === stepsLit - 1 && running;
                return (
                  <li
                    key={s.label}
                    className={`flex items-center gap-3 rounded-sm border px-3 py-2.5 transition-colors ${
                      active
                        ? "border-line bg-paper"
                        : "border-line-soft opacity-55"
                    } ${current ? "sweep-line" : ""}`}
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.7rem] ${
                        active
                          ? "bg-ink text-paper"
                          : "bg-line-soft text-mute"
                      }`}
                    >
                      {active ? "✓" : i + 1}
                    </span>
                    <span className="flex-1 text-[0.86rem] font-medium text-ink">
                      {s.label}
                    </span>
                    {active && (
                      <Pill tone={s.auto >= 95 ? "good" : "chicago"}>
                        {s.auto}% auto
                      </Pill>
                    )}
                  </li>
                );
              })}
            </ol>
            {ranOnce && (
              <p className="mono mt-4 border-t border-line-soft pt-3 text-[0.72rem] text-slate">
                {finished
                  ? `Processed ${volume.toLocaleString()} ${proc.unit}/mo · exceptions to humans: ${Math.round(
                      proc.exceptionRate * 100,
                    )}%`
                  : "Running items through the pipeline…"}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: sponsor model */}
        <div className="rounded-sm border border-line bg-card">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <p className="eyebrow">Sponsor model · live</p>
            <Pill tone="brass">{money(LOADED_COST)} / FTE loaded</Pill>
          </div>

          {/* FTE before/after */}
          <div className="grid grid-cols-2 divide-x divide-line border-b border-line">
            <div className="p-5">
              <p className="mono text-[0.66rem] uppercase tracking-[0.1em] text-mute">
                Today · manual
              </p>
              <p className="mt-2 font-display text-4xl text-ink">
                {model.fteBefore.toFixed(1)}
                <span className="ml-1 text-lg text-slate">FTE</span>
              </p>
              <p className="mt-1 text-[0.74rem] text-slate">
                {proc.manualMin} min / {proc.unit.slice(0, -1)}
              </p>
            </div>
            <div className="bg-ink p-5 text-paper">
              <p className="mono text-[0.66rem] uppercase tracking-[0.1em] text-mute">
                With Calumet
              </p>
              <p className="mt-2 font-display text-4xl text-chicago">
                {model.fteAfter.toFixed(1)}
                <span className="ml-1 text-lg text-paper/60">FTE</span>
              </p>
              <p className="mt-1 text-[0.74rem] text-paper/60">
                people on exceptions only
              </p>
            </div>
          </div>

          {/* savings headline */}
          <div className="border-b border-line p-5">
            <p className="eyebrow">Net annual savings</p>
            <p className="mt-1 font-display text-5xl text-good">
              {finished ? (
                <CountUp value={model.netSavings} active prefix="$" />
              ) : (
                <span className="text-line">$ —</span>
              )}
            </p>
            {!finished && (
              <p className="mt-1 text-[0.78rem] text-mute">
                Run the process to reveal the model.
              </p>
            )}
            {finished && (
              <div className="mono mt-3 space-y-1 text-[0.78rem]">
                <div className="flex justify-between text-slate">
                  <span>Gross labor savings</span>
                  <span className="text-ink">{money(model.grossSavings)}</span>
                </div>
                <div className="flex justify-between text-slate">
                  <span>Calumet program cost</span>
                  <span className="text-ink">−{money(model.programCost)}</span>
                </div>
                <div className="flex justify-between border-t border-line-soft pt-1 font-medium text-ink">
                  <span>Net to the P&amp;L</span>
                  <span className="text-good">{money(model.netSavings)}</span>
                </div>
              </div>
            )}
          </div>

          {/* secondary metrics */}
          <div className="grid grid-cols-3 divide-x divide-line">
            {[
              {
                k: "Payback",
                v: finished ? `${model.paybackMonths.toFixed(1)} mo` : "—",
              },
              { k: "Cycle time", v: `${proc.cycleBefore}→${proc.cycleAfter}` },
              { k: "Error rate", v: `${proc.errBefore}→${proc.errAfter}` },
            ].map((m) => (
              <div key={m.k} className="p-4 text-center">
                <p className="mono text-[0.62rem] uppercase tracking-[0.08em] text-mute">
                  {m.k}
                </p>
                <p className="mono mt-1 text-[0.92rem] font-medium text-ink">
                  {m.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mono mt-5 text-[0.7rem] leading-relaxed text-mute">
        Model assumptions: {LOADED_COST.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} fully-loaded
        cost per back-office FTE · 138 productive hours / FTE / month · program
        cost = fixed run fee + per-item fee. Figures are illustrative and move
        with the volume slider.
      </p>
    </div>
  );
}
