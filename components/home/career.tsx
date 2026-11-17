import { TIMELINE } from "@/lib/profile";

// 경력·교육 — 기간 | 직함(굵게)·소속 | 한 줄. 최신순 표 하나. 좁은 화면에서는 행을 세로로 쌓는다.
// [2.5단계] 경력 표에는 형광 없음(형광은 결과로 내세우는 숫자에만). 등급 값(TIMELINE.grades)은 데이터에 그대로 둔다.

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
                    {r.title}
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
                  {r.line}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
