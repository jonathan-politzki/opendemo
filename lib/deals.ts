/* ============================================================
   Deal Finder — describe a buy box, it screens the market.
   Properties are SAMPLE (the real version reads CoStar, county
   assessor, and zoning records). County geography is real.
   ============================================================ */

export type PropType = "Office" | "Industrial" | "Flex" | "Land" | "Retail";
export type Strategy = "redevelopment" | "valueadd" | "core";

export type Property = {
  id: string;
  address: string;
  city: string;
  fips: string;
  type: PropType;
  sizeSF: number; // land stored as acres*43560 for uniform filtering
  sizeLabel: string;
  pricePerSF: number; // land ~ derived small value
  priceLabel: string;
  vacancy: number; // %, land = 0
  zoning: string;
  nearIndustrial: boolean;
  note: string;
};

export const PROPERTIES: Property[] = [
  { id: "p1", address: "4750 N Cumberland Ave", city: "Norridge", fips: "17031", type: "Office", sizeSF: 88000, sizeLabel: "88,000 SF", pricePerSF: 46, priceLabel: "$46 / SF", vacancy: 38, zoning: "M1", nearIndustrial: true, note: "Vacant suburban office abutting O'Hare industrial; M1 permits a light-industrial conversion." },
  { id: "p2", address: "2200 Pratt Blvd", city: "Elk Grove Village", fips: "17031", type: "Flex", sizeSF: 120000, sizeLabel: "120,000 SF", pricePerSF: 62, priceLabel: "$62 / SF", vacancy: 22, zoning: "M2", nearIndustrial: true, note: "Inside the largest industrial park in North America; flex with conversion upside." },
  { id: "p3", address: "1 Tri-State Intl", city: "Lincolnshire", fips: "17097", type: "Office", sizeSF: 210000, sizeLabel: "210,000 SF", pricePerSF: 38, priceLabel: "$38 / SF", vacancy: 54, zoning: "O", nearIndustrial: false, note: "Distressed corporate campus; last-mile redevelopment under study." },
  { id: "p4", address: "3500 Lacey Rd", city: "Downers Grove", fips: "17043", type: "Office", sizeSF: 95000, sizeLabel: "95,000 SF", pricePerSF: 51, priceLabel: "$51 / SF", vacancy: 41, zoning: "O", nearIndustrial: true, note: "Empty office on I-88; rezoning to flex looks feasible." },
  { id: "p5", address: "1717 McCook Ave", city: "McCook", fips: "17031", type: "Industrial", sizeSF: 64000, sizeLabel: "64,000 SF", pricePerSF: 78, priceLabel: "$78 / SF", vacancy: 6, zoning: "M2", nearIndustrial: true, note: "Stabilized infill industrial next to rail; core hold." },
  { id: "p6", address: "24800 W Bluff Rd", city: "Channahon", fips: "17197", type: "Land", sizeSF: 1742400, sizeLabel: "40 acres", pricePerSF: 4, priceLabel: "$185k / acre", vacancy: 0, zoning: "M1", nearIndustrial: true, note: "Shovel-ready, entitled logistics land off I-55." },
  { id: "p7", address: "1255 Remington Blvd", city: "Bolingbrook", fips: "17197", type: "Industrial", sizeSF: 305000, sizeLabel: "305,000 SF", pricePerSF: 74, priceLabel: "$74 / SF", vacancy: 8, zoning: "M1", nearIndustrial: true, note: "Leased big-box distribution; core-plus cash flow." },
  { id: "p8", address: "500 W Madison St", city: "Chicago", fips: "17031", type: "Office", sizeSF: 150000, sizeLabel: "150,000 SF", pricePerSF: 58, priceLabel: "$58 / SF", vacancy: 33, zoning: "DX", nearIndustrial: false, note: "Class-B downtown office; residential conversion play, not industrial." },
  { id: "p9", address: "1051 N Raddant Rd", city: "Batavia", fips: "17089", type: "Flex", sizeSF: 72000, sizeLabel: "72,000 SF", pricePerSF: 44, priceLabel: "$44 / SF", vacancy: 27, zoning: "M1", nearIndustrial: true, note: "Fox Valley flex; straightforward value-add lease-up." },
  { id: "p10", address: "2701 Curtiss St", city: "Downers Grove", fips: "17043", type: "Office", sizeSF: 60000, sizeLabel: "60,000 SF", pricePerSF: 49, priceLabel: "$49 / SF", vacancy: 47, zoning: "M1", nearIndustrial: true, note: "Vacant office; redevelopment play at I-88 / I-355." },
  { id: "p11", address: "13040 S Pulaski Rd", city: "Alsip", fips: "17031", type: "Industrial", sizeSF: 110000, sizeLabel: "110,000 SF", pricePerSF: 39, priceLabel: "$39 / SF", vacancy: 19, zoning: "M2", nearIndustrial: true, note: "South-suburbs industrial; cheap basis, softer demand." },
  { id: "p12", address: "6700 Industrial Dr", city: "Pleasant Prairie", fips: "55059", type: "Industrial", sizeSF: 250000, sizeLabel: "250,000 SF", pricePerSF: 52, priceLabel: "$52 / SF", vacancy: 5, zoning: "M1", nearIndustrial: true, note: "Stabilized Wisconsin-line big-box." },
  { id: "p13", address: "1900 E Lincoln Hwy", city: "DeKalb", fips: "17037", type: "Land", sizeSF: 5227200, sizeLabel: "120 acres", pricePerSF: 2, priceLabel: "$95k / acre", vacancy: 0, zoning: "M1", nearIndustrial: true, note: "I-88 mega-site; data-center and logistics demand." },
  { id: "p14", address: "800 Roosevelt Rd", city: "Glen Ellyn", fips: "17043", type: "Retail", sizeSF: 45000, sizeLabel: "45,000 SF", pricePerSF: 66, priceLabel: "$66 / SF", vacancy: 35, zoning: "B3", nearIndustrial: false, note: "Dead retail; mixed-use redevelopment, not industrial." },
];

export type BuyBox = {
  type: PropType | "Any";
  strategy: Strategy;
  maxPricePerSF: number;
  minSizeSF: number;
  distressedOnly: boolean; // vacancy > 20%
  nearIndustrialOnly: boolean;
  redevZoningOnly: boolean; // M1 / M2
};

export const DEFAULT_BUYBOX: BuyBox = {
  type: "Office",
  strategy: "redevelopment",
  maxPricePerSF: 60,
  minSizeSF: 50000,
  distressedOnly: true,
  nearIndustrialOnly: true,
  redevZoningOnly: true,
};

export const STRATEGIES: { id: Strategy; label: string; blurb: string }[] = [
  { id: "redevelopment", label: "Redevelopment", blurb: "Distressed, well-located, re-zonable to industrial." },
  { id: "valueadd", label: "Value-add", blurb: "Partial vacancy with a clear lease-up path." },
  { id: "core", label: "Core / stabilized", blurb: "Leased, low-vacancy cash flow." },
];

export type Match = Property & { fit: number; reasons: string[] };

export function findDeals(bb: BuyBox): Match[] {
  const isMZone = (z: string) => z === "M1" || z === "M2";
  const out: Match[] = [];
  for (const p of PROPERTIES) {
    // hard filters
    if (bb.type !== "Any" && p.type !== bb.type) continue;
    if (p.type !== "Land" && p.pricePerSF > bb.maxPricePerSF) continue;
    if (p.sizeSF < bb.minSizeSF) continue;
    if (bb.distressedOnly && p.type !== "Land" && p.vacancy <= 20) continue;
    if (bb.nearIndustrialOnly && !p.nearIndustrial) continue;
    if (bb.redevZoningOnly && !isMZone(p.zoning)) continue;

    // fit score + reasons
    let fit = 55;
    const reasons: string[] = [];
    if (p.nearIndustrial) {
      fit += 10;
      reasons.push("Adjacent to existing industrial");
    }
    if (isMZone(p.zoning)) {
      fit += 10;
      reasons.push(`${p.zoning} zoning permits industrial use`);
    }
    if (p.type !== "Land" && p.pricePerSF <= bb.maxPricePerSF - 8) {
      fit += 8;
      reasons.push(`${p.priceLabel} — well under your ceiling`);
    }
    if (bb.strategy === "redevelopment") {
      if (p.vacancy >= 35) { fit += 16; reasons.push(`${p.vacancy}% vacant — ripe for repositioning`); }
      else if (p.vacancy >= 20) { fit += 8; reasons.push(`${p.vacancy}% vacant`); }
      if (p.type === "Office" || p.type === "Flex") { fit += 6; reasons.push("Convertible shell"); }
      if (p.type === "Land") { fit += 12; reasons.push("Build-to-suit ready"); }
    } else if (bb.strategy === "valueadd") {
      if (p.vacancy >= 15 && p.vacancy <= 35) { fit += 16; reasons.push(`${p.vacancy}% vacant — clean lease-up`); }
      else if (p.vacancy > 35) { fit += 4; reasons.push(`${p.vacancy}% vacant — heavier lift`); }
    } else {
      if (p.vacancy <= 8) { fit += 18; reasons.push(`${p.vacancy}% vacant — stabilized`); }
      else { fit -= 6; reasons.push(`${p.vacancy}% vacant — not yet core`); }
    }
    out.push({ ...p, fit: Math.min(99, fit), reasons: reasons.slice(0, 3) });
  }
  return out.sort((a, b) => b.fit - a.fit);
}
