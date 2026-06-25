// lib/oneapi.ts - Real One-API integration
const ONEAPI_URL = process.env.ONEAPI_URL || "http://38.47.102.235";
const ONEAPI_ROOT_PASS = process.env.ONEAPI_ROOT_PASSWORD || "123456";

let cachedAdminSession: string | null = null;
let adminSessionExpiry = 0;

async function getAdminSession(): Promise<string> {
  if (cachedAdminSession && Date.now() < adminSessionExpiry) return cachedAdminSession;

  const res = await fetch(ONEAPI_URL + "/api/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "root", password: ONEAPI_ROOT_PASS }),
    signal: AbortSignal.timeout(8000),
  });

  const setCookie = res.headers.get("set-cookie") || "";
  const match = setCookie.match(/session=([^;]+)/);
  if (match) {
    cachedAdminSession = match[1];
    adminSessionExpiry = Date.now() + 3600000;
    return cachedAdminSession;
  }
  
  const body = await res.text();
  console.error("[oneapi] Admin login failed:", res.status, body.slice(0, 200));
  throw new Error("Failed to get admin session");
}

async function adminFetch(path: string, options: RequestInit = {}) {
  const session = await getAdminSession();
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
  return data;
}

export async function createUser(email: string, password: string, refCode?: string) {
  const username = email.split("@")[0];
  const result = await adminFetch("/api/user/", {
    method: "POST",
    body: JSON.stringify({ username, password, display_name: username, ...(refCode ? { inviter_code: refCode } : {}) }),
  });
  
  if (!result.success) {
    return { success: false, message: result.message || "Failed to create user" };
  }
  
  const users = await adminFetch("/api/user/?p=0&page_size=50");
  if (users.success && users.data) {
    const found = users.data.find((u: any) => u.username === username);
    if (found) {
      return { success: true, data: { id: found.id } };
    }
  }
  
  return { success: false, message: "User created but ID not found" };
}

export async function createToken(email: string, password: string) {
  const username = email.split("@")[0];

  const loginRes = await fetch(ONEAPI_URL + "/api/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    signal: AbortSignal.timeout(8000),
  });

  const setCookie = loginRes.headers.get("set-cookie") || "";
  const match = setCookie.match(/session=([^;]+)/);
  if (!match) {
    const body = await loginRes.text();
    console.error("[oneapi] User login failed:", loginRes.status, body.slice(0, 200));
    return { success: false, message: "Failed to authenticate new user" };
  }
  const userSession = match[1];

  const tokenRes = await fetch(ONEAPI_URL + "/api/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: "session=" + userSession,
    },
    body: JSON.stringify({ name: "default", remain_quota: 1000000 }),
    signal: AbortSignal.timeout(8000),
  });

  const tokenData = await tokenRes.json();
  
  if (tokenData.success && tokenData.data) {
    return { success: true, data: { key: tokenData.data.key } };
  }
  
  return { success: false, message: tokenData.message || "Failed to create token" };
}

export async function getUserInfo(userId: number) {
  const session = await getAdminSession();
  const res = await fetch(ONEAPI_URL + "/api/user/?id=" + userId, {
    headers: { Cookie: "session=" + session },
    signal: AbortSignal.timeout(8000),
  });
  const data = await res.json();
  if (data.success && data.data) {
    const users = Array.isArray(data.data) ? data.data : [data.data];
    const user = users.find((u: any) => u.id === userId);
    if (user) return { success: true, data: user };
  }
  return { success: false, message: "User not found" };
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