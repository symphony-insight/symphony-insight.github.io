# SymPhony Insight Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立一个可替换当前前端 mock 数据、并贴合原 proposal AI 网关路线的后端。后端需要支持孩子资料、活动记录、9 项观察问题、6 个观察方向、证据链、环境适配、LLM 报告草稿、教师审核和家长版导出，并且所有分数和报告内容都能追溯到具体活动、评分版本和生成版本。

**Architecture:** 后端采用“页面级聚合 API + 规范化观察数据库 + 独立证据服务 + AI 网关”的结构。React 前端继续按当前页面读取数据，FastAPI 在 `/api/v1` 下提供稳定接口；数据库保存原始活动、观察项、证据链接、报告草稿、AI 生成记录、审核记录和导出记录；服务层负责把活动记录聚合成 rubrics、趋势、报告输入和家长可读摘要。LLM 只生成报告草稿、改写家长版语言、检查违规表述，不参与 rubrics 评分、医疗判断或危机处置；第二阶段使用 mock LLM provider 跑通流程，第三阶段把 provider 切到真实 LLM API。

**Tech Stack:** Python 3.12, FastAPI, Pydantic v2, SQLAlchemy 2, Alembic, PostgreSQL 15+, SQLite test database, pytest, HTTPX, provider adapter pattern, Vite environment switch, TypeScript API adapter.

## Global Constraints

- 所有接口和数据字段必须保持“观察记录”口径，不能输出诊断、治疗结论、医学建议或能力定性标签。
- 前端给家长展示的报告必须经过教师审核；未审核报告只能返回教师工作台版本。
- 每个评分必须有 `rubric_version`、`score_anchor`、`evidence_session_ids` 和 `computed_at`。
- 数据库允许保存活动摘要和结构化指标；第一阶段不保存原始音视频文件。若必须引用媒体，只保存对象存储 key 与访问策略字段。
- 中英文切换在前端完成，后端返回稳定语义字段和中英文文案字段；中文必须是面向老师和家长的自然表达。
- API 响应必须保持当前前端能消费的页面结构，同时保留规范化字段，避免前端重新拼接核心业务含义。
- 测试必须覆盖公开接口、报告审核状态流转、证据链完整性、未授权访问和评分锚点边界。
- 日志与审计记录不得包含孩子姓名以外的敏感自由文本；审计详情使用实体 ID、动作名和结构化 diff。
- LLM 不能读取原始音视频；它只能读取结构化指标、rubric 证据摘要、老师确认过的自由文本和明确的安全约束。
- LLM 输出永远是 `draft`，必须经过教师审核后才能进入家长版报告或导出物。
- AI 网关必须支持 `mock`、`disabled`、`real` 三种 provider mode；默认值是 `mock`，真实 API key 只允许从后端环境变量读取。
- 每一次 AI 生成都必须记录 `provider_mode`、`model_name`、`prompt_version`、`input_hash`、`output_hash`、`safety_status`、`created_by` 和 `created_at`。
- 如果 AI 输出包含 `治愈`、`改善病情`、`康复有效`、`自闭症减轻`、`脑瘫好转`、`恢复正常`，后端必须标记为 `blocked`，不能进入报告草稿。

---

## Task 1: Create Backend Scaffold

**Files:**

- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/pyproject.toml`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/__init__.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/main.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/core/settings.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/tests/test_health.py`
- Update: `/Users/yijie/Documents/GitHub/symphony-insight/.gitignore`

**Interfaces:**

```http
GET /api/v1/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "symphony-insight-api",
  "apiVersion": "v1"
}
```

**Steps:**

- [ ] Create `backend/pyproject.toml` with dependencies:

```toml
[project]
name = "symphony-insight-backend"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
  "fastapi>=0.115.0",
  "uvicorn[standard]>=0.30.0",
  "pydantic-settings>=2.4.0",
  "sqlalchemy>=2.0.32",
  "alembic>=1.13.2",
  "psycopg[binary]>=3.2.1",
  "httpx>=0.27.0",
]

[project.optional-dependencies]
dev = [
  "pytest>=8.3.0",
  "ruff>=0.6.0",
]

[tool.pytest.ini_options]
testpaths = ["tests"]

[tool.ruff]
line-length = 100
target-version = "py312"
```

- [ ] Implement `Settings` with `api_prefix="/api/v1"`, `service_name`, `database_url`, `cors_origins`.
- [ ] Implement `create_app()` in `app/main.py`; expose `app = create_app()`.
- [ ] Add CORS for local Vite origins: `http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:5174`, `http://127.0.0.1:5174`.
- [ ] Add `GET /api/v1/health`.
- [ ] Add `.venv/`, `backend/.pytest_cache/`, `backend/.ruff_cache/`, `backend/htmlcov/` to `.gitignore` if missing.
- [ ] Verify:

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight/backend
python3.12 -m venv .venv
. .venv/bin/activate
pip install -e ".[dev]"
pytest
```

Expected output includes:

```text
1 passed
```

- [ ] Commit:

```bash
git add backend .gitignore
git commit -m "Add backend FastAPI scaffold"
```

---

## Task 2: Define Domain Schemas Matching The Current Frontend

**Files:**

- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/schemas/common.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/schemas/children.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/schemas/sessions.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/schemas/rubrics.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/schemas/ai.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/schemas/reports.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/tests/test_schema_contract.py`

**Interfaces:**

The backend schema must preserve these frontend concepts:

```python
Language = Literal["zh", "en"]
ReviewStatus = Literal["draft", "teacher_review", "approved", "exported"]
ConsentStatus = Literal["active", "pending", "revoked"]
AIProviderMode = Literal["disabled", "mock", "real"]
AIGenerationStatus = Literal["queued", "running", "draft", "blocked", "failed"]
RubricDomainKey = Literal[
    "social_interaction",
    "communication",
    "attention_learning",
    "adaptation_participation",
    "sensory_environment",
    "behavior_pattern",
]
```

Core response models:

```python
class LocalizedText(BaseModel):
    zh: str
    en: str

class ChildSummary(BaseModel):
    id: str
    display_name: str
    avatar_url: str | None
    profile_type: str
    consent_status: ConsentStatus
    baseline_status: str

class RubricEvidence(BaseModel):
    rubric_id: str
    rubric_version: str
    score: float
    score_label: LocalizedText
    domain_key: RubricDomainKey
    evidence_session_ids: list[str]
    metric_summary: LocalizedText
    reference_note: LocalizedText
    computed_at: datetime

class LLMReportDraftRequest(BaseModel):
    child: ChildSummary
    period_start: date
    period_end: date
    session_count: int
    rubric_snapshot: list[RubricEvidence]
    insights: list[LongitudinalInsight]
    constraints: dict[str, bool]

class LLMReportDraftResponse(BaseModel):
    professional_draft: dict[str, str | list[str]]
    parent_summary: dict[str, str]
    safety_check: dict[str, bool | list[str]]
    provider_mode: AIProviderMode
    model_name: str
    prompt_version: str
```

**Steps:**

- [ ] Translate the current TypeScript domain types into Pydantic models without changing field meaning.
- [ ] Use snake_case in backend JSON only when the frontend adapter maps it; otherwise preserve current camelCase for direct compatibility.
- [ ] Add `LocalizedText` for user-facing labels that need Chinese and English.
- [ ] Add `ObservationScaleAnchor` with fields `value`, `label`, `plain_meaning`, `evidence_rule`.
- [ ] Add `RubricDomain` with `domain_key`, `title`, `plain_question`, `items`, `research_basis`.
- [ ] Add `AIRequest`, `AIResponse`, `LLMReportDraftRequest`, `LLMReportDraftResponse`, and `AISafetyCheck`.
- [ ] Add `ReportDraft` with `status`, `teacher_notes`, `parent_summary`, `sections`, `reviewed_by`, `reviewed_at`.
- [ ] Make `ReportDraft` include optional `generation_id`, `prompt_version`, `safety_status`, and `blocked_phrases`.
- [ ] Add schema contract tests that instantiate:
  - one child summary
  - one activity session
  - one rubric domain with two items
  - one LLM report draft response in `draft`
  - one report draft in `teacher_review` linked to a generation ID
- [ ] Verify:

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight/backend
. .venv/bin/activate
pytest tests/test_schema_contract.py
```

Expected output includes:

```text
5 passed
```

- [ ] Commit:

```bash
git add backend/app/schemas backend/tests/test_schema_contract.py
git commit -m "Add backend domain schemas"
```

---

## Task 3: Add Database Models, Migrations, And Seed Data

**Files:**

- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/alembic.ini`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/alembic/env.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/alembic/versions/0001_initial_observation_schema.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/db/base.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/db/models.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/db/session.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/db/seed.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/tests/test_database_seed.py`

**Interfaces:**

Database entities:

```text
users
children
child_access_roles
consent_records
activity_sessions
session_metrics
session_notes
session_artifacts
rubric_domains
rubric_items
rubric_score_anchors
rubric_references
rubric_score_snapshots
rubric_evidence_links
setting_fit_summaries
longitudinal_insights
ai_model_providers
ai_generation_jobs
ai_generation_attempts
ai_safety_flags
report_drafts
report_sections
audit_logs
```

Minimum seed contract:

```python
seed_demo_child(session, child_id="xiaoyu")
```

Seed must create:

- one child: `xiaoyu`
- eight sessions
- six rubric domains
- nine rubric items
- one current report draft
- one mock AI generation job linked to the current report draft
- one teacher user
- audit logs for report creation and teacher review

**Steps:**

- [ ] Configure SQLAlchemy 2 declarative models with UTC timestamps.
- [ ] Use string IDs for frontend compatibility: `xiaoyu`, `session-01`, `rubric-participation`.
- [ ] Add foreign keys from score snapshots to child, rubric item, rubric version, and evidence links.
- [ ] Add AI generation tables with foreign keys from generation jobs to child, report draft, actor user, and generation attempts.
- [ ] Store AI request/response hashes in typed columns: `input_hash`, `output_hash`, `prompt_version`, `provider_mode`, `model_name`, `safety_status`.
- [ ] Add `metadata_json` JSON columns only for low-risk derived fields; keep core metrics in typed columns.
- [ ] Add Alembic migration `0001_initial_observation_schema.py`.
- [ ] Implement `seed_demo_child()` with data matching the latest premium dashboard:
  - 8 activities
  - 20 creative fragments
  - 9 observable questions
  - 6 observation directions
  - 1 mock LLM report draft generation
  - teacher name `陈老师`
- [ ] Verify migration on SQLite:

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight/backend
. .venv/bin/activate
DATABASE_URL=sqlite:///./test.db alembic upgrade head
python -m app.db.seed --database-url sqlite:///./test.db --child-id xiaoyu
pytest tests/test_database_seed.py
rm -f test.db
```

Expected output includes:

```text
1 passed
```

- [ ] Commit:

```bash
git add backend/alembic.ini backend/alembic backend/app/db backend/tests/test_database_seed.py
git commit -m "Add observation database schema"
```

---

## Task 4: Implement Read APIs For Current Pages

**Files:**

- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/api/__init__.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/api/dependencies.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/api/routes/__init__.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/api/routes/children.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/api/routes/sessions.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/api/routes/rubrics.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/api/routes/settings_fit.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/api/routes/insights.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/repositories/observation_repository.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/tests/test_read_api.py`
- Update: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/main.py`

**Interfaces:**

```http
GET /api/v1/children
GET /api/v1/children/{child_id}/overview
GET /api/v1/children/{child_id}/sessions
GET /api/v1/children/{child_id}/rubrics
GET /api/v1/children/{child_id}/settings-fit
GET /api/v1/children/{child_id}/insights
```

`GET /api/v1/children/{child_id}/overview` response shape:

```json
{
  "child": {
    "id": "xiaoyu",
    "displayName": "小宇",
    "consentStatus": "active"
  },
  "summary": {
    "sessionCount": 8,
    "creativeFragmentCount": 20,
    "engagementLabel": {
      "zh": "很投入",
      "en": "Strong engagement"
    },
    "teacherName": "陈老师"
  },
  "rubricSnapshot": [],
  "recentSessions": [],
  "reportStatus": "teacher_review"
}
```

**Steps:**

- [ ] Implement repository methods:
  - `list_children()`
  - `get_child_overview(child_id)`
  - `list_sessions(child_id)`
  - `get_rubric_snapshot(child_id)`
  - `get_setting_fit(child_id)`
  - `list_insights(child_id)`
- [ ] Return `404` with code `child_not_found` when `child_id` is unknown.
- [ ] Return `403` with code `child_access_denied` when the current user lacks access.
- [ ] Add dependency `get_current_user()` that returns the demo teacher user in local mode.
- [ ] Keep page responses aggregated so frontend pages need one request per main route.
- [ ] Add tests for:
  - list children
  - overview for `xiaoyu`
  - sessions count is 8
  - rubric count is 9
  - unknown child returns 404
- [ ] Verify:

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight/backend
. .venv/bin/activate
pytest tests/test_read_api.py
```

Expected output includes:

```text
5 passed
```

- [ ] Commit:

```bash
git add backend/app/api backend/app/repositories backend/app/main.py backend/tests/test_read_api.py
git commit -m "Add observation read APIs"
```

---

## Task 5: Implement Evidence And Rubric Computation Service

**Files:**

- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/services/evidence_service.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/services/rubric_service.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/tests/test_rubric_evidence.py`
- Update: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/api/routes/rubrics.py`
- Update: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/repositories/observation_repository.py`

**Interfaces:**

```python
class EvidenceService:
    def build_rubric_snapshot(self, child_id: str, rubric_version: str) -> list[RubricEvidence]: ...

class RubricService:
    def build_rubric_guide(self, language: Language) -> list[RubricDomain]: ...
```

Rubric version:

```text
observation-v1-2026-06
```

Nine rubric items:

```text
participation_willingness
response_to_others
choice_expression
self_expression
interest_duration
goal_progress
recovery_after_discomfort
operation_fit
environment_fit
```

Six domains:

```text
adaptation_participation
social_interaction
communication
attention_learning
sensory_environment
behavior_pattern
```

**Steps:**

- [ ] Encode score anchors for 1 to 5:
  - 1 = 很少看到
  - 2 = 偶尔出现
  - 3 = 有时能做到
  - 4 = 经常能做到
  - 5 = 稳定出现
- [ ] Store plain-language Chinese and English explanations for each anchor.
- [ ] Compute each score from structured session metrics only; do not infer score from teacher notes.
- [ ] For every rubric evidence row, return:
  - score
  - score label
  - direction/domain
  - short metric change
  - source session IDs
  - reference note
  - confidence level: `low`, `medium`, or `high`
- [ ] Add `behavior_pattern` as an observation direction with no independent score in the first backend release. It should appear in the guide and may have `items=[]`.
- [ ] Add tests:
  - every score has at least one evidence session
  - every score has a valid anchor from 1 to 5
  - every rubric item belongs to one of the six domains
  - `behavior_pattern` appears in guide without forcing a score
  - empty session history returns no score and a readable empty-state reason
- [ ] Verify:

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight/backend
. .venv/bin/activate
pytest tests/test_rubric_evidence.py
```

Expected output includes:

```text
5 passed
```

- [ ] Commit:

```bash
git add backend/app/services backend/app/api/routes/rubrics.py backend/app/repositories backend/tests/test_rubric_evidence.py
git commit -m "Add evidence-backed rubric service"
```

---

## Task 6: Add AI Gateway With Mock Provider

**Files:**

- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/services/ai_gateway.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/services/ai_providers.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/services/ai_safety_policy.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/repositories/ai_repository.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/tests/test_ai_gateway.py`
- Update: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/core/settings.py`
- Update: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/schemas/ai.py`

**Interfaces:**

```python
class AIProvider(Protocol):
    provider_mode: AIProviderMode
    model_name: str

    async def generate_report_draft(self, request: LLMReportDraftRequest) -> LLMReportDraftResponse: ...

class AIGateway:
    async def generate_report_draft(
        self,
        request: LLMReportDraftRequest,
        actor_id: str,
    ) -> LLMReportDraftResponse: ...
```

Provider modes:

```text
AI_PROVIDER_MODE=mock
AI_PROVIDER_MODE=disabled
AI_PROVIDER_MODE=real
AI_MODEL_NAME=mock-report-writer-v1
AI_PROMPT_VERSION=report-draft-v1-2026-06
AI_GATEWAY_BASE_URL=
AI_GATEWAY_API_KEY=
```

Blocked phrases:

```text
治愈
改善病情
康复有效
自闭症减轻
脑瘫好转
恢复正常
```

**Steps:**

- [ ] Add settings fields for `ai_provider_mode`, `ai_model_name`, `ai_prompt_version`, `ai_gateway_base_url`, and `ai_gateway_api_key`.
- [ ] Implement `MockAIProvider.generate_report_draft()` with deterministic output from structured metrics. The output must include:
  - professional draft overview
  - participation observation
  - setting fit observation
  - review points
  - parent summary
  - safety check
- [ ] Implement `DisabledAIProvider.generate_report_draft()` that raises `AIProviderDisabledError` with code `ai_provider_disabled`.
- [ ] Implement `RealAIProvider` as an adapter shell using HTTPX and the same request/response schema. It must refuse to start when `AI_PROVIDER_MODE=real` and `AI_GATEWAY_API_KEY` is empty.
- [ ] Implement `AISafetyPolicy.scan(text)` returning `safety_status="passed"` or `safety_status="blocked"` plus `flagged_phrases`.
- [ ] Implement `AIGateway.generate_report_draft()` to:
  - hash the structured input
  - call the configured provider
  - run the safety policy on every text field
  - persist generation job, attempt, hashes, provider mode, model name, prompt version, safety status, and actor ID
  - return blocked output with empty report sections when safety status is `blocked`
- [ ] Add tests:
  - mock provider returns deterministic text
  - disabled provider raises `ai_provider_disabled`
  - real provider without API key fails at settings validation
  - safety policy blocks medical-claim phrases
  - generation attempt is persisted with provider mode and prompt version
- [ ] Verify:

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight/backend
. .venv/bin/activate
pytest tests/test_ai_gateway.py
```

Expected output includes:

```text
5 passed
```

- [ ] Commit:

```bash
git add backend/app/services/ai_gateway.py backend/app/services/ai_providers.py backend/app/services/ai_safety_policy.py backend/app/repositories/ai_repository.py backend/app/core/settings.py backend/app/schemas/ai.py backend/tests/test_ai_gateway.py
git commit -m "Add AI gateway with mock provider"
```

---

## Task 7: Generate LLM Report Drafts From Structured Observations

**Files:**

- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/api/routes/report_generation.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/services/report_generation_service.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/tests/test_report_generation.py`
- Update: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/main.py`
- Update: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/repositories/observation_repository.py`
- Update: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/schemas/reports.py`

**Interfaces:**

```http
POST /api/v1/children/{child_id}/reports/draft
```

Request body:

```json
{
  "periodStart": "2026-06-01",
  "periodEnd": "2026-06-28",
  "language": "zh"
}
```

Response body:

```json
{
  "reportId": "report-xiaoyu-current",
  "generationId": "generation-xiaoyu-20260628-001",
  "status": "draft",
  "safetyStatus": "passed",
  "promptVersion": "report-draft-v1-2026-06",
  "professionalDraft": {
    "overview": "过去 8 次活动中，小宇在熟悉旋律和较柔和反馈下更容易保持参与。",
    "participationObservation": "最近几次活动里，主动参加和回到活动的次数更稳定。",
    "reviewPoints": ["请老师确认高亮动画后的退出记录是否需要补充说明。"],
    "limitationNote": "这份内容只整理观察到的活动表现，需要老师复核后再给家长查看。"
  },
  "parentSummary": {
    "overview": "小宇最近在熟悉的音乐和舒适的环境里更愿意参与。",
    "nextObservationFocus": "下次可以继续留意亮度和节奏变化对参与状态的影响。"
  }
}
```

Service signature:

```python
class ReportGenerationService:
    async def create_report_draft(
        self,
        child_id: str,
        period_start: date,
        period_end: date,
        language: Language,
        actor_id: str,
    ) -> ReportDraft: ...
```

**Steps:**

- [ ] Implement `ReportGenerationService.create_report_draft()` to collect child summary, sessions, rubric evidence, setting fit, and insights.
- [ ] Build `LLMReportDraftRequest` from structured data only. Do not include raw video, raw audio, full transcripts, or unreviewed sensitive notes.
- [ ] Call `AIGateway.generate_report_draft()` and receive a draft response.
- [ ] If `safety_status="blocked"`, save a report draft with status `draft`, empty parent summary, and visible teacher-only blocked reason.
- [ ] If `safety_status="passed"`, save a report draft with status `draft`, generated professional draft, generated parent summary, generation ID, prompt version, and source rubric version.
- [ ] Add audit log action `report_draft_generated`.
- [ ] Add tests:
  - draft generation reads structured rubric evidence
  - generated report is status `draft`
  - blocked AI output cannot become parent summary
  - generation ID is stored on report draft
  - unknown child returns 404
- [ ] Verify:

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight/backend
. .venv/bin/activate
pytest tests/test_report_generation.py
```

Expected output includes:

```text
5 passed
```

- [ ] Commit:

```bash
git add backend/app/api/routes/report_generation.py backend/app/services/report_generation_service.py backend/app/main.py backend/app/repositories/observation_repository.py backend/app/schemas/reports.py backend/tests/test_report_generation.py
git commit -m "Add LLM report draft generation"
```

---

## Task 8: Implement Teacher Review And Export Gate

**Files:**

- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/api/routes/reports.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/services/report_service.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/services/audit_service.py`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/tests/test_report_workflow.py`
- Update: `/Users/yijie/Documents/GitHub/symphony-insight/backend/app/main.py`

**Interfaces:**

```http
GET /api/v1/children/{child_id}/reports/current
PATCH /api/v1/reports/{report_id}
PATCH /api/v1/reports/{report_id}/status
POST /api/v1/reports/{report_id}/export-parent-summary
GET /api/v1/reports/{report_id}/audit-logs
```

Status transitions:

```text
draft -> teacher_review
teacher_review -> approved
approved -> exported
teacher_review -> draft
approved -> teacher_review
```

Blocked transitions:

```text
draft -> exported
teacher_review -> exported
exported -> draft
```

**Steps:**

- [ ] Implement `ReportService.get_current_report(child_id, viewer_role)`.
- [ ] Make `ReportService.get_current_report()` return generated draft metadata: `generation_id`, `prompt_version`, `safety_status`, and `blocked_phrases`.
- [ ] If `viewer_role="guardian"` and report is not `approved` or `exported`, return `403` with code `report_not_ready`.
- [ ] Implement report patching for teacher notes, parent summary, and section ordering.
- [ ] Implement status transition validation with explicit error code `invalid_report_transition`.
- [ ] Implement parent summary export as a deterministic JSON payload:

```json
{
  "reportId": "report-xiaoyu-current",
  "childId": "xiaoyu",
  "exportedAt": "2026-06-28T00:00:00Z",
  "sections": [],
  "rubricVersion": "observation-v1-2026-06"
}
```

- [ ] Write audit log entries for:
  - report draft update
  - status change
  - parent summary export
- [ ] Add tests:
  - teacher can fetch draft
  - teacher can edit an LLM-generated draft before approval
  - guardian cannot fetch unapproved report
  - approved report can be exported
  - blocked transition returns 409
  - audit log records status change with actor ID
- [ ] Verify:

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight/backend
. .venv/bin/activate
pytest tests/test_report_workflow.py
```

Expected output includes:

```text
6 passed
```

- [ ] Commit:

```bash
git add backend/app/api/routes/reports.py backend/app/services/report_service.py backend/app/services/audit_service.py backend/app/main.py backend/tests/test_report_workflow.py
git commit -m "Add report review workflow"
```

---

## Task 9: Connect Frontend Through A Switchable API Adapter

**Files:**

- Create: `/Users/yijie/Documents/GitHub/symphony-insight/src/api/backendApi.ts`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/src/api/client.ts`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/src/api/normalizers.ts`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/src/api/__tests__/backendApi.test.ts`
- Update: `/Users/yijie/Documents/GitHub/symphony-insight/src/api/mockApi.ts`
- Update: `/Users/yijie/Documents/GitHub/symphony-insight/src/App.tsx`
- Update: `/Users/yijie/Documents/GitHub/symphony-insight/.env.example`

**Interfaces:**

Environment switch:

```text
VITE_API_MODE=mock
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Frontend API adapter:

```ts
export interface SymphonyApi {
  listChildren(): Promise<Child[]>
  getChildOverview(childId: string): Promise<ChildOverview>
  listSessions(childId: string): Promise<SessionSummary[]>
  getRubrics(childId: string): Promise<RubricPageData>
  getSettingsFit(childId: string): Promise<SettingsFitData>
  listInsights(childId: string): Promise<LongitudinalInsight[]>
  getCurrentReport(childId: string): Promise<ReportDraft>
  generateReportDraft(childId: string, request: GenerateReportDraftRequest): Promise<ReportDraft>
  updateReport(reportId: string, patch: ReportPatch): Promise<ReportDraft>
  updateReportStatus(reportId: string, status: ReviewStatus): Promise<ReportDraft>
  exportParentSummary(reportId: string): Promise<ParentSummaryExport>
}
```

**Steps:**

- [ ] Keep `mockApi` as the default for GitHub Pages and static demo use.
- [ ] Add `backendApi` using `fetch` with typed error handling.
- [ ] Add `getApiClient()` that returns `mockApi` when `VITE_API_MODE !== "backend"`.
- [ ] Add normalizers only where backend JSON differs from current TypeScript shape.
- [ ] Add loading and error states for backend failures:
  - network unavailable
  - child not found
  - report not ready
  - invalid report transition
  - AI provider disabled
  - AI output blocked by safety policy
- [ ] Ensure Chinese user-facing error copy avoids system terms:
  - Use `暂时没取到这份记录` instead of `API error`
  - Use `这份报告还需要老师确认` instead of `403`
  - Use `报告草稿生成暂时不可用` instead of `ai_provider_disabled`
  - Use `这份草稿里有不适合直接使用的表述，已留给老师修改` instead of `safety_status=blocked`
- [ ] Add adapter tests with mocked `fetch`.
- [ ] Verify frontend:

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
npm test
npm run build
```

Expected output includes:

```text
✓ built
```

- [ ] Verify backend mode manually:

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight/backend
. .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

In another terminal:

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
VITE_API_MODE=backend VITE_API_BASE_URL=http://localhost:8000/api/v1 npm run dev -- --host 127.0.0.1 --port 5173
```

- [ ] Commit:

```bash
git add src/api src/App.tsx .env.example
git commit -m "Connect frontend to switchable backend API"
```

---

## Task 10: Add Development Runbook And End-To-End Verification

**Files:**

- Create: `/Users/yijie/Documents/GitHub/symphony-insight/docs/backend-runbook.md`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/docs/api-contract.md`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/backend/tests/test_api_contract_snapshot.py`
- Update: `/Users/yijie/Documents/GitHub/symphony-insight/README.md`
- Update: `/Users/yijie/Documents/GitHub/symphony-insight/package.json`

**Interfaces:**

Convenience scripts:

```json
{
  "scripts": {
    "dev:frontend": "vite --host 127.0.0.1 --port 5173",
    "dev:backend": "cd backend && . .venv/bin/activate && uvicorn app.main:app --reload --port 8000",
    "test:backend": "cd backend && . .venv/bin/activate && pytest",
    "test:all": "npm test && npm run build && cd backend && . .venv/bin/activate && pytest"
  }
}
```

**Steps:**

- [ ] Document local setup:
  - install frontend dependencies
  - create backend virtualenv
  - run migration
  - seed demo child
  - set `AI_PROVIDER_MODE=mock`
  - leave `AI_GATEWAY_API_KEY` empty in mock mode
  - start backend
  - start frontend in mock mode
  - start frontend in backend mode
- [ ] Document API contract with one example response per page route and one example response for `POST /api/v1/children/xiaoyu/reports/draft`.
- [ ] Add contract snapshot tests for:
  - `/children`
  - `/children/xiaoyu/overview`
  - `/children/xiaoyu/rubrics`
  - `/children/xiaoyu/reports/current`
  - `POST /api/v1/children/xiaoyu/reports/draft`
- [ ] Add a privacy section:
  - no raw media in phase 1
  - LLM receives structured observations only
  - real LLM API keys live only in backend environment variables
  - teacher approval required
  - guardian access limited to approved reports
  - AI output is draft-only
  - audit log retained for report actions
- [ ] Add a proposal-alignment section:
  - Channel A local real-time feedback is outside this backend plan
  - Channel B cloud generation is represented by AI gateway provider adapters
  - The first backend uses mock LLM provider
  - Real LLM provider is enabled by `AI_PROVIDER_MODE=real`
  - Rubrics scoring remains deterministic and does not call LLM
- [ ] Verify full suite:

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
npm test
npm run build
cd backend
. .venv/bin/activate
pytest
```

Expected outputs include:

```text
✓ built
```

and:

```text
passed
```

- [ ] Commit:

```bash
git add docs/backend-runbook.md docs/api-contract.md backend/tests/test_api_contract_snapshot.py README.md package.json
git commit -m "Document backend development workflow"
```

---

## Final Verification

- [ ] Confirm working tree contains only intended backend and API-adapter changes:

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
git status --short
```

Expected output:

```text

```

- [ ] Run all checks:

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
npm test
npm run build
cd backend
. .venv/bin/activate
pytest
```

- [ ] Start local backend:

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight/backend
. .venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- [ ] Start frontend against backend:

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
VITE_API_MODE=backend VITE_API_BASE_URL=http://localhost:8000/api/v1 npm run dev -- --host 127.0.0.1 --port 5173
```

- [ ] Browser smoke test:
  - open `http://localhost:5173/#/child/xiaoyu/report`
  - confirm overview loads from backend
  - confirm 9 observation questions appear
  - confirm 6 observation directions appear
  - confirm report draft can be generated with mock AI provider
  - confirm report review gate appears
  - confirm parent export is blocked before approval
  - confirm no Chinese UI text contains raw terms such as `session`, `API error`, `rubric id`, `payload`, `403`
  - confirm no parent-facing text contains `治愈`, `改善病情`, `康复有效`, `自闭症减轻`, `脑瘫好转`, `恢复正常`
