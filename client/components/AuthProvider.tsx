"use client";

import { refreshAccessToken } from "@/lib/fetchWithAuth";
import { useEffect } from "react";


export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    refreshAccessToken();
  }, []);

  return children;
}