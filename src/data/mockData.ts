import type { AuditLog, Child, EvaluationDimension, LongitudinalInsight, ReportDraft, SessionSummary } from "../types/domain";

export const child: Child = {
  id: "xiaoyu",
  displayName: "小宇",
  displayNameEn: "Xiaoyu",
  profileType: "ASD",
  ageLabel: "5 岁",
  sessionCount: 8,
  lastSessionAt: "2026-06-27",
  baselineStatus: "ready",
  consentStatus: "active",
  reviewStatus: "needs_review",
  teacher: "陈老师",
  guardianSummary: "监护人同意本周期保存脱敏特征与老师审核后的报告。"
};

export const children: Child[] = [
  child,
  {
    ...child,
    id: "lele",
    displayName: "乐乐",
    displayNameEn: "Lele",
    profileType: "CP",
    teacher: "林老师",
    reviewStatus: "normal",
    guardianSummary: "监护人同意保存脱敏运动特征和作品审核记录。"
  },
  {
    ...child,
    id: "anan",
    displayName: "安安",
    displayNameEn: "Anan",
    profileType: "HEARING",
    teacher: "王老师",
    reviewStatus: "needs_review",
    guardianSummary: "监护人同意保存触觉与视觉反馈相关脱敏特征。"
  }
];

export const sessions: SessionSummary[] = [
  {
    id: "session-1",
    childId: "xiaoyu",
    index: 1,
    startedAt: "2026-06-03",
    durationSec: 640,
    completedPhase: "explore",
    story: "初次进入流程，动作较少，恢复时间偏长。",
    stimulus: "free_play",
    motion: { activeTimeRatio: 0.18, averageAmplitude: 22, movementSmoothness: 0.42, responseLatencyMs: 1800, fatigueSlope: -0.32 },
    affect: { dominantState: "unknown", confidence: 0.52, overloadCount: 1, recoveryMedianSec: 180, teacherInterventionCount: 3 },
    participation: { seedCount: 1, voluntaryActionCount: 4, refusalCount: 2, teachBearCount: 0 },
    notes: ["需要更多流程预告", "对突然变化较谨慎"]
  },
  {
    id: "session-2",
    childId: "xiaoyu",
    index: 2,
    startedAt: "2026-06-06",
    durationSec: 690,
    completedPhase: "capture_seed",
    story: "低参与，出现两次暂停，但能接受熟悉旋律引导。",
    stimulus: "familiar_melody",
    motion: { activeTimeRatio: 0.24, averageAmplitude: 28, movementSmoothness: 0.48, responseLatencyMs: 1540, fatigueSlope: -0.28 },
    affect: { dominantState: "calm", confidence: 0.62, overloadCount: 1, recoveryMedianSec: 160, teacherInterventionCount: 2 },
    participation: { seedCount: 1, voluntaryActionCount: 7, refusalCount: 2, teachBearCount: 1 },
    notes: ["熟悉旋律作为锚点有效", "需要保留暂停权"]
  },
  {
    id: "session-3",
    childId: "xiaoyu",
    index: 3,
    startedAt: "2026-06-10",
    durationSec: 720,
    completedPhase: "capture_seed",
    story: "开始主动挥手，能把动作作为创作素材。",
    stimulus: "familiar_melody",
    motion: { activeTimeRatio: 0.36, averageAmplitude: 36, movementSmoothness: 0.56, responseLatencyMs: 1320, fatigueSlope: -0.22 },
    affect: { dominantState: "curious", confidence: 0.68, overloadCount: 0, recoveryMedianSec: 118, teacherInterventionCount: 1 },
    participation: { seedCount: 2, voluntaryActionCount: 12, refusalCount: 1, teachBearCount: 1 },
    notes: ["主动挥手可作为重复观察点", "小熊示弱后回应增加"]
  },
  {
    id: "session-4",
    childId: "xiaoyu",
    index: 4,
    startedAt: "2026-06-14",
    durationSec: 780,
    completedPhase: "compose",
    story: "熟悉旋律下参与增加，主动动作更稳定。",
    stimulus: "familiar_melody",
    motion: { activeTimeRatio: 0.44, averageAmplitude: 40, movementSmoothness: 0.64, responseLatencyMs: 1080, fatigueSlope: -0.18 },
    affect: { dominantState: "engaged", confidence: 0.74, overloadCount: 0, recoveryMedianSec: 100, teacherInterventionCount: 1 },
    participation: { seedCount: 3, voluntaryActionCount: 18, refusalCount: 1, teachBearCount: 2 },
    notes: ["可进入补全成歌预览", "动作节律与音乐锚点同步度更好"]
  },
  {
    id: "session-5",
    childId: "xiaoyu",
    index: 5,
    startedAt: "2026-06-17",
    durationSec: 820,
    completedPhase: "compose",
    story: "主动创作素材增加，能要求小熊再学一次。",
    stimulus: "slow_tempo",
    motion: { activeTimeRatio: 0.52, averageAmplitude: 45, movementSmoothness: 0.67, responseLatencyMs: 960, fatigueSlope: -0.15 },
    affect: { dominantState: "engaged", confidence: 0.78, overloadCount: 0, recoveryMedianSec: 92, teacherInterventionCount: 1 },
    participation: { seedCount: 4, voluntaryActionCount: 24, refusalCount: 0, teachBearCount: 3 },
    notes: ["角色反转环节效果明显", "慢节奏下维持参与时间更长"]
  },
  {
    id: "session-6",
    childId: "xiaoyu",
    index: 6,
    startedAt: "2026-06-20",
    durationSec: 610,
    completedPhase: "explore",
    story: "高亮动画出现后退出，老师介入次数增加，建议复核刺激强度。",
    stimulus: "high_brightness",
    motion: { activeTimeRatio: 0.31, averageAmplitude: 34, movementSmoothness: 0.46, responseLatencyMs: 1680, fatigueSlope: -0.38 },
    affect: { dominantState: "overloaded", confidence: 0.71, overloadCount: 3, recoveryMedianSec: 210, teacherInterventionCount: 4 },
    participation: { seedCount: 1, voluntaryActionCount: 8, refusalCount: 3, teachBearCount: 0 },
    notes: ["高亮动画前后反应差异明显", "下次降低亮度并保留熟悉旋律"]
  },
  {
    id: "session-7",
    childId: "xiaoyu",
    index: 7,
    startedAt: "2026-06-24",
    durationSec: 830,
    completedPhase: "compose",
    story: "降低刺激后恢复更快，能回到共创流程。",
    stimulus: "low_brightness",
    motion: { activeTimeRatio: 0.54, averageAmplitude: 43, movementSmoothness: 0.69, responseLatencyMs: 910, fatigueSlope: -0.12 },
    affect: { dominantState: "calm", confidence: 0.76, overloadCount: 1, recoveryMedianSec: 82, teacherInterventionCount: 1 },
    participation: { seedCount: 3, voluntaryActionCount: 22, refusalCount: 0, teachBearCount: 2 },
    notes: ["低亮度反馈更易维持稳定状态", "恢复时间较 Session 6 明显缩短"]
  },
  {
    id: "session-8",
    childId: "xiaoyu",
    index: 8,
    startedAt: "2026-06-27",
    durationSec: 900,
    completedPhase: "reveal",
    story: "完成完整共创流程，作品进入老师审核。",
    stimulus: "slow_tempo",
    motion: { activeTimeRatio: 0.61, averageAmplitude: 48, movementSmoothness: 0.73, responseLatencyMs: 820, fatigueSlope: -0.1 },
    affect: { dominantState: "engaged", confidence: 0.81, overloadCount: 0, recoveryMedianSec: 76, teacherInterventionCount: 1 },
    participation: { seedCount: 5, voluntaryActionCount: 30, refusalCount: 0, teachBearCount: 4 },
    notes: ["能完成揭晓环节", "作品署名前仍需老师审核"]
  }
];

export const allSessions: SessionSummary[] = [
  ...sessions,
  ...sessions.map((session) => ({
    ...session,
    id: session.id.replace("session", "lele-session"),
    childId: "lele",
    motion: {
      ...session.motion,
      averageAmplitude: session.motion.averageAmplitude + 8,
      responseLatencyMs: Math.max(600, session.motion.responseLatencyMs - 120)
    },
    story:
      session.index === 6
        ? "高强度视觉提示后短暂停顿，老师调整为触觉反馈后继续参与。"
        : session.story.replace("小宇", "乐乐").replace("高亮动画", "强视觉提示")
  })),
  ...sessions.map((session) => ({
    ...session,
    id: session.id.replace("session", "anan-session"),
    childId: "anan",
    stimulus: session.index % 2 === 0 ? "low_brightness" : session.stimulus,
    story:
      session.index === 8
        ? "完成视觉波形与字幕版揭晓，作品进入老师审核。"
        : session.story.replace("小宇", "安安").replace("熟悉旋律", "视觉波形")
  }))
];

const plainScoreScale = [
  "1 分：几乎没有出现或明显不舒服",
  "3 分：在熟悉支持下能做到一部分",
  "5 分：能主动、稳定地做到，并能换个活动继续用"
];

const plainScoreScaleEn = [
  "1: rarely appears or clearly feels uncomfortable",
  "3: appears with familiar support",
  "5: appears independently and carries over to another activity"
];

export const evaluationDimensions: EvaluationDimension[] = [
  {
    id: "join",
    title: "愿不愿意参与",
    titleEn: "Willingness to join",
    score: 4,
    summary: "看孩子是不是愿意进入活动、停留一会儿，并在需要时继续尝试。",
    summaryEn: "Shows whether the child is willing to enter the activity, stay for a while, and try again when needed.",
    criteria: ["孩子能不能主动开始或继续活动", "能不能完成一个小片段", "中断后愿不愿意再回来"],
    criteriaEn: ["Starts or continues the activity", "Completes one small activity segment", "Returns after a pause or interruption"],
    scale: plainScoreScale,
    scaleEn: plainScoreScaleEn
  },
  {
    id: "choice",
    title: "会不会表达选择",
    titleEn: "Making choices",
    score: 4,
    summary: "看孩子能不能用动作、声音、眼神或按钮告诉我们：要这个、不要这个、想继续或想暂停。",
    summaryEn: "Shows whether the child can use motion, sound, gaze, or a button to say yes, no, continue, or pause.",
    criteria: ["能不能在两个选项里做选择", "能不能表达继续、暂停或重来", "选择后能不能坚持一小段时间"],
    criteriaEn: ["Chooses between two options", "Shows continue, pause, or try again", "Stays with the choice for a short while"],
    scale: plainScoreScale,
    scaleEn: plainScoreScaleEn
  },
  {
    id: "focus",
    title: "能不能保持兴趣",
    titleEn: "Staying interested",
    score: 3,
    summary: "看孩子是不是把注意力放在活动上，遇到等待、变化或一次失败时还能不能继续。",
    summaryEn: "Shows whether the child keeps attention on the activity and continues through waiting, change, or one failed try.",
    criteria: ["能不能看、听或操作一小段时间", "分心后能不能被轻轻带回来", "遇到变化时有没有继续探索"],
    criteriaEn: ["Looks, listens, or acts for a short span", "Can be gently brought back after distraction", "Keeps exploring after a small change"],
    scale: plainScoreScale,
    scaleEn: plainScoreScaleEn
  },
  {
    id: "respond",
    title: "有没有回应别人",
    titleEn: "Responding to others",
    score: 3,
    summary: "看孩子有没有回应老师、同伴或小熊，例如看一眼、接一句、模仿一次、轮到自己时接上。",
    summaryEn: "Shows whether the child responds to a teacher, peer, or character through gaze, sound, imitation, or turn-taking.",
    criteria: ["别人邀请时有没有回应", "能不能完成一次轮流互动", "有没有主动发起互动"],
    criteriaEn: ["Responds when invited", "Completes one turn-taking moment", "Starts an interaction"],
    scale: plainScoreScale,
    scaleEn: plainScoreScaleEn
  },
  {
    id: "create",
    title: "有没有自己的表达",
    titleEn: "Personal expression",
    score: 4,
    summary: "看孩子有没有把声音、动作、节奏或选择变成自己的表达，而不是只跟着做。",
    summaryEn: "Shows whether the child turns sound, motion, rhythm, or choices into personal expression instead of only following prompts.",
    criteria: ["有没有自己的声音、动作或节奏", "表达能不能被重复或接住", "有没有主动改变作品的一小部分"],
    criteriaEn: ["Uses a personal sound, motion, or rhythm", "Repeats or builds on the expression", "Changes a small part of the work"],
    scale: plainScoreScale,
    scaleEn: plainScoreScaleEn
  },
  {
    id: "recover",
    title: "不舒服后能不能回来",
    titleEn: "Returning after discomfort",
    score: 3,
    summary: "看孩子不舒服、想停或被打断以后，怎样才能回到安全、舒服的活动节奏。",
    summaryEn: "Shows what helps the child return to a safe, comfortable activity rhythm after discomfort, pausing, or interruption.",
    criteria: ["暂停后能不能回到活动", "需要老师怎样支持", "降低声音、亮度或速度后有没有好转"],
    criteriaEn: ["Returns after a pause", "Shows what kind of teacher support is needed", "Improves after lowering sound, brightness, or speed"],
    scale: plainScoreScale,
    scaleEn: plainScoreScaleEn
  },
  {
    id: "access",
    title: "操作方式合不合适",
    titleEn: "Input fit",
    score: 3,
    summary: "看触屏、按钮、手势、声音或其他输入方式，对孩子来说是不是省力、清楚、可重复。",
    summaryEn: "Shows whether touch, buttons, gestures, voice, or another input method is low-effort, clear, and repeatable for the child.",
    criteria: ["能不能稳定触发系统", "误触或挫败感多不多", "是否需要换成更轻松的操作方式"],
    criteriaEn: ["Triggers the system reliably", "Shows few mis-taps or frustration signs", "May need an easier input method"],
    scale: plainScoreScale,
    scaleEn: plainScoreScaleEn
  },
  {
    id: "setting",
    title: "环境设置舒不舒服",
    titleEn: "Comfort of settings",
    score: 4,
    summary: "看音乐、亮度、动画、节奏、空间和提示方式，是在帮助孩子参与，还是让负担变高。",
    summaryEn: "Shows whether music, brightness, animation, tempo, space, and prompts help the child participate or raise the load.",
    criteria: ["哪些音乐或画面让孩子更舒服", "哪些设置容易让孩子退出", "下次应该保留或调低什么"],
    criteriaEn: ["Finds music or visuals that feel comfortable", "Finds settings that may lead to withdrawal", "Decides what to keep or lower next time"],
    scale: plainScoreScale,
    scaleEn: plainScoreScaleEn
  },
  {
    id: "goal",
    title: "本周目标有没有进展",
    titleEn: "Progress on this week's goal",
    score: 3,
    summary: "看孩子这次是不是比自己的小目标更接近一步，只和自己的小目标比较，不和别的孩子比较。",
    summaryEn: "Shows whether the child moved closer to their own small goal this week. This is not compared with other children.",
    criteria: ["这周的小目标是什么", "本次有没有达到预期的一小步", "下次目标要不要调高、调低或换一种支持"],
    criteriaEn: ["Names the small goal for this week", "Checks whether this session reached the expected next step", "Adjusts the next goal or support level"],
    scale: plainScoreScale,
    scaleEn: plainScoreScaleEn
  }
];

export const insights: LongitudinalInsight[] = [
  {
    id: "insight-engagement",
    childId: "xiaoyu",
    window: "last_8_sessions",
    type: "engagement",
    title: "熟悉旋律下参与更稳定",
    statement: "最近 8 次活动中，小宇在熟悉旋律和慢节奏音乐下更容易保持投入状态。",
    evidenceSessionIds: ["session-2", "session-4", "session-5", "session-8"],
    confidence: "high",
    claimLevel: "trend"
  },
  {
    id: "insight-stimulus",
    childId: "xiaoyu",
    window: "last_8_sessions",
    type: "needs_human_review",
    title: "高亮视觉反馈后需要复核",
    statement: "第 6 次活动的高亮动画后出现退出和负担偏高的观察信号，建议老师复核画面亮度和动画强度。",
    evidenceSessionIds: ["session-6"],
    confidence: "medium",
    claimLevel: "requires_professional_review"
  },
  {
    id: "insight-recovery",
    childId: "xiaoyu",
    window: "last_4_sessions",
    type: "affect_recovery",
    title: "低负担设置下更容易回到活动",
    statement: "最近 3 次低亮度或慢节奏活动中，不舒服后的恢复时间更短，仍需结合老师现场备注复核。",
    evidenceSessionIds: ["session-5", "session-7", "session-8"],
    confidence: "medium",
    claimLevel: "trend"
  },
  {
    id: "insight-motion",
    childId: "xiaoyu",
    window: "last_8_sessions",
    type: "motion_stability",
    title: "主动动作次数整体上升",
    statement: "从第 1 次到第 8 次活动，主动动作次数和创作素材数量整体增加，后续可观察的样本更丰富。",
    evidenceSessionIds: ["session-1", "session-8"],
    confidence: "high",
    claimLevel: "observation"
  },
  {
    id: "insight-bear",
    childId: "xiaoyu",
    window: "last_8_sessions",
    type: "engagement",
    title: "教小熊环节带来更多回应",
    statement: "当小熊请小宇再教一次时，小宇的重复参与和创作素材提供次数增加，适合作为下次活动的观察重点。",
    evidenceSessionIds: ["session-3", "session-5", "session-8"],
    confidence: "medium",
    claimLevel: "observation"
  }
];

export const allInsights: LongitudinalInsight[] = [
  ...insights,
  ...insights.map((insight) => ({
    ...insight,
    id: insight.id.replace("insight", "lele-insight"),
    childId: "lele",
    statement: insight.statement.replace("小宇", "乐乐").replace("高亮动画", "强视觉提示")
  })),
  ...insights.map((insight) => ({
    ...insight,
    id: insight.id.replace("insight", "anan-insight"),
    childId: "anan",
    statement: insight.statement.replace("小宇", "安安").replace("熟悉旋律", "视觉波形")
  }))
];

export const reportDraft: ReportDraft = {
  id: "report-xiaoyu-8",
  childId: "xiaoyu",
  status: "teacher_reviewing",
  period: { start: "2026-06-03", end: "2026-06-27", sessionCount: 8 },
  professionalDraft: {
    overview: "本周期共记录 8 次共创活动。小宇从初期较少动作回应，逐步进入熟悉旋律、慢节奏和低亮度反馈下的完整共创流程。",
    motionObservation: "主动动作次数、创作素材数量和动作稳定度在多数活动中呈上升趋势。第 6 次活动在高亮动画后出现短时退出，需要单独复核画面设置。",
    affectObservation: "投入和平静状态更多出现在熟悉旋律、低亮度或慢节奏条件下。负担偏高的观察信号主要集中在第 6 次活动。",
    participationObservation: "小宇在“教小熊唱歌”环节的重复参与增加，第 8 次活动完成揭晓并进入老师审核。",
    reviewPoints: ["复核高亮视觉反馈是否需要默认关闭", "继续观察慢节奏音乐下的参与稳定性", "保留暂停和重新开始权"],
    limitationNote: "本报告仅整理活动中的动作、情绪与参与观察信号，需由老师、治疗师或医生结合现场情况复核。"
  },
  parentSummary: {
    overview: "本周期小宇参加了 8 次音乐共创活动，逐步从尝试回应进入完整作品揭晓。",
    positiveMoments: "他在熟悉旋律和慢节奏音乐下更愿意参与，也多次帮助小熊“再学一遍”。",
    nextObservationFocus: "下次建议继续使用低亮度反馈，并观察哪些音乐节奏让他更舒服。"
  },
  safetyCheck: {
    containsMedicalClaim: false,
    flaggedPhrases: []
  },
  teacherNote: "建议下一次以低亮度、慢节奏、熟悉旋律开场。"
};

export const reportDrafts: ReportDraft[] = [
  reportDraft,
  {
    ...reportDraft,
    id: "report-lele-8",
    childId: "lele",
    professionalDraft: {
      ...reportDraft.professionalDraft,
      overview: reportDraft.professionalDraft.overview.replace("小宇", "乐乐"),
      participationObservation: reportDraft.professionalDraft.participationObservation.replace("小宇", "乐乐")
    },
    parentSummary: {
      ...reportDraft.parentSummary,
      overview: reportDraft.parentSummary.overview.replace("小宇", "乐乐")
    },
    teacherNote: "建议下一次优先使用触觉反馈，并降低视觉提示强度。"
  },
  {
    ...reportDraft,
    id: "report-anan-8",
    childId: "anan",
    professionalDraft: {
      ...reportDraft.professionalDraft,
      overview: reportDraft.professionalDraft.overview.replace("小宇", "安安").replace("熟悉旋律", "视觉波形"),
      participationObservation: reportDraft.professionalDraft.participationObservation.replace("小宇", "安安")
    },
    parentSummary: {
      ...reportDraft.parentSummary,
      overview: reportDraft.parentSummary.overview.replace("小宇", "安安")
    },
    teacherNote: "建议下一次继续使用字幕、波形和低亮度反馈。"
  }
];

export const auditLogs: AuditLog[] = [
  {
    id: "audit-1",
    childId: "xiaoyu",
    actor: "陈老师",
    action: "report.teacher_reviewing",
    targetType: "report",
    targetId: "report-xiaoyu-8",
    createdAt: "2026-06-27T10:15:00+08:00",
    summary: "报告草稿进入老师审核。"
  }
];
