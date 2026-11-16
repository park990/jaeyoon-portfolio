"use client";

import { createContext, useContext, useId, useState } from "react";
import type { Evidence, Grade } from "@/lib/projects";
import { NumText } from "@/components/num-text";

// 사례 페이지 근거 표시.
// - 문장 끝 표시: [코드 3] — 등급은 색이 아니라 글자로 구분한다.
// - 1200px 미만: 표시를 누르면 문장 아래에 근거가 펼쳐진다.
// - 1200px 이상: 표시는 오른쪽 여백의 근거 주석(#ev-n)으로 이동하는 링크.
// 펼침 영역은 <p>·<li> 안에 들어가도 되도록 전부 <span>으로 만든다.

type Ctx = { evidence: Evidence[]; linkBase?: string };
const EvidenceContext = createContext<Ctx | null>(null);

/** linkBase가 있으면(홈) 근거 표시는 펼침 대신 그 사례 페이지의 근거 색인으로 가는 링크가 된다 */
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

function useEvidence(ids: string[]) {
  const ctx = useContext(EvidenceContext);
  if (!ctx) return [];
  return ids
    .map((id) => {
      const n = ctx.evidence.findIndex((e) => e.id === id);
      return n < 0 ? null : { e: ctx.evidence[n], n: n + 1 };
    })
    .filter((x): x is { e: Evidence; n: number } => x !== null);
}

/** 등급별로 묶기: [{grade, items}] */
function groupByGrade(items: { e: Evidence; n: number }[]) {
  const out: { grade: Grade; items: { e: Evidence; n: number }[] }[] = [];
  for (const it of items) {
    const g = out.find((x) => x.grade === it.e.grade);
    if (g) g.items.push(it);
    else out.push({ grade: it.e.grade, items: [it] });
  }
  return out;
}

export function GradeLabel({ grade, className = "" }: { grade: Grade; className?: string }) {
  return (
    <span className={`text-[12.5px] font-medium text-primary ${className}`}>[{grade}]</span>
  );
}

export function EvidenceLink({ e }: { e: Evidence }) {
  if (!e.href) return null;
  const external = e.href.startsWith("http");
  return (
    <a
      href={e.href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="font-num text-[12.5px] text-primary underline underline-offset-[3px] hover:no-underline"
    >
      {e.hrefLabel ?? e.href}
      {external ? " ↗" : ""}
    </a>
  );
}

/** 문장 끝 근거 표시. ids는 Evidence.id 목록 */
export function Ev({ ids }: { ids: string[] }) {
  const items = useEvidence(ids);
  const linkBase = useContext(EvidenceContext)?.linkBase;
  const [open, setOpen] = useState(false);
  const panelId = useId();
  if (items.length === 0) return null;
  const groups = groupByGrade(items);
  const label = groups.map((g) => `${g.grade} ${g.items.map((i) => i.n).join("·")}`);

  if (linkBase) {
    // 홈: 등급 글자만 보이고, 누르면 사례 페이지 근거 색인으로 이동
    return (
      <span className="whitespace-normal">
        {groups.map((g, i) => (
          <a
            key={i}
            href={`${linkBase}#evidence`}
            className="ml-1 whitespace-nowrap text-[12.5px] font-medium text-primary underline decoration-dotted underline-offset-[3px] hover:decoration-solid"
            aria-label={`${g.grade} 근거 ${g.items.map((x) => x.n).join(", ")}번 — 사례 페이지 근거 색인`}
          >
            [<NumText text={label[i]} />]
          </a>
        ))}
      </span>
    );
  }

  return (
    <span className="whitespace-normal">
      {/* 좁은 화면: 펼침 버튼 */}
      {label.map((l, i) => (
        <button
          key={`b${i}`}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="ml-1 whitespace-nowrap rounded-sm px-0.5 text-[12.5px] font-medium text-primary underline decoration-dotted underline-offset-[3px] transition-colors duration-150 hover:bg-secondary min-[1200px]:hidden"
        >
          [<NumText text={l} />]
          <span className="sr-only">{open ? " 근거 접기" : " 근거 펼치기"}</span>
        </button>
      ))}
      {/* 넓은 화면: 오른쪽 근거 주석으로 */}
      {groups.map((g, i) => (
        <a
          key={`a${i}`}
          href={`#ev-${g.items[0].n}`}
          className="ml-1 hidden whitespace-nowrap text-[12.5px] font-medium text-primary underline decoration-dotted underline-offset-[3px] hover:decoration-solid min-[1200px]:inline"
          aria-label={`근거 ${g.items.map((x) => x.n).join(", ")}번 (${g.grade})`}
        >
          [<NumText text={label[i]} />]
        </a>
      ))}
      {open && (
        <span
          id={panelId}
          role="note"
          className="my-2 block border-l-2 border-border-strong py-1 pl-3 text-[14px] leading-[1.6] text-foreground min-[1200px]:hidden"
        >
          {items.map(({ e, n }) => (
            <span key={e.id} className="block py-1">
              <span className="font-num text-[12px] text-muted-foreground">{n}</span>{" "}
              <GradeLabel grade={e.grade} /> {e.claim}
              <span className="block text-[13px] text-muted-foreground">
                {e.source} {e.href && <EvidenceLink e={e} />}
              </span>
            </span>
          ))}
        </span>
      )}
    </span>
  );
}

/** 근거 목록 (본문 끝 근거 색인 · 오른쪽 여백 근거 주석 공용) */
export function EvidenceList({
  compact = false,
  idPrefix,
}: {
  compact?: boolean;
  /** 앵커 id 접두. 오른쪽 여백만 #ev-n을 갖는다 */
  idPrefix?: string;
}) {
  const ctx = useContext(EvidenceContext);
  if (!ctx || ctx.evidence.length === 0) return null;
  return (
    <ol className={compact ? "space-y-3" : "divide-y divide-border border-y border-border"}>
      {ctx.evidence.map((e, i) => (
        <li
          key={e.id}
          id={idPrefix ? `${idPrefix}${i + 1}` : undefined}
          className={
            compact
              ? "scroll-mt-20 text-[13px] leading-[1.55] target:bg-secondary"
              : "grid grid-cols-[2rem_minmax(0,1fr)] gap-x-2 py-3 text-[15px] leading-[1.6]"
          }
        >
          {compact ? (
            <>
              <span className="font-num text-[12px] text-muted-foreground">{i + 1}</span>{" "}
              <GradeLabel grade={e.grade} />
              <span className="block text-foreground">{e.claim}</span>
              <span className="block text-muted-foreground">{e.source}</span>
              {e.href && (
                <span className="block">
                  <EvidenceLink e={e} />
                </span>
              )}
            </>
          ) : (
            <>
              <span className="pt-[2px] font-num text-[13px] text-muted-foreground">{i + 1}</span>
              <span>
                <GradeLabel grade={e.grade} /> {e.claim}
                <span className="block text-[14px] text-muted-foreground">
                  {e.source} {e.href && <EvidenceLink e={e} />}
                </span>
              </span>
            </>
          )}
        </li>
      ))}
    </ol>
  );
}
