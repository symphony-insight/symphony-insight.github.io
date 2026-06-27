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

export function AppShell({ children }: PropsWithChildren) {
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const { language, selectedChildId, setLanguage, setSelectedChildId } = useAppStore();
  const selectedChild = childrenList.find((item) => item.id === selectedChildId);
  const selectedName = language === "zh" ? selectedChild?.displayName : selectedChild?.displayNameEn;

  useEffect(() => {
    mockApi.getChildren().then(setChildrenList);
  }, []);

  return (
    <div className="min-h-screen premium-app-shell text-ink">
      <header className="sticky top-0 z-30 border-b border-white/50 bg-white/70 px-4 py-3 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <a href={`#/child/${selectedChildId}`} className="min-w-52">
            <p className="text-xs font-semibold uppercase text-coral">{t(language, "appKicker")}</p>
            <h1 className="text-xl font-bold">SymPhony Insight</h1>
          </a>

          <nav className="glass-nav flex flex-wrap items-center gap-1" aria-label={t(language, "navLabel")}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const href = `#/child/${selectedChildId}${item.suffix}`;
              return (
                <a key={item.labelKey} href={href} className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold text-stone-700 transition hover:bg-white/80 hover:text-ink">
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
              className="h-10 rounded-md border border-white/70 bg-white/80 px-3 text-sm font-semibold shadow-sm outline-none transition focus:border-tide"
              value={selectedChildId}
              onChange={(event) => setSelectedChildId(event.target.value)}
            >
              {childrenList.map((item) => (
                <option key={item.id} value={item.id}>
                  {language === "zh" ? item.displayName : item.displayNameEn}
                </option>
              ))}
            </select>
            <Button className="w-16 bg-white/80" onClick={() => setLanguage(language === "zh" ? "en" : "zh")}>
              <Languages className="h-4 w-4" aria-hidden="true" />
              {t(language, "langButton")}
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-3 flex max-w-7xl flex-wrap items-center justify-between gap-2 text-sm text-stone-600">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-ink">
              {selectedName ?? "小宇"} · {t(language, "profileSuffix")}
            </span>
            <Badge tone="moss">{t(language, "baselineReady")}</Badge>
            <Badge tone="tide">{t(language, "consentActive")}</Badge>
          </div>
          <div className="inline-flex items-center gap-2 rounded-md border border-white/70 bg-white/70 px-3 py-1.5">
            <ShieldCheck className="h-4 w-4 text-moss" aria-hidden="true" />
            {t(language, "safetyBanner")}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">{children}</main>
    </div>
  );
}
