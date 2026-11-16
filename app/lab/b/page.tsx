import type { Metadata } from "next";
import Link from "next/link";
import { Barlow_Condensed } from "next/font/google";
import {
  CERT,
  CURRENT_WORK,
  EDUCATION,
  EXPERIENCE,
  PROFILE,
  SV_PROJECT,
} from "../_data";
import { ProcessNav } from "./_components/process-nav";
import { PROC_META, ProcSymbol, type ProcKind } from "./_components/symbols";
import styles from "./b.module.css";

// B안 「공정도」 — 산업공학 공정도(ASME 기호)로 사람과 프로젝트를 그린다.
// 입력(배운 것) → 처리(해 본 일) → 검사(외부 검사 통과) → 출력(지금 내놓는 것)

const cond = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-lab-b-cond",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lab B · 공정도",
  robots: { index: false, follow: false },
};

type Item = { main: string; sub?: string; href?: string };

const OVERVIEW: { kind: ProcKind; caption: string; items: Item[] }[] = [
  {
    kind: "storage",
    caption: "배운 것",
    items: [
      ...EDUCATION.slice()
        .reverse()
        .map((e) => ({
          main: `${e.program}`,
          sub: `${e.org} · ${e.period}${e.meta ? ` · ${e.meta}` : ""}`,
        })),
      { main: `${CERT.name} ${CERT.score}`, sub: CERT.date },
    ],
  },
  {
    kind: "operation",
    caption: "해 본 일",
    items: [
      ...EXPERIENCE.map((e) => ({
        main: `${e.org} · ${e.role}`,
        sub: e.note ? `${e.period} · ${e.note}` : e.period,
      })),
      { main: "프로젝트 공정표 P-01 보기", sub: SV_PROJECT.title, href: "#b-card" },
    ],
  },
  {
    kind: "inspection",
    caption: "외부 검사 통과",
    items: [
      { main: "NLP 과정 최우수상", sub: `멋쟁이사자처럼 · ${SV_PROJECT.title}` },
      {
        main: `창업 오디션 선발 · 경쟁률 ${CURRENT_WORK.auditionRatio}`,
        sub: `2026.10 · ${CURRENT_WORK.mentor}`,
      },
    ],
  },
  {
    kind: "transport",
    caption: "지금 내놓는 것",
    items: [
      {
        main: CURRENT_WORK.name,
        sub: `${CURRENT_WORK.role} · ${CURRENT_WORK.period}`,
      },
      { main: CURRENT_WORK.summary },
    ],
  },
];

// 공정표 P-01 — 기존 StructVerify-Lab 본문에서만 가져옴
const STEPS: {
  kind: ProcKind;
  label: string;
  lines: string[];
  dataLabel: string;
  data: string;
  mine: string | null;
}[] = [
  {
    kind: "storage",
    label: "입력",
    lines: [
      "기사 텍스트 (뉴스 · 보고서)",
      "KOSIS Open API — 주제별 통계 31개 카테고리 메타",
      "HCX 임베딩 v2 (1024차원) · 100건 배치 · 동시 3",
    ],
    dataLabel: "카탈로그 적재",
    data: "262,783건",
    mine: "크롤러 · 적재",
  },
  {
    kind: "operation",
    label: "처리",
    lines: [
      "claim 추출 → 통계표 후보 검색 (pgvector 코사인 + 카테고리 키워드)",
      "claim별 검증 병렬화 — asyncio.gather + Semaphore(3)",
      "HCX 429 지수 백오프 재시도",
    ],
    dataLabel: "claim 8건",
    data: "~7분 → ~1/3",
    mine: "병렬화 · LLM 클라이언트",
  },
  {
    kind: "inspection",
    label: "검사",
    lines: [
      "통계표 필터 4종 — 국제기구 · 장래추계 · 해외 지역 · 세부 대상",
      "연도 정확 일치 (±2년 → 0)",
      "수치 판정은 결정론 코드, LLM은 설명만",
    ],
    dataLabel: "차단 사례",
    data: "‘전체 사망자’ ≠ 영아 사망률 표",
    mine: "필터 · verifier",
  },
  {
    kind: "transport",
    label: "출력",
    lines: ["판정 결과 + 자연어 설명 (explainer · LLM)"],
    dataLabel: "결과",
    data: "NLP 과정 최우수상",
    mine: null,
  },
];

export default function LabB() {
  return (
    <div data-lab-root="b" className={`${cond.variable} ${styles.root} break-keep`}>
      <ProcessNav />

      <main className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-8">
        {/* ── 첫 화면: 도면 표지 ─────────────────────────────── */}
        <section
          aria-labelledby="b-name"
          className="grid grid-cols-1 gap-8 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end lg:gap-12"
        >
          <div>
            <p className={`${styles.cond} text-[15px] font-semibold uppercase tracking-[0.14em] text-[var(--ink3)]`}>
              Flow Process Chart · 공정 흐름도
            </p>
            <h1
              id="b-name"
              className="mt-3 text-[46px] font-bold leading-[1.05] tracking-[-0.03em] sm:text-[64px]"
            >
              {PROFILE.nameKo}
            </h1>
            <p className="mt-5 max-w-[34em] text-[18px] font-medium leading-[1.65] tracking-[-0.01em] sm:text-[21px]">
              흩어진 데이터를 모으고, 모델과 규칙으로 처리하고, 틀린 값을 걸러 내,
              쓸 수 있는 결과로 내보냅니다.
            </p>
          </div>

          {/* 도면 표제란 */}
          <table className="w-full border-collapse border-2 border-[var(--ink)] bg-[var(--panel)] text-[14px]">
            <caption className="sr-only">표제란</caption>
            <tbody>
              {[
                ["도면", `${PROFILE.nameKo} — 공정 개요`],
                ["직무", "AI 엔지니어 · 데이터 파이프라인"],
                ["위치", PROFILE.location],
                ["연락", PROFILE.email],
                ["갱신", "2026.11.17"],
              ].map(([k, v]) => (
                <tr key={k} className="border-b border-[var(--ink)] last:border-b-0">
                  <th
                    scope="row"
                    className={`${styles.cond} w-[72px] border-r border-[var(--ink)] px-3 py-2 text-left text-[13px] font-semibold uppercase tracking-[0.1em] text-[var(--ink2)]`}
                  >
                    {k}
                  </th>
                  <td className="break-all px-3 py-2 font-medium">
                    {k === "연락" ? (
                      <a href={`mailto:${v}`} className="underline underline-offset-4">
                        {v}
                      </a>
                    ) : (
                      v
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ── 공정 개요: 4개 공정 = 내비게이션의 확대판 ─────────── */}
        <section aria-label="공정 개요" className="mt-12">
          <ol className={styles.flow}>
            {OVERVIEW.map((st) => {
              const m = PROC_META[st.kind];
              return (
                <li key={st.kind} id={m.id} className={styles.station}>
                  <div className={styles.stationHead}>
                    <ProcSymbol kind={st.kind} size={26} />
                    <div className="min-w-0">
                      <p className="flex items-baseline gap-2">
                        <span className={`${styles.cond} text-[20px] font-bold`}>{m.no}</span>
                        <span className="text-[17px] font-bold tracking-[-0.01em]">{m.name}</span>
                      </p>
                      <p className="text-[12.5px] text-[var(--ink2)]">
                        {st.caption} · ASME {m.asme}
                      </p>
                    </div>
                  </div>
                  <ul className="divide-y divide-[var(--rule)] px-4">
                    {st.items.map((it, i) => (
                      <li key={i} className="py-2.5">
                        {it.href ? (
                          <a
                            href={it.href}
                            className="text-[14.5px] font-semibold text-[var(--accent)] underline underline-offset-4"
                          >
                            {it.main} ↓
                          </a>
                        ) : (
                          <p className="text-[14.5px] font-semibold leading-[1.45]">{it.main}</p>
                        )}
                        {it.sub && (
                          <p className="mt-0.5 text-[12.5px] leading-[1.5] text-[var(--ink2)]">
                            {it.sub}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ── 프로젝트 카드 = 공정표 P-01 ────────────────────────── */}
        <section id="b-card" aria-labelledby="b-card-title" className={`${styles.card} mt-16`}>
          <header className="grid grid-cols-1 gap-3 p-5 sm:p-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-end lg:gap-8">
            <p className={`${styles.cond} text-[34px] font-bold leading-none tracking-[0.02em]`}>
              P-01
            </p>
            <div>
              <h2 id="b-card-title" className="text-[24px] font-bold leading-tight tracking-[-0.02em]">
                {SV_PROJECT.title}
              </h2>
              <p className="mt-1 text-[15px] text-[var(--ink2)]">{SV_PROJECT.subtitle}</p>
            </div>
            <dl
              className={`${styles.cond} flex flex-wrap gap-x-7 gap-y-2 whitespace-nowrap text-[15px] font-semibold uppercase tracking-[0.06em]`}
            >
              <div>
                <dt className="text-[12px] text-[var(--ink3)]">기간</dt>
                <dd>{SV_PROJECT.period}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-[var(--ink3)]">팀</dt>
                <dd>{SV_PROJECT.team}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-[var(--ink3)]">담당 공정</dt>
                <dd className="text-[var(--accent)]">3 / 4</dd>
              </div>
            </dl>
          </header>

          <ol className={styles.steps}>
            {STEPS.map((s) => (
              <li key={s.kind} className={styles.step}>
                <div className="flex items-center gap-2.5">
                  <ProcSymbol
                    kind={s.kind}
                    size={22}
                    className={`${styles.stepSymbol} ${s.mine ? styles.mine : ""}`}
                  />
                  <p className="flex items-baseline gap-2">
                    <span className={`${styles.cond} text-[16px] font-bold text-[var(--ink3)]`}>
                      {PROC_META[s.kind].no}
                    </span>
                    <span className="text-[16px] font-bold">{s.label}</span>
                  </p>
                  {s.mine && (
                    <span className="ml-auto border border-[var(--accent)] px-1.5 py-[1px] text-[11.5px] font-semibold text-[var(--accent)]">
                      담당
                    </span>
                  )}
                </div>
                <ul className="mt-3 space-y-1.5 text-[14px] leading-[1.55]">
                  {s.lines.map((l) => (
                    <li key={l} className="relative pl-3">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-[0.62em] h-[5px] w-[5px] bg-[var(--ink)]"
                      />
                      {l}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-5">
                  <div className="border-t border-dashed border-[var(--ink)] pt-2.5">
                    <p className={`${styles.cond} text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--ink3)]`}>
                      공정 데이터 · {s.dataLabel}
                    </p>
                    <p className={`${styles.cond} mt-0.5 text-[26px] font-bold leading-tight tracking-[0.005em]`}>
                      {s.data}
                    </p>
                    {s.mine && (
                      <p className="mt-1 text-[12.5px] text-[var(--accent)]">담당: {s.mine}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <footer className="flex flex-col gap-2 border-t-2 border-[var(--ink)] px-5 py-4 text-[14px] sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-[var(--ink2)]">{SV_PROJECT.myPart}</p>
            <Link
              href={SV_PROJECT.href}
              className="shrink-0 font-semibold underline underline-offset-4 sm:ml-6"
            >
              상세 공정 보기 →
            </Link>
          </footer>
        </section>
      </main>
    </div>
  );
}
