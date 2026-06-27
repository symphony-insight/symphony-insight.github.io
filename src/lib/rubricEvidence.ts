import type { EvaluationDimension, Language, SessionSummary } from "../types/domain";

export type MetricTrend = "up" | "down" | "flat";

export type MetricChange = {
  label: string;
  from: string;
  to: string;
  trend: MetricTrend;
};

export type RubricEvidence = {
  id: EvaluationDimension["id"];
  metricChanges: MetricChange[];
  evidenceSessions: number[];
  teacherConfirmed: boolean;
  frameworkLabel: string;
};

type MetricPicker = (session: SessionSummary) => number;

type MetricSpec = {
  labelZh: string;
  labelEn: string;
  pick: MetricPicker;
  unit?: string;
  // for these metrics a lower value is the desired direction
  lowerIsBetter?: boolean;
};

type RubricSpec = {
  metrics: MetricSpec[];
  frameworkZh: string;
  frameworkEn: string;
  // sessions to surface as supporting evidence (1-based activity index)
  evidenceIndexes: number[];
  // mock teacher confirmation state
  confirmed: boolean;
};

const rubricSpecs: Record<EvaluationDimension["id"], RubricSpec> = {
  join: {
    metrics: [
      { labelZh: "主动参加", labelEn: "Self-started actions", pick: (s) => s.participation.voluntaryActionCount },
      { labelZh: "退出次数", labelEn: "Refusals", pick: (s) => s.participation.refusalCount, lowerIsBetter: true }
    ],
    frameworkZh: "参与时长与返回",
    frameworkEn: "Engagement & return",
    evidenceIndexes: [2, 4, 5, 8],
    confirmed: true
  },
  choice: {
    metrics: [
      { labelZh: "教小熊次数", labelEn: "Teach-the-bear turns", pick: (s) => s.participation.teachBearCount },
      { labelZh: "主动参加", labelEn: "Self-started actions", pick: (s) => s.participation.voluntaryActionCount }
    ],
    frameworkZh: "选择与表达",
    frameworkEn: "Choice & expression",
    evidenceIndexes: [3, 5, 8],
    confirmed: true
  },
  focus: {
    metrics: [
      { labelZh: "参与时间占比", labelEn: "Active time ratio", pick: (s) => Math.round(s.motion.activeTimeRatio * 100), unit: "%" },
      { labelZh: "退出次数", labelEn: "Refusals", pick: (s) => s.participation.refusalCount, lowerIsBetter: true }
    ],
    frameworkZh: "持续参与",
    frameworkEn: "Sustained attention",
    evidenceIndexes: [4, 6, 7, 8],
    confirmed: true
  },
  respond: {
    metrics: [
      { labelZh: "和小熊互动", labelEn: "Interactions with the bear", pick: (s) => s.participation.teachBearCount },
      { labelZh: "老师提示", labelEn: "Teacher prompts", pick: (s) => s.affect.teacherInterventionCount, lowerIsBetter: true }
    ],
    frameworkZh: "共同注意与轮流",
    frameworkEn: "Joint attention & turn-taking",
    evidenceIndexes: [3, 5, 8],
    confirmed: true
  },
  create: {
    metrics: [
      { labelZh: "创作片段数", labelEn: "Creative clips", pick: (s) => s.participation.seedCount },
      { labelZh: "主动参加", labelEn: "Self-started actions", pick: (s) => s.participation.voluntaryActionCount }
    ],
    frameworkZh: "原创表达",
    frameworkEn: "Personal expression",
    evidenceIndexes: [4, 5, 8],
    confirmed: true
  },
  recover: {
    metrics: [
      { labelZh: "回到活动用时", labelEn: "Time to return", pick: (s) => s.affect.recoveryMedianSec, unit: "s", lowerIsBetter: true },
      { labelZh: "老师提示", labelEn: "Teacher prompts", pick: (s) => s.affect.teacherInterventionCount, lowerIsBetter: true }
    ],
    frameworkZh: "恢复与支持",
    frameworkEn: "Recovery & support",
    evidenceIndexes: [6, 7, 8],
    confirmed: false
  },
  access: {
    metrics: [
      { labelZh: "回应用时", labelEn: "Response latency", pick: (s) => s.motion.responseLatencyMs, unit: "ms", lowerIsBetter: true },
      { labelZh: "老师提示", labelEn: "Teacher prompts", pick: (s) => s.affect.teacherInterventionCount, lowerIsBetter: true }
    ],
    frameworkZh: "操作可达性",
    frameworkEn: "Input accessibility",
    evidenceIndexes: [1, 4, 8],
    confirmed: true
  },
  setting: {
    metrics: [
      { labelZh: "吃力次数", labelEn: "Overload moments", pick: (s) => s.affect.overloadCount, lowerIsBetter: true },
      { labelZh: "退出次数", labelEn: "Refusals", pick: (s) => s.participation.refusalCount, lowerIsBetter: true }
    ],
    frameworkZh: "环境适配",
    frameworkEn: "Setting fit",
    evidenceIndexes: [6, 7, 8],
    confirmed: false
  },
  goal: {
    metrics: [
      { labelZh: "创作片段数", labelEn: "Creative clips", pick: (s) => s.participation.seedCount },
      { labelZh: "主动参加", labelEn: "Self-started actions", pick: (s) => s.participation.voluntaryActionCount }
    ],
    frameworkZh: "目标达成（只和自己比）",
    frameworkEn: "Goal attainment (self-referenced)",
    evidenceIndexes: [1, 8],
    confirmed: true
  }
};

export function getFrameworkLabel(id: EvaluationDimension["id"], language: Language) {
  const spec = rubricSpecs[id];
  return language === "zh" ? spec.frameworkZh : spec.frameworkEn;
}

export function getMetricLabels(id: EvaluationDimension["id"], language: Language) {
  return rubricSpecs[id].metrics.map((metric) => (language === "zh" ? metric.labelZh : metric.labelEn));
}

function formatValue(value: number, unit?: string) {
  return unit ? `${value}${unit}` : `${value}`;
}

function trendOf(from: number, to: number, lowerIsBetter?: boolean): MetricTrend {
  if (to === from) return "flat";
  const rising = to > from;
  // "up" means moving in the desired direction (good)
  if (lowerIsBetter) return rising ? "down" : "up";
  return rising ? "up" : "down";
}

export function getRubricEvidence(id: EvaluationDimension["id"], sessions: SessionSummary[], language: Language): RubricEvidence {
  const spec = rubricSpecs[id];
  const ordered = [...sessions].sort((a, b) => a.index - b.index);
  const first = ordered[0];
  const last = ordered[ordered.length - 1];

  const metricChanges: MetricChange[] =
    first && last
      ? spec.metrics.map((metric) => {
          const fromValue = metric.pick(first);
          const toValue = metric.pick(last);
          return {
            label: language === "zh" ? metric.labelZh : metric.labelEn,
            from: formatValue(fromValue, metric.unit),
            to: formatValue(toValue, metric.unit),
            trend: trendOf(fromValue, toValue, metric.lowerIsBetter)
          };
        })
      : [];

  const availableIndexes = new Set(ordered.map((session) => session.index));
  const evidenceSessions = spec.evidenceIndexes.filter((index) => availableIndexes.has(index));

  return {
    id,
    metricChanges,
    evidenceSessions: evidenceSessions.length > 0 ? evidenceSessions : ordered.map((s) => s.index).slice(0, 3),
    teacherConfirmed: spec.confirmed,
    frameworkLabel: language === "zh" ? spec.frameworkZh : spec.frameworkEn
  };
}
