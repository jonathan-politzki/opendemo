import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/chrome";
import { DemoHeader } from "@/components/demo-nav";
import { SiteEngine } from "@/components/site-engine";

export const metadata: Metadata = {
  title: "Market Map — Calumet",
  description: "Score every Chicago-metro county on your thesis and shade the map live.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <DemoHeader
        current="Market Map"
        tag="Report generation · market intelligence"
        title="Where to build, scored live"
        blurb="The site-selection study your analysts spend three weeks on — as a model you drive in real time. Population is real Census data; the proprietary feeds are sample stand-ins."
      />
      <section className="bg-paper">
        <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8">
          <SiteEngine />
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
