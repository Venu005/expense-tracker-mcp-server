import { prisma } from "../db";

export async function listGroups(currentUserId: string) {
  return await prisma.group.findMany({
    where: {
      members: { some: { userId: currentUserId } },
    },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
    },
  });
}
