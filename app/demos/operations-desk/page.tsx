import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/chrome";
import { DemoIntro } from "@/components/demo-shell";
import { OperationsDesk } from "@/components/demos/operations-desk";

export const metadata: Metadata = {
  title: "Operations Desk — Calumet",
  description:
    "Watch a property-management back office clear its own queue end to end — take the real action, then close the ticket — with no staff in the loop.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <DemoIntro
        current="Operations Desk"
        tag="Property management · fully autonomous"
        name="Operations Desk"
        blurb="This isn't a tool that helps someone — it's the desk itself. Real events arrive from tenants, vendors, and the calendar, and the agent finishes each one: dispatches the vendor, posts the invoice, sends the renewal, closes the ticket. A person is pulled in only when something genuinely needs judgment."
        proves={[
          "The whole loop closes — action taken, not just recommended",
          "8 of 9 items cleared with zero staff involvement",
          "It escalates the one case that needs a human, on purpose",
        ]}
      />
      <OperationsDesk />
      <SiteFooter />
    </>
  );
}
