import { z } from "zod";
import { prisma } from "../db";
import { getSummarySchema } from "../types";

export async function getSummary(args: z.infer<typeof getSummarySchema>) {
  const { startDate, endDate } = args;
  
  const grouped = await prisma.expense.groupBy({
    by: ['category'],
    _sum: {
      amount: true,
    },
    where: {
      date: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    },
  });
  
  return grouped.map(g => ({
    category: g.category,
    total: g._sum.amount || 0,
  }));
}
