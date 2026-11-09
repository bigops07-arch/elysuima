import { isAddress } from "viem";

/**
 * Wallets allowed into the private `/raffles` page. This is public
 * information: it is inlined into the browser bundle so the page, header, and
 * footer can hide it for every other wallet.
 *
 * `NEXT_PUBLIC_CHECKER_ACCESS_ADDRESS` accepts a comma-separated list and, when
 * set, replaces these defaults.
 */
const DEFAULT_CHECKER_ACCESS_ADDRESSES = [
  "0xa4575566BF5386CB5ba48EdcBeA71235bD94fE4d",
  "0xb181FDFe71A0a0f56574D88f22B6BaFD142192F6",
  "0x2f4418dA7b2FB57866D61F735405A75499a1B4bF",
] as const;

function parseAccessAddresses(value?: string) {
  const addresses = value
    ?.split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  return addresses?.length ? addresses : DEFAULT_CHECKER_ACCESS_ADDRESSES;
}

export const CHECKER_ACCESS_ADDRESSES = parseAccessAddresses(
  process.env.NEXT_PUBLIC_CHECKER_ACCESS_ADDRESS,
);

export function isAuthorizedAddress(address?: string | null) {
  if (!address || !isAddress(address, { strict: false })) return false;

  const normalized = address.toLowerCase();
  return CHECKER_ACCESS_ADDRESSES.some(
    (allowed) => allowed.toLowerCase() === normalized,
  );
}
