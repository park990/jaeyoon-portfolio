import type { Metadata } from "next";
import { Section, Prose } from "@/components/project-detail/section";
import { ProjectHeader, ProjectFooter } from "@/components/project-detail/layout";
import { getProjectBySlug } from "@/lib/projects";

const SLUG = "medical-rag";
const ACCENT = "#F59E0B";

export const metadata: Metadata = {
  title: "Medical RAG Experiment · Jaeyoon Park",
  description:
    "Qwen2.5-7B + ChromaDB 의료 챗봇에서 LLM 단독 65.4% → +RAG 63.1% 하락을 측정·원인 분석한 실험.",
};

// Phase 1 — IA 카드에서 detail로 들어왔을 때 라우팅 404를 막기 위한 stub.
// 케이스 스터디 본문(문제·결정·결과·트러블슈팅)은 Phase 2(PR 3)에서 채움.
export default function MedicalRagPage() {
  const project = getProjectBySlug(SLUG)!;

  return (
    <article
      className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:pt-16"
      style={{ "--accent": ACCENT } as React.CSSProperties}
    >
      <ProjectHeader
        project={project}
        oneLiner="Qwen2.5-7B + ChromaDB 의료 챗봇에서 LLM 단독 65.4% → +RAG 63.1%로 하락. 검색된 무관 context가 distraction이 된 원인을 케이스 단위로 분석."
        period="2026.04 (1주)"
        team="4명"
        links={project.links}
      />

      <Section id="overview" title="Overview">
        <Prose>
          <p>
            <span className="rounded bg-[var(--accent)]/15 px-1.5 py-0.5 text-[var(--accent)]">
              [작성 중]
            </span>{" "}
            상세 케이스 스터디는 Phase 2(PR 3)에서 채워집니다.
            현재는 카드/라우팅 동작 확인용 stub입니다.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            예정 골격: 문제·제약 → 내 역할 → 핵심 결정(왜 RAG를
            붙였나/뺐나·검색 chunk 신호대잡음비) → 아키텍처 → 측정된 결과
            (LLM 단독 65.4% → +RAG 63.1%) → 트러블슈팅(&quot;대상포진 치료제&quot;
            질문에 &quot;수두 백신&quot; chunk가 잡혀 오답 유도) → 다음 시도(relevance
            gate, adaptive RAG, retrieval recall@k 선측정).
          </p>
        </Prose>
      </Section>

      <ProjectFooter currentSlug={SLUG} />
    </article>
  );
}
