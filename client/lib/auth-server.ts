import { cookies } from "next/headers";

export const getAccessTokenServer = async () => {
  const cookieStore = await cookies();

  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch("http://localhost:5000/api/v1/auth/refresh", {
    method: "POST",
    headers: {
      Cookie: cookieString,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  return data.accessToken;
};