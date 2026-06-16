"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* One concrete example, two worlds. A capital partner asks for the
   "where should we deploy in Chicago" report before the LP letter.
   Left: how the team does it by hand. Right: done in minutes.
   Press play and the contrast does the talking. */

const BEFORE = [
  { t: "An analyst pulls the latest demographics, submarket by submarket", d: 2 },
  { t: "Exports vacancy and rent comps from CoStar and cleans them up", d: 1 },
  { t: "Cross-checks zoning, land, and the competitive pipeline", d: 1 },
  { t: "Builds the shaded maps by hand in ArcGIS and Excel", d: 3 },
  { t: "Writes the narrative tying it back to our investment thesis", d: 2 },
  { t: "Formats the deck and routes it around for review", d: 2 },
];

const AFTER = [
  { t: "Read the ask and last quarter's methodology", s: 3 },
  { t: "Pulled current demographics, vacancy, and rents for every submarket", s: 55 },
  { t: "Scored all ten Chicago submarkets against the thesis", s: 130 },
  { t: "Shaded the map and ranked where to build", s: 250 },
  { t: "Drafted the LP narrative, with sources cited", s: 360 },
];

function fmtAfter(s: number) {
  return s < 60 ? `${s} sec` : `${Math.round(s / 60)} min`;
}

function reduce() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function BeforeAfter() {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const play = useCallback(() => {
    clear();
    setStarted(true);
    setDone(false);
    setLeft(0);
    setRight(0);
    setPlaying(true);

    if (reduce()) {
      setLeft(BEFORE.length);
      setRight(AFTER.length);
      setDone(true);
      setPlaying(false);
      return;
    }

    const LSTEP = 1100;
    const RSTEP = 340;
    let lt = 0;
    BEFORE.forEach((_, i) => {
      lt += LSTEP;
      timers.current.push(setTimeout(() => setLeft(i + 1), lt));
    });
    let rt = 0;
    AFTER.forEach((_, i) => {
      rt += RSTEP;
      timers.current.push(setTimeout(() => setRight(i + 1), rt));
    });
    const end = Math.max(lt, rt) + 500;
    timers.current.push(
      setTimeout(() => {
        setDone(true);
        setPlaying(false);
      }, end),
    );
  }, []);

  useEffect(() => clear, []);

  const leftDays = BEFORE.slice(0, left).reduce((a, s) => a + s.d, 0);
  const rightSecs = right > 0 ? AFTER[right - 1].s : 0;
  const leftBusy = playing && left < BEFORE.length;
  const rightDone = right >= AFTER.length;

  return (
    <div>
      {/* the shared ask */}
      <div className="mx-auto max-w-2xl rounded-sm border border-line bg-card p-5 shadow-[0_18px_50px_-30px_rgba(20,24,29,0.5)]">
        <div className="flex items-center justify-between">
          <span className="eyebrow">The ask that comes in</span>
          <span className="mono text-[0.66rem] text-mute">Mon · 8:12 AM</span>
        </div>
        <div className="mt-3 flex gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-[0.66rem] font-medium text-paper">
            LP
          </span>
          <div>
            <p className="text-[0.78rem] font-medium text-ink">
              Capital partner
            </p>
            <p className="mt-1 text-[0.95rem] leading-relaxed text-graphite">
              “Before the Q3 LP letter — can your team refresh where we should
              be deploying in Chicago industrial? Same demographic and vacancy
              lens as last time.”
            </p>
          </div>
        </div>
      </div>

      {/* play control */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={play}
          disabled={playing}
          className="inline-flex items-center gap-2.5 bg-chicago px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-chicago-deep disabled:cursor-wait disabled:bg-slate"
        >
          {playing ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Watch them both…
            </>
          ) : done ? (
            "Play it again →"
          ) : (
            "Play both, side by side →"
          )}
        </button>
      </div>

      {/* the two worlds */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* BEFORE */}
        <div className="flex flex-col overflow-hidden rounded-sm border border-line bg-card">
          <div className="flex items-center justify-between border-b border-line bg-paper px-5 py-3">
            <div>
              <p className="mono text-[0.62rem] uppercase tracking-[0.14em] text-slate">
                Today · by hand
              </p>
              <p className="mt-0.5 text-[0.82rem] font-medium text-ink">
                An analyst builds it
              </p>
            </div>
            <div className="text-right">
              <p className="mono text-2xl tabular-nums text-star">
                {started ? `${leftDays} days` : "—"}
              </p>
              <p className="mono text-[0.6rem] uppercase tracking-[0.1em] text-mute">
                {leftBusy ? "and counting" : "of work"}
              </p>
            </div>
          </div>
          <ol className="flex-1 divide-y divide-line-soft">
            {BEFORE.map((s, i) => {
              const open = i < left;
              const cur = i === left - 1 && leftBusy;
              return (
                <li
                  key={i}
                  className={`flex items-start gap-3 px-5 py-3 transition-opacity ${
                    open ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[0.6rem] ${
                      open ? "bg-slate text-paper" : "bg-line-soft text-mute"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 text-[0.86rem] leading-snug text-graphite">
                    {s.t}
                  </span>
                  {open && (
                    <span className="mono shrink-0 text-[0.68rem] text-star">
                      +{s.d}d
                    </span>
                  )}
                  {cur && (
                    <span className="h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-star/40 border-t-star" />
                  )}
                </li>
              );
            })}
          </ol>
          <div className="border-t border-line px-5 py-3">
            <p className="text-[0.78rem] text-slate">
              {left >= BEFORE.length
                ? "…and by the time it ships, the data's three weeks old."
                : "Every step is an analyst's time."}
            </p>
          </div>
        </div>

        {/* AFTER */}
        <div className="flex flex-col overflow-hidden rounded-sm border-2 border-chicago bg-card">
          <div className="flex items-center justify-between border-b border-chicago/30 bg-chicago-wash px-5 py-3">
            <div>
              <p className="mono text-[0.62rem] uppercase tracking-[0.14em] text-chicago-deep">
                With Calumet · automatic
              </p>
              <p className="mt-0.5 text-[0.82rem] font-medium text-ink">
                The software builds it
              </p>
            </div>
            <div className="text-right">
              <p className="mono text-2xl tabular-nums text-good">
                {started ? fmtAfter(rightSecs) : "—"}
              </p>
              <p className="mono text-[0.6rem] uppercase tracking-[0.1em] text-mute">
                {rightDone ? "done" : "working"}
              </p>
            </div>
          </div>
          <ol className="flex-1 divide-y divide-line-soft">
            {AFTER.map((s, i) => {
              const open = i < right;
              return (
                <li
                  key={i}
                  className={`flex items-start gap-3 px-5 py-3 transition-opacity ${
                    open ? "rise opacity-100" : "opacity-30"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[0.6rem] ${
                      open ? "bg-good text-white" : "bg-line-soft text-mute"
                    }`}
                  >
                    {open ? "✓" : i + 1}
                  </span>
                  <span className="flex-1 text-[0.86rem] leading-snug text-graphite">
                    {s.t}
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="border-t border-chicago/30 bg-chicago-wash/50 px-5 py-3">
            <p className="text-[0.78rem] text-chicago-deep">
              {rightDone
                ? "Map shaded, submarkets ranked, memo drafted — and it's current."
                : "Same lens, every time. Nothing to format."}
            </p>
          </div>
        </div>
      </div>

      {/* the punchline */}
      <div
        className={`mt-6 overflow-hidden rounded-sm border border-ink bg-ink text-paper transition-opacity ${
          done ? "opacity-100" : "opacity-40"
        }`}
      >
        <div className="flex flex-col items-center gap-4 px-6 py-7 text-center sm:flex-row sm:justify-center sm:gap-8">
          <p className="font-display text-3xl text-star line-through decoration-2">
            ~3 weeks
          </p>
          <span className="text-mute">becomes</span>
          <p className="font-display text-5xl text-chicago">6 minutes</p>
        </div>
        <p className="border-t border-white/10 px-6 py-4 text-center text-[0.92rem] leading-relaxed text-paper/80">
          Same report your partners expect — the map, the ranking, the memo.{" "}
          <span className="text-paper">
            And you can run it again the morning of the meeting, not three weeks
            before.
          </span>
        </p>
      </div>
    </div>
  );
}
