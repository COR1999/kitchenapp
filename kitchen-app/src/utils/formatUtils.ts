// Centralized date formatting utilities
export const formatDate = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString();
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

export const formatPercentage = (value: number, total: number): number => {
  return total > 0 ? Math.round((value / total) * 100) : 0;
};

// Calculate totals for invoice items
export const calculateItemsTotal = (items: Array<{ totalPrice: number }>): number => {
  return items.reduce((sum, item) => sum + item.totalPrice, 0);
};