import type { EvaluationDimension, Language } from "../types/domain";

export type DisplayRubric = {
  id: EvaluationDimension["id"];
  title: string;
  score: number;
  scoreLabel: string;
  statusLabel: string;
  plainExplanation: string;
  primaryObservable: string;
  tone: "low" | "medium" | "stable" | "strong";
  sourceLabel: string;
  guide: string[];
};

function formatScore(score: number) {
  return Number.isInteger(score) ? `${score}/5` : `${score.toFixed(1)}/5`;
}

function getStatusLabel(score: number, language: Language) {
  if (language === "en") {
    if (score < 2) return "Difficult for now";
    if (score < 3) return "Needs strong support";
    if (score < 4) return "Needs light support";
    if (score < 5) return "Fairly steady";
    return "Very steady";
  }

  if (score < 2) return "暂时困难";
  if (score < 3) return "需要较多支持";
  if (score < 4) return "需要一点支持";
  if (score < 5) return "比较稳定";
  return "很稳定";
}

function getTone(score: number): DisplayRubric["tone"] {
  if (score < 2.5) return "low";
  if (score < 3.5) return "medium";
  if (score < 4.5) return "stable";
  return "strong";
}

export function getDisplayRubrics(dimensions: EvaluationDimension[], language: Language): DisplayRubric[] {
  return dimensions.map((dimension) => {
    const title = language === "zh" ? dimension.title : dimension.titleEn;
    const criteria = language === "zh" ? dimension.criteria : dimension.criteriaEn;

    return {
      id: dimension.id,
      title,
      score: dimension.score,
      scoreLabel: formatScore(dimension.score),
      statusLabel: getStatusLabel(dimension.score, language),
      plainExplanation: language === "zh" ? dimension.summary : dimension.summaryEn,
      primaryObservable: criteria[0] ?? title,
      tone: getTone(dimension.score),
      sourceLabel: language === "zh" ? "观察依据" : "Evidence",
      guide: language === "zh" ? dimension.scale : dimension.scaleEn
    };
  });
}

export function filterDisplayRubrics(rubrics: DisplayRubric[], query: string): DisplayRubric[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return rubrics;

  return rubrics.filter((rubric) =>
    [rubric.title, rubric.statusLabel, rubric.plainExplanation, rubric.primaryObservable, rubric.sourceLabel, ...rubric.guide]
      .join(" ")
      .toLocaleLowerCase()
      .includes(normalizedQuery)
  );
}
