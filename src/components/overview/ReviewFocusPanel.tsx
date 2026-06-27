import { CheckCircle2, Eye, Lightbulb } from "lucide-react";

const items = [
  {
    title: "参与和表达更稳定",
    status: "已确认",
    body: "熟悉旋律和慢节奏下，主动动作和创作片段更多。"
  },
  {
    title: "高亮动画需要复核",
    status: "待复核",
    body: "第 6 次活动后出现退出，下一次建议先降低亮度。"
  },
  {
    title: "下一次活动建议",
    status: "下次尝试",
    body: "保留暂停权，用低亮度、慢节奏和熟悉旋律开场。"
  }
];

const icons = [CheckCircle2, Eye, Lightbulb];

export function ReviewFocusPanel() {
  return (
    <section className="rounded-lg border border-white/70 bg-white/80 p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-coral">老师复核</p>
          <h2 className="mt-1 text-xl font-bold">今天先看这 3 件事</h2>
        </div>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {items.map((item, index) => {
          const Icon = icons[index];
          return (
            <article key={item.title} className="rounded-lg border border-stone-200/70 bg-paper/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-coral">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-stone-600">{item.status}</span>
              </div>
              <h3 className="mt-4 font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{item.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
