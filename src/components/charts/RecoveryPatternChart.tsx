import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SessionSummary } from "../../types/domain";
import { Card } from "../ui/Card";

export function RecoveryPatternChart({ sessions }: { sessions: SessionSummary[] }) {
  const data = sessions.map((session) => ({
    name: `S${session.index}`,
    recovery: session.affect.recoveryMedianSec,
    stimulus: session.stimulus
  }));

  return (
    <Card className="p-4">
      <h3 className="font-bold">回到活动的时间</h3>
      <p className="mt-1 text-sm text-stone-500">看不同音乐和画面下，孩子多久能回到活动里。</p>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="recovery" name="回到活动 秒" fill="#6f8f7c" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
