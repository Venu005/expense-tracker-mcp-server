import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { resolveDateRange } from "../../lib/resolve-date-range";

describe("resolveDateRange", () => {
  it("returns empty object when no params given", () => {
    expect(resolveDateRange()).toEqual({});
  });

  it("prefers explicit startDate/endDate over period", () => {
    const result = resolveDateRange("this_month", "2026-01-01T00:00:00Z", "2026-01-31T23:59:59Z");
    expect(result.gte).toEqual(new Date("2026-01-01T00:00:00Z"));
    expect(result.lte).toEqual(new Date("2026-01-31T23:59:59Z"));
  });

  it("resolves this_month correctly", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-15T12:00:00Z"));
    const result = resolveDateRange("this_month");
    expect(result.gte).toEqual(new Date("2026-04-01T00:00:00.000Z"));
    expect(result.lte).toEqual(new Date("2026-04-30T23:59:59.999Z"));
    vi.useRealTimers();
  });

  it("resolves last_month correctly", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-15T12:00:00Z"));
    const result = resolveDateRange("last_month");
    expect(result.gte).toEqual(new Date("2026-03-01T00:00:00.000Z"));
    expect(result.lte).toEqual(new Date("2026-03-31T23:59:59.999Z"));
    vi.useRealTimers();
  });
});
