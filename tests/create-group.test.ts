import { describe, it, expect, vi } from "vitest";
import { createGroup } from "../tools/create-group.tool";
import { prisma } from "../db";

vi.mock("../db", () => ({
  prisma: {
    user: { upsert: vi.fn() },
    group: { create: vi.fn() },
  },
}));

describe("createGroup", () => {
  it("creates a group with members", async () => {
    vi.mocked(prisma.user.upsert).mockResolvedValue({ id: "u2", email: "aftab@test.com" } as any);
    vi.mocked(prisma.group.create).mockResolvedValue({
      id: "g1",
      name: "Goa Trip",
      createdById: "u1",
    } as any);

    const result = await createGroup({ name: "Goa Trip", memberEmails: ["aftab@test.com"] }, "u1");
    expect(prisma.group.create).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
