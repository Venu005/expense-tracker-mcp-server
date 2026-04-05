import { z } from "zod";
import { prisma } from "../db";
import { addGroupMemberSchema } from "../types";

export async function addGroupMember(
  args: z.infer<typeof addGroupMemberSchema>,
  currentUserId: string
) {
  const { groupId, email } = args;

  // Verify requester is in the group
  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: currentUserId } },
  });
  if (!membership) throw new Error("You are not a member of this group.");

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, status: "INVITED" },
  });

  return await prisma.groupMember.upsert({
    where: { groupId_userId: { groupId, userId: user.id } },
    update: {},
    create: { groupId, userId: user.id },
  });
}
