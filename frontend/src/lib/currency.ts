export let INR_PER_EUR = 90;

export function setInrPerEur(rate: number): void {
  if (Number.isFinite(rate) && rate > 0) {
    INR_PER_EUR = rate;
  }
}

export function getInrPerEur(): number {
  return INR_PER_EUR;
}

export function toEuro(inrAmount: number, rate: number = INR_PER_EUR): number {
  if (!Number.isFinite(inrAmount) || inrAmount <= 0) return 0;
  const effectiveRate = Number.isFinite(rate) && rate > 0 ? rate : 90;
  return Math.round(inrAmount / effectiveRate);
}

export function formatEuro(inrAmount: number, rate: number = INR_PER_EUR): string {
  return `€${toEuro(inrAmount, rate).toLocaleString('en-US')}`;
}

export function formatInr(inrAmount: number): string {
  if (!Number.isFinite(inrAmount)) return '₹0';
  return `₹${Math.round(inrAmount).toLocaleString('en-IN')}`;
}
