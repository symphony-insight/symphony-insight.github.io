from __future__ import annotations

from copy import deepcopy
from typing import Any


def build_seed_reports() -> list[dict[str, Any]]:
    base_report = {
        "id": "report-xiaoyu-8",
        "childId": "xiaoyu",
        "status": "teacher_reviewing",
        "period": {"start": "2026-06-03", "end": "2026-06-27", "sessionCount": 8},
        "generation": {
            "id": "generation-xiaoyu-8",
            "status": "needs_teacher_review",
            "sourceSessionCount": 8,
            "sourceRubricCount": 9,
            "sourceDomainCount": 6,
            "generatedAt": "2026-06-27T10:10:00+08:00",
            "promptVersion": "report-draft-v1-2026-06",
            "modelLabel": "报告整理助手",
            "modelLabelEn": "Report assistant",
        },
        "professionalDraft": {
            "overview": "本轮一共记录了 8 次音乐共创活动。小宇一开始动作回应较少，后来在熟悉旋律、慢节奏和低亮度画面下，能完成一次完整活动。",
            "motionObservation": "多数活动里，主动动作和创作片段都在增加。第 6 次活动里，高亮动画后出现短暂退出，需要单独看一下画面设置。",
            "affectObservation": "熟悉旋律、低亮度和慢节奏下，小宇更容易保持平静或投入。第 6 次活动里，他明显有点吃力。",
            "participationObservation": "在“教小熊唱歌”时，小宇更愿意重复参与。第 8 次活动完成作品揭晓，等老师确认。",
            "reviewPoints": ["高亮画面是否默认关闭", "慢节奏音乐能不能继续作为开场", "暂停和重新开始的选择要保留"],
            "limitationNote": "这份报告只整理活动里的动作、状态和参与记录，需要老师或相关专业人员结合现场情况一起看。",
        },
        "professionalDraftEn": {
            "overview": "This cycle includes eight music co-creation sessions. Xiaoyu began with very limited movement responses and later completed a full activity when the setup used familiar melodies, a slower tempo, and softer visuals.",
            "motionObservation": "Across most sessions, Xiaoyu offered more self-initiated movement and more usable creative material.",
            "affectObservation": "Familiar melodies, softer brightness, and slower pacing were the conditions in which Xiaoyu most often stayed calm or engaged.",
            "participationObservation": "Xiaoyu was more willing to repeat his participation during the 'teach the bear to sing' prompt.",
            "reviewPoints": [
                "Check whether bright visuals should stay off by default",
                "Keep the slower music opening if it continues to support entry",
                "Preserve the child's options to pause and restart",
            ],
            "limitationNote": "This report only organizes observed movement, state, and participation records from the activity.",
        },
        "parentSummary": {
            "overview": "本轮小宇参加了 8 次音乐共创活动，慢慢从尝试回应走到完整作品揭晓。",
            "positiveMoments": "熟悉旋律和慢一点的音乐下，他更愿意参与，也多次帮小熊“再学一遍”。",
            "nextObservationFocus": "下次可以继续用低亮度画面，看看哪种音乐节奏让他更舒服。",
        },
        "parentSummaryEn": {
            "overview": "Across eight music co-creation sessions, Xiaoyu gradually moved from tentative responses to taking part in a full shared reveal.",
            "positiveMoments": "With familiar melodies and a slower pace, he joined more willingly and often helped the bear learn it again.",
            "nextObservationFocus": "In the next cycle, it would be useful to keep the softer visuals and observe which musical pacing feels most comfortable.",
        },
        "safetyCheck": {
            "containsMedicalClaim": False,
            "flaggedPhrases": [],
            "checkedAt": "2026-06-27T10:11:00+08:00",
            "displayStatus": "passed",
            "plainSummary": "没有发现不适合直接使用的表述。",
            "plainSummaryEn": "No wording was found that should be held back from parent-facing use.",
        },
        "evidenceTrace": {
            "sessionIds": ["session-1", "session-2", "session-3", "session-4", "session-5", "session-6", "session-7", "session-8"],
            "rubricIds": ["join", "choice", "focus", "respond", "create", "recover", "access", "setting", "goal"],
            "insightIds": ["insight-engagement", "insight-recovery", "insight-setting"],
            "referenceIds": ["kim-2008", "geretsegger-2022", "gas-1968", "dream-2020", "baxter-2007"],
        },
        "teacherNote": "下次建议用低亮度、慢节奏和熟悉旋律开场。",
        "teacherNoteEn": "Next time, start with softer visuals, a slower tempo, and a familiar melody.",
    }

    reports = [base_report]
    for child_id, child_name, child_name_en in (("lele", "乐乐", "Lele"), ("anan", "安安", "Anan")):
        report = deepcopy(base_report)
        report["id"] = f"report-{child_id}-8"
        report["childId"] = child_id
        report["generation"]["id"] = f"generation-{child_id}-8"
        report["professionalDraft"]["overview"] = report["professionalDraft"]["overview"].replace("小宇", child_name)
        report["professionalDraft"]["affectObservation"] = report["professionalDraft"]["affectObservation"].replace("小宇", child_name)
        report["professionalDraft"]["participationObservation"] = report["professionalDraft"]["participationObservation"].replace("小宇", child_name)
        report["professionalDraftEn"]["overview"] = report["professionalDraftEn"]["overview"].replace("Xiaoyu", child_name_en)
        report["professionalDraftEn"]["participationObservation"] = report["professionalDraftEn"]["participationObservation"].replace("Xiaoyu", child_name_en)
        report["parentSummary"]["overview"] = report["parentSummary"]["overview"].replace("小宇", child_name)
        report["parentSummaryEn"]["overview"] = report["parentSummaryEn"]["overview"].replace("Xiaoyu", child_name_en)
        reports.append(report)
    return reports


def build_seed_audit_logs() -> list[dict[str, Any]]:
    return [
        {
            "id": "audit-initial-xiaoyu-report",
            "childId": "xiaoyu",
            "actor": "报告整理助手",
            "actorEn": "Report assistant",
            "action": "report.generated",
            "targetType": "report",
            "targetId": "report-xiaoyu-8",
            "createdAt": "2026-06-27T10:10:00+08:00",
            "summary": "系统整理了一版报告草稿，等老师确认。",
            "summaryEn": "The system prepared a report draft for teacher review.",
        },
        {
            "id": "audit-initial-lele-report",
            "childId": "lele",
            "actor": "报告整理助手",
            "actorEn": "Report assistant",
            "action": "report.generated",
            "targetType": "report",
            "targetId": "report-lele-8",
            "createdAt": "2026-06-27T10:10:00+08:00",
            "summary": "系统整理了一版报告草稿，等老师确认。",
            "summaryEn": "The system prepared a report draft for teacher review.",
        },
        {
            "id": "audit-initial-anan-report",
            "childId": "anan",
            "actor": "报告整理助手",
            "actorEn": "Report assistant",
            "action": "report.generated",
            "targetType": "report",
            "targetId": "report-anan-8",
            "createdAt": "2026-06-27T10:10:00+08:00",
            "summary": "系统整理了一版报告草稿，等老师确认。",
            "summaryEn": "The system prepared a report draft for teacher review.",
        },
    ]
