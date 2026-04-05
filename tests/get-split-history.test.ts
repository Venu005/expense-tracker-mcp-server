import { describe, it, expect, vi } from "vitest";
import { getSplitHistory } from "../tools/get-split-history.tool";
import { prisma } from "../db";

vi.mock("../db", () => ({
  prisma: {
    expenseSplit: { findMany: vi.fn() },
  },
}));

describe("getSplitHistory", () => {
  it("returns owedToMe and iOwe splits", async () => {
    vi.mocked(prisma.expenseSplit.findMany).mockResolvedValue([]);
    const result = await getSplitHistory({}, "u1");
    expect(result).toHaveProperty("owedToMe");
    expect(result).toHaveProperty("iOwe");
  });
});
