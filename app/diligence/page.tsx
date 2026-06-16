import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/chrome";
import { DemoHeader } from "@/components/demo-nav";
import { DiligenceReader } from "@/components/diligence-reader";

export const metadata: Metadata = {
  title: "Diligence Reader — Calumet",
  description: "Drop in an offering memo; get the facts, the rent roll, the math, and the red flags.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <DemoHeader
        current="Diligence Reader"
        tag="Due diligence · document automation"
        title="The offering memo, read in one pass"
        blurb="An OM, a rent roll, and a condition report go in. The deal facts, the abstracted leases, the mark-to-market math, and the red flags that would sink the deal come out — in seconds instead of two days."
      />
      <section className="bg-paper">
        <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8">
          <DiligenceReader />
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
