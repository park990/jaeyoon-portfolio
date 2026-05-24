import type { Metadata } from "next";
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
  PhotoTodoBanner,
  PhotoPlaceholder,
} from "@/components/project-detail/photo";
import {
  AgentFlowDiagram,
  DataLayersDiagram,
} from "./_components/architecture";
import { getProjectBySlug } from "@/lib/projects";

const SLUG = "structverify-lab";
const ACCENT = "#0EA5E9";
const REPO = "https://github.com/orgs/2026-StructVerify-Lab/repositories";

export const metadata: Metadata = {
  title: "StructVerify-Lab v2.0 · Jaeyoon Park",
  description:
    "도메인 적응형 LLM 사실검증 플랫폼 — 2-Agent + Graph/JSON 하이브리드 + LoRA. 인프라·적재·KOSIS 커넥터·LLM 안정화·검증 파이프라인 광범위 담당.",
};

const techStack = [
  {
    category: "Infra",
    items: [
      "Docker Compose",
      "PostgreSQL 16 + pgvector",
      "Neo4j",
      "MinIO",
      "Elasticsearch",
      "Redis",
    ],
  },
  {
    category: "Backend",
    items: ["Python 3.13", "FastAPI", "asyncpg / psycopg2", "Pydantic v2"],
  },
  {
    category: "LLM / Agent",
    items: [
      "2-Agent (Runtime + Builder)",
      "ReAct + Planner/Loop",
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
    category: "Data Ingestion (담당)",
    items: [
      "KOSIS Open API",
      "NCP HCX 임베딩 v2 (1024차원)",
      "Self-Instruct seed 데이터 적재",
    ],
  },
  {
    category: "Cloud / CI",
    items: ["AWS EC2 (nginx + pm2)", "GitHub Actions"],
  },
];

const roles: Role[] = [
  {
    title: "인프라 · 5개 서비스 단일 docker-compose",
    bullets: [
      "PostgreSQL 16 + pgvector / Neo4j / MinIO / Elasticsearch / Redis 5개 컨테이너를 단일 compose로 묶어 팀원이 git clone 후 한 줄(`make dev`)로 동일 환경 재현",
      "Makefile 타깃 정비 (make health 5개 서비스 헬스체크 / make psql DB 접속 / make neo4j-init 인덱스 초기화)",
      "init_db.sql 직접 작성 — pgvector 확장 + 13 테이블(documents, claims, verification_results, execution_runs, artifacts, graph_nodes/edges, kosis_stat_catalog, kosis_data_cache, feedback_events, training_jobs, model_versions, domain_packs) 자동 생성",
    ],
  },
  {
    title: "데이터 적재 — storage / 어댑터 4종",
    bullets: [
      "db_manager.py — PostgreSQL psycopg2 연결, save_claims/save_results 배치 INSERT, save_document/save_feedback 진행",
      "dwh_manager.py — Snowflake 적재 어댑터 (피드백 이벤트 DWH 동기화)",
      "raw_storage.py — MinIO 원본 PDF/DOCX/URL 본문 업로드",
      "graph_store.py — Neo4j MERGE 시 일괄 처리용 클라이언트 (graph_builder가 만든 노드/엣지 배치 적재)",
      "core/pipeline.py에 DBManager 초기화·Claims/Results 적재 연동 + 기사 텍스트 해시로 doc_id 고정 (재실행 중복 방지)",
    ],
  },
  {
    title: "KOSIS 통계 메타 크롤러 + 카탈로그 검색",
    bullets: [
      "adaptation/kosis_crawler.py — 주제별 통계(MT_ZTITLE) 27개 카테고리(A~U + H1/H2, I1/I2 등 세분화) 전체 메타 수집",
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
    title: "설계 근거 — 참고 논문 4편",
    bullets: [
      "FEVER (NAACL 2018) → match / mismatch / unverifiable 3단계 판정 체계",
      "ClaimBuster (VLDB 2017) → check-worthiness 이론적 근거",
      "RAG (NeurIPS 2020) → KOSIS 외부 DB 조회의 패러다임",
      "AutoSchemaKG (arXiv 2505.23628) → 도메인 비의존적 동적 스키마 유도",
    ],
  },
];

const troubles: Trouble[] = [
  {
    title: "KOSIS API rate limit + 임베딩 비용 폭주",
    star: true,
    problem:
      "27개 카테고리에 대해 메타를 수집하면 통계표가 수십만 건. 한 건씩 임베딩하면 NCP 임베딩 API 비용 폭증 + KOSIS API rate limit 위반. 초기엔 단순 for 루프로 돌렸다가 차단 직전까지 감.",
    solve:
      "(1) NCP HCX 임베딩 v2 배치 100건 단위로 묶어 호출 횟수 1/100로 절감, (2) KOSIS API에 asyncio.Semaphore(3)로 동시 호출 3개 제한 + 재시도 백오프. 메타 수집 + 임베딩 INSERT를 한 파이프라인에 묶어 ETL 중간 산출물 관리 부담 제거.",
    lesson:
      "외부 API 비용/제한은 코드가 아니라 호출 패턴 설계에서 결정된다. 배치 + 동시성 제어 + 재시도 3종 세트를 처음부터 박아두는 게 사후 수정보다 훨씬 싸다.",
  },
  {
    title: "KOSIS 통계표 매칭 오류 — '전체 사망자'에 '영아 사망률'이 잡힘",
    star: true,
    problem:
      "claim의 키워드를 KOSIS 카탈로그에서 벡터 + 키워드로 검색하면 의미상 가까운 표가 잘 잡히지만, 실제로는 검증 대상이 아닌 표가 다수 섞임. UN/IMF 같은 국제기구 데이터, '장래 추계', 해외 지역명, 영아·신생아 같은 세부 대상 테이블이 검증을 망침.",
    solve:
      "kosis_connector._is_table_relevant()에 4종 필터 추가 — _INTERNATIONAL_MARKERS / _FORECAST_TABLE_MARKERS / _REGION_MARKERS / _SPECIFIC_SCOPE_MARKERS. 표 이름이 이 마커에 걸리면 후속 검증에서 배제. 임베딩 검색의 한계를 도메인 규칙으로 보강.",
    lesson:
      "임베딩 유사도가 의미 일치를 보장하지 않는다. 검색 결과가 도메인적으로 타당한지는 별도의 결정론적 필터로 잡아야 한다.",
  },
  {
    title: "claim 8건 직렬 ~7분 — 사용자 체감 한계 초과",
    star: true,
    problem:
      "Runtime agent가 claim별로 ReAct 루프(검색 → 검증 → 설명)를 도는 구조라 1건당 14~40초. 한 기사에 claim이 8건이면 직렬 처리 시 ~7분. 사용자 입장에선 결과가 안 나오는 것처럼 보임.",
    solve:
      "claim끼리 독립적이라는 점을 이용해 runtime_agent에서 asyncio.gather + Semaphore(3)로 병렬화. 외부 API rate limit과 LLM 비용을 동시에 고려해 3개 동시까지 제한. 직렬 ~7분이 ~1/3로 단축.",
    lesson:
      "병렬화의 정답은 '얼마나 많이' 가 아니라 '얼마까지가 외부 의존성이 허용하는가'. 동시 한도를 외부 시스템 기준으로 잡는 게 핵심.",
  },
  {
    title: "HCX 429 rate limit으로 schema_inductor가 자주 실패",
    problem:
      "schema_inductor.generate_structured() 같은 무거운 LLM 호출이 동시에 몰리면 HCX-V1/V3/structured 모두 429를 자주 받음. 한 번 실패하면 그 claim 전체가 unverifiable로 떨어져 정확도가 깎임.",
    solve:
      "utils/llm_client.py의 세 경로(_call_hcx_v1, _call_hcx_v3, _call_hcx_structured) 모두에 동일한 exponential backoff retry(1초→2초→4초, 최대 3회) 적용. 일시적 429는 자체 재시도로 흡수.",
    lesson:
      "외부 LLM API는 일시적 429를 항상 가정해야 한다. 재시도 로직을 호출부마다 흩어두지 말고 클라이언트 레이어에서 통일하는 게 유지보수가 쉽다.",
  },
];

const composeCode = `# docker-compose.yml + Makefile — 5개 서비스 단일 파일 통합
services:
  db:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_USER: structverify
      POSTGRES_PASSWORD: svpass123
      POSTGRES_DB: structverify
    ports: ["5432:5432"]
    volumes:
      - ./infra/init_db.sql:/docker-entrypoint-initdb.d/init.sql  # 13 테이블 자동 생성

  redis:    { image: redis:7-alpine,         ports: ["6379:6379"] }
  neo4j:    { image: neo4j:5.13,             ports: ["7474:7474", "7687:7687"] }
  minio:    { image: minio/minio,            ports: ["9000:9000", "9001:9001"] }
  elastic:  { image: elasticsearch:8.11,     ports: ["9200:9200"] }

# Makefile
# make dev        → 5개 서비스 한 줄 기동
# make health     → 5개 서비스 헬스체크
# make psql       → PostgreSQL 접속
# make neo4j-init → 그래프 인덱스 초기화
`;

const crawlerCode = `# adaptation/kosis_crawler.py — KOSIS 메타 27 카테고리 + 배치 임베딩

KOSIS_TOP_CATEGORIES = [
    {"vw_cd": "MT_ZTITLE", "parent_id": "A"},   # 인구/가구
    {"vw_cd": "MT_ZTITLE", "parent_id": "B"},   # 고용/노동/임금
    # ... (총 27개, H1·H2, I1·I2 등 세분화 ID 포함)
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

export default function StructVerifyPage() {
  const project = getProjectBySlug(SLUG)!;

  return (
    <article
      className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:pt-16"
      style={{ "--accent": ACCENT } as React.CSSProperties}
    >
      <PhotoTodoBanner count={2} />

      <ProjectHeader
        project={project}
        oneLiner="도메인 적응형 LLM 사실검증 플랫폼 v2.0. 5개 서비스 단일 docker-compose · 13 테이블 init_db · KOSIS 27 카테고리 크롤러 · 표 매칭 필터 4종 · LLM 429 백오프 · runtime 병렬화 · 검증 로직 통합까지 광범위하게 담당."
        period="2026.04 ~ 진행 중"
        team="4명 (멋쟁이사자)"
        links={[{ label: "GitHub", href: REPO }]}
      />

      <Section id="overview" title="Overview">
        <Prose>
          <p>
            비정형 텍스트(뉴스·보고서·문서)에서 수치 기반 주장을 자동으로 추출하고,
            KOSIS Open API 등 공식 통계 데이터와 비교해 사실 여부를 검증하는 LLM
            기반 플랫폼입니다. v2.0에서 <span className="font-medium text-foreground">
            2-Agent 아키텍처</span> + <span className="font-medium text-foreground">
            Graph/JSON 하이브리드 저장</span> + <span className="font-medium text-foreground">
            도메인 적응형 LoRA 학습 루프</span>로 재설계되어, 뉴스는 실험 도메인일
            뿐 시스템 자체는 자기 적응형 범용 검증 플랫폼을 지향합니다.
          </p>
          <p>
            4명 팀에서 인프라·데이터 적재부터 KOSIS 커넥터의 도메인 필터, LLM
            클라이언트 안정화, runtime 검증 파이프라인 병렬화·통합까지 가로축으로
            넓게 담당했습니다. 인프라 단독 + 검증 흐름의 안정성/정확도 보정이라는
            두 축이 동시에 진행됐습니다.
          </p>
        </Prose>
      </Section>

      <Section id="stack" title="Tech Stack">
        <TechStackGrid groups={techStack} />
      </Section>

      <Section id="role" title="My Role">
        <MyRoleCards roles={roles} accent={ACCENT} />
      </Section>

      <Section id="architecture" title="Architecture">
        <div className="space-y-5">
          <AgentFlowDiagram />
          <DataLayersDiagram />
          <PhotoPlaceholder
            n={1}
            caption="(선택) 직접 그린 v2.0 시스템 아키텍처 다이어그램 또는 PostgreSQL 13 테이블 ERD 캡처. 위 다이어그램이 박스 기반이라, 면접관에게 '실제 시스템 한 장' 느낌을 더 주려면 손으로 그린 그림 1장이 좋음. 없으면 건너뛰어도 OK."
          />
        </div>
      </Section>

      <Section id="code" title="Code Highlights">
        <div className="space-y-5">
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              5개 서비스 단일 docker-compose + Makefile — `make dev` 한 줄로 동일
              환경 재현.
            </p>
            <CodeBlock
              code={composeCode}
              lang="yaml"
              filename="docker-compose.yml + Makefile"
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
        <ResultsGrid
          items={[
            "KOSIS stat_catalog 262,783건 적재 + 1024차원 임베딩 INSERT 완료",
            "5개 서비스 단일 docker-compose — `make dev` 한 줄 환경 재현",
            "init_db.sql 13 테이블 + pgvector 확장 자동 생성",
            "KOSIS 표 매칭 4종 필터로 영아·UN·IMF·장래추계 오매칭 차단",
            "runtime 병렬화로 claim 8건 직렬 ~7분 → ~1/3 단축",
            "HCX 429 exponential backoff로 schema_inductor 실패 자체 흡수",
            "GitHub Actions CI/CD + AWS EC2 (nginx + pm2) 배포",
          ]}
        />
        <div className="mt-5">
          <PhotoPlaceholder
            n={2}
            caption="실제 운영 증거 1장 — `make health` 5개 서비스 OK / `kosis_stat_catalog` 262,783건 SELECT / claim 병렬 처리 로그 / GitHub Actions 빌드 성공 중 1장. 숫자 카드보다 '실제로 돌아가는 시스템' 한 장이 신뢰감 큼."
          />
        </div>
      </Section>

      <Section id="lessons" title="Lessons Learned">
        <LessonsList
          items={[
            "외부 API 비용/제한은 코드 품질이 아니라 호출 패턴(배치 + 동시성 + 재시도)에서 결정된다. 처음부터 박아두는 게 사후 수정보다 훨씬 싸다.",
            "임베딩 유사도는 의미 일치를 보장하지 않는다. 검색 결과가 도메인적으로 타당한지는 별도의 결정론적 필터로 잡아야 한다.",
            "병렬화의 정답은 '얼마나 많이'가 아니라 '외부 의존성이 허용하는 동시 한도'. 외부 시스템 기준으로 잡으면 안정성과 속도가 같이 산다.",
            "재시도 로직은 호출부마다 흩어두지 말고 클라이언트 레이어에 통일해야 한다 — 외부 LLM API의 일시적 429는 항상 가정.",
            "팀 onboarding은 인프라 자동화 문제. '한 줄 명령으로 동일 환경 재현' 가능한가가 기준선.",
          ]}
        />
      </Section>

      <ProjectFooter currentSlug={SLUG} />
    </article>
  );
}
