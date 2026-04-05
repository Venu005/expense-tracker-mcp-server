import { z } from "zod";
import { prisma } from "../db";
import { deleteExpenseSchema } from "../types";

export async function deleteExpense(args: z.infer<typeof deleteExpenseSchema>) {
  const { id } = args;
  
  return await prisma.expense.delete({
    where: { id },
  });
}
