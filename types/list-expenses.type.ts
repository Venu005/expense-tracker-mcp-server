import { z } from "zod";

export const listExpensesSchema = z.object({
  category: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
