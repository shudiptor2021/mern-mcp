import TodoList from "@/components/TodoList";
import { getUser } from "@/lib/auth";
import { cookies } from "next/headers";
import Link from "next/link";
import { IoMdHome } from "react-icons/io";

const TodoPage = async () => {
  const cookieStore = await cookies();
      const accessToken = cookieStore.get("accessToken")?.value;
      // console.log(accessToken)
    const userInfo = await getUser(accessToken);
    const userId = userInfo?._id;
  return (
    <div className="min-h-screen w-full ">
      <div className="p-4 ">
        <Link href="/">
          <IoMdHome size={24} className=" shadow" />
        </Link>
      </div>
      <TodoList userId={userId}/>
    </div>
  );
};

export default TodoPage;
