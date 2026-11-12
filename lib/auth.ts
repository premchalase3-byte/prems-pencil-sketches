
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "prem_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET must be set and contain at least 32 characters."
    );
  }

  return new TextEncoder().encode(secret);
}

export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    throw new Error("Admin credentials are not configured.");
  }

  return (
    username === expectedUsername &&
    password === expectedPassword
  );
}

export async function createAdminSession(): Promise<void> {
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_SECONDS * 1000
  );

  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSessionSecret());

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: expiresAt,
    path: "/",
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      getSessionSecret(),
      { algorithms: ["HS256"] }
    );

    if (payload.role !== "admin") return null;

    return { role: "admin" as const };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
