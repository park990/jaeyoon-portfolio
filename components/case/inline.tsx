import type { Evidence, Grade } from "@/lib/projects";

// 문장 속 숫자 표시 (서버·클라이언트 공용, 훅 없음)
// - 코드 · 평가표 · 문서     → <mark> (형광)
// - 추정                    → .est (점선 밑줄)
// - 비공개 기록 · 본인 기재  → 표시 없음 (일반 글자)
// 어떤 글자를 표시할지는 lib/projects.ts의 Evidence.marks가 정한다(숫자를 정규식으로 찾지 않는다).
// 백틱(`…`)으로 감싼 부분은 코드로 보고 고정폭 <code>로 바꾼다.

export type MarkKind = "mark" | "est";
export type MarkSpec = { s: string; kind: MarkKind };

/**
 * [2.5단계] 형광 줄이기
 * - hl=false: 형광(mark)은 빼고 추정 점선(est)만 남긴다 (띠 요약 문장·단계 설명·표·타일 설명 줄 등)
 * - max: 한 문장(문단)에 붙일 형광 수 상한 (추정 점선은 세지 않는다)
 * - exclude: 이미 쓴 형광 글자 (한 띠 안에서 같은 값은 처음 한 번)
 * - 괄호에 바로 붙은 값은 형광을 넣지 않는다("( 값 )"처럼 벌어지지 않게)
 */
export type MarkOpts = { hl?: boolean; max?: number; exclude?: readonly string[] };

const MARK_GRADES: Grade[] = ["코드", "평가표", "문서"];

/** 비공개 기록 근거의 주석 문구 (링크 없음, 주석색) — 여백 주석과 결과 타일 출처 줄이 같이 쓴다 */
export const PRIVATE_NOTE = "본인 실행 기록(비공개)";

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

function findRanges(text: string, marks: MarkSpec[], opts: MarkOpts = {}): Range[] {
  const { hl = true, max = Infinity, exclude = [] } = opts;
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
      const start = k + sp.hs;
      const end = start + sp.hl;
      // 더 긴 표기가 이미 잡은 자리와 겹치면 건너뛴다 (겹치는 자리는 형광이든 아니든 다시 잡지 않는다)
      if (!takenPlain.some(([a, b]) => k < b && pe > a)) {
        takenPlain.push([k, pe]);
        const word = text.slice(start, end);
        const inParen = text[start - 1] === "(" || text[end] === ")";
        const skip =
          sp.kind === "mark" && (!hl || inParen || exclude.includes(word));
        if (!skip) taken.push({ start, end, kind: sp.kind });
      }
      from = pe;
    }
  }
  taken.sort((a, b) => a.start - b.start);
  // 형광 상한: 앞에서부터 max개만
  let n = 0;
  return taken.filter((r) => r.kind !== "mark" || ++n <= max);
}

/** 이 문장에서 실제로 형광이 붙는 글자들 (띠 안 중복 확인용) */
export function markedWords(text: string, marks: MarkSpec[], opts: MarkOpts = {}): string[] {
  return text
    .split(/`[^`]+`/g)
    .flatMap((seg) =>
      findRanges(seg, marks, opts)
        .filter((r) => r.kind === "mark")
        .map((r) => seg.slice(r.start, r.end)),
    );
}

function MarkedSegment({ text, marks, k, opts }: { text: string; marks: MarkSpec[]; k: string; opts?: MarkOpts }) {
  if (marks.length === 0) return <>{text}</>;
  const ranges = findRanges(text, marks, opts);
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
export function InlineText({ text, marks = [], opts }: { text: string; marks?: MarkSpec[]; opts?: MarkOpts }) {
  const segs = text.split(/`([^`]+)`/g);
  return (
    <>
      {segs.map((seg, i) =>
        i % 2 === 1 ? (
          <code key={i}>{seg}</code>
        ) : (
          <MarkedSegment key={i} k={String(i)} text={seg} marks={marks} opts={opts} />
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
