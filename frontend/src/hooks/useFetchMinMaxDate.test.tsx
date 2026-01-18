import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchMinMaxDaterange } from "../api/dataService";
import { renderHook, waitFor } from "@testing-library/react";
import { useFetchMinMaxDate } from "./useFetchMinMaxDate";

vi.mock("../api/dataService");

describe("useFetchMinMaxDate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and format date range", async () => {
    vi.mocked(fetchMinMaxDaterange).mockResolvedValue({
      minDate: "2024-01-01",
      maxDate: "2024-12-31",
    });

    const { result } = renderHook(() => useFetchMinMaxDate());

    await waitFor(() => {
      expect(result.current.dateRange.minDate).toBe("1.1.2024");
      expect(result.current.dateRange.maxDate).toBe("31.12.2024");
    });
  });

  it("should handle fetch error gracefully", async () => {
    vi.mocked(fetchMinMaxDaterange).mockRejectedValue(new Error("Fetch error"));
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useFetchMinMaxDate());

    await waitFor(() => {
      expect(result.current.dateRange.minDate).toBe("");
      expect(result.current.dateRange.maxDate).toBe("");
    });

    consoleErrorSpy.mockRestore();
  });
});
