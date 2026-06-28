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
  guardianSummary: "家长同意保存本轮活动记录，以及老师看过后的报告。"
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
    guardianSummary: "家长同意保存活动记录和作品确认记录。"
  },
  {
    ...child,
    id: "anan",
    displayName: "安安",
    displayNameEn: "Anan",
    profileType: "HEARING",
    teacher: "王老师",
    reviewStatus: "needs_review",
    guardianSummary: "家长同意保存触觉和画面反馈相关的活动记录。"
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
    story: "第一次活动，动作不多，回到活动需要更久。",
    stimulus: "free_play",
    motion: { activeTimeRatio: 0.18, averageAmplitude: 22, movementSmoothness: 0.42, responseLatencyMs: 1800, fatigueSlope: -0.32 },
    affect: { dominantState: "unknown", confidence: 0.52, overloadCount: 1, recoveryMedianSec: 180, teacherInterventionCount: 3 },
    participation: { seedCount: 1, voluntaryActionCount: 4, refusalCount: 2, teachBearCount: 0 },
    notes: ["开始前需要说清楚接下来做什么", "遇到突然变化会比较谨慎"]
  },
  {
    id: "session-2",
    childId: "xiaoyu",
    index: 2,
    startedAt: "2026-06-06",
    durationSec: 690,
    completedPhase: "capture_seed",
    story: "参与时间偏短，中途暂停了两次，但熟悉旋律能帮他继续。",
    stimulus: "familiar_melody",
    motion: { activeTimeRatio: 0.24, averageAmplitude: 28, movementSmoothness: 0.48, responseLatencyMs: 1540, fatigueSlope: -0.28 },
    affect: { dominantState: "calm", confidence: 0.62, overloadCount: 1, recoveryMedianSec: 160, teacherInterventionCount: 2 },
    participation: { seedCount: 1, voluntaryActionCount: 7, refusalCount: 2, teachBearCount: 1 },
    notes: ["熟悉旋律能帮他稳住", "要保留随时暂停的选择"]
  },
  {
    id: "session-3",
    childId: "xiaoyu",
    index: 3,
    startedAt: "2026-06-10",
    durationSec: 720,
    completedPhase: "capture_seed",
    story: "开始主动挥手，这个动作可以放进作品里。",
    stimulus: "familiar_melody",
    motion: { activeTimeRatio: 0.36, averageAmplitude: 36, movementSmoothness: 0.56, responseLatencyMs: 1320, fatigueSlope: -0.22 },
    affect: { dominantState: "curious", confidence: 0.68, overloadCount: 0, recoveryMedianSec: 118, teacherInterventionCount: 1 },
    participation: { seedCount: 2, voluntaryActionCount: 12, refusalCount: 1, teachBearCount: 1 },
    notes: ["主动挥手可以继续观察", "小熊请他教一遍时，回应变多了"]
  },
  {
    id: "session-4",
    childId: "xiaoyu",
    index: 4,
    startedAt: "2026-06-14",
    durationSec: 780,
    completedPhase: "compose",
    story: "听到熟悉旋律时，他参与得更多，主动动作也更稳。",
    stimulus: "familiar_melody",
    motion: { activeTimeRatio: 0.44, averageAmplitude: 40, movementSmoothness: 0.64, responseLatencyMs: 1080, fatigueSlope: -0.18 },
    affect: { dominantState: "engaged", confidence: 0.74, overloadCount: 0, recoveryMedianSec: 100, teacherInterventionCount: 1 },
    participation: { seedCount: 3, voluntaryActionCount: 18, refusalCount: 1, teachBearCount: 2 },
    notes: ["可以试试把片段接成一小段歌", "跟着熟悉旋律做动作时更顺"]
  },
  {
    id: "session-5",
    childId: "xiaoyu",
    index: 5,
    startedAt: "2026-06-17",
    durationSec: 820,
    completedPhase: "compose",
    story: "主动给出的创作片段变多了，还会要求小熊再学一次。",
    stimulus: "slow_tempo",
    motion: { activeTimeRatio: 0.52, averageAmplitude: 45, movementSmoothness: 0.67, responseLatencyMs: 960, fatigueSlope: -0.15 },
    affect: { dominantState: "engaged", confidence: 0.78, overloadCount: 0, recoveryMedianSec: 92, teacherInterventionCount: 1 },
    participation: { seedCount: 4, voluntaryActionCount: 24, refusalCount: 0, teachBearCount: 3 },
    notes: ["让他教小熊时，回应更多", "慢一点的节奏能让他多待一会儿"]
  },
  {
    id: "session-6",
    childId: "xiaoyu",
    index: 6,
    startedAt: "2026-06-20",
    durationSec: 610,
    completedPhase: "explore",
    story: "高亮动画出现后，他退出了活动，老师需要帮忙的次数变多。",
    stimulus: "high_brightness",
    motion: { activeTimeRatio: 0.31, averageAmplitude: 34, movementSmoothness: 0.46, responseLatencyMs: 1680, fatigueSlope: -0.38 },
    affect: { dominantState: "overloaded", confidence: 0.71, overloadCount: 3, recoveryMedianSec: 210, teacherInterventionCount: 4 },
    participation: { seedCount: 1, voluntaryActionCount: 8, refusalCount: 3, teachBearCount: 0 },
    notes: ["高亮动画前后差别很明显", "下次先降低亮度，并保留熟悉旋律"]
  },
  {
    id: "session-7",
    childId: "xiaoyu",
    index: 7,
    startedAt: "2026-06-24",
    durationSec: 830,
    completedPhase: "compose",
    story: "画面变柔和后，他回来得更快，也能继续一起创作。",
    stimulus: "low_brightness",
    motion: { activeTimeRatio: 0.54, averageAmplitude: 43, movementSmoothness: 0.69, responseLatencyMs: 910, fatigueSlope: -0.12 },
    affect: { dominantState: "calm", confidence: 0.76, overloadCount: 1, recoveryMedianSec: 82, teacherInterventionCount: 1 },
    participation: { seedCount: 3, voluntaryActionCount: 22, refusalCount: 0, teachBearCount: 2 },
    notes: ["低亮度画面更容易让他稳住", "回到活动的时间比第 6 次明显短"]
  },
  {
    id: "session-8",
    childId: "xiaoyu",
    index: 8,
    startedAt: "2026-06-27",
    durationSec: 900,
    completedPhase: "reveal",
    story: "完成了一次完整的共创活动，作品等老师确认。",
    stimulus: "slow_tempo",
    motion: { activeTimeRatio: 0.61, averageAmplitude: 48, movementSmoothness: 0.73, responseLatencyMs: 820, fatigueSlope: -0.1 },
    affect: { dominantState: "engaged", confidence: 0.81, overloadCount: 0, recoveryMedianSec: 76, teacherInterventionCount: 1 },
    participation: { seedCount: 5, voluntaryActionCount: 30, refusalCount: 0, teachBearCount: 4 },
    notes: ["能看到作品揭晓", "作品署名前还需要老师看一遍"]
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
        ? "强画面提示后短暂停顿，老师改成触觉提示后，他继续参与。"
        : session.story.replace("小宇", "乐乐").replace("高亮动画", "强视觉提示")
  })),
  ...sessions.map((session) => ({
    ...session,
    id: session.id.replace("session", "anan-session"),
    childId: "anan",
    stimulus: session.index % 2 === 0 ? "low_brightness" : session.stimulus,
    story:
      session.index === 8
        ? "完成视觉波形和字幕版揭晓，作品等老师确认。"
        : session.story.replace("小宇", "安安").replace("熟悉旋律", "视觉波形")
  }))
];

const plainScoreScale = [
  "1 分：很少出现，或孩子明显不舒服",
  "3 分：有人提醒时能做到一部分",
  "5 分：能主动做到，换个活动也能继续用"
];

const plainScoreScaleEn = [
  "1: rarely appears or clearly feels uncomfortable",
  "3: appears with familiar support",
  "5: appears independently and carries over to another activity"
];

export const evaluationDimensions: EvaluationDimension[] = [
  {
    id: "join",
    title: "愿不愿意参加",
    titleEn: "Willingness to join",
    score: 4,
    summary: "看孩子愿不愿意开始活动，能不能停留一会儿，暂停后还愿不愿意再试。",
    summaryEn: "Shows whether the child is willing to enter the activity, stay for a while, and try again when needed.",
    criteria: ["孩子会不会主动开始或继续", "能不能完成一个小片段", "暂停后还愿不愿意回来"],
    criteriaEn: ["Starts or continues the activity", "Completes one small activity segment", "Returns after a pause or interruption"],
    scale: plainScoreScale,
    scaleEn: plainScoreScaleEn
  },
  {
    id: "choice",
    title: "能不能说出选择",
    titleEn: "Making choices",
    score: 4,
    summary: "看孩子能不能用动作、声音、眼神或按钮告诉我们：想要、不要、继续，还是暂停。",
    summaryEn: "Shows whether the child can use motion, sound, gaze, or a button to say yes, no, continue, or pause.",
    criteria: ["能不能从两个选项里选一个", "能不能表达继续、暂停或重来", "选好后能不能坚持一小会儿"],
    criteriaEn: ["Chooses between two options", "Shows continue, pause, or try again", "Stays with the choice for a short while"],
    scale: plainScoreScale,
    scaleEn: plainScoreScaleEn
  },
  {
    id: "focus",
    title: "能不能保持兴趣",
    titleEn: "Staying interested",
    score: 3,
    summary: "看孩子能不能把注意力放在活动上。遇到等待、变化或一次没成功时，还能不能继续。",
    summaryEn: "Shows whether the child keeps attention on the activity and continues through waiting, change, or one failed try.",
    criteria: ["能不能看、听或操作一小段时间", "分心后能不能轻轻带回来", "遇到变化时还愿不愿意试"],
    criteriaEn: ["Looks, listens, or acts for a short span", "Can be gently brought back after distraction", "Keeps exploring after a small change"],
    scale: plainScoreScale,
    scaleEn: plainScoreScaleEn
  },
  {
    id: "respond",
    title: "会不会回应别人",
    titleEn: "Responding to others",
    score: 3,
    summary: "看孩子会不会回应老师、同伴或小熊，比如看一眼、接一句、模仿一次，或者轮到自己时接上。",
    summaryEn: "Shows whether the child responds to a teacher, peer, or character through gaze, sound, imitation, or turn-taking.",
    criteria: ["别人邀请时会不会回应", "能不能完成一次轮流互动", "会不会主动找别人互动"],
    criteriaEn: ["Responds when invited", "Completes one turn-taking moment", "Starts an interaction"],
    scale: plainScoreScale,
    scaleEn: plainScoreScaleEn
  },
  {
    id: "create",
    title: "有没有自己的表达",
    titleEn: "Personal expression",
    score: 4,
    summary: "看孩子有没有用自己的声音、动作、节奏或选择来表达，而不是只跟着做。",
    summaryEn: "Shows whether the child turns sound, motion, rhythm, or choices into personal expression instead of only following prompts.",
    criteria: ["有没有自己的声音、动作或节奏", "这个表达能不能被重复或接住", "会不会主动改作品的一小部分"],
    criteriaEn: ["Uses a personal sound, motion, or rhythm", "Repeats or builds on the expression", "Changes a small part of the work"],
    scale: plainScoreScale,
    scaleEn: plainScoreScaleEn
  },
  {
    id: "recover",
    title: "不舒服后能不能回来",
    titleEn: "Returning after discomfort",
    score: 3,
    summary: "看孩子不舒服、想停或被打断以后，什么办法能帮他回到舒服的节奏。",
    summaryEn: "Shows what helps the child return to a safe, comfortable activity rhythm after discomfort, pausing, or interruption.",
    criteria: ["暂停后能不能回到活动", "老师怎么帮更有效", "声音、亮度或速度调低后有没有好一点"],
    criteriaEn: ["Returns after a pause", "Shows what kind of teacher support is needed", "Improves after lowering sound, brightness, or speed"],
    scale: plainScoreScale,
    scaleEn: plainScoreScaleEn
  },
  {
    id: "access",
    title: "操作方式顺不顺手",
    titleEn: "Input fit",
    score: 3,
    summary: "看触屏、按钮、手势、声音这些操作方式，对孩子来说是不是省力、清楚、容易重复。",
    summaryEn: "Shows whether touch, buttons, gestures, voice, or another input method is low-effort, clear, and repeatable for the child.",
    criteria: ["能不能稳定触发", "会不会经常误触或着急", "要不要换成更轻松的操作方式"],
    criteriaEn: ["Triggers the system reliably", "Shows few mis-taps or frustration signs", "May need an easier input method"],
    scale: plainScoreScale,
    scaleEn: plainScoreScaleEn
  },
  {
    id: "setting",
    title: "环境设置舒不舒服",
    titleEn: "Comfort of settings",
    score: 4,
    summary: "看音乐、亮度、动画、节奏和提示方式，是在帮孩子参与，还是让他有点吃力。",
    summaryEn: "Shows whether music, brightness, animation, tempo, space, and prompts help the child participate or raise the load.",
    criteria: ["哪些音乐或画面让孩子更舒服", "哪些设置容易让孩子退出", "下次该保留什么、调低什么"],
    criteriaEn: ["Finds music or visuals that feel comfortable", "Finds settings that may lead to withdrawal", "Decides what to keep or lower next time"],
    scale: plainScoreScale,
    scaleEn: plainScoreScaleEn
  },
  {
    id: "goal",
    title: "这周小目标有没有往前走",
    titleEn: "Progress on this week's goal",
    score: 3,
    summary: "看孩子这次有没有比自己的小目标更近一点。只和自己比，不和别的孩子比。",
    summaryEn: "Shows whether the child moved closer to their own small goal this week. This is not compared with other children.",
    criteria: ["这周的小目标是什么", "这次有没有往前走一小步", "下次目标要不要调高、调低，或换一种帮法"],
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
    title: "熟悉旋律下更愿意参加",
    statement: "最近 8 次活动里，小宇听到熟悉旋律和慢一点的音乐时，更容易留在活动里。",
    evidenceSessionIds: ["session-2", "session-4", "session-5", "session-8"],
    confidence: "high",
    claimLevel: "trend"
  },
  {
    id: "insight-stimulus",
    childId: "xiaoyu",
    window: "last_8_sessions",
    type: "needs_human_review",
    title: "高亮画面要再看一下",
    statement: "第 6 次活动里，高亮动画出现后小宇退出了活动。建议老师再看看亮度和动画速度。",
    evidenceSessionIds: ["session-6"],
    confidence: "medium",
    claimLevel: "requires_professional_review"
  },
  {
    id: "insight-recovery",
    childId: "xiaoyu",
    window: "last_4_sessions",
    type: "affect_recovery",
    title: "画面柔和时更容易回来",
    statement: "最近几次低亮度或慢节奏活动里，小宇不舒服后回来得更快。还要结合老师现场记录一起看。",
    evidenceSessionIds: ["session-5", "session-7", "session-8"],
    confidence: "medium",
    claimLevel: "trend"
  },
  {
    id: "insight-motion",
    childId: "xiaoyu",
    window: "last_8_sessions",
    type: "motion_stability",
    title: "主动动作变多了",
    statement: "从第 1 次到第 8 次活动，主动动作和创作片段都变多了，后面可以看的活动细节也更多。",
    evidenceSessionIds: ["session-1", "session-8"],
    confidence: "high",
    claimLevel: "observation"
  },
  {
    id: "insight-bear",
    childId: "xiaoyu",
    window: "last_8_sessions",
    type: "engagement",
    title: "教小熊时回应更多",
    statement: "小熊请小宇再教一次时，他更愿意重复参与，也给出更多创作片段。下次可以继续保留这个环节。",
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
  generation: {
    id: "generation-xiaoyu-8",
    status: "needs_teacher_review",
    sourceSessionCount: 8,
    sourceRubricCount: 9,
    sourceDomainCount: 6,
    generatedAt: "2026-06-27T10:10:00+08:00",
    promptVersion: "report-draft-v1-2026-06",
    modelLabel: "报告整理助手",
    modelLabelEn: "Report assistant"
  },
  professionalDraft: {
    overview: "本轮一共记录了 8 次音乐共创活动。小宇一开始动作回应较少，后来在熟悉旋律、慢节奏和低亮度画面下，能完成一次完整活动。",
    motionObservation: "多数活动里，主动动作和创作片段都在增加。第 6 次活动里，高亮动画后出现短暂退出，需要单独看一下画面设置。",
    affectObservation: "熟悉旋律、低亮度和慢节奏下，小宇更容易保持平静或投入。第 6 次活动里，他明显有点吃力。",
    participationObservation: "在“教小熊唱歌”时，小宇更愿意重复参与。第 8 次活动完成作品揭晓，等老师确认。",
    reviewPoints: ["高亮画面是否默认关闭", "慢节奏音乐能不能继续作为开场", "暂停和重新开始的选择要保留"],
    limitationNote: "这份报告只整理活动里的动作、状态和参与记录，需要老师或相关专业人员结合现场情况一起看。"
  },
  professionalDraftEn: {
    overview: "This cycle includes eight music co-creation sessions. Xiaoyu began with very limited movement responses and later completed a full activity when the setup used familiar melodies, a slower tempo, and softer visuals.",
    motionObservation: "Across most sessions, Xiaoyu offered more self-initiated movement and more usable creative material. Session 6 still showed a brief withdrawal after a bright animation, so the screen setup should be reviewed on its own.",
    affectObservation: "Familiar melodies, softer brightness, and slower pacing were the conditions in which Xiaoyu most often stayed calm or engaged. In Session 6, he showed clear signs that the activity felt demanding.",
    participationObservation: "Xiaoyu was more willing to repeat his participation during the 'teach the bear to sing' prompt. Session 8 reached a full reveal of the shared piece and is now waiting for teacher confirmation.",
    reviewPoints: [
      "Check whether bright visuals should stay off by default",
      "Keep the slower music opening if it continues to support entry",
      "Preserve the child's options to pause and restart"
    ],
    limitationNote: "This report only organizes observed movement, state, and participation records from the activity. It should be read together with teacher observation and any relevant professional follow-up."
  },
  parentSummary: {
    overview: "本轮小宇参加了 8 次音乐共创活动，慢慢从尝试回应走到完整作品揭晓。",
    positiveMoments: "熟悉旋律和慢一点的音乐下，他更愿意参与，也多次帮小熊“再学一遍”。",
    nextObservationFocus: "下次可以继续用低亮度画面，看看哪种音乐节奏让他更舒服。"
  },
  parentSummaryEn: {
    overview: "Across eight music co-creation sessions, Xiaoyu gradually moved from tentative responses to taking part in a full shared reveal.",
    positiveMoments: "With familiar melodies and a slower pace, he joined more willingly and often helped the bear 'learn it again.'",
    nextObservationFocus: "In the next cycle, it would be useful to keep the softer visuals and keep observing which musical pacing feels most comfortable for him."
  },
  safetyCheck: {
    containsMedicalClaim: false,
    flaggedPhrases: [],
    checkedAt: "2026-06-27T10:11:00+08:00",
    displayStatus: "passed",
    plainSummary: "没有发现不适合直接使用的表述。",
    plainSummaryEn: "No wording was found that should be held back from parent-facing use."
  },
  evidenceTrace: {
    sessionIds: ["session-1", "session-2", "session-3", "session-4", "session-5", "session-6", "session-7", "session-8"],
    rubricIds: ["join", "choice", "focus", "respond", "create", "recover", "access", "setting", "goal"],
    insightIds: ["insight-engagement", "insight-recovery", "insight-setting"],
    referenceIds: ["kim-2008", "geretsegger-2022", "gas-1968", "dream-2020", "baxter-2007"]
  },
  teacherNote: "下次建议用低亮度、慢节奏和熟悉旋律开场。",
  teacherNoteEn: "Next time, start with softer visuals, a slower tempo, and a familiar melody."
};

export const reportDrafts: ReportDraft[] = [
  reportDraft,
  {
    ...reportDraft,
    id: "report-lele-8",
    childId: "lele",
    generation: {
      ...reportDraft.generation,
      id: "generation-lele-8"
    },
    professionalDraft: {
      ...reportDraft.professionalDraft,
      overview: reportDraft.professionalDraft.overview.replace("小宇", "乐乐"),
      participationObservation: reportDraft.professionalDraft.participationObservation.replace("小宇", "乐乐")
    },
    professionalDraftEn: {
      ...reportDraft.professionalDraftEn,
      overview: reportDraft.professionalDraftEn.overview.replace("Xiaoyu", "Lele"),
      participationObservation: reportDraft.professionalDraftEn.participationObservation.replace("Xiaoyu", "Lele")
    },
    parentSummary: {
      ...reportDraft.parentSummary,
      overview: reportDraft.parentSummary.overview.replace("小宇", "乐乐")
    },
    parentSummaryEn: {
      ...reportDraft.parentSummaryEn,
      overview: reportDraft.parentSummaryEn.overview.replace("Xiaoyu", "Lele"),
      positiveMoments: "With steady tactile prompts and a calmer visual pace, he stayed involved longer and often responded when the bear invited another turn.",
      nextObservationFocus: "For the next cycle, keep observing how gentle tactile cues and softer visuals help him stay comfortable in the activity."
    },
    evidenceTrace: {
      ...reportDraft.evidenceTrace,
      sessionIds: reportDraft.evidenceTrace.sessionIds.map((id) => id.replace("session", "lele-session"))
    },
    teacherNote: "下次建议先用触觉提示，并把画面提示调柔和。",
    teacherNoteEn: "Next time, begin with a tactile cue and keep the visual prompts softer."
  },
  {
    ...reportDraft,
    id: "report-anan-8",
    childId: "anan",
    generation: {
      ...reportDraft.generation,
      id: "generation-anan-8"
    },
    professionalDraft: {
      ...reportDraft.professionalDraft,
      overview: reportDraft.professionalDraft.overview.replace("小宇", "安安").replace("熟悉旋律", "视觉波形"),
      participationObservation: reportDraft.professionalDraft.participationObservation.replace("小宇", "安安")
    },
    professionalDraftEn: {
      ...reportDraft.professionalDraftEn,
      overview: reportDraft.professionalDraftEn.overview.replace("Xiaoyu", "Anan").replace("familiar melodies", "visual waveforms"),
      affectObservation: "Visual waveforms, captions, softer brightness, and slower pacing were the conditions in which Anan most often stayed calm or engaged. In Session 6, he still showed clear signs that the activity felt demanding.",
      participationObservation: reportDraft.professionalDraftEn.participationObservation.replace("Xiaoyu", "Anan")
    },
    parentSummary: {
      ...reportDraft.parentSummary,
      overview: reportDraft.parentSummary.overview.replace("小宇", "安安")
    },
    parentSummaryEn: {
      ...reportDraft.parentSummaryEn,
      overview: reportDraft.parentSummaryEn.overview.replace("Xiaoyu", "Anan"),
      positiveMoments: "With visual waveforms, captions, and a slower pace, he joined more steadily and often returned when the activity stayed predictable.",
      nextObservationFocus: "In the next cycle, keep the captions, waveforms, and softer visuals while continuing to observe which pacing helps him stay comfortable."
    },
    safetyCheck: {
      ...reportDraft.safetyCheck,
      containsMedicalClaim: true,
      flaggedPhrases: ["恢复正常"],
      displayStatus: "blocked",
      plainSummary: "这版草稿暂时不能导出，请先修改标出的表述。",
      plainSummaryEn: "This draft cannot be exported until the highlighted wording is edited."
    },
    evidenceTrace: {
      ...reportDraft.evidenceTrace,
      sessionIds: reportDraft.evidenceTrace.sessionIds.map((id) => id.replace("session", "anan-session"))
    },
    teacherNote: "下次建议继续用字幕、波形和低亮度画面。",
    teacherNoteEn: "Next time, keep the captions, waveform support, and softer visuals in place."
  }
];

export const auditLogs: AuditLog[] = [
  {
    id: "audit-1",
    childId: "xiaoyu",
    actor: "陈老师",
    actorEn: "Teacher Chen",
    action: "report.teacher_reviewing",
    targetType: "report",
    targetId: "report-xiaoyu-8",
    createdAt: "2026-06-27T10:15:00+08:00",
    summary: "报告草稿等老师确认。",
    summaryEn: "The draft report is waiting for teacher review."
  }
];
