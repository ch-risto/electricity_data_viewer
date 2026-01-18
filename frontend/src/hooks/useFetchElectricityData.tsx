import { useEffect, useState } from "react";
import {
  fetchAllDataByDate,
  ElectricityDataList,
  ElectricityDataSummary,
  NegativePricePeriod,
  fetchSummaryDataByDate,
  fetchNegativePricePeriod,
} from "../api/dataService.tsx";

// Hook to fetch electricity data for a given date
export const useFetchElectricityData = (date: string | null) => {
  // State variables for fetchet data
  const [data, setData] = useState<ElectricityDataList | null>(null);
  const [summaryData, setSummaryData] = useState<ElectricityDataSummary | null>(
    null,
  );
  const [negativePricePeriod, setNegativePricePeriod] =
    useState<NegativePricePeriod | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Async function to fetch data when 'date' is provided
    const fetchData = async () => {
      // Exit if date is not provided (only when user picks the date)
      if (!date) return;

      // Set Loading true and clear or reset else
      setLoading(true);
      setError(false);
      setErrorMessage(null);
      setData(null);
      setSummaryData(null);
      setNegativePricePeriod(null);

      try {
        // Fetch data for date, summary and negative price period data for the given date
        const fetchedData = await fetchAllDataByDate(date);
        const fetchedSummaryData = await fetchSummaryDataByDate(date);
        const fetchedNegativePricePeriod = await fetchNegativePricePeriod(date);

        // Set fetchet data to variables
        setData(fetchedData);
        setSummaryData(fetchedSummaryData);
        setNegativePricePeriod(fetchedNegativePricePeriod);
      } catch (error: unknown) {
        console.error("Error loading data:", error);
        setError(true);
        if ((error as Error).message === "Data for the day was not found") {
          setErrorMessage("Data for the day was not found");
        } else {
          setErrorMessage("Error while loading data..");
        }
        setData(null);
        setSummaryData(null);
        setNegativePricePeriod(null);
      } finally {
        setLoading(false);
      }
    };

    // Call fetchData whenever the 'date' value changes
    fetchData();
    // Dependency array
  }, [date]);

  // Returns fetched variables
  return {
    data,
    summaryData,
    negativePricePeriod,
    loading,
    error,
    errorMessage,
  };
};
