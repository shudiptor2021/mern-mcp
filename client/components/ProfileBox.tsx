"use client";
import Image from "next/image";
import { SiGooglecalendar } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import ProfileDropdown from "./ProfileDropdown";
// import { userLogout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { googleCalendarConnect, googleLogin } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { userLogout } from "@/lib/auth";

type UserInfo =
  | {
      id?: string;
      _id?: string;
      picture: string;
      name: string;
      email: string;
      google?: {
        connected?: boolean;
      };
    }
  | null
  | undefined;

type Props = {
  userInfo?: UserInfo;
};

const ProfileBox = ({ userInfo }: Props) => {
  const router = useRouter();

  // const userId = userInfo?._id;
  // const userInfo = useAuthStore.getState().user;

  const userId = userInfo?._id;
  // google login
  const handleLogin = async () => {
    await googleLogin();
  };
  // calendar connect
  const handleCalendarConnect = async () => {
    if (!userId) return;
    await googleCalendarConnect(userId);
  };
  // const handleLogout = async () => {
  //   try {
  //     // const res = await userLogout();

  //     // console.log(res);

  //     // redirect
  //     router.refresh();
  //     router.push("/");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
    <div className="flex items-center gap-4 p-3 ">
      {userInfo && (
        <button
          onClick={handleCalendarConnect}
          disabled={userInfo.google?.connected}
          className={`flex items-center gap-2 border border-blue-600 bg-blue-400 text-white px-3 py-2 rounded font-semibold text-sm cursor-pointer hover:bg-blue-500 transition disabled:cursor-not-allowed`}
        >
          {userInfo.google?.connected ? "Connected" : "Connect to Calendar"}
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
        <ProfileDropdown userInfo={userInfo} handleLogout={userLogout} />
      ) : (
        <button
          onClick={handleLogin}
          className="flex items-center gap-2 border border-blue-400 bg-gray-100 text-black/80 px-3 py-2 rounded font-semibold text-sm cursor-pointer hover:bg-gray-200 transition"
        >
          <FcGoogle size={24} /> Login with Google
        </button>
      )}
    </div>
  );
};

export default ProfileBox;
