import { z } from "zod";
import { prisma } from "../db";
import { listExpensesSchema } from "../types";
import { resolveDateRange } from "../lib";

export async function listExpenses(
  args: z.infer<typeof listExpensesSchema>,
  currentUserId: string
) {
  const { category, startDate, endDate } = args;
  const dateFilter = resolveDateRange(undefined, startDate, endDate);

  return await prisma.expense.findMany({
    where: {
      payerId: currentUserId,
      category,
      date: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
    },
    include: { splits: { include: { user: true } } },
    orderBy: { date: "desc" },
  });
}
