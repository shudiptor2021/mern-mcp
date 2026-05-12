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
  console.log("new access token", data.accessToken);

  // setAccessToken(data.accessToken);

  return data.accessToken;
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}, accessToken: string) => {
  let token = getAccessToken();

  let res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  }, );

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
      window.location.href = "/";
      throw err;
    }
  }

  return res.json();
};