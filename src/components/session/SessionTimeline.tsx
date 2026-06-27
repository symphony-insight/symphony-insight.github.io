import type { SessionSummary } from "../../types/domain";
import { formatAffectLabel } from "../../lib/labels";
import { useAppStore } from "../../store/useAppStore";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

export function SessionTimeline({ sessions }: { sessions: SessionSummary[] }) {
  const { language } = useAppStore();

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <Card key={session.id} className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Session {session.index}</h3>
                <Badge tone={session.affect.dominantState === "overloaded" ? "coral" : "tide"}>{formatAffectLabel(language, session.affect.dominantState)}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-600">{session.story}</p>
            </div>
            <div className="grid min-w-72 grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-md bg-stone-50 p-2">
                <p className="font-bold">{session.participation.voluntaryActionCount}</p>
                <p className="text-xs text-stone-500">主动动作</p>
              </div>
              <div className="rounded-md bg-stone-50 p-2">
                <p className="font-bold">{session.participation.seedCount}</p>
                <p className="text-xs text-stone-500">{language === "zh" ? "创作素材" : "Material"}</p>
              </div>
              <div className="rounded-md bg-stone-50 p-2">
                <p className="font-bold">{session.affect.recoveryMedianSec}s</p>
                <p className="text-xs text-stone-500">恢复记录</p>
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {session.notes.map((note) => (
              <Badge key={note}>{note}</Badge>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
