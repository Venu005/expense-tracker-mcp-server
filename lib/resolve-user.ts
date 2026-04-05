import { prisma } from "../db";

interface GoogleSession {
  googleId: string;
  email: string;
  name?: string;
}

export async function resolveUser(session: GoogleSession) {
  // Try to find existing active user by googleId first
  const existingByGoogleId = await prisma.user.findUnique({
    where: { googleId: session.googleId },
  });
  if (existingByGoogleId) return existingByGoogleId;

  // Upsert: activate an INVITED placeholder or create new user
  return await prisma.user.upsert({
    where: { email: session.email },
    update: {
      googleId: session.googleId,
      name: session.name,
      status: "ACTIVE",
    },
    create: {
      googleId: session.googleId,
      email: session.email,
      name: session.name,
      status: "ACTIVE",
    },
  });
}
