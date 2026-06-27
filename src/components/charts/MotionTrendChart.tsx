import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAppStore } from "../../store/useAppStore";
import type { SessionSummary } from "../../types/domain";
import { Card } from "../ui/Card";

export function MotionTrendChart({ sessions }: { sessions: SessionSummary[] }) {
  const { language } = useAppStore();
  const data = sessions.map((session) => ({
    name: `S${session.index}`,
    active: Math.round(session.motion.activeTimeRatio * 100),
    material: session.participation.seedCount,
    recovery: session.affect.recoveryMedianSec
  }));

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold">{language === "zh" ? "参与和恢复趋势" : "Participation and recovery trend"}</h3>
          <p className="mt-1 text-sm text-stone-500">
            {language === "zh" ? "只看这个孩子自己的变化，不和其他孩子比较。" : "Tracks this child over time without comparing them to other children."}
          </p>
        </div>
      </div>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="active" name={language === "zh" ? "参与动作时间 %" : "Active motion time %"} stroke="#4b8f9f" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="material" name={language === "zh" ? "创作素材" : "Creative material"} stroke="#d97c65" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
