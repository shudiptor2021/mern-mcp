import { Suspense } from "react";
import AuthSuccessPage from "./AuthSuccessPage";


export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Logging in...</div>}>
      <AuthSuccessPage />
    </Suspense>
  );
}