import type { EvaluationDimension, Language } from "../types/domain";

export type AssessmentDomainId = "social" | "communication" | "attention" | "adaptive" | "sensory" | "behavior";

export type AssessmentDomain = {
  id: AssessmentDomainId;
  nameZh: string;
  nameEn: string;
  plainZh: string;
  rubricIds: EvaluationDimension["id"][];
  noteZh: string;
  noteEn: string;
  covered: boolean;
};

export const assessmentDomains: AssessmentDomain[] = [
  {
    id: "social",
    nameZh: "社会交往",
    nameEn: "Social Communication",
    plainZh: "愿不愿意和人来往",
    rubricIds: ["respond", "choice"],
    noteZh: "看孩子会不会回应别人、能不能轮流和发起互动，比如看一眼、接一句、教小熊。",
    noteEn: "Whether the child responds, takes turns, and starts interactions.",
    covered: true
  },
  {
    id: "communication",
    nameZh: "表达沟通",
    nameEn: "Communication",
    plainZh: "能不能表达自己",
    rubricIds: ["create"],
    noteZh: "在音乐活动里，更多看孩子用声音、动作、节奏来表达自己，而不只看说话。",
    noteEn: "In music activities we look at expression through sound, motion, and rhythm, not only speech.",
    covered: true
  },
  {
    id: "attention",
    nameZh: "专注与学习",
    nameEn: "Attention & Learning",
    plainZh: "能不能投入、有没有进步",
    rubricIds: ["focus", "goal"],
    noteZh: "看孩子能不能把注意力放在活动上，以及和自己的小目标比有没有往前走。这里不做智力测试。",
    noteEn: "Whether the child stays with the activity and moves toward their own small goal. No IQ testing.",
    covered: true
  },
  {
    id: "adaptive",
    nameZh: "适应与参与",
    nameEn: "Adaptive Participation",
    plainZh: "能不能适应活动",
    rubricIds: ["join", "recover", "access"],
    noteZh: "看孩子愿不愿意参加、不舒服后能不能回来、操作方式顺不顺手——也就是能不能适应活动。",
    noteEn: "Whether the child joins, returns after discomfort, and finds the input easy to use.",
    covered: true
  },
  {
    id: "sensory",
    nameZh: "感觉与环境",
    nameEn: "Sensory & Environment",
    plainZh: "环境舒不舒服",
    rubricIds: ["setting"],
    noteZh: "看音乐、亮度、动画、节奏这些设置，对孩子来说是帮助参与，还是有点吃力。",
    noteEn: "Whether music, brightness, animation, and tempo help the child or raise the load.",
    covered: true
  },
  {
    id: "behavior",
    nameZh: "行为模式",
    nameEn: "Behavior Patterns",
    plainZh: "固定习惯和对变化的反应",
    rubricIds: [],
    noteZh: "完整评估里还有“喜欢的固定环节、对变化的反应”这一类。它属于需要专业人员评估的方向，本工具不单独观察，只在活动记录里如实保留现象。",
    noteEn: "A full assessment also covers fixed routines and reactions to change. That belongs to professional evaluation; this tool does not score it separately.",
    covered: false
  }
];

const rubricToDomain = new Map<EvaluationDimension["id"], AssessmentDomain>();
for (const domain of assessmentDomains) {
  for (const rubricId of domain.rubricIds) {
    rubricToDomain.set(rubricId, domain);
  }
}

export function getDomainForRubric(id: EvaluationDimension["id"]): AssessmentDomain | undefined {
  return rubricToDomain.get(id);
}

export function getDomainName(domain: AssessmentDomain, language: Language) {
  return language === "zh" ? domain.nameZh : domain.nameEn;
}

export function getDomainNote(domain: AssessmentDomain, language: Language) {
  return language === "zh" ? domain.noteZh : domain.noteEn;
}
