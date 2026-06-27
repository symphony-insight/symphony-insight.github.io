import type { AffectLabel, Language } from "../types/domain";

export const affectLabels: Record<Language, Record<AffectLabel, string>> = {
  zh: {
    calm: "平静",
    engaged: "很投入",
    curious: "好奇",
    frustrated: "有点受挫",
    overloaded: "有点吃力",
    help_needed: "需要帮忙",
    unknown: "还看不准"
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
