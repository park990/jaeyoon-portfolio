import { TIMELINE } from "@/lib/profile";
import { GradeLabel } from "@/components/case/evidence";
import { NumText } from "@/components/num-text";

// 경력·교육 — 기간 | 직함(굵게)·소속 | 한 줄. 최신순 표 하나.
export function Career() {
  return (
    <section id="career" aria-labelledby="career-title" className="border-t border-border-strong">
      <div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6">
        <h2 id="career-title" className="text-[26px] font-semibold tracking-[-0.015em] text-foreground">
          경력 · 교육
        </h2>
        <table className="mt-6 w-full max-w-[960px] border-collapse text-left">
          <thead className="border-b border-border-strong">
            <tr className="hidden sm:table-row">
              <th scope="col" className="py-2 pr-4 text-[13px] font-medium text-muted-foreground">기간</th>
              <th scope="col" className="py-2 pr-6 text-[13px] font-medium text-muted-foreground">직함 · 소속</th>
              <th scope="col" className="py-2 text-[13px] font-medium text-muted-foreground">한 줄</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border border-b border-border">
            {TIMELINE.map((r) => (
              <tr key={r.period + r.title} className="grid grid-cols-1 gap-y-1 py-3.5 sm:table-row sm:py-0">
                <td className="align-top text-[14px] text-muted-foreground sm:w-[10.5rem] sm:py-3.5 sm:pr-4">
                  <NumText text={r.period} />
                </td>
                <td className="align-top sm:w-[18rem] sm:py-3.5 sm:pr-6">
                  <span className="block text-[16px] font-semibold leading-[1.5] text-foreground">
                    <NumText text={r.title} />
                  </span>
                  {r.org && <span className="block text-[15px] text-muted-foreground">{r.org}</span>}
                </td>
                <td className="align-top text-[16px] leading-[1.7] text-foreground sm:py-3.5">
                  {r.line && <NumText text={r.line} />}
                  {r.grades?.map((g) =>
                    r.line?.includes(g.value) || r.title.includes(g.value) ? (
                      <GradeLabel key={g.value} grade={g.grade} className="ml-1" />
                    ) : (
                      <span key={g.value}>
                        {r.line ? " · " : ""}
                        <NumText text={g.value} />
                        <GradeLabel grade={g.grade} className="ml-1" />
                      </span>
                    ),
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
