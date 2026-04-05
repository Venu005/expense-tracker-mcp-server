import { describe, it, expect, vi } from "vitest";
import { getSummary } from "../tools/get-summary.tool";
import { prisma } from "../db";

vi.mock("../db", () => ({
  prisma: {
    expense: {
      groupBy: vi.fn(),
    },
  },
}));

describe("getSummary", () => {
  it("should get expense summary using prisma groupBy", async () => {
    const mockGrouped = [
      {
        category: "Food",
        _sum: {
          amount: 100,
        },
      },
      {
        category: "Transport",
        _sum: {
          amount: 50,
        },
      },
    ];

    vi.mocked(prisma.expense.groupBy).mockResolvedValue(mockGrouped as any);

    const result = await getSummary({
      startDate: "2026-04-01T00:00:00Z",
      endDate: "2026-04-30T23:59:59Z",
    });

    expect(result).toEqual([
      { category: "Food", total: 100 },
      { category: "Transport", total: 50 },
    ]);
    expect(prisma.expense.groupBy).toHaveBeenCalledWith({
      by: ['category'],
      _sum: { amount: true },
      where: {
        date: {
          gte: new Date("2026-04-01T00:00:00Z"),
          lte: new Date("2026-04-30T23:59:59Z"),
        },
      },
    });
  });
});
