import { CheckCircle2, Eye, Lightbulb } from "lucide-react";
import { Badge } from "../ui/Badge";

const items = [
  {
    title: "参与和表达更稳了",
    status: "已看过",
    tone: "moss" as const,
    icon: CheckCircle2,
    body: "熟悉旋律和慢节奏下，主动动作和创作片段更多。"
  },
  {
    title: "高亮动画要再看",
    status: "待确认",
    tone: "coral" as const,
    icon: Eye,
    body: "第 6 次活动里出现退出，下一次建议先降低亮度。"
  },
  {
    title: "下次从哪里开始",
    status: "下次试试",
    tone: "tide" as const,
    icon: Lightbulb,
    body: "保留暂停选择，用低亮度、慢节奏和熟悉旋律开场。"
  }
];

const iconWrap: Record<"moss" | "coral" | "tide", string> = {
  moss: "bg-moss-50 text-moss-600",
  coral: "bg-coral-50 text-coral-600",
  tide: "bg-tide-50 text-tide-600"
};

const edge: Record<"moss" | "coral" | "tide", string> = {
  moss: "before:bg-moss",
  coral: "before:bg-coral",
  tide: "before:bg-tide"
};

export function ReviewFocusPanel() {
  return (
    <section className="surface rounded-2xl p-6 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-coral-600">今天的重点</p>
          <h2 className="mt-1 font-display text-xl font-extrabold tracking-tightish">今天先看这 3 件事</h2>
        </div>
      </div>
      <div className="mt-5 grid gap-3 stagger lg:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className={`relative overflow-hidden rounded-2xl border border-white/70 bg-white/80 p-5 pl-6 shadow-card before:absolute before:inset-y-0 before:left-0 before:w-1.5 ${edge[item.tone]}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${iconWrap[item.tone]}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <Badge tone={item.tone} dot>
                  {item.status}
                </Badge>
              </div>
              <h3 className="mt-4 font-display font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{item.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
