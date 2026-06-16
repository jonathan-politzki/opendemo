/* ============================================================
   Chicago industrial submarkets — the data behind the report.
   Mocked but realistic: SW logistics corridors run hot,
   the South Suburbs and NW Indiana lag. Geometry is a stylized
   metro layout (Lake Michigan on the east).
   ============================================================ */

export type Submarket = {
  id: string;
  name: string;
  short: string;
  // svg placement (viewBox 0 0 640 560)
  x: number;
  y: number;
  w: number;
  h: number;
  developScore: number; // composite 0–100
  vacancy: number; // %
  rentGrowth: number; // % YoY
  popGrowth: number; // % trade-area, 5-yr
};

export const SUBMARKETS: Submarket[] = [
  { id: "i55", name: "I-55 Corridor", short: "I-55", x: 232, y: 348, w: 122, h: 66, developScore: 92, vacancy: 3.8, rentGrowth: 11.2, popGrowth: 4.1 },
  { id: "ohare", name: "O'Hare", short: "O'Hare", x: 252, y: 188, w: 112, h: 64, developScore: 88, vacancy: 4.1, rentGrowth: 9.6, popGrowth: 2.2 },
  { id: "joliet", name: "Joliet / I-80", short: "Joliet", x: 86, y: 356, w: 120, h: 76, developScore: 84, vacancy: 5.2, rentGrowth: 10.1, popGrowth: 6.8 },
  { id: "kenosha", name: "Kenosha / Pleasant Prairie", short: "Kenosha", x: 228, y: 24, w: 132, h: 64, developScore: 80, vacancy: 4.6, rentGrowth: 8.4, popGrowth: 5.2 },
  { id: "foxvalley", name: "Fox Valley / Aurora", short: "Fox Valley", x: 56, y: 196, w: 120, h: 78, developScore: 71, vacancy: 5.8, rentGrowth: 7.9, popGrowth: 3.6 },
  { id: "dupage", name: "DuPage / I-88", short: "DuPage", x: 180, y: 268, w: 118, h: 60, developScore: 74, vacancy: 6.1, rentGrowth: 7.2, popGrowth: 1.8 },
  { id: "lakeco", name: "Lake County", short: "Lake Co.", x: 236, y: 104, w: 124, h: 62, developScore: 66, vacancy: 7.0, rentGrowth: 6.1, popGrowth: 1.1 },
  { id: "central", name: "Central / Infill", short: "Central", x: 380, y: 250, w: 86, h: 86, developScore: 58, vacancy: 8.2, rentGrowth: 5.0, popGrowth: -0.4 },
  { id: "nwindiana", name: "Northwest Indiana", short: "NW Indiana", x: 372, y: 458, w: 150, h: 62, developScore: 52, vacancy: 9.1, rentGrowth: 4.6, popGrowth: -0.8 },
  { id: "southsub", name: "South Suburbs", short: "South Sub.", x: 332, y: 366, w: 122, h: 66, developScore: 41, vacancy: 11.3, rentGrowth: 3.1, popGrowth: -2.4 },
];

export type MetricKey = "developScore" | "vacancy" | "rentGrowth" | "popGrowth";

export const METRICS: Record<
  MetricKey,
  {
    label: string;
    short: string;
    higherIsBetter: boolean;
    fmt: (v: number) => string;
    blurb: string;
  }
> = {
  developScore: {
    label: "Where to build",
    short: "Develop score",
    higherIsBetter: true,
    fmt: (v) => `${v}`,
    blurb:
      "A blended score across vacancy, rent growth, population, and supply. Greenest is where the thesis is strongest.",
  },
  vacancy: {
    label: "Vacancy",
    short: "Vacancy",
    higherIsBetter: false,
    fmt: (v) => `${v.toFixed(1)}%`,
    blurb:
      "Tighter is better for an owner. Green submarkets have little available space; red is overbuilt.",
  },
  rentGrowth: {
    label: "Rent growth",
    short: "Rent growth",
    higherIsBetter: true,
    fmt: (v) => `${v.toFixed(1)}%`,
    blurb:
      "Year-over-year asking-rent growth. Green is pricing power; red is flat or softening.",
  },
  popGrowth: {
    label: "Population growth",
    short: "Population",
    higherIsBetter: true,
    fmt: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`,
    blurb:
      "Five-year trade-area population change. Green is a growing labor and consumer base; red is shrinking.",
  },
};

export const METRIC_ORDER: MetricKey[] = [
  "developScore",
  "vacancy",
  "rentGrowth",
  "popGrowth",
];

// 5-step red→green choropleth scale (worst → best)
export const SCALE = ["#BE4A4A", "#D98C53", "#E3C04B", "#86B073", "#3E9266"];

export function bucketFor(m: Submarket, key: MetricKey): number {
  const vals = SUBMARKETS.map((s) => s[key]);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  let n = (m[key] - min) / (max - min || 1); // 0..1, higher value
  if (!METRICS[key].higherIsBetter) n = 1 - n; // flip so 1 = good
  return Math.min(4, Math.max(0, Math.floor(n * 4.999)));
}

export function ranked(key: MetricKey): Submarket[] {
  const better = METRICS[key].higherIsBetter;
  return [...SUBMARKETS].sort((a, b) =>
    better ? b[key] - a[key] : a[key] - b[key],
  );
}

// short LP-letter style narrative, written from the data, per metric
export const THESIS: Record<MetricKey, string[]> = {
  developScore: [
    "The model puts the southwest logistics corridors at the top: the I-55 Corridor and O'Hare score highest, with sub-5% vacancy, double-digit rent growth, and expanding trade-area population.",
    "Joliet/I-80 is the value play — slightly higher vacancy, but the fastest population growth in the metro as distribution moves outward.",
    "It steers away from the South Suburbs and Northwest Indiana, where vacancy is in the double digits and population is contracting. Our capital is better deployed west and southwest.",
  ],
  vacancy: [
    "Availability is tightest in the I-55 Corridor (3.8%) and O'Hare (4.1%) — landlord's markets where new product leases before it delivers.",
    "The South Suburbs (11.3%) and NW Indiana (9.1%) carry the most empty space, a signal of softer demand rather than opportunity.",
  ],
  rentGrowth: [
    "Pricing power is concentrated southwest: the I-55 Corridor leads at +11.2% YoY, with Joliet and O'Hare close behind.",
    "Rent growth flattens toward the south and into Indiana, where it sits in the low single digits.",
  ],
  popGrowth: [
    "The growth is in the exurban logistics belt — Joliet/I-80 (+6.8%) and Kenosha (+5.2%) are adding the labor and rooftops that absorb new space.",
    "The urban core and South Suburbs are losing population, which weighs on long-run demand there.",
  ],
};
