"use client";

import { WalletAccessGate } from "@/components/wallet-access-gate";
import { CheckerContent } from "./checker-content";

export function CheckerAccessGate() {
  return (
    <WalletAccessGate
      eyebrow="Private checker"
      title="Authorized wallet only."
      connectPrompt="Connect the authorized wallet to open the mint checker."
      wrongWalletPrompt="This wallet doesn't have access to the checker. Switch to the authorized wallet to continue."
    >
      <CheckerContent />
    </WalletAccessGate>
  );
}
