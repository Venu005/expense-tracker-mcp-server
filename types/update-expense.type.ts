import { z } from "zod";

export const updateExpenseSchema = z.object({
  id: z.string(),
  amount: z.number().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  date: z.string().datetime().optional(),
});
