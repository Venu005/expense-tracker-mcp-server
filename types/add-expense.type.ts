import { z } from "zod";
export const addExpenseSchema = z.object({
  amount: z.number(),
  category: z.string(),
  description: z.string().optional(),
  date: z.string().datetime(),
});
