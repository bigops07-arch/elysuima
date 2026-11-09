import type { Metadata } from "next";
import { CheckerContent } from "@/components/checker/checker-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Mint Checker",
  description: "Check any wallet for GTD and FCFS mint access.",
};

export default function CheckerPage() {
  return (
    <div className="relative flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <CheckerContent />
      </main>
      <SiteFooter />
    </div>
  );
}
