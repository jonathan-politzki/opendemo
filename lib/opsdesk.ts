/* ============================================================
   Operations Desk — an autonomous property-management back office.
   Events arrive from the real world; the agent finishes the work
   and takes the actual action. A human is pulled in only on a
   genuine exception. This is replacement, not assistance.
   ============================================================ */

export type Artifact =
  | { type: "email"; channel: string; to: string; subj: string; body: string[] }
  | { type: "record"; title: string; fields: [string, string][]; status: string }
  | { type: "ledger"; title: string; fields: [string, string][] }
  | { type: "brief"; title: string; lines: string[] };

export type Outcome =
  | "closed"
  | "posted"
  | "sent"
  | "awaiting"
  | "chasing"
  | "escalated";

export type OpsEvent = {
  id: string;
  kind:
    | "maintenance"
    | "invoice"
    | "collections"
    | "compliance"
    | "inquiry"
    | "renewal"
    | "turn"
    | "exception";
  source: string; // where it came from
  property: string;
  title: string;
  trigger: string; // the inbound, in plain English
  steps: string[]; // what the agent actually does
  outcome: Outcome;
  outcomeLabel: string;
  saveMin: number; // human minutes this would have taken
  artifact: Artifact;
};

export const OUTCOME_META: Record<
  Outcome,
  { label: string; tone: "good" | "chicago" | "brass" | "star"; human: boolean }
> = {
  closed: { label: "Closed", tone: "good", human: false },
  posted: { label: "Posted", tone: "good", human: false },
  sent: { label: "Sent", tone: "good", human: false },
  awaiting: { label: "Awaiting tenant", tone: "chicago", human: false },
  chasing: { label: "Chasing 3rd party", tone: "chicago", human: false },
  escalated: { label: "Escalated to manager", tone: "star", human: true },
};

export const KIND_LABEL: Record<OpsEvent["kind"], string> = {
  maintenance: "Maintenance",
  invoice: "Accounts payable",
  collections: "Collections",
  compliance: "Compliance",
  inquiry: "Tenant inquiry",
  renewal: "Lease renewal",
  turn: "Unit turn",
  exception: "Exception",
};

export const COMPANY = "Riverside Property Group";

export const EVENTS: OpsEvent[] = [
  {
    id: "EVT-4471",
    kind: "maintenance",
    source: "Tenant SMS",
    property: "200 W Madison · Unit 4B",
    title: "No heat reported",
    trigger:
      "“Heat isn't working in 4B, it's 58 degrees in here and there's a newborn. Please help.”",
    steps: [
      "Classified: HVAC · health-and-safety · urgent",
      "Checked lease — heat is landlord responsibility",
      "Matched vendor: ABC Mechanical (preferred, Bldg 200W)",
      "Pulled vendor calendar — confirmed 2:00 PM today",
      "Texted tenant the ETA and technician name",
      "Opened work order #4471 in AppFolio",
    ],
    outcome: "closed",
    outcomeLabel: "Vendor dispatched · WO #4471 open",
    saveMin: 18,
    artifact: {
      type: "record",
      title: "Work order #4471",
      status: "Dispatched",
      fields: [
        ["Unit", "200 W Madison · 4B"],
        ["Issue", "No heat · HVAC"],
        ["Priority", "Urgent (H&S)"],
        ["Vendor", "ABC Mechanical"],
        ["Scheduled", "Today · 2:00–4:00 PM"],
        ["Tenant notified", "SMS · 9:42 AM"],
        ["Lease check", "Landlord responsibility ✓"],
      ],
    },
  },
  {
    id: "EVT-9920",
    kind: "invoice",
    source: "AP inbox",
    property: "200 W Madison",
    title: "ComEd utility invoice · $3,410.18",
    trigger: "Inbound PDF from billing@comed.com — account 200 W Madison common area.",
    steps: [
      "Extracted vendor, amount, account, period",
      "Coded to GL 6420 · Utilities — Electric",
      "Matched to budget line — within 4% of plan",
      "Applied approval policy — under $5k auto-approve",
      "Scheduled payment for net-30 date",
      "Posted to property ledger",
    ],
    outcome: "posted",
    outcomeLabel: "Approved & posted · pay 06/30",
    saveMin: 9,
    artifact: {
      type: "ledger",
      title: "Ledger entry · AP-9920",
      fields: [
        ["Vendor", "Commonwealth Edison"],
        ["Amount", "$3,410.18"],
        ["GL code", "6420 · Utilities — Electric"],
        ["Property", "200 W Madison"],
        ["Budget variance", "+3.8% (within tolerance)"],
        ["Approval", "Auto · policy < $5,000"],
        ["Pay date", "06/30/2026 · ACH"],
      ],
    },
  },
  {
    id: "EVT-3312",
    kind: "collections",
    source: "Ledger monitor",
    property: "1130 N Dearborn · Unit 2C",
    title: "Rent 6 days late · $2,150",
    trigger: "Scheduled scan flagged 2C — June rent unpaid as of the 6th.",
    steps: [
      "Confirmed no payment posted or pending",
      "Checked history — first late in 14 months",
      "Sent friendly reminder #1 per collections policy",
      "Included one-tap payment link + plan option",
      "Logged contact, set 3-day follow-up",
    ],
    outcome: "sent",
    outcomeLabel: "Reminder sent · follow-up armed",
    saveMin: 12,
    artifact: {
      type: "email",
      channel: "Email + SMS",
      to: "tenant.2c@—",
      subj: "Quick reminder on June rent",
      body: [
        "Hi Maria — just a friendly note that June rent ($2,150) shows as unpaid. No late fee yet; you're within the grace window.",
        "You can pay in one tap here: pay.riversidepg.com/2C. If this month is tight, you can also split it into two payments — reply “plan” and I'll set it up.",
        "Thanks! — Riverside Property Group",
      ],
    },
  },
  {
    id: "EVT-7745",
    kind: "compliance",
    source: "Compliance monitor",
    property: "200 W Madison · Suite 1400",
    title: "Tenant insurance certificate expired",
    trigger: "COI tracker: Brightwater Capital's liability certificate lapsed yesterday.",
    steps: [
      "Detected expiry on the COI tracker",
      "Identified broker of record from the prior cert",
      "Drafted request for an updated certificate",
      "Sent to broker, cc tenant, with lease requirements",
      "Flagged unit amber, set 5-day re-check",
    ],
    outcome: "chasing",
    outcomeLabel: "Renewal requested from broker",
    saveMin: 15,
    artifact: {
      type: "email",
      channel: "Email",
      to: "broker@—  ·  cc tenant",
      subj: "Updated COI needed — Brightwater Capital, Suite 1400",
      body: [
        "Hi — Brightwater Capital's certificate of insurance for Suite 1400 at 200 W Madison expired 06/14.",
        "Per the lease we need $2M general liability, $5M umbrella, with Riverside Property Group named as additional insured. Could you send a refreshed COI this week?",
        "Appreciate it — flagging so we keep the file current. — Riverside Property Group",
      ],
    },
  },
  {
    id: "EVT-2208",
    kind: "inquiry",
    source: "Tenant email",
    property: "1130 N Dearborn · Unit 9F",
    title: "“When is my parking fee due?”",
    trigger: "“Hi, can you remind me what I owe for the garage and when it's due each month?”",
    steps: [
      "Identified tenant and active lease",
      "Pulled parking addendum — $275/mo, due with rent",
      "Confirmed next due date from the ledger",
      "Drafted a specific, cited answer",
      "Sent reply",
    ],
    outcome: "sent",
    outcomeLabel: "Answered from the lease · sent",
    saveMin: 8,
    artifact: {
      type: "email",
      channel: "Email",
      to: "tenant.9f@—",
      subj: "Re: garage parking fee",
      body: [
        "Hi James — your parking is $275/month for space G-22, billed together with rent and due on the 1st (per the parking addendum, section 3).",
        "Your next charge posts July 1. It's already bundled into your normal payment, so there's nothing separate to do. — Riverside Property Group",
      ],
    },
  },
  {
    id: "EVT-1400",
    kind: "renewal",
    source: "Lease calendar",
    property: "200 W Madison · Suite 1400",
    title: "Lease expires in 88 days",
    trigger: "Renewal window opened for Brightwater Capital — expiry 02/2032 minus 88 days.",
    steps: [
      "Pulled current terms — $38.50/RSF, 3% escalation",
      "Compared 4 in-building & submarket comps",
      "Set renewal at +3.0% per the owner's playbook",
      "Generated the renewal offer letter",
      "Sent to tenant contact, set 10-day follow-up",
    ],
    outcome: "awaiting",
    outcomeLabel: "Renewal offer sent · awaiting tenant",
    saveMin: 35,
    artifact: {
      type: "email",
      channel: "Email · PDF attached",
      to: "Dana Whitfield, Brightwater Capital",
      subj: "Renewal offer — Suite 1400, 200 W Madison",
      body: [
        "Hi Dana — Brightwater's lease for Suite 1400 (18,420 RSF) is up 02/28/2032 and we'd love to keep you.",
        "Attached is a 5-year renewal at $39.66/RSF (a 3% step from today), same TI and parking, with the existing 3% annual escalation. It's at or below the three comparable Loop renewals we're seeing.",
        "Happy to walk through it. Offer holds for 30 days. — Riverside Property Group",
      ],
    },
  },
  {
    id: "EVT-7A11",
    kind: "turn",
    source: "Tenant portal",
    property: "1130 N Dearborn · Unit 7A",
    title: "60-day notice to vacate",
    trigger: "Tenant submitted intent to vacate effective 08/15 through the portal.",
    steps: [
      "Acknowledged notice, confirmed move-out date",
      "Scheduled move-out inspection 08/15",
      "Ordered turn vendors — clean + paint",
      "Opened turn checklist, est. ready 08/22",
      "Listed unit for 08/25 availability",
      "Estimated prorated deposit return",
    ],
    outcome: "closed",
    outcomeLabel: "Turn scheduled · unit re-listed",
    saveMin: 25,
    artifact: {
      type: "record",
      title: "Turn plan · Unit 7A",
      status: "Scheduled",
      fields: [
        ["Move-out", "08/15/2026"],
        ["Inspection", "08/15 · 10:00 AM"],
        ["Clean", "Sparkle Co · 08/16"],
        ["Paint", "Lakeview Painters · 08/18"],
        ["Ready to lease", "08/22 (est.)"],
        ["Re-listed for", "08/25 · $2,395/mo"],
        ["Deposit est.", "$1,980 returnable"],
      ],
    },
  },
  {
    id: "EVT-8801",
    kind: "exception",
    source: "AP inbox",
    property: "1130 N Dearborn",
    title: "Apex Plumbing invoice $11,200 — 41% over PO",
    trigger: "Inbound invoice references PO-2231 ($7,950) but bills $11,200 for added scope.",
    steps: [
      "Matched invoice to PO-2231",
      "Detected variance: +$3,250 (41%) over authorized",
      "Reviewed work order — no approved change order on file",
      "Policy: variance > 15% requires a human",
      "Prepared briefing + recommendation for the manager",
    ],
    outcome: "escalated",
    outcomeLabel: "Held for manager · briefing ready",
    saveMin: 10,
    artifact: {
      type: "brief",
      title: "Escalation → Property Manager",
      lines: [
        "Apex Plumbing billed $11,200 against PO-2231 authorized at $7,950 (+41%).",
        "No approved change order is on file for the extra scope (emergency stack repair, units 3A–5A).",
        "Recommendation: approve $9,400 — the added scope looks legitimate from the work-order photos, but the labor hours are ~6 above the trade norm. Suggested counter attached.",
        "Nothing has been paid. Awaiting your call.",
      ],
    },
  },
  {
    id: "EVT-4471B",
    kind: "maintenance",
    source: "Vendor update",
    property: "200 W Madison · Unit 4B",
    title: "WO #4471 marked complete by vendor",
    trigger: "ABC Mechanical updated work order #4471 to “complete — igniter replaced.”",
    steps: [
      "Confirmed completion note + parts used",
      "Texted tenant to verify heat is restored",
      "Tenant confirmed: “All warm, thank you!”",
      "Logged $480 cost to property R&M",
      "Closed work order #4471",
    ],
    outcome: "closed",
    outcomeLabel: "Verified with tenant · WO closed",
    saveMin: 6,
    artifact: {
      type: "record",
      title: "Work order #4471",
      status: "Closed",
      fields: [
        ["Resolution", "Igniter replaced"],
        ["Vendor", "ABC Mechanical"],
        ["Cost", "$480 → GL 6310 R&M"],
        ["Tenant confirmed", "Yes · 3:51 PM"],
        ["Time open", "6h 09m"],
        ["Re-open risk", "Low"],
      ],
    },
  },
];

// ---- economics shown on the dashboard ----
export const DESK = {
  itemsPerDay: 70, // back-office items this desk handles in a full day
  loadedCostPerFte: 64000, // matches the Back Office model
  productiveMinPerDay: 408, // 6.8 productive hrs / FTE / day
};

export function deskEconomics(handledMinutes: number, itemsHandled: number) {
  // scale the running shift up to a representative full day
  const avgMin = itemsHandled > 0 ? handledMinutes / itemsHandled : 0;
  const dailyMinutes = avgMin * DESK.itemsPerDay;
  const fte = dailyMinutes / DESK.productiveMinPerDay;
  const annualValue = fte * DESK.loadedCostPerFte;
  return { fte, annualValue };
}
