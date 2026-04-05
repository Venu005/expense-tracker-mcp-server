import { describe, it, expect, vi } from "vitest";
import { listFriends } from "../tools/list-friends.tool";
import { prisma } from "../db";

vi.mock("../db", () => ({
  prisma: {
    friendship: { findMany: vi.fn() },
  },
}));

describe("listFriends", () => {
  it("returns friends of the current user", async () => {
    vi.mocked(prisma.friendship.findMany).mockResolvedValue([
      {
        requesterId: "u1",
        addresseeId: "u2",
        requester: { id: "u1", name: "Me", email: "me@test.com", status: "ACTIVE" },
        addressee: { id: "u2", name: "Aftab", email: "aftab@test.com", status: "ACTIVE" },
      },
    ] as any);

    const result = await listFriends("u1");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Aftab");
  });
});
