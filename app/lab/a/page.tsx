import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono } from "next/font/google";
import {
  CURRENT_WORK,
  EVIDENCE,
  EXPERIENCE,
  GRADE_LABEL,
  PROFILE,
  SV_PROJECT,
  type Evidence,
  type EvidenceGrade,
} from "../_data";

// A안 「근거 달린 숫자」 — 검증 리포트형.
// 규칙: 화면의 성과 수치에는 확인 가능한 링크(커밋·평가표·문서)를 붙인다.
//       링크를 붙일 수 없는 수치는 싣지 않는다. 코드 주석의 추정치는 '추정'으로 표시한다.

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-lab-a-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lab A · 근거 달린 숫자",
  robots: { index: false, follow: false },
};

// 근거 색인 순서 = 각주 번호
const ORDER = [
  "semaphore",
  "parallel",
  "parallelEstimate",
  "filterIntlScope",
  "filterForecast",
  "filterRegion",
  "year",
  "t2gF1",
  "award",
] as const;
type EvKey = (typeof ORDER)[number];

const GRADE_COLOR: Record<EvidenceGrade, string> = {
  code: "#1d6a46",
  table: "#1f5a8a",
  comment: "#a1560a",
  doc: "#6a4c93",
};

const n = (k: EvKey) => ORDER.indexOf(k) + 1;
const isExternal = (href: string) => href.startsWith("http");

/** 수치 바로 옆에 붙는 근거 칩: ● 등급색 + 짧은 표기 + 각주 번호 */
function Ref({ k }: { k: EvKey }) {
  const e: Evidence = EVIDENCE[k];
  return (
    <a
      href={e.href}
      {...(isExternal(e.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      title={`${GRADE_LABEL[e.grade]} · ${e.shows}`}
      className="group/ref ml-1 inline-flex items-baseline gap-1 whitespace-nowrap border-b border-dotted border-[#9c998f] align-baseline font-[family-name:var(--font-lab-a-mono)] text-[11.5px] font-medium leading-none text-[#3d3f45] no-underline transition-colors hover:border-solid hover:border-[#16171a] hover:text-[#16171a]"
    >
      <span
        aria-hidden="true"
        className="inline-block h-[7px] w-[7px] translate-y-[-1px] rounded-full"
        style={{ backgroundColor: GRADE_COLOR[e.grade] }}
      />
      <span>{e.label}</span>
      <sup className="text-[9px] text-[#7a7c82]">{n(k)}</sup>
      <span className="sr-only">
        (근거 {n(k)}: {GRADE_LABEL[e.grade]})
      </span>
    </a>
  );
}

function GradeTag({ grade }: { grade: EvidenceGrade }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 font-[family-name:var(--font-lab-a-mono)] text-[11px] font-medium uppercase tracking-[0.04em]"
      style={{ color: GRADE_COLOR[grade] }}
    >
      <span
        aria-hidden="true"
        className="inline-block h-[7px] w-[7px] rounded-full"
        style={{ backgroundColor: GRADE_COLOR[grade] }}
      />
      {GRADE_LABEL[grade]}
    </span>
  );
}

function SectionLabel({ no, children }: { no: string; children: React.ReactNode }) {
  return (
    <p className="flex items-baseline gap-3 border-b border-[#16171a] pb-2 font-[family-name:var(--font-lab-a-mono)] text-[11.5px] font-medium uppercase tracking-[0.08em] text-[#16171a]">
      <span>§{no}</span>
      <span>{children}</span>
    </p>
  );
}

const TOC = [
  { no: "1", label: "요약", href: "#a-summary", built: true },
  { no: "2", label: "프로젝트", href: "#a-project", built: true },
  { no: "3", label: "근거 색인", href: "#a-index", built: true },
  { no: "4", label: "경력 · 교육", href: null, built: false },
  { no: "5", label: "연락", href: null, built: false },
];

// 요약의 핵심 수치 3줄 — 전부 근거가 붙는 것만
const KEY_FIGURES: {
  what: string;
  value: string;
  refs: EvKey[];
}[] = [
  {
    what: "관계 추출 Dev F1 (Text2Graph)",
    value: "56.64 → 59.25",
    refs: ["t2gF1"],
  },
  {
    what: "claim 검증 병렬화 (StructVerify-Lab)",
    value: "직렬 ~7분 → ~1/3",
    refs: ["parallel", "parallelEstimate"],
  },
  {
    what: "NLP 과정 최종 프로젝트",
    value: "최우수상",
    refs: ["award"],
  },
];

// 카드의 주장 목록 — 기존 본문에서만, 각 줄에 근거
const CLAIMS: { text: React.ReactNode; refs: EvKey[] }[] = [
  {
    text: (
      <>
        HCX 임베딩 동시 호출 <b className="font-semibold">3개</b> 제한 + 429 지수
        백오프 재시도
      </>
    ),
    refs: ["semaphore"],
  },
  {
    text: (
      <>
        claim 검증 병렬화 — 8건 기준 직렬{" "}
        <b className="font-semibold">~7분 → ~1/3</b>
      </>
    ),
    refs: ["parallel", "parallelEstimate"],
  },
  {
    text: (
      <>
        통계표 오매칭 차단 필터 <b className="font-semibold">4종</b> — 국제기구 ·
        장래추계 · 해외 지역 · 세부 대상
      </>
    ),
    refs: ["filterIntlScope", "filterForecast", "filterRegion"],
  },
  {
    text: (
      <>
        연도 비교 허용 폭 <b className="font-semibold">±2년 → 정확 일치</b>
      </>
    ),
    refs: ["year"],
  },
  {
    text: (
      <>
        팀 결과 <b className="font-semibold">{SV_PROJECT.award}</b>
      </>
    ),
    refs: ["award"],
  },
];

export default function LabA() {
  const cardRefs = Array.from(new Set(CLAIMS.flatMap((c) => c.refs)));
  const gradeCount = cardRefs.reduce<Record<EvidenceGrade, number>>(
    (acc, k) => {
      acc[EVIDENCE[k].grade] += 1;
      return acc;
    },
    { code: 0, table: 0, comment: 0, doc: 0 },
  );
  const prev = EXPERIENCE[0];

  return (
    <div
      data-lab-root="a"
      className={`${mono.variable} min-h-screen break-keep bg-[#fbfaf7] text-[#16171a] [font-feature-settings:'tnum'] selection:bg-[#16171a] selection:text-[#fbfaf7]`}
    >
      {/* ── 문서 머리 ─────────────────────────────────────────── */}
      <header className="border-b-2 border-[#16171a]">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-4 py-3 font-[family-name:var(--font-lab-a-mono)] text-[11.5px] uppercase tracking-[0.06em] sm:px-8">
          <span className="font-semibold">검증 리포트 — {PROFILE.nameKo} 포트폴리오</span>
          <span className="text-[#4a4c52]">
            갱신 2026-11-17 · 근거 링크 {ORDER.length}개 · 전부 공개 URL
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-x-10 px-4 sm:px-8 lg:grid-cols-[160px_minmax(0,1fr)] xl:grid-cols-[160px_minmax(0,1fr)_330px]">
        {/* ── 목차 = 내비게이션 ─────────────────────────────── */}
        <nav
          aria-label="목차"
          className="border-b border-[#d8d5cc] py-4 lg:sticky lg:top-0 lg:self-start lg:border-b-0 lg:py-10"
        >
          <p className="mb-3 hidden font-[family-name:var(--font-lab-a-mono)] text-[11px] uppercase tracking-[0.08em] text-[#7a7c82] lg:block">
            목차
          </p>
          <ol className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13.5px] lg:flex-col lg:gap-y-2.5">
            {TOC.map((t) => (
              <li key={t.no} className="flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-lab-a-mono)] text-[11.5px] text-[#7a7c82]">
                  {t.no}
                </span>
                {t.href ? (
                  <a
                    href={t.href}
                    className="text-[#16171a] underline decoration-[#c9c6bc] underline-offset-[5px] hover:decoration-[#16171a]"
                  >
                    {t.label}
                  </a>
                ) : (
                  <span className="text-[#a3a198]" title="다음 단계에서 작성">
                    {t.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* ── 본문 ───────────────────────────────────────────── */}
        <main className="min-w-0 py-8 lg:py-10">
          {/* §1 요약 */}
          <section id="a-summary" aria-labelledby="a-name">
            <SectionLabel no="1">요약</SectionLabel>

            <div className="mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h1
                id="a-name"
                className="text-[44px] font-semibold leading-none tracking-[-0.02em] sm:text-[60px]"
              >
                {PROFILE.nameKo}
              </h1>
              <span className="font-[family-name:var(--font-lab-a-mono)] text-sm text-[#4a4c52]">
                {PROFILE.nameEn}
              </span>
            </div>
            <p className="mt-4 text-[17px] font-semibold tracking-[-0.01em] sm:text-lg">
              AI · NLP 엔지니어 — 수치 검증 · 데이터 파이프라인
            </p>
            <p className="mt-4 max-w-[40em] text-[16.5px] leading-[1.75] text-[#2c2e33] sm:text-[17.5px]">
              숫자를 말할 때는 출처를 같이 붙입니다. 기사 속 수치 주장을 공식 통계와
              대조하는 LLM 파이프라인을 만들었고, 지금은 흩어진 공공 자료를 모아 검사
              규칙으로 자동 점검하는 서비스를 혼자 만들고 있습니다.
            </p>

            {/* 핵심 수치 — 표 */}
            <table className="mt-8 w-full border-collapse text-left text-[14.5px]">
              <caption className="pb-2 text-left font-[family-name:var(--font-lab-a-mono)] text-[11px] uppercase tracking-[0.08em] text-[#7a7c82]">
                핵심 수치 · 근거 포함
              </caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">항목</th>
                  <th scope="col">값</th>
                  <th scope="col">근거</th>
                </tr>
              </thead>
              <tbody className="border-y border-[#16171a]">
                {KEY_FIGURES.map((f) => (
                  <tr
                    key={f.what}
                    className="grid grid-cols-1 gap-y-1 border-b border-[#d8d5cc] py-3 last:border-b-0 sm:table-row sm:py-0"
                  >
                    <td className="text-[#4a4c52] sm:w-[42%] sm:py-3 sm:pr-4">{f.what}</td>
                    <td className="text-[20px] font-semibold tracking-[-0.01em] sm:py-3 sm:pr-4">
                      {f.value}
                    </td>
                    <td className="sm:py-3 sm:text-right">
                      {f.refs.map((k) => (
                        <Ref key={k} k={k} />
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 사실 목록 */}
            <dl className="mt-8 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-2.5 text-[14.5px] leading-[1.6]">
              <dt className="font-[family-name:var(--font-lab-a-mono)] text-[11.5px] uppercase tracking-[0.06em] text-[#7a7c82] sm:pt-[3px]">
                현재
              </dt>
              <dd>
                <span className="font-semibold">{CURRENT_WORK.name}</span>
                <span className="text-[#4a4c52]">
                  {" "}
                  · {CURRENT_WORK.role} · {CURRENT_WORK.period}
                </span>
                <span className="block text-[#4a4c52]">
                  {CURRENT_WORK.audition} · {CURRENT_WORK.mentor}
                </span>
              </dd>
              <dt className="font-[family-name:var(--font-lab-a-mono)] text-[11.5px] uppercase tracking-[0.06em] text-[#7a7c82] sm:pt-[3px]">
                직전
              </dt>
              <dd>
                <span className="font-semibold">{prev.org}</span>
                <span className="text-[#4a4c52]">
                  {" "}
                  · {prev.role} · {prev.period}
                </span>
              </dd>
              <dt className="font-[family-name:var(--font-lab-a-mono)] text-[11.5px] uppercase tracking-[0.06em] text-[#7a7c82] sm:pt-[3px]">
                위치
              </dt>
              <dd>{PROFILE.location}</dd>
            </dl>

            <p className="mt-8 border-l-2 border-[#16171a] pl-4 text-[13.5px] leading-[1.7] text-[#4a4c52]">
              <span className="font-semibold text-[#16171a]">작성 규칙.</span> 성과
              수치에는 확인 가능한 링크(커밋 · 평가표 · 문서)를 붙입니다. 링크가 없는
              수치는 싣지 않습니다. 코드 주석에 적힌 추정치는{" "}
              <GradeTag grade="comment" />로 따로 표시합니다.
            </p>
          </section>

          {/* §2 프로젝트 카드 */}
          <section id="a-project" className="mt-16" aria-labelledby="a-sv-title">
            <SectionLabel no="2">프로젝트</SectionLabel>

            <article className="mt-6 border border-[#16171a] bg-[#fffefb]">
              <header className="grid grid-cols-1 gap-4 border-b border-[#16171a] p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:p-6">
                <div>
                  <p className="font-[family-name:var(--font-lab-a-mono)] text-[11px] uppercase tracking-[0.08em] text-[#7a7c82]">
                    P-01 · AI / NLP · 팀 {SV_PROJECT.team}
                  </p>
                  <h2
                    id="a-sv-title"
                    className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.015em]"
                  >
                    {SV_PROJECT.title}
                  </h2>
                  <p className="mt-1 text-[15px] text-[#4a4c52]">{SV_PROJECT.subtitle}</p>
                </div>
                <dl className="grid grid-cols-[auto_auto] content-start justify-start gap-x-4 gap-y-1 font-[family-name:var(--font-lab-a-mono)] text-[12px] sm:justify-end sm:text-right">
                  <dt className="text-[#7a7c82]">기간</dt>
                  <dd>{SV_PROJECT.period}</dd>
                  <dt className="text-[#7a7c82]">근거</dt>
                  <dd>링크 {cardRefs.length}개</dd>
                </dl>
              </header>

              <div className="border-b border-[#d8d5cc] p-5 text-[15px] leading-[1.75] sm:p-6">
                <p>{SV_PROJECT.summary}</p>
                <p className="mt-2 text-[#4a4c52]">{SV_PROJECT.myPart}</p>
              </div>

              <ol className="text-[15px] leading-[1.6]">
                {CLAIMS.map((c, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-2 border-b border-[#e6e3db] px-5 py-3.5 sm:grid-cols-[2.25rem_minmax(0,1fr)_auto] sm:px-6"
                  >
                    <span className="pt-[2px] font-[family-name:var(--font-lab-a-mono)] text-[11.5px] text-[#7a7c82]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">{c.text}</span>
                    <span className="col-start-2 mt-1 flex flex-wrap items-start gap-x-1 gap-y-1 sm:col-start-3 sm:mt-0 sm:justify-end sm:pt-[3px]">
                      {c.refs.map((k) => (
                        <Ref key={k} k={k} />
                      ))}
                    </span>
                  </li>
                ))}
              </ol>

              <footer className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="font-[family-name:var(--font-lab-a-mono)] text-[11px] uppercase tracking-[0.08em] text-[#7a7c82]">
                    근거 등급
                  </span>
                  {(Object.keys(gradeCount) as EvidenceGrade[])
                    .filter((g) => gradeCount[g] > 0)
                    .map((g) => (
                      <span key={g} className="inline-flex items-baseline gap-1">
                        <GradeTag grade={g} />
                        <span className="font-[family-name:var(--font-lab-a-mono)] text-[12px]">
                          {gradeCount[g]}
                        </span>
                      </span>
                    ))}
                </p>
                <p className="flex gap-5 text-[14px] font-medium">
                  <a
                    href={SV_PROJECT.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-[#c9c6bc] underline-offset-[5px] hover:decoration-[#16171a]"
                  >
                    리포 ↗
                  </a>
                  <Link
                    href={SV_PROJECT.href}
                    className="underline decoration-[#16171a] underline-offset-[5px]"
                  >
                    상세 리포트 →
                  </Link>
                </p>
              </footer>
            </article>
          </section>
        </main>

        {/* ── 근거 색인 (xl: 오른쪽 여백 열 / 그 이하: 본문 아래) ────── */}
        <aside
          id="a-index"
          aria-label="근거 색인"
          className="pb-16 lg:col-start-2 xl:col-start-3 xl:row-start-1 xl:sticky xl:top-0 xl:max-h-screen xl:self-start xl:overflow-y-auto xl:py-10"
        >
          <SectionLabel no="3">근거 색인</SectionLabel>
          <ol className="mt-1">
            {ORDER.map((k) => {
              const e = EVIDENCE[k];
              return (
                <li
                  key={k}
                  id={`a-ev-${k}`}
                  className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2 border-b border-[#e6e3db] py-3"
                >
                  <span className="font-[family-name:var(--font-lab-a-mono)] text-[11.5px] text-[#7a7c82]">
                    {n(k)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                      <a
                        href={e.href}
                        {...(isExternal(e.href)
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="font-[family-name:var(--font-lab-a-mono)] text-[12.5px] font-semibold underline decoration-[#c9c6bc] underline-offset-[4px] hover:decoration-[#16171a]"
                      >
                        {e.label} ↗
                      </a>
                      <GradeTag grade={e.grade} />
                    </div>
                    <p className="mt-1 text-[13px] leading-[1.55] text-[#2c2e33]">{e.shows}</p>
                    <p className="mt-0.5 break-words font-[family-name:var(--font-lab-a-mono)] text-[11px] leading-[1.5] text-[#7a7c82]">
                      {e.where}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-4 text-[12.5px] leading-[1.65] text-[#7a7c82]">
            커밋 링크는 해당 diff에 값이 들어간 줄이 있는 것만 걸었습니다. 리포
            메인 브랜치가 바뀌어도 링크가 깨지지 않도록 전부 커밋 SHA로 고정했습니다.
          </p>
        </aside>
      </div>
    </div>
  );
}
