import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { mockApi } from "../api/mockApi";
import { Card } from "../components/ui/Card";
import { SettingFitPanel } from "../components/state/SettingFitPanel";
import { t } from "../i18n";
import { useAppStore } from "../store/useAppStore";
import type { LongitudinalInsight, SessionSummary } from "../types/domain";

function formatObservationText(session: SessionSummary | undefined, language: "zh" | "en", fallbackZh: string, fallbackEn: string) {
  if (!session) return language === "zh" ? fallbackZh : fallbackEn;
  return language === "zh" ? session.story : session.storyEn;
}

export function MotionAffectPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [insights, setInsights] = useState<LongitudinalInsight[]>([]);
  const { language, selectedChildId } = useAppStore();

  useEffect(() => {
    Promise.all([mockApi.getSessions(selectedChildId), mockApi.getInsights(selectedChildId)]).then(([sessionData, insightData]) => {
      setSessions(sessionData);
      setInsights(insightData);
    });
  }, [selectedChildId]);

  if (sessions.length === 0) return <div>{language === "zh" ? "设置加载中" : "Loading state view"}</div>;

  const highBrightness = sessions.find((session) => session.stimulus === "high_brightness");
  const lowSupport = sessions.find((session) => session.stimulus === "low_brightness");
  const slowTempo = sessions.find((session) => session.stimulus === "slow_tempo");
  const highBrightnessStory = formatObservationText(highBrightness, language, "高亮动画后出现退出。", "Bright animation was followed by withdrawal.");
  const slowTempoStory = formatObservationText(slowTempo, language, "慢节奏活动中，孩子更容易停留在活动里。", "Slower pacing helped the child stay longer.");
  const lowSupportStory = formatObservationText(lowSupport, language, "降低负担后更容易回到活动。", "Lower load made it easier to return.");

  return (
    <div className="space-y-6 page-enter">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-coral-600">{t(language, "motionAffect")}</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tightish md:text-4xl">{t(language, "motionAffectTitle")}</h1>
        <p className="mt-2 max-w-3xl text-ink-muted">{t(language, "motionAffectIntro")}</p>
      </div>

      <div className="grid gap-4">
        <SettingFitPanel
          title={language === "zh" ? "音乐和节奏" : "Music and pacing"}
          fitLabel={language === "zh" ? "更适合：熟悉旋律、慢节奏" : "Better fit: familiar melody and slower tempo"}
          evidence={`${slowTempoStory} ${language === "zh" ? "主动动作和创作片段更稳定。" : "Self-started movement and creative clips were steadier."}`}
          nextStep={language === "zh" ? "下次先用慢节奏开场，再慢慢加入新的声音变化。" : "Start with slower pacing next time, then introduce new sound changes gradually."}
          score={86}
          tone="moss"
        />
        <SettingFitPanel
          title={language === "zh" ? "画面亮度" : "Visual brightness"}
          fitLabel={language === "zh" ? "建议先调低：高亮动画" : "Lower first: bright animation"}
          evidence={`${highBrightnessStory} ${language === "zh" ? "这类画面建议先请老师看一下。" : "Review brightness and animation speed before reusing it."}`}
          nextStep={language === "zh" ? "默认用低亮度画面。确实需要更明显的提示时，再短时间试一下。" : "Use softer visuals by default. If a stronger cue is needed, try it briefly and review the response."}
          score={62}
          tone="coral"
        />
        <SettingFitPanel
          title={language === "zh" ? "老师怎么帮" : "Teacher support"}
          fitLabel={language === "zh" ? "更适合：可以暂停，也可以重新开始" : "Better fit: pause and restart options"}
          evidence={`${lowSupportStory} ${language === "zh" ? "清楚预告和暂停选择能降低活动压力。" : "Clear previews and pause choices lowered the activity load."}`}
          nextStep={language === "zh" ? "每次活动开始前先说明可以暂停，结束前保留一次再试机会。" : "Before each session, name the pause option and keep one chance to try again near the end."}
          score={78}
          tone="tide"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="p-6 xl:col-span-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-coral-50 text-coral-600">
              <Eye className="h-4 w-4" aria-hidden="true" />
            </span>
            <h2 className="font-display text-lg font-extrabold tracking-tightish">{language === "zh" ? "高亮动画要再看" : "Review bright animation"}</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-ink-soft">
            {highBrightnessStory}{" "}
            {language === "zh"
              ? "这次活动里，画面变亮后孩子更容易退出。下一次建议先降低亮度，并保留暂停选择。这只是给老师看的活动记录。"
              : "Start next time with lower brightness and keep the pause option. This note is for teacher review."}
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-coral-50 p-4">
              <p className="text-sm text-ink-muted">{language === "zh" ? "等待更久" : "Longer wait"}</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-coral-600">{highBrightness?.motion.responseLatencyMs}ms</p>
            </div>
            <div className="rounded-xl bg-tide-50 p-4">
              <p className="text-sm text-ink-muted">{language === "zh" ? "需要提示" : "Prompts needed"}</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-tide-600">
                {highBrightness?.affect.teacherInterventionCount}
                {language === "zh" ? " 次" : ""}
              </p>
            </div>
            <div className="rounded-xl bg-sun-50 p-4">
              <p className="text-sm text-ink-muted">{language === "zh" ? "退出次数" : "Withdrawals"}</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-[#a9802f]">
                {highBrightness?.participation.refusalCount}
                {language === "zh" ? " 次" : ""}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="font-display text-lg font-extrabold tracking-tightish">{language === "zh" ? "需要留意" : "Needs attention"}</h2>
          <div className="mt-3 space-y-3 text-sm leading-6 text-ink-soft">
            {insights
              .filter((insight) => insight.claimLevel === "requires_professional_review")
              .map((insight) => (
                <p key={insight.id}>{language === "zh" ? insight.statement : insight.statementEn}</p>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
