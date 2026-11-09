"use client";

import { ShieldCheck } from "lucide-react";
import { CheckerAddressLookup } from "./checker-lookup";

export function CheckerPanel() {
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

        <span className="inline-flex items-center gap-1.5 rounded-full border border-paper/10 bg-paper/[0.03] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-paper-mute">
          <span className="size-1.5 rounded-full bg-brand" />
          Read-only
        </span>
      </header>

      <div className="flex flex-1 flex-col py-5">
        <CheckerAddressLookup />
      </div>
    </section>
  );
}
