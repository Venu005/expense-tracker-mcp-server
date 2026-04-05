import { z } from "zod";
import { prisma } from "../db";
import { getSummarySchema } from "../types";
import { resolveDateRange } from "../lib";

export async function getSummary(
  args: z.infer<typeof getSummarySchema>,
  currentUserId: string
) {
  const { period, startDate, endDate } = args;
  const dateFilter = resolveDateRange(period, startDate, endDate);

  const grouped = await prisma.expense.groupBy({
    by: ["category"],
    _sum: { amount: true },
    where: {
      payerId: currentUserId,
      date: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
    },
  });

  return grouped.map((g) => ({
    category: g.category,
    total: g._sum.amount || 0,
  }));
}
