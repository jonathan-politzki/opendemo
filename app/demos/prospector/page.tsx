import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/chrome";
import { DemoIntro } from "@/components/demo-shell";
import { ProspectorDemo } from "@/components/demos/prospector";

export const metadata: Metadata = {
  title: "Prospector — Calumet",
  description:
    "An agent that researches a company and tells you exactly who to call and what to say.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <DemoIntro
        current="Prospector"
        tag="Revenue desk"
        name="Prospector"
        blurb="Give it a company name. It reads the open web, builds a one-page dossier, ranks the reasons they'd buy, names the person worth calling, and drafts the opener — in the time it takes to read this sentence."
        proves={[
          "Turns 20 minutes of manual research into 30 seconds",
          "Surfaces buying signals a rep would miss",
          "Hands a rep something ready to send, not a blank page",
        ]}
      />
      <ProspectorDemo />
      <SiteFooter />
    </>
  );
}
