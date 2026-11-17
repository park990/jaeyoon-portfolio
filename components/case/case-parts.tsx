import Link from "next/link";
import { Children } from "react";
import { getNextProject, type Evidence, type FlowStep, type Metric, type Project } from "@/lib/projects";
export type { FlowStep };
import { Graded, SideNotes, SourceLink } from "@/components/case/evidence";
import { InlineText, PRIVATE_NOTE, markKind, marksFor } from "@/components/case/inline";
import { collectEv } from "@/components/case/collect-ev";

// 사례 페이지 공통 틀의 조각들 (서버 컴포넌트)

export type CaseSectionMeta = {
  id: string;
  /** 칸 이름: 문제 · 내가 맡은 것 · 흐름 · 결정과 이유 · 평가 · 안 된 것 · 다음에 고칠 것 */
  label: string;
  /** 그 칸의 결론을 말하는 구절 (본문 사실로만) */
  title: string;
};

/** 메타 줄 — 항목 사이는 간격으로 나눈다(" · " 없음). 첫 항목은 먹색 굵게 */
export function MetaLine({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <p className={`meta ${className}`}>
      {items.map((x) => (
        <span key={x}>{x}</span>
      ))}
    </p>
  );
}

/**
 * 결과 타일: 큰 값(숫자나 핵심어, 8자 이내 한 줄) · 설명 줄 · 출처(링크 또는 추정 설명).
 * 큰 값은 대표 근거(ev 첫 항목)의 종류대로 통째로 표시: 코드·평가표·문서 = 형광, 추정 = 점선,
 * 비공개 기록·본인 기재 = 없음. 설명 줄에는 형광을 넣지 않는다(추정 점선은 유지).
 */
function ResultTile({ m, p }: { m: Metric; p: Project }) {
  const marks = marksFor(p.evidence, m.ev);
  const evs = m.ev
    .map((id) => ({ e: p.evidence.find((x) => x.id === id), n: p.evidence.findIndex((x) => x.id === id) + 1 }))
    .filter((x): x is { e: Evidence; n: number } => !!x.e);
  const kind = evs[0] ? markKind(evs[0].e.grade) : null;
  const sources = evs.map(({ e, n }) => {
    // 추정: 지금 있는 설명 문장(근거 출처의 첫 구절)
    if (e.grade === "추정") return <span key={e.id}>{e.source.split(" (")[0]}</span>;
    // 비공개 기록: 링크 없이 두 칸 "근거 n" + "본인 실행 기록 (비공개)" — 여백 주석과 같은 10px 간격
    if (e.grade === "비공개 기록")
      return (
        <span key={e.id}>
          <span>근거 {n}</span>
          <span className="ml-2.5">{p.privateNote ?? PRIVATE_NOTE}</span>
        </span>
      );
    // 본인 기재: 표시 없이 근거 표의 그 줄로만
    if (e.grade === "본인 기재")
      return (
        <a key={e.id} href={`#ev-${n}`} className="hit" aria-label={`근거 표 ${n}번 줄`}>
          근거 {n}
        </a>
      );
    if (e.href) return <SourceLink key={e.id} e={e} className="hit" title={e.claim} />;
    return <span key={e.id}>{e.source}</span>;
  });
  return (
    <li className="min-w-0">
      <p className="num whitespace-nowrap">
        {kind === "mark" ? <mark>{m.value}</mark> : kind === "est" ? <span className="est">{m.value}</span> : m.value}
      </p>
      <p className="mt-1 text-[16px] leading-[1.6]">
        {m.label}
        {m.note && (
          <>
            , <InlineText text={m.note} marks={marks} opts={{ hl: false }} />
          </>
        )}
      </p>
      <p className="mt-0.5 text-[14px] leading-[1.6] text-note">
        {sources.map((s, i) => (
          <span key={i}>
            {i > 0 && ", "}
            {s}
          </span>
        ))}
      </p>
    </li>
  );
}

/**
 * 맨 위: 메타 줄 → 문장형 제목 → 결과 타일 → 칸 목록 → 요약 → 리포 링크.
 * 메타 항목은 머리(.case-head)의 직계 span이라 560px 미만에서 역할·팀만 결과 아래로 옮길 수 있다(CSS order).
 */
export function CaseHeader({ project: p, toc }: { project: Project; toc: CaseSectionMeta[] }) {
  // 기간 표기에 상태가 이미 들어 있으면 상태를 반복하지 않는다
  const items: { text: string; roleTeam?: boolean }[] = [
    { text: p.title },
    { text: p.subtitle },
    { text: p.kind },
    ...(p.team ? [{ text: `팀 ${p.team}`, roleTeam: true }] : []),
    { text: `역할 ${p.role}`, roleTeam: true },
    { text: p.period },
    ...(p.period.includes(p.status) ? [] : [{ text: p.status }]),
  ];
  return (
    <header className="case-head">
      {items.map((x, i) => (
        <span key={x.text} className={`head-meta${i === 0 ? " first" : ""}${x.roleTeam ? " role-team" : ""}`}>
          {x.text}
        </span>
      ))}
      <h1 className="head-full head-h1 mt-3">{p.headline}</h1>

      {p.metrics.length > 0 && (
        <section aria-labelledby="results-title" className="head-full head-results sec mt-7">
          <h2 id="results-title" className="sec-label">
            결과
          </h2>
          <ul className="results mt-3">
            {p.metrics.map((m) => (
              <ResultTile key={m.label} m={m} p={p} />
            ))}
          </ul>
        </section>
      )}

      <div className="head-full head-rest">
        {/* 오른쪽 고정 목차 대신: 결과 아래 한 줄짜리 칸 링크 */}
        <nav aria-label="이 페이지의 칸" className="meta mt-6">
          <span>목차</span>
          {toc.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="py-[9px]">
              {s.label}
            </a>
          ))}
        </nav>

        {/* 요약은 여백 주석이 붙는 본문 문단이 아니라 형광 없음(추정 점선·근거 번호는 유지).
            [4단계] summaryHl인 사례(재개발 스캐너)만 요약에 형광 */}
        <p className="mt-5 max-w-[690px]">
          <Graded text={p.summary} ev={p.summaryEv} hl={!!p.summaryHl} />
        </p>

        {(p.repo || p.links?.length) && (
          <ul className="mt-3 text-[15px] leading-[1.8]">
            {p.repo && (
              <li>
                <span className="text-note">리포 (커밋 고정) </span>
                <a href={p.repo.href} target="_blank" rel="noopener noreferrer" className="hit font-mono text-[14px]">
                  {p.repo.label}
                </a>
              </li>
            )}
            {p.links?.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="hit">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}

/**
 * 본문 칸. 직계 자식 하나가 한 줄(.case-body)이 되고,
 * 그 줄이 기대는 근거를 오른쪽 여백 주석(aside)에 둔다. 좁은 화면에서는 주석이 아래로 내려간다.
 */
export function CaseSection({ meta, children }: { meta: CaseSectionMeta; children: React.ReactNode }) {
  const rows = Children.toArray(children);
  return (
    <section id={meta.id} aria-labelledby={`${meta.id}-title`} className="sec mt-16">
      <p className="sec-label">{meta.label}</p>
      <h2 id={`${meta.id}-title`} className="mt-1 max-w-[690px]">
        {meta.title}
      </h2>
      <div className="mt-7 flex flex-col gap-9">
        {rows.map((row, i) => {
          const ids = collectEv(row);
          // 근거가 6건을 넘으면 옆이 아니라 글 아래 한 줄 목록으로
          return (
            <div key={i} className="case-body">
              <div className="case-text">{row}</div>
              {ids.length > 0 && (
                <aside aria-label="근거 주석" className={ids.length > 6 ? "below" : undefined}>
                  <SideNotes ids={ids} />
                </aside>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** 칸 안의 작은 묶음 제목 */
export function SubHead({ children, note }: { children: React.ReactNode; note?: React.ReactNode }) {
  return (
    <div className="subhead">
      <h3 className="text-[17px] font-semibold leading-[1.5] text-ink">{children}</h3>
      {note && <p className="mt-1 text-[14px] leading-[1.6] text-note">{note}</p>}
    </div>
  );
}

export function NextCase({ slug }: { slug: string }) {
  const next = getNextProject(slug);
  return (
    <nav aria-label="다음 사례" className="sec mt-20">
      <p className="sec-label">다음 사례</p>
      <Link href={`/projects/${next.slug}`} className="mt-1 block max-w-[860px] py-2">
        <span className="block text-[15px] text-note">{next.title}</span>
        <span className="mt-1 block font-serif text-[21px] font-bold leading-[1.45] tracking-[-0.02em]">
          {next.headline}
        </span>
      </Link>
    </nav>
  );
}

// ─── 흐름 그림 ────────────────────────────────────────────────────────
// 본문(또는 리포)에 적힌 단계를 그대로 세로 목록으로. 담당 단계는 굵은 글씨(.mine).

export function FlowFigure({ steps, caption }: { steps: FlowStep[]; caption?: React.ReactNode }) {
  return (
    <figure>
      <ol className="steps">
        {steps.map((s, i) => {
          const lines = s.detail === undefined ? [] : Array.isArray(s.detail) ? s.detail : [s.detail];
          return (
            <li key={s.name} className={s.mine ? "mine" : undefined}>
              <span>{i + 1}</span>
              <span>
                {s.tag && <span className="mr-3">{s.tag}</span>}
                {s.tag && " "}
                {s.name}
              </span>
              {lines.length > 0 && (
                <small>
                  {lines.map((l, j) => (
                    <span key={l} className="block">
                      <Graded text={l} ev={s.ev} refs={j === lines.length - 1} hl={false} />
                    </span>
                  ))}
                </small>
              )}
            </li>
          );
        })}
      </ol>
      {caption && <figcaption className="mt-4 text-[14px] leading-[1.6] text-note">{caption}</figcaption>}
    </figure>
  );
}

