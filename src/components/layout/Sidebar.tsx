import { BookOpen, CalendarDays, FileCheck2, HelpCircle, Home, Languages, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { mockApi } from "../../api/mockApi";
import { t } from "../../i18n";
import { useAppStore } from "../../store/useAppStore";
import type { Child } from "../../types/domain";
import { Badge } from "../ui/Badge";

const navGroups = [
  {
    groupKey: "navGroupObserve",
    items: [
      { suffix: "", labelKey: "overview", icon: Home },
      { suffix: "/sessions", labelKey: "sessions", icon: CalendarDays },
      { suffix: "/motion-affect", labelKey: "motionAffect", icon: SlidersHorizontal }
    ]
  },
  {
    groupKey: "navGroupManage",
    items: [
      { suffix: "/report", labelKey: "report", icon: FileCheck2 },
      { suffix: "/report-method", labelKey: "reportMethod", icon: HelpCircle },
      { suffix: "/rubrics", labelKey: "rubricGuide", icon: BookOpen }
    ]
  }
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

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [hash, setHash] = useState<string>(() => window.location.hash);
  const { language, selectedChildId, setLanguage, setSelectedChildId } = useAppStore();
  const selectedChild = childrenList.find((item) => item.id === selectedChildId);
  const selectedName = language === "zh" ? selectedChild?.displayName : selectedChild?.displayNameEn;
  const selectedTeacher = language === "zh" ? selectedChild?.teacher : selectedChild?.teacherEn;

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
    <div className="flex h-full flex-col gap-6 p-4">
      {/* Brand */}
      <a href={basePath} className="flex items-center gap-3 px-1" onClick={onNavigate}>
        <BrandMark />
        <span>
          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-tide-600">{t(language, "appKicker")}</span>
          <span className="block text-base font-extrabold leading-tight">SymPhony Insight</span>
          <span className="block max-w-[10rem] text-xs leading-5 text-ink-muted">{t(language, "subtitle")}</span>
        </span>
      </a>

      {/* Nav groups */}
      <nav className="flex-1 space-y-5 overflow-y-auto" aria-label={t(language, "navLabel")}>
        {navGroups.map((group) => (
          <div key={group.groupKey}>
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
              {t(language, group.groupKey)}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const href = `${basePath}${item.suffix}`;
                const normalized = hash || basePath;
                const isActive = item.suffix === "" ? !normalized.startsWith(`${basePath}/`) : normalized === href;
                return (
                  <a
                    key={item.labelKey}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={onNavigate}
                    className={`flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-br from-tide to-tide-600 text-white shadow-[0_8px_18px_rgba(75,143,159,0.3)]"
                        : "text-ink-soft hover:bg-white/70 hover:text-ink"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {t(language, item.labelKey)}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Safety note */}
      <div className="flex items-start gap-2 rounded-xl border border-moss/20 bg-moss-50 px-3 py-2.5 text-xs leading-5 text-moss-600">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="font-medium text-ink-soft">{t(language, "safetyBanner")}</span>
      </div>

      {/* Child switcher + language */}
      <div className="space-y-2">
        <label className="sr-only" htmlFor="child-selector">
          {t(language, "childSelectorLabel")}
        </label>
        <select
          id="child-selector"
          aria-label={t(language, "childSelectorLabel")}
          className="h-10 w-full rounded-xl border border-white/75 bg-white/85 px-3 text-sm font-semibold shadow-card outline-none transition focus:border-tide focus-visible:ring-2 focus-visible:ring-tide/30"
          value={selectedChildId}
          onChange={(event) => setSelectedChildId(event.target.value)}
        >
          {childrenList.map((item) => (
            <option key={item.id} value={item.id}>
              {language === "zh" ? item.displayName : item.displayNameEn}
            </option>
          ))}
        </select>

        {/* User card */}
        <div className="flex items-center gap-3 rounded-xl border border-white/70 bg-white/70 p-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-coral to-coral-600 text-sm font-extrabold text-white">
            {(selectedTeacher ?? (language === "zh" ? "陈" : "T")).slice(0, 1)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold">{selectedTeacher ?? (language === "zh" ? "陈老师" : "Teacher")}</span>
            <span className="block truncate text-xs text-ink-muted">{selectedName ?? (language === "zh" ? "小宇" : "Xiaoyu")} · {t(language, "profileSuffix")}</span>
          </span>
          <button
            type="button"
            onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
            className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg px-2 text-xs font-bold text-ink-muted transition hover:bg-white hover:text-ink"
          >
            <Languages className="h-4 w-4" aria-hidden="true" />
            {t(language, "langButton")}
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge tone="moss" dot>
            {t(language, "baselineReady")}
          </Badge>
          <Badge tone="tide" dot>
            {t(language, "consentActive")}
          </Badge>
        </div>
      </div>
    </div>
  );
}
