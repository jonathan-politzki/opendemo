"use client";

import { useMemo, useState } from "react";
import { Star } from "./brand";
import { COUNTY_SHAPES, GEO_W, GEO_H } from "@/lib/chicago-geo";
import {
  COUNTIES,
  FACTORS,
  PRESETS,
  DEFAULT_WEIGHTS,
  scoreAll,
  colorFor,
  memo,
  VIRIDIS_CSS,
  type FactorKey,
  type Weights,
} from "@/lib/engine";

const SOURCES = ["Census ACS", "CoStar", "County parcels", "INRIX traffic", "FRA rail"];

// normalized 0..1 (good direction) for one county's factor — for the bars
function frac(fips: string, key: FactorKey) {
  const f = FACTORS.find((x) => x.key === key)!;
  const vals = COUNTIES.map((c) => c[key]);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const c = COUNTIES.find((x) => x.fips === fips)!;
  let n = (c[key] - min) / (max - min || 1);
  if (!f.higherIsBetter) n = 1 - n;
  return n;
}

export function SiteEngine() {
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  const [preset, setPreset] = useState<string | null>("balanced");
  const [hover, setHover] = useState<string | null>(null);

  const scored = useMemo(() => scoreAll(weights), [weights]);
  const byFips = useMemo(
    () => Object.fromEntries(scored.map((s) => [s.fips, s])),
    [scored],
  );
  const min = scored[scored.length - 1].score;
  const max = scored[0].score;
  const focus = (hover && byFips[hover]) || scored[0];
  const memoLines = useMemo(() => memo(scored, weights), [scored, weights]);

  function setW(key: FactorKey, v: number) {
    setWeights((w) => ({ ...w, [key]: v }));
    setPreset(null);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-night-line bg-night text-night-text shadow-[0_40px_120px_-40px_rgba(8,12,16,0.8)]">
      {/* header */}
      <div className="flex flex-col gap-3 border-b border-night-line px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-cyan">
            <Star size={16} />
          </span>
          <div>
            <p className="font-display text-base leading-none text-white">
              Site-Selection Model · Chicago industrial
            </p>
            <p className="mono mt-1 text-[0.62rem] uppercase tracking-[0.16em] text-night-mute">
              live · 12 counties scored on every change
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SOURCES.map((s) => (
            <span
              key={s}
              className="mono rounded-sm border border-night-line px-2 py-1 text-[0.6rem] uppercase tracking-[0.08em] text-night-mute"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-px bg-night-line lg:grid-cols-[270px_minmax(0,1fr)_300px]">
        {/* ---- CONTROLS ---- */}
        <div className="space-y-6 bg-night px-5 py-6">
          <div>
            <p className="mono text-[0.62rem] uppercase tracking-[0.16em] text-night-mute">
              Pick a thesis
            </p>
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              {PRESETS.map((p) => {
                const on = preset === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setWeights(p.weights);
                      setPreset(p.id);
                    }}
                    className={`rounded-sm border px-2.5 py-2 text-left text-[0.72rem] font-medium transition-colors ${
                      on
                        ? "border-cyan bg-cyan/10 text-white"
                        : "border-night-line text-night-mute hover:border-night-mute hover:text-night-text"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[0.72rem] leading-snug text-night-mute">
              {PRESETS.find((p) => p.id === preset)?.blurb ??
                "Custom weighting — you're driving the model."}
            </p>
          </div>

          <div>
            <p className="mono text-[0.62rem] uppercase tracking-[0.16em] text-night-mute">
              …or weight the factors yourself
            </p>
            <div className="mt-4 space-y-4">
              {FACTORS.map((f) => (
                <div key={f.key}>
                  <div className="flex items-baseline justify-between">
                    <label
                      htmlFor={`w-${f.key}`}
                      className="text-[0.78rem] font-medium text-night-text"
                    >
                      {f.label}
                    </label>
                    <span className="mono text-[0.72rem] text-cyan">
                      {weights[f.key]}
                    </span>
                  </div>
                  <input
                    id={`w-${f.key}`}
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={weights[f.key]}
                    onChange={(e) => setW(f.key, Number(e.target.value))}
                    className="mt-1.5 w-full accent-cyan"
                  />
                  <p className="text-[0.66rem] text-night-mute">{f.hint}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setWeights(DEFAULT_WEIGHTS);
                setPreset("balanced");
              }}
              className="mono mt-4 text-[0.66rem] uppercase tracking-[0.1em] text-night-mute hover:text-cyan"
            >
              ↺ reset weighting
            </button>
          </div>
        </div>

        {/* ---- MAP ---- */}
        <div className="bg-night-2 px-4 py-5 sm:px-6">
          <svg
            viewBox={`0 0 ${GEO_W} ${GEO_H}`}
            className="h-auto w-full"
            role="img"
            aria-label="Chicago metro counties shaded by site-selection score"
          >
            <text
              x={GEO_W * 0.82}
              y={GEO_H * 0.3}
              fill="#2f4a5a"
              fontSize="22"
              letterSpacing="5"
              transform={`rotate(90 ${GEO_W * 0.82} ${GEO_H * 0.3})`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              LAKE MICHIGAN
            </text>
            {COUNTY_SHAPES.map((sh) => {
              const s = byFips[sh.fips];
              const t = max > min ? (s.score - min) / (max - min) : 0.5;
              const isHover = hover === sh.fips;
              const labelDark = t > 0.55;
              return (
                <g key={sh.fips}>
                  <path
                    d={sh.d}
                    fill={colorFor(s.score, min, max)}
                    stroke={isHover ? "#4cc9f0" : "#0b1015"}
                    strokeWidth={isHover ? 3 : 1.2}
                    style={{ transition: "fill .5s ease", cursor: "pointer" }}
                    onMouseEnter={() => setHover(sh.fips)}
                    onMouseLeave={() => setHover(null)}
                  />
                  <text
                    x={sh.cx}
                    y={sh.cy - 4}
                    textAnchor="middle"
                    pointerEvents="none"
                    fill={labelDark ? "#0b1015" : "#eef4f8"}
                    fontSize="15"
                    fontWeight="600"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {sh.name}
                  </text>
                  <text
                    x={sh.cx}
                    y={sh.cy + 15}
                    textAnchor="middle"
                    pointerEvents="none"
                    fill={labelDark ? "#0b1015" : "#9fb3c0"}
                    fontSize="15"
                    fontWeight="600"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {s.score}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* legend */}
          <div className="mt-2 flex items-center gap-3">
            <span className="mono text-[0.64rem] text-night-mute">lower fit</span>
            <div
              className="h-2.5 flex-1 rounded-full"
              style={{ background: VIRIDIS_CSS }}
            />
            <span className="mono text-[0.64rem] text-cyan">build here</span>
          </div>

          {/* inspector strip */}
          <div className="mt-4 rounded-sm border border-night-line bg-night px-4 py-3">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="font-display text-lg leading-none text-white">
                  {focus.name} County
                </p>
                <p className="mono mt-1 text-[0.64rem] uppercase tracking-[0.1em] text-night-mute">
                  {focus.sub}
                </p>
              </div>
              <p className="mono text-2xl text-cyan">
                {focus.score}
                <span className="text-sm text-night-mute">/100</span>
              </p>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-5">
              {FACTORS.map((f) => {
                const fr = frac(focus.fips, f.key);
                return (
                  <div key={f.key}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[0.64rem] text-night-mute">
                        {f.label.replace("Low ", "")}
                      </span>
                      <span className="mono text-[0.66rem] text-night-text">
                        {(focus[f.key] as number).toFixed(f.decimals)}
                        {f.unit}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-night-3">
                      <div
                        className="h-full rounded-full bg-cyan"
                        style={{ width: `${Math.round(fr * 100)}%`, transition: "width .4s" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[0.66rem] text-night-mute">
              Hover any county to read the data underneath its color.
            </p>
          </div>
        </div>

        {/* ---- OUTPUT ---- */}
        <div className="flex flex-col bg-night">
          <div className="border-b border-night-line px-5 py-5">
            <p className="mono text-[0.62rem] uppercase tracking-[0.16em] text-night-mute">
              Ranked · build list
            </p>
            <ol className="mt-3 space-y-0.5">
              {scored.map((s, i) => (
                <li
                  key={s.fips}
                  onMouseEnter={() => setHover(s.fips)}
                  onMouseLeave={() => setHover(null)}
                  className={`flex items-center gap-2.5 rounded-sm px-2 py-1.5 transition-colors ${
                    hover === s.fips ? "bg-night-3" : ""
                  }`}
                >
                  <span className="mono w-4 text-[0.7rem] text-night-mute">
                    {i + 1}
                  </span>
                  <span
                    className="h-3 w-3 shrink-0 rounded-sm"
                    style={{ background: colorFor(s.score, min, max) }}
                  />
                  <span className="flex-1 text-[0.8rem] text-night-text">
                    {s.name}
                  </span>
                  {i === 0 && (
                    <span className="text-cyan">
                      <Star size={10} />
                    </span>
                  )}
                  <span className="mono text-[0.78rem] tabular-nums text-white">
                    {s.score}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex-1 px-5 py-5">
            <p className="mono text-[0.62rem] uppercase tracking-[0.16em] text-night-mute">
              The read · drafted for the LP letter
            </p>
            <div className="mt-3 space-y-2.5 text-[0.82rem] leading-relaxed text-night-text/85">
              {memoLines.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <div className="border-t border-night-line px-5 py-3">
            <p className="mono text-[0.62rem] text-night-mute">
              Regenerated live · illustrative data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
