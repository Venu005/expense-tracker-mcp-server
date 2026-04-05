import { z } from "zod";

export const deleteExpenseSchema = z.object({
  id: z.string(),
});
