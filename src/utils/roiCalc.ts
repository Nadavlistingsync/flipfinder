export function calculateROI(buyPrice: number, resalePrice: number, fees: number = 0): number {
  if (buyPrice <= 0) return 0;
  return ((resalePrice - buyPrice - fees) / buyPrice) * 100;
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