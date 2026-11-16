import Link from "next/link";
import { getProjectBySlug, type Project } from "@/lib/projects";
import { CURRENT_WORK } from "@/lib/profile";
import { EvidenceProvider, Ev, GradeLabel } from "@/components/case/evidence";
import { FlowFigure } from "@/components/case/case-parts";
import { NumText } from "@/components/num-text";

// 작업 — 세로로 쌓는 가로 띠 4개.
// 왼쪽: 문장형 제목 · 역할·팀·기간 · 결과 2~3줄(등급) / 오른쪽: 그 프로젝트의 실제 흐름 그림.
// 재개발 띠는 「사실」의 공개 문장까지만. 그림·상세 페이지 없음(칸을 만들지 않음).

function Meta({ items }: { items: string[] }) {
  return (
    <p className="text-[14px] leading-[1.7] text-muted-foreground">
      {items.map((x, i) => (
        <span key={x}>
          {i > 0 && <span aria-hidden="true"> · </span>}
          {i === 0 ? <span className="font-semibold text-foreground">{x}</span> : x}
        </span>
      ))}
    </p>
  );
}

function ProjectBand({ p }: { p: Project }) {
  return (
    <EvidenceProvider evidence={p.evidence} linkBase={`/projects/${p.slug}`}>
      <li className="grid grid-cols-1 gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
        <div className="min-w-0 max-w-[680px]">
          <Meta items={[p.title, p.subtitle, p.role, `팀 ${p.team}`, p.period, p.status]} />
          <h3 className="mt-2 text-[22px] font-semibold leading-[1.42] tracking-[-0.01em] text-foreground sm:text-[24px]">
            {p.headline}
          </h3>
          <p className="mt-2 text-[15px] leading-[1.7] text-muted-foreground">
            <NumText text={p.oneLiner} />
            {p.oneLinerEv && <Ev ids={p.oneLinerEv} />}
          </p>
          <ul className="mt-4 space-y-1.5 text-[17px] leading-[1.7] text-foreground">
            {p.results?.map((r) => (
              <li key={r.text} className="relative pl-4">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[0.75em] h-[5px] w-[5px] rounded-full bg-muted-foreground"
                />
                <NumText text={r.text} />
                {r.ev && <Ev ids={r.ev} />}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[14px] leading-[1.6] text-muted-foreground">
            <span className="text-foreground">스택</span> {p.stack.join(" · ")}
          </p>
          <p className="mt-4 text-[15px]">
            <Link
              href={`/projects/${p.slug}`}
              className="font-medium text-primary underline underline-offset-4 hover:no-underline"
            >
              {p.title} 사례 페이지 →
            </Link>
          </p>
        </div>
        {p.flow && (
          <div className="min-w-0 lg:border-l lg:border-border lg:pl-10">
            <FlowFigure dense steps={p.flow} caption={p.flowCaption} />
          </div>
        )}
      </li>
    </EvidenceProvider>
  );
}

function CurrentWorkBand() {
  const w = CURRENT_WORK;
  return (
    <li className="py-10">
      <div className="max-w-[680px]">
        <Meta items={[w.name, w.role, `팀 ${w.team}`, w.period, w.status]} />
        <h3 className="mt-2 text-[22px] font-semibold leading-[1.42] tracking-[-0.01em] text-foreground sm:text-[24px]">
          {w.headline}
        </h3>
        <ul className="mt-4 space-y-1.5 text-[17px] leading-[1.7] text-foreground">
          {w.results.map((r) => (
            <li key={r.text} className="relative pl-4">
              <span
                aria-hidden="true"
                className="absolute left-0 top-[0.75em] h-[5px] w-[5px] rounded-full bg-muted-foreground"
              />
              <NumText text={r.text} />
              {r.grade && <GradeLabel grade={r.grade} className="ml-1" />}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function Work() {
  const sv = getProjectBySlug("structverify-lab")!;
  const t2g = getProjectBySlug("text2graph")!;
  const med = getProjectBySlug("medical-rag")!;
  return (
    <section id="work" aria-labelledby="work-title" className="border-t border-border-strong">
      <div className="mx-auto max-w-[1120px] px-4 pt-10 sm:px-6">
        <h2 id="work-title" className="text-[26px] font-semibold tracking-[-0.015em] text-foreground">
          작업
        </h2>
        <ol className="divide-y divide-border">
          <ProjectBand p={sv} />
          <CurrentWorkBand />
          <ProjectBand p={t2g} />
          <ProjectBand p={med} />
        </ol>
      </div>
    </section>
  );
}
