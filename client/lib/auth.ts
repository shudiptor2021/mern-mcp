'use client'

// import { cookies } from "next/headers";
// import { getAccessToken } from "@/store/authStore";
import { fetchWithAuth } from "./fetchWithAuth";

const BASE_URL = `${process.env.BASE_URL}`; // backend

// get user info
export const getUser = async () => {
  // const cookieStore = await cookies();
  // const accessToken = cookieStore.get("accessToken")?.value;

  //   if (!accessToken) {
  //       return null;
  //   }
  //   const res = await fetch(`http://localhost:5000/api/v1/auth/userme`, {
  //       method: "GET",
  //       credentials: "include",
  //       cache: "no-store",
  //       headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${accessToken}`,
  //     },

  //   } );

  //     if (!res.ok) {
  //   return null;
  // }
  //   const data = await res.json();
    
  //   console.log(data);
    // const accessToken = getAccessToken();

    // if (!accessToken) {
    //   return null;
    // }

    const res = await fetchWithAuth(`${BASE_URL}/auth/userme`, {
        method: "GET",
      },
      // accessToken
    );

    if (!res || !res.ok) {
      return null;
    }

    const data = await res.json();
    
    
    return data.user;
}

// export const userLogout = async () => {
//   const cookieStore = await cookies();
//   const res = await fetch(
//     "http://localhost:5000/api/v1/auth/logout",
//     {
//       method: "POST",
//       credentials: "include",
//     }
//   );

//   cookieStore.delete("accessToken");
//   cookieStore.delete("refreshToken");

//   return res.json();
// }


import { useAuthStore } from "@/store/authStore";

export const userLogout = async () => {
  try {

    // backend cookie clear
    await fetch(
      `${BASE_URL}/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    // zustand clear
    useAuthStore.getState().logout();

    // redirect
    window.location.href = "/";

  } catch (err) {
    console.log(err);
  }
};