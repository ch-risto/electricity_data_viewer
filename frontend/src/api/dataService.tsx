const BASE_URL = "http://localhost:8000/electricity";

export interface ElectricityData {
    starttime: string | null;
    productionamount: number | null;
    consumptionamount: number | null;
    hourlyprice: number | null;
}

export interface ElectricityDataList {
    date: string;
    data: ElectricityData[];
}

export interface ElectricityDataSummary {
    date: string;
    total_consumption: number | null;
    total_production: number | null;
    avg_price: number | null;
}

export interface DateRange {
    minDate: string | 'minimiPvm';
    maxDate: string | 'maximiPvm';
}

export const fetchAllDataByDate = async (date: string): Promise<ElectricityDataList> => {
    try {
        console.log("Trying to fetch data")
        const response = await fetch(`${BASE_URL}/by_date/${date}`);
        console.log(response)
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Data for the day was not found')
            }
            throw new Error('Network response was not ok');
        }
        const data: ElectricityDataList = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const fetchSummaryDataByDate = async (date: string): Promise<ElectricityDataSummary> => {
    try {
        const response = await fetch(`${BASE_URL}/electricity_summary/${date}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Data for the day was not found')
            }
            throw new Error('Network response was not ok');
        }
        const data: ElectricityDataSummary = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export const fetchMinMaxDaterange = async (): Promise<DateRange> => {
    try {
        const response = await fetch(`${BASE_URL}/date_range`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: DateRange = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error)
        throw error;
    }
}
