import { useEffect, useState } from "react";
import { DateRange, fetchMinMaxDaterange } from "../api/dataService";
import { formatDateFromDate } from "../utils/dateUtils";

export const useFetchMinMaxDate = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    minDate: "",
    maxDate: "",
  });

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const fetchedDateRange = await fetchMinMaxDaterange();
        console.log("daterange:", fetchedDateRange);
        setDateRange({
          minDate: formatDateFromDate(fetchedDateRange.minDate),
          maxDate: formatDateFromDate(fetchedDateRange.maxDate),
        });
      } catch (error: unknown) {
        console.error("Error loading data:", error);
      }
    };

    fetchDates();
  }, []);

  return { dateRange };
};
