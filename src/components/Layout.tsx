import type { ReactNode } from "react";

import Header from "@/components/shared/Header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center font-mono text-text">
      <Header />
      <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6">
        {children}
      </main>
    </div>
  );
}
