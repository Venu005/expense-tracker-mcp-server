import { prisma } from "../db";

export async function listFriends(currentUserId: string) {
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [
        { requesterId: currentUserId },
        { addresseeId: currentUserId },
      ],
    },
    include: {
      requester: true,
      addressee: true,
    },
  });

  return friendships.map((f) => {
    const friend = f.requesterId === currentUserId ? f.addressee : f.requester;
    return { id: friend.id, name: friend.name, email: friend.email, status: friend.status };
  });
}
