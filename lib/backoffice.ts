export type Process = {
  slug: string;
  name: string;
  forWhom: string;
  unit: string; // e.g. "claims", "invoices"
  baseVolume: number;
  minVolume: number;
  maxVolume: number;
  manualMin: number; // human minutes per item, before
  blendedMin: number; // avg human minutes per item, after (exceptions only)
  exceptionRate: number; // share still touched by a person
  steps: { label: string; auto: number }[]; // auto = % automated
  cycleBefore: string;
  cycleAfter: string;
  errBefore: string;
  errAfter: string;
};

export const LOADED_COST = 64000; // fully-loaded Midwest back-office FTE / yr
const PRODUCTIVE_HRS = 138; // productive hours / FTE / month

export const PROCESSES: Process[] = [
  {
    slug: "claims",
    name: "Claims FNOL intake & indexing",
    forWhom: "Insurance BPO / TPA · the seat a sponsor targets first",
    unit: "claims",
    baseVolume: 9000,
    minVolume: 2000,
    maxVolume: 30000,
    manualMin: 14,
    blendedMin: 3.1,
    exceptionRate: 0.18,
    steps: [
      { label: "Receive FNOL", auto: 100 },
      { label: "Classify doc type", auto: 99 },
      { label: "Extract fields", auto: 96 },
      { label: "Validate & dedupe", auto: 90 },
      { label: "Route to adjuster", auto: 82 },
    ],
    cycleBefore: "26 hrs",
    cycleAfter: "40 min",
    errBefore: "4.1%",
    errAfter: "0.6%",
  },
  {
    slug: "ap",
    name: "AP invoice processing",
    forWhom: "Property mgmt / shared services · highest-volume desk",
    unit: "invoices",
    baseVolume: 6000,
    minVolume: 1500,
    maxVolume: 24000,
    manualMin: 9,
    blendedMin: 2.0,
    exceptionRate: 0.15,
    steps: [
      { label: "Capture invoice", auto: 100 },
      { label: "Code to GL", auto: 95 },
      { label: "3-way match", auto: 92 },
      { label: "Route approval", auto: 88 },
      { label: "Post to ledger", auto: 85 },
    ],
    cycleBefore: "5 days",
    cycleAfter: "4 hrs",
    errBefore: "2.8%",
    errAfter: "0.4%",
  },
  {
    slug: "o2c",
    name: "Order-to-cash keying",
    forWhom: "Distribution / logistics · turnover-heavy data entry",
    unit: "orders",
    baseVolume: 12000,
    minVolume: 3000,
    maxVolume: 40000,
    manualMin: 7,
    blendedMin: 1.6,
    exceptionRate: 0.14,
    steps: [
      { label: "Ingest order", auto: 100 },
      { label: "Validate SKUs", auto: 96 },
      { label: "Key to ERP", auto: 93 },
      { label: "Confirm pricing", auto: 89 },
      { label: "Generate invoice", auto: 91 },
    ],
    cycleBefore: "1 day",
    cycleAfter: "15 min",
    errBefore: "3.5%",
    errAfter: "0.5%",
  },
];

export type Model = {
  fteBefore: number;
  fteAfter: number;
  grossSavings: number;
  programCost: number;
  netSavings: number;
  paybackMonths: number;
  annualVolume: number;
};

export function computeModel(p: Process, monthlyVolume: number): Model {
  const fteBefore = (monthlyVolume * p.manualMin) / 60 / PRODUCTIVE_HRS;
  const fteAfter = (monthlyVolume * p.blendedMin) / 60 / PRODUCTIVE_HRS;
  const grossSavings = (fteBefore - fteAfter) * LOADED_COST;
  // program cost: a fixed run fee plus a small per-item fee
  const programCost = 72000 + monthlyVolume * 12 * 0.14;
  const netSavings = grossSavings - programCost;
  const paybackMonths = programCost / (grossSavings / 12);
  return {
    fteBefore,
    fteAfter,
    grossSavings,
    programCost,
    netSavings,
    paybackMonths,
    annualVolume: monthlyVolume * 12,
  };
}

export const money = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
