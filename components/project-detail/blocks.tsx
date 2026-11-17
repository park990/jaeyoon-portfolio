// 사례 페이지 본문 반복 패턴. 한 열 · 본문 17px · 둥근 점·카드 없음.
// 문장 끝에 근거가 필요하면 Line을 { text, ev: [근거 id] }로 넘긴다(숫자 표시와 "근거 n"이 붙는다).
// 여백 주석을 항목마다 두기 위해, 여러 항목 목록은 배열을 돌려주는 함수(roleItems 등)로도 쓴다.
// → CaseSection의 직계 자식이 되면 항목마다 한 줄(글 + 주석)이 된다.
import { Graded } from "@/components/case/evidence";

export type Line = string | { text: string; ev: string[] };

export function LineText({ line }: { line: Line }) {
  if (typeof line === "string") return <Graded text={line} />;
  return <Graded text={line.text} ev={line.ev} />;
}

const lineKey = (l: Line) => (typeof l === "string" ? l : l.text);

/** 사용 기술: 분류 | 항목, 항목 */
export function TechStackGrid({
  groups,
}: {
  groups: { category: string; items: string[] }[];
}) {
  return (
    <dl className="border-t border-rule text-[15px] leading-[1.6]">
      {groups.map((g) => (
        <div
          key={g.category}
          className="grid grid-cols-1 gap-x-4 gap-y-0.5 border-b border-rule py-2.5 sm:grid-cols-[9.5rem_minmax(0,1fr)]"
        >
          <dt className="text-note">{g.category}</dt>
          <dd className="text-ink">{g.items.join(", ")}</dd>
        </div>
      ))}
    </dl>
  );
}

/** 번호 + 제목 (01, 02 …) */
export function ItemTitle({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h3 className="flex gap-3 text-[18px] font-semibold leading-[1.5] text-ink">
      <span className="w-6 shrink-0 text-[14px] font-normal leading-[1.95] text-note">
        {String(n).padStart(2, "0")}
      </span>
      <span>{children}</span>
    </h3>
  );
}

export type Role = { title: string; bullets: Line[] };

function RoleItem({ r, n }: { r: Role; n: number }) {
  return (
    <div>
      <ItemTitle n={n}>{r.title}</ItemTitle>
      <ul className="dash-list mt-2 space-y-1.5 pl-9 text-[17px] leading-[1.8] text-ink">
        {r.bullets.map((b) => (
          <li key={lineKey(b)}>
            <LineText line={b} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 맡은 일 목록 — 항목마다 한 줄이 되도록 배열로 돌려준다 */
export function roleItems(roles: Role[], start = 1) {
  return roles.map((r, i) => <RoleItem key={r.title} r={r} n={start + i} />);
}

export type Trouble = {
  title: string;
  star?: boolean;
  problem: string;
  solve: string;
  lesson: string;
  /** 칸별 근거 id */
  ev?: { problem?: string[]; solve?: string[]; lesson?: string[] };
};

function TroubleItem({ t, n }: { t: Trouble; n: number }) {
  return (
    <div>
      <ItemTitle n={n}>
        {t.title}
        {t.star && <span className="ml-1.5 text-[13px] font-normal text-note">(대표 사례)</span>}
      </ItemTitle>
      <dl className="mt-3 space-y-3 pl-9 text-[17px] leading-[1.8]">
        {(
          [
            ["문제", t.problem, t.ev?.problem],
            ["해결", t.solve, t.ev?.solve],
            ["배운 점", t.lesson, t.ev?.lesson],
          ] as const
        ).map(([k, v, ev]) => (
          <div key={k}>
            <dt className="text-[14px] text-note">{k}</dt>
            <dd className="text-ink">
              <Graded text={v} ev={ev} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** 안 된 것(트러블) 목록 — 항목마다 한 줄 */
export function troubleItems(troubles: Trouble[], start = 1) {
  return troubles.map((t, i) => <TroubleItem key={t.title} t={t} n={start + i} />);
}

export function ResultsGrid({ items }: { items: Line[] }) {
  return (
    <ul className="dash-list space-y-2 text-[17px] leading-[1.8] text-ink">
      {items.map((r) => (
        <li key={lineKey(r)}>
          <LineText line={r} />
        </li>
      ))}
    </ul>
  );
}

/** 다음에 고칠 것(배운 점) — 문단마다 한 줄 */
export function lessonItems(items: Line[]) {
  return items.map((l) => (
    <p key={lineKey(l)} className="text-ink">
      <LineText line={l} />
    </p>
  ));
}

/** 단순 목록 (What I built 등) */
export function PlainList({ items }: { items: Line[] }) {
  return <ResultsGrid items={items} />;
}
