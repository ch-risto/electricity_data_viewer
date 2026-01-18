import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchAllDataByDate,
  fetchMinMaxDaterange,
  fetchNegativePricePeriod,
  fetchSummaryDataByDate,
} from "../api/dataService";

// Mock the entire module
vi.mock("../api/dataService", () => ({
  fetchAllDataByDate: vi.fn(),
  fetchMinMaxDaterange: vi.fn(),
  fetchSummaryDataByDate: vi.fn(),
  fetchNegativePricePeriod: vi.fn(),
}));

describe("fetchAllDataByDate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch all data by date", async () => {
    const mockData = {
      date: "2024-01-01",
      data: [
        {
          starttime: "2024-01-01T00:00:00Z",
          productionamount: 1000,
          consumptionamount: 800,
          hourlyprice: 50,
        },
        {
          starttime: "2024-01-02T00:00:00Z",
          productionamount: 1500,
          consumptionamount: 1200,
          hourlyprice: 45,
        },
      ],
    };

    vi.mocked(fetchAllDataByDate).mockResolvedValue(mockData);

    const result = await fetchAllDataByDate("2024-01-01");
    expect(result.data.length).toBe(2);
    expect(result.data[0].productionamount).toBe(1000);
  });

  it("should handle fetch error gracefully", async () => {
    vi.mocked(fetchAllDataByDate).mockRejectedValue(new Error("Fetch error"));
    await expect(fetchAllDataByDate("2024-01-01")).rejects.toThrow(
      "Fetch error",
    );
  });
});

describe("fetchSummaryDataByDate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch summary data by date", async () => {
    const mockSummaryData = {
      date: "2024-01-01",
      total_consumption: 2000,
      total_production: 2500,
      avg_price: 47.5,
    };
    vi.mocked(fetchSummaryDataByDate).mockResolvedValue(mockSummaryData);

    const result = await fetchSummaryDataByDate("2024-01-01");
    expect(result.total_consumption).toBe(2000);
    expect(result.avg_price).toBe(47.5);
  });

  it("should handle fetch error gracefully", async () => {
    vi.mocked(fetchSummaryDataByDate).mockRejectedValue(
      new Error("Fetch error"),
    );
    await expect(fetchSummaryDataByDate("2024-01-01")).rejects.toThrow(
      "Fetch error",
    );
  });
});

describe("fetchNegativePricePeriod", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch negative price period by date", async () => {
    const mockNegativePricePeriod = {
      start_time: "2024-01-01T03:00:00Z",
      duration_hours: 2,
      avg_price: -5.0,
    };
    vi.mocked(fetchNegativePricePeriod).mockResolvedValue(
      mockNegativePricePeriod,
    );
    const result = await fetchNegativePricePeriod("2024-01-01");
    expect(result.duration_hours).toBe(2);
    expect(result.avg_price).toBe(-5.0);
  });

  it("should handle fetch error gracefully", async () => {
    vi.mocked(fetchNegativePricePeriod).mockRejectedValue(
      new Error("Fetch error"),
    );
    await expect(fetchNegativePricePeriod("2024-01-01")).rejects.toThrow(
      "Fetch error",
    );
  });
});

describe("fetchMinMaxDaterange", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch min and max date range", async () => {
    const mockDateRange = {
      minDate: "2024-01-01",
      maxDate: "2024-12-31",
      minDateRaw: "2024-01-01",
      maxDateRaw: "2024-12-31",
    };
    vi.mocked(fetchMinMaxDaterange).mockResolvedValue(mockDateRange);
    const result = await fetchMinMaxDaterange();
    expect(result.minDate).toBe("2024-01-01");
    expect(result.maxDate).toBe("2024-12-31");
  });

  it("should handle fetch error gracefully", async () => {
    vi.mocked(fetchMinMaxDaterange).mockRejectedValue(new Error("Fetch error"));
    await expect(fetchMinMaxDaterange()).rejects.toThrow("Fetch error");
  });
});
