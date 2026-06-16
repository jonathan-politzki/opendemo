import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/chrome";
import { DemoIntro } from "@/components/demo-shell";
import { BackOfficeDemo } from "@/components/demos/back-office";

export const metadata: Metadata = {
  title: "Back Office — Calumet",
  description:
    "Pick a back-office process, run it end to end, and see the headcount, throughput, and margin math a sponsor cares about.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <DemoIntro
        current="Back Office"
        tag="Operations · private equity"
        name="Back Office"
        blurb="This is the one a sponsor leans into. Pick a back-office process, set the monthly volume, and run it — then read the FTE, payback, and margin math live as the slider moves."
        proves={[
          "Ties automation directly to FTEs and the P&L",
          "Holds up under a sponsor's questions, at any volume",
          "Frames it as margin expansion, not a software purchase",
        ]}
      />
      <BackOfficeDemo />
      <SiteFooter />
    </>
  );
}
