import { describe, it, expect, vi } from "vitest";
import { listExpenses } from "../tools/list-expenses.tool";
import { prisma } from "../db";

vi.mock("../db", () => ({
  prisma: {
    expense: { findMany: vi.fn() },
  },
}));

describe("listExpenses", () => {
  it("should list expenses using prisma with filters", async () => {
    vi.mocked(prisma.expense.findMany).mockResolvedValue([]);

    await listExpenses({
      category: "Food",
      startDate: "2026-04-05T00:00:00Z",
      endDate: "2026-04-05T23:59:59Z",
    }, "u1");

    expect(prisma.expense.findMany).toHaveBeenCalledWith({
      where: {
        payerId: "u1",
        category: "Food",
        date: {
          gte: new Date("2026-04-05T00:00:00Z"),
          lte: new Date("2026-04-05T23:59:59Z"),
        },
      },
      include: { splits: { include: { user: true } } },
      orderBy: { date: "desc" },
    });
  });
});
