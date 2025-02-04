import { useEffect, useState } from 'react'
import {
  fetchAllDataByDate,
  ElectricityDataList,
  ElectricityDataSummary,
  fetchSummaryDataByDate
} from '../api/dataService.tsx'


export const useFetchElectricityData = (date: string | null) => {
  const [data, setData] = useState<ElectricityDataList | null>(null);
  const [summaryData, setSummaryData] = useState<ElectricityDataSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!date) return;

      setLoading(true);
      setError(false);
      setErrorMessage(null);
      setData(null);
      setSummaryData(null);

      try {
        const fetchedData = await fetchAllDataByDate(date);
        const fetchedSummaryData = await fetchSummaryDataByDate(date);
        console.log("useFetchElectricityData", fetchedData);

        setData(fetchedData);
        setSummaryData(fetchedSummaryData);

      } catch (error: unknown) {
        console.error('Error loading data:', error);
        setError(true);
        if ((error as Error).message === 'Data for the day was not found') {
          setErrorMessage("Data for the day was not found")
        } else {
          setErrorMessage("Error while loading data..")
        }
        setData(null);
        setSummaryData(null);
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, [date]);

  return { data, summaryData, loading, error, errorMessage };
};
