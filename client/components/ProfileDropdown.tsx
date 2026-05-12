"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ProfileDropdownProps {
  userInfo: {
    picture: string;
    name: string;
    email: string;
  };
  handleLogout: () => void;
}

export default function ProfileDropdown({ userInfo, handleLogout }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Outside click close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full focus:outline-none"
      >
        <Image
          src={userInfo.picture}
          alt="avatar"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-blue-500 transition"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          {/* User Info */}
          <div className="px-5 py-4 border-b bg-gray-50">
            <div className="flex items-center gap-3">
              <Image
                src={userInfo.picture}
                alt="avatar"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full"
              />

              <div>
                <h3 className="font-semibold text-gray-800">
                  {userInfo.name}
                </h3>

                <p className="text-sm text-gray-500 truncate">
                  {userInfo.email}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}