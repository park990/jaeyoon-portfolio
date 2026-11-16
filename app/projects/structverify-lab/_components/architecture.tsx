import { Ev } from "@/components/case/evidence";

// v2.0 2-Agent 아키텍처 + 데이터 레이어 + 담당 모듈 표.
// 시각 규칙: 무채색. 담당 여부는 색이 아니라 굵은 테두리 + 글자("내 담당"/"팀원")로 구분.

// owner = 'mine': 내 담당. 'teammate': 팀원 담당.
type AgentBox = {
  en: string;
  ko: string;
  detail: string;
  owner?: "mine" | "teammate";
};
const agentFlow: AgentBox[] = [
  {
    en: "Agent B",
    ko: "사전학습",
    detail: "KOSIS 메타 + Self-Instruct → LoRA",
    owner: "teammate",
  },
  {
    en: "Agent A",
    ko: "Runtime",
    detail: "ReAct: 검증 파이프라인 통합",
    owner: "mine",
  },
  {
    en: "Human Review",
    ko: "검토",
    detail: "verdict 보정",
  },
  {
    en: "Feedback Loop",
    ko: "재학습",
    detail: "누적 → LoRA 추가 학습",
    owner: "teammate",
  },
];

export function AgentFlowDiagram() {
  return (
    <figure>
      <p className="mb-3 text-[13px] font-medium text-muted-foreground">2-Agent + Feedback Loop</p>
      <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
        {agentFlow.map((s, i) => {
          const isMine = s.owner === "mine";
          const isTeam = s.owner === "teammate";
          return (
            <li key={s.en} className="flex flex-col items-stretch sm:flex-1 sm:flex-row sm:items-center">
              <div
                className={
                  "flex-1 rounded-sm px-3 py-2 " +
                  (isMine
                    ? "border-2 border-border-strong"
                    : isTeam
                      ? "border border-dashed border-muted-foreground"
                      : "border border-border")
                }
              >
                <p className="text-[12px] font-medium text-muted-foreground">
                  {s.en}
                  {isMine && <span className="ml-1.5 text-foreground">· 내 담당</span>}
                  {isTeam && <span className="ml-1.5">(팀원)</span>}
                </p>
                <p className="mt-0.5 text-[15px] font-semibold text-foreground">{s.ko}</p>
                <p className="mt-0.5 text-[13px] leading-[1.5] text-muted-foreground">{s.detail}</p>
              </div>
              {i < agentFlow.length - 1 && (
                <span aria-hidden="true" className="self-center px-1.5 py-0.5 text-muted-foreground">
                  <span className="sm:hidden">↓</span>
                  <span className="hidden sm:inline">→</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <figcaption className="mt-3 text-[14px] leading-[1.7] text-muted-foreground">
        <span className="text-foreground">Agent A(runtime_agent.py)</span>의
        ReAct 검증 파이프라인 통합은 내 담당.{" "}
        <span className="text-foreground">Agent B(사전학습·피드백 학습)</span>
        는 팀원 담당이며, 제가 만든 KOSIS 카탈로그가 사전학습의 입력으로
        연결됩니다.
      </figcaption>
    </figure>
  );
}

// 5개 데이터 레이어 — 사용자가 Phase 0에서 구성한 핵심 인프라.
const layers = [
  {
    name: "PostgreSQL + pgvector",
    role: "관계형 + 벡터",
    detail: "init_db.py 5 테이블 (requests/claims/truths/results/kosis_stat_catalog) + sv_platform alembic 4 테이블 (tenants/users/api_keys/jobs) = 총 9. HCX 임베딩 v2 1024차원.",
    ev: ["tables", "tablesAlembic", "dim"],
    mine: true,
  },
];

export function DataLayersDiagram() {
  return (
    <figure>
      <p className="mb-3 text-[13px] font-medium text-muted-foreground">
        Phase 0 · 데이터 레이어 (실제 호출 중인 저장소)
      </p>
      {layers.map((l) => (
        <div key={l.name} className={"rounded-sm " + (l.mine ? "border-2 border-border-strong" : "border border-border")}>
          <div className="border-b border-border px-3 py-2">
            <p className="font-num text-[13px] font-medium text-foreground">
              {l.name}
              {l.mine && <span className="ml-2 font-sans text-[12px] text-muted-foreground">내 담당</span>}
            </p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">{l.role}</p>
          </div>
          <p className="px-3 py-2 text-[14px] leading-[1.6] text-foreground">
            {l.detail}
            <Ev ids={l.ev} />
          </p>
        </div>
      ))}
      <figcaption className="mt-3 text-[14px] leading-[1.7] text-muted-foreground">
        init_db.py가 pgvector 확장 + 핵심 5 테이블을 만들고, 운영 플랫폼 계층은
        alembic으로 4 테이블 추가(총 9). 팀원은 git clone 후{" "}
        <span className="font-mono">docker-compose up -d</span> 한 줄로 동일 환경
        재현.
        <Ev ids={["tables", "tablesAlembic"]} />
      </figcaption>
    </figure>
  );
}

// 박재윤이 담당한 모듈 — README todo(main) + v3 브랜치 작업 종합.
type ScopeRow = { area: string; module: string; ev?: string[] };
const scopeRows: ScopeRow[] = [
  {
    area: "인프라",
    module: "docker-compose(pgvector) · init_db.py 5 테이블 + sv_platform alembic 4 테이블 = 9",
    ev: ["tables", "tablesAlembic"],
  },
  {
    area: "데이터 적재 (PostgreSQL)",
    module:
      "storage/db_manager.py (psycopg2 · save_claims/save_results 배치 INSERT) + core/pipeline.py 적재 연동",
  },
  {
    area: "KOSIS 메타 크롤러",
    // [1단계 A-4] "배치 100 임베딩" → 시기 구분 (OpenAI 배치 → HCX 건별 + Semaphore(3))
    module:
      "adaptation/kosis_crawler.py (31 카테고리 · 100건 단위 적재 · 임베딩: OpenAI 배치 → HCX v2 건별 호출 + Semaphore(3))",
    ev: ["categories", "embedOpenAI", "embedHcx"],
  },
  {
    area: "KOSIS 표 매칭 필터 4종",
    module:
      "retrieval/kosis_connector._is_table_relevant (국제기구 · 추계 · 해외지역 · 세부대상)",
    ev: ["filterIntl", "filterForecast", "filterRegion"],
  },
  {
    area: "LLM 클라이언트 429 backoff",
    // [1단계 A-4] "1→2→4s" → 3회 시도 · 1→2s 대기
    module:
      "utils/llm_client._call_hcx_{v1,v3,structured} (exponential backoff: 최대 3회 시도 · 1→2s 대기)",
    ev: ["backoff", "backoffStructured"],
  },
  {
    area: "Runtime 검증 병렬화",
    module:
      "agent/runtime_agent.py (asyncio.gather + Semaphore(3) — claim 8건 ~7분 → ~1/3)",
    ev: ["parallel", "parallelEst"],
  },
  {
    area: "검증 판단 로직",
    module:
      "verification/verifier.py (단위명/연도/90%+ 오차 처리 · LLM 재판정 트리거)",
    ev: ["year", "over90"],
  },
  {
    area: "Cloud / CI/CD",
    module: "GitHub Actions · AWS EC2 (nginx reverse proxy + pm2)",
  },
];

export function WorkScopeTable() {
  return (
    <table className="w-full border-collapse text-left">
      <caption className="pb-2 text-left text-[13px] font-medium text-muted-foreground">
        Work Scope — 담당 모듈 ({scopeRows.length}개)
      </caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">영역</th>
          <th scope="col">주요 파일 · 모듈</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border border-y border-border">
        {scopeRows.map((r) => (
          <tr key={r.area} className="grid grid-cols-1 py-2.5 sm:table-row sm:py-0">
            <th scope="row" className="pr-4 align-top text-[15px] font-medium text-foreground sm:w-[11rem] sm:py-2.5">
              {r.area}
            </th>
            <td className="align-top font-mono text-[13px] leading-[1.6] text-foreground sm:py-2.5">
              {r.module}
              {r.ev && <Ev ids={r.ev} />}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
