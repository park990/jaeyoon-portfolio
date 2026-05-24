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
    title: "인프라 · docker-compose 환경 통합",
    bullets: [
      "PostgreSQL 16 + pgvector를 메인으로, 향후 확장용 4종(Redis · Neo4j · MinIO · Elasticsearch)을 함께 docker-compose에 묶어 팀원이 git clone 후 한 줄(`make dev`)로 동일 환경 재현",
      "Makefile 타깃 정비 (`make health` 헬스체크 / `make psql` DB 접속 / `make neo4j-init` 인덱스 초기화)",
      "init_db.sql 직접 작성 — pgvector 확장 + 13 테이블(documents, claims, verification_results, execution_runs, artifacts, graph_nodes/edges, kosis_stat_catalog, kosis_data_cache, feedback_events, training_jobs, model_versions, domain_packs) 자동 생성",
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
    title: "KOSIS API rate limit + 임베딩 호출 폭증",
    star: true,
    problem:
      "27개 카테고리에 대해 메타를 수집하면 통계표가 수십만 건. 한 건씩 임베딩하면 NCP HCX 임베딩 API 호출 횟수 폭증 + KOSIS API rate limit 위반. 초기엔 단순 for 루프로 돌렸다가 KOSIS 차단 직전까지 감.",
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
      "코사인 0.85 이상이 나온 KOSIS 통계인데 막상 도메인적으로 보면 전혀 다른 지표인 경우를 몇 번 마주치고 나서야, 임베딩 점수만으로 ‘맞는 통계’를 고른다는 가정이 잘못이라는 걸 인정했습니다. 그 뒤로는 임베딩으로 후보를 좁힌 다음 단위·연도·범위 같은 결정론적 조건으로 한 번 더 거르는 패턴을 기본 구조로 두게 됐습니다.",
  },
  {
    title: "claim 8건 직렬 ~7분 — 사용자 체감 한계 초과",
    star: true,
    problem:
      "Runtime agent가 claim별로 ReAct 루프(검색 → 검증 → 설명)를 도는 구조라 1건당 14~40초. 한 기사에 claim이 8건이면 직렬 처리 시 ~7분. 사용자 입장에선 결과가 안 나오는 것처럼 보임.",
    solve:
      "claim끼리 독립적이라는 점을 이용해 runtime_agent에서 asyncio.gather + Semaphore(3)로 병렬화. 외부 API rate limit과 LLM 비용을 동시에 고려해 3개 동시까지 제한. 직렬 ~7분이 ~1/3로 단축.",
    lesson:
      "claim 처리를 빨리 끝내고 싶어 동시 호출 수를 키웠다가 오히려 429로 전체가 더 느려진 적이 있었습니다. 그 이후로는 동시 한도를 ‘내가 보내고 싶은 양’이 아니라 ‘외부 API가 받아주는 양’에 맞추는 게 결국 가장 빠른 길이라는 걸 받아들이게 됐고, runtime 병렬화를 설계할 때 가장 먼저 외부 한도부터 확인하는 습관이 생겼습니다.",
  },
  {
    title: "HCX 429 rate limit으로 schema_inductor가 자주 실패",
    problem:
      "schema_inductor.generate_structured() 같은 무거운 LLM 호출이 동시에 몰리면 HCX-V1/V3/structured 모두 429를 자주 받음. 한 번 실패하면 그 claim 전체가 unverifiable로 떨어져 정확도가 깎임.",
    solve:
      "utils/llm_client.py의 세 경로(_call_hcx_v1, _call_hcx_v3, _call_hcx_structured) 모두에 동일한 exponential backoff retry(1초→2초→4초, 최대 3회) 적용. 일시적 429는 자체 재시도로 흡수.",
    lesson:
      "schema_inductor가 429로 자주 떨어질 때 처음엔 호출부마다 try/except를 박았는데, 같은 패턴이 반복되면서 한 군데가 빠지면 무방비로 실패하는 구조였습니다. 호출부를 다 뒤지는 것보다 utils/llm_client.py 한 곳에 재시도를 통일하는 편이 결과적으로 훨씬 안정적이고 손대기 쉬웠고, 외부 LLM API는 일시적 429를 ‘항상 있을 일’로 두고 시작하는 게 맞다고 보게 됐습니다.",
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
      <ProjectHeader
        project={project}
        oneLiner="도메인 적응형 LLM 사실검증 플랫폼 v2.0. 데이터·검증 흐름 8개 모듈 담당 — docker-compose 환경 + PostgreSQL 13 테이블 init_db · KOSIS 27 카테고리 메타 262,783건 적재 · 표 매칭 필터 4종 · LLM 429 exponential backoff · runtime 병렬화 ~7분→~1/3 · 검증 판단 로직(verifier)."
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
            도메인 적응 학습 루프</span>로 재설계되어, 뉴스는 실험 도메인일
            뿐 시스템 자체는 자기 적응형 범용 검증 플랫폼을 지향합니다.
          </p>
          <p>
            4명 팀에서 인프라·데이터 적재부터 KOSIS 메타 수집·표 매칭 필터,
            LLM 클라이언트 안정화, runtime 검증 파이프라인 병렬화, 검증 판단
            로직(verifier)까지 데이터·검증 흐름의 8개 모듈을 담당했습니다.
            아래 Work Scope 표가 다룬 모듈 목록입니다.
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
              docker-compose + Makefile — <span className="font-mono">make dev</span> 한
              줄로 동일 환경 재현. PostgreSQL이 실제 호출 중인 메인 저장소이고,
              나머지 컨테이너(Redis/Neo4j/MinIO/Elasticsearch)는 향후 확장용으로
              함께 띄움.
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
            "docker-compose + Makefile — `make dev` 한 줄로 PostgreSQL 환경 재현",
            "init_db.sql 13 테이블 + pgvector 확장 자동 생성",
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
            "동기 루프로 KOSIS·HCX를 두드리다 KOSIS 429와 HCX 동시 호출 한도 경고를 동시에 받은 한 번이, 새 외부 API를 붙일 때 배치·세마포어·재시도 자리부터 비워두고 시작하는 습관을 만들었다.",
            "코사인 0.85가 나왔는데 단위·연도가 어긋난 통계를 몇 번 마주치고 나서야, 임베딩 후보 위에 결정론적 조건을 한 층 더 두는 게 기본 구조가 됐다.",
            "동시 호출 수를 키웠다가 오히려 429로 전체가 더 느려진 경험 한 번이, 병렬화 한도를 외부 API가 받아주는 양에 맞추는 편이 결국 가장 빠른 길이라는 걸 정직하게 인정하게 만들었다.",
            "호출부마다 try/except가 흩어진 코드를 한 번 정리해보고 나니, 재시도는 utils/llm_client.py 한 곳에 모아두는 편이 손대기도 쉽고 빠뜨리는 일도 없다는 걸 알게 됐다.",
            "팀원마다 Redis 포트·Java 버전이 달라 한참을 같이 디버깅한 뒤에야, onboarding이 친절한 README가 아니라 ‘docker compose up 한 줄’ 같은 자동화로 풀어야 하는 문제라는 걸 받아들였다.",
          ]}
        />
      </Section>

      <ProjectFooter currentSlug={SLUG} />
    </article>
  );
}
