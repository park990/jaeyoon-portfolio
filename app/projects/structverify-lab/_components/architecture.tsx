import { ArrowRight, ArrowDown } from "lucide-react";

// v2.0 2-Agent 아키텍처 + Runtime 13 Step.
// 상단: Agent B (사전학습) → Agent A (Runtime) → 피드백 루프
// 하단: Runtime Agent의 ReAct Step 압축 표현

// owner = 'mine': 본인 담당. 'teammate': 팀원 담당.
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
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          2-Agent + Feedback Loop
        </p>
        {/* 범례 */}
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm border border-primary/60 bg-primary/15" />
            본인
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm border border-amber-500/60 bg-amber-500/15" />
            팀원 담당
          </span>
        </div>
      </div>
      <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:gap-3">
        {agentFlow.map((s, i) => {
          const isMine = s.owner === "mine";
          const isTeam = s.owner === "teammate";
          return (
            <div
              key={s.en}
              className="flex flex-col items-center gap-2 lg:flex-1 lg:flex-row lg:gap-3"
            >
              <div
                className={
                  "w-full rounded-md border px-3 py-2 text-center lg:w-auto lg:flex-1 " +
                  (isMine
                    ? "border-primary/60 bg-primary/10 ring-1 ring-primary/20"
                    : isTeam
                    ? "border-amber-500/60 bg-amber-500/5"
                    : "border-border bg-background/40")
                }
              >
                <p
                  className={
                    "text-xs font-medium uppercase tracking-wider " +
                    (isMine
                      ? "text-primary"
                      : isTeam
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-muted-foreground")
                  }
                >
                  {s.en}
                  {isTeam && (
                    <span className="ml-1.5 font-normal normal-case tracking-normal">
                      (팀원)
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {s.ko}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.detail}</p>
              </div>
              {i < agentFlow.length - 1 && (
                <>
                  <ArrowDown className="h-4 w-4 self-center text-muted-foreground lg:hidden" />
                  <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground lg:block" />
                </>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs leading-[1.7] text-muted-foreground">
        <span className="text-foreground">Agent A(runtime_agent.py)</span>의
        ReAct 검증 파이프라인 통합은 본인 담당.{" "}
        <span className="text-foreground">Agent B(사전학습·피드백 학습)</span>
        는 팀원 담당이며, 본인이 만든 KOSIS 카탈로그가 사전학습의 입력으로
        연결됩니다.
      </p>
    </div>
  );
}

// 5개 데이터 레이어 — 사용자가 Phase 0에서 구성한 핵심 인프라.
const layers = [
  {
    name: "PostgreSQL + pgvector",
    role: "관계형 + 벡터",
    detail: "init_db.py 5 테이블 (requests/claims/truths/results/kosis_stat_catalog) + sv_platform alembic 4 테이블 (tenants/users/api_keys/jobs) = 총 9. HCX 임베딩 v2 1024차원.",
    mine: true,
  },
];

export function DataLayersDiagram() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Phase 0 · 데이터 레이어 (실제 호출 중인 저장소)
      </p>
      <div className="grid grid-cols-1 gap-3">
        {layers.map((l) => (
          <div
            key={l.name}
            className={
              "rounded-lg border bg-background/40 " +
              (l.mine
                ? "border-primary/50 ring-1 ring-primary/20"
                : "border-border")
            }
          >
            <div
              className={
                "border-b px-3 py-2 " +
                (l.mine
                  ? "border-primary/40 bg-primary/10"
                  : "border-border bg-background/60")
              }
            >
              <p
                className={
                  "font-mono text-xs font-semibold " +
                  (l.mine ? "text-primary" : "text-foreground")
                }
              >
                {l.name}
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                {l.role}
              </p>
            </div>
            <p className="px-3 py-2 text-xs leading-relaxed text-muted-foreground">
              {l.detail}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        init_db.py가 pgvector 확장 + 핵심 5 테이블을 만들고, 운영 플랫폼 계층은
        alembic으로 4 테이블 추가(총 9). 팀원은 git clone 후{" "}
        <span className="font-mono">docker-compose up -d</span> 한 줄로 동일 환경
        재현.
      </p>
    </div>
  );
}

// 박재윤이 담당한 모듈 — README todo(main) + v3 브랜치 작업 종합.
type ScopeRow = { area: string; module: string };
const scopeRows: ScopeRow[] = [
  {
    area: "인프라",
    module: "docker-compose(pgvector) · init_db.py 5 테이블 + sv_platform alembic 4 테이블 = 9",
  },
  {
    area: "데이터 적재 (PostgreSQL)",
    module:
      "storage/db_manager.py (psycopg2 · save_claims/save_results 배치 INSERT) + core/pipeline.py 적재 연동",
  },
  {
    area: "KOSIS 메타 크롤러",
    module:
      "adaptation/kosis_crawler.py (31 카테고리 · 배치 100 임베딩 · Semaphore(3))",
  },
  {
    area: "KOSIS 표 매칭 필터 4종",
    module:
      "retrieval/kosis_connector._is_table_relevant (국제기구 · 추계 · 해외지역 · 세부대상)",
  },
  {
    area: "LLM 클라이언트 429 backoff",
    module:
      "utils/llm_client._call_hcx_{v1,v3,structured} (exponential backoff 1→2→4s)",
  },
  {
    area: "Runtime 검증 병렬화",
    module:
      "agent/runtime_agent.py (asyncio.gather + Semaphore(3) — claim 8건 ~7분 → ~1/3)",
  },
  {
    area: "검증 판단 로직",
    module:
      "verification/verifier.py (단위명/연도/90%+ 오차 처리 · LLM 재판정 트리거)",
  },
  {
    area: "Cloud / CI/CD",
    module: "GitHub Actions · AWS EC2 (nginx reverse proxy + pm2)",
  },
];

export function WorkScopeTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <p className="border-b border-border bg-background/40 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Work Scope — 담당 모듈 ({scopeRows.length}개)
      </p>
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-background/40">
          <tr>
            <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              영역
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              주요 파일 · 모듈
            </th>
          </tr>
        </thead>
        <tbody>
          {scopeRows.map((r, i) => (
            <tr
              key={r.area}
              className={
                "bg-[var(--accent)]/5 " +
                (i < scopeRows.length - 1 ? "border-b border-border/60" : "")
              }
            >
              <td className="px-4 py-2.5 font-medium text-foreground">{r.area}</td>
              <td className="px-4 py-2.5 font-mono text-xs leading-relaxed text-foreground/80">
                {r.module}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
