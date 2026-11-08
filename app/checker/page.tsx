import type { Metadata } from "next";
import { CheckerAccessGate } from "@/components/checker/checker-access-gate";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Mint Checker",
  description: "Private GTD / FCFS mint checker.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckerPage() {
  return (
    <div className="relative flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <CheckerAccessGate />
      </main>
      <SiteFooter />
    </div>
  );
}
