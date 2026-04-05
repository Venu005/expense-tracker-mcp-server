import { z } from "zod";
import { prisma } from "../db";
import { updateExpenseSchema } from "../types";

export async function updateExpense(
  args: z.infer<typeof updateExpenseSchema>,
  currentUserId: string
) {
  const { id, ...data } = args;

  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense || expense.payerId !== currentUserId) {
    throw new Error("Expense not found or you don't have permission to update it.");
  }

  return await prisma.expense.update({
    where: { id },
    data: { ...data, date: data.date ? new Date(data.date) : undefined },
  });
}
