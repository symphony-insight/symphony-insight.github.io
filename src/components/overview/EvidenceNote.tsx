import { ArrowRight, BookOpen, ShieldCheck } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

const references = [
  "共同注意与轮流（即兴音乐治疗的行为观察研究）",
  "目标达成 GAS（只和孩子自己的小目标比，不和别人比）",
  "参与时长、回到活动用时、提示次数等可记录的行为信号"
];

export function EvidenceNote() {
  const selectedChildId = useAppStore((state) => state.selectedChildId);
  return (
    <details className="surface group rounded-2xl p-5 shadow-card">
      <summary className="flex cursor-pointer items-center justify-between gap-3 marker:content-['']">
        <span className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-tide-50 text-tide-600">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-xs font-bold uppercase tracking-[0.12em] text-tide-600">关于可信度</span>
            <span className="block font-display text-base font-extrabold tracking-tightish">这些观察是怎么来的</span>
          </span>
        </span>
        <span className="text-sm text-ink-muted transition group-open:rotate-180">⌄</span>
      </summary>

      <div className="mt-4 space-y-4 text-sm leading-6 text-ink-soft">
        <p>
          每一项的分数，都是把每次活动里记录到的行为（比如主动参加、创作片段、回到活动用时、需要提示的次数）整理出来的，
          再交给老师看一遍。点开每张卡片的「为什么是这个分数」，就能看到它来自哪几次活动、有哪些变化。
        </p>

        <div className="rounded-xl border border-white/70 bg-paper-warm/70 p-4">
          <p className="text-xs font-bold text-ink-muted">9 项观察问题参考了这些方向</p>
          <ul className="mt-2 space-y-1.5">
            {references.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-ink-soft">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-tide" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="flex items-start gap-2 rounded-xl border border-moss/20 bg-moss-50 p-4 text-moss-600">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="font-medium text-ink-soft">
            这些只是给老师看的观察材料，不是给孩子下结论。相关研究也提醒：这类信号能帮我们更懂孩子，但还需要老师和专业人员结合现场一起判断。
          </span>
        </p>

        <a
          href={`#/child/${selectedChildId}/rubrics`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-tide-600 hover:text-tide-600/80"
        >
          查看完整评分说明
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </details>
  );
}
