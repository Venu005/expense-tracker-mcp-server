import { z } from "zod";

export const getExpensesByCategorySchema = z.object({
  category: z.string(),
  period: z.enum(["this_week", "last_week", "this_month", "last_month", "this_year"]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
