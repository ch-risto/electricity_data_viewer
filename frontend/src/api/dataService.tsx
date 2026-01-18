// Base URL for the electricity-related API endpoints
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/electricity";

// Interface for individual electricity data points
export interface ElectricityData {
  starttime: string | null;
  productionamount: number | null;
  consumptionamount: number | null;
  hourlyprice: number | null;
}

// Interface for a list of electricity data for a specific date
export interface ElectricityDataList {
  date: string;
  data: ElectricityData[];
}

// For the summary of electricity data for a specific date
export interface ElectricityDataSummary {
  date: string;
  total_consumption: number | null;
  total_production: number | null;
  avg_price: number | null;
}

// For negative price period data
export interface NegativePricePeriod {
  start_time: string | null;
  duration_hours: number | null;
  avg_price: number | null;
}

// For the minimum and maximun date range
export interface DateRange {
  minDate: string | "minimiPvm";
  maxDate: string | "maximiPvm";
}

// Fetches all electricitydata for a specific date
export const fetchAllDataByDate = async (
  date: string,
): Promise<ElectricityDataList> => {
  try {
    console.log("Trying to fetch data");
    const response = await fetch(`${BASE_URL}/by_date/${date}`);
    console.log(response);

    // Errorhandling for response
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Data for the day was not found");
      }
      throw new Error("Network response was not ok");
    }

    // Parse and return the data
    const data: ElectricityDataList = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Getches the summary of electricity data for a specific date
export const fetchSummaryDataByDate = async (
  date: string,
): Promise<ElectricityDataSummary> => {
  try {
    const response = await fetch(`${BASE_URL}/electricity_summary/${date}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Data for the day was not found");
      }
      throw new Error("Network response was not ok");
    }

    const data: ElectricityDataSummary = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Fetches longest negative price period for a specific date
export const fetchNegativePricePeriod = async (
  date: string,
): Promise<NegativePricePeriod> => {
  try {
    const response = await fetch(`${BASE_URL}/negative_price_period/${date}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Data for the day was not found");
      }
      throw new Error("Network response was not ok");
    }
    const data: NegativePricePeriod = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetchin negative price data:", error);
    throw error;
  }
};

// Fetches the min and max date range for the API
export const fetchMinMaxDaterange = async (): Promise<DateRange> => {
  try {
    const response = await fetch(`${BASE_URL}/date_range`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: DateRange = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
