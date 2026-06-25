// lib/oneapi.ts - Real One-API integration via session proxy
const ONEAPI_URL = process.env.ONEAPI_URL || "http://38.47.102.235:3000";
const ONEAPI_ROOT_PASS = process.env.ONEAPI_ROOT_PASSWORD || "123456";

let cachedSession: string | null = null;
let sessionExpiry = 0;

async function getAdminSession(): Promise<string> {
  if (cachedSession && Date.now() < sessionExpiry) return cachedSession;

  const res = await fetch(`${ONEAPI_URL}/api/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "root", password: ONEAPI_ROOT_PASS }),
  });

  const setCookie = res.headers.get("set-cookie") || "";
  const match = setCookie.match(/oneapi_session=([^;]+)/);
  if (match) {
    cachedSession = match[1];
    sessionExpiry = Date.now() + 3600000; // 1 hour
    return cachedSession;
  }
  throw new Error("Failed to get admin session");
}

async function adminFetch(path: string, options: RequestInit = {}) {
  const session = await getAdminSession();
  const res = await fetch(`${ONEAPI_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Cookie: `oneapi_session=${session}`,
      ...options.headers,
    },
  });
  return res.json();
}

export async function createUser(email: string, password: string) {
  return adminFetch("/api/user/", {
    method: "POST",
    body: JSON.stringify({ username: email, password, display_name: email.split("@")[0] }),
  });
}

export async function createToken(userId: number, name: string, quota: number = 1000000) {
  return adminFetch("/api/token/", {
    method: "POST",
    body: JSON.stringify({ user_id: userId, name, remain_quota: quota }),
  });
}

export async function getUserTokens(userId: number, adminToken: string) {
  const res = await fetch(`${ONEAPI_URL}/api/token/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
  });
  return res.json();
}

export async function getUsage(userToken: string, start: number, end: number) {
  const res = await fetch(`${ONEAPI_URL}/api/log/?p=0&page_size=1000&start_timestamp=${start}&end_timestamp=${end}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return res.json();
}

export async function topUpUser(userId: number, quotaAmount: number) {
  return adminFetch(`/api/user/?id=${userId}`, {
    method: "PUT",
    body: JSON.stringify({ quota: quotaAmount }),
  });
}
