import { GRADES, type Project } from "@/lib/projects";
import { EvidenceList, EvidenceProvider } from "@/components/case/evidence";
import {
  CaseHeader,
  CaseSection,
  NextCase,
  type CaseSectionMeta,
} from "@/components/case/case-parts";

// 사례 페이지 공통 틀.
// - 1200px 이상: 본문 한 열(680px) + 오른쪽 여백에 목차와 근거 주석
// - 그보다 좁으면 한 열, 근거는 문장 끝 표시를 눌러 펼친다
// - 본문 끝: 근거 색인 → 다음 사례
export function CaseLayout({
  project,
  sections,
  children,
}: {
  project: Project;
  /** 본문 칸 목록 (목차용, 근거 색인 제외) */
  sections: CaseSectionMeta[];
  children: React.ReactNode;
}) {
  const counts = GRADES.map((g) => ({
    g,
    n: project.evidence.filter((e) => e.grade === g).length,
  })).filter((x) => x.n > 0);

  const hasEvidence = project.evidence.length > 0;
  const indexMeta: CaseSectionMeta = {
    id: "evidence",
    label: "근거 색인",
    title: `수치 근거 ${project.evidence.length}건 — ${counts.map((c) => `${c.g} ${c.n}`).join(" · ")}`,
  };
  // 근거가 없는 사례는 근거 색인 칸을 만들지 않는다
  const toc = hasEvidence ? [...sections, indexMeta] : sections;

  return (
    <EvidenceProvider evidence={project.evidence}>
      <div className="mx-auto max-w-[1120px] px-4 pb-24 pt-10 sm:px-6 sm:pt-14 min-[1200px]:grid min-[1200px]:grid-cols-[680px_minmax(0,1fr)] min-[1200px]:gap-x-16">
        <article className="min-w-0 max-w-[680px]">
          <CaseHeader project={project} />
          {children}
          {hasEvidence && (
            <CaseSection meta={indexMeta}>
              <EvidenceList />
            </CaseSection>
          )}
          <NextCase slug={project.slug} />
        </article>

        <aside aria-label="목차와 근거 주석" className="hidden min-[1200px]:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-6 pr-1">
            <p className="text-[13px] font-medium text-muted-foreground">목차</p>
            <ol className="mt-2 space-y-1.5 text-[14px] leading-[1.5]">
              {toc.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-foreground hover:underline hover:underline-offset-4">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="block">{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
            {hasEvidence && (
              <>
                <p className="mt-8 text-[13px] font-medium text-muted-foreground">근거 주석</p>
                <div className="mt-2">
                  <EvidenceList compact idPrefix="ev-" />
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </EvidenceProvider>
  );
}
