"use client";

import { useState } from "react";
import { Star } from "./brand";
import {
  SUBMARKETS,
  METRICS,
  METRIC_ORDER,
  SCALE,
  THESIS,
  bucketFor,
  ranked,
  type MetricKey,
} from "@/lib/market";

function textOn(bucket: number) {
  return bucket === 0 || bucket === 4 ? "#ffffff" : "#14181d";
}

export function ChicagoReport() {
  const [metric, setMetric] = useState<MetricKey>("developScore");
  const meta = METRICS[metric];
  const order = ranked(metric);
  const topId = order[0].id;

  return (
    <div>
      {/* report header */}
      <div className="flex flex-col gap-3 rounded-t-sm border border-line bg-ink px-5 py-4 text-paper sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-star">
            <Star size={15} />
          </span>
          <div>
            <p className="font-display text-base leading-none">
              Where to deploy · Chicago industrial
            </p>
            <p className="mono mt-1 text-[0.64rem] uppercase tracking-[0.14em] text-mute">
              Prepared by Calumet · Q3 2026 · for capital partners
            </p>
          </div>
        </div>
        <span className="mono text-[0.62rem] text-mute">
          shade the map by ↓
        </span>
      </div>

      {/* metric toggle */}
      <div className="grid grid-cols-2 gap-px border-x border-line bg-line sm:grid-cols-4">
        {METRIC_ORDER.map((k) => {
          const active = k === metric;
          return (
            <button
              key={k}
              onClick={() => setMetric(k)}
              className={`px-3 py-3 text-left transition-colors ${
                active ? "bg-card" : "bg-paper hover:bg-card"
              }`}
            >
              <span
                className={`mono text-[0.6rem] uppercase tracking-[0.1em] ${
                  active ? "text-chicago-deep" : "text-mute"
                }`}
              >
                {active ? "showing" : "show"}
              </span>
              <span
                className={`mt-0.5 block text-[0.82rem] font-medium ${
                  active ? "text-ink" : "text-slate"
                }`}
              >
                {METRICS[k].label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-px border border-line bg-line lg:grid-cols-[1.35fr_1fr]">
        {/* MAP */}
        <div className="bg-card p-4 sm:p-6">
          <svg
            viewBox="0 0 640 560"
            className="h-auto w-full"
            role="img"
            aria-label={`Chicago industrial submarkets shaded by ${meta.label}`}
          >
            {/* Lake Michigan */}
            <path
              d="M640,0 L498,0 C470,70 470,185 474,262 C478,338 520,402 566,432 L640,446 Z"
              fill="#d8ecf6"
              stroke="#bcdcec"
              strokeWidth="1.5"
            />
            <text
              x="582"
              y="170"
              fill="#7fb4d4"
              fontSize="13"
              letterSpacing="3"
              transform="rotate(90 582 170)"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              LAKE MICHIGAN
            </text>

            {/* submarket tiles */}
            {SUBMARKETS.map((s) => {
              const b = bucketFor(s, metric);
              const fill = SCALE[b];
              const tc = textOn(b);
              const isTop = s.id === topId;
              return (
                <g key={s.id}>
                  <rect
                    x={s.x}
                    y={s.y}
                    width={s.w}
                    height={s.h}
                    rx="5"
                    fill={fill}
                    stroke={isTop ? "#14181d" : "#ffffff"}
                    strokeWidth={isTop ? 2.5 : 1.5}
                    style={{ transition: "fill .45s ease" }}
                  />
                  <text
                    x={s.x + 10}
                    y={s.y + 22}
                    fill={tc}
                    fontSize="12.5"
                    fontWeight="600"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {s.short}
                  </text>
                  <text
                    x={s.x + 10}
                    y={s.y + s.h - 12}
                    fill={tc}
                    fontSize="17"
                    fontWeight="600"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {meta.fmt(s[metric])}
                  </text>
                  {isTop && (
                    <g
                      transform={`translate(${s.x + s.w - 22}, ${s.y + 9})`}
                      style={{ color: "#ffffff" }}
                    >
                      <Star size={13} />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* legend */}
          <div className="mt-2 flex items-center justify-between gap-4">
            <span className="mono text-[0.66rem] text-slate">
              avoid
            </span>
            <div className="flex h-2.5 flex-1 overflow-hidden rounded-full">
              {SCALE.map((c) => (
                <span key={c} className="flex-1" style={{ background: c }} />
              ))}
            </div>
            <span className="mono text-[0.66rem] text-good">build here</span>
          </div>
          <p className="mt-2 text-[0.78rem] leading-relaxed text-slate">
            {meta.blurb}
          </p>
        </div>

        {/* RANKING + THESIS */}
        <div className="flex flex-col bg-card">
          <div className="border-b border-line p-5">
            <p className="eyebrow">Ranked · {meta.short}</p>
            <ol className="mt-3 space-y-1.5">
              {order.map((s, i) => {
                const b = bucketFor(s, metric);
                return (
                  <li
                    key={s.id}
                    className="flex items-center gap-3 rounded-sm px-2 py-1.5 hover:bg-paper"
                  >
                    <span className="mono w-5 text-[0.72rem] text-mute">
                      {i + 1}
                    </span>
                    <span
                      className="h-3 w-3 shrink-0 rounded-sm"
                      style={{ background: SCALE[b], transition: "background .45s" }}
                    />
                    <span className="flex-1 text-[0.84rem] text-ink">
                      {s.name}
                    </span>
                    {s.id === topId && (
                      <span className="text-star">
                        <Star size={10} />
                      </span>
                    )}
                    <span className="mono text-[0.8rem] tabular-nums text-graphite">
                      {meta.fmt(s[metric])}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="flex-1 p-5">
            <p className="eyebrow">The read · for the LP letter</p>
            <div className="mt-3 space-y-2.5 text-[0.86rem] leading-relaxed text-slate">
              {THESIS[metric].map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-b-sm border border-t-0 border-line bg-paper px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="mono text-[0.66rem] text-mute">
          Sources: Census ACS · CoStar · county assessor — illustrative demo data
        </p>
        <p className="mono text-[0.66rem] text-chicago-deep">
          Generated in 6 min · refreshable any time
        </p>
      </div>
    </div>
  );
}
