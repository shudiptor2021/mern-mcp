'use server'
import { cookies } from "next/headers";

// get user info
export const getUser = async (accessToken: any) => {
  // const cookieStore = await cookies();
  // const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return null;
    }
    const res = await fetch(`http://localhost:5000/api/v1/auth/userme`, {
        method: "GET",
        credentials: "include",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },

    } );

    const data = await res.json();
    // console.log(data);
    return data.user;
}

export const userLogout = async () => {
  const cookieStore = await cookies();
  const res = await fetch(
    "http://localhost:5000/api/v1/auth/logout",
    {
      method: "POST",
      credentials: "include",
    }
  );

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  return res.json();
}