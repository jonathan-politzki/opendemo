export type Signal = {
  label: string;
  source: string;
  why: string;
  weight: "high" | "med";
};

export type Dossier = {
  slug: string;
  name: string;
  sector: string;
  hq: string;
  size: string;
  revenue: string;
  founded: string;
  summary: string;
  signals: Signal[];
  contact: {
    name: string;
    title: string;
    tenure: string;
    why: string;
    channel: string;
  };
  email: { subject: string; body: string[] };
  trace: string[];
};

export const DOSSIERS: Dossier[] = [
  {
    slug: "lakeshore",
    name: "Lakeshore Property Group",
    sector: "Commercial real estate · property management",
    hq: "River North, Chicago IL",
    size: "120–150 employees",
    revenue: "~$40M managed-fee revenue",
    founded: "Founded 2004",
    summary:
      "Owner-operator and third-party manager of ~6.2M sq ft of office and mixed-use across Chicagoland. Lean corporate team; property accounting and lease administration are handled in-house on a Yardi stack.",
    signals: [
      {
        label: "Hiring 2 lease administrators + 1 AP clerk",
        source: "Careers page · posted 9 days ago",
        why: "Volume is outrunning the team — the exact work Lease Desk removes.",
        weight: "high",
      },
      {
        label: "Just took over management of 2 Loop towers",
        source: "Press release · last month",
        why: "Hundreds of leases to abstract and onboard on a deadline.",
        weight: "high",
      },
      {
        label: "Still on a 2019 Yardi version",
        source: "Job post tech requirements",
        why: "No native AI abstraction — manual keying today.",
        weight: "med",
      },
    ],
    contact: {
      name: "Dana Whitfield",
      title: "VP, Property Accounting & Lease Admin",
      tenure: "6 yrs at Lakeshore",
      why: "Owns the team doing the keying and feels the new-tower onboarding crunch first. Decision-maker for back-office tooling, not just an influencer.",
      channel: "Email → warm intro via Chicago BOMA chapter",
    },
    email: {
      subject: "the two-tower onboarding crunch",
      body: [
        "Dana — congrats on the two Loop towers. Onboarding that many leases at once usually means a few months of lease admins keying terms from PDFs into Yardi.",
        "We built an agent that abstracts a commercial lease into clean, reviewable fields in about 90 seconds — dates, options, escalations, recoveries — and flags the clauses a human should eyeball.",
        "Worth a 20-minute look? I'll run three of your actual leases through it live, no setup on your side.",
      ],
    },
    trace: [
      "Resolving entity “Lakeshore Property Group” · Chicago",
      "Matched: lakeshorepg.com · LinkedIn · BOMA Chicago member",
      "Reading homepage, services, and portfolio pages",
      "Parsing careers page — 3 open back-office roles found",
      "Scanning press & news — management win (2 towers)",
      "Inferring tech stack from job requirements · Yardi 2019",
      "Mapping org chart → decision-makers for back-office tooling",
      "Selecting best contact by ownership + pain proximity",
      "Drafting outreach tuned to the strongest signal",
    ],
  },
  {
    slug: "fulton",
    name: "Fulton Market Logistics",
    sector: "Wholesale distribution · freight brokerage",
    hq: "Fulton Market, Chicago IL",
    size: "60–80 employees",
    revenue: "~$95M gross revenue",
    founded: "Founded 2011",
    summary:
      "Asset-light freight brokerage and food-grade distributor serving Midwest grocery and foodservice. High order volume, thin margins, and a back office that keys orders and matches remittances by hand.",
    signals: [
      {
        label: "Order-entry + billing clerks across 2 shifts",
        source: "LinkedIn headcount · ops team",
        why: "Manual order keying is the single largest back-office cost.",
        weight: "high",
      },
      {
        label: "Net-new 3PL contract with a regional grocer",
        source: "News mention · 6 weeks ago",
        why: "Order volume steps up before headcount can — automation buys time.",
        weight: "high",
      },
      {
        label: "Glassdoor reviews cite “lots of data entry”",
        source: "Employee reviews",
        why: "Turnover in the seats automation would replace.",
        weight: "med",
      },
    ],
    contact: {
      name: "Marcus Reyes",
      title: "Director of Operations",
      tenure: "4 yrs at Fulton",
      why: "Owns throughput and the clerk headcount. Feels the new-grocer volume directly and has budget to fix it.",
      channel: "Email → reference a mutual at the new grocer account",
    },
    email: {
      subject: "keeping up with the new grocery account",
      body: [
        "Marcus — saw Fulton landed the regional grocery 3PL. Congrats. That kind of volume usually lands on the order-entry desk before you can hire for it.",
        "We built an agent that reads inbound orders — EDI, PDF, even emailed spreadsheets — and keys clean lines into your TMS, then matches remittances on the back end.",
        "Could run a week of your real orders through it side-by-side with the team. Open to a short call?",
      ],
    },
    trace: [
      "Resolving entity “Fulton Market Logistics” · Chicago",
      "Matched: fultonmktlogistics.com · LinkedIn · FMCSA records",
      "Reading services, carrier, and capabilities pages",
      "Estimating headcount by function from LinkedIn",
      "Scanning news — new regional grocer 3PL contract",
      "Reading employee reviews for back-office pain signals",
      "Mapping org chart → operations decision-makers",
      "Selecting best contact by budget + pain proximity",
      "Drafting outreach tuned to the strongest signal",
    ],
  },
  {
    slug: "claims",
    name: "Midwest Claims Partners",
    sector: "Insurance BPO · claims administration",
    hq: "Naperville, IL",
    size: "300–400 employees",
    revenue: "~$58M revenue · PE-backed",
    founded: "Founded 1998 · recapitalized 2023",
    summary:
      "Third-party claims administrator handling first-notice-of-loss, document intake, and adjudication support for regional carriers. Labor-heavy; recently bought by a lower-middle-market PE sponsor with a margin-expansion thesis.",
    signals: [
      {
        label: "PE recap closed 2023 · margin mandate",
        source: "Deal announcement · PR",
        why: "Sponsor is actively hunting headcount efficiency — automation is the thesis.",
        weight: "high",
      },
      {
        label: "Large intake & indexing team in Naperville",
        source: "LinkedIn · job functions",
        why: "Document intake/indexing is the most automatable seat in the building.",
        weight: "high",
      },
      {
        label: "New COO hired from a larger TPA",
        source: "Leadership news · 3 months ago",
        why: "Fresh operator with a mandate and no attachment to the old way.",
        weight: "med",
      },
    ],
    contact: {
      name: "Priya Anand",
      title: "Chief Operating Officer",
      tenure: "3 mos · ex-Sedgwick",
      why: "Hired specifically to expand margin post-recap. New enough to move, senior enough to sign. The buyer the sponsor wants you talking to.",
      channel: "Email → cc the sponsor's operating partner",
    },
    email: {
      subject: "the margin number, minus the layoffs headline",
      body: [
        "Priya — congrats on the move from Sedgwick. Post-recap, the intake and indexing floor is usually where the first margin points are sitting.",
        "We built agents that handle FNOL intake and document indexing end-to-end — classify, extract, route — with a human only on the exceptions. It scales the floor without scaling the seats.",
        "Happy to model it against your actual volume and show your sponsor the FTE math. 20 minutes?",
      ],
    },
    trace: [
      "Resolving entity “Midwest Claims Partners” · Naperville",
      "Matched: midwestclaims.com · LinkedIn · deal databases",
      "Reading services and carrier-client pages",
      "Pulling ownership — PE recap, 2023, sponsor identified",
      "Estimating intake/indexing headcount from LinkedIn",
      "Scanning leadership news — new COO ex-Sedgwick",
      "Mapping org chart → margin decision-makers",
      "Selecting best contact by mandate + authority",
      "Drafting outreach tuned to the sponsor thesis",
    ],
  },
];

export const PRESETS = DOSSIERS.map((d) => ({ slug: d.slug, name: d.name }));

export function resolveDossier(query: string): Dossier {
  const q = query.trim().toLowerCase();
  const hit = DOSSIERS.find(
    (d) => d.slug === q || d.name.toLowerCase().includes(q),
  );
  return hit ?? DOSSIERS[0];
}
