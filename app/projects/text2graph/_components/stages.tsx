// 4-Stage Incremental Stacking 다이어그램.
// Stage 2가 박재윤 담당 ⭐.

const stages = [
  {
    n: "1",
    name: "Baseline",
    detail: "BERT + Mean Pooling",
  },
  {
    n: "2",
    name: "ATLOP + DREEAM",
    detail: "LogSumExp + Adaptive Threshold + Evidence Head",
    mine: true,
  },
  {
    n: "3",
    name: "GAIN",
    detail: "+ GCN 그래프 추론",
  },
  {
    n: "4",
    name: "U-Net",
    detail: "+ Graph U-Net 그래프 추론",
  },
];

export function StagesDiagram() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        4-Stage Incremental Stacking
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stages.map((s) => (
          <div
            key={s.n}
            className={
              "rounded-lg border bg-background/40 p-4 " +
              (s.mine
                ? "border-[var(--accent)]/50 ring-1 ring-[var(--accent)]/20"
                : "border-border")
            }
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className={
                  "inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold " +
                  (s.mine
                    ? "border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "border-border bg-secondary text-muted-foreground")
                }
              >
                {s.n}
              </span>
              {s.mine && (
                <span className="text-xs font-medium text-[var(--accent)]">
                  담당 ⭐
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-foreground">{s.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {s.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// V1/V2 Results 비교 표
type Row = { metric: string; v1: string; v2: string };
const rows: Row[] = [
  { metric: "Micro F1", v1: "60.71%", v2: "59.25%" },
  { metric: "Precision", v1: "65.34%", v2: "63.11%" },
  { metric: "Recall", v1: "56.70%", v2: "55.83%" },
];

export function MetricsTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-background/40">
          <tr>
            <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Metric
            </th>
            <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
              V1
              <span className="ml-1 font-normal normal-case text-muted-foreground/70">
                (best_model_f1_56_64)
              </span>
            </th>
            <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
              V2
              <span className="ml-1 font-normal normal-case text-muted-foreground/70">
                (best_model_V2)
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.metric}
              className={i < rows.length - 1 ? "border-b border-border/60" : ""}
            >
              <td className="px-4 py-2.5 font-medium text-foreground">{r.metric}</td>
              <td className="px-4 py-2.5 text-right font-mono text-foreground/85">
                {r.v1}
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-foreground/85">
                {r.v2}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
