'use client';
import Link from "next/link";
import { useState } from "react";
import { FcTodoList } from "react-icons/fc";
import { LuPanelLeftOpen } from "react-icons/lu";


const Sidebar = () => {
  const [sidebar, setSidebar] = useState(true);
  return (
    <div className={` min-h-screen border-l border-gray-400 shadow max-sm:absolute transition-all duration-300 ease-in-out ${sidebar ? "w-64" : "w-18"}`}>
      <div className="w-full flex items-center justify-end pt-4 pr-4">
        <button onClick={() => setSidebar(!sidebar)} className="p-2 rounded-lg hover:bg-gray-300 cursor-pointer">
          <LuPanelLeftOpen size={20}/>
        </button>
      </div>
      <Link
        href="/todos"
        className={`${sidebar ? "px-3.5 py-2.5" : "p-2"}  m-3 flex items-center gap-2 rounded-xl bg-gray-200`}
      >
        <FcTodoList  size={20}/>
        <h4 className={`text-black/60 text-[16px] font-bold ${!sidebar && "hidden"}`}>Manage Todos</h4>
      </Link>
    </div>
  );
};

export default Sidebar;
