import { z } from "zod";
import { prisma } from "../db";
import { addFriendSchema } from "../types";

export async function addFriend(
  args: z.infer<typeof addFriendSchema>,
  currentUserId: string
) {
  const { email } = args;

  if (email === (await prisma.user.findUnique({ where: { id: currentUserId } }))?.email) {
    throw new Error("You cannot add yourself as a friend.");
  }

  // Find or create placeholder for friend
  const friend = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, status: "INVITED" },
  });

  // Check if friendship already exists
  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId: currentUserId, addresseeId: friend.id },
        { requesterId: friend.id, addresseeId: currentUserId },
      ],
    },
  });

  if (existing) {
    return { message: "Already friends.", friend };
  }

  const friendship = await prisma.friendship.create({
    data: { requesterId: currentUserId, addresseeId: friend.id },
    include: { addressee: true },
  });

  return {
    message: friend.status === "INVITED"
      ? `Invitation sent to ${email}. They'll see your splits when they join.`
      : `${friend.name ?? email} added as a friend.`,
    friend: friendship.addressee,
  };
}
