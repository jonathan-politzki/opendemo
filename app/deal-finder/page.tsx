import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/chrome";
import { DemoHeader } from "@/components/demo-nav";
import { DealFinder } from "@/components/deal-finder";

export const metadata: Metadata = {
  title: "Deal Finder — Calumet",
  description: "Describe your buy box; it screens the market for properties that fit.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <DemoHeader
        current="Deal Finder"
        tag="Deal sourcing · property matching"
        title="Describe the deal. It finds the deals."
        blurb="Set a buy box — type, strategy, price, size, and the things that actually matter like distress, location, and zoning — and watch the market filter down to what fits, ranked and mapped."
      />
      <section className="bg-paper">
        <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8">
          <DealFinder />
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
