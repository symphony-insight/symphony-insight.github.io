import { Activity, FileCheck2, Hand, LayoutDashboard, ListMusic, OctagonAlert } from "lucide-react";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { mockApi } from "../../api/mockApi";
import { t } from "../../i18n";
import { useAppStore } from "../../store/useAppStore";
import type { Child } from "../../types/domain";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const navItems = [
  { href: "#/child/xiaoyu", labelKey: "overview", icon: LayoutDashboard },
  { href: "#/child/xiaoyu/sessions", labelKey: "sessions", icon: ListMusic },
  { href: "#/child/xiaoyu/motion-affect", labelKey: "motionAffect", icon: Activity },
  { href: "#/child/xiaoyu/report", labelKey: "report", icon: FileCheck2 }
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
    <div className="min-h-screen bg-paper text-ink">
      <aside className="fixed inset-y-0 left-0 z-10 flex w-72 flex-col border-r border-stone-200 bg-white px-5 py-6">
        <div>
          <p className="text-sm font-semibold text-coral">{t(language, "appKicker")}</p>
          <h1 className="mt-1 text-2xl font-bold">SymPhony Insight</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">{t(language, "subtitle")}</p>
        </div>

        <nav className="mt-8 space-y-2" aria-label={t(language, "navLabel")}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-100">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {t(language, item.labelKey)}
              </a>
            );
          })}
        </nav>

        <div className="mt-auto rounded-lg border border-coral/20 bg-coral/10 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-coral">
            <OctagonAlert className="h-4 w-4" aria-hidden="true" />
            {t(language, "teacherControl")}
          </div>
          <Button variant="danger" className="mt-3 w-full" aria-label="STOP 暂停所有生成">
            <Hand className="h-4 w-4" aria-hidden="true" />
            STOP
          </Button>
        </div>
      </aside>

      <main className="pl-72">
        <header className="sticky top-0 z-10 border-b border-stone-200 bg-paper/90 px-8 py-4 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">{t(language, "currentProfile")}</p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold">
                  {selectedName ?? "小宇"} · {t(language, "profileSuffix")}
                </h2>
                <Badge tone="moss">{t(language, "baselineReady")}</Badge>
                <Badge tone="tide">{t(language, "consentActive")}</Badge>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="sr-only" htmlFor="child-selector">
                {t(language, "childSelectorLabel")}
              </label>
              <select
                id="child-selector"
                aria-label={t(language, "childSelectorLabel")}
                className="h-10 rounded-md border border-stone-300 bg-white px-3 text-sm font-semibold"
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
                {t(language, "langButton")}
              </Button>
              <div className="rounded-md border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600">{t(language, "safetyBanner")}</div>
            </div>
          </div>
        </header>
        <div className="px-8 py-7">{children}</div>
      </main>
    </div>
  );
}
