"use client";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

// export const refreshToken = async () => {
//   const cookieStore = await cookies();

//   const cookieHeader = cookieStore.toString();
//   // const refreshToken = cookieStore.get("refreshToken")?.value;

//   const res = await fetch(`${BASE_URL}/auth/refresh`, {
//     method: "POST",
//     credentials: "include",
//     headers: {
//       Cookie: cookieHeader,
//     },
//   });

//   if (!res.ok) {
//     throw new Error("Refresh failed");
//   }

//   const data = await res.json();
  

//   return data.accessToken;
// };

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`;


export const refreshAccessToken = async () => {
  try {
    const res = await fetch(
      `${BASE_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    useAuthStore
      .getState()
      .setAccessToken(data.accessToken);

    return data.accessToken;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// fetch with automatic token refresh
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
) => {
  let accessToken =
    useAuthStore.getState().accessToken;

  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  // token expired
  if (res.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      useAuthStore.getState().logout();

      window.location.replace("/");

      return null;
    }

    res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${newToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  }

  return res;
};

// export const fetchWithAuth = async (
//   url: string,
//   options: RequestInit = {},
//   accessToken?: string
// ) => {
  
//   // const cookieStore = await cookies();

//   // let accessToken =
//   //   cookieStore.get("accessToken")?.value || "";

//   let res = await fetch(url, {
//     ...options,
//     cache: "no-store",
//     credentials: "include",
//     headers: {
//       ...(options.headers || {}),
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//   });

//   // token expired
//   if (res.status === 401) {
   
//       const newToken = await refreshToken();

//       // refresh failed
//     if (!newToken) {
//       return null;
//     }

//       res = await fetch(url, {
//         ...options,
//         cache: "no-store",
//         credentials: "include",
//         headers: {
//           ...(options.headers || {}),
//           Authorization: `Bearer ${newToken}`,
//           "Content-Type": "application/json",
//         },
//       });
    
//   }
  
//   return res;
// };

