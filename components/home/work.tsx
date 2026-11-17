import Link from "next/link";
import { getProjectBySlug, type Project } from "@/lib/projects";
import { CURRENT_WORK } from "@/lib/profile";
import { EvidenceProvider, Graded } from "@/components/case/evidence";
import { FlowFigure, MetaLine } from "@/components/case/case-parts";
import { InlineText, markKind, markedWords, marksFor } from "@/components/case/inline";

// 작업 — 띠 4개 (순서 · 내용은 1단계 그대로). 2단(.band), 좁으면 1단.
// 왼쪽: 문장형 제목 → 메타 → 요약 문장(16px) → 결과 줄(15.5px) → 스택(13px) → "○○ 사례 읽기"
// 오른쪽: 단계 목록(.steps), 담당 단계는 굵은 글씨.
// [2.5단계] 형광은 결과 줄에만 — 줄마다 핵심 값 1개, 한 띠 안에서 같은 값은 처음 한 번.
//          요약 문장·단계 설명에는 없다(추정 점선과 근거 번호는 유지).
// 재개발 띠는 「사실」의 공개 문장까지만. 그림·상세 페이지 없음(칸을 만들지 않음).

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
          <MetaLine className="mt-3" items={[p.title, p.subtitle, p.role, `팀 ${p.team}`, p.period, p.status]} />
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

function CurrentWorkBand() {
  const w = CURRENT_WORK;
  const kind = markKind(w.ratioGrade);
  return (
    <article aria-labelledby="band-current" className="band mt-12 border-t border-rule">
      <div className="min-w-0 max-w-[690px]">
        <h3 id="band-current" className="sent-title">
          {w.headline}
        </h3>
        <MetaLine className="mt-3" items={[w.name, w.role, w.period, w.status]} />
        <ul className="dash-list mt-3 space-y-1 text-[15.5px] leading-[1.7]">
          <li>
            {/* 괄호 안 형광은 "( 값 )"처럼 벌어져서 쉼표로 이었다 */}
            <InlineText
              text={`${w.audition}, 경쟁률 ${w.ratio}`}
              marks={kind ? [{ s: w.ratio, kind }] : []}
            />
          </li>
          <li>{w.mentor}</li>
        </ul>
      </div>
    </article>
  );
}

export function Work() {
  const sv = getProjectBySlug("structverify-lab")!;
  const t2g = getProjectBySlug("text2graph")!;
  const med = getProjectBySlug("medical-rag")!;
  return (
    // [2.5단계] 첫 화면 아래 여백을 clamp(32px, 2.8vw, 40px)로 — 1440×789에서 이 구획 선이 화면 안에 걸리게
    <section id="work" aria-labelledby="work-title" className="sec mt-[clamp(32px,2.8vw,40px)]">
      <h2 id="work-title" className="sec-label">
        작업
      </h2>
      <ProjectBand p={sv} first />
      <CurrentWorkBand />
      <ProjectBand p={t2g} />
      <ProjectBand p={med} />
    </section>
  );
}
