import { z } from "zod";
import { prisma } from "../db";
import { deleteExpenseSchema } from "../types";

export async function deleteExpense(
  args: z.infer<typeof deleteExpenseSchema>,
  currentUserId: string
) {
  const { id } = args;

  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense || expense.payerId !== currentUserId) {
    throw new Error("Expense not found or you don't have permission to delete it.");
  }

  // Delete splits first (FK constraint)
  await prisma.expenseSplit.deleteMany({ where: { expenseId: id } });

  return await prisma.expense.delete({ where: { id } });
}
