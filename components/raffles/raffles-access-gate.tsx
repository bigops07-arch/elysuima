"use client";

import { WalletAccessGate } from "@/components/wallet-access-gate";
import { RafflesContent } from "./raffles-content";

export function RafflesAccessGate() {
  return (
    <WalletAccessGate
      eyebrow="Private raffles"
      title="Authorized wallet only."
      connectPrompt="Connect an authorized wallet to open the raffles."
      wrongWalletPrompt="This wallet doesn't have access to the raffles. Switch to an authorized wallet to continue."
    >
      <RafflesContent />
    </WalletAccessGate>
  );
}
