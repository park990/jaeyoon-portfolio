import Link from "next/link";
import { PROFILE } from "@/lib/profile";
import { getProjectBySlug, GRADES, type Grade } from "@/lib/projects";
import { NumText } from "@/components/num-text";

// 첫 화면 — 왼쪽 정렬. 작은 줄 → 큰 문장 → 보조 문단 → 증거 3줄.
// 증거 줄 문장은 lib/projects.ts의 proof(그 파일의 수치로만 만든 문장)를 쓴다.
const PROOF_ORDER = ["structverify-lab", "text2graph", "medical-rag"];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="mx-auto max-w-[1120px] px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
      <p className="text-[15px] font-medium leading-[1.6] text-muted-foreground">{PROFILE.title}</p>
      <h1
        id="hero-title"
        className="mt-3 text-[34px] font-semibold leading-[1.22] tracking-[-0.025em] text-foreground sm:text-[44px] lg:text-[52px]"
      >
        숫자를 말할 때는 출처를 같이 붙입니다.
      </h1>
      <p className="mt-5 max-w-[680px] text-[17px] leading-[1.75] text-foreground">
        기사 속 수치 주장을 공식 통계와 대조하는 LLM 파이프라인을 만들었고, 지금은 흩어진 공공
        자료를 모아 검사 규칙으로 자동 점검하는 서비스를 혼자 만들고 있습니다.
      </p>

      <ol aria-label="근거 있는 결과" className="mt-9 max-w-[900px] border-t border-border-strong">
        {PROOF_ORDER.map((slug) => {
          const p = getProjectBySlug(slug)!;
          const proof = p.proof!;
          const grades = GRADES.filter((g: Grade) =>
            (proof.ev ?? []).some((id) => p.evidence.find((e) => e.id === id)?.grade === g),
          );
          return (
            <li key={slug} className="border-b border-border">
              <Link
                href={`/projects/${slug}`}
                className="group grid grid-cols-1 gap-x-6 gap-y-0.5 py-3 transition-colors duration-150 hover:bg-secondary sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-baseline sm:px-2"
              >
                <span className="text-[16px] font-semibold text-foreground group-hover:underline group-hover:underline-offset-4">
                  {p.title}
                </span>
                <span className="text-[16px] leading-[1.6] text-foreground">
                  <NumText text={proof.text} />
                </span>
                <span className="whitespace-nowrap text-[13px] font-medium text-primary">
                  {grades.map((g) => `[${g}]`).join(" ")} <span aria-hidden="true">→</span>
                  <span className="sr-only"> {p.title} 사례 페이지</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
