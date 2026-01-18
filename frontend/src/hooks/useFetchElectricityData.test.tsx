import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchAllDataByDate,
  fetchSummaryDataByDate,
  fetchNegativePricePeriod,
  ElectricityDataList,
  ElectricityDataSummary,
  NegativePricePeriod,
} from "../api/dataService";
import { renderHook, waitFor } from "@testing-library/react";
import { useFetchElectricityData } from "./useFetchElectricityData";

vi.mock("../api/dataService");

describe("useFetchElectricityData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return initial state when date is null", () => {
    const { result } = renderHook(() => useFetchElectricityData(null));

    expect(result.current.data).toBeNull();
    expect(result.current.summaryData).toBeNull();
    expect(result.current.negativePricePeriod).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it("should fetch all electricity data for a given date", async () => {
    const mockData: ElectricityDataList = {
      date: "2024-01-01",
      data: [
        {
          starttime: "2024-01-01T00:00:00Z",
          productionamount: 1000,
          consumptionamount: 800,
          hourlyprice: 50,
        },
      ],
    };
    const mockSummaryData: ElectricityDataSummary = {
      date: "2024-01-01",
      total_consumption: 2000,
      total_production: 2500,
      avg_price: 47.5,
    };
    const mockNegativePriceData: NegativePricePeriod = {
      start_time: "2024-01-01T03:00:00Z",
      duration_hours: 2,
      avg_price: -5.0,
    };

    vi.mocked(fetchAllDataByDate).mockResolvedValue(mockData);
    vi.mocked(fetchSummaryDataByDate).mockResolvedValue(mockSummaryData);
    vi.mocked(fetchNegativePricePeriod).mockResolvedValue(
      mockNegativePriceData,
    );

    const { result } = renderHook(() => useFetchElectricityData("2024-01-01"));

    // Initially loading should be true
    expect(result.current.loading).toBe(true);

    // Wait for async operations to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.summaryData).toEqual(mockSummaryData);
    expect(result.current.negativePricePeriod).toEqual(mockNegativePriceData);
    expect(result.current.error).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it("should set loading to true while fetching", async () => {
    vi.mocked(fetchAllDataByDate).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );
    vi.mocked(fetchSummaryDataByDate).mockResolvedValue({
      date: "2024-01-01",
      total_consumption: 0,
      total_production: 0,
      avg_price: 0,
    });
    vi.mocked(fetchNegativePricePeriod).mockResolvedValue({
      start_time: null,
      duration_hours: 0,
      avg_price: 0,
    });

    const { result } = renderHook(() => useFetchElectricityData("2024-01-01"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("should handle fetch error gracefully", async () => {
    const errorMessage = "Data for the day was not found";
    vi.mocked(fetchAllDataByDate).mockRejectedValue(new Error(errorMessage));
    vi.mocked(fetchSummaryDataByDate).mockResolvedValue({
      date: "2024-01-01",
      total_consumption: 0,
      total_production: 0,
      avg_price: 0,
    });
    vi.mocked(fetchNegativePricePeriod).mockResolvedValue({
      start_time: null,
      duration_hours: 0,
      avg_price: 0,
    });

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const { result } = renderHook(() => useFetchElectricityData("2024-01-01"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(true);
    expect(result.current.errorMessage).toBe(errorMessage);
    expect(result.current.data).toBeNull();
    expect(result.current.summaryData).toBeNull();
    expect(result.current.negativePricePeriod).toBeNull();
    consoleErrorSpy.mockRestore();
  });

  it("should refetch when date changes", async () => {
    const mockData1: ElectricityDataList = {
      date: "2024-01-01",
      data: [
        {
          starttime: "2024-01-01T00:00:00Z",
          productionamount: 1000,
          consumptionamount: 800,
          hourlyprice: 50,
        },
      ],
    };
    const mockData2: ElectricityDataList = {
      date: "2024-01-02",
      data: [
        {
          starttime: "2024-01-02T00:00:00Z",
          productionamount: 1500,
          consumptionamount: 900,
          hourlyprice: 45,
        },
      ],
    };
    const mockSummaryData: ElectricityDataSummary = {
      date: "2024-01-01",
      total_consumption: 2000,
      total_production: 2500,
      avg_price: 47.5,
    };
    const mockNegativePriceData: NegativePricePeriod = {
      start_time: null,
      duration_hours: 0,
      avg_price: 0,
    };

    vi.mocked(fetchAllDataByDate)
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2);
    vi.mocked(fetchSummaryDataByDate).mockResolvedValue(mockSummaryData);
    vi.mocked(fetchNegativePricePeriod).mockResolvedValue(
      mockNegativePriceData,
    );

    const { result, rerender } = renderHook(
      ({ date }) => useFetchElectricityData(date),
      { initialProps: { date: "2024-01-01" } },
    );

    // Wait for first fetch
    await waitFor(() => {
      expect(result.current.data?.date).toBe("2024-01-01");
    });

    // Change date
    rerender({ date: "2024-01-02" });

    // Wait for second fetch
    await waitFor(() => {
      expect(result.current.data?.date).toBe("2024-01-02");
    });

    expect(vi.mocked(fetchAllDataByDate)).toHaveBeenCalledTimes(2);
  });
});
