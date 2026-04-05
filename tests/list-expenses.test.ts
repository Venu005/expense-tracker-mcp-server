import { describe, it, expect, vi } from "vitest";
import { listExpenses } from "../tools/list-expenses.tool";
import { prisma } from "../db";

vi.mock("../db", () => ({
  prisma: {
    expense: {
      findMany: vi.fn(),
    },
  },
}));

describe("listExpenses", () => {
  it("should list expenses using prisma with filters", async () => {
    const mockExpenses = [
      {
        id: "1",
        amount: 20,
        category: "Food",
        description: "Breakfast",
        date: new Date("2026-04-05T08:00:00Z"),
        userId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mocked(prisma.expense.findMany).mockResolvedValue(mockExpenses);

    const result = await listExpenses({
      category: "Food",
      startDate: "2026-04-05T00:00:00Z",
      endDate: "2026-04-05T23:59:59Z",
    });

    expect(result).toEqual(mockExpenses);
    expect(prisma.expense.findMany).toHaveBeenCalledWith({
      where: {
        category: "Food",
        date: {
          gte: new Date("2026-04-05T00:00:00Z"),
          lte: new Date("2026-04-05T23:59:59Z"),
        },
      },
      orderBy: {
        date: "desc",
      },
    });
  });
});
