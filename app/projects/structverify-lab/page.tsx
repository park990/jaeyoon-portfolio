import type { Metadata } from "next";
import { Award, Database, Zap, type LucideIcon } from "lucide-react";
import { Section, Prose } from "@/components/project-detail/section";
import { CodeBlock } from "@/components/project-detail/code-block";
import {
  ProjectHeader,
  ProjectFooter,
} from "@/components/project-detail/layout";
import {
  TechStackGrid,
  MyRoleCards,
  TroubleCards,
  ResultsGrid,
  LessonsList,
  type Role,
  type Trouble,
} from "@/components/project-detail/blocks";
import {
  AgentFlowDiagram,
  DataLayersDiagram,
  WorkScopeTable,
} from "./_components/architecture";
import { getProjectBySlug } from "@/lib/projects";

const SLUG = "structverify-lab";
const ACCENT = "#0EA5E9";
const REPO = "https://github.com/orgs/2026-StructVerify-Lab/repositories";

export const metadata: Metadata = {
  title: "StructVerify-Lab v2.0 · Jaeyoon Park",
  description:
    "v2.0 LLM 사실검증 플랫폼. 인프라·데이터 적재·KOSIS 메타/검색·LLM 429 backoff·runtime 병렬화·검증 판단까지 8개 모듈 담당.",
};

const techStack = [
  {
    category: "Infra",
    items: ["Docker Compose", "PostgreSQL 16 + pgvector"],
  },
  {
    category: "Backend",
    items: ["Python 3.13", "FastAPI", "psycopg2", "Pydantic v2"],
  },
  {
    category: "LLM (HCX)",
    items: [
      "HCX-DASH-001 (경량)",
      "HCX-003 (중량)",
      "HCX 임베딩 v2 (1024차원)",
    ],
  },
  {
    category: "Retrieval / Verification",
    items: ["KOSIS Open API", "pgvector 코사인 검색", "deterministic 수치 비교"],
  },
  {
    category: "Data Ingestion",
    items: ["KOSIS Open API", "NCP HCX 임베딩 v2 (1024차원)"],
  },
  {
    category: "Cloud / CI",
    items: ["AWS EC2 (nginx + pm2)", "GitHub Actions"],
  },
];

const roles: Role[] = [
  {
    title: "인프라 · docker-compose + DB 초기화",
    bullets: [
      "PostgreSQL 16 + pgvector를 docker-compose로 묶어 팀원이 git clone 후 `docker-compose up -d` 한 줄로 동일 환경 재현",
      "init_db.py — psycopg2 연결 + pgvector 확장 + 핵심 5 테이블(requests/claims/truths/results/kosis_stat_catalog) 자동 생성",
      "운영 플랫폼 계층(sv_platform)은 alembic 마이그레이션으로 4 테이블(tenants/users/api_keys/jobs) 별도 관리 — 총 9 테이블",
    ],
  },
  {
    title: "데이터 적재 — PostgreSQL",
    bullets: [
      "db_manager.py — psycopg2 연결, save_claims/save_results 배치 INSERT, save_document/save_feedback 진행",
      "core/pipeline.py에 DBManager 초기화·Claims/Results 적재 연동 + 기사 텍스트 해시로 doc_id 고정 (재실행 중복 방지)",
    ],
  },
  {
    title: "KOSIS 통계 메타 크롤러 + 카탈로그 검색",
    bullets: [
      "adaptation/kosis_crawler.py — 주제별 통계(MT_ZTITLE) 31개 카테고리(A~U + H1/H2 · I1/I2 · J1/J2 · K1/K2 · M1/M2 · N1/N2 등 세분화) 전체 메타 수집",
      "NCP HCX 임베딩 v2 (1024차원) 배치 100건 단위 + asyncio.Semaphore(3) rate limit + 재시도 백오프 → pgvector INSERT",
      "is_catalog_ready 체크로 builder_agent.pretrain_domain()에서 호출 시 중복 수집 방지",
      "retrieval/catalog_search.py — kosis_stat_catalog에 대해 category_path ILIKE + embedding 코사인 유사도 하이브리드 검색",
    ],
  },
  {
    title: "KOSIS 커넥터 — 표 매칭 정확도 필터링 4종",
    bullets: [
      "retrieval/kosis_connector.py _is_table_relevant() — 검색된 통계표가 claim과 실제로 맞는지 차단 로직",
      "UN/IMF/OECD/세계은행 등 국제기구 데이터 차단 (_INTERNATIONAL_MARKERS)",
      "장래·추계·전망 같은 예측 테이블 차단 (_FORECAST_TABLE_MARKERS) — '현재 값 검증'에 부적합",
      "남부동남아시아·아프리카·중동 등 해외 지역명 차단 (_REGION_MARKERS)",
      "영아·신생아·모성처럼 세부 대상에 한정된 테이블 차단 — '전체 사망자' 주장에 '영아 사망률' 표가 매칭되던 문제 해결",
    ],
  },
  {
    title: "LLM 클라이언트 안정화 — 429 exponential backoff",
    bullets: [
      "utils/llm_client.py의 _call_hcx_v1 / _call_hcx_v3 / _call_hcx_structured 세 경로에 동일 패턴 적용",
      "exponential backoff 재시도 최대 3회 (1초 → 2초 → 4초)",
      "schema_inductor의 generate_structured 호출 시 발생한 rate limit 문제 해결",
    ],
  },
  {
    title: "Runtime 검증 파이프라인 병렬화 + 수치 비교 로직",
    bullets: [
      "runtime_agent.py — claim별 검증을 asyncio.gather + Semaphore(3)로 병렬화. claim 1건당 14~40초였던 처리가 8건 직렬 ~7분 → 병렬 ~1/3로 단축",
      "tools/factcheck_test.py를 v3~v7까지 진화시키며 RAG 기반 팩트체크 검증 로직 정착",
      "verification/verifier.py 통합 — '천명개월' 같은 KOSIS 단위명 오류 대응, 연도 ±2 필터 → 정확 일치로 변경, LLM 재판정 트리거 복원, 90% 초과 오차는 테이블 매칭 오류로 판단불가 처리",
    ],
  },
  {
    title: "Cloud / CI/CD",
    bullets: [
      "GitHub Actions 프론트엔드 + 백엔드 워크플로우 — push 시 빌드/배포 자동화",
      "AWS EC2 배포: nginx reverse proxy + pm2 프로세스 관리",
    ],
  },
  {
    title: "DB · 스키마 설계 시 참고한 논문 2편",
    bullets: [
      "RAG (NeurIPS 2020) → KOSIS 외부 DB 조회의 패러다임",
      "AutoSchemaKG (arXiv 2505.23628) → 도메인 비의존적 동적 스키마 유도",
    ],
  },
];

const troubles: Trouble[] = [
  {
    title: "KOSIS API rate limit + 임베딩 호출 폭증",
    star: true,
    problem:
      "전체 카테고리(31개)에 대해 메타를 수집하면 통계표가 수십만 건. 한 건씩 임베딩하면 NCP HCX 임베딩 API 호출 횟수 폭증 + KOSIS API rate limit 위반. 초기엔 단순 for 루프로 돌렸다가 KOSIS 차단 직전까지 감.",
    solve:
      "(1) NCP HCX 임베딩 v2 배치 100건 단위로 묶어 호출 횟수 1/100로 절감, (2) KOSIS API에 asyncio.Semaphore(3)로 동시 호출 3개 제한 + 재시도 백오프. 메타 수집 + 임베딩 INSERT를 한 파이프라인에 묶어 ETL 중간 산출물 관리 부담 제거.",
    lesson:
      "처음에는 메타 수집 코드를 짜기 바빠서 그냥 동기 루프로 KOSIS·HCX를 두드렸는데, 몇 분 만에 KOSIS 429와 HCX 동시 호출 한도 경고가 동시에 떴습니다. 코드를 좋게 쓰는 문제가 아니라 ‘한 번에 몇 개, 얼마 간격으로 부를지’를 처음부터 설계해야 한다는 걸 그때 알게 됐고, 이후로는 새로운 외부 API를 붙일 때 가장 먼저 배치·세마포어·재시도 자리를 비워두고 시작하게 됐습니다.",
  },
  {
    title: "KOSIS 통계표 매칭 오류 — '전체 사망자'에 '영아 사망률'이 잡힘",
    star: true,
    problem:
      "claim의 키워드를 KOSIS 카탈로그에서 벡터 + 키워드로 검색하면 의미상 가까운 표가 잘 잡히지만, 실제로는 검증 대상이 아닌 표가 다수 섞임. UN/IMF 같은 국제기구 데이터, '장래 추계', 해외 지역명, 영아·신생아 같은 세부 대상 테이블이 검증을 망침.",
    solve:
      "kosis_connector._is_table_relevant()에 4종 필터 추가 — _INTERNATIONAL_MARKERS / _FORECAST_TABLE_MARKERS / _REGION_MARKERS / _SPECIFIC_SCOPE_MARKERS. 표 이름이 이 마커에 걸리면 후속 검증에서 배제. 임베딩 검색의 한계를 도메인 규칙으로 보강.",
    lesson:
      "코사인 0.85가 나왔는데 도메인적으로 보면 전혀 다른 지표인 표가 몇 번 잡혔습니다. 임베딩 점수만으로 ‘맞는 통계’를 고르려던 가정이 거기서 깨졌고, 임베딩으론 후보만 좁힌 뒤 단위·연도·범위는 결정론적 조건으로 따로 거르는 패턴으로 다시 짰습니다.",
  },
  {
    title: "claim 8건 직렬 ~7분 — 사용자 체감 한계 초과",
    star: true,
    problem:
      "Runtime agent가 claim별로 ReAct 루프(검색 → 검증 → 설명)를 도는 구조라 1건당 14~40초. 한 기사에 claim이 8건이면 직렬 처리 시 ~7분. 사용자 입장에선 결과가 안 나오는 것처럼 보임.",
    solve:
      "claim끼리 독립적이라는 점을 이용해 runtime_agent에서 asyncio.gather + Semaphore(3)로 병렬화. 외부 API rate limit과 LLM 비용을 동시에 고려해 3개 동시까지 제한. 직렬 ~7분이 ~1/3로 단축.",
    lesson:
      "claim 처리를 빨리 끝내고 싶어 동시 호출 수를 키웠다가 오히려 429로 전체가 더 느려졌습니다. 동시 한도를 ‘외부 API가 받아주는 양’에 다시 맞췄더니 그제야 처리량이 풀렸고, runtime 병렬화를 설계할 때 가장 먼저 외부 한도부터 확인합니다.",
  },
];

const composeCode = `# docker-compose.yml — pgvector 단일 서비스
version: "3.8"

services:
  db:
    image: pgvector/pgvector:pg16
    container_name: factcheck-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 1234
      POSTGRES_DB: factcheck
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:

# 테이블 초기화: 별도 init_db.py에서 pgvector 확장 + 핵심 5 테이블 생성
# 운영 플랫폼 계층(sv_platform)은 alembic 마이그레이션으로 4 테이블 추가 — 총 9
`;

const crawlerCode = `# adaptation/kosis_crawler.py — KOSIS 메타 31 카테고리 + 배치 임베딩

KOSIS_TOP_CATEGORIES = [
    {"vw_cd": "MT_ZTITLE", "parent_id": "A"},   # 인구/가구
    {"vw_cd": "MT_ZTITLE", "parent_id": "B"},   # 고용/노동/임금
    # ... (총 31개, H1·H2, I1·I2, J1·J2 등 세분화 ID 포함)
    {"vw_cd": "MT_ZTITLE", "parent_id": "U"},
]

# KOSIS API rate limit 방어 — 동시 호출 3개로 제한
_sem = asyncio.Semaphore(3)

async def _fetch_category(category: dict) -> list[dict]:
    async with _sem:
        for attempt in range(3):
            try:
                return (await client.get(KOSIS_BASE, params={**category, ...})).json()
            except RateLimitError:
                await asyncio.sleep(2 ** attempt)
        return []

async def save_to_db(rows: list[dict]) -> None:
    # 통계표명 100건씩 배치로 묶어 임베딩 1024차원 → INSERT
    for chunk in chunks(rows, 100):
        embeddings = await ncp_embed_batch([r["statbl_nm"] for r in chunk])
        await conn.executemany("""
            INSERT INTO kosis_stat_catalog
              (orgid, tblid, statbl_nm, category, embedding)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (orgid, tblid) DO UPDATE SET embedding = EXCLUDED.embedding
        """, [(r["orgid"], r["tblid"], r["statbl_nm"], r["category"], emb)
              for r, emb in zip(chunk, embeddings)])
`;

const connectorFilterCode = `# retrieval/kosis_connector.py — _is_table_relevant 4종 필터
# 임베딩 검색의 한계를 도메인 규칙으로 보강

def _is_table_relevant(claim: Claim, tbl_name: str) -> bool:
    tbl_lower = tbl_name.lower()

    # (1) UN / IMF / OECD 등 국제기구 데이터 차단
    _INTERNATIONAL_MARKERS = {"un ", "imf ", "oecd ", "세계은행", "국제연합"}
    if any(m in tbl_lower for m in _INTERNATIONAL_MARKERS):
        return False

    # (2) 장래·추계·전망 — 미래 예측 테이블 차단
    _FORECAST_TABLE_MARKERS = {"장래", "추계", "전망"}
    if any(r in tbl_lower for r in _FORECAST_TABLE_MARKERS):
        return False

    # (3) 해외 지역명 차단 (검증 대상은 국내 데이터)
    _REGION_MARKERS = {"남부·동남아시아", "동남아시아", "아프리카",
                       "중동", "남미", "북미", "오세아니아"}
    if any(r in tbl_lower for r in _REGION_MARKERS):
        return False

    # (4) 세부 대상 불일치 — 전체 사망자 indicator에 영아 표가 잡히는 문제
    _SPECIFIC_SCOPE_MARKERS = {"영아", "신생아", "모성"}
    if claim.indicator_scope == "전체" and \\
       any(s in tbl_lower for s in _SPECIFIC_SCOPE_MARKERS):
        return False

    return True
`;

const retryCode = `# utils/llm_client.py — HCX 429 exponential backoff (V1/V3/structured 동일)

async def _call_hcx_v3(messages, **kwargs):
    # 429 rate limit 시 exponential backoff 재시도 (최대 3회)
    max_retries = 3
    for attempt in range(max_retries):
        try:
            return await _hcx_request("/v3/chat-completions/HCX-003", messages, **kwargs)
        except RateLimitError as e:
            if attempt == max_retries - 1:
                raise
            # 1초 → 2초 → 4초 백오프
            await asyncio.sleep(2 ** attempt)

# _call_hcx_v1, _call_hcx_structured에도 동일 패턴 적용
# → schema_inductor.generate_structured 호출 시 rate limit 자체 흡수
`;

// 페이지 최상단 TL;DR 박스에 노출할 핵심 결과 3개.
// 브리프 §1·§4(1)에 따라 수치/수상으로만 채움 — 형용사 금지.
type Highlight = {
  icon: LucideIcon;
  label: string;
  value: string;
  note: string;
  accent?: boolean;
};

const HIGHLIGHTS: Highlight[] = [
  {
    icon: Award,
    label: "수상",
    value: "최우수상",
    note: "멋쟁이사자처럼 NLP 집중과정",
    accent: true,
  },
  {
    icon: Database,
    label: "데이터 적재",
    value: "262,783건",
    note: "KOSIS 통계 카탈로그 + HCX 임베딩 v2 (1024차원)",
  },
  {
    icon: Zap,
    label: "Runtime 병렬화",
    value: "~7분 → ~1/3",
    note: "claim 8건 직렬 vs asyncio.gather + Semaphore(3)",
  },
];

// 핵심 결정·이유 — 사용자가 합격 포트폴리오 브리프에서 직접 지정한 카피.
// Snowflake 표현 주의: "사용/도입"이 아니라 "검토 후 기각, 직접 운영 경험 없음".
const KEY_DECISIONS = [
  {
    title: "EAV + parent_path vs 도메인별 테이블",
    body:
      "도메인마다 필요한 컬럼이 달라 테이블을 미리 정의할 수 없었습니다. 인구통계는 '사망률·평균수명'이 컬럼이지만 농업은 '재배면적·수확량'이라, 도메인별 테이블로 가면 새 도메인마다 컬럼 정의와 마이그레이션이 필요했습니다. 그래서 속성을 컬럼이 아니라 행으로 푸는 EAV(Entity-Attribute-Value) 모델을 채택했습니다 — '도메인=인구, 속성=사망률, 값=8.6'을 한 행으로 저장하면, 새 도메인이 들어와도 컬럼은 그대로 두고 행만 추가하면 됩니다. parent_path 컬럼엔 속성 간 계층(예: 인구 > 사망 > 영아사망률)을 같이 인코딩해서 트리 구조까지 한 테이블에서 표현했습니다.",
  },
  {
    title: "pgvector vs Snowflake",
    body:
      "Snowflake를 검토했으나 PoC 단계엔 도입 비용이 과하다고 판단했습니다(직접 운영 경험 없음). pgvector는 벡터 검색과 RDB를 단일 인프라에서 통합할 수 있어 채택했습니다.",
  },
  {
    title: "임베딩만 vs 임베딩 + 규칙 필터",
    body:
      "KOSIS 통계표 이름을 HCX로 임베딩해 코사인 검색으로 top-k 후보를 뽑으면, '전체 사망자' 검증 claim에 '영아 사망률' 표가 점수 높게 함께 잡혔습니다. 임베딩은 '사망' 같은 주제 어휘만 보고 정작 중요한 축(대상이 전체인지 영아인지, 단위가 수인지 률인지)은 못 가르기 때문입니다. 그래서 _is_table_relevant()는 대상 축(영아·신생아·모성·UN·장래추계·해외지역)을 4종 마커로 차단하고, 단위·연도 축은 verifier 단계에서 따로 비교하는 hybrid 구조로 풀었습니다.",
  },
];

export default function StructVerifyPage() {
  const project = getProjectBySlug(SLUG)!;

  return (
    <article
      className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:pt-16"
      style={{ "--accent": ACCENT } as React.CSSProperties}
    >
      <ProjectHeader
        project={project}
        oneLiner="기사 속 수치 주장을 KOSIS 공식 통계와 비교해 진위 판정하는 LLM 플랫폼. 초기 baseline 파이프라인부터 KOSIS 262,783건 적재 · 표 매칭 필터 4종 · runtime 병렬화 ~7분→~1/3 · LLM 429 backoff까지 담당."
        period="2026.05 ~ 진행 중"
        team="4명 (멋쟁이사자)"
        links={[{ label: "GitHub", href: REPO }]}
      />

      {/* 최우수상 텍스트 배지 — Hero/Card와 동일 패턴을 상세 페이지에도 명시 */}
      <div className="-mt-2 mb-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-3 py-1 text-xs font-medium text-[var(--accent)]">
          <Award className="h-3.5 w-3.5" aria-hidden="true" />
          멋쟁이사자처럼 NLP 과정 최우수상
        </span>
      </div>

      {/* TL;DR Highlights — 결과·수상을 페이지 최상단에 먼저 노출 (브리프 §1) */}
      <section
        aria-label="Highlights"
        className="-mt-2 mb-12 grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        {HIGHLIGHTS.map((h) => {
          const Icon = h.icon;
          return (
            <div
              key={h.label}
              className={
                "rounded-xl border p-4 sm:p-5 " +
                (h.accent
                  ? "border-[var(--accent)]/50 bg-[var(--accent)]/5"
                  : "border-border bg-card")
              }
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={
                    "h-4 w-4 " +
                    (h.accent ? "text-[var(--accent)]" : "text-muted-foreground")
                  }
                  aria-hidden="true"
                />
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {h.label}
                </p>
              </div>
              <p
                className={
                  "mt-2 text-xl font-semibold tracking-tight sm:text-2xl " +
                  (h.accent ? "text-[var(--accent)]" : "text-foreground")
                }
              >
                {h.value}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {h.note}
              </p>
            </div>
          );
        })}
      </section>

      <Section id="overview" title="Overview">
        <Prose>
          <p>
            비정형 텍스트(뉴스·보고서·문서)에서 수치 기반 주장을 자동으로 추출하고,
            KOSIS Open API 등 공식 통계 데이터와 비교해 사실 여부를 검증하는 LLM
            기반 플랫폼입니다. v2.0에서 팀이{" "}
            <span className="font-medium text-foreground">2-Agent 아키텍처</span>
            와{" "}
            <span className="font-medium text-foreground">도메인 적응 학습 루프</span>
            로 구조를 잡았고, 뉴스는 실험 도메인일 뿐 시스템 자체는 자기 적응형
            범용 검증 플랫폼을 지향합니다.
          </p>
          <p>
            4명 팀에서 저는 데이터 레이어(KOSIS 카탈로그 크롤러 · 표 매칭
            필터 · PostgreSQL 적재) + Agent A 측 runtime 검증 파이프라인 병렬화
            + LLM 클라이언트 안정화 + 검증 판단 로직(verifier)까지 데이터·검증
            흐름을 담당했습니다.
          </p>
        </Prose>
      </Section>

      <Section id="stack" title="Tech Stack">
        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
          ※ <span className="text-foreground">직접 다룬 영역</span>의 기술 세트 — 자세한 모듈
          분포는 아래 Architecture · Work Scope 표 참고.
        </p>
        <TechStackGrid groups={techStack} />
      </Section>

      <Section id="decisions" title="핵심 결정 · 이유">
        <div className="space-y-3">
          {KEY_DECISIONS.map((d, i) => (
            <div
              key={d.title}
              className="rounded-xl border border-border bg-card p-5 sm:p-6"
            >
              <div className="mb-2.5 flex items-start gap-3">
                <span
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-xs font-semibold"
                  style={{ color: ACCENT }}
                >
                  {i + 1}
                </span>
                <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground sm:text-lg">
                  {d.title}
                </h3>
              </div>
              <p className="ml-10 text-sm leading-[1.8] text-foreground/85">
                {d.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="role" title="My Role">
        <MyRoleCards roles={roles} accent={ACCENT} />
      </Section>

      <Section id="architecture" title="Architecture">
        <div className="space-y-5">
          <AgentFlowDiagram />
          <DataLayersDiagram />
          <WorkScopeTable />
        </div>
      </Section>

      <Section id="code" title="Code Highlights">
        <div className="space-y-5">
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              docker-compose — <span className="font-mono">docker-compose up -d</span> 한
              줄로 동일 환경 재현. 현재는 pgvector 단일 서비스로 가장 단순한 형태.
              Redis · Neo4j · MinIO · Elasticsearch는 로드맵에 두고 필요 시 추가
              예정.
            </p>
            <CodeBlock
              code={composeCode}
              lang="yaml"
              filename="docker-compose.yml"
            />
          </div>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              KOSIS 메타 크롤러 — Semaphore(3) rate limit + 배치 100건 임베딩 +
              재시도 백오프 3종 세트.
            </p>
            <CodeBlock
              code={crawlerCode}
              lang="python"
              filename="adaptation/kosis_crawler.py"
            />
          </div>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              KOSIS 커넥터의 표 매칭 필터 4종 — 임베딩 검색의 한계를 도메인
              규칙으로 보강.
            </p>
            <CodeBlock
              code={connectorFilterCode}
              lang="python"
              filename="retrieval/kosis_connector.py"
            />
          </div>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              LLM 클라이언트 429 exponential backoff — V1/V3/structured 세 경로에
              동일 패턴 적용.
            </p>
            <CodeBlock
              code={retryCode}
              lang="python"
              filename="utils/llm_client.py"
            />
          </div>
        </div>
      </Section>

      <Section id="trouble" title="Trouble-shooting">
        <TroubleCards troubles={troubles} accent={ACCENT} />
      </Section>

      <Section id="results" title="Results">
        <figure className="mb-6 overflow-hidden rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/5">
          <div className="grid grid-cols-[170px_1fr] items-center gap-4 p-4 sm:grid-cols-[210px_1fr] sm:gap-5 sm:p-5">
            <div className="overflow-hidden rounded-lg border border-[var(--accent)]/40 bg-background/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/projects/structverify-lab/award.jpg"
                alt="멋쟁이사자처럼 NLP 집중과정 최우수상 상장"
                loading="lazy"
                className="block h-auto w-full"
              />
            </div>
            <div>
              <p
                className="text-base font-semibold tracking-tight text-foreground sm:text-lg"
                style={{ color: ACCENT }}
              >
                멋쟁이사자처럼 NLP 집중과정 최우수상
              </p>
              <p className="mt-2 text-sm leading-[1.7] text-foreground/85">
                StructVerify-Lab(4인 팀) NLP 집중과정 최종프로젝트 최우수상 수상.
              </p>
            </div>
          </div>
        </figure>

        <ResultsGrid
          items={[
            "KOSIS stat_catalog 262,783건 적재 + 1024차원 임베딩 INSERT 완료",
            "docker-compose — `docker-compose up -d` 한 줄로 PostgreSQL(pgvector) 환경 재현",
            "init_db.py에서 pgvector 확장 + 핵심 5 테이블 자동 생성 (sv_platform alembic 4 테이블 별도 = 총 9)",
            "KOSIS 표 매칭 4종 필터로 영아·UN·IMF·장래추계 오매칭 차단",
            "runtime 병렬화로 claim 8건 직렬 ~7분 → ~1/3 단축",
            "HCX 429 exponential backoff로 schema_inductor 실패 자체 흡수",
            "GitHub Actions CI/CD + AWS EC2 (nginx + pm2) 배포",
          ]}
        />
      </Section>

      <Section id="lessons" title="Lessons Learned">
        <LessonsList
          items={[
            "처음엔 KOSIS랑 HCX를 그냥 동기 루프로 돌렸는데, 몇 분 만에 429가 떴습니다. 외부 API는 코드를 잘 짜는 문제가 아니라 '한 번에 몇 개를, 얼마 간격으로 보낼지'를 먼저 정하는 문제였습니다. 지금은 새 API를 붙일 때 배치·세마포어·재시도부터 잡고 시작합니다.",
            "코사인 유사도가 0.85씩 나오길래 잘 찾았다고 생각했는데, 막상 보면 단위나 연도가 어긋난 표였던 적이 여러 번입니다. 임베딩이 가깝다고 정답을 가르는 통계까지 가까운 건 아니었습니다. 그래서 임베딩으론 후보만 좁히고, 단위·연도·범위는 규칙으로 따로 확인합니다.",
            "도메인마다 컬럼이 다른 데이터라, 도메인별 테이블로 가면 새 도메인이 들어올 때마다 마이그레이션을 쳐야 했습니다. EAV로 풀고 나서야 테이블을 새로 정의하지 않고도 도메인을 늘릴 수 있었고, 범위가 계속 바뀌는 PoC에선 이 유연성이 성능보다 더 중요했습니다.",
            "숫자 비교를 LLM한테 시켰더니 hallucination이 끼는 걸 보고, 판정과 설명을 아예 나눴습니다. 단위·연도·오차율 같은 수치 판정은 verifier가 결정론적 코드로만 하고, 자연어 설명은 explainer에서 LLM이 맡습니다. 이렇게 경계를 그으니 판정이 훨씬 안정적이었습니다.",
            "재시도를 호출부마다 흩어놨더니 꼭 한 군데씩 빠졌습니다. llm_client.py 한 곳에 모으고 나선 그럴 일이 없어졌고, 어차피 일시적 429는 늘 생기니 한곳에서 흡수하는 게 맞았습니다.",
          ]}
        />
      </Section>

      <ProjectFooter currentSlug={SLUG} />
    </article>
  );
}
