"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { isAddress, type Address } from "viem";
import { useAccount } from "wagmi";
import {
  AlertTriangle,
  Loader2,
  RefreshCw,
  ScanSearch,
  Search,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";
import { useMintEligibility } from "@/hooks/use-mint-eligibility";
import { shortAddress } from "@/lib/format";
import { cn } from "@/lib/utils";
import { EligibilityResult } from "./checker-result";

export function CheckerAddressLookup() {
  const { address: connectedAddress } = useAccount();
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);
  const query = useMintEligibility(checked ?? undefined);

  // Seed the field with the connected wallet once it reconnects, but never
  // overwrite an address the visitor typed in themselves.
  const prefilledAddress = useRef<string | null>(null);

  useEffect(() => {
    if (!connectedAddress) return;

    const previous = prefilledAddress.current?.toLowerCase();

    setInput((current) => {
      const normalized = current.trim().toLowerCase();
      if (!normalized || normalized === previous) return connectedAddress;
      return current;
    });

    prefilledAddress.current = connectedAddress;
  }, [connectedAddress]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = input.trim();
    if (!isAddress(value, { strict: false })) {
      setError("Enter a valid EVM wallet address.");
      setChecked(null);
      return;
    }

    setError(null);

    if (checked?.toLowerCase() === value.toLowerCase()) {
      void query.refetch();
      return;
    }

    setChecked(value as Address);
  };

  const reset = () => {
    setInput("");
    setChecked(null);
    setError(null);
  };

  return (
    <div>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand">
          <ScanSearch className="size-5" />
        </span>
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-paper">
            Check a wallet
          </h3>
          <p className="mt-1 max-w-lg text-sm leading-6 text-paper-dim">
            Enter any EVM address to read its GTD and FCFS access. Nothing is
            signed and no gas is spent.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="lookup-address"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper-mute"
          >
            Wallet address
          </label>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-mute/60">
            EVM · 0x…
          </span>
        </div>

        <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-paper-mute"
            />
            <input
              id="lookup-address"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                if (error) setError(null);
              }}
              placeholder="0x… wallet address"
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              aria-invalid={Boolean(error)}
              aria-describedby={
                error ? "lookup-hint lookup-error" : "lookup-hint"
              }
              className="h-14 w-full rounded-2xl border border-paper/10 bg-ink/60 pl-11 pr-12 font-mono text-sm text-paper outline-none transition placeholder:text-paper-mute/70 focus:border-brand/50 focus:ring-4 focus:ring-brand/[0.08]"
            />
            {input ? (
              <button
                type="button"
                onClick={reset}
                aria-label="Clear address and result"
                className="absolute right-3 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-paper-mute transition hover:bg-paper/[0.06] hover:text-paper"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={query.isFetching}
            className="btn-primary h-14 shrink-0 px-6 text-sm"
          >
            {query.isFetching ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            {query.isFetching ? "Checking…" : "Check wallet"}
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p
            id="lookup-hint"
            className="inline-flex items-center gap-1.5 text-[11px] text-paper-mute"
          >
            <ShieldCheck className="size-3 text-brand" />
            Read-only · No signature · No gas
          </p>
        </div>

        {error ? (
          <p
            id="lookup-error"
            role="alert"
            className="mt-3 flex items-start gap-1.5 text-[12px] leading-5 text-danger"
          >
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
            {error}
          </p>
        ) : null}
      </form>

      <div className="mt-4" aria-live="polite">
        {checked ? (
          query.isPending ? (
            <LookupLoading address={checked} />
          ) : query.isError ? (
            <LookupError
              message={query.error?.message}
              retrying={query.isFetching}
              onRetry={() => void query.refetch()}
            />
          ) : query.data ? (
            <EligibilityResult
              data={query.data}
              address={checked}
              showActions={false}
            />
          ) : (
            <LookupLoading address={checked} />
          )
        ) : (
          <LookupEmpty />
        )}
      </div>
    </div>
  );
}

function LookupEmpty() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-dashed border-paper/[0.12] bg-paper/[0.015] px-4 py-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-paper/10 bg-paper/[0.03] text-paper-mute">
        <Wallet className="size-4" />
      </span>
      <p className="text-sm leading-6 text-paper-mute">
        Enter a wallet address and hit Check wallet to see which mint phases it
        qualifies for.
      </p>
    </div>
  );
}

function LookupLoading({ address }: { address: Address }) {
  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-2xl border border-brand/20 bg-brand/[0.04] px-4 py-4"
    >
      <Loader2 className="size-4 shrink-0 animate-spin text-brand" />
      <p className="text-sm leading-6 text-paper-dim">
        Checking{" "}
        <span className="font-mono text-paper">{shortAddress(address, 6)}</span>{" "}
        against the GTD and FCFS lists…
      </p>
    </div>
  );
}

function LookupError({
  message,
  retrying,
  onRetry,
}: {
  message?: string;
  retrying: boolean;
  onRetry: () => void;
}) {
  const friendly =
    message ?? "The allowlist is temporarily unavailable. Try again in a moment.";

  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-2xl border border-warn/25 bg-warn/[0.04] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-warn/30 bg-warn/10 text-warn">
          <AlertTriangle className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-paper">
            Couldn&apos;t check this wallet
          </p>
          <p className="mt-0.5 text-[12px] leading-5 text-paper-mute">
            {friendly}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className="btn-ghost h-10 shrink-0 self-start px-4 text-xs sm:self-center"
      >
        <RefreshCw className={cn("size-3.5", retrying && "animate-spin")} />
        {retrying ? "Retrying…" : "Try again"}
      </button>
    </div>
  );
}
