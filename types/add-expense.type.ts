import { z } from "zod";
export const addExpenseSchema = z.object({
  amount: z.number().positive(),
  category: z.string(),
  description: z.string().optional(),
  date: z.string().datetime(),
  splitWith: z.array(z.string().email()).optional(),
  groupId: z.string().optional(),
});
