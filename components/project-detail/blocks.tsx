// 사례 페이지 본문 반복 패턴. 형태 규칙: 항상 한 열 · 본문 17px/1.75 · 그림자·호버 이동 없음.
// 문장 끝에 근거 표시가 필요하면 Line을 { text, ev: [근거 id] }로 넘긴다.
import { Ev } from "@/components/case/evidence";

export type Line = string | { text: string; ev: string[] };

export function LineText({ line }: { line: Line }) {
  if (typeof line === "string") return <>{line}</>;
  return (
    <>
      {line.text}
      <Ev ids={line.ev} />
    </>
  );
}

const lineKey = (l: Line) => (typeof l === "string" ? l : l.text);

/** 사용 기술 — 분류: 항목 · 항목 */
export function TechStackGrid({
  groups,
}: {
  groups: { category: string; items: string[] }[];
}) {
  return (
    <dl className="divide-y divide-border border-y border-border text-[15px] leading-[1.6]">
      {groups.map((g) => (
        <div key={g.category} className="grid grid-cols-1 gap-x-4 gap-y-0.5 py-2.5 sm:grid-cols-[9.5rem_minmax(0,1fr)]">
          <dt className="text-muted-foreground">{g.category}</dt>
          <dd className="text-foreground">{g.items.join(" · ")}</dd>
        </div>
      ))}
    </dl>
  );
}

export type Role = { title: string; bullets: Line[] };

export function MyRoleCards({ roles }: { roles: Role[]; accent?: string }) {
  return (
    <ol className="space-y-8">
      {roles.map((r, i) => (
        <li key={r.title}>
          <h3 className="flex gap-3 text-[18px] font-semibold leading-snug tracking-tight text-foreground">
            <span className="font-num text-[14px] font-normal leading-[1.9] text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{r.title}</span>
          </h3>
          <ul className="mt-2 space-y-1.5 pl-9 text-[17px] leading-[1.75] text-foreground">
            {r.bullets.map((b) => (
              <li key={lineKey(b)} className="relative pl-4">
                <span
                  className="absolute left-0 top-[0.8em] h-[5px] w-[5px] rounded-full bg-muted-foreground"
                  aria-hidden="true"
                />
                <LineText line={b} />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
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

export function TroubleCards({ troubles }: { troubles: Trouble[]; accent?: string }) {
  return (
    <ol className="space-y-10">
      {troubles.map((t, i) => (
        <li key={t.title}>
          <h3 className="flex gap-3 text-[18px] font-semibold leading-snug tracking-tight text-foreground">
            <span className="font-num text-[14px] font-normal leading-[1.9] text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>
              {t.title}
              {t.star && (
                <span className="ml-1.5 text-[13px] font-normal text-muted-foreground">(대표 사례)</span>
              )}
            </span>
          </h3>
          <dl className="mt-3 space-y-3 pl-9 text-[17px] leading-[1.75]">
            {(
              [
                ["문제", t.problem, t.ev?.problem],
                ["해결", t.solve, t.ev?.solve],
                ["배운 점", t.lesson, t.ev?.lesson],
              ] as const
            ).map(([k, v, ev]) => (
              <div key={k}>
                <dt className="text-[14px] font-medium text-muted-foreground">{k}</dt>
                <dd className="text-foreground">
                  {v}
                  {ev && <Ev ids={[...ev]} />}
                </dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ol>
  );
}

export function ResultsGrid({ items }: { items: Line[] }) {
  return (
    <ul className="space-y-2 text-[17px] leading-[1.75] text-foreground">
      {items.map((r) => (
        <li key={lineKey(r)} className="relative pl-4">
          <span
            className="absolute left-0 top-[0.8em] h-[5px] w-[5px] rounded-full bg-muted-foreground"
            aria-hidden="true"
          />
          <LineText line={r} />
        </li>
      ))}
    </ul>
  );
}

export function LessonsList({ items }: { items: Line[] }) {
  return (
    <div className="space-y-5 text-[17px] leading-[1.75] text-foreground">
      {items.map((l) => (
        <p key={lineKey(l)}>
          <LineText line={l} />
        </p>
      ))}
    </div>
  );
}

/** 단순 목록 (What I built 등) */
export function PlainList({ items }: { items: Line[] }) {
  return <ResultsGrid items={items} />;
}
