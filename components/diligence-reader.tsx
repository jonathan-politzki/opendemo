"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Star } from "./brand";
import { OM, STAGE_LABELS } from "@/lib/diligence";

function reduce() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const STAGE_MS = 850;

export function DiligenceReader() {
  const [step, setStep] = useState(0); // 0 idle; 1..6 reveal sections
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const run = useCallback(() => {
    clear();
    setStep(0);
    setRunning(true);
    if (reduce()) {
      setStep(6);
      setRunning(false);
      return;
    }
    let t = 0;
    for (let i = 1; i <= 6; i++) {
      t += STAGE_MS;
      timers.current.push(setTimeout(() => setStep(i), t));
    }
    timers.current.push(setTimeout(() => setRunning(false), t));
  }, []);

  useEffect(() => clear, []);

  const has = (n: number) => step >= n;
  const sev = {
    high: "border-star/40 bg-star/8 text-star",
    med: "border-brass/40 bg-brass/8 text-brass",
    low: "border-night-line bg-night-3 text-night-mute",
  } as const;

  return (
    <div className="overflow-hidden rounded-lg border border-night-line bg-night text-night-text shadow-[0_40px_120px_-40px_rgba(8,12,16,0.8)]">
      <div className="flex flex-col gap-3 border-b border-night-line px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-cyan">
            <Star size={16} />
          </span>
          <div>
            <p className="font-display text-base leading-none text-white">
              Diligence Reader · offering memo → red flags
            </p>
            <p className="mono mt-1 text-[0.62rem] uppercase tracking-[0.16em] text-night-mute">
              the read your analyst does over two days, in one pass
            </p>
          </div>
        </div>
        <button
          onClick={run}
          disabled={running}
          className="inline-flex items-center justify-center gap-2 bg-cyan px-4 py-2 text-sm font-medium text-night transition-colors hover:bg-cyan/80 disabled:cursor-wait disabled:opacity-70"
        >
          {running ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-night/40 border-t-night" />
              Reading…
            </>
          ) : step >= 6 ? (
            "Read it again"
          ) : (
            "Read the memo →"
          )}
        </button>
      </div>

      <div className="grid gap-px bg-night-line lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* the document */}
        <div className="bg-night-2 px-5 py-6">
          <div className="rounded-sm border border-night-line bg-night-3 p-4">
            <div className="flex items-center gap-1.5 text-night-mute">
              <span className="h-2 w-2 rounded-full bg-star/70" />
              <span className="mono text-[0.6rem] uppercase tracking-[0.1em]">PDF · {OM.pages} pages</span>
            </div>
            <p className="mt-4 font-display text-lg leading-tight text-white">{OM.title}</p>
            <p className="mt-1 text-[0.74rem] text-night-mute">{OM.subtitle}</p>
            <div className="mt-4 space-y-1.5 border-t border-night-line pt-3">
              {OM.docs.map((d) => (
                <p key={d} className="flex items-center gap-2 text-[0.74rem] text-night-text">
                  <span className="text-night-mute">▪</span> {d}
                </p>
              ))}
            </div>
          </div>

          {/* progress trace */}
          <div className="mt-4 space-y-1.5">
            {STAGE_LABELS.map((l, i) => {
              const done = step >= i + 1;
              const active = running && step === i;
              return (
                <p
                  key={i}
                  className={`flex items-start gap-2 text-[0.72rem] transition-opacity ${
                    done ? "text-night-text" : active ? "text-cyan" : "text-night-mute/50"
                  }`}
                >
                  <span>{done ? "✓" : active ? "▸" : "·"}</span>
                  {l}
                </p>
              );
            })}
          </div>
        </div>

        {/* the extraction */}
        <div className="space-y-5 bg-night px-5 py-6 sm:px-6">
          {step === 0 ? (
            <div className="grid h-full min-h-[420px] place-items-center text-center">
              <div>
                <span className="text-cyan"><Star size={26} className="mx-auto" /></span>
                <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-night-mute">
                  Hit read. It pulls the deal facts, abstracts the rent roll,
                  runs the math, and surfaces what would sink the deal — the
                  work that takes an analyst the better part of two days.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* facts */}
              {has(1) && (
                <div className="rise">
                  <p className="mono text-[0.62rem] uppercase tracking-[0.16em] text-night-mute">Deal facts</p>
                  <dl className="mt-2 grid grid-cols-2 gap-x-5 gap-y-1.5 sm:grid-cols-4">
                    {OM.facts.map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-[0.62rem] text-night-mute">{k}</dt>
                        <dd className="mono text-[0.82rem] text-white">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* rent roll */}
              {has(2) && (
                <div className="rise">
                  <p className="mono text-[0.62rem] uppercase tracking-[0.16em] text-night-mute">Rent roll</p>
                  <div className="mt-2 overflow-x-auto">
                    <table className="w-full text-left text-[0.74rem]">
                      <thead>
                        <tr className="text-night-mute">
                          {["Tenant", "SF", "% NOI", "Rent", "Mkt", "Expiry"].map((h) => (
                            <th key={h} className="mono pb-1.5 pr-3 text-[0.58rem] font-medium uppercase tracking-[0.06em]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {OM.rentRoll.map((r) => (
                          <tr key={r.tenant} className="border-t border-night-line">
                            <td className={`py-1.5 pr-3 ${r.tenant === "Vacant" ? "text-night-mute" : "text-white"}`}>{r.tenant}</td>
                            <td className="mono py-1.5 pr-3 text-night-text">{r.sf}</td>
                            <td className={`mono py-1.5 pr-3 ${r.pct >= 40 ? "text-star" : "text-night-text"}`}>{r.pct}%</td>
                            <td className="mono py-1.5 pr-3 text-night-text">{r.rent}</td>
                            <td className="mono py-1.5 pr-3 text-night-mute">{r.mkt}</td>
                            <td className="mono py-1.5 text-night-text">{r.exp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* metrics */}
              {has(3) && (
                <div className="rise grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-night-line bg-night-line sm:grid-cols-5">
                  {OM.metrics.map(([k, v]) => (
                    <div key={k} className="bg-night px-3 py-2.5">
                      <p className="text-[0.6rem] text-night-mute">{k}</p>
                      <p className="mono mt-0.5 text-[0.82rem] text-cyan">{v}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* red flags */}
              {has(4) && (
                <div className="rise">
                  <p className="mono text-[0.62rem] uppercase tracking-[0.16em] text-night-mute">
                    Red flags · ranked by severity
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {OM.redFlags.map((f, i) => (
                      <li key={i} className={`flex gap-2.5 rounded-sm border px-3 py-2 text-[0.78rem] ${sev[f.sev]}`}>
                        <span className="mono text-[0.58rem] uppercase">{f.sev}</span>
                        <span className="text-night-text/90">{f.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* read */}
              {has(6) && (
                <div className="rise rounded-sm border border-cyan/30 bg-cyan/5 p-4">
                  <p className="mono text-[0.62rem] uppercase tracking-[0.16em] text-cyan">The diligence read</p>
                  <div className="mt-2 space-y-2 text-[0.84rem] leading-relaxed text-night-text/90">
                    {OM.read.map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="border-t border-night-line px-6 py-3">
        <p className="mono text-[0.62rem] text-night-mute">
          Sample deal · the extraction logic is what a model runs on your real
          OMs and rent rolls
        </p>
      </div>
    </div>
  );
}
