import type { Metadata } from "next";
import { RafflesAccessGate } from "@/components/raffles/raffles-access-gate";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Raffles",
  description:
    "Win a 1-of-1 Elyziuma NFT. Enter the live raffle for 10 ELYZ, watch the countdown, and see every past winner.",
  keywords: [
    "Elyziuma raffles",
    "NFT raffle",
    "Elysium NFT",
    "win an NFT",
    "ELYZ raffle",
  ],
  openGraph: {
    title: "Elyziuma Raffles",
    description:
      "One NFT, one winner. Enter the live Elyziuma raffle for 10 ELYZ.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elyziuma Raffles",
    description:
      "One NFT, one winner. Enter the live Elyziuma raffle for 10 ELYZ.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RafflesPage() {
  return (
    <div className="relative flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col justify-center">
        <RafflesAccessGate />
      </main>
      <SiteFooter compact />
    </div>
  );
}
