"use client";

import { useMemo, useState } from "react";
import { Star } from "./brand";
import { COUNTY_SHAPES, GEO_W, GEO_H } from "@/lib/chicago-geo";
import {
  PROPERTIES,
  STRATEGIES,
  DEFAULT_BUYBOX,
  findDeals,
  type BuyBox,
  type PropType,
  type Strategy,
} from "@/lib/deals";

const TYPES: (PropType | "Any")[] = ["Any", "Office", "Industrial", "Flex", "Land", "Retail"];

// deterministic pin placement: centroid + spiral offset per county
const PIN_POS = (() => {
  const byFips: Record<string, number> = {};
  const pos: Record<string, { x: number; y: number }> = {};
  for (const p of PROPERTIES) {
    const sh = COUNTY_SHAPES.find((s) => s.fips === p.fips)!;
    const n = (byFips[p.fips] = (byFips[p.fips] ?? 0) + 1) - 1;
    const ang = n * 2.3;
    const rad = n === 0 ? 0 : 16 + n * 9;
    pos[p.id] = { x: sh.cx + Math.cos(ang) * rad, y: sh.cy + Math.sin(ang) * rad };
  }
  return pos;
})();

function Toggle({
  on,
  set,
  label,
}: {
  on: boolean;
  set: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      onClick={() => set(!on)}
      className="flex w-full items-center justify-between gap-2 text-left"
    >
      <span className="text-[0.76rem] text-night-text">{label}</span>
      <span
        className={`relative h-4 w-7 shrink-0 rounded-full transition-colors ${
          on ? "bg-cyan" : "bg-night-3"
        }`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${
            on ? "left-3.5" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export function DealFinder() {
  const [bb, setBb] = useState<BuyBox>(DEFAULT_BUYBOX);
  const [hover, setHover] = useState<string | null>(null);
  const matches = useMemo(() => findDeals(bb), [bb]);
  const matchIds = new Set(matches.map((m) => m.id));
  const set = <K extends keyof BuyBox>(k: K, v: BuyBox[K]) =>
    setBb((b) => ({ ...b, [k]: v }));

  return (
    <div className="overflow-hidden rounded-lg border border-night-line bg-night text-night-text shadow-[0_40px_120px_-40px_rgba(8,12,16,0.8)]">
      <div className="flex flex-col gap-3 border-b border-night-line px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-cyan">
            <Star size={16} />
          </span>
          <div>
            <p className="font-display text-base leading-none text-white">
              Deal Finder · Chicago industrial & office
            </p>
            <p className="mono mt-1 text-[0.62rem] uppercase tracking-[0.16em] text-night-mute">
              describe the buy box · it screens the market
            </p>
          </div>
        </div>
        <span className="mono rounded-sm border border-cyan/40 px-2.5 py-1 text-[0.66rem] text-cyan">
          {matches.length} of {PROPERTIES.length} fit
        </span>
      </div>

      <div className="grid gap-px bg-night-line lg:grid-cols-[260px_minmax(0,1fr)_310px]">
        {/* BUY BOX */}
        <div className="space-y-5 bg-night px-5 py-6">
          <div>
            <p className="mono text-[0.62rem] uppercase tracking-[0.16em] text-night-mute">
              Property type
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => set("type", t)}
                  className={`rounded-sm border px-2 py-1 text-[0.72rem] transition-colors ${
                    bb.type === t
                      ? "border-cyan bg-cyan/10 text-white"
                      : "border-night-line text-night-mute hover:text-night-text"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mono text-[0.62rem] uppercase tracking-[0.16em] text-night-mute">
              Strategy
            </p>
            <div className="mt-2.5 space-y-1.5">
              {STRATEGIES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => set("strategy", s.id as Strategy)}
                  className={`block w-full rounded-sm border px-2.5 py-1.5 text-left transition-colors ${
                    bb.strategy === s.id
                      ? "border-cyan bg-cyan/10"
                      : "border-night-line hover:border-night-mute"
                  }`}
                >
                  <span
                    className={`text-[0.74rem] font-medium ${
                      bb.strategy === s.id ? "text-white" : "text-night-text"
                    }`}
                  >
                    {s.label}
                  </span>
                  <span className="block text-[0.64rem] text-night-mute">
                    {s.blurb}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-[0.76rem] text-night-text">Max price</span>
              <span className="mono text-[0.72rem] text-cyan">
                ${bb.maxPricePerSF}/SF
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              step={1}
              value={bb.maxPricePerSF}
              onChange={(e) => set("maxPricePerSF", +e.target.value)}
              className="mt-1.5 w-full accent-cyan"
            />
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-[0.76rem] text-night-text">Min size</span>
              <span className="mono text-[0.72rem] text-cyan">
                {(bb.minSizeSF / 1000).toFixed(0)}k SF
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={300000}
              step={5000}
              value={bb.minSizeSF}
              onChange={(e) => set("minSizeSF", +e.target.value)}
              className="mt-1.5 w-full accent-cyan"
            />
          </div>

          <div className="space-y-2.5 border-t border-night-line pt-4">
            <Toggle on={bb.distressedOnly} set={(v) => set("distressedOnly", v)} label="Distressed (>20% vacant)" />
            <Toggle on={bb.nearIndustrialOnly} set={(v) => set("nearIndustrialOnly", v)} label="Near existing industrial" />
            <Toggle on={bb.redevZoningOnly} set={(v) => set("redevZoningOnly", v)} label="Industrial-friendly zoning" />
          </div>
        </div>

        {/* MAP */}
        <div className="bg-night-2 px-4 py-5 sm:px-6">
          <svg viewBox={`0 0 ${GEO_W} ${GEO_H}`} className="h-auto w-full">
            <text
              x={GEO_W * 0.82} y={GEO_H * 0.3} fill="#2f4a5a" fontSize="22"
              letterSpacing="5" transform={`rotate(90 ${GEO_W * 0.82} ${GEO_H * 0.3})`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              LAKE MICHIGAN
            </text>
            {COUNTY_SHAPES.map((sh) => (
              <path key={sh.fips} d={sh.d} fill="#172029" stroke="#0b1015" strokeWidth={1.2} />
            ))}
            {PROPERTIES.map((p) => {
              const on = matchIds.has(p.id);
              const isHover = hover === p.id;
              const { x, y } = PIN_POS[p.id];
              const r = on ? 8 + (matches.find((m) => m.id === p.id)!.fit - 55) / 9 : 4;
              return (
                <circle
                  key={p.id}
                  cx={x}
                  cy={y}
                  r={isHover ? r + 3 : r}
                  fill={on ? "#4cc9f0" : "#39454f"}
                  fillOpacity={on ? 0.92 : 0.4}
                  stroke={isHover ? "#fff" : on ? "#0b1015" : "none"}
                  strokeWidth={1.5}
                  style={{ transition: "all .3s", cursor: on ? "pointer" : "default" }}
                  onMouseEnter={() => on && setHover(p.id)}
                  onMouseLeave={() => setHover(null)}
                />
              );
            })}
          </svg>
          <p className="mono mt-1 text-center text-[0.66rem] text-night-mute">
            bright pins match your buy box · tighten the filters and watch them
            drop off
          </p>
        </div>

        {/* MATCHES */}
        <div className="flex max-h-[560px] flex-col overflow-y-auto bg-night">
          <div className="sticky top-0 border-b border-night-line bg-night px-5 py-3">
            <p className="mono text-[0.62rem] uppercase tracking-[0.16em] text-night-mute">
              Candidates · best fit first
            </p>
          </div>
          {matches.length === 0 && (
            <p className="px-5 py-6 text-[0.82rem] text-night-mute">
              Nothing clears that buy box. Loosen a filter — drop a toggle or
              lift the price ceiling.
            </p>
          )}
          <ul className="divide-y divide-night-line">
            {matches.map((m, i) => (
              <li
                key={m.id}
                onMouseEnter={() => setHover(m.id)}
                onMouseLeave={() => setHover(null)}
                className={`px-5 py-3.5 transition-colors ${
                  hover === m.id ? "bg-night-3" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[0.84rem] font-medium text-white">
                      {i === 0 && <span className="text-cyan"><Star size={10} /></span>}
                      {m.address}
                    </p>
                    <p className="mono text-[0.64rem] uppercase tracking-[0.08em] text-night-mute">
                      {m.city} · {m.type} · {m.sizeLabel} · {m.priceLabel}
                    </p>
                  </div>
                  <span className="mono shrink-0 rounded-sm bg-cyan/10 px-1.5 py-0.5 text-[0.72rem] text-cyan">
                    {m.fit}
                  </span>
                </div>
                <ul className="mt-2 space-y-1">
                  {m.reasons.map((r, k) => (
                    <li key={k} className="flex gap-1.5 text-[0.74rem] text-night-text/85">
                      <span className="text-good">✓</span>
                      {r}
                    </li>
                  ))}
                </ul>
                <p className="mt-1.5 text-[0.72rem] leading-snug text-night-mute">
                  {m.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-night-line px-6 py-3">
        <p className="mono text-[0.62rem] text-night-mute">
          County geography is real · listings are sample stand-ins for CoStar +
          assessor + zoning records
        </p>
      </div>
    </div>
  );
}
