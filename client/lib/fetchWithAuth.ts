import { getAccessToken, setAccessToken } from "@/store/authStore";

export const refreshToken = async () => {
  const res = await fetch("http://localhost:5000/api/v1/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  const data = await res.json();

  setAccessToken(data.accessToken);

  return data.accessToken;
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  let token = getAccessToken();

  let res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // token expired
  if (res.status === 401) {
    try {
      const newToken = await refreshToken();

      res = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      window.location.href = "/login";
      throw err;
    }
  }

  return res.json();
};