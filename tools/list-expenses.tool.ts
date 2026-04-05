import { z } from "zod";
import { prisma } from "../db";
import { listExpensesSchema } from "../types";

export async function listExpenses(args: z.infer<typeof listExpensesSchema>) {
  const { category, startDate, endDate } = args;
  
  return await prisma.expense.findMany({
    where: {
      category: category,
      date: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    },
    orderBy: {
      date: "desc",
    },
  });
}
