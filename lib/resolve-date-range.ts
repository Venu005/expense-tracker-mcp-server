export type Period = "this_week" | "last_week" | "this_month" | "last_month" | "this_year";

export function resolveDateRange(
  period?: Period,
  startDate?: string,
  endDate?: string
): { gte?: Date; lte?: Date } {
  if (startDate || endDate) {
    return {
      gte: startDate ? new Date(startDate) : undefined,
      lte: endDate ? new Date(endDate) : undefined,
    };
  }

  if (!period) return {};

  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();

  switch (period) {
    case "this_week": {
      const day = now.getUTCDay();
      const monday = new Date(Date.UTC(year, month, now.getUTCDate() - day + 1));
      const sunday = new Date(Date.UTC(year, month, now.getUTCDate() - day + 7, 23, 59, 59, 999));
      return { gte: monday, lte: sunday };
    }
    case "last_week": {
      const day = now.getUTCDay();
      const lastMonday = new Date(Date.UTC(year, month, now.getUTCDate() - day - 6));
      const lastSunday = new Date(Date.UTC(year, month, now.getUTCDate() - day, 23, 59, 59, 999));
      return { gte: lastMonday, lte: lastSunday };
    }
    case "this_month":
      return {
        gte: new Date(Date.UTC(year, month, 1)),
        lte: new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)),
      };
    case "last_month":
      return {
        gte: new Date(Date.UTC(year, month - 1, 1)),
        lte: new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)),
      };
    case "this_year":
      return {
        gte: new Date(Date.UTC(year, 0, 1)),
        lte: new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)),
      };
    default:
      return {};
  }
}
