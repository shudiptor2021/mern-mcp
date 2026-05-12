import TodoList from "@/components/TodoList";
import Link from "next/link";
import { IoMdHome } from "react-icons/io";

const page = () => {
  return (
    <div className="min-h-screen w-full ">
      <div className="p-4 ">
        <Link href="/">
          <IoMdHome size={24} className=" shadow" />
        </Link>
      </div>
      <TodoList />
    </div>
  );
};

export default page;
