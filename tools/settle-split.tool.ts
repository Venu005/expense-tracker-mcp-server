import { z } from "zod";
import { prisma } from "../db";

export const settleSplitSchema = z.object({
  friendEmail: z.string().email(),
  splitId: z.string().optional(), // if provided, settle directly; if not, return list
});

export async function settleUp(
  args: z.infer<typeof settleSplitSchema>,
  currentUserId: string
) {
  const { friendEmail, splitId } = args;

  const friend = await prisma.user.findUnique({ where: { email: friendEmail } });
  if (!friend) throw new Error(`No user found with email ${friendEmail}`);

  // If splitId provided, settle directly
  if (splitId) {
    return await prisma.expenseSplit.update({
      where: { id: splitId },
      data: { paid: true, settledAt: new Date() },
      include: { expense: true, user: true },
    });
  }

  // Find open splits between these two users
  const openSplits = await prisma.expenseSplit.findMany({
    where: {
      OR: [
        { userId: friend.id, expense: { payerId: currentUserId }, paid: false },
        { userId: currentUserId, expense: { payerId: friend.id }, paid: false },
      ],
    },
    include: { expense: true, user: true },
  });

  if (openSplits.length === 0) {
    return { message: `No open splits found with ${friendEmail}.` };
  }

  if (openSplits.length === 1) {
    // Auto-settle if only one
    return await prisma.expenseSplit.update({
      where: { id: openSplits[0].id },
      data: { paid: true, settledAt: new Date() },
      include: { expense: true, user: true },
    });
  }

  // Return list for user to pick
  return {
    message: `Multiple open splits found with ${friend.name ?? friendEmail}. Please specify a splitId.`,
    openSplits,
  };
}
