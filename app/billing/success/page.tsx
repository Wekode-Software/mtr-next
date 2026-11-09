import { Suspense } from "react";
import { OpenInApp } from "@/components/open-in-app";

export default function BillingSuccessPage() {
  return (
    <Suspense>
      <OpenInApp path="billing/success" title="Continue in the MTR app" />
    </Suspense>
  );
}
