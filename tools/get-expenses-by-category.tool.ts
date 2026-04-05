import { z } from "zod";
import { prisma } from "../db";
import { getExpensesByCategorySchema } from "../types";
import { resolveDateRange } from "../lib";

export async function getExpensesByCategory(
  args: z.infer<typeof getExpensesByCategorySchema>,
  currentUserId: string
) {
  const { category, period, startDate, endDate } = args;
  const dateFilter = resolveDateRange(period, startDate, endDate);

  return await prisma.expense.findMany({
    where: {
      payerId: currentUserId,
      category,
      date: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
    },
    orderBy: { date: "desc" },
  });
}
