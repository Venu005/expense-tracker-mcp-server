import { describe, it, expect, vi, beforeEach } from "vitest";
import { addFriend } from "../../tools/add-friend.tool";
import { prisma } from "../../db";

vi.mock("../../db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    friendship: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe("addFriend", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const currentUserId = "user-1";

  it("throws error if user tries to add themselves", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: currentUserId, email: "me@test.com", status: "ACTIVE", googleId: "g1", createdAt: new Date()
    } as any);

    await expect(addFriend({ email: "me@test.com" }, currentUserId)).rejects.toThrow("You cannot add yourself as a friend.");
  });

  it("returns already friends if existing friendship found", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ email: "me@test.com" } as any);
    const friend = { id: "friend-1", email: "f@test.com", status: "ACTIVE" } as any;
    vi.mocked(prisma.user.upsert).mockResolvedValueOnce(friend);
    vi.mocked(prisma.friendship.findFirst).mockResolvedValueOnce({ id: "fs-1" } as any);

    const result = await addFriend({ email: "f@test.com" }, currentUserId);
    expect(result.message).toBe("Already friends.");
    expect(result.friend).toEqual(friend);
  });

  it("creates friendship and returns success message for active user", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ email: "me@test.com" } as any);
    const friend = { id: "friend-1", email: "f@test.com", status: "ACTIVE", name: "Bob" } as any;
    vi.mocked(prisma.user.upsert).mockResolvedValueOnce(friend);
    vi.mocked(prisma.friendship.findFirst).mockResolvedValueOnce(null);
    vi.mocked(prisma.friendship.create).mockResolvedValueOnce({ addressee: friend } as any);

    const result = await addFriend({ email: "f@test.com" }, currentUserId);
    expect(result.message).toBe("Bob added as a friend.");
    expect(result.friend).toEqual(friend);
  });

  it("creates friendship and returns invitation message for invited user", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ email: "me@test.com" } as any);
    const friend = { id: "friend-1", email: "f@test.com", status: "INVITED" } as any;
    vi.mocked(prisma.user.upsert).mockResolvedValueOnce(friend);
    vi.mocked(prisma.friendship.findFirst).mockResolvedValueOnce(null);
    vi.mocked(prisma.friendship.create).mockResolvedValueOnce({ addressee: friend } as any);

    const result = await addFriend({ email: "f@test.com" }, currentUserId);
    expect(result.message).toBe("Invitation sent to f@test.com. They'll see your splits when they join.");
    expect(result.friend).toEqual(friend);
  });
});
