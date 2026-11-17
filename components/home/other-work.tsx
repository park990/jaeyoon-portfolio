import Link from "next/link";
import { getProjectsByDisplay, HIGHWAY_SERVICE_LINE } from "@/lib/projects";

// 그 밖의 작업 — 한 줄씩 (상세 페이지는 유지).
// [2단계] 1단계에서 빠졌던 스택 목록(Booming의 "JWT + Redis" 포함)을 항목마다 되살렸다.
const ORDER = ["booming", "hirepicker", "highway-guide"];

export function OtherWork() {
  const items = ORDER.map((slug) => getProjectsByDisplay("other").find((p) => p.slug === slug)!);
  return (
    <section aria-labelledby="other-title" className="sec mt-[clamp(56px,7vw,96px)]">
      <h2 id="other-title" className="sec-label">
        그 밖의 작업
      </h2>
      <p className="mt-2 max-w-[690px] text-[15px] leading-[1.7] text-note">
        한 프로젝트의 한계가 다음 결정이 된 풀스택 사이클 (HighWay → HirePicker → Booming)
      </p>
      <ul className="mt-4 max-w-[760px] border-t border-rule">
        {items.map((p) => (
          <li key={p.slug} className="border-b border-rule py-4">
            <p className="flex flex-wrap items-baseline gap-x-6">
              <Link href={`/projects/${p.slug}`} className="hit text-[17px] font-semibold">
                {p.title}
              </Link>
              <span className="text-[15px] text-note">{p.subtitle}</span>
              <span className="text-[15px] text-note">{p.homePeriod ?? p.period}</span>
            </p>
            <p className="mt-1 text-[17px] leading-[1.75] text-ink">
              {p.slug === "highway-guide" ? `${HIGHWAY_SERVICE_LINE}. ${p.oneLiner}` : p.oneLiner}
            </p>
            <p className="mt-1 text-[13px] leading-[1.6] text-note">스택 {p.stack.join(", ")}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
