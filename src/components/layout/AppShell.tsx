import { Menu, X } from "lucide-react";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: PropsWithChildren) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="premium-app-shell min-h-screen font-sans text-ink lg:flex">
      {/* Desktop sidebar */}
      <aside className="app-sidebar sticky top-0 hidden h-screen w-64 shrink-0 lg:block">
        <Sidebar />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/40 bg-white/70 px-4 py-3 backdrop-blur-xl lg:hidden">
        <span className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-tide to-tide-600">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M2 12c2.5 0 2.5-7 5-7s2.5 14 5 14 2.5-7 5-7 2.5 0 5 0" />
            </svg>
          </span>
          <span className="text-base font-extrabold">SymPhony</span>
        </span>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="打开导航"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/70 bg-white/80 text-ink-soft"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="drawer-overlay absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <aside className="app-sidebar drawer-panel absolute inset-y-0 left-0 w-72 max-w-[82vw]">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="关闭导航"
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition hover:bg-white hover:text-ink"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      ) : null}

      <main className="min-w-0 flex-1 px-4 py-6 md:px-8 lg:py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
