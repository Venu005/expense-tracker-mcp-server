import { z } from "zod";
import { prisma } from "../db";

export const getSplitHistorySchema = z.object({
  friendEmail: z.string().email().optional(),
  paid: z.boolean().optional(),
});

export async function getSplitHistory(
  args: z.infer<typeof getSplitHistorySchema>,
  currentUserId: string
) {
  const { friendEmail, paid } = args;

  const friendFilter = friendEmail
    ? { user: { email: friendEmail } }
    : {};

  // Splits where the current user is owed (they are the payer of the expense)
  const owedToMe = await prisma.expenseSplit.findMany({
    where: {
      expense: { payerId: currentUserId },
      paid: paid,
      ...friendFilter,
    },
    include: { expense: true, user: true },
  });

  // Splits where the current user owes someone else
  const iOwe = await prisma.expenseSplit.findMany({
    where: {
      userId: currentUserId,
      paid: paid,
      ...(friendEmail ? { expense: { payer: { email: friendEmail } } } : {}),
    },
    include: { expense: { include: { payer: true } }, user: true },
  });

  return { owedToMe, iOwe };
}
