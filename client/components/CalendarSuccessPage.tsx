"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getUser } from "@/lib/auth";
import Loader from "./Loader";

export default function CalendarSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const updateUser = async () => {
      try {
        const user = await getUser();

        useAuthStore.getState().setUser(user);

        router.replace("/");
      } catch (error) {
        console.error("Failed to refresh user:", error);
        router.replace("/");
      }
    };

    updateUser();
  }, [router]);

  return <Loader/>;
}