import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lab · 디자인 시안",
  robots: { index: false, follow: false },
};

const DRAFTS = [
  {
    href: "/lab/a",
    key: "A",
    name: "근거 달린 숫자",
    line: "검증 리포트 형식. 성과 수치마다 커밋·평가표 링크와 근거 등급이 붙는다.",
  },
  {
    href: "/lab/b",
    key: "B",
    name: "공정도",
    line: "입력 → 처리 → 검사 → 출력. 내비게이션과 프로젝트 카드가 모두 공정 흐름도다.",
  },
  {
    href: "/lab/c",
    key: "C",
    name: "주석 코퍼스",
    line: "소개문이 개체명 태깅된 문서다. 태그 범례가 곧 내비게이션이고, 카드는 관계 트리플이다.",
  },
];

export default function LabIndex() {
  return (
    <div
      data-lab-root="index"
      className="min-h-screen bg-[#f4f3ef] px-4 py-16 text-[#1b1b1a] sm:px-10"
    >
      <div className="mx-auto max-w-2xl">
        <p className="text-xs tracking-[0.12em] text-[#77756e]">
          REDESIGN · 0단계 · 비공개 시안
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">디자인 시안 3개</h1>
        <p className="mt-3 text-[15px] leading-[1.7] text-[#55534d]">
          각 시안은 첫 화면과 프로젝트 카드 1개(StructVerify-Lab)만 있습니다. 같은
          프로젝트로 맞춰서 형식 차이만 비교되게 했습니다.
        </p>
        <ol className="mt-10 border-t border-[#1b1b1a]">
          {DRAFTS.map((d) => (
            <li key={d.href} className="border-b border-[#cfccc3]">
              <Link
                href={d.href}
                className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 py-5 transition-colors hover:bg-[#ebe9e2]"
              >
                <span className="pl-1 text-2xl font-semibold">{d.key}</span>
                <span>
                  <span className="block text-lg font-semibold">{d.name}</span>
                  <span className="mt-1 block text-sm leading-[1.6] text-[#55534d]">
                    {d.line}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
