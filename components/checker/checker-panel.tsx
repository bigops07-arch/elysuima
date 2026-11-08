"use client";

import { useState, useSyncExternalStore } from "react";
import {
  AlertTriangle,
  ChevronDown,
  Loader2,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import type { Address } from "viem";
import { useMintEligibility } from "@/hooks/use-mint-eligibility";
import { shortAddress } from "@/lib/format";
import type { MintEligibilityTier } from "@/lib/mint-eligibility";
import { cn } from "@/lib/utils";
import { CheckerAddressLookup } from "./checker-lookup";
import { EligibilityResult } from "./checker-result";

const PHASE_PREVIEW: {
  key: MintEligibilityTier;
  label: string;
  title: string;
  copy: string;
  tone: string;
}[] = [
  {
    key: "gtd",
    label: "GTD",
    title: "Guaranteed Mint",
    copy: "Your spot is reserved.",
    tone: "border-mint/25 bg-mint/[0.04] text-mint",
  },
  {
    key: "fcfs",
    label: "FCFS",
    title: "First Come",
    copy: "Mint early while open.",
    tone: "border-brand/25 bg-brand/[0.04] text-brand",
  },
  {
    key: "both",
    label: "GTD + FCFS",
    title: "Full Access",
    copy: "Both phases unlocked.",
    tone: "border-mint/25 bg-gradient-to-br from-mint/[0.05] to-brand/[0.05] text-brand",
  },
  {
    key: "none",
    label: "—",
    title: "No Allocation",
    copy: "Not on either list.",
    tone: "border-paper/[0.08] bg-paper/[0.02] text-paper-mute",
  },
];

const emptySubscribe = () => () => {};

/** Wagmi reconnects on the client, so avoid guessing the wallet state on SSR. */
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function CheckerPanel() {
  const mounted = useMounted();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const query = useMintEligibility(
    isConnected ? address : undefined,
    isConnected ? address : undefined,
  );

  const connected = mounted && isConnected && Boolean(address);
  const retry = () => void query.refetch();
  const [mode, setMode] = useState<"wallet" | "address">("wallet");

  return (
    <section
      aria-labelledby="checker-heading"
      className="glass card-sheen relative flex h-full flex-col overflow-hidden rounded-[28px] p-5 sm:p-6"
    >
      <header className="flex items-center justify-between gap-3 border-b border-paper/[0.07] pb-4">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
              Wallet check
            </p>
            <h2
              id="checker-heading"
              className="mt-0.5 text-xl font-semibold tracking-[-0.03em] text-paper sm:text-2xl"
            >
              Your mint access
            </h2>
          </div>
        </div>

        {connected && address ? (
          <WalletChip address={address} onOpen={openAccountModal} />
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-paper/10 bg-paper/[0.03] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-paper-mute">
            <span className="size-1.5 rounded-full bg-paper-mute" />
            Not connected
          </span>
        )}
      </header>

      <div
        role="group"
        aria-label="Checker mode"
        className="mt-4 grid grid-cols-2 gap-1 rounded-full border border-paper/10 bg-ink/40 p-1"
      >
        <button
          type="button"
          id="checker-tab-wallet"
          aria-controls="checker-panel-wallet"
          aria-pressed={mode === "wallet"}
          onClick={() => setMode("wallet")}
          className={cn(
            "inline-flex h-10 items-center justify-center gap-1.5 rounded-full text-[13px] font-semibold transition",
            mode === "wallet"
              ? "bg-brand/15 text-brand"
              : "text-paper-mute hover:text-paper",
          )}
        >
          <Wallet className="size-4" />
          My wallet
        </button>
        <button
          type="button"
          id="checker-tab-address"
          aria-controls="checker-panel-address"
          aria-pressed={mode === "address"}
          onClick={() => setMode("address")}
          className={cn(
            "inline-flex h-10 items-center justify-center gap-1.5 rounded-full text-[13px] font-semibold transition",
            mode === "address"
              ? "bg-brand/15 text-brand"
              : "text-paper-mute hover:text-paper",
          )}
        >
          <ScanSearch className="size-4" />
          Any address
        </button>
      </div>

      <div className="flex flex-1 flex-col py-5">
        <div
          id="checker-panel-wallet"
          className={cn(
            "flex flex-1 flex-col justify-center",
            mode !== "wallet" && "hidden",
          )}
        >
          {!mounted ? (
            <PanelSkeleton />
          ) : !connected || !address ? (
            <DisconnectedState />
          ) : query.isPending ? (
            <CheckingState address={address} />
          ) : query.isError ? (
            <ErrorState message={query.error?.message} />
          ) : query.data ? (
            <EligibilityResult data={query.data} />
          ) : (
            <PanelSkeleton />
          )}
        </div>

        <div
          id="checker-panel-address"
          className={cn(mode !== "address" && "hidden")}
        >
          <CheckerAddressLookup />
        </div>
      </div>

      {mode === "wallet" ? (
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-paper/[0.07] pt-4">
          {!mounted ? (
            <button
              type="button"
              disabled
              className="btn-primary w-full px-5 text-sm sm:w-auto"
            >
              <Wallet className="size-4" />
              Connect wallet
            </button>
          ) : !connected ? (
            <button
              type="button"
              onClick={openConnectModal}
              disabled={!openConnectModal}
              className="btn-primary w-full px-5 text-sm sm:w-auto"
            >
              <Wallet className="size-4" />
              Connect wallet
            </button>
          ) : query.isPending ? (
            <button
              type="button"
              disabled
              className="btn-primary w-full px-5 text-sm sm:w-auto"
            >
              <Loader2 className="size-4 animate-spin" />
              Checking…
            </button>
          ) : query.isError ? (
            <button
              type="button"
              onClick={retry}
              disabled={query.isFetching}
              className="btn-primary w-full px-5 text-sm sm:w-auto"
            >
              <RefreshCw
                className={cn("size-4", query.isFetching && "animate-spin")}
              />
              {query.isFetching ? "Retrying…" : "Try again"}
            </button>
          ) : (
            <button
              type="button"
              onClick={retry}
              disabled={query.isFetching}
              className="btn-primary w-full px-5 text-sm sm:w-auto"
            >
              <RefreshCw
                className={cn("size-4", query.isFetching && "animate-spin")}
              />
              {query.isFetching ? "Checking…" : "Recheck"}
            </button>
          )}

          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper-mute">
            No signature · No gas · Read-only
          </p>
        </footer>
      ) : null}
    </section>
  );
}

function WalletChip({
  address,
  onOpen,
}: {
  address: Address;
  onOpen?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={!onOpen}
      aria-label={`Connected wallet ${address}. Change wallet.`}
      className="inline-flex items-center gap-2 rounded-full border border-paper/10 bg-paper/[0.04] px-3 py-1.5 font-mono text-xs text-paper-dim transition hover:border-brand/40 hover:text-paper disabled:cursor-default"
    >
      <span className="size-1.5 rounded-full bg-mint shadow-[0_0_8px_rgba(125,240,196,0.8)]" />
      {shortAddress(address, 4)}
      <ChevronDown className="size-3 text-paper-mute" />
    </button>
  );
}

function DisconnectedState() {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper-mute">
          Possible results
        </p>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-paper-mute">
          <ShieldCheck className="size-3 text-brand" />
          Read-only
        </span>
      </div>

      <PhaseGuide className="mt-3" />

      <p className="mt-4 text-center text-sm leading-6 text-paper-mute">
        Connect a wallet to see which phase you qualify for.
      </p>
    </div>
  );
}

function CheckingState({ address }: { address: Address }) {
  return (
    <div>
      <div className="flex items-center justify-center gap-2 text-[15px] text-paper-dim">
        <Loader2 className="size-4 animate-spin text-brand" />
        Checking the GTD and FCFS lists…
      </div>

      <PhaseGuide className="mt-4 opacity-60" />

      <p className="mt-4 text-center text-[13px] leading-6 text-paper-mute">
        Reading{" "}
        <span className="font-mono text-paper-dim">
          {shortAddress(address)}
        </span>
        . The first check can take a few seconds.
      </p>
    </div>
  );
}

function ErrorState({ message }: { message?: string }) {
  const friendly =
    message && message.toLowerCase().includes("too many")
      ? message
      : "The allowlist is temporarily unavailable. Your wallet was not marked as ineligible.";

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-warn/25 bg-warn/[0.04] p-5 text-center sm:p-6"
    >
      <span className="mx-auto flex size-11 items-center justify-center rounded-xl border border-warn/30 bg-warn/10 text-warn">
        <AlertTriangle className="size-5" />
      </span>
      <h3 className="mt-3 text-lg font-semibold text-paper">
        Couldn&apos;t check the lists
      </h3>
      <p className="mt-2 text-sm leading-6 text-paper-mute">{friendly}</p>
    </div>
  );
}


function PhaseGuide({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-2 sm:grid-cols-4", className)}>
      {PHASE_PREVIEW.map((phase) => (
        <div
          key={phase.key}
          className={cn("rounded-xl border p-3", phase.tone)}
        >
          <div className="flex items-center justify-between gap-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em]">
              {phase.label}
            </span>
            <span className="size-1 rounded-full bg-current" />
          </div>
          <p className="mt-1.5 text-[15px] font-semibold leading-5 text-paper">
            {phase.title}
          </p>
          <p className="mt-1 text-[13px] leading-5 text-paper-mute">
            {phase.copy}
          </p>
        </div>
      ))}
    </div>
  );
}


function PanelSkeleton() {
  return (
    <div className="animate-pulse space-y-3 py-3">
      <div className="h-3.5 w-28 rounded-full bg-paper/[0.06]" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-24 rounded-xl bg-paper/[0.04]" />
        ))}
      </div>
      <div className="h-3 w-2/3 rounded-full bg-paper/[0.04]" />
    </div>
  );
}
