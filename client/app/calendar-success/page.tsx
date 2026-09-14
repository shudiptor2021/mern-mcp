import CalendarSuccessPage from "@/components/CalendarSuccessPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Logging in...</div>}>
      <CalendarSuccessPage />
    </Suspense>
  );
}
