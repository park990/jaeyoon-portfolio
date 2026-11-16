import Link from "next/link";
import { getProjectsByDisplay, HIGHWAY_SERVICE_LINE } from "@/lib/projects";

// 그 밖의 작업 — 한 줄씩 (상세 페이지는 유지)
const ORDER = ["booming", "hirepicker", "highway-guide"];

export function OtherWork() {
  const items = ORDER.map((slug) => getProjectsByDisplay("other").find((p) => p.slug === slug)!);
  return (
    <section aria-labelledby="other-title" className="border-t border-border-strong">
      <div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6">
        <h2 id="other-title" className="text-[26px] font-semibold tracking-[-0.015em] text-foreground">
          그 밖의 작업
        </h2>
        <p className="mt-2 max-w-[680px] text-[15px] leading-[1.7] text-muted-foreground">
          한 프로젝트의 한계가 다음 결정이 된 풀스택 사이클 (HighWay → HirePicker → Booming)
        </p>
        <ul className="mt-6 max-w-[680px] divide-y divide-border border-y border-border">
          {items.map((p) => (
            <li key={p.slug} className="py-3.5">
              <p className="text-[17px] leading-[1.7]">
                <Link
                  href={`/projects/${p.slug}`}
                  className="font-semibold text-primary underline underline-offset-4 hover:no-underline"
                >
                  {p.title}
                </Link>
                <span className="text-muted-foreground">
                  {" "}
                  · {p.subtitle} · {p.period}
                </span>
              </p>
              <p className="text-[17px] leading-[1.75] text-foreground">
                {p.slug === "highway-guide" ? `${HIGHWAY_SERVICE_LINE}. ${p.oneLiner}` : p.oneLiner}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
