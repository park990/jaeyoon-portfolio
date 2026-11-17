import type { Project } from "@/lib/projects";
import { EvidenceProvider, EvidenceTable } from "@/components/case/evidence";
import { CaseHeader, NextCase, type CaseSectionMeta } from "@/components/case/case-parts";

// 사례 페이지 공통 틀 (2단계)
// 메타 줄 → 문장형 제목 → 결과 타일 → 칸 목록 한 줄 → 요약 → 본문 칸(글 + 여백 주석)
// → 근거 목록 표(번호 | 내용 | 출처 | 종류) → 다음 사례
export function CaseLayout({
  project,
  sections,
  children,
}: {
  project: Project;
  /** 본문 칸 목록 (칸 목록 한 줄용, 근거 표 제외) */
  sections: CaseSectionMeta[];
  children: React.ReactNode;
}) {
  const hasEvidence = project.evidence.length > 0;
  // 등급 이름은 근거 표의 '종류' 칸에만 쓴다 — 제목에는 건수만
  const indexMeta: CaseSectionMeta = {
    id: "evidence",
    label: "근거",
    title: `수치 근거 ${project.evidence.length}건`,
  };
  // 근거가 없는 사례는 근거 표 칸을 만들지 않는다
  const toc = hasEvidence ? [...sections, indexMeta] : sections;

  return (
    <EvidenceProvider evidence={project.evidence} privateNote={project.privateNote}>
      <article className="site-wrap page case">
        <CaseHeader project={project} toc={toc} />
        {children}
        {hasEvidence && (
          <section id={indexMeta.id} aria-labelledby="evidence-title" className="sec mt-16">
            <p className="sec-label">{indexMeta.label}</p>
            <h2 id="evidence-title" className="mt-1">
              {indexMeta.title}
            </h2>
            <div className="mt-6">
              <EvidenceTable />
            </div>
          </section>
        )}
        <NextCase slug={project.slug} />
      </article>
    </EvidenceProvider>
  );
}
