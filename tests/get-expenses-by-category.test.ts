import { describe, it, expect, vi } from "vitest";
import { getExpensesByCategory } from "../tools/get-expenses-by-category.tool";
import { prisma } from "../db";

vi.mock("../db", () => ({
  prisma: {
    expense: { findMany: vi.fn() },
  },
}));

describe("getExpensesByCategory", () => {
  it("filters by category and user", async () => {
    vi.mocked(prisma.expense.findMany).mockResolvedValue([]);
    const result = await getExpensesByCategory({ category: "Travel" }, "u1");
    expect(prisma.expense.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ category: "Travel", payerId: "u1" }) })
    );
  });
});
