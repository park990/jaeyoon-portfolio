import { FlowFigure } from "@/components/case/case-parts";
import { Ev } from "@/components/case/evidence";
import { NumText } from "@/components/num-text";
import { T2G_SCORES, getProjectBySlug } from "@/lib/projects";

// 4-Stage Incremental Stacking — Stage 2가 박재윤 담당. 단계 데이터는 lib/projects.ts(flow).
export function StagesDiagram({ dense = false }: { dense?: boolean }) {
  const p = getProjectBySlug("text2graph")!;
  return <FlowFigure dense={dense} steps={p.flow!} caption={p.flowCaption} />;
}

// Stage 1 → Stage 2 핵심 변경 5축. ATLOP (Zhou 2021) + DREEAM (Ma 2023) 적용 영역.
type ChangeRow = { axis: string; stage1: string; stage2: string };
const changeRows: ChangeRow[] = [
  { axis: "Entity Pooling", stage1: "mean", stage2: "logsumexp" },
  { axis: "Classifier", stage1: "Bilinear MLP", stage2: "ATLOP Grouped Bilinear" },
  { axis: "Threshold", stage1: "Fixed (0.5)", stage2: "Adaptive (pair별 학습)" },
  { axis: "Loss", stage1: "BCE", stage2: "ATL Ranking Loss" },
  { axis: "Evidence Head", stage1: "없음", stage2: "DREEAM Evidence Head + KL Loss" },
];

export function Stage2ChangesTable() {
  return (
    <table className="w-full border-collapse text-left text-[15px]">
      <caption className="pb-2 text-left text-[13px] font-medium text-muted-foreground">
        Stage 1 baseline에서 5개 축을 강화 — ATLOP + DREEAM 논문 적용
      </caption>
      <thead className="border-b border-border-strong">
        <tr>
          <th scope="col" className="py-2 pr-3 font-medium text-muted-foreground">구성 요소</th>
          <th scope="col" className="py-2 pr-3 font-medium text-muted-foreground">Stage 1</th>
          <th scope="col" className="py-2 font-medium text-foreground">Stage 2 (담당)</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {changeRows.map((r) => (
          <tr key={r.axis}>
            <th scope="row" className="py-2 pr-3 font-medium text-foreground">{r.axis}</th>
            <td className="py-2 pr-3 text-muted-foreground">
              <NumText text={r.stage1} />
              {r.axis === "Threshold" && <Ev ids={["th05"]} />}
            </td>
            <td className="py-2 font-medium text-foreground">{r.stage2}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// V1/V2 Results 비교 표 — 수치는 lib/projects.ts(T2G_SCORES)에서 읽는다
export function MetricsTable() {
  return (
    <table className="w-full border-collapse text-left text-[15px]">
      <caption className="pb-2 text-left text-[13px] font-medium text-muted-foreground">
        DocRED dev · V1 (best_model_f1_56_64) vs V2 (best_model_V2)
        <Ev ids={["f1"]} />
      </caption>
      <thead className="border-b border-border-strong">
        <tr>
          <th scope="col" className="py-2 pr-3 font-medium text-muted-foreground">Metric</th>
          <th scope="col" className="py-2 pr-3 text-right font-medium text-muted-foreground">V1</th>
          <th scope="col" className="py-2 text-right font-medium text-foreground">V2</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {T2G_SCORES.map((r) => (
          <tr key={r.metric}>
            <th scope="row" className="py-2 pr-3 font-medium text-foreground">{r.metric}</th>
            <td className="py-2 pr-3 text-right font-num text-muted-foreground">{r.v1}</td>
            <td className="py-2 text-right font-num text-foreground">{r.v2}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
