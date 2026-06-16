/* ============================================================
   Diligence Reader — an offering memo goes in; the facts, the
   rent roll, the math, and the red flags come out. Sample deal,
   but the extraction is the kind a computer genuinely automates.
   ============================================================ */

export const OM = {
  title: "Tri-County Logistics Portfolio",
  subtitle: "3 buildings · I-55 Corridor · Will County, IL",
  pages: 47,
  docs: ["Offering memorandum", "Rent roll", "Property condition report"],
  facts: [
    ["Asset", "3-building distribution portfolio"],
    ["Total size", "612,000 SF"],
    ["Built", "2004 – 2016"],
    ["Asking price", "$74.5M · $122 / SF"],
    ["In-place NOI", "$4.18M"],
    ["Asking cap rate", "5.6%"],
    ["Occupancy", "91%"],
    ["Clear height", "28 – 36 ft"],
  ] as [string, string][],
  rentRoll: [
    { tenant: "Sterling Foods 3PL", sf: "248,000", pct: 41, rent: "$5.10", mkt: "$6.40", exp: "Mar 2027" },
    { tenant: "Midwest Auto Parts", sf: "142,000", pct: 24, rent: "$5.65", mkt: "$6.40", exp: "Sep 2031" },
    { tenant: "Apex Packaging", sf: "96,000", pct: 16, rent: "$6.10", mkt: "$6.40", exp: "Aug 2026" },
    { tenant: "Two small tenants", sf: "70,000", pct: 19, rent: "$6.00", mkt: "$6.40", exp: "2029–2030" },
    { tenant: "Vacant", sf: "56,000", pct: 0, rent: "—", mkt: "$6.40", exp: "—" },
  ],
  metrics: [
    ["WALT", "3.9 yrs"],
    ["In-place rent", "$5.46 / SF"],
    ["Market rent", "$6.40 / SF"],
    ["Mark-to-market", "+17% upside"],
    ["Vacant", "56,000 SF (9%)"],
  ] as [string, string][],
  redFlags: [
    { sev: "high", text: "Sterling Foods is 41% of NOI and its lease expires in 10 months (Mar 2027). Renewal risk is the whole deal." },
    { sev: "high", text: "Apex Packaging (16% of NOI) expires Aug 2026 — inside the first year of a typical hold." },
    { sev: "med", text: "PCA flags ~$1.1M of deferred roof capital on Building 2, not reflected in the asking price." },
    { sev: "med", text: "Underwriting assumes full mark-to-market on every rollover; 17% upside is real but not guaranteed." },
    { sev: "low", text: "Two leases carry early-termination options exercisable in 2027." },
  ] as { sev: "high" | "med" | "low"; text: string }[],
  read: [
    "612k SF of mostly Class-A distribution in the I-55 corridor, 91% leased at a 5.6% asking cap. The thesis is mark-to-market — in-place rents run ~17% under market, so rollover carries real upside in a tight submarket.",
    "The risk is concentration and timing: Sterling Foods is 41% of income and rolls in 10 months, with a second 16% tenant rolling inside year one. Price the deal for the chance Sterling re-trades or leaves.",
    "Recommendation: re-underwrite at a 6.0% cap, carry ~$1.1M of deferred roof capital, and model 9 months of downtime on the Sterling space before signing an LOI.",
  ],
};

export const STAGE_LABELS = [
  "Parsing 47 pages — OM, rent roll, PCA",
  "Extracting deal facts",
  "Abstracting the rent roll",
  "Computing WALT, occupancy, mark-to-market",
  "Flagging concentration, rollover & capital risks",
  "Drafting the diligence read",
];
