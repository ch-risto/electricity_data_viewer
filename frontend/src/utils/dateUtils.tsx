export const formatDateFromDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fi-FI", {
    day: "numeric",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatDateFromDatetime = (datetimeStr: string | null): string => {
  if (!datetimeStr) return "-";
  const date = new Date(datetimeStr);
  const dateStr = date.toISOString().split("T")[0];
  return formatDateFromDate(dateStr);
};

export const formatTimeFromDatetime = (datetimeStr: string | null): string => {
  if (!datetimeStr) return "-";
  const date = new Date(datetimeStr);
  return date.toLocaleTimeString("fi-FI", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
