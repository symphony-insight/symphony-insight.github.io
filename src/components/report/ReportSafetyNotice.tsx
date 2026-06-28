import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import type { Language, ReportDraft } from "../../types/domain";

type SafetyCheck = ReportDraft["safetyCheck"];

const toneMap = {
  zh: {
    passed: {
      icon: CheckCircle2,
      className: "border-moss/20 bg-moss-50 text-moss-600",
      title: "表述检查通过",
      flaggedPrefix: "建议修改："
    },
    needs_edit: {
      icon: AlertTriangle,
      className: "border-sun/30 bg-sun-50 text-[#8a6a22]",
      title: "有几句话建议老师改一下",
      flaggedPrefix: "建议修改："
    },
    blocked: {
      icon: ShieldAlert,
      className: "border-coral/25 bg-coral-50 text-coral-600",
      title: "这版草稿暂时不能导出",
      flaggedPrefix: "建议修改："
    }
  },
  en: {
    passed: {
      icon: CheckCircle2,
      className: "border-moss/20 bg-moss-50 text-moss-600",
      title: "Expression check passed",
      flaggedPrefix: "Suggested edits:"
    },
    needs_edit: {
      icon: AlertTriangle,
      className: "border-sun/30 bg-sun-50 text-[#8a6a22]",
      title: "A few lines need teacher edits",
      flaggedPrefix: "Suggested edits:"
    },
    blocked: {
      icon: ShieldAlert,
      className: "border-coral/25 bg-coral-50 text-coral-600",
      title: "This draft cannot be exported yet",
      flaggedPrefix: "Suggested edits:"
    }
  }
} as const;

export function ReportSafetyNotice({
  safetyCheck,
  language
}: {
  safetyCheck: SafetyCheck;
  language: Language;
}) {
  const tone = toneMap[language][safetyCheck.displayStatus];
  const Icon = tone.icon;
  const summary = language === "zh" ? safetyCheck.plainSummary : safetyCheck.plainSummaryEn;

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${tone.className}`}>
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-bold">{tone.title}</p>
          <p className="mt-1 leading-6 text-ink-soft">{summary}</p>
          {safetyCheck.flaggedPhrases.length > 0 ? (
            <p className="mt-2 text-xs font-semibold">
              {tone.flaggedPrefix}
              {language === "zh" ? safetyCheck.flaggedPhrases.join("、") : safetyCheck.flaggedPhrases.join(", ")}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
