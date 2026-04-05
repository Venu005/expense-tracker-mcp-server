import { describe, it, expect, vi } from "vitest";
import { updateExpense } from "../tools/update-expense.tool";
import { prisma } from "../db";

vi.mock("../db", () => ({
  prisma: {
    expense: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("updateExpense", () => {
  it("should update an expense using prisma", async () => {
    vi.mocked(prisma.expense.findUnique).mockResolvedValue({ id: "123", payerId: "u1" } as any);
    vi.mocked(prisma.expense.update).mockResolvedValue({ id: "123", amount: 60 } as any);

    const result = await updateExpense({
      id: "123",
      amount: 60,
    }, "u1");

    expect(result.amount).toBe(60);
    expect(prisma.expense.update).toHaveBeenCalledWith({
      where: { id: "123" },
      data: { amount: 60, date: undefined },
    });
  });

  it("should throw error if expense is not owned by user", async () => {
    vi.mocked(prisma.expense.findUnique).mockResolvedValue({ id: "123", payerId: "other" } as any);

    await expect(updateExpense({ id: "123", amount: 60 }, "u1")).rejects.toThrow(
      "Expense not found or you don't have permission to update it."
    );
  });
});
