import { describe, it, expect } from "vitest";
import { kWhToMWh } from "./electricityUtils";

describe("electricityUtils", () => {
  it("should format kWh to MWh", () => {
    const result = kWhToMWh(15600);
    expect(result).toBe("15,60 MWh");
  });

  it('should return "-" for null input', () => {
    const result = kWhToMWh(null);
    expect(result).toBe("-");
  });
});
