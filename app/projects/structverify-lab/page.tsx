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
import { PipelineDiagram, EAVDiagram } from "./_components/architecture";
import { getProjectBySlug } from "@/lib/projects";

const SLUG = "structverify-lab";
const ACCENT = "#0EA5E9";
const REPO = "https://github.com/orgs/2026-StructVerify-Lab/repositories";

export const metadata: Metadata = {
  title: "StructVerify-Lab · Jaeyoon Park",
  description:
    "도메인 비의존적 수치 팩트체크 플랫폼 — LLM 추출 + Pydantic 검증 + PostgreSQL EAV + KOSIS 비교",
};

const techStack = [
  { category: "LLM Pipeline", items: ["Pydantic", "Trafilatura", "GPT-4o (Structured Output)"] },
  { category: "Database", items: ["PostgreSQL", "pgvector (Docker)", "EAV 스키마"] },
  { category: "Backend", items: ["Python", "psycopg2", "KOSIS API", "FastAPI"] },
  { category: "Infra", items: ["GitHub Actions CI/CD", "AWS EC2 (nginx + pm2)", "Docker"] },
];

const roles: Role[] = [
  {
    title: "아키텍처 & DB 스키마 설계",
    bullets: [
      "다단계 검증 파이프라인 흐름 설계",
      "EAV (Entity-Attribute-Value) + parent_path 4테이블 스키마 직접 설계",
      "claims 테이블에 is_approximate / modifier / time_reference 선행 추가 — 마이그레이션 비용 회피",
      "extraction_method 제거 결정 — 모든 추출이 LLM 기반이라 무의미",
      "기술 선택 근거: Snowflake vs pgvector 비교 후 PoC 단계 도입 비용 과다 판단해 pgvector 선택. Snowflake는 직접 운영 경험 없이 문서 검토 수준이었음을 명시.",
    ],
  },
  {
    title: "프롬프트 엔지니어링 (4개 LLM 모듈)",
    bullets: [
      "claim_detector.py — CHECK_WORTHY 판별 (공공기관 발표 수치, 부동산 positive 예시)",
      "schema_inductor.py — N만NNNN 복합단위 패턴, source_phrase 원문 보존 (8000 → 8천 변환 금지)",
      "explainer.py — MATCH/MISMATCH 판정 설명 생성, 수치 자체 생성 방지",
      "llm_client.py — Structured Output 호출 + 429 exponential backoff (최대 3회)",
    ],
  },
  {
    title: "데이터 적재 & KOSIS 연동",
    bullets: [
      "core/pipeline.py v2.1 — DBManager + save_claims / save_results 연동",
      "kosis_connector.py의 _is_table_relevant() — 영아 / UN / IMF 오매칭 필터",
      "KOSIS stat_catalog 262,783건 마이그레이션",
      "한국어 뉴스 2건 테스트 → 32건 claim 추출 및 DB 적재 성공",
    ],
  },
  {
    title: "인프라 & CI/CD",
    bullets: [
      "GitHub Actions CI/CD 파이프라인 (프론트 + 백엔드)",
      "AWS EC2 배포: nginx reverse proxy + pm2 프로세스 관리",
      "pgvector Docker 환경 셋업",
    ],
  },
  {
    title: "설계 근거 문서화 (참고 논문 4편)",
    bullets: [
      "FEVER (NAACL 2018) → match / mismatch / inconclusive 3단계 판정 체계 근거",
      "ClaimBuster (VLDB 2017) → 수치 포함 문장 필터링의 이론적 근거",
      "RAG (NeurIPS 2020) → KOSIS 외부 DB 검색 구조의 핵심 패러다임",
      "AutoSchemaKG → 도메인 비의존적 스키마 자동화의 해결 방향",
    ],
  },
];

const troubles: Trouble[] = [
  {
    title: "도메인별 스키마 불일치",
    problem: "뉴스·공학·재무 등 도메인마다 컬럼 구조가 완전히 다름",
    solve: "EAV + parent_path 계층 구조로 도메인별 테이블 없이 단일 테이블에 범용 저장",
    lesson: "스키마리스 설계의 유연성과 쿼리 복잡도 트레이드오프",
  },
  {
    title: "LLM 추출 시 단위 누락 문제",
    star: true,
    problem:
      '추출 결과 검토 중 "value: 245.9, unit: null" 같은 데이터 다수 발견. 단위가 없으면 비교 로직(245.9억 vs 245.9% 구분 불가) 자체가 붕괴.',
    solve:
      '프롬프트에 "단위는 반드시 채울 것 — 지수 / 배 / 위 등" 명시적 규칙 추가 + Pydantic ExtractResponse에서 unit을 Optional이 아닌 필수 str 필드로 강제',
    lesson:
      "프롬프트 규칙은 LLM이 가끔 무시하지만, Pydantic 스키마 검증을 결합하면 결정론적으로 강제 가능",
  },
  {
    title: "복합 한글 단위 추출",
    problem: '"3만5000원", "△2.3%p" 같은 한글 수치 표현을 정규식으로 파싱 불가',
    solve:
      "schema_inductor에 N만NNNN 복합단위 패턴 + 음수 한글 단위 패턴 추가, source_phrase 원문 보존 규칙",
    lesson: "LLM이 원문을 멋대로 변환하지 않도록 강제하는 것이 데이터 무결성에 핵심",
  },
];

const pydanticCode = `class Claim(BaseModel):
    parent_path: str
    attribute: str
    value: float
    unit: str  # "단위는 반드시 채울 것 — 지수/배/위 등"
    is_approximate: bool = False
    modifier: Optional[str] = None
    time_reference: Optional[str] = None


class ExtractResponse(BaseModel):
    claims: List[Claim]
`;

const sqlCode = `CREATE TABLE claims (
    claim_id        SERIAL PRIMARY KEY,
    request_id      INT REFERENCES requests(request_id),
    parent_path     VARCHAR(500),  -- e.g., "GDP/2024/Q3"
    attribute       VARCHAR(100),  -- e.g., "growth_rate"
    value           DECIMAL,
    unit            VARCHAR(50),
    is_approximate  BOOLEAN,
    modifier        VARCHAR(20),
    time_reference  VARCHAR(50)
);
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
        oneLiner="도메인 비의존적으로 문서 내 수치 주장을 자동 추출하고, KOSIS 통계 및 사용자 정답과 비교하여 판정을 자동화."
        period="2026.04 ~ 진행 중"
        team="4명 (멋쟁이사자)"
        links={[{ label: "GitHub", href: REPO }]}
      />

      <Section id="overview" title="Overview">
        <Prose>
          <p>
            뉴스 기사, 공학 스펙, 재무 데이터 등 도메인마다 컬럼 구조가 완전히
            다른 수치 주장을 단일 시스템에서 처리할 수 있는 범용 팩트체크
            플랫폼을 목표로 시작했습니다. LLM 기반 추출과 PostgreSQL EAV 스키마를
            결합해, 새 도메인이 들어와도 테이블을 추가하지 않고 적재 가능한
            구조를 설계했습니다.
          </p>
          <p>
            초기 단계라 데이터가 본인한테밖에 없어서, 파이프라인 전체를 단일
            test.py로 직접 구현해 동작하는 baseline을 만든 뒤, 그 결과를 시초로
            다른 팀원이 모듈화 / 리팩토링하는 방식으로 협업했습니다.
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
          <PipelineDiagram />
          <EAVDiagram />
        </div>
      </Section>

      <Section id="code" title="Code Highlights">
        <div className="space-y-5">
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              Pydantic 기반 Structured Output 스키마. unit을 필수 필드로 두어 LLM
              누락을 결정론적으로 차단.
            </p>
            <CodeBlock code={pydanticCode} lang="python" filename="schemas.py" />
          </div>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              EAV claims 테이블 정의. parent_path 계층으로 도메인별 테이블 없이
              범용 적재.
            </p>
            <CodeBlock code={sqlCode} lang="sql" filename="claims.sql" />
          </div>
        </div>
      </Section>

      <Section id="trouble" title="Trouble-shooting">
        <TroubleCards troubles={troubles} accent={ACCENT} />
      </Section>

      <Section id="results" title="Results">
        <ResultsGrid
          items={[
            "KOSIS stat_catalog 262,783건 적재 완료",
            "한국어 뉴스 2건 테스트 → 32건 claim 추출 + DB 적재 성공",
            "GitHub Actions CI/CD 자동화 (push 시 빌드/배포)",
            "pgvector Docker 환경 전환 완료",
          ]}
        />
      </Section>

      <Section id="lessons" title="Lessons Learned">
        <LessonsList
          items={[
            "초기 데이터가 한 명에게만 있을 때 단일 스크립트로 전체를 동작시켜 baseline을 만들고, 그 결과를 시초로 팀이 모듈화하는 흐름이 효과적이었습니다.",
            "LLM 출력의 신뢰성은 프롬프트만으로 보장되지 않으며, Pydantic 같은 스키마 검증을 결합해야 결정론적입니다.",
            "EAV 스키마는 유연성과 쿼리 복잡도의 트레이드오프가 있어, 사용 사례에 따라 신중히 선택해야 합니다.",
          ]}
        />
      </Section>

      <ProjectFooter currentSlug={SLUG} />
    </article>
  );
}
