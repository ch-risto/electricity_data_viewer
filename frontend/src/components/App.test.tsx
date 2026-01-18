import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../App";
import { render, screen, waitFor } from "@testing-library/react";
import { fetchMinMaxDaterange } from "../api/dataService";

// Mock the data service to prevent fetch calls
vi.mock("../api/dataService", () => ({
  fetchAllDataByDate: vi.fn(),
  fetchMinMaxDaterange: vi.fn(),
}));

describe("App component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render title", async () => {
    vi.mocked(fetchMinMaxDaterange).mockResolvedValue({
      minDate: "2024-01-01",
      maxDate: "2024-12-31",
    });
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText("Check Electricity data")).toBeInTheDocument();
    });
  });

  it("should render date range after fetching", async () => {
    vi.mocked(fetchMinMaxDaterange).mockResolvedValue({
      minDate: "2024-01-01",
      maxDate: "2024-12-31",
    });
    render(<App />);
    await waitFor(() => {
      expect(
        screen.getByText(
          /There is electricitydata available from 1.1.2024 to 31.12.2024/,
        ),
      ).toBeInTheDocument();
    });
  });

  it("should handle fetch error gracefully", async () => {
    vi.mocked(fetchMinMaxDaterange).mockRejectedValue(new Error("Fetch error"));
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    render(<App />);
    await waitFor(() => {
      expect(
        screen.getByText(/There is electricitydata available from/),
      ).toBeInTheDocument();
    });
    consoleErrorSpy.mockRestore();
  });
});
