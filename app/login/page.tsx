import { Suspense } from "react";
import { OpenInApp } from "@/components/open-in-app";

export default function LoginPage() {
  return (
    <Suspense>
      <OpenInApp path="login" title="Continue in the MTR app" />
    </Suspense>
  );
}
