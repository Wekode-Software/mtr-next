"use client";

import { useSearchParams } from "next/navigation";

export function OpenInApp({ path, title }: { path: string; title: string }) {
  const query = useSearchParams().toString();
  const href = `mtrapp://${path}${query ? `?${query}` : ""}`;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6">
      <h1 className="max-w-md text-center text-3xl leading-10">{title}</h1>
      <a
        href={href}
        className="inline-flex h-13 items-center justify-center rounded-full bg-[#141414] px-8 text-base font-semibold text-white"
      >
        Continue
      </a>
    </main>
  );
}
