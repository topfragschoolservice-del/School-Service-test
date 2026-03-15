export const getTodayKey = () => new Date().toISOString().slice(0, 10);

export const monthOptions = [
  { label: 'January 2026', month: 1, year: 2026 },
  { label: 'February 2026', month: 2, year: 2026 },
  { label: 'March 2026', month: 3, year: 2026 },
];

export const formatMonthLabel = (month, year) => {
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

export const formatPaymentMonth = (month, year) => formatMonthLabel(month, year);
