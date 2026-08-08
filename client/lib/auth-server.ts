import { cookies } from "next/headers";

const BASE_URL = `${process.env.BASE_URL}`; // backend

export const getAccessTokenServer = async () => {
  const cookieStore = await cookies();

  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
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