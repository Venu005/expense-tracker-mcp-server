import { prisma } from "../db";

interface GoogleSession {
  email?: string;
  claims?: {
    sub?: string;
    name?: string;
    [key: string]: any;
  };
}

export async function resolveUser(session: GoogleSession) {
  const email = session.email;
  const googleId = session.claims?.sub;
  const name = session.claims?.name;

  if (!email || !googleId) {
    throw new Error("Invalid session: email or googleId missing");
  }

  // Find existing by googleId
  const existingByGoogleId = await prisma.user.findUnique({
    where: { googleId },
  });
  if (existingByGoogleId) return existingByGoogleId;

  // Upsert by email: activate or create
  return await prisma.user.upsert({
    where: { email },
    update: {
      googleId,
      name: name ?? undefined,
      status: "ACTIVE",
    },
    create: {
      googleId,
      email,
      name: name ?? undefined,
      status: "ACTIVE",
    },
  });
}
