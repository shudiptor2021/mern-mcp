import CalendarSuccessPage from "@/components/CalendarSuccessPage";
import Loader from "@/components/Loader";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<Loader/>}>
      <CalendarSuccessPage />
    </Suspense>
  );
}
