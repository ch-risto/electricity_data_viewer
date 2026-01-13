// Format date string to Finnish locale date string
export const formatDateFromDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fi-FI", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
};

// Format datetime string to date string, if datetimeStr is null, returns "-"
export const formatDateFromDatetime = (datetimeStr: string | null): string => {
  if (!datetimeStr) return "-";
  const date = new Date(datetimeStr);
  const dateStr = date.toISOString().split("T")[0];
  return formatDateFromDate(dateStr);
};

// Function to format a datetime string to time string, if datetimeStr is null, returns "-"
export const formatTimeFromDatetime = (datetimeStr: string | null): string => {
  if (!datetimeStr) return "-";
  const date = new Date(datetimeStr);
  return date.toLocaleTimeString("fi-FI", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
