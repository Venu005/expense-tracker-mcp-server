import { describe, it, expect, vi } from "vitest";
import { deleteExpense } from "../tools/delete-expense.tool";
import { prisma } from "../db";

vi.mock("../db", () => ({
  prisma: {
    expense: {
      delete: vi.fn(),
    },
  },
}));

describe("deleteExpense", () => {
  it("should delete an expense using prisma", async () => {
    const mockExpense = {
      id: "1",
      amount: 20,
      category: "Food",
      description: "Lunch",
      date: new Date(),
      userId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.expense.delete).mockResolvedValue(mockExpense);

    const result = await deleteExpense({
      id: "1",
    });

    expect(result).toEqual(mockExpense);
    expect(prisma.expense.delete).toHaveBeenCalledWith({
      where: { id: "1" },
    });
  });
});
