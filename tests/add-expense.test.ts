import { describe, it, expect, vi } from "vitest";
import { addExpense } from "../tools/add-expense.tool";
import { prisma } from "../db";

vi.mock("../db", () => ({
  prisma: {
    expense: { create: vi.fn() },
    user: { upsert: vi.fn() },
  },
}));

describe("addExpense", () => {
  it("should add an expense using prisma", async () => {
    const mockExpense = { id: "123", amount: 50, payerId: "u1" };
    vi.mocked(prisma.expense.create).mockResolvedValue(mockExpense as any);

    const result = await addExpense({
      amount: 50,
      category: "Food",
      description: "Lunch",
      date: "2026-04-05T12:00:00Z",
    }, "u1");

    expect(result).toEqual(mockExpense);
    expect(prisma.expense.create).toHaveBeenCalledWith({
      data: {
        amount: 50,
        category: "Food",
        description: "Lunch",
        date: new Date("2026-04-05T12:00:00Z"),
        payerId: "u1",
        groupId: undefined,
        splits: undefined,
      },
      include: { splits: { include: { user: true } } },
    });
  });
});
