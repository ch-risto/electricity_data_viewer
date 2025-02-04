import { useEffect, useState } from "react";
import { DateRange, fetchMinMaxDaterange } from "../api/dataService";
import { formatDateFromDate } from "../utils/dateUtils"


// Hook to fetch the minimun and maximun date range
export const useFetchMinMaxDate = () => {
    // State variable for fetchet data
    const [dateRange, setDateRange] = useState<DateRange>({ minDate: "", maxDate: "" });

    useEffect(() => {
        // Async function to fetch the min and max date range from the API
        const fetchDates = async () => {

            try {
                // Fetch date range
                const fetchedDateRange = await fetchMinMaxDaterange();

                // Format and set fetchet data
                setDateRange({
                    minDate: formatDateFromDate(fetchedDateRange.minDate),
                    maxDate: formatDateFromDate(fetchedDateRange.maxDate)
                });
            } catch (error: unknown) {
                console.error('Error loading data:', error)
            }
        }

        // Fetch the date range on component moung
        fetchDates();
        // Empty dependency array -> runs only once
    }, [])

    return { dateRange }
}