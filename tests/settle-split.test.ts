import { describe, it, expect, vi } from "vitest";
import { settleUp } from "../tools/settle-split.tool";
import { prisma } from "../db";

vi.mock("../db", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    expenseSplit: { findMany: vi.fn(), update: vi.fn() },
  },
}));

describe("settleUp", () => {
  it("returns message when no open splits", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "u2", email: "aftab@test.com" } as any);
    vi.mocked(prisma.expenseSplit.findMany).mockResolvedValue([]);
    const result = await settleUp({ friendEmail: "aftab@test.com" }, "u1");
    expect((result as any).message).toContain("No open splits");
  });

  it("settles directly when splitId provided", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "u2", email: "aftab@test.com" } as any);
    vi.mocked(prisma.expenseSplit.update).mockResolvedValue({ id: "s1", paid: true } as any);
    const result = await settleUp({ friendEmail: "aftab@test.com", splitId: "s1" }, "u1");
    expect((result as any).paid).toBe(true);
  });
});
