import { describe, it, expect, vi } from "vitest";
import { addFriend } from "../tools/add-friend.tool";
import { prisma } from "../db";

vi.mock("../db", () => ({
  prisma: {
    user: { findUnique: vi.fn(), upsert: vi.fn() },
    friendship: { findFirst: vi.fn(), create: vi.fn() },
  },
}));

describe("addFriend", () => {
  it("creates a friendship and INVITED placeholder when friend not found", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "u1", email: "me@test.com" } as any);
    vi.mocked(prisma.user.upsert).mockResolvedValue({ id: "u2", email: "friend@test.com", status: "INVITED" } as any);
    vi.mocked(prisma.friendship.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.friendship.create).mockResolvedValue({
      addressee: { id: "u2", email: "friend@test.com", name: null, status: "INVITED" },
    } as any);

    const result = await addFriend({ email: "friend@test.com" }, "u1");
    expect(result.message).toContain("Invitation sent");
    expect(prisma.friendship.create).toHaveBeenCalled();
  });
});
