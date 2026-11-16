import type { Metadata } from "next";
import Link from "next/link";
import { Noto_Serif_KR } from "next/font/google";
import { CURRENT_WORK, PROFILE, SV_PROJECT } from "../_data";
import {
  ENT_INFO,
  ENT_ORDER,
  INTRO,
  SV_SOURCE,
  SV_TRIPLES,
  countEntities,
  type Arg,
  type EntType,
  type Sentence,
} from "./_components/corpus";
import { FilterRoot } from "./_components/filter-root";
import styles from "./c.module.css";

// C안 「주석 코퍼스」 — 소개문과 프로젝트 설명을 개체명 태깅된 문서로 보여 준다.
// 내비게이션은 태그 범례(유형 필터), 프로젝트 카드는 원문 + 추출된 관계 트리플.

// 한글 세리프. CJK는 subset 프리로드가 의미 없어 preload: false (unicode-range로 필요한 조각만 받음)
const serif = Noto_Serif_KR({
  weight: ["400", "600"],
  variable: "--font-lab-c-serif",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Lab C · 주석 코퍼스",
  robots: { index: false, follow: false },
};

const cssVar = (t?: EntType) =>
  (t ? { "--c": ENT_INFO[t].color } : {}) as React.CSSProperties;

function Ent({ t, s }: { t: EntType; s: string }) {
  return (
    <mark data-ent={t} className={styles.ent} style={cssVar(t)}>
      {s}
      <span aria-hidden="true" className={styles.lbl}>
        {t}
      </span>
    </mark>
  );
}

function Render({ sent }: { sent: Sentence }) {
  return (
    <>
      {sent.map((seg, i) =>
        typeof seg === "string" ? (
          <span key={i} className={styles.plain}>
            {seg}
          </span>
        ) : (
          <Ent key={i} t={seg.t} s={seg.s} />
        ),
      )}
    </>
  );
}

function ArgView({ a }: { a: Arg }) {
  return (
    <span className="min-w-0">
      <span aria-hidden="true" className={styles.dot} style={cssVar(a.t)} />
      <span className={a.t ? "text-[var(--fg)]" : "text-[var(--fg2)]"}>{a.s}</span>
      {a.t && (
        <span className="ml-1.5 text-[10.5px] font-bold tracking-[0.08em]" style={{ color: ENT_INFO[a.t].color }}>
          {a.t}
        </span>
      )}
    </span>
  );
}

export default function LabC() {
  const counts = countEntities(INTRO, SV_SOURCE);
  const introCounts = countEntities(INTRO);
  const introTotal = Object.values(introCounts).reduce((a, b) => a + b, 0);

  // 추출 요약: 유형별 예시 (소개 문서 기준)
  const examples = ENT_ORDER.map((t) => ({
    t,
    items: Array.from(
      new Set(
        INTRO.flat()
          .filter((s): s is { t: EntType; s: string } => typeof s !== "string" && s.t === t)
          .map((s) => s.s),
      ),
    ),
  })).filter((x) => x.items.length > 0);

  return (
    <div data-lab-root="c" className={`${serif.variable} ${styles.root} break-keep`}>
      <FilterRoot counts={counts} name={PROFILE.nameKo}>
        <main className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-8">
          {/* ── doc_01 소개 (첫 화면) ─────────────────────────── */}
          <section
            id="c-doc1"
            aria-labelledby="c-title"
            className="grid grid-cols-1 gap-10 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-14"
          >
            <div className="min-w-0">
              <p className="flex flex-wrap gap-x-3 text-[12.5px] tracking-[0.02em] text-[var(--fg3)]">
                <span>doc_01</span>
                <span>소개</span>
                <span>문장 {INTRO.length}</span>
                <span>개체 {introTotal}</span>
              </p>
              <h1 id="c-title" className="sr-only">
                {PROFILE.nameKo} — AI · NLP 엔지니어 포트폴리오
              </h1>
              <ol
                className={`${styles.serif} mt-6 space-y-5 text-[21px] leading-[1.95] tracking-[-0.01em] sm:text-[27px] lg:text-[31px]`}
              >
                {INTRO.map((sent, i) => (
                  <li key={i} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
                    <span className="pt-[0.7em] font-[family-name:var(--font-pretendard)] text-[11px] tracking-[0.04em] text-[var(--fg3)] sm:text-[12px]">
                      s{i + 1}
                    </span>
                    <p>
                      <Render sent={sent} />
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <aside aria-label="추출 요약" className="lg:pt-[2.1rem]">
              <p className="border-b border-[var(--rule)] pb-2 text-[12.5px] text-[var(--fg3)]">
                추출 요약 · doc_01
              </p>
              <dl className="mt-1">
                {examples.map(({ t, items }) => (
                  <div key={t} className="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-x-2 border-b border-[var(--rule)] py-2">
                    <dt className="text-[11.5px] font-bold tracking-[0.08em]" style={{ color: ENT_INFO[t].color }}>
                      {t}
                      <span className="ml-1 font-normal text-[var(--fg3)]">{items.length}</span>
                    </dt>
                    <dd className="text-[13px] leading-[1.5] text-[var(--fg2)]">{items.join(", ")}</dd>
                  </div>
                ))}
              </dl>
              <dl className="mt-6 space-y-1.5 text-[13px] text-[var(--fg2)]">
                <div className="flex gap-2">
                  <dt className="w-10 shrink-0 text-[var(--fg3)]">위치</dt>
                  <dd>{PROFILE.location}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-10 shrink-0 text-[var(--fg3)]">메일</dt>
                  <dd className="min-w-0 break-all">
                    <a href={`mailto:${PROFILE.email}`} className="underline underline-offset-4 hover:text-[var(--fg)]">
                      {PROFILE.email}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-10 shrink-0 text-[var(--fg3)]">코드</dt>
                  <dd>
                    <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-[var(--fg)]">
                      GitHub
                    </a>
                    {" · "}
                    <a href={PROFILE.huggingface} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-[var(--fg)]">
                      HuggingFace
                    </a>
                  </dd>
                </div>
              </dl>
              <p className="mt-6 text-[12.5px] leading-[1.6] text-[var(--fg3)]">
                {CURRENT_WORK.name}: {CURRENT_WORK.summary}
              </p>
            </aside>
          </section>

          {/* ── doc_02 프로젝트 카드 ─────────────────────────── */}
          <section id="c-doc2" aria-labelledby="c-sv-title" className="mt-20 scroll-mt-28">
            <article className="border border-[var(--rule)] bg-[var(--bg2)]">
              <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[var(--rule)] px-5 py-3 text-[12.5px] text-[var(--fg3)] sm:px-7">
                <span>doc_02 · 프로젝트 · AI / NLP</span>
                <span>
                  {SV_PROJECT.period} · 팀 {SV_PROJECT.team}
                </span>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
                <div className="border-b border-[var(--rule)] p-5 sm:p-7 lg:border-b-0 lg:border-r">
                  <h2 id="c-sv-title" className="text-[26px] font-semibold tracking-[-0.015em]">
                    {SV_PROJECT.title}
                  </h2>
                  <p className="mt-1 text-[15px] text-[var(--fg2)]">{SV_PROJECT.subtitle}</p>
                  <div className={`${styles.serif} mt-6 space-y-3 text-[18px] leading-[2.05] sm:text-[20px]`}>
                    {SV_SOURCE.map((sent, i) => (
                      <p key={i}>
                        <Render sent={sent} />
                      </p>
                    ))}
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <p className="flex items-baseline justify-between border-b border-[var(--rule)] pb-2 text-[12.5px] text-[var(--fg3)]">
                    <span>추출된 관계</span>
                    <span>{SV_TRIPLES.length}</span>
                  </p>
                  <ol>
                    {SV_TRIPLES.map((tr, i) => (
                      <li
                        key={i}
                        className={styles.triple}
                        data-has={[tr.h.t, tr.tl.t].filter(Boolean).join(" ")}
                      >
                        <div className="grid grid-cols-1 gap-y-1 border-b border-[var(--rule)] py-3 text-[14px] leading-[1.5] sm:grid-cols-[minmax(0,0.85fr)_auto_minmax(0,1.15fr)] sm:items-baseline sm:gap-x-3">
                          <ArgView a={tr.h} />
                          <span className="whitespace-nowrap text-[12px] text-[var(--fg3)]">
                            — {tr.r} →
                          </span>
                          <ArgView a={tr.tl} />
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <footer className="flex flex-col gap-3 border-t border-[var(--rule)] px-5 py-4 text-[14px] sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <p className="text-[var(--fg2)]">{SV_PROJECT.myPart}</p>
                <Link
                  href={SV_PROJECT.href}
                  className="shrink-0 font-semibold text-[var(--fg)] underline underline-offset-4 sm:ml-6"
                >
                  원문 전체 →
                </Link>
              </footer>
            </article>
          </section>
        </main>
      </FilterRoot>
    </div>
  );
}
