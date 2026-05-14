import ChatBox from "@/components/ChatBox";
import ProfileBox from "@/components/ProfileBox";
import { getUser } from "@/lib/auth";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || "";
    // console.log(accessToken)
  const userInfo = await getUser(accessToken);
  const userId = userInfo?._id;
  // console.log("userInfo", userInfo._id);
  return (
    <div className="flex flex-col h-screen w-full overflow-y-auto ">
      <div className="p-4 shadow sticky top-0 w-full flex justify-between items-center bg-white z-10">
        <h1 className="text-2xl font-bold">AI Assistant</h1>
        <ProfileBox userInfo={userInfo}/>
      </div>
      <div className="w-full flex justify-center">
       <ChatBox userId={userId} accessToken={accessToken}/>
       </div>
    </div>
  );
}
