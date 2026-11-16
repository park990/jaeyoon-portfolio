import Link from "next/link";
import { getNextProject, type FlowStep, type Project } from "@/lib/projects";
export type { FlowStep };
import { Ev } from "@/components/case/evidence";
import { NumText } from "@/components/num-text";

// 사례 페이지 공통 틀의 조각들 (서버 컴포넌트)

export type CaseSectionMeta = {
  id: string;
  /** 칸 이름: 문제 · 내가 맡은 것 · 흐름 · 결정과 이유 · 평가 · 안 된 것 · 다음에 고칠 것 */
  label: string;
  /** 그 칸의 결론을 말하는 구절 (본문 사실로만) */
  title: string;
};

/** 맨 위: 라벨 줄 → 문장형 제목 → 결과 수치 → 요약 → 리포 링크 */
export function CaseHeader({ project: p }: { project: Project }) {
  const labels = [p.kind, `팀 ${p.team}`, `역할 ${p.role}`, p.period, p.status];
  return (
    <header className="pb-10">
      <p className="text-[14px] leading-[1.7] text-muted-foreground">
        <span className="font-semibold text-foreground">{p.title}</span>
        {labels.map((l) => (
          <span key={l}>
            <span aria-hidden="true"> · </span>
            {l}
          </span>
        ))}
      </p>
      <h1 className="mt-3 text-[28px] font-semibold leading-[1.32] tracking-[-0.02em] text-foreground sm:text-[34px]">
        {p.headline}
      </h1>

      {p.metrics.length > 0 && (
        <dl className="mt-7 divide-y divide-border border-y border-border">
          {p.metrics.map((m) => (
            <div
              key={m.label}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-0.5 py-2.5 sm:grid-cols-[minmax(0,1fr)_auto_7.5rem]"
            >
              <dt className="text-[15px] text-muted-foreground">
                {m.label}
                {m.note && <span className="block text-[13.5px] leading-[1.5]">{m.note}</span>}
              </dt>
              <dd className="text-[17px] font-semibold text-foreground">
                <NumText text={m.value} />
              </dd>
              <dd className="col-span-2 text-left sm:col-span-1 sm:text-right">
                <Ev ids={m.ev} />
              </dd>
            </div>
          ))}
        </dl>
      )}

      <p className="mt-7 text-[17px] leading-[1.75] text-foreground">{p.summary}</p>

      {(p.repo || p.links?.length) && (
        <ul className="mt-5 space-y-1 text-[15px]">
          {p.repo && (
            <li>
              <span className="text-muted-foreground">리포 (커밋 고정) </span>
              <a
                href={p.repo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-num text-[14px] text-primary underline underline-offset-[3px] hover:no-underline"
              >
                {p.repo.label} ↗
              </a>
            </li>
          )}
          {p.links?.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-[3px] hover:no-underline"
              >
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

export function CaseSection({
  meta,
  children,
}: {
  meta: CaseSectionMeta;
  children: React.ReactNode;
}) {
  return (
    <section id={meta.id} aria-labelledby={`${meta.id}-title`} className="border-t border-border pt-10 pb-4">
      <p className="text-[13px] font-medium text-muted-foreground">{meta.label}</p>
      <h2
        id={`${meta.id}-title`}
        className="mt-1 text-[22px] font-semibold leading-[1.4] tracking-[-0.01em] text-foreground sm:text-[24px]"
      >
        {meta.title}
      </h2>
      <div className="mt-6 space-y-10">{children}</div>
    </section>
  );
}

/** 칸 안의 작은 묶음 제목 */
export function SubHead({ children, note }: { children: React.ReactNode; note?: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-[17px] font-semibold tracking-tight text-foreground">{children}</h3>
      {note && <p className="mt-1 text-[14px] leading-[1.6] text-muted-foreground">{note}</p>}
    </div>
  );
}

export function NextCase({ slug }: { slug: string }) {
  const next = getNextProject(slug);
  return (
    <nav aria-label="다음 사례" className="mt-16 border-t-2 border-border-strong pt-6">
      <Link href={`/projects/${next.slug}`} className="group block">
        <span className="block text-[13px] text-muted-foreground">다음 사례 · {next.title}</span>
        <span className="mt-1 block text-[19px] font-semibold leading-snug text-foreground group-hover:underline group-hover:underline-offset-4">
          {next.headline} →
        </span>
      </Link>
    </nav>
  );
}

// ─── 흐름 그림 ────────────────────────────────────────────────────────
// 본문(또는 리포)에 적힌 단계를 그대로 세로 흐름으로 그린다. 장식 없음.

export function FlowFigure({
  steps,
  caption,
  dense = false,
}: {
  steps: FlowStep[];
  caption?: React.ReactNode;
  dense?: boolean;
}) {
  return (
    <figure>
      <ol>
        {steps.map((s, i) => (
          <li key={s.name} className={`relative pl-9 ${i < steps.length - 1 ? (dense ? "pb-3" : "pb-5") : ""}`}>
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="absolute bottom-0 left-[11px] top-7 w-px bg-border-strong" />
            )}
            <span
              aria-hidden="true"
              className={
                "absolute left-0 top-[3px] flex h-[23px] w-[23px] items-center justify-center rounded-full font-num text-[11.5px] " +
                (s.mine
                  ? "bg-foreground text-background"
                  : "border border-border-strong bg-background text-foreground")
              }
            >
              {i + 1}
            </span>
            <p className={`${dense ? "text-[14.5px]" : "text-[15.5px]"} font-semibold leading-[1.5] text-foreground`}>
              {s.name}
              {s.mine && (
                <span className="ml-2 border border-border-strong px-1 py-px align-[1px] text-[11.5px] font-medium">
                  담당
                </span>
              )}
            </p>
            {s.detail && (
              <p className={`${dense ? "text-[13.5px]" : "text-[14.5px]"} leading-[1.55] text-muted-foreground`}>
                {s.detail}
                {s.ev && <Ev ids={s.ev} />}
              </p>
            )}
          </li>
        ))}
      </ol>
      {caption && <figcaption className="mt-4 text-[13.5px] leading-[1.6] text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
