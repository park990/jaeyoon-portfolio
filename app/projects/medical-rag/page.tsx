import type { Metadata } from "next";
import { TrendingDown, Search, Compass, type LucideIcon } from "lucide-react";
import { Section, Prose } from "@/components/project-detail/section";
import { CodeBlock } from "@/components/project-detail/code-block";
import {
  ProjectHeader,
  ProjectFooter,
} from "@/components/project-detail/layout";
import {
  TechStackGrid,
  MyRoleCards,
  TroubleCards,
  ResultsGrid,
  LessonsList,
  type Role,
  type Trouble,
} from "@/components/project-detail/blocks";
import { getProjectBySlug } from "@/lib/projects";

const SLUG = "medical-rag";
const ACCENT = "#F59E0B";
const REPO = "https://github.com/ljhljh0703-cmd/Medical-Chatbot/tree/dev";

export const metadata: Metadata = {
  title: "Medical RAG Experiment · Jaeyoon Park",
  description:
    "Qwen2.5-7B + ChromaDB 의료 챗봇에서 RAG가 정확도를 65.4% → 63.1%로 떨어뜨린 걸 측정하고 원인까지 분석한 실험.",
};

// TL;DR Highlights — 음성 결과를 강점으로 framing (브리프 §4(2)).
type Highlight = {
  icon: LucideIcon;
  label: string;
  value: string;
  note: string;
  accent?: boolean;
};

const HIGHLIGHTS: Highlight[] = [
  {
    icon: TrendingDown,
    label: "LLM 단독 vs +RAG",
    value: "−2.3pt",
    note: "65.4% → 63.1% (Qwen2.5-7B / VL 평가셋)",
    accent: true,
  },
  {
    icon: Search,
    label: "원인",
    value: "Distraction",
    note: "주제는 비슷하지만 정답을 가르지 못하는 chunk가 맞던 문제까지 흔듦",
  },
  {
    icon: Compass,
    label: "다음 시도",
    value: "Adaptive RAG",
    note: "relevance gate · 리랭커 · retrieval recall@k 선측정",
  },
];

const techStack = [
  {
    category: "Model",
    items: ["Qwen2.5-7B-Instruct (4bit)", "Colab A100 (Google Colab Pro)"],
  },
  {
    category: "RAG",
    items: ["ChromaDB", "ko-sroberta (임베딩)", "BM25 + Dense Hybrid 옵션 (측정은 Dense)", "top-k = 5"],
  },
  {
    category: "Evaluation",
    items: ["VL 데이터셋 자동 평가", "객관식 번호 매칭", "단답 키워드 매칭"],
  },
];

// 핵심 결정·이유 — "왜 이걸 골랐고 뭘 안 골랐나" (브리프 §1.3)
const KEY_DECISIONS = [
  {
    title: "RAG를 의료 챗봇에 붙인 이유",
    body:
      "가설은 LLM의 의학 지식 공백을 외부 자료로 메우면 정답률이 오른다는 것이었습니다. 의료 도메인은 정확도 비용이 큰 분야라 검증 가치가 큰 가설이었습니다. 측정 결과는 이 가설을 반박했고, 그 반박 자체가 이 실험의 결과물입니다.",
  },
  {
    title: "ChromaDB vs FAISS",
    body:
      "FAISS는 인덱스 직렬화와 persist를 별도 단계로 관리해야 합니다. ChromaDB는 PoC 규모에서 메타데이터·벡터·persist를 단일 라이브러리로 처리할 수 있어 채택했습니다. 운영 부담을 우선했습니다.",
  },
  {
    title: "Dense vs Hybrid retrieval",
    body:
      "코드 단에 BM25 + Dense fusion 옵션을 두되, ablation 측정 시점엔 Dense만 사용했습니다. RAG가 가장 단순한 구성에서 도움이 되는지 해가 되는지를 먼저 보는 게 목적이었기 때문입니다. Hybrid는 다음 라운드 변수로 남겨뒀습니다.",
  },
];

const roles: Role[] = [
  {
    title: "RAG 파이프라인 구축",
    bullets: [
      "원천 의학 텍스트 3,447개 문서를 500자 단위로 chunking → 약 27,000 chunk 생성",
      "ko-sroberta 임베딩 → ChromaDB persist (vector + 메타데이터 + 컬렉션 자동 영구화)",
      "Dense retrieval 기반 (Hybrid fusion 옵션은 팀원이 별도 구현, ablation 본 측정은 Dense 기준)",
    ],
  },
  {
    title: "자동 평가 시스템",
    bullets: [
      "VL 데이터셋 기반 평가 파이프라인 (`evaluation/metrics.py` 216줄 · `notebooks/colab_generation_eval.ipynb` 449줄)",
      "객관식: 번호 매칭 (모델 출력에서 번호 추출 → 정답 라벨 비교)",
      "단답: 키워드 매칭 (정답 키워드 포함 여부)",
      "Mode A (LLM only) vs Mode B (LLM + RAG) 두 경로를 동일 데이터셋에 일괄 실행",
    ],
  },
  {
    title: "Ablation 측정 + 원인 분석",
    bullets: [
      "LLM 단독 65.4% → +RAG 63.1% (−2.3pt) 측정",
      "오답으로 전환된 케이스를 수동 추적해 distraction 패턴 분류",
      "대표 사례: '대상포진 치료제' 질문에 같은 VZV로 임베딩이 가까운 '수두 백신' chunk가 top-k에 잡혀 모델이 백신 쪽으로 오답",
    ],
  },
  {
    title: "Out of scope (팀원 담당)",
    bullets: [
      "LoRA fine-tuning (`training/main_train.py`, `adapter_config.json` 등) — 팀원 담당. 본 실험의 ablation에는 포함하지 않음 (LLM 단독 vs LLM+RAG 2-stage 비교만).",
      "FastAPI 서빙 레이어 (`src/app/main.py`, `routers/chat.py`, `schemas/chat.py`) — 팀원 담당. 본 페이지의 기여 영역 외부.",
      "Hybrid fusion 코드 (`src/retrieval/hybrid/fusion.py` — RRF · weighted_sum) — 팀원이 옵션 형태로 구현. ablation 측정에는 Dense만 사용했으므로 본 페이지 결과 수치는 hybrid 영향을 받지 않음.",
    ],
  },
];

const troubles: Trouble[] = [
  {
    title: "RAG가 가설과 반대로 정확도를 떨어뜨림",
    star: true,
    problem:
      "측정 결과 LLM 단독 65.4% → +RAG 63.1%로 2.3pt 하락. '의학 지식 공백을 메우면 오를 것'이라는 도입 근거가 무너졌습니다. RAG는 항상 +가 아니라는 일반론은 알고 있었지만, 우리 데이터셋에서 실제로 −가 나온 원인을 짚어야 했습니다.",
      solve:
      "오답으로 전환된 케이스를 직접 들춰보니 두 가지 패턴이 보였습니다. (1) 모델이 이미 아는 문제가 많아 RAG로 메울 지식 공백이 작았고, (2) 검색이 '주제는 비슷하지만 정답을 가르지 못하는' chunk를 가져왔습니다. relevance gate/리랭커 없이 top-k=5를 그대로 주입한 점, 500자 chunk의 낮은 신호대잡음비가 distraction을 키운 원인.",
    lesson:
      "RAG를 켜는 순간 정답률이 오른다는 가정 자체가 우리 데이터에선 성립하지 않았습니다. 이 한 번의 측정으로, 새 RAG 시스템을 설계할 때 retrieval recall@k부터 먼저 측정한 뒤 LLM에 붙일지를 결정하는 습관이 생겼습니다.",
  },
  {
    title: "'대상포진 치료제'에 '수두 백신' chunk가 잡힘",
    star: true,
    problem:
      "구체 케이스. 사용자가 '대상포진 치료제'를 물으면 ko-sroberta 임베딩 공간에서 같은 VZV(varicella-zoster virus) 도메인의 '수두 백신' chunk가 top-k 안으로 들어왔습니다. 모델은 검색된 context에 끌려가 백신 쪽으로 답을 비틀었고, 원래 LLM 단독으로는 맞히던 문제까지 오답으로 떨어졌습니다.",
    solve:
      "ablation 측정 안에서는 별도 처리 없이 distraction 케이스로 분류해 기록. 구조적 해결책은 다음 시도(아래 Lessons)로 묶었습니다: relevance threshold + 리랭커로 1차 거름, 또는 모델이 불확실할 때만 검색을 트리거하는 adaptive RAG.",
    lesson:
      "임베딩 거리가 가깝다 = 주제가 가깝다지, 정답을 가르는 chunk가 가깝다는 보장은 아니다. 같은 도메인 어휘끼리도 '치료제 vs 백신'처럼 핵심을 다르게 가르는 축이 있는데, 임베딩만으로는 그 축을 못 잡습니다. 검색 단계에 도메인 규칙·리랭커 한 층을 더 두는 패턴을 이후 StructVerify의 KOSIS 표 매칭 필터로도 가져왔습니다.",
  },
];

const evalCode = `# notebooks/colab_generation_eval.ipynb — 2-stage ablation (Mode A vs Mode B)

# Mode A: LLM only
out_a = generation_service.generate(question, context=None)

# Mode B: LLM + RAG
ctx = build_rag_context(question, top_k=5)   # ChromaDB 검색
out_b = generation_service.generate(question, context=ctx)

# 자동 채점 — 객관식 번호 매칭 / 단답 키워드 매칭
score_a = match_objective(out_a, gt) or match_keywords(out_a, gt)
score_b = match_objective(out_b, gt) or match_keywords(out_b, gt)

# 결과: 같은 VL 데이터셋에서 Mode A 65.4% / Mode B 63.1% (−2.3pt)
`;

export default function MedicalRagPage() {
  const project = getProjectBySlug(SLUG)!;

  return (
    <article
      className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:pt-16"
      style={{ "--accent": ACCENT } as React.CSSProperties}
    >
      <ProjectHeader
        project={project}
        oneLiner="의료 챗봇에 RAG를 붙이면 정답률이 오를까. Qwen2.5-7B + ChromaDB로 ablation을 돌려 LLM 단독 65.4% → +RAG 63.1% (−2.3pt)를 측정하고, distraction 원인까지 케이스 단위로 추적."
        period="2026.04"
        team="4명 (NLP 과정 팀 프로젝트)"
        links={[{ label: "GitHub (dev)", href: REPO }]}
      />

      {/* TL;DR — 음성 결과를 강점으로 framing */}
      <section
        aria-label="Highlights"
        className="-mt-2 mb-12 grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        {HIGHLIGHTS.map((h) => {
          const Icon = h.icon;
          return (
            <div
              key={h.label}
              className={
                "rounded-xl border p-4 sm:p-5 " +
                (h.accent
                  ? "border-[var(--accent)]/50 bg-[var(--accent)]/5"
                  : "border-border bg-card")
              }
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={
                    "h-4 w-4 " +
                    (h.accent ? "text-[var(--accent)]" : "text-muted-foreground")
                  }
                  aria-hidden="true"
                />
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {h.label}
                </p>
              </div>
              <p
                className={
                  "mt-2 text-xl font-semibold tracking-tight sm:text-2xl " +
                  (h.accent ? "text-[var(--accent)]" : "text-foreground")
                }
              >
                {h.value}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {h.note}
              </p>
            </div>
          );
        })}
      </section>

      <Section id="overview" title="Overview">
        <Prose>
          <p>
            팀 프로젝트 자체는 의료 도메인 챗봇을 만드는 것이었고, 그중 제가
            맡은 부분은 RAG 파이프라인과 평가였습니다. &lsquo;RAG를 붙이면
            정답률이 오른다&rsquo;는 가설을 같은 평가셋에서 측정해봤는데,
            결과는 오히려 <span className="font-medium text-foreground">2.3pt 하락</span>으로
            가설을 반박했습니다. 그래서 RAG를 붙이는 데서 멈추지 않고,
            어떤 경우에 RAG가 정답을 흔드는지 오답 케이스를 직접 추적해
            원인을 분석했습니다.
          </p>
          <p>
            Qwen2.5-7B-Instruct(4bit) + ChromaDB 기반으로 LLM 단독(Mode A) vs
            LLM + RAG(Mode B) 2-stage ablation을 동일 평가셋에 돌렸고,
            전환된 오답 케이스를 수동 추적해 distraction 패턴까지 정리했습니다.
          </p>
        </Prose>
      </Section>

      <Section id="stack" title="Tech Stack">
        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
          ※ <span className="text-foreground">RAG 파이프라인 + 자동 평가 영역</span>
          만 직접 다룸. LoRA fine-tuning은 팀원 담당으로 본 실험 ablation
          외부.
        </p>
        <TechStackGrid groups={techStack} />
      </Section>

      <Section id="decisions" title="핵심 결정 · 이유">
        <div className="space-y-3">
          {KEY_DECISIONS.map((d, i) => (
            <div
              key={d.title}
              className="rounded-xl border border-border bg-card p-5 sm:p-6"
            >
              <div className="mb-2.5 flex items-start gap-3">
                <span
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-xs font-semibold"
                  style={{ color: ACCENT }}
                >
                  {i + 1}
                </span>
                <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground sm:text-lg">
                  {d.title}
                </h3>
              </div>
              <p className="ml-10 text-sm leading-[1.8] text-foreground/85">
                {d.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="role" title="My Role">
        <MyRoleCards roles={roles} accent={ACCENT} />
      </Section>

      <Section id="code" title="Code Highlights">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            2-stage ablation 실행 흐름 — 동일 질문을 Mode A / Mode B에 통과시켜
            동일 채점 규칙으로 비교.
          </p>
          <CodeBlock
            code={evalCode}
            lang="python"
            filename="notebooks/colab_generation_eval.ipynb (요약)"
          />
        </div>
      </Section>

      <Section id="trouble" title="Trouble-shooting">
        <TroubleCards troubles={troubles} accent={ACCENT} />
      </Section>

      <Section id="results" title="Results">
        {/* 평가 결과 시각 placeholder — 추후 이미지 추가 */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          <div
            className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--accent)]/40 bg-[var(--accent)]/5 p-4 text-center text-xs text-muted-foreground"
            role="img"
            aria-label="평가 결과표 placeholder"
          >
            <TrendingDown
              className="h-7 w-7 text-[var(--accent)]/70"
              aria-hidden="true"
            />
            <span>
              [이미지 자리:
              <br />
              평가 결과표 (Mode A 65.4% vs Mode B 63.1%)]
            </span>
          </div>
          <div
            className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 p-4 text-center text-xs text-muted-foreground"
            role="img"
            aria-label="예시 케이스 placeholder"
          >
            <Search className="h-7 w-7 text-muted-foreground/60" aria-hidden="true" />
            <span>
              [이미지 자리:
              <br />
              예시 케이스 (대상포진 치료제 → 수두 백신 chunk distraction)]
            </span>
          </div>
        </div>

        <ResultsGrid
          items={[
            "LLM 단독 65.4% → +RAG 63.1% (−2.3pt) — 2-stage ablation 측정 (LoRA 제외)",
            "원천 의학 텍스트 3,447개 → 500자 chunking → 약 27,000 chunk → ko-sroberta 임베딩 → ChromaDB persist",
            "자동 평가 파이프라인: 객관식 번호 매칭 + 단답 키워드 매칭 (VL 데이터셋 일괄)",
            "오답 전환 케이스 수동 추적 — '대상포진 치료제' ↔ '수두 백신' 같은 같은-도메인 distraction 패턴 식별",
          ]}
        />
      </Section>

      <Section id="lessons" title="Lessons Learned · 다음 시도">
        <LessonsList
          items={[
            "RAG만 붙이면 정답률이 오를 줄 알았는데, 측정해 보니 오히려 2.3pt가 떨어졌습니다. 다음에 RAG를 붙일 땐 켜기 전에 retrieval recall@k부터 재고, 그 점수가 LLM 단독보다 의미 있게 높을 때만 붙일 생각입니다.",
            "코사인 점수가 높길래 잘 찾았다고 생각했는데, 정작 모델은 그 chunk에 끌려가서 오답이 더 늘었습니다. 임베딩이 가깝다는 건 주제가 가깝다는 뜻일 뿐, 정답을 가르는 chunk가 가깝다는 보장은 아니었습니다. 그래서 지금은 검색 뒤에 도메인 규칙이나 리랭커를 한 층 더 둡니다.",
            "처음엔 그냥 ChromaDB를 깔고 시작했는데, Colab에서 의존성 충돌로 세팅에만 한참을 썼습니다. 27k chunk를 한 번 인덱싱하고 ablation으로 반복 검색만 하는 용도엔 persistence·메타데이터가 필요 없는 일이었고, 가벼운 in-memory 검색이라면 FAISS가 더 맞았을 작업이었습니다. 다음엔 실험용 정적 인덱스는 FAISS, 운영용 동적 데이터는 벡터 DB로 갈라둡니다.",
            "다음 라운드로 미뤄둔 변수들 — relevance threshold·리랭커, 모델이 불확실할 때만 검색을 트리거하는 adaptive RAG, 500자보다 짧고 신호대잡음비가 높은 chunk 단위 실험입니다.",
            "임베딩으로 후보를 좁힌 뒤 규칙으로 한 번 더 거르는 패턴은 이 실험에서 처음 손에 잡혔고, 이후 StructVerify의 KOSIS 표 매칭 필터(국제기구·추계·세부대상)로 그대로 옮겨갔습니다.",
          ]}
        />
      </Section>

      <ProjectFooter currentSlug={SLUG} />
    </article>
  );
}
