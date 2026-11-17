import type { Evidence, Grade } from "@/lib/projects";

// 문장 속 숫자 표시 (서버·클라이언트 공용, 훅 없음)
// - 코드 · 평가표 · 문서 → <mark> (형광)
// - 추정              → .est (점선 밑줄)
// - 확인 필요          → 표시 없음 (일반 글자)
// 어떤 글자를 표시할지는 lib/projects.ts의 Evidence.marks가 정한다(숫자를 정규식으로 찾지 않는다).
// 백틱(`…`)으로 감싼 부분은 코드로 보고 고정폭 <code>로 바꾼다.

export type MarkKind = "mark" | "est";
export type MarkSpec = { s: string; kind: MarkKind };

const MARK_GRADES: Grade[] = ["코드", "평가표", "문서"];

export function markKind(grade: Grade): MarkKind | null {
  if (MARK_GRADES.includes(grade)) return "mark";
  if (grade === "추정") return "est";
  return null;
}

/** 근거 id 목록 → 그 근거들이 표시하라고 지정한 글자들 */
export function marksFor(evidence: Evidence[], ids: readonly string[] | undefined): MarkSpec[] {
  if (!ids) return [];
  const out: MarkSpec[] = [];
  for (const id of ids) {
    const e = evidence.find((x) => x.id === id);
    if (!e) continue;
    const kind = markKind(e.grade);
    if (!kind) continue;
    for (const s of e.marks ?? []) out.push({ s, kind });
  }
  return out;
}

type Range = { start: number; end: number; kind: MarkKind };

function findRanges(text: string, marks: MarkSpec[]): Range[] {
  const specs = marks
    .map((m) => {
      const i = m.s.indexOf("{");
      const j = m.s.indexOf("}");
      const plain = i >= 0 && j > i ? m.s.replace("{", "").replace("}", "") : m.s;
      return { plain, hs: i >= 0 && j > i ? i : 0, hl: i >= 0 && j > i ? j - i - 1 : plain.length, kind: m.kind };
    })
    .sort((a, b) => b.plain.length - a.plain.length);
  const taken: Range[] = [];
  const takenPlain: [number, number][] = [];
  for (const sp of specs) {
    let from = 0;
    for (;;) {
      const k = text.indexOf(sp.plain, from);
      if (k < 0) break;
      const pe = k + sp.plain.length;
      // 더 긴 표기가 이미 잡은 자리와 겹치면 건너뛴다
      if (!takenPlain.some(([a, b]) => k < b && pe > a)) {
        takenPlain.push([k, pe]);
        taken.push({ start: k + sp.hs, end: k + sp.hs + sp.hl, kind: sp.kind });
      }
      from = pe;
    }
  }
  return taken.sort((a, b) => a.start - b.start);
}

function MarkedSegment({ text, marks, k }: { text: string; marks: MarkSpec[]; k: string }) {
  if (marks.length === 0) return <>{text}</>;
  const ranges = findRanges(text, marks);
  if (ranges.length === 0) return <>{text}</>;
  const parts: React.ReactNode[] = [];
  let at = 0;
  ranges.forEach((r, i) => {
    if (r.start > at) parts.push(text.slice(at, r.start));
    const t = text.slice(r.start, r.end);
    parts.push(
      r.kind === "mark" ? (
        <mark key={`${k}m${i}`}>{t}</mark>
      ) : (
        <span key={`${k}e${i}`} className="est">
          {t}
        </span>
      ),
    );
    at = r.end;
  });
  if (at < text.length) parts.push(text.slice(at));
  return <>{parts}</>;
}

/** 문장 하나를 표시 규칙대로 그린다 */
export function InlineText({ text, marks = [] }: { text: string; marks?: MarkSpec[] }) {
  const segs = text.split(/`([^`]+)`/g);
  return (
    <>
      {segs.map((seg, i) =>
        i % 2 === 1 ? (
          <code key={i}>{seg}</code>
        ) : (
          <MarkedSegment key={i} k={String(i)} text={seg} marks={marks} />
        ),
      )}
    </>
  );
}

// ─── 근거 링크 표기 ───────────────────────────────────────────────────

export function isCommit(e: Evidence) {
  return !!e.href && e.href.includes("/commit/");
}

/** 파일·경로처럼 보이는 표기(고정폭 대상) */
export function looksLikePath(label: string) {
  return /[./]/.test(label) && !/\s{2,}/.test(label);
}

export function isExternal(href: string) {
  return href.startsWith("http");
}

export function extProps(href: string) {
  return isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
