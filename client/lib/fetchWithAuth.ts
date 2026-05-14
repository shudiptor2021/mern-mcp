import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const refreshToken = async () => {
  const cookieStore = await cookies();

  // const cookieHeader = cookieStore.toString();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const res = await fetch("http://localhost:5000/api/v1/auth/refresh", {
    method: "POST",
    credentials: "include",
    headers: {
      // Cookie: cookieHeader,
      Cookie: `refreshToken=${refreshToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  const data = await res.json();
  // IMPORTANT
  cookieStore.set("accessToken", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });
  // console.log("new access token", data.accessToken);

  // save new access token
  // cookieStore.set("accessToken", data.accessToken);

  return data.accessToken;
};

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
  accessToken: string,
) => {
  // let token = getAccessToken();

  let res = await fetch(url, {
    ...options,
    cache: "no-store",
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  // token expired
  if (res.status === 401) {
    try {
      const newToken = await refreshToken();

      res = await fetch(url, {
        ...options,
        cache: "no-store",
        credentials: "include",
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      redirect("/");
    }
  }

  return res.json();
};
