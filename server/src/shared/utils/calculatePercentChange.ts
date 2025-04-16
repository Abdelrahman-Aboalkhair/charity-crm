const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0; // Avoid division by zero
  return Number((((current - previous) / previous) * 100).toFixed(2));
};

export default calculatePercentageChange;
