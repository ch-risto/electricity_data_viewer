export const kWhToMWh = (kWh: number | null): string => {
  if (!kWh) return "-";
  const mWh = kWh / 1000;
  return `${new Intl.NumberFormat("fi-FI", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(mWh)} MWh`;
};
