import type { EvaluationDimension } from "../types/domain";

// 每一项 1-5 分分别对应什么「可观察表现」。
// 这些是本工具为这个孩子约定的观察口径（参考 GAS 个体化分级思路与文献的行为维度），
// 不是临床常模，也不和别的孩子比。
export type ScaleAnchor = {
  // 这一项当前分数（来自 EvaluationDimension.score，整数锚点）
  // 1-5 各档的可观察表现描述
  levels: Record<1 | 2 | 3 | 4 | 5, string>;
  levelsEn: Record<1 | 2 | 3 | 4 | 5, string>;
  // 本例（小宇本轮）落在哪一档、为什么——指向真实活动里的具体变化
  currentRationaleZh: string;
  currentRationaleEn: string;
};

export const rubricScaleAnchors: Record<EvaluationDimension["id"], ScaleAnchor> = {
  join: {
    levels: {
      1: "几乎不主动开始，多次拒绝或退出。",
      2: "需要较多陪伴才肯进入，主动动作很少。",
      3: "提醒后能参加，主动开始的次数中等。",
      4: "多数时候主动参加，偶尔需要轻提示，退出很少。",
      5: "稳定主动参加并停留，换个活动也能继续。"
    },
    levelsEn: {
      1: "Rarely starts on their own, with repeated refusal or withdrawal.",
      2: "Needs substantial support to enter; self-started actions are limited.",
      3: "Can join after prompting, with a moderate number of self-started actions.",
      4: "Usually joins on their own, with only light prompts and few withdrawals.",
      5: "Joins and stays reliably, and can carry the pattern into another activity."
    },
    currentRationaleZh:
      "本轮落在 4 档：主动参加从第 1 次的 4 次增加到第 8 次的 30 次，后几次几乎不再退出。",
    currentRationaleEn:
      "This cycle sits at level 4: self-started participation increased from 4 times in Session 1 to 30 times in Session 8, with very few withdrawals in later sessions."
  },
  choice: {
    levels: {
      1: "几乎不表达想要或不要。",
      2: "需要明显引导才偶尔做出选择。",
      3: "提醒下能在两个选项里选一个。",
      4: "多数时候能主动表达继续、暂停或重来。",
      5: "稳定主动表达选择，并能坚持一小会儿。"
    },
    levelsEn: {
      1: "Rarely expresses wanting or not wanting something.",
      2: "Occasionally makes a choice with strong prompting.",
      3: "Can choose between two options with a reminder.",
      4: "Often expresses continue, pause, or try again on their own.",
      5: "Expresses choices reliably and stays with them for a short while."
    },
    currentRationaleZh:
      "本轮落在 4 档：在「教小熊」环节多次主动发起，主动动作整体上升。",
    currentRationaleEn:
      "This cycle sits at level 4: the child initiated several turns during the teach-the-bear routine, and self-started actions increased overall."
  },
  focus: {
    levels: {
      1: "几乎无法停留，频繁中断。",
      2: "只能短暂停留，常常分心或退出。",
      3: "能停留一小段，分心后需提醒带回。",
      4: "多数时候能投入，参与时间占比较高。",
      5: "能持续投入，遇到变化也愿意继续。"
    },
    levelsEn: {
      1: "Has difficulty staying with the activity and often stops.",
      2: "Stays only briefly and is often distracted or withdrawn.",
      3: "Can stay for a short stretch and return with reminders.",
      4: "Usually stays engaged, with a higher active-time ratio.",
      5: "Stays engaged consistently and continues through small changes."
    },
    currentRationaleZh:
      "本轮落在 3 档：参与时间占比有提升，但第 6 次高亮动画后出现退出，仍需老师支持。",
    currentRationaleEn:
      "This cycle sits at level 3: active-time ratio improved, but Session 6 still showed withdrawal after bright animation and teacher support was needed."
  },
  respond: {
    levels: {
      1: "几乎不回应别人。",
      2: "被反复邀请才偶尔回应。",
      3: "别人邀请时能回应，能完成少量轮流。",
      4: "多数时候能回应并完成一次轮流互动。",
      5: "会主动发起互动，轮流较稳定。"
    },
    levelsEn: {
      1: "Rarely responds to others.",
      2: "Responds occasionally after repeated invitations.",
      3: "Responds when invited and completes a small number of turns.",
      4: "Usually responds and completes one turn-taking exchange.",
      5: "Starts interaction independently and takes turns steadily."
    },
    currentRationaleZh:
      "本轮落在 3 档：和小熊的互动次数增加，但仍较依赖老师提示，主动发起还不稳。",
    currentRationaleEn:
      "This cycle sits at level 3: interaction with the bear increased, but the child still relied on teacher prompts and independent initiation was not yet steady."
  },
  create: {
    levels: {
      1: "几乎没有自己的表达，只跟着做。",
      2: "偶尔出现一点自己的声音或动作。",
      3: "有一些原创片段，但不易被重复。",
      4: "多次出现可被接住、重复的原创表达。",
      5: "稳定产生原创表达，并会主动改作品的一小部分。"
    },
    levelsEn: {
      1: "Shows little personal expression and mainly follows along.",
      2: "Occasionally offers a small personal sound or movement.",
      3: "Offers some original material, but it is hard to repeat or build on.",
      4: "Often offers original expression that can be noticed and repeated.",
      5: "Produces personal expression steadily and changes a small part of the work."
    },
    currentRationaleZh:
      "本轮落在 4 档：创作片段从第 1 次的 1 个增加到第 8 次的 5 个。",
    currentRationaleEn:
      "This cycle sits at level 4: creative clips increased from 1 in Session 1 to 5 in Session 8."
  },
  recover: {
    levels: {
      1: "不舒服后很难回到活动。",
      2: "需要较长时间和较多支持才回来。",
      3: "在降低负担、给予提示后能回到活动。",
      4: "回到活动用时较短，提示需求减少。",
      5: "能较快自我调整回到舒服的节奏。"
    },
    levelsEn: {
      1: "Has difficulty returning after discomfort.",
      2: "Needs a long time and substantial support to return.",
      3: "Can return when the load is lowered and support is given.",
      4: "Returns more quickly and needs fewer prompts.",
      5: "Adjusts quickly back into a comfortable activity rhythm."
    },
    currentRationaleZh:
      "本轮落在 3 档：回到活动用时从第 1 次的约 180 秒缩短到第 8 次的约 76 秒，但仍需老师提示，待确认。",
    currentRationaleEn:
      "This cycle sits at level 3: return time shortened from about 180 seconds in Session 1 to about 76 seconds in Session 8, but teacher prompts are still needed."
  },
  access: {
    levels: {
      1: "操作方式很难稳定触发。",
      2: "经常误触或着急，需较多帮助。",
      3: "能触发，但回应偏慢或偶有帮助。",
      4: "多数时候省力清楚，回应较快。",
      5: "操作稳定省力，几乎不需帮助。"
    },
    levelsEn: {
      1: "The input method is hard to trigger reliably.",
      2: "Mistaps or frustration are frequent, and substantial help is needed.",
      3: "The child can trigger the input, but responses are slow or help is sometimes needed.",
      4: "The input is usually clear and low-effort, with quicker responses.",
      5: "The input is stable and low-effort, with almost no help needed."
    },
    currentRationaleZh:
      "本轮落在 3 档：回应用时较前期缩短，但仍偶尔需要老师帮忙，操作方式可继续优化。",
    currentRationaleEn:
      "This cycle sits at level 3: response latency improved, but occasional teacher help is still needed and the input method can be refined."
  },
  setting: {
    levels: {
      1: "现有设置经常让孩子明显吃力。",
      2: "多种设置都偏吃力，需要频繁调整。",
      3: "部分设置合适，部分容易让孩子退出。",
      4: "多数设置合适，吃力次数较少。",
      5: "设置稳定贴合孩子，几乎不引起吃力。"
    },
    levelsEn: {
      1: "Current settings often feel clearly demanding for the child.",
      2: "Several settings feel demanding and require frequent adjustment.",
      3: "Some settings fit, while others may lead to withdrawal.",
      4: "Most settings fit, with fewer overload moments.",
      5: "Settings are consistently well matched and rarely raise the activity load."
    },
    currentRationaleZh:
      "本轮落在 4 档：低亮度、慢节奏、熟悉旋律下吃力次数少；但高亮动画仍需复核，待确认。",
    currentRationaleEn:
      "This cycle sits at level 4: low brightness, slower pacing, and familiar melodies showed fewer overload moments, while bright animation still needs review."
  },
  goal: {
    levels: {
      1: "本周小目标几乎没有进展。",
      2: "有一点点接近，但还差较远。",
      3: "向小目标前进了一小步。",
      4: "明显接近本周小目标。",
      5: "达到或超过本周小目标。"
    },
    levelsEn: {
      1: "This week's small goal shows little progress.",
      2: "There is a slight move toward the goal, but it remains far away.",
      3: "The child moved one small step toward the goal.",
      4: "The child moved clearly closer to this week's goal.",
      5: "The child reached or exceeded this week's goal."
    },
    currentRationaleZh:
      "本轮落在 3 档：和自己第 1 次比，主动参加与创作片段都在增加，向小目标前进了一步。",
    currentRationaleEn:
      "This cycle sits at level 3: compared with Session 1, self-started participation and creative clips increased, marking one step toward the small goal."
  }
};
