import { z } from 'zod';
import { prisma } from '../db';

export const addExpenseSchema = z.object({
  amount: z.number(),
  category: z.string(),
  description: z.string().optional(),
  date: z.string().datetime()
});

export async function addExpense(args: z.infer<typeof addExpenseSchema>) {
  return await prisma.expense.create({
    data: {
      amount: args.amount,
      category: args.category,
      description: args.description,
      date: new Date(args.date)
    }
  });
}
