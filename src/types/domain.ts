export type ChildProfileType = "ASD" | "CP" | "ID_MD" | "HEARING" | "VISION" | "UNKNOWN";

export type BaselineStatus = "not_ready" | "building" | "ready";
export type ConsentStatus = "active" | "limited" | "revoked";
export type ReviewStatus = "normal" | "needs_review" | "urgent_review";

export type Child = {
  id: string;
  displayName: string;
  displayNameEn: string;
  profileType: ChildProfileType;
  ageLabel: string;
  sessionCount: number;
  lastSessionAt: string;
  baselineStatus: BaselineStatus;
  consentStatus: ConsentStatus;
  reviewStatus: ReviewStatus;
  teacher: string;
  guardianSummary: string;
};

export type Language = "zh" | "en";

export type EvaluationDimension = {
  id: "join" | "choice" | "focus" | "respond" | "create" | "recover" | "access" | "setting" | "goal";
  title: string;
  titleEn: string;
  score: number;
  summary: string;
  summaryEn: string;
  criteria: string[];
  criteriaEn: string[];
  scale: string[];
  scaleEn: string[];
};

export type AffectLabel =
  | "calm"
  | "engaged"
  | "curious"
  | "frustrated"
  | "overloaded"
  | "help_needed"
  | "unknown";

export type SessionPhase = "warmup" | "explore" | "capture_seed" | "compose" | "reveal";

export type SessionSummary = {
  id: string;
  childId: string;
  index: number;
  startedAt: string;
  durationSec: number;
  completedPhase: SessionPhase;
  story: string;
  stimulus: "familiar_melody" | "low_brightness" | "high_brightness" | "slow_tempo" | "free_play";
  motion: {
    activeTimeRatio: number;
    averageAmplitude: number;
    movementSmoothness: number;
    responseLatencyMs: number;
    fatigueSlope: number;
  };
  affect: {
    dominantState: AffectLabel;
    confidence: number;
    overloadCount: number;
    recoveryMedianSec: number;
    teacherInterventionCount: number;
  };
  participation: {
    seedCount: number;
    voluntaryActionCount: number;
    refusalCount: number;
    teachBearCount: number;
  };
  notes: string[];
};

export type ClaimLevel = "observation" | "trend" | "requires_professional_review";

export type LongitudinalInsight = {
  id: string;
  childId: string;
  window: "last_4_sessions" | "last_8_sessions" | "last_30_days";
  type:
    | "motion_stability"
    | "engagement"
    | "fatigue"
    | "affect_recovery"
    | "stimulus_preference"
    | "needs_human_review";
  title: string;
  statement: string;
  evidenceSessionIds: string[];
  confidence: "low" | "medium" | "high";
  claimLevel: ClaimLevel;
};

export type ReportStatus = "draft" | "teacher_reviewing" | "approved" | "rejected" | "exported";

export type ReportDraft = {
  id: string;
  childId: string;
  status: ReportStatus;
  period: {
    start: string;
    end: string;
    sessionCount: number;
  };
  professionalDraft: {
    overview: string;
    motionObservation: string;
    affectObservation: string;
    participationObservation: string;
    reviewPoints: string[];
    limitationNote: string;
  };
  parentSummary: {
    overview: string;
    positiveMoments: string;
    nextObservationFocus: string;
  };
  safetyCheck: {
    containsMedicalClaim: boolean;
    flaggedPhrases: string[];
  };
  teacherNote: string;
};

export type AuditLog = {
  id: string;
  childId: string;
  actor: string;
  action: string;
  targetType: "report" | "session" | "safety";
  targetId: string;
  createdAt: string;
  summary: string;
};
