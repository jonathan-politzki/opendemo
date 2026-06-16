export type LeaseDoc = {
  id: string;
  file: string;
  type: "Office lease" | "Retail lease" | "Industrial lease" | "Estoppel";
  pages: number;
  tenant: string;
  premises: string;
  term: string;
  baseRent: string;
  escalation: string;
  renewal: string;
  deposit: string;
  recoveries: string;
  confidence: number;
  flag?: string;
};

export const LEASES: LeaseDoc[] = [
  {
    id: "L-2231",
    file: "200WMadison_Ste1400_Lease.pdf",
    type: "Office lease",
    pages: 47,
    tenant: "Brightwater Capital LLC",
    premises: "Ste 1400 · 18,420 RSF",
    term: "Mar 2022 – Feb 2032",
    baseRent: "$38.50 / RSF",
    escalation: "3.0% annual",
    renewal: "One 5-yr @ FMV",
    deposit: "$118,275 LOC",
    recoveries: "NNN · base yr 2022",
    confidence: 98,
  },
  {
    id: "L-2232",
    file: "FultonMkt_RetailBay_C_Lease.pdf",
    type: "Retail lease",
    pages: 39,
    tenant: "Loop & Larder (rest.)",
    premises: "Bay C · 4,100 RSF",
    term: "Jun 2023 – May 2033",
    baseRent: "$52.00 / RSF",
    escalation: "$1.50 / RSF / yr",
    renewal: "Two 5-yr options",
    deposit: "$71,000 cash",
    recoveries: "NNN + 6% pro-rata CAM",
    confidence: 91,
    flag: "Percentage-rent clause (8% over $2.4M breakpoint) — confirm reporting cadence.",
  },
  {
    id: "L-2233",
    file: "Pilsen_Industrial_Bldg7.pdf",
    type: "Industrial lease",
    pages: 31,
    tenant: "Calumet Cold Storage",
    premises: "Bldg 7 · 64,500 SF",
    term: "Jan 2021 – Dec 2030",
    baseRent: "$9.75 / SF",
    escalation: "2.5% annual",
    renewal: "One 10-yr @ 95% FMV",
    deposit: "$94,200 cash",
    recoveries: "NNN · tenant pays roof",
    confidence: 96,
  },
  {
    id: "L-2234",
    file: "Evanston_MedicalOffice_Ste220.pdf",
    type: "Office lease",
    pages: 44,
    tenant: "North Shore Dermatology",
    premises: "Ste 220 · 6,880 RSF",
    term: "Sep 2024 – Aug 2034",
    baseRent: "$31.25 / RSF",
    escalation: "CPI, 4% cap",
    renewal: "One 5-yr @ FMV",
    deposit: "$53,750 cash",
    recoveries: "Modified gross · base yr 2024",
    confidence: 84,
    flag: "Escalation tied to CPI-U Midwest with a 4% cap — verify index source before billing.",
  },
  {
    id: "L-2235",
    file: "Oakbrook_Estoppel_Tenant_Aldridge.pdf",
    type: "Estoppel",
    pages: 6,
    tenant: "Aldridge & Cole LLP",
    premises: "Ste 900 · 12,300 RSF",
    term: "Apr 2020 – Mar 2030",
    baseRent: "$33.00 / RSF",
    escalation: "2.75% annual",
    renewal: "None remaining",
    deposit: "$67,650 LOC",
    recoveries: "NNN · base yr 2020",
    confidence: 99,
  },
];

export const ABSTRACT_FIELDS = [
  { key: "tenant", label: "Tenant" },
  { key: "premises", label: "Premises" },
  { key: "term", label: "Term" },
  { key: "baseRent", label: "Base rent" },
  { key: "escalation", label: "Escalation" },
  { key: "renewal", label: "Renewal" },
  { key: "deposit", label: "Security" },
  { key: "recoveries", label: "Recoveries" },
] as const;
