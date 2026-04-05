import { describe, it, expect, vi } from "vitest";
import { updateExpense } from "../tools/update-expense.tool";
import { prisma } from "../db";

vi.mock("../db", () => ({
  prisma: {
    expense: {
      update: vi.fn(),
    },
  },
}));

describe("updateExpense", () => {
  it("should update an expense using prisma", async () => {
    const mockExpense = {
      id: "1",
      amount: 40,
      category: "Food",
      description: "Dinner",
      date: new Date("2026-04-05T19:00:00Z"),
      userId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.expense.update).mockResolvedValue(mockExpense);

    const result = await updateExpense({
      id: "1",
      amount: 40,
      description: "Dinner",
    });

    expect(result).toEqual(mockExpense);
    expect(prisma.expense.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        amount: 40,
        description: "Dinner",
        date: undefined,
      },
    });
  });
});
