'use client';
import { getUser } from "@/lib/auth";
import { setUserId } from "@/store/authStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";


const AuthSuccessPage = () => {
    // const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleAuthSuccess = async () => {
    //   const accessToken = params.get("accessToken");

    //   if (!accessToken) {
    //     return;
    //   }

     await getUser();

      // setUserId(data.user)
      router.push("/");
    };

    handleAuthSuccess();
  }, [router]);
  return (
    <div>
        <h1>Logging in...</h1>
    </div>
  )
}

export default AuthSuccessPage;
