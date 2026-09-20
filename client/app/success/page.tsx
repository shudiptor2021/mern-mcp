import { Suspense } from "react";
import AuthSuccessPage from "./AuthSuccessPage";
import Loader from "@/components/Loader";


export default function SuccessPage() {
  return (
    <Suspense fallback={<Loader/>}>
      <AuthSuccessPage />
    </Suspense>
  );
}