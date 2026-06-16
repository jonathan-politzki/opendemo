import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/chrome";
import { DemoIntro } from "@/components/demo-shell";
import { LeaseDeskDemo } from "@/components/demos/lease-desk";

export const metadata: Metadata = {
  title: "Lease Desk — Calumet",
  description:
    "Drop in a stack of leases and invoices. Get back one clean, reviewable table and a short list of what a human should check.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <DemoIntro
        current="Lease Desk"
        tag="Real estate · property management"
        name="Lease Desk"
        blurb="Lease admins spend their week typing terms out of 40-page PDFs into a property system. Lease Desk reads the documents, fills the fields, and hands a person only the clauses that genuinely need judgment."
        proves={[
          "45 minutes of keying per lease becomes ~90 seconds",
          "Every field is traceable back to the source document",
          "The agent escalates judgment calls instead of guessing",
        ]}
      />
      <LeaseDeskDemo />
      <SiteFooter />
    </>
  );
}
