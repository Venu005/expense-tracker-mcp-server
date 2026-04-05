import { z } from "zod";
import { prisma } from "../db";
import { createGroupSchema } from "../types";

export async function createGroup(
  args: z.infer<typeof createGroupSchema>,
  currentUserId: string
) {
  const { name, memberEmails } = args;

  // Upsert all member users (create INVITED placeholders if needed)
  const members = await Promise.all(
    memberEmails.map((email) =>
      prisma.user.upsert({
        where: { email },
        update: {},
        create: { email, status: "INVITED" },
      })
    )
  );

  const group = await prisma.group.create({
    data: {
      name,
      createdById: currentUserId,
      members: {
        create: [
          { userId: currentUserId },
          ...members.map((m) => ({ userId: m.id })),
        ],
      },
    },
    include: { members: { include: { user: true } } },
  });

  return group;
}
