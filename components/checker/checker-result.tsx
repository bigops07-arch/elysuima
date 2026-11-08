"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Minus,
  Search,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { LINKS } from "@/lib/config";
import { formatRelative, shortAddress } from "@/lib/format";
import type {
  MintEligibilityResponse,
  MintEligibilityTier,
} from "@/lib/mint-eligibility";
import { cn } from "@/lib/utils";

const RESULT_COPY: Record<
  MintEligibilityTier,
  {
    label: string;
    heading: string;
    body: string;
    stamp: string;
    icon: LucideIcon;
  }
> = {
  gtd: {
    label: "Eligible",
    heading: "GTD Phase Access",
    body: "Congratulations! Your wallet is eligible for the Guaranteed Mint phase.",
    stamp: "GTD",
    icon: Sparkles,
  },
  fcfs: {
    label: "Eligible",
    heading: "FCFS Phase Access",
    body: "Congratulations! Your wallet is eligible for the First Come, First Served phase.",
    stamp: "FCFS",
    icon: Sparkles,
  },
  both: {
    label: "Eligible",
    heading: "Full Mint Access",
    body: "Congratulations! Your wallet is eligible for both GTD and FCFS phases.",
    stamp: "GTD + FCFS",
    icon: Sparkles,
  },
  none: {
    label: "Not eligible",
    heading: "No Allocation Found",
    body: "This wallet is not eligible for the current Elyziuma mint phases",
    stamp: "—",
    icon: Search,
  },
};

const TONE: Record<
  MintEligibilityTier,
  { card: string; glow: string; badge: string; stamp: string }
> = {
  gtd: {
    card: "border-mint/25 bg-mint/[0.045]",
    glow: "bg-mint/15",
    badge: "border-mint/25 bg-mint/[0.08] text-mint",
    stamp: "border-mint/35 bg-mint/[0.08] text-mint",
  },
  fcfs: {
    card: "border-brand/25 bg-brand/[0.045]",
    glow: "bg-brand/15",
    badge: "border-brand/25 bg-brand/[0.08] text-brand",
    stamp: "border-brand/35 bg-brand/[0.08] text-brand",
  },
  both: {
    card: "border-mint/25 bg-gradient-to-br from-mint/[0.06] to-brand/[0.06]",
    glow: "bg-brand/15",
    badge: "border-mint/25 bg-mint/[0.08] text-mint",
    stamp: "border-brand/35 bg-brand/[0.08] text-brand",
  },
  none: {
    card: "border-paper/[0.09] bg-paper/[0.025]",
    glow: "bg-paper/5",
    badge: "border-paper/10 bg-paper/[0.04] text-paper-dim",
    stamp: "border-paper/10 bg-paper/[0.03] text-paper-mute",
  },
};

export function EligibilityResult({
  data,
  address,
  showActions = true,
}: {
  data: MintEligibilityResponse;
  address?: string;
  showActions?: boolean;
}) {
  const copy = RESULT_COPY[data.tier];
  const tone = TONE[data.tier];
  const eligible = data.tier !== "none";
  const Icon = copy.icon;

  return (
    <div key={data.tier} className="animate-rise">
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "relative overflow-hidden rounded-2xl border p-5 sm:p-6",
          tone.card,
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -right-8 -top-12 size-40 rounded-full blur-[60px]",
            tone.glow,
          )}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em]",
                tone.badge,
              )}
            >
              <Icon aria-hidden="true" className="size-3" />
              {copy.label}
            </span>

            <h3 className="mt-2.5 font-display text-[clamp(1.75rem,3.2vw,2.25rem)] font-extrabold leading-[1] tracking-[-0.04em] text-paper">
              {copy.heading}
            </h3>
            <p className="mt-2 max-w-md text-[15px] leading-6 text-paper-dim">
              {copy.body}
            </p>
          </div>

          <span
            aria-hidden="true"
            className={cn(
              "hidden shrink-0 rotate-[-4deg] rounded-lg border-2 px-3 py-2 font-display text-base font-extrabold uppercase leading-none tracking-[0.08em] sm:block",
              tone.stamp,
            )}
          >
            {copy.stamp}
          </span>
        </div>

        <div className="relative mt-4 flex flex-wrap gap-2">
          <PhaseChip label="GTD" active={data.gtd} />
          <PhaseChip label="FCFS" active={data.fcfs} />
        </div>

        {data.tier === "none" ? (
          <p className="relative mt-3 rounded-xl border border-beak/20 bg-beak/[0.05] px-3 py-2 text-[13px] leading-6 text-paper-dim">
            Holding a Kalos Genesis NFT? You are automatically eligible for
            FCFS — no wallet verification needed.
          </p>
        ) : null}

        <div className="relative mt-4 flex flex-wrap items-center gap-2.5 border-t border-paper/[0.08] pt-4">
          {showActions ? (
            eligible ? (
              <Link
                href="/launchpad"
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-brand/25 bg-brand/[0.06] px-4 text-sm font-semibold text-brand transition hover:bg-brand/10"
              >
                Open launchpad
                <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <a
                href={LINKS.x}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-paper/10 bg-paper/[0.03] px-4 text-sm font-semibold text-paper-dim transition hover:border-brand/40 hover:text-brand"
              >
                Follow on X
                <ArrowUpRight className="size-3.5" />
              </a>
            )
          ) : address ? (
            <span
              title={address}
              className="inline-flex items-center gap-1.5 rounded-full border border-paper/10 bg-paper/[0.03] px-3 py-1.5 font-mono text-xs text-paper-dim"
            >
              <Wallet className="size-3.5 text-brand" />
              {shortAddress(address, 6)}
            </span>
          ) : null}

          <span className="ml-auto inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-paper-mute">
            <Clock3 className="size-3" />
            {formatRelative(Math.floor(data.checkedAt / 1000))}
          </span>
        </div>
      </div>
    </div>
  );
}

function PhaseChip({ label, active }: { label: string; active: boolean }) {
  const activeClass =
    label === "FCFS"
      ? "border-brand/25 bg-brand/[0.07] text-brand"
      : "border-mint/25 bg-mint/[0.07] text-mint";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.16em]",
        active
          ? activeClass
          : "border-paper/[0.08] bg-paper/[0.02] text-paper-mute",
      )}
    >
      {active ? (
        <Check aria-hidden="true" className="size-3" />
      ) : (
        <Minus aria-hidden="true" className="size-3" />
      )}
      {label}
      <span className="sr-only">{active ? "eligible" : "not eligible"}</span>
    </span>
  );
}
