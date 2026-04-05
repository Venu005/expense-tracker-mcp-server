import { describe, it, expect, vi } from "vitest";
import { deleteExpense } from "../tools/delete-expense.tool";
import { prisma } from "../db";

vi.mock("../db", () => ({
  prisma: {
    expense: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    expenseSplit: {
      deleteMany: vi.fn(),
    },
  },
}));

describe("deleteExpense", () => {
  it("should delete an expense using prisma", async () => {
    vi.mocked(prisma.expense.findUnique).mockResolvedValue({ id: "123", payerId: "u1" } as any);
    vi.mocked(prisma.expense.delete).mockResolvedValue({ id: "123" } as any);

    const result = await deleteExpense({ id: "123" }, "u1");

    expect(result.id).toBe("123");
    expect(prisma.expenseSplit.deleteMany).toHaveBeenCalledWith({ where: { expenseId: "123" } });
    expect(prisma.expense.delete).toHaveBeenCalledWith({ where: { id: "123" } });
  });

  it("should throw error if expense is not owned by user", async () => {
    vi.mocked(prisma.expense.findUnique).mockResolvedValue({ id: "123", payerId: "other" } as any);

    await expect(deleteExpense({ id: "123" }, "u1")).rejects.toThrow(
      "Expense not found or you don't have permission to delete it."
    );
  });
});
