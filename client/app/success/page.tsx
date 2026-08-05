"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getUser } from "@/lib/auth";

export default function AuthSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    const login = async () => {
      const token = params.get("token");
      console.log(token)

      if (!token) {
        router.push("/");
        return;
      }

      // token save
      setAccessToken(token);

      // immediately user fetch
      const user =await getUser();
      // console.log("Fetched User:", user);
      useAuthStore.getState().setUser(user);
      // console.log("Store User:", useAuthStore.getState().user);
      // console.log(user)

      // redirect
      router.push("/");
    };
    login();
  }, [params, router, setAccessToken]);

  return <div>Logging in...</div>;
}
