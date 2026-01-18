import { describe, it, expect } from "vitest";
import {
  formatDateFromDate,
  formatDateFromDatetime,
  formatTimeFromDatetime,
} from "./dateUtils";

describe("dateUtils", () => {
  it("should format date to Finnish locale", () => {
    const result = formatDateFromDate("2024-06-15");
    expect(result).toBe("15.6.2024");
  });

  it('should return "-" for null datetime', () => {
    const result = formatDateFromDate(null);
    expect(result).toBe("-");
  });

  it("should format datetime to Finnish locale date", () => {
    const result = formatDateFromDatetime("2024-06-15T14:30:00Z");
    expect(result).toBe("15.6.2024");
  });

  it("should format time from datetime", () => {
    // 14:30 UTC is 17:30 in Helsinki (EEST, UTC+3) in June
    // for frontend CI environment, TZ is set to Europe/Helsinki
    const result = formatTimeFromDatetime("2024-06-15T14:30:00Z");
    expect(result).toBe("17.30");
  });

  it('should return "-" for null time datetime', () => {
    const result = formatTimeFromDatetime(null);
    expect(result).toBe("-");
  });
});
