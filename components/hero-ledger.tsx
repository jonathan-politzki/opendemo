"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "./brand";

const FEED = [
  { task: "Abstracted 14-page office lease", who: "Commercial RE", min: 38 },
  { task: "Coded + routed 62 AP invoices", who: "Property mgmt", min: 51 },
  { task: "Researched account + found buyer", who: "B2B services", min: 27 },
  { task: "Reconciled tenant ledger", who: "Multifamily", min: 44 },
  { task: "Drafted 9 renewal notices", who: "Property mgmt", min: 33 },
  { task: "Cleared COI exceptions", who: "Insurance BPO", min: 22 },
  { task: "Built 40-name call list", who: "Brokerage", min: 31 },
  { task: "Keyed 130 order lines", who: "Distribution", min: 58 },
  { task: "Matched 88 remittances", who: "Healthcare BPO", min: 47 },
];

export function HeroLedger() {
  const [items, setItems] = useState(() => FEED.slice(0, 4));
  const [mins, setMins] = useState(391);
  const cursor = useRef(4);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setItems(FEED.slice(0, 5));
      return;
    }
    const id = setInterval(() => {
      const next = FEED[cursor.current % FEED.length];
      cursor.current += 1;
      setItems((prev) => [next, ...prev].slice(0, 5));
      setMins((m) => m + next.min);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="overflow-hidden rounded-sm border border-line bg-card shadow-[0_24px_60px_-32px_rgba(20,24,29,0.45)]">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-good/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-good" />
          </span>
          <span className="eyebrow">Operations ledger · live</span>
        </div>
        <span className="mono text-[0.66rem] text-mute">CALUMET · ORD</span>
      </div>

      <ul className="divide-y divide-line-soft">
        {items.map((it, i) => (
          <li
            key={`${it.task}-${i}`}
            className={`flex items-center gap-3 px-4 py-3 ${i === 0 ? "rise" : ""}`}
          >
            <span className="text-star">
              <Star size={13} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.86rem] text-ink">{it.task}</p>
              <p className="mono text-[0.66rem] uppercase tracking-[0.1em] text-mute">
                {it.who}
              </p>
            </div>
            <span className="mono shrink-0 text-[0.78rem] text-good">
              −{it.min}m
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-end justify-between border-t border-line bg-ink px-4 py-4 text-paper">
        <div>
          <p className="eyebrow text-mute">Staff-hours reclaimed · this week</p>
          <p className="mono mt-1 text-3xl font-medium tabular-nums">
            {(mins / 60).toLocaleString("en-US", { maximumFractionDigits: 1 })}
            <span className="ml-1 text-base text-mute">hrs</span>
          </p>
        </div>
        <div className="text-right">
          <p className="eyebrow text-mute">Desks freed</p>
          <p className="mono mt-1 text-3xl font-medium tabular-nums">11</p>
        </div>
      </div>
    </div>
  );
}
