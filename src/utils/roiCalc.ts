/**
 * Calculates the Return on Investment (ROI) percentage
 * @param buyPrice - The price at which the item was purchased
 * @param resalePrice - The price at which the item will be resold
 * @returns The ROI percentage (e.g., 50 for 50%)
 */
export function calculateROI(buyPrice: number, resalePrice: number): number {
  if (buyPrice <= 0) return 0;
  return ((resalePrice - buyPrice) / buyPrice) * 100;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
} 