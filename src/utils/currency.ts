export function formatGHS(amount: number): string {
  return `GHS ${amount.toLocaleString('en-GH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function parseGHS(value: string): number {
  return parseFloat(value.replace(/GHS\s?|,/g, '')) || 0;
}

export function formatCompact(amount: number): string {
  if (amount >= 1_000_000) return `GHS ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `GHS ${(amount / 1_000).toFixed(1)}K`;
  return formatGHS(amount);
}
