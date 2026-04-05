import { z } from "zod";
import { prisma } from "../db";
import { updateExpenseSchema } from "../types";

export async function updateExpense(args: z.infer<typeof updateExpenseSchema>) {
  const { id, ...data } = args;
  
  return await prisma.expense.update({
    where: { id },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    },
  });
}
