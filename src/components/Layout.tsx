import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center font-mono text-text">
      <header className="w-full max-w-3xl px-6 pt-8">
        <h1
          className="text-sub tracking-widest uppercase"
          style={{ fontSize: "var(--text-header)" }}
        >
          fast-reader
        </h1>
      </header>

      <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6">
        {children}
      </main>

      <footer className="w-full max-w-3xl px-6 pb-6">
        <p className="text-sub text-center" style={{ fontSize: "var(--text-hint)" }}>
          space to start &middot; r to reset
        </p>
      </footer>
    </div>
  );
}
