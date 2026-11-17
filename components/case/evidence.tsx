"use client";

import { createContext, useContext } from "react";
import type { Evidence } from "@/lib/projects";
import { InlineText, extProps, isCommit, looksLikePath, marksFor } from "@/components/case/inline";

// 근거 표시 (2단계)
// - 등급 글자([코드] 등)는 화면에 쓰지 않는다. 숫자의 모양(형광·점선·일반)으로만 드러낸다.
// - 문장 끝 꼬리표는 작은 링크 "근거 2, 8"(13px) → 사례 페이지 근거 표의 그 줄(#ev-n)
// - 여백 주석(SideNotes): 커밋은 7자리 번호 + 날짜와 한 줄, 문서·파일은 이름 링크
// - 등급 이름은 근거 표의 '종류' 칸에만 글자로 쓴다.

type Ctx = { evidence: Evidence[]; linkBase?: string };
const EvidenceContext = createContext<Ctx | null>(null);

/** linkBase가 있으면(홈) "근거 n"은 그 사례 페이지의 근거 표 줄로 가는 링크가 된다 */
export function EvidenceProvider({
  evidence,
  linkBase,
  children,
}: {
  evidence: Evidence[];
  linkBase?: string;
  children: React.ReactNode;
}) {
  return (
    <EvidenceContext.Provider value={{ evidence, linkBase }}>{children}</EvidenceContext.Provider>
  );
}

function useEvidence(ids: readonly string[]) {
  const ctx = useContext(EvidenceContext);
  if (!ctx) return [];
  const seen = new Set<string>();
  return ids
    .filter((id) => (seen.has(id) ? false : (seen.add(id), true)))
    .map((id) => {
      const n = ctx.evidence.findIndex((e) => e.id === id);
      return n < 0 ? null : { e: ctx.evidence[n], n: n + 1 };
    })
    .filter((x): x is { e: Evidence; n: number } => x !== null)
    .sort((a, b) => a.n - b.n);
}

/** 문장 끝 근거 번호: "근거 2, 8" */
export function Ev({ ids }: { ids: readonly string[] }) {
  const items = useEvidence(ids);
  const linkBase = useContext(EvidenceContext)?.linkBase ?? "";
  if (items.length === 0) return null;
  return (
    <span className="ev-ref">
      근거{" "}
      {items.map(({ n }, i) => (
        <span key={n}>
          {i > 0 && ", "}
          <a href={`${linkBase}#ev-${n}`} aria-label={`근거 표 ${n}번 줄`}>
            {n}
          </a>
        </span>
      ))}
    </span>
  );
}

/** 근거가 붙는 문장: 숫자 표시 + 끝에 "근거 n" (refs=false면 숫자 표시만) */
export function Graded({ text, ev, refs = true }: { text: string; ev?: readonly string[]; refs?: boolean }) {
  const ctx = useContext(EvidenceContext);
  return (
    <>
      <InlineText text={text} marks={marksFor(ctx?.evidence ?? [], ev)} />
      {refs && ev && ev.length > 0 && <Ev ids={ev} />}
    </>
  );
}

/** 근거 하나의 열 수 있는 출처 링크 (커밋 = .sha, 파일 = 고정폭 이름, 그 밖 = 고딕) */
export function SourceLink({ e, className = "" }: { e: Evidence; className?: string }) {
  if (!e.href) return null;
  const label = e.hrefLabel ?? e.href;
  const cls = isCommit(e) ? "sha" : looksLikePath(label) ? "font-mono text-[13px] [overflow-wrap:anywhere]" : "";
  return (
    <a href={e.href} {...extProps(e.href)} className={`${cls} ${className}`}>
      {label}
    </a>
  );
}

/** 여백 주석: 그 문단이 기대는 근거 */
export function SideNotes({ ids }: { ids: readonly string[] }) {
  const items = useEvidence(ids);
  if (items.length === 0) return null;
  return (
    <ol className="space-y-3">
      {items.map(({ e, n }) => (
        <li key={e.id}>
          <span className="text-[13px]">근거 {n}</span>
          {e.href && (
            <span className="block">
              <SourceLink e={e} className="hit" />
              {e.date && <span className="ml-2 text-[13px]">{e.date}</span>}
            </span>
          )}
          <span className="block">{e.claim}</span>
          {!e.href && <span className="block">{e.source}</span>}
        </li>
      ))}
    </ol>
  );
}

/** 근거 목록 표: 번호 | 내용 | 출처 | 종류. 각 줄은 #ev-n */
export function EvidenceTable() {
  const ctx = useContext(EvidenceContext);
  if (!ctx || ctx.evidence.length === 0) return null;
  return (
    <table className="tbl w-full border-collapse text-left text-[15px] leading-[1.6]">
      <thead className="hidden md:table-header-group">
        <tr>
          <th scope="col" className="w-[3.5rem] py-2 pr-3">번호</th>
          <th scope="col" className="py-2 pr-6">내용</th>
          <th scope="col" className="py-2 pr-6">출처</th>
          <th scope="col" className="w-[6rem] py-2">종류</th>
        </tr>
      </thead>
      <tbody>
        {ctx.evidence.map((e, i) => (
          <tr
            key={e.id}
            id={`ev-${i + 1}`}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-b border-rule py-3 md:table-row md:py-0 [&:target>td]:border-b-ink"
          >
            <td className="row-span-3 border-0 align-top text-note md:border-b md:py-3 md:pr-3 [tr:target_&]:font-semibold [tr:target_&]:text-ink">
              {i + 1}
            </td>
            <td className="border-0 align-top text-ink md:border-b md:py-3 md:pr-6">{e.claim}</td>
            <td className="border-0 align-top text-note md:border-b md:py-3 md:pr-6">
              {e.source}
              {e.href && (
                <>
                  {" "}
                  <SourceLink e={e} />
                </>
              )}
            </td>
            <td className="border-0 align-top text-ink md:border-b md:py-3">
              <span className="text-[13px] text-note md:hidden">종류 </span>
              {e.grade}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
