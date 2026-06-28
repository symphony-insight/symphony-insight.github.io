import { CheckCircle2, ClipboardList, FileText, ShieldCheck, Upload } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

const flowCopy = {
  zh: [
    { title: "活动中留下记录", body: "记录参与、回应、暂停、恢复和老师提示。", icon: ClipboardList },
    { title: "整理成观察指标", body: "把活动记录汇总到 9 项观察问题。", icon: CheckCircle2 },
    { title: "生成报告草稿", body: "把结构化记录写成老师可改的草稿。", icon: FileText },
    { title: "检查不合适表述", body: "标出不适合直接给家长看的话。", icon: ShieldCheck },
    { title: "老师确认后导出", body: "老师确认后，摘要才可以给家长。", icon: Upload }
  ],
  en: [
    { title: "Activity records", body: "Capture participation, responses, pauses, recovery, and teacher prompts.", icon: ClipboardList },
    { title: "Observation signals", body: "Organize activity records into the nine observation questions.", icon: CheckCircle2 },
    { title: "System-prepared draft", body: "Turn structured records into an editable teacher draft.", icon: FileText },
    { title: "Expression check", body: "Flag wording that is not ready for parent-facing use.", icon: ShieldCheck },
    { title: "Teacher review and export", body: "A summary can be shared only after teacher confirmation.", icon: Upload }
  ]
} as const;

export function ReportMethodFlow() {
  const { language } = useAppStore();
  const steps = flowCopy[language];

  return (
    <div className="grid gap-3 lg:grid-cols-5">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={step.title} className="rounded-2xl border border-white/70 bg-white/75 p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-card">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-tide-50 text-tide-600">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="mt-3 text-xs font-bold text-ink-muted">
              {language === "zh" ? `第 ${index + 1} 步` : `Step ${index + 1}`}
            </p>
            <h3 className="mt-1 font-display text-base font-extrabold tracking-tightish">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{step.body}</p>
          </div>
        );
      })}
    </div>
  );
}
