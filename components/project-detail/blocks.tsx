// 페이지 본문 반복 패턴: Tech Stack 카드 그리드, My Role 번호 카드, Trouble 카드, Results 그리드, Lessons 문단.
// 데이터만 다르고 형태는 일관 — 4개 새 프로젝트 페이지에서 그대로 재사용.

export function TechStackGrid({
  groups,
}: {
  groups: { category: string; items: string[] }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {groups.map((g) => (
        <div
          key={g.category}
          className="rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]/40"
        >
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {g.category}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {g.items.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export type Role = { title: string; bullets: string[] };

export function MyRoleCards({ roles, accent }: { roles: Role[]; accent: string }) {
  return (
    <div className="space-y-4">
      {roles.map((r, i) => (
        <div
          key={r.title}
          className="rounded-xl border border-border bg-card p-5 sm:p-6"
        >
          <div className="mb-3 flex items-start gap-3">
            <span
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-xs font-semibold"
              style={{ color: accent }}
            >
              {i + 1}
            </span>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {r.title}
            </h3>
          </div>
          <ul className="ml-10 space-y-2 text-sm leading-[1.8] text-foreground/85">
            {r.bullets.map((b) => (
              <li key={b} className="relative pl-4">
                <span
                  className="absolute left-0 top-[0.7em] h-1 w-1 rounded-full"
                  style={{ backgroundColor: accent }}
                  aria-hidden="true"
                />
                {b}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export type Trouble = {
  title: string;
  star?: boolean;
  problem: string;
  solve: string;
  lesson: string;
};

export function TroubleCards({
  troubles,
  accent,
}: {
  troubles: Trouble[];
  accent: string;
}) {
  return (
    <div className="space-y-4">
      {troubles.map((t, i) => (
        <div
          key={t.title}
          className="rounded-xl border border-border bg-card p-5 sm:p-6"
        >
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
            <span className="text-muted-foreground">{i + 1}.</span>
            {t.title}
            {t.star && (
              <span aria-label="대표 사례" title="대표 사례" style={{ color: accent }}>
                ⭐
              </span>
            )}
          </h3>
          <dl className="space-y-3 text-sm leading-[1.8]">
            <div>
              <dt className="font-medium text-muted-foreground">문제</dt>
              <dd className="mt-1 text-foreground/85">{t.problem}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">해결</dt>
              <dd className="mt-1 text-foreground/85">{t.solve}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">배운 점</dt>
              <dd className="mt-1 text-foreground/85">{t.lesson}</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
}

export function ResultsGrid({ items }: { items: string[] }) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((r) => (
        <li
          key={r}
          className="rounded-lg border border-border bg-card p-4 text-sm leading-[1.7] text-foreground/85"
        >
          {r}
        </li>
      ))}
    </ul>
  );
}

export function LessonsList({ items }: { items: string[] }) {
  return (
    <div className="space-y-5 text-base leading-[1.8] text-foreground/85 sm:text-[17px]">
      {items.map((l) => (
        <p key={l}>{l}</p>
      ))}
    </div>
  );
}
