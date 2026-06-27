import type { SessionSummary } from "../../types/domain";
import { formatAffectLabel } from "../../lib/labels";
import { useAppStore } from "../../store/useAppStore";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

function formatObservationText(text: string) {
  return text.replace(/Session\s*(\d+)/g, "第 $1 次活动");
}

export function SessionTimeline({ sessions }: { sessions: SessionSummary[] }) {
  const { language } = useAppStore();

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.id} className="p-5 soft-rise">
          <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{language === "zh" ? `第 ${session.index} 次活动` : `Session ${session.index}`}</h3>
                <Badge tone={session.affect.dominantState === "overloaded" ? "coral" : "tide"}>{formatAffectLabel(language, session.affect.dominantState)}</Badge>
              </div>
              <p className="mt-1 text-xs font-semibold text-stone-500">{session.startedAt}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-md bg-paper/80 p-3">
                  <p className="text-xs font-bold text-stone-500">发生了什么</p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{formatObservationText(session.story)}</p>
                </div>
                <div className="rounded-md bg-paper/80 p-3">
                  <p className="text-xs font-bold text-stone-500">什么做法有帮助</p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{formatObservationText(session.notes[0] ?? "保留熟悉节奏和清楚预告。")}</p>
                </div>
                <div className="rounded-md bg-paper/80 p-3">
                  <p className="text-xs font-bold text-stone-500">老师再看什么</p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{formatObservationText(session.notes[1] ?? "下次活动继续观察。")}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-sm xl:grid-cols-1">
              <div className="rounded-md bg-white/80 p-3">
                <p className="font-bold">{session.participation.voluntaryActionCount}</p>
                <p className="text-xs text-stone-500">主动参与</p>
              </div>
              <div className="rounded-md bg-white/80 p-3">
                <p className="font-bold">{session.participation.seedCount}</p>
                <p className="text-xs text-stone-500">{language === "zh" ? "创作片段" : "Material"}</p>
              </div>
              <div className="rounded-md bg-white/80 p-3">
                <p className="font-bold">{session.affect.recoveryMedianSec}s</p>
                <p className="text-xs text-stone-500">回到活动</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {session.notes.map((note) => (
              <Badge key={note}>{formatObservationText(note)}</Badge>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
