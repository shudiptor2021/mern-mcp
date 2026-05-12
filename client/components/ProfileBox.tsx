"use client";

import { googleLogin } from "@/store/authStore";
import Image from "next/image";
import { SiGooglecalendar } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import ProfileDropdown from "./ProfileDropdown";
import { userLogout } from "@/lib/auth";
import { useRouter } from "next/navigation";


const ProfileBox = ({ userInfo }: { userInfo: any }) => {
  const router = useRouter();
  const handleLogin = async () => {
    await googleLogin();
  };
  const handleLogout = async () => {
  try {
    const res = await userLogout();

    // console.log(res);

    // redirect
   router.refresh();
    router.push("/");
  } catch (error) {
    console.log(error);
  }
};
  return (
    <div className="flex items-center gap-4 p-3">
      {userInfo && (
        <button className="flex items-center gap-2 border border-blue-600 bg-blue-400 text-white px-3 py-2 rounded font-semibold text-sm">
          Connect to Calendar{" "}
          <span>
            <SiGooglecalendar size={20} />
          </span>
        </button>
      )}

      {userInfo ? (
        // <div className="flex items-center gap-2">
        //   <Image
        //     src={userInfo.picture}
        //     alt="avatar"
        //     width={32}
        //     height={32}
        //     className="w-8 h-8 rounded-full"
        //   />
        // </div>
        <ProfileDropdown
  userInfo={userInfo}
  handleLogout={handleLogout}
/>
      ) : (
        <button onClick={handleLogin} className="flex items-center gap-2 border border-blue-400 bg-gray-100 text-black/80 px-3 py-2 rounded font-semibold text-sm cursor-pointer hover:bg-gray-200 transition">
          <FcGoogle size={24} /> Login with Google
        </button>
      )}
    </div>
  );
};

export default ProfileBox;
