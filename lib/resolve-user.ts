import { prisma } from "../db";
import { decodeJwt } from "jose";

interface GoogleSession {
  email?: string;
  idToken?: string;
  claims?: {
    sub?: string;
    name?: string;
    email?: string;
    [key: string]: any;
  };
}

export async function resolveUser(session: GoogleSession) {
  let claims = session.claims;
  if (!claims && session.idToken) {
    try {
      claims = decodeJwt(session.idToken);
    } catch (e) {
      console.error("resolveUser: failed to decode idToken", e);
    }
  }

  const email = session.email || claims?.email;
  const googleId = claims?.sub;
  const name = claims?.name;

  if (!email || !googleId) {
    throw new Error(
      `Invalid session: email (${email}) or googleId (${googleId}) missing`,
    );
  }

  try {
    // Find existing by googleId
    const existingByGoogleId = await prisma.user.findUnique({
      where: { googleId },
    });
    if (existingByGoogleId) {
      return existingByGoogleId;
    }

    // Upsert by email: activate or create
    const user = await prisma.user.upsert({
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
    return user;
  } catch (dbError: any) {
    throw new Error(
      `Database error during user resolution: ${dbError.message}`,
    );
  }
}
