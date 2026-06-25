import { cookies } from "next/headers";
import * as jose from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "infernest-secret-change-me-2026"
);

export interface SessionUser {
  userId: number;
  username: string;
  apiKey: string;
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("infernest_token")?.value;
    if (!token) return null;
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}
