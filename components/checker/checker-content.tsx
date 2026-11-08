"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { CheckerPanel } from "./checker-panel";

export function CheckerContent() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="animate-breathe absolute left-1/2 top-[-14%] size-[440px] -translate-x-1/2 rounded-full bg-brand/[0.15] blur-[120px]" />
          <div className="absolute -left-32 top-1/3 size-[340px] rounded-full bg-beak/[0.07] blur-[120px]" />
        </div>

        <div className="section-shell relative pb-8 pt-12 sm:pb-10 sm:pt-16">
          <div className="animate-rise mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-2xl border border-paper/10 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.8)]">
                  <Image
                    src="/collection/elyziuma.jpg"
                    alt=""
                    fill
                    priority
                    sizes="56px"
                    className="object-cover"
                  />
                </span>
                <span className="eyebrow">Mint checker</span>
              </div>

              <h1 className="mt-5 font-display text-[clamp(2.3rem,5.4vw,3.9rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-paper">
                Check your{" "}
                <span className="text-gradient">mint access.</span>
              </h1>

              <p className="mt-4 max-w-xl text-[15px] leading-7 text-paper-dim">
                Connect the wallet you plan to mint with. We read the GTD and
                FCFS lists — no signature, no gas.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 lg:justify-end">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/20 bg-mint/[0.06] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-mint">
                <span className="size-1.5 rounded-full bg-mint" />
                GTD list
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/[0.06] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-brand">
                <span className="size-1.5 rounded-full bg-brand" />
                FCFS list
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section-shell relative pb-16 sm:pb-20"
        aria-label="Mint eligibility checker"
      >
        <div className="mx-auto grid max-w-6xl items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-5">
          <CheckerPanel />

          <aside className="glass flex flex-col justify-between rounded-[28px] p-5 sm:p-6">
            <section>
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-beak/30 bg-beak/10 text-beak">
                  <Flame className="size-5" />
                </span>
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-paper">
                  Kalos Genesis Holders
                </h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-paper-dim">
                All Kalos Genesis holders are automatically eligible for the
                FCFS phase. No wallet verification is required.
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-beak/25 bg-beak/[0.06] px-3 py-1.5 text-xs font-semibold text-beak">
                Your WL spot is secured. 🔥
              </p>
            </section>

            <div className="my-5 h-px bg-paper/[0.07]" />

            <section>
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand">
                  <Sparkles className="size-5" />
                </span>
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-paper">
                  Your Journey Doesn&apos;t End Here.
                </h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-paper-dim">
                Mint your Elyziuma NFT and keep holding. There may be more
                waiting for you beyond the mint. 👀
              </p>
              <Link
                href="/launchpad"
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full border border-paper/10 bg-paper/[0.03] text-sm font-semibold text-paper transition hover:border-brand/40 hover:bg-brand/[0.08]"
              >
                Open the launchpad
                <ArrowRight className="size-3.5" />
              </Link>
            </section>
          </aside>
        </div>

        <p className="mx-auto mt-5 max-w-6xl text-center font-mono text-[11px] uppercase tracking-[0.16em] text-paper-mute/70">
          Informational only · The launchpad contract remains the final authority
        </p>
      </section>
    </>
  );
}
