const ONEAPI_BASE = process.env.ONEAPI_URL || "http://localhost:3000";
const ONEAPI_TOKEN = process.env.ONEAPI_ADMIN_TOKEN || "";

async function oneapi(path: string, options: RequestInit = {}) {
  const res = await fetch(`${ONEAPI_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ONEAPI_TOKEN}`,
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`One-API error: ${res.status}`);
  return res.json();
}

export async function createUser(email: string, password: string) {
  return oneapi("/api/user", {
    method: "POST",
    body: JSON.stringify({ username: email, password, display_name: email.split("@")[0] }),
  });
}

export async function createToken(userId: number, name: string) {
  return oneapi("/api/token", {
    method: "POST",
    body: JSON.stringify({ user_id: userId, name, remain_quota: 1000000 }),
  });
}

export async function getUserQuota(userId: number) {
  return oneapi(`/api/user/${userId}`);
}

export async function addUserQuota(userId: number, quota: number) {
  return oneapi(`/api/user/${userId}`, {
    method: "PUT",
    body: JSON.stringify({ quota }),
  });
}

export async function getUsageLogs(userId: number, start: number, end: number) {
  return oneapi(`/api/log?user_id=${userId}&start_timestamp=${start}&end_timestamp=${end}`);
}
