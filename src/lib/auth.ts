import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "cfx_super_secure_random_jwt_secret_key_32_bytes_min!"
);

const COOKIE_NAME = "cfx_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "staff" | "viewer" | "client";
  organizationId: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as SessionPayload;
  } catch (err) {
    return null;
  }
}

export async function getSessionUser(req?: NextRequest): Promise<SessionPayload | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
  } else {
    const cookieStore = cookies();
    token = cookieStore.get(COOKIE_NAME)?.value;
  }

  if (!token) return null;
  return verifySessionToken(token);
}

export async function getAuthSession(req?: NextRequest): Promise<{ user: SessionPayload } | null> {
  const session = await getSessionUser(req);
  if (!session) return null;
  return { user: session };
}

export function hasRequiredRole(userRole: string, allowedRoles: string[]): boolean {
  if (userRole === "admin") return true; // admin has superuser access
  return allowedRoles.includes(userRole);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
