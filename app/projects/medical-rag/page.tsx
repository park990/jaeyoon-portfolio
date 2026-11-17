import type { Metadata } from "next";
import { Prose } from "@/components/project-detail/section";
import { CodeBlock } from "@/components/project-detail/code-block";
import {
  TechStackGrid,
  ItemTitle,
  roleItems,
  troubleItems,
  ResultsGrid,
  lessonItems,
  type Role,
  type Trouble,
} from "@/components/project-detail/blocks";
import { CaseLayout } from "@/components/case/case-layout";
import {
  CaseSection,
  FlowFigure,
  SubHead,
  type CaseSectionMeta,
} from "@/components/case/case-parts";
import { Ev } from "@/components/case/evidence";
import { getProjectBySlug } from "@/lib/projects";

const SLUG = "medical-rag";
const project = getProjectBySlug(SLUG)!;
const MED = "https://github.com/ljhljh0703-cmd/Medical-Chatbot";
const MED_DEV = "f2bc415fce1afb7be58bc51c898422d6c557f17d";

export const metadata: Metadata = {
  title: project.title,
  description: project.description,
};

// 기존 Highlights 중 숫자가 아닌 두 장 — 각 칸 첫머리로 옮김
const CAUSE = {
  label: "원인",
  value: "Distraction",
  note: "주제는 비슷하지만 정답을 가르지 못하는 chunk가 맞던 문제까지 흔듦",
};
const NEXT_TRY = {
  label: "다음 시도",
  value: "Adaptive RAG",
  note: "relevance gate, 리랭커, retrieval recall@k 선측정",
};

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
      { text: "원천 의학 텍스트 3,447개 문서를 500자 단위로 chunking → 약 27,000 chunk 생성", ev: ["corpus", "chunk500"] },
      "ko-sroberta 임베딩 → ChromaDB persist (vector + 메타데이터 + 컬렉션 자동 영구화)",
      "Dense retrieval 기반 (Hybrid fusion 옵션은 팀원이 별도 구현, ablation 본 측정은 Dense 기준)",
    ],
  },
  {
    title: "자동 평가 시스템",
    bullets: [
      {
        text: "VL 데이터셋 기반 평가 파이프라인 (`evaluation/metrics.py` 216줄, `notebooks/colab_generation_eval.ipynb` 449줄)",
        ev: ["evalLines216", "evalLines449"],
      },
      "객관식: 번호 매칭 (모델 출력에서 번호 추출 → 정답 라벨 비교)",
      "단답: 키워드 매칭 (정답 키워드 포함 여부)",
      "Mode A (LLM only) vs Mode B (LLM + RAG) 두 경로를 동일 데이터셋에 일괄 실행",
    ],
  },
  {
    title: "Ablation 측정 + 원인 분석",
    bullets: [
      { text: "LLM 단독 65.4% → +RAG 63.1% (−2.3pt) 측정", ev: ["ablation"] },
      "오답으로 전환된 케이스를 수동 추적해 distraction 패턴 분류",
      "대표 사례: '대상포진 치료제' 질문에 같은 VZV로 임베딩이 가까운 '수두 백신' chunk가 top-k에 잡혀 모델이 백신 쪽으로 오답",
    ],
  },
  {
    title: "Out of scope (팀원 담당)",
    bullets: [
      "LoRA fine-tuning (`training/main_train.py`, `adapter_config.json` 등), 팀원 담당. 본 실험의 ablation에는 포함하지 않음 (LLM 단독 vs LLM+RAG 2-stage 비교만).",
      "FastAPI 서빙 레이어 (`src/app/main.py`, `routers/chat.py`, `schemas/chat.py`), 팀원 담당. 본 페이지의 기여 영역 외부.",
      "Hybrid fusion 코드 (`src/retrieval/hybrid/fusion.py`, RRF, weighted_sum), 팀원이 옵션 형태로 구현. ablation 측정에는 Dense만 사용했으므로 본 페이지 결과 수치는 hybrid 영향을 받지 않음.",
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
      "RAG를 켜면 오를 거라 보고 붙였는데, 측정 결과가 오히려 -2.3pt였습니다. 다음에 RAG를 붙일 땐 retrieval recall@k부터 먼저 재고, 그 점수가 충분히 높을 때만 LLM에 붙일 생각입니다.",
    ev: { problem: ["ablation"], solve: ["topk", "chunk500"], lesson: ["ablation"] },
  },
  {
    title: "'대상포진 치료제'에 '수두 백신' chunk가 잡힘",
    star: true,
    problem:
      "구체 케이스. 사용자가 '대상포진 치료제'를 물으면 ko-sroberta 임베딩 공간에서 같은 VZV(varicella-zoster virus) 도메인의 '수두 백신' chunk가 top-k 안으로 들어왔습니다. 모델은 검색된 context에 끌려가 백신 쪽으로 답을 비틀었고, 원래 LLM 단독으로는 맞히던 문제까지 오답으로 떨어졌습니다.",
    solve:
      "ablation 측정 안에서는 별도 처리 없이 distraction 케이스로 분류해 기록. 구조적 해결책은 다음 시도(아래 ‘다음에 고칠 것’)로 묶었습니다: relevance threshold + 리랭커로 1차 거름, 또는 모델이 불확실할 때만 검색을 트리거하는 adaptive RAG.",
    lesson:
      "임베딩 거리가 가깝다는 건 주제가 가깝다는 뜻일 뿐, 정답을 가르는 chunk가 가깝다는 보장은 아니었습니다. 같은 도메인 어휘끼리도 '치료제 vs 백신'처럼 핵심을 다르게 가르는 축이 있는데, 임베딩만으론 그 축을 잡지 못했습니다. 검색 단계에 도메인 규칙이나 리랭커 한 층을 더 두는 패턴은 이후 StructVerify의 KOSIS 표 매칭 필터로도 가져갔습니다.",
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


const SECTIONS: CaseSectionMeta[] = [
  {
    id: "problem",
    label: "문제",
    title: "‘RAG를 붙이면 정답률이 오른다’는 가설을 같은 평가셋에서 확인해야 했습니다",
  },
  {
    id: "role",
    label: "내가 맡은 것",
    title: "팀 챗봇 중 RAG 파이프라인과 자동 평가를 맡았습니다",
  },
  {
    id: "flow",
    label: "흐름",
    title: "같은 질문을 LLM 단독과 LLM + RAG에 통과시켜 같은 규칙으로 채점했습니다",
  },
  {
    id: "decisions",
    label: "결정과 이유",
    title: "가장 단순한 Dense 구성으로, 운영 부담이 적은 ChromaDB에서 먼저 쟀습니다",
  },
  {
    id: "eval",
    label: "평가",
    title: "VL 데이터셋에서 LLM 단독 65.4% → +RAG 63.1%, 2.3pt 내려갔습니다",
  },
  {
    id: "failed",
    label: "안 된 것",
    title: "검색이 주제만 비슷한 chunk를 가져와 맞던 문제까지 흔들었습니다",
  },
  {
    id: "next",
    label: "다음에 고칠 것",
    title: "다음엔 retrieval recall@k부터 재고, 검색 뒤에 규칙이나 리랭커를 둡니다",
  },
];
const S = Object.fromEntries(SECTIONS.map((s) => [s.id, s])) as Record<string, CaseSectionMeta>;

function LeadLine({ item }: { item: { label: string; value: string; note: string } }) {
  return (
    <p className="max-w-[690px] border-l-2 border-ink pl-4 text-ink">
      <span className="text-note">{item.label}</span>{" "}
      <span className="font-semibold">{item.value}</span>, {item.note}
    </p>
  );
}

export default function MedicalRagPage() {
  return (
    <CaseLayout project={project} sections={SECTIONS}>
      <CaseSection meta={S.problem}>
        <Prose>
          <p>
            팀 프로젝트 자체는 의료 도메인 챗봇을 만드는 것이었고, 그중 제가
            맡은 부분은 RAG 파이프라인과 평가였습니다. &lsquo;RAG를 붙이면
            정답률이 오른다&rsquo;는 가설을 같은 평가셋에서 측정해봤는데,
            결과는 오히려 <span className="font-semibold">2.3pt 하락</span>으로
            가설을 반박했습니다. 그래서 RAG를 붙이는 데서 멈추지 않고,
            어떤 경우에 RAG가 정답을 흔드는지 오답 케이스를 직접 추적해
            원인을 분석했습니다.
            <Ev ids={["ablation"]} />
          </p>
        </Prose>
      </CaseSection>

      <CaseSection meta={S.role}>
        {roleItems(roles)}
        <div>
          <SubHead
            note={
              <>
                ※ RAG 파이프라인 + 자동 평가 영역만 직접 다룸. LoRA fine-tuning은
                팀원 담당으로 본 실험 ablation 외부.
              </>
            }
          >
            사용 기술
          </SubHead>
          <div className="mt-4">
            <TechStackGrid groups={techStack} />
          </div>
        </div>
      </CaseSection>

      <CaseSection meta={S.flow}>
        <FlowFigure steps={project.flow!} caption={project.flowCaption} />
      </CaseSection>

      <CaseSection meta={S.decisions}>
        {KEY_DECISIONS.map((d, i) => (
          <div key={d.title}>
            <ItemTitle n={i + 1}>{d.title}</ItemTitle>
            <p className="mt-2 pl-9 text-ink">{d.body}</p>
          </div>
        ))}
      </CaseSection>

      <CaseSection meta={S.eval}>
        <Prose>
          <p>
            평가셋은 VL 데이터셋, 지표는 객관식 번호 매칭, 단답 키워드 매칭으로
            채점한 정답률입니다.
          </p>
          <p>
            Qwen2.5-7B-Instruct(4bit) + ChromaDB 기반으로 LLM 단독(Mode A) vs
            LLM + RAG(Mode B) 2-stage ablation을 동일 평가셋에 돌렸고,
            전환된 오답 케이스를 수동 추적해 distraction 패턴까지 정리했습니다.
          </p>
        </Prose>
        <div>
          <p className="mb-3 text-[15px] leading-[1.7] text-note">
            2-stage ablation 실행 흐름, 동일 질문을 Mode A / Mode B에 통과시켜
            동일 채점 규칙으로 비교.
          </p>
          <CodeBlock
            code={evalCode}
            lang="python"
            filename="notebooks/colab_generation_eval.ipynb (요약)"
            source={{
              label: "colab_generation_eval.ipynb @f2bc415",
              href: `${MED}/blob/${MED_DEV}/notebooks/colab_generation_eval.ipynb`,
              kind: "관련 파일",
            }}
          />
        </div>
        <ResultsGrid
          items={[
            { text: "LLM 단독 65.4% → +RAG 63.1% (−2.3pt), 2-stage ablation 측정 (LoRA 제외)", ev: ["ablation"] },
            {
              text: "원천 의학 텍스트 3,447개 → 500자 chunking → 약 27,000 chunk → ko-sroberta 임베딩 → ChromaDB persist",
              ev: ["corpus", "chunk500"],
            },
            "자동 평가 파이프라인: 객관식 번호 매칭 + 단답 키워드 매칭 (VL 데이터셋 일괄)",
            "오답 전환 케이스 수동 추적, '대상포진 치료제' ↔ '수두 백신' 같은 같은-도메인 distraction 패턴 식별",
          ]}
        />
      </CaseSection>

      <CaseSection meta={S.failed}>
        <LeadLine item={CAUSE} />
        {troubleItems(troubles)}
      </CaseSection>

      <CaseSection meta={S.next}>
        <LeadLine item={NEXT_TRY} />
        {lessonItems([
          { text: "RAG만 붙이면 정답률이 오를 줄 알았는데, 측정해 보니 오히려 2.3pt가 떨어졌습니다. 다음에 RAG를 붙일 땐 켜기 전에 retrieval recall@k부터 재고, 그 점수가 LLM 단독보다 의미 있게 높을 때만 붙일 생각입니다.", ev: ["ablation"] },
          "코사인 점수가 높길래 잘 찾았다고 생각했는데, 정작 모델은 그 chunk에 끌려가서 오답이 더 늘었습니다. 임베딩이 가깝다는 건 주제가 가깝다는 뜻일 뿐, 정답을 가르는 chunk가 가깝다는 보장은 아니었습니다. 그래서 지금은 검색 뒤에 도메인 규칙이나 리랭커를 한 층 더 둡니다.",
          { text: "처음엔 그냥 ChromaDB를 깔고 시작했는데, Colab에서 의존성 충돌로 세팅에만 한참을 썼습니다. 27k chunk를 한 번 인덱싱하고 ablation으로 반복 검색만 하는 용도엔 persistence·메타데이터가 필요 없는 일이었고, 가벼운 in-memory 검색이라면 FAISS가 더 맞았을 작업이었습니다. 다음엔 실험용 정적 인덱스는 FAISS, 운영용 동적 데이터는 벡터 DB로 갈라둡니다.", ev: ["corpus"] },
          { text: "다음 라운드로 미뤄둔 변수들, relevance threshold·리랭커, 모델이 불확실할 때만 검색을 트리거하는 adaptive RAG, 500자보다 짧고 신호대잡음비가 높은 chunk 단위 실험입니다.", ev: ["chunk500"] },
          "임베딩으로 후보를 좁힌 뒤 규칙으로 한 번 더 거르는 패턴은 이 실험에서 처음 손에 잡혔고, 이후 StructVerify의 KOSIS 표 매칭 필터(국제기구·추계·세부대상)로 그대로 옮겨갔습니다.",
        ])}
      </CaseSection>
    </CaseLayout>
  );
}
