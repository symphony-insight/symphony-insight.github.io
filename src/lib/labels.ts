import type { AffectLabel, Language } from "../types/domain";

export const affectLabels: Record<Language, Record<AffectLabel, string>> = {
  zh: {
    calm: "平静",
    engaged: "投入",
    curious: "好奇",
    frustrated: "有点受挫",
    overloaded: "负担偏高",
    help_needed: "需要帮助",
    unknown: "还不确定"
  },
  en: {
    calm: "Calm",
    engaged: "Engaged",
    curious: "Curious",
    frustrated: "Frustrated",
    overloaded: "High load",
    help_needed: "Needs help",
    unknown: "Unclear"
  }
};

export function formatAffectLabel(language: Language, label: AffectLabel) {
  return affectLabels[language][label];
}
