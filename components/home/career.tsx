import { TIMELINE, type InlineGrade } from "@/lib/profile";
import { InlineText, markKind, type MarkSpec } from "@/components/case/inline";

// 경력·교육 — 기간 | 직함(굵게)·소속 | 한 줄. 최신순 표 하나. 좁은 화면에서는 행을 세로로 쌓는다.
// 출처가 있는 숫자(문서 등급)는 형광. 등급 글자는 쓰지 않는다.
function marksOf(grades?: InlineGrade[]): MarkSpec[] {
  return (grades ?? []).flatMap((g) => {
    const kind = markKind(g.grade);
    return kind ? [{ s: g.value, kind }] : [];
  });
}

export function Career() {
  return (
    <section id="career" aria-labelledby="career-title" className="sec mt-[clamp(56px,7vw,96px)]">
      <h2 id="career-title" className="sec-label">
        경력, 교육
      </h2>
      <table className="tbl mt-4 w-full max-w-[1000px] border-collapse text-left">
        <thead className="hidden sm:table-header-group">
          <tr>
            <th scope="col" className="py-2 pr-4">기간</th>
            <th scope="col" className="py-2 pr-6">직함, 소속</th>
            <th scope="col" className="py-2">한 줄</th>
          </tr>
        </thead>
        <tbody>
          {TIMELINE.map((r) => {
            const marks = marksOf(r.grades);
            const org = r.org === undefined ? [] : Array.isArray(r.org) ? r.org : [r.org];
            return (
              <tr
                key={r.period + r.title}
                className="grid grid-cols-1 gap-y-1 border-b border-rule py-3.5 sm:table-row sm:py-0"
              >
                <td className="border-0 align-top text-[14px] leading-[1.7] text-note sm:w-[10.5rem] sm:border-b sm:py-3.5 sm:pr-4">
                  {r.period}
                </td>
                <td className="border-0 align-top sm:w-[18rem] sm:border-b sm:py-3.5 sm:pr-6">
                  <span className="block text-[16px] font-semibold leading-[1.5] text-ink">
                    <InlineText text={r.title} marks={marks} />
                  </span>
                  {org.length > 0 && (
                    <span className="flex flex-wrap gap-x-4 text-[15px] leading-[1.6] text-note">
                      {org.map((o) => (
                        <span key={o}>{o}</span>
                      ))}
                    </span>
                  )}
                </td>
                <td className="border-0 align-top text-[16px] leading-[1.7] text-ink sm:border-b sm:py-3.5">
                  {r.line && <InlineText text={r.line} marks={marks} />}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
