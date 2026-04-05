import { z } from "zod";
import { prisma } from "../db";
import { addExpenseSchema } from "../types";

export async function addExpense(
  args: z.infer<typeof addExpenseSchema>,
  currentUserId: string
) {
  const { amount, category, description, date, splitWith, groupId } = args;

  // Resolve split participants
  const splitUsers = splitWith && splitWith.length > 0
    ? await Promise.all(
        splitWith.map((email) =>
          prisma.user.upsert({
            where: { email },
            update: {},
            create: { email, status: "INVITED" },
          })
        )
      )
    : [];

  const splitCount = splitUsers.length + 1; // +1 for payer
  const shareAmount = splitCount > 1 ? parseFloat((amount / splitCount).toFixed(2)) : 0;

  const expense = await prisma.expense.create({
    data: {
      amount,
      category,
      description,
      date: new Date(date),
      payerId: currentUserId,
      groupId,
      splits: splitUsers.length > 0
        ? {
            create: splitUsers.map((u) => ({
              userId: u.id,
              amount: shareAmount,
            })),
          }
        : undefined,
    },
    include: { splits: { include: { user: true } } },
  });

  return expense;
}
