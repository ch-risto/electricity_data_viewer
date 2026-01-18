import "@testing-library/jest-dom";
import { vi } from "vitest";

global.fetch = vi.fn(() =>
  Promise.reject(new Error("Global fetch not implemented in tests")),
);
