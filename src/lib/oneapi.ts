// lib/oneapi.ts - Real One-API integration
const ONEAPI_URL = process.env.ONEAPI_URL || "http://38.47.102.235";
const ONEAPI_ROOT_PASS = process.env.ONEAPI_ROOT_PASSWORD || "123456";

let cachedSession: string | null = null;
let sessionExpiry = 0;

async function getAdminSession(): Promise<string> {
  if (cachedSession && Date.now() < sessionExpiry) return cachedSession;

  console.log("[oneapi] Logging in to", ONEAPI_URL);
  const res = await fetch(ONEAPI_URL + "/api/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "root", password: ONEAPI_ROOT_PASS }),
    signal: AbortSignal.timeout(8000),
  });

  const setCookie = res.headers.get("set-cookie") || "";
  const match = setCookie.match(/session=([^;]+)/);
  if (match) {
    cachedSession = match[1];
    sessionExpiry = Date.now() + 3600000;
    console.log("[oneapi] Session obtained");
    return cachedSession;
  }
  
  const body = await res.text();
  console.error("[oneapi] Login failed:", res.status, body.slice(0, 200));
  throw new Error("Failed to get admin session");
}

async function adminFetch(path: string, options: RequestInit = {}) {
  const session = await getAdminSession();
  console.log("[oneapi] Fetching", path);
  const res = await fetch(ONEAPI_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Cookie: "session=" + session,
      ...options.headers,
    },
    signal: AbortSignal.timeout(10000),
  });
  const data = await res.json();
  console.log("[oneapi] Response:", data.success);
  return data;
}

export async function createUser(email: string, password: string) {
  const username = email.split("@")[0];
  const result = await adminFetch("/api/user/", {
    method: "POST",
    body: JSON.stringify({ username, password, display_name: username }),
  });
  
  if (!result.success) {
    return { success: false, message: result.message || "Failed to create user" };
  }
  
  // One-API create user doesnt return the ID, look it up
  const users = await adminFetch("/api/user/?p=0&page_size=50");
  if (users.success && users.data) {
    const found = users.data.find((u: any) => u.username === username);
    if (found) {
      return { success: true, data: { id: found.id } };
    }
  }
  
  return { success: false, message: "User created but ID not found" };
}

export async function createToken(userId: number, name: string, quota: number = 1000000) {
  return adminFetch("/api/token/", {
    method: "POST",
    body: JSON.stringify({ user_id: userId, name, remain_quota: quota }),
  });
}

export async function getUserTokens(userId: number, adminToken: string) {
  const res = await fetch(ONEAPI_URL + "/api/token/", {
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + adminToken },
    signal: AbortSignal.timeout(8000),
  });
  return res.json();
}

export async function getUsage(userToken: string, start: number, end: number) {
  const res = await fetch(
    ONEAPI_URL + "/api/log/?p=0&page_size=1000&start_timestamp=" + start + "&end_timestamp=" + end,
    { headers: { Authorization: "Bearer " + userToken }, signal: AbortSignal.timeout(8000) }
  );
  return res.json();
}

export async function topUpUser(userId: number, quotaAmount: number) {
  return adminFetch("/api/user/?id=" + userId, {
    method: "PUT",
    body: JSON.stringify({ quota: quotaAmount }),
  });
}
