/* ============================================================
   The site-selection model. Raw factors per Chicago-metro county
   go in; the user weights them; a score comes out and shades the
   map. This is the analyst's judgment, made explicit and instant.
   Data is illustrative but shaped to the real market (the SW
   logistics corridors and cheap-land exurbs run hot; the urban
   core and NW Indiana lag).
   ============================================================ */

export type FactorKey =
  | "rentGrowth"
  | "popGrowth"
  | "vacancy"
  | "intermodal"
  | "landCost";

export type County = {
  fips: string;
  name: string;
  sub: string; // the industrial submarket it reads as
  rentGrowth: number; // % YoY asking rent
  popGrowth: number; // % 5-yr trade area
  vacancy: number; // %
  intermodal: number; // 0–100 highway/rail/port access
  landCost: number; // index, 100 = priciest
};

export const COUNTIES: County[] = [
  { fips: "17197", name: "Will", sub: "I-55 / I-80 · Joliet–Elwood", rentGrowth: 11.0, popGrowth: 6.5, vacancy: 4.0, intermodal: 98, landCost: 35 },
  { fips: "17063", name: "Grundy", sub: "I-80 logistics edge", rentGrowth: 9.5, popGrowth: 4.0, vacancy: 5.0, intermodal: 82, landCost: 28 },
  { fips: "55059", name: "Kenosha", sub: "Pleasant Prairie · WI line", rentGrowth: 8.5, popGrowth: 5.0, vacancy: 4.6, intermodal: 72, landCost: 38 },
  { fips: "17037", name: "DeKalb", sub: "I-88 mega-box corridor", rentGrowth: 8.0, popGrowth: 2.2, vacancy: 6.0, intermodal: 50, landCost: 25 },
  { fips: "17089", name: "Kane", sub: "Fox Valley · Aurora", rentGrowth: 7.9, popGrowth: 3.6, vacancy: 5.8, intermodal: 60, landCost: 48 },
  { fips: "17043", name: "DuPage", sub: "I-88 · near O'Hare", rentGrowth: 7.2, popGrowth: 1.8, vacancy: 6.1, intermodal: 80, landCost: 70 },
  { fips: "17093", name: "Kendall", sub: "Far SW growth ring", rentGrowth: 7.0, popGrowth: 7.2, vacancy: 6.5, intermodal: 45, landCost: 32 },
  { fips: "17097", name: "Lake", sub: "North suburbs", rentGrowth: 6.1, popGrowth: 1.1, vacancy: 7.0, intermodal: 55, landCost: 62 },
  { fips: "17031", name: "Cook", sub: "O'Hare + South Suburbs", rentGrowth: 6.0, popGrowth: -0.3, vacancy: 8.0, intermodal: 88, landCost: 85 },
  { fips: "17111", name: "McHenry", sub: "Far NW exurbs", rentGrowth: 5.2, popGrowth: 0.6, vacancy: 7.6, intermodal: 38, landCost: 44 },
  { fips: "18127", name: "Porter", sub: "NW Indiana · east", rentGrowth: 5.0, popGrowth: 0.4, vacancy: 8.2, intermodal: 58, landCost: 36 },
  { fips: "18089", name: "Lake (IN)", sub: "NW Indiana · Hammond–Gary", rentGrowth: 4.6, popGrowth: -0.8, vacancy: 9.1, intermodal: 66, landCost: 40 },
];

export const FACTORS: {
  key: FactorKey;
  label: string;
  hint: string;
  higherIsBetter: boolean;
  unit: string;
  decimals: number;
  defaultWeight: number;
}[] = [
  { key: "intermodal", label: "Highway & intermodal access", hint: "Interstates, Class-I rail, inland ports", higherIsBetter: true, unit: "", decimals: 0, defaultWeight: 85 },
  { key: "rentGrowth", label: "Rent growth", hint: "Asking-rent change, YoY", higherIsBetter: true, unit: "%", decimals: 1, defaultWeight: 70 },
  { key: "vacancy", label: "Low vacancy", hint: "Tighter space = pricing power", higherIsBetter: false, unit: "%", decimals: 1, defaultWeight: 60 },
  { key: "popGrowth", label: "Population growth", hint: "5-yr trade-area change", higherIsBetter: true, unit: "%", decimals: 1, defaultWeight: 55 },
  { key: "landCost", label: "Low land cost", hint: "Cheaper basis to develop", higherIsBetter: false, unit: "", decimals: 0, defaultWeight: 45 },
];

export type Weights = Record<FactorKey, number>;

export const DEFAULT_WEIGHTS: Weights = Object.fromEntries(
  FACTORS.map((f) => [f.key, f.defaultWeight]),
) as Weights;

export type Preset = { id: string; label: string; blurb: string; weights: Weights };

export const PRESETS: Preset[] = [
  {
    id: "balanced",
    label: "Balanced thesis",
    blurb: "Our default weighting across all five factors.",
    weights: DEFAULT_WEIGHTS,
  },
  {
    id: "logistics",
    label: "Logistics & intermodal",
    blurb: "Big-box distribution: access and rent growth win.",
    weights: { intermodal: 100, rentGrowth: 85, vacancy: 55, popGrowth: 35, landCost: 40 },
  },
  {
    id: "value",
    label: "Lowest cost basis",
    blurb: "Value-add: cheap land and room to grow.",
    weights: { intermodal: 55, rentGrowth: 45, vacancy: 50, popGrowth: 60, landCost: 100 },
  },
  {
    id: "population",
    label: "Follow the rooftops",
    blurb: "Last-mile: chase population and demand.",
    weights: { intermodal: 60, rentGrowth: 55, vacancy: 55, popGrowth: 100, landCost: 45 },
  },
];

// normalize one factor to 0..1 in the "good" direction
function norm(key: FactorKey): Map<string, number> {
  const f = FACTORS.find((x) => x.key === key)!;
  const vals = COUNTIES.map((c) => c[key]);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const m = new Map<string, number>();
  for (const c of COUNTIES) {
    let n = (c[key] - min) / span;
    if (!f.higherIsBetter) n = 1 - n;
    m.set(c.fips, n);
  }
  return m;
}

const NORMS = Object.fromEntries(
  FACTORS.map((f) => [f.key, norm(f.key)]),
) as Record<FactorKey, Map<string, number>>;

export type Scored = County & { score: number; contrib: Record<FactorKey, number> };

export function scoreAll(weights: Weights): Scored[] {
  const wsum = FACTORS.reduce((a, f) => a + (weights[f.key] || 0), 0) || 1;
  const out = COUNTIES.map((c) => {
    let s = 0;
    const contrib = {} as Record<FactorKey, number>;
    for (const f of FACTORS) {
      const n = NORMS[f.key].get(c.fips)!;
      const w = weights[f.key] || 0;
      const part = (n * w) / wsum;
      contrib[f.key] = part * 100;
      s += part;
    }
    return { ...c, score: Math.round(s * 100), contrib };
  });
  return out.sort((a, b) => b.score - a.score);
}

// ---- color ramp (viridis) ----
const VIRIDIS = [
  "#440154", "#46327e", "#365c8d", "#277f8e",
  "#1fa187", "#4ac16d", "#a0da39", "#fde725",
];

function lerp(a: string, b: string, t: number) {
  const ah = a.slice(1), bh = b.slice(1);
  const ar = parseInt(ah.slice(0, 2), 16), ag = parseInt(ah.slice(2, 4), 16), ab = parseInt(ah.slice(4, 6), 16);
  const br = parseInt(bh.slice(0, 2), 16), bg = parseInt(bh.slice(2, 4), 16), bb = parseInt(bh.slice(4, 6), 16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

// map score (0..100, relative to current range) to a viridis color
export function colorFor(score: number, min: number, max: number) {
  const t = max > min ? (score - min) / (max - min) : 0.5;
  const x = Math.max(0, Math.min(1, t)) * (VIRIDIS.length - 1);
  const i = Math.floor(x);
  if (i >= VIRIDIS.length - 1) return VIRIDIS[VIRIDIS.length - 1];
  return lerp(VIRIDIS[i], VIRIDIS[i + 1], x - i);
}

export const VIRIDIS_CSS = `linear-gradient(90deg, ${VIRIDIS.join(", ")})`;

export function memo(scored: Scored[], weights: Weights): string[] {
  const top = scored.slice(0, 3);
  const bottom = scored[scored.length - 1];
  const lead = FACTORS.slice().sort((a, b) => weights[b.key] - weights[a.key])[0];
  const fmt = (c: County, k: FactorKey) => {
    const f = FACTORS.find((x) => x.key === k)!;
    return `${c[k].toFixed(f.decimals)}${f.unit}`;
  };
  return [
    `With ${lead.label.toLowerCase()} weighted highest, the model puts ${top[0].name} County (${top[0].sub}) on top at ${top[0].score}/100 — ${fmt(top[0], "intermodal")} access, rents up ${fmt(top[0], "rentGrowth")}, and vacancy at ${fmt(top[0], "vacancy")}.`,
    `${top[1].name} and ${top[2].name} round out the build list. Each clears the thesis on the factors you've prioritized.`,
    `It rates ${bottom.name} lowest at ${bottom.score}/100 — vacancy near ${fmt(bottom, "vacancy")} and population ${bottom.popGrowth < 0 ? "contracting" : "flat"}. Capital is better deployed in the southwest corridors.`,
  ];
}
