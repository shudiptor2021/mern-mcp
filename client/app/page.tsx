
import ChatBox from "@/components/ChatBox";
import HomePage from "@/components/HomePage";
import ProfileBox from "@/components/ProfileBox";

import { getUser } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Home() {
  // const cookieStore = await cookies();
  //   const accessToken = cookieStore.get("accessToken")?.value || "";
  //   // console.log(accessToken)
  // const userInfo = await getUser();
  // const userId = userInfo?._id;
  // console.log(userInfo);
  return < HomePage />;
}
