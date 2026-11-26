import { site } from "@/config/site";
import type { MembershipFee } from "@/lib/content/schemas";

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** "₹6,000", in the Indian grouping (₹1,00,000). */
export function formatRupees(amount: number): string {
  return rupees.format(amount);
}

/** A fee in words: "₹600 a year", "Free" or its note. Never a figure until
    the Board fixes fees. */
export function feeText(fee: MembershipFee): string {
  if (!site.governance.feesFixed) return "Fee to be fixed by the Board";
  if (fee.amount === null) return fee.note ?? "No fee";
  if (fee.amount === 0) return "Free";
  return `${formatRupees(fee.amount)} a year`;
}

/** The note under a fee, unless the note is the fee itself. */
export function feeNote(fee: MembershipFee): string | undefined {
  if (!site.governance.feesFixed || fee.amount === null) return undefined;
  return fee.note;
}

/** One line for several bands: "₹15,000 to ₹1,00,000 a year". */
export function feeRange(fees: MembershipFee[]): string {
  if (fees.length === 1) {
    const note = feeNote(fees[0]);
    return note ? `${feeText(fees[0])} (${note})` : feeText(fees[0]);
  }
  if (!site.governance.feesFixed) return "Fee to be fixed by the Board";
  const amounts = fees.flatMap((f) => (f.amount === null ? [] : [f.amount]));
  const low = Math.min(...amounts);
  const high = Math.max(...amounts);
  return `${formatRupees(low)} to ${formatRupees(high)} a year, by band`;
}
