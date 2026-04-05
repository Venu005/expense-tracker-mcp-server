import { z } from "zod";
import { prisma } from "../db";
import { addExpenseSchema } from "../types";

export async function addExpense(args: z.infer<typeof addExpenseSchema>) {
  return await prisma.expense.create({
    data: {
      amount: args.amount,
      category: args.category,
      description: args.description,
      date: new Date(args.date),
    },
  });
}
