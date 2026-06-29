import type { AssessmentDomainId } from "./assessmentDomains";

export type Reference = {
  id: string;
  authors: string;
  year: string;
  title: string;
  source: string; // 期刊/出版物 + 卷期页
  sourceEn?: string;
  url: string; // DOI 或稳定链接
  // 这条文献定量/系统地界定了什么
  contributionZh: string;
  contributionEn: string;
  // 它支撑哪些观察维度
  supportsDomains: AssessmentDomainId[];
  // 使用时必须如实标注的边界（可选）
  caveatZh?: string;
  caveatEn?: string;
};

// 全部经核实，引用信息精确到 DOI / 卷期页。
export const references: Reference[] = [
  {
    id: "kim2008",
    authors: "Kim, J., Wigram, T., & Gold, C.",
    year: "2008",
    title: "The Effects of Improvisational Music Therapy on Joint Attention Behaviors in Autistic Children: A Randomized Controlled Study",
    source: "Journal of Autism and Developmental Disorders, 38(9), 1758–1766",
    url: "https://doi.org/10.1007/s10803-008-0566-6",
    contributionZh:
      "随机对照研究，用 ESCS 量表与会话视频按秒编码，量化了目光接触时长、轮流互动、共同注意的发起与回应频次。",
    contributionEn:
      "A randomized controlled study using ESCS measures and second-by-second session video coding to quantify eye contact duration, turn-taking, and joint-attention initiation and response.",
    supportsDomains: ["social", "communication"]
  },
  {
    id: "geretsegger2022",
    authors: "Geretsegger, M., Fusar-Poli, L., Elefant, C., Mössler, K. A., Vitale, G., & Gold, C.",
    year: "2022",
    title: "Music therapy for autistic people",
    source: "Cochrane Database of Systematic Reviews, Issue 5, CD004381",
    url: "https://doi.org/10.1002/14651858.CD004381.pub4",
    contributionZh:
      "系统综述，纳入 26 项研究、1165 名参与者。整体改善与生活质量为中等确定性证据；社交互动与沟通为低至极低确定性证据。",
    contributionEn:
      "A systematic review of 26 studies and 1,165 participants. Overall improvement and quality of life had moderate-certainty evidence; social interaction and communication evidence was low to very low certainty.",
    supportsDomains: ["social", "communication", "adaptive"],
    caveatZh: "据此综述，社交与沟通方面证据确定性有限，因此本工具只呈现观察材料，不做疗效或诊断结论。",
    caveatEn:
      "Because certainty for social and communication outcomes is limited, this tool presents observation materials only and does not make outcome or diagnostic claims."
  },
  {
    id: "gas1968",
    authors: "Kiresuk, T. J., & Sherman, R. E.",
    year: "1968",
    title: "Goal Attainment Scaling: A general method for evaluating comprehensive community mental health programs",
    source: "Community Mental Health Journal, 4(6), 443–453",
    url: "https://doi.org/10.1007/BF01530764",
    contributionZh:
      "目标达成量表（GAS）：在干预前为每个个体化目标设定 −2 到 +2 的五级可测量等级，按达成度评分，只和孩子自己的目标比。",
    contributionEn:
      "Goal Attainment Scaling defines five measurable levels for each individualized goal and scores progress against that child's own goal rather than against other children.",
    supportsDomains: ["attention"]
  },
  {
    id: "vineland3",
    authors: "Sparrow, S. S., Cicchetti, D. V., & Saulnier, C. A.",
    year: "2016",
    title: "Vineland Adaptive Behavior Scales, Third Edition (Vineland-3)",
    source: "NCS Pearson, Bloomington, MN",
    url: "https://www.pearsonassessments.com/store/usassessments/en/Store/Professional-Assessments/Behavior/Adaptive/Vineland-Adaptive-Behavior-Scales-%7C-Third-Edition/p/100001622.html",
    contributionZh:
      "适应行为评估的权威工具，测量沟通、日常生活技能、社会化三大核心域（及可选的动作技能），强调实际生活中的适应能力。",
    contributionEn:
      "An established adaptive-behavior assessment that measures communication, daily living skills, and socialization, with optional motor skills, emphasizing real-life adaptive functioning.",
    supportsDomains: ["adaptive"]
  },
  {
    id: "dream2020",
    authors: "Billing, E., Belpaeme, T., Cai, H., et al.",
    year: "2020",
    title: "The DREAM Dataset: Supporting a data-driven study of autism spectrum disorder and robot enhanced therapy",
    source: "PLOS ONE, 15(8), e0236939",
    url: "https://doi.org/10.1371/journal.pone.0236939",
    contributionZh:
      "61 名自闭症儿童机器人辅助治疗的行为数据集，标注了身体动作、头部姿态与注视等可量化的 3D 行为变量。",
    contributionEn:
      "A robot-assisted therapy behavior dataset for 61 autistic children, annotating quantifiable 3D behavioral variables such as body movement, head pose, and gaze.",
    supportsDomains: ["social", "adaptive", "sensory"],
    caveatZh: "这是行为数据集，不是评分量表；我们只借鉴它「该记录哪些行为」的思路，不照搬其数值。",
    caveatEn:
      "This is a behavior dataset, not a scoring scale. We use it only as a reference for what can be recorded, not for its numeric values."
  },
  {
    id: "daisee2016",
    authors: "Gupta, A., D'Cunha, A., Awasthi, K., & Balasubramanian, V.",
    year: "2016",
    title: "DAiSEE: Towards User Engagement Recognition in the Wild",
    source: "arXiv:1609.01885（项目主页：IIT Hyderabad）",
    sourceEn: "arXiv:1609.01885 (IIT Hyderabad project page)",
    url: "https://people.iith.ac.in/vineethnb/resources/daisee/index.html",
    contributionZh:
      "包含 9068 段视频、112 名用户的多标签视频数据集，标注了参与（engagement）、无聊、困惑、挫败四种状态，为「如何用可观察信号刻画参与度」提供参照。",
    contributionEn:
      "A multi-label video dataset with 9,068 clips from 112 users, annotating engagement, boredom, confusion, and frustration as a reference for describing engagement through observable signals.",
    supportsDomains: ["attention"],
    caveatZh:
      "重要：DAiSEE 采集自成人在线学习场景，不能直接迁移到儿童音乐治疗评分。我们只把它作为「参与度可以分级观察」的背景参照，不照搬其类别或数值。",
    caveatEn:
      "DAiSEE was collected from adult online-learning settings and cannot be transferred directly to child music-therapy scoring. We use it only as background for graded engagement observation."
  },
  {
    id: "imtap2007",
    authors: "Baxter, H. T., Berghofer, J. A., MacEwan, L., et al.",
    year: "2007",
    title: "The Individualized Music Therapy Assessment Profile (IMTAP)",
    source: "Jessica Kingsley Publishers, London",
    url: "https://uk.jkp.com/products/the-individualized-music-therapy-assessment-profile-imtap",
    contributionZh:
      "音乐治疗常用的个体化评估框架，把观察组织成音乐性、社会、情绪、沟通、认知、动作等多个领域，并含量化模块。",
    contributionEn:
      "An individualized music-therapy assessment framework that organizes observation across musicality, social, emotional, communication, cognitive, and movement domains, including quantitative modules.",
    supportsDomains: ["social", "communication", "attention", "adaptive", "sensory"]
  }
];

export function getReferencesForDomain(domainId: AssessmentDomainId): Reference[] {
  return references.filter((reference) => reference.supportsDomains.includes(domainId));
}
