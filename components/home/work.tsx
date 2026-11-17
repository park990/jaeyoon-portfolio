import Link from "next/link";
import { getProjectBySlug, type Project } from "@/lib/projects";
import { EvidenceProvider, Ev, Graded } from "@/components/case/evidence";
import { FlowFigure, MetaLine } from "@/components/case/case-parts";
import { extProps, markedWords, marksFor } from "@/components/case/inline";

// 작업 — 띠 4개 (순서 · 내용은 1단계 그대로). 2단(.band), 좁으면 1단.
// 왼쪽: 문장형 제목 → 메타 → 요약 문장(16px) → 결과 줄(15.5px) → 스택(13px) → "○○ 사례 읽기"
// 오른쪽: 단계 목록(.steps), 담당 단계는 굵은 글씨.
// [2.5단계] 형광은 결과 줄에만 — 줄마다 핵심 값 1개, 한 띠 안에서 같은 값은 처음 한 번.
//          요약 문장·단계 설명에는 없다(추정 점선과 근거 번호는 유지).
// [4단계] 재개발 스캐너도 같은 띠. 메타 줄은 homeMeta, 결과 줄 아래 선정 줄은 homeNote
//          (형광 1개 + 출처 링크 + 근거 번호).

function ProjectBand({ p, first }: { p: Project; first?: boolean }) {
  // 결과 줄마다 형광 1개, 앞 줄에서 쓴 값은 다시 쓰지 않는다
  const used: string[] = [];
  const results = (p.results ?? []).map((r) => {
    const exclude = [...used];
    used.push(...markedWords(r.text, marksFor(p.evidence, r.ev), { max: 1, exclude }));
    return { ...r, exclude };
  });
  return (
    <EvidenceProvider evidence={p.evidence} linkBase={`/projects/${p.slug}`}>
      <article aria-labelledby={`band-${p.slug}`} className={`band ${first ? "" : "mt-12 border-t border-rule"}`}>
        <div className="min-w-0">
          <h3 id={`band-${p.slug}`} className="sent-title">
            {p.headline}
          </h3>
          <MetaLine
            className="mt-3"
            items={p.homeMeta ?? [p.title, p.subtitle, p.role, ...(p.team ? [`팀 ${p.team}`] : []), p.period, p.status]}
          />
          <p className="mt-3 text-[16px] leading-[1.75]">
            <Graded text={p.oneLiner} ev={p.oneLinerEv} hl={false} />
          </p>
          {results.length > 0 && (
            <ul className="dash-list mt-3 space-y-1 text-[15.5px] leading-[1.7]">
              {results.map((r) => (
                <li key={r.text}>
                  <Graded text={r.text} ev={r.ev} max={1} exclude={r.exclude} />
                </li>
              ))}
              {p.homeNote && (
                <li>
                  <Graded text={p.homeNote.text} ev={p.homeNote.ev} refs={false} max={1} />
                  {p.homeNote.ev && <Ev ids={p.homeNote.ev} />}
                  {p.homeNote.link && (
                    <span className="ev-ref">
                      <a href={p.homeNote.link.href} {...extProps(p.homeNote.link.href)}>
                        {p.homeNote.link.label}
                      </a>
                    </span>
                  )}
                </li>
              )}
            </ul>
          )}
          <p className="mt-3 text-[13px] leading-[1.6] text-note">스택 {p.stack.join(", ")}</p>
          <p className="mt-3 text-[15px]">
            <Link href={`/projects/${p.slug}`} className="hit">
              {p.title} 사례 읽기
            </Link>
          </p>
        </div>
        {p.flow && (
          <div className="min-w-0">
            <FlowFigure steps={p.flow} caption={p.flowCaption} />
          </div>
        )}
      </article>
    </EvidenceProvider>
  );
}

export function Work() {
  const sv = getProjectBySlug("structverify-lab")!;
  const redev = getProjectBySlug("redev-scanner")!;
  const t2g = getProjectBySlug("text2graph")!;
  const med = getProjectBySlug("medical-rag")!;
  return (
    // [2.5단계] 첫 화면 아래 여백을 clamp(32px, 2.8vw, 40px)로 — 1440×789에서 이 구획 선이 화면 안에 걸리게
    <section id="work" aria-labelledby="work-title" className="sec mt-[clamp(32px,2.8vw,40px)]">
      <h2 id="work-title" className="sec-label">
        작업
      </h2>
      <ProjectBand p={sv} first />
      <ProjectBand p={redev} />
      <ProjectBand p={t2g} />
      <ProjectBand p={med} />
    </section>
  );
}
