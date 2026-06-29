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
      1: "Rarely starts; often refuses or withdraws.",
      2: "Enters with substantial support.",
      3: "Joins after prompting.",
      4: "Usually joins with only light prompts.",
      5: "Joins and stays independently."
    },
    currentRationaleZh:
      "本轮落在 4 档：主动参加从第 1 次的 4 次增加到第 8 次的 30 次，后几次几乎不再退出。",
    currentRationaleEn: "Level 4. Self-started participation rose from 4 times in Session 1 to 30 times in Session 8."
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
      1: "Rarely shows yes, no, continue, or stop.",
      2: "Chooses with strong prompting.",
      3: "Chooses between two options with a reminder.",
      4: "Often shows continue, pause, or try again.",
      5: "Chooses reliably and stays with the choice."
    },
    currentRationaleZh:
      "本轮落在 4 档：在「教小熊」环节多次主动发起，主动动作整体上升。",
    currentRationaleEn: "Level 4. The child initiated several teach-the-bear turns, and self-started actions increased overall."
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
      1: "Stops often and has difficulty staying.",
      2: "Stays briefly, with frequent distraction or withdrawal.",
      3: "Stays for a short stretch and returns with reminders.",
      4: "Usually stays engaged.",
      5: "Stays engaged through small changes."
    },
    currentRationaleZh:
      "本轮落在 3 档：参与时间占比有提升，但第 6 次高亮动画后出现退出，仍需老师支持。",
    currentRationaleEn: "Level 3. Active time improved, but Session 6 still showed withdrawal after bright animation."
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
      2: "Responds after repeated invitations.",
      3: "Responds when invited and completes a few turns.",
      4: "Usually responds and takes a turn.",
      5: "Starts interaction and takes turns steadily."
    },
    currentRationaleZh:
      "本轮落在 3 档：和小熊的互动次数增加，但仍较依赖老师提示，主动发起还不稳。",
    currentRationaleEn: "Level 3. Bear interactions increased, but the child still relied on teacher prompts."
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
      1: "Mainly follows along.",
      2: "Occasionally offers a personal sound or movement.",
      3: "Offers some original material.",
      4: "Often offers expression that can be repeated.",
      5: "Creates steadily and changes part of the work."
    },
    currentRationaleZh:
      "本轮落在 4 档：创作片段从第 1 次的 1 个增加到第 8 次的 5 个。",
    currentRationaleEn: "Level 4. Creative clips increased from 1 in Session 1 to 5 in Session 8."
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
      2: "Returns only with substantial time and support.",
      3: "Returns when the load is lowered.",
      4: "Returns faster with fewer prompts.",
      5: "Returns quickly to a comfortable rhythm."
    },
    currentRationaleZh:
      "本轮落在 3 档：回到活动用时从第 1 次的约 180 秒缩短到第 8 次的约 76 秒，但仍需老师提示，待确认。",
    currentRationaleEn: "Level 3. Return time shortened from about 180 seconds to about 76 seconds, with prompts still needed."
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
      1: "Input is hard to trigger reliably.",
      2: "Mistaps or frustration are frequent.",
      3: "Input works, but responses are slow or support is needed.",
      4: "Input is usually clear and low-effort.",
      5: "Input is stable, easy, and nearly independent."
    },
    currentRationaleZh:
      "本轮落在 3 档：回应用时较前期缩短，但仍偶尔需要老师帮忙，操作方式可继续优化。",
    currentRationaleEn: "Level 3. Response latency improved, but occasional teacher help is still needed."
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
      1: "Settings often feel too demanding.",
      2: "Several settings need frequent adjustment.",
      3: "Some settings fit; others may lead to withdrawal.",
      4: "Most settings fit with fewer overload moments.",
      5: "Settings are consistently well matched."
    },
    currentRationaleZh:
      "本轮落在 4 档：低亮度、慢节奏、熟悉旋律下吃力次数少；但高亮动画仍需复核，待确认。",
    currentRationaleEn: "Level 4. Low brightness, slower pacing, and familiar melodies showed fewer overload moments."
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
      1: "Little progress toward this week's goal.",
      2: "A small move, but still far from the goal.",
      3: "One clear step toward the goal.",
      4: "Clearly closer to the goal.",
      5: "Reached or exceeded the goal."
    },
    currentRationaleZh:
      "本轮落在 3 档：和自己第 1 次比，主动参加与创作片段都在增加，向小目标前进了一步。",
    currentRationaleEn: "Level 3. Self-started participation and creative clips increased from Session 1."
  }
};
