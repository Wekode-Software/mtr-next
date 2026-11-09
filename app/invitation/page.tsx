import { Suspense } from "react";
import { OpenInApp } from "@/components/open-in-app";

export default function InvitationPage() {
  return (
    <Suspense>
      <OpenInApp path="invitation" title="Continue in the MTR app" />
    </Suspense>
  );
}
