import { useEffect, useState } from 'react'
import {
  fetchAllDataByDate,
  ElectricityDataList,
  ElectricityDataSummary,
  NegativePricePeriod,
  fetchSummaryDataByDate,
  fetchNegativePricePeriod
} from '../api/dataService.tsx'


export const useFetchElectricityData = (date: string | null) => {
  const [data, setData] = useState<ElectricityDataList | null>(null);
  const [summaryData, setSummaryData] = useState<ElectricityDataSummary | null>(null);
  const [negativePricePeriod, setNegativePricePeriod] = useState<NegativePricePeriod | null>(null);
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
      setNegativePricePeriod(null);

      try {
        const fetchedData = await fetchAllDataByDate(date);
        const fetchedSummaryData = await fetchSummaryDataByDate(date);
        const fetchedNegativePricePeriod = await fetchNegativePricePeriod(date);

        setData(fetchedData);
        setSummaryData(fetchedSummaryData);
        setNegativePricePeriod(fetchedNegativePricePeriod)

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
        setNegativePricePeriod(null);
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, [date]);

  return { data, summaryData, negativePricePeriod, loading, error, errorMessage };
};
