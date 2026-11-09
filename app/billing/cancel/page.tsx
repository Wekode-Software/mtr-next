import { Suspense } from "react";
import { OpenInApp } from "@/components/open-in-app";

export default function BillingCancelPage() {
  return (
    <Suspense>
      <OpenInApp path="billing/cancel" title="Continue in the MTR app" />
    </Suspense>
  );
}
