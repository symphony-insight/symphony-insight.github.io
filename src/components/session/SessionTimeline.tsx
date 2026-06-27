import type { SessionSummary } from "../../types/domain";
import { formatAffectLabel } from "../../lib/labels";
import { useAppStore } from "../../store/useAppStore";
import { Badge } from "../ui/Badge";

function formatObservationText(text: string) {
  return text.replace(/Session\s*(\d+)/g, "第 $1 次活动");
}

export function SessionTimeline({ sessions }: { sessions: SessionSummary[] }) {
  const { language } = useAppStore();

  return (
    <div className="relative space-y-5 before:absolute before:left-[19px] before:top-3 before:bottom-3 before:w-px before:bg-gradient-to-b before:from-tide/30 before:via-stone-200 before:to-transparent md:before:left-[23px]">
      {sessions.map((session) => {
        const isAlert = session.affect.dominantState === "overloaded";
        return (
          <div key={session.id} className="relative pl-12 md:pl-14">
            <span
              className={`absolute left-2 top-5 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-paper-warm md:left-2.5 ${
                isAlert ? "bg-coral" : "bg-tide"
              }`}
              aria-hidden="true"
            >
              <span className="h-2 w-2 rounded-full bg-white" />
            </span>

            <article className="soft-rise rounded-2xl border border-white/70 bg-white/88 p-5 shadow-card backdrop-blur">
              <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-extrabold tracking-tightish">
                      {language === "zh" ? `第 ${session.index} 次活动` : `Session ${session.index}`}
                    </h3>
                    <Badge tone={isAlert ? "coral" : "tide"} dot>
                      {formatAffectLabel(language, session.affect.dominantState)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-ink-muted">{session.startedAt}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-white/70 bg-paper-warm/70 p-3">
                      <p className="text-xs font-bold text-ink-muted">发生了什么</p>
                      <p className="mt-2 text-sm leading-6 text-ink-soft">{formatObservationText(session.story)}</p>
                    </div>
                    <div className="rounded-xl border border-white/70 bg-paper-warm/70 p-3">
                      <p className="text-xs font-bold text-ink-muted">什么做法有帮助</p>
                      <p className="mt-2 text-sm leading-6 text-ink-soft">{formatObservationText(session.notes[0] ?? "保留熟悉节奏和清楚预告。")}</p>
                    </div>
                    <div className="rounded-xl border border-white/70 bg-paper-warm/70 p-3">
                      <p className="text-xs font-bold text-ink-muted">需要留意什么</p>
                      <p className="mt-2 text-sm leading-6 text-ink-soft">{formatObservationText(session.notes[1] ?? "下次活动继续观察。")}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-sm xl:grid-cols-1">
                  <div className="rounded-xl bg-tide-50 p-3">
                    <p className="font-display text-xl font-extrabold text-tide-600">{session.participation.voluntaryActionCount}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">主动参与</p>
                  </div>
                  <div className="rounded-xl bg-moss-50 p-3">
                    <p className="font-display text-xl font-extrabold text-moss-600">{session.participation.seedCount}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">{language === "zh" ? "创作片段" : "Material"}</p>
                  </div>
                  <div className="rounded-xl bg-coral-50 p-3">
                    <p className="font-display text-xl font-extrabold text-coral-600">{session.affect.recoveryMedianSec}s</p>
                    <p className="mt-0.5 text-xs text-ink-muted">回到活动</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {session.notes.map((note) => (
                  <Badge key={note}>{formatObservationText(note)}</Badge>
                ))}
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}
