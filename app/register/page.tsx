import { Suspense } from "react";
import { OpenInApp } from "@/components/open-in-app";

export default function RegisterPage() {
  return (
    <Suspense>
      <OpenInApp path="register" title="Continue in the MTR app" />
    </Suspense>
  );
}
