import { ArrowRight, ArrowDown } from "lucide-react";

// 파이프라인 6단계 박스 흐름. 가로(데스크탑) ↔ 세로(모바일) 자동 전환.
const pipeline = [
  "입력",
  "LLM 추출",
  "Pydantic 검증",
  "PostgreSQL 적재",
  "KOSIS 비교",
  "판정",
];

export function PipelineDiagram() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Pipeline
      </p>
      <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:flex-wrap lg:gap-3">
        {pipeline.map((step, i) => (
          <div key={step} className="flex flex-col items-center gap-2 lg:flex-row lg:gap-3">
            <div className="w-full rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-center text-sm font-medium text-primary lg:w-auto lg:min-w-[7rem]">
              {step}
            </div>
            {i < pipeline.length - 1 && (
              <>
                <ArrowDown
                  className="h-4 w-4 self-center text-muted-foreground lg:hidden"
                  aria-hidden="true"
                />
                <ArrowRight
                  className="hidden h-4 w-4 shrink-0 text-muted-foreground lg:block"
                  aria-hidden="true"
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// EAV 4테이블 ERD 박스. 핵심 컬럼만 노출.
const eav = [
  { name: "requests", cols: ["request_id (PK)", "url", "title", "created_at"] },
  {
    name: "claims",
    cols: [
      "claim_id (PK)",
      "request_id (FK)",
      "parent_path",
      "attribute",
      "value",
      "unit",
      "is_approximate",
      "modifier",
      "time_reference",
    ],
    highlight: true,
  },
  { name: "truths", cols: ["truth_id (PK)", "source", "value", "unit", "time_reference"] },
  { name: "results", cols: ["result_id (PK)", "claim_id (FK)", "truth_id (FK)", "verdict", "explanation"] },
];

export function EAVDiagram() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        EAV Schema · 4 tables
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {eav.map((t) => (
          <div
            key={t.name}
            className={
              "rounded-lg border bg-background/40 " +
              (t.highlight ? "border-primary/50 ring-1 ring-primary/20" : "border-border")
            }
          >
            <div
              className={
                "border-b px-3 py-2 font-mono text-xs font-semibold " +
                (t.highlight
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-background/60 text-foreground")
              }
            >
              {t.name}
            </div>
            <ul className="px-3 py-2 font-mono text-xs text-muted-foreground">
              {t.cols.map((c) => (
                <li key={c} className="py-0.5">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        claims 테이블이 핵심. parent_path 계층으로 도메인 비의존적 적재.
      </p>
    </div>
  );
}
