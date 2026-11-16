// ASME 공정 기호 (산업공학 공정도 표준 기호 중 4종).
//  storage    ▽ 저장 — 여기서는 "입력(투입 자재)"
//  operation  ○ 가공 — "처리"
//  inspection □ 검사 — "검사"
//  transport  ⇨ 운반 — "출력(출하)"
export type ProcKind = "storage" | "operation" | "inspection" | "transport";

export const PROC_META: Record<
  ProcKind,
  { no: string; name: string; asme: string; id: string }
> = {
  storage: { no: "01", name: "입력", asme: "저장", id: "b-in" },
  operation: { no: "02", name: "처리", asme: "가공", id: "b-op" },
  inspection: { no: "03", name: "검사", asme: "검사", id: "b-qc" },
  transport: { no: "04", name: "출력", asme: "운반", id: "b-out" },
};

export const PROC_ORDER: ProcKind[] = ["storage", "operation", "inspection", "transport"];

export function ProcSymbol({
  kind,
  size = 22,
  filled = false,
  className,
}: {
  kind: ProcKind;
  size?: number;
  filled?: boolean;
  className?: string;
}) {
  const common = {
    fill: filled ? "currentColor" : "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinejoin: "miter" as const,
    vectorEffect: "non-scaling-stroke" as const,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      {kind === "storage" && <path d="M3 4.5h18L12 20.5z" {...common} />}
      {kind === "operation" && <circle cx="12" cy="12" r="9" {...common} />}
      {kind === "inspection" && <rect x="3.5" y="3.5" width="17" height="17" {...common} />}
      {kind === "transport" && (
        <path d="M2.5 8.5h11V4l8 8-8 8v-4.5h-11z" {...common} />
      )}
    </svg>
  );
}
