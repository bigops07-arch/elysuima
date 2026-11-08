"use client";

import { WalletAccessGate } from "@/components/wallet-access-gate";
import { RafflesContent } from "./raffles-content";

export function RafflesAccessGate() {
  return (
    <WalletAccessGate
      eyebrow="Private raffles"
      title="Authorized wallet only."
      connectPrompt="Connect the authorized wallet to open the raffles."
      wrongWalletPrompt="This wallet doesn't have access to the raffles. Switch to the authorized wallet to continue."
    >
      <RafflesContent />
    </WalletAccessGate>
  );
}
