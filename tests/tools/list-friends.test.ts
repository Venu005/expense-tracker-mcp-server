import { describe, it, expect, vi, beforeEach } from "vitest";
import { listFriends } from "../../tools/list-friends.tool";
import { prisma } from "../../db";

vi.mock("../../db", () => ({
  prisma: {
    friendship: {
      findMany: vi.fn(),
    },
  },
}));

describe("listFriends", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists friends correctly mapping requester/addressee", async () => {
    const currentUserId = "user-1";
    vi.mocked(prisma.friendship.findMany).mockResolvedValueOnce([
      {
        id: "fs-1",
        requesterId: currentUserId,
        addresseeId: "friend-1",
        status: "ACCEPTED",
        createdAt: new Date(),
        requester: { id: currentUserId, email: "me@test.com", status: "ACTIVE" },
        addressee: { id: "friend-1", email: "f1@test.com", status: "ACTIVE", name: "Alice" }
      },
      {
        id: "fs-2",
        requesterId: "friend-2",
        addresseeId: currentUserId,
        status: "ACCEPTED",
        createdAt: new Date(),
        requester: { id: "friend-2", email: "f2@test.com", status: "INVITED" },
        addressee: { id: currentUserId, email: "me@test.com", status: "ACTIVE" }
      }
    ] as any);

    const friends = await listFriends(currentUserId);
    expect(friends).toEqual([
      { id: "friend-1", email: "f1@test.com", name: "Alice", status: "ACTIVE" },
      { id: "friend-2", email: "f2@test.com", name: undefined, status: "INVITED" }
    ]);
  });
});
