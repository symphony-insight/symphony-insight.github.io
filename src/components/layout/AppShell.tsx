import { CalendarDays, FileCheck2, Home, Languages, ShieldCheck, SlidersHorizontal } from "lucide-react";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { mockApi } from "../../api/mockApi";
import { t } from "../../i18n";
import { useAppStore } from "../../store/useAppStore";
import type { Child } from "../../types/domain";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const navItems = [
  { suffix: "", labelKey: "overview", icon: Home },
  { suffix: "/sessions", labelKey: "sessions", icon: CalendarDays },
  { suffix: "/motion-affect", labelKey: "motionAffect", icon: SlidersHorizontal },
  { suffix: "/report", labelKey: "report", icon: FileCheck2 }
] as const;

function BrandMark() {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-tide to-tide-600 shadow-[0_8px_18px_rgba(75,143,159,0.32)]">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
        <path d="M2 12c2.5 0 2.5-7 5-7s2.5 14 5 14 2.5-7 5-7 2.5 0 5 0" />
      </svg>
    </span>
  );
}

export function AppShell({ children }: PropsWithChildren) {
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [hash, setHash] = useState<string>(() => window.location.hash);
  const { language, selectedChildId, setLanguage, setSelectedChildId } = useAppStore();
  const selectedChild = childrenList.find((item) => item.id === selectedChildId);
  const selectedName = language === "zh" ? selectedChild?.displayName : selectedChild?.displayNameEn;

  useEffect(() => {
    mockApi.getChildren().then(setChildrenList);
  }, []);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const basePath = `#/child/${selectedChildId}`;

  return (
    <div className="min-h-screen premium-app-shell font-sans text-ink">
      <header className="sticky top-0 z-30 border-b border-white/40 bg-white/65 px-4 py-3 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <a href={basePath} className="flex min-w-52 items-center gap-3">
            <BrandMark />
            <span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-tide-600">
                {t(language, "appKicker")}
              </span>
              <span className="block text-lg font-extrabold leading-tight">SymPhony Insight</span>
            </span>
          </a>

          <nav className="glass-nav flex flex-wrap items-center gap-1" aria-label={t(language, "navLabel")}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const href = `${basePath}${item.suffix}`;
              const normalized = hash || basePath;
              const isActive = item.suffix === "" ? !normalized.startsWith(`${basePath}/`) : normalized === href;
              return (
                <a
                  key={item.labelKey}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex h-9 items-center gap-2 rounded-[10px] px-3.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-br from-tide to-tide-600 text-white shadow-[0_8px_18px_rgba(75,143,159,0.3)]"
                      : "text-ink-soft hover:bg-white/85 hover:text-ink"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {t(language, item.labelKey)}
                </a>
              );
            })}
          </nav>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <label className="sr-only" htmlFor="child-selector">
              {t(language, "childSelectorLabel")}
            </label>
            <select
              id="child-selector"
              aria-label={t(language, "childSelectorLabel")}
              className="h-10 rounded-xl border border-white/75 bg-white/85 px-3 text-sm font-semibold shadow-card outline-none transition focus:border-tide focus-visible:ring-2 focus-visible:ring-tide/30"
              value={selectedChildId}
              onChange={(event) => setSelectedChildId(event.target.value)}
            >
              {childrenList.map((item) => (
                <option key={item.id} value={item.id}>
                  {language === "zh" ? item.displayName : item.displayNameEn}
                </option>
              ))}
            </select>
            <Button className="w-16" onClick={() => setLanguage(language === "zh" ? "en" : "zh")}>
              <Languages className="h-4 w-4" aria-hidden="true" />
              {t(language, "langButton")}
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-3 flex max-w-7xl flex-wrap items-center justify-between gap-2 text-sm text-ink-muted">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-ink">
              {selectedName ?? "小宇"} · {t(language, "profileSuffix")}
            </span>
            <Badge tone="moss" dot>
              {t(language, "baselineReady")}
            </Badge>
            <Badge tone="tide" dot>
              {t(language, "consentActive")}
            </Badge>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-moss/20 bg-moss-50 px-3 py-1.5 text-moss-600">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span className="font-medium">{t(language, "safetyBanner")}</span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">{children}</main>
    </div>
  );
}
