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
import { caseMetadata } from "@/lib/site";
import { getProjectBySlug } from "@/lib/projects";

const SLUG = "medical-rag";
const project = getProjectBySlug(SLUG)!;
const MED = "https://github.com/ljhljh0703-cmd/Medical-Chatbot";
// [3단계 D4] 팀 README (juhyeong 브랜치 @25b0592) — L99–101 Mode A/B/C 표
const MED_MR = `${MED}/blob/25b0592c82ab2491c1388590a6a6135b302659f8/README.md?plain=1`;

export const metadata: Metadata = caseMetadata(project);

// 기존 Highlights 중 숫자가 아닌 두 장 — 각 칸 첫머리로 옮김
const CAUSE = {
  label: "원인",
  value: "Distraction",
  note: "질문과 맞지 않는 chunk가 맞던 문제까지 흔듦",
};
const NEXT_TRY = {
  label: "다음 시도",
  value: "Adaptive RAG",
  note: "relevance gate, 리랭커, retrieval recall@k 선측정",
};

const techStack = [
  {
    category: "Model",
    items: ["Qwen2.5-7B-Instruct (4bit)", "Colab L4 GPU"],
  },
  {
    category: "RAG",
    items: ["ChromaDB", "ko-sroberta (임베딩)", "BM25 + Dense Hybrid 옵션 (측정은 Dense)", "top-k = 3"],
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
      "FAISS는 인덱스 직렬화와 persist를 별도 단계로 관리해야 합니다. ChromaDB는 PoC 규모에서 메타데이터·벡터·persist를 단일 라이브러리로 처리할 수 있어 채택했습니다. 운영 부담을 우선했습니다. 다만 평가를 돌리던 Colab 세션에서 ChromaDB가 의존성 충돌을 내서, 측정은 같은 문서로 만든 FAISS 인덱스로 마쳤습니다.",
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
      // [6단계 A2] 원천 폴더 중 사용 범위 (근거 4)
      {
        text: "원천 5개 폴더 14,164개 문서 가운데 의학 교과서, 학회 가이드라인, 온라인 의료 정보 세 폴더 3,447개만 사용 (학술 논문 9,685개와 기타 1,032개는 임베딩 시간이 길어져 제외)",
        ev: ["corpus"],
      },
      { text: "원천 의학 텍스트 3,447개 문서를 500자 단위로 chunking → 약 27,000 chunk 생성", ev: ["corpus", "chunk500"] },
      "ko-sroberta 임베딩 → ChromaDB persist (vector + 메타데이터 + 컬렉션 자동 영구화)",
      "Dense retrieval 기반 (Hybrid fusion 옵션은 팀원이 별도 구현, ablation 본 측정은 Dense 기준)",
    ],
  },
  {
    title: "자동 평가 시스템",
    bullets: [
      // [3단계 D3] 팀원 파일(metrics.py·평가 노트북) 줄 수 대신 직접 작성한 평가 코드
      "VL 데이터셋 평가 코드를 Colab 노트북에 직접 작성 (번호 추출·키워드 매칭 함수, 조건별 일괄 실행, 문항별 결과 JSON 저장)",
      "객관식: 번호 매칭 (모델 출력에서 번호 추출 → 정답 라벨 비교)",
      "단답: 키워드 매칭 (정답 키워드 포함 여부)",
      "Mode A (LLM only) vs Mode B (LLM + RAG) 두 경로를 동일 데이터셋에 일괄 실행",
    ],
  },
  {
    title: "Ablation 측정 + 원인 분석",
    bullets: [
      { text: "LLM 단독 65.4% → +RAG 63.1% (−2.3pt) 측정", ev: ["ablation"] },
      "오답 예시와 검색 결과를 직접 열어 원인 확인",
      // [4단계 A6] 수두 백신 사례는 기록에 없어 검색 테스트에서 본 사례로 교체
      "검색 테스트에서 본 사례: ‘대상포진’을 넣으니 궤양성 대장염 문서가 나왔고, ‘폐렴의 치료’는 1위가 폐렴 가이드라인인데 2위가 당뇨병 선별 검사 문서",
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
      "오답 예시와 검색 결과를 직접 열어 보고 원인을 두 가지로 봤습니다. (1) 모델이 이미 아는 문제가 많아 RAG로 메울 지식 공백이 작았고, (2) 검색이 질문과 맞지 않는 chunk를 가져왔습니다. relevance gate/리랭커 없이 top-k=3을 그대로 주입한 점, 500자 chunk의 낮은 신호대잡음비가 distraction을 키운 원인.",
    lesson:
      "RAG를 켜면 오를 거라 보고 붙였는데, 측정 결과가 오히려 -2.3pt였습니다. 다음에 RAG를 붙일 땐 retrieval recall@k부터 먼저 재고, 그 점수가 충분히 높을 때만 LLM에 붙일 생각입니다.",
    ev: { problem: ["ablation"], solve: ["topk", "chunk500"], lesson: ["ablation"] },
  },
  {
    title: "검색 결과에 질문과 무관한 문서가 섞임(검색 테스트 사례)",
    problem:
      "검색 테스트에서 ‘대상포진’을 넣으니 궤양성 대장염 문서가 나왔습니다. ‘폐렴의 치료’는 1위로 폐렴 가이드라인이 나왔지만 2위는 당뇨병 선별 검사 문서였습니다. 이런 문서가 걸러지지 않은 채 top-k에 섞여 프롬프트에 그대로 들어갔습니다.",
    solve:
      "ablation 측정 안에서는 별도 처리 없이 distraction 케이스로 분류해 기록. 구조적 해결책은 다음 시도(아래 ‘다음에 고칠 것’)로 묶었습니다: relevance threshold + 리랭커로 1차 거름, 또는 모델이 불확실할 때만 검색을 트리거하는 adaptive RAG.",
    lesson:
      "검색 순위 안에 들어왔다는 것만으로는 질문과 관련 있다고 볼 수 없었습니다. 1위가 맞아도 그 아래에는 무관한 문서가 섞였고, 이를 걸러낼 기준(유사도 하한이나 리랭커)이 없었습니다. 검색 단계에 도메인 규칙이나 리랭커 한 층을 더 두는 패턴은 이후 StructVerify의 KOSIS 표 매칭 필터로도 가져갔습니다.",
  },
];

// [3단계 D5] 실행 흐름 요약(의사 코드). 실제 실행은 본인 Colab 노트북, 저장소에는 없음
const evalCode = `# 2-stage ablation 흐름 요약 (Mode A vs Mode B)

# Mode A: LLM only
out_a = generation_service.generate(question, context=None)

# Mode B: LLM + RAG
ctx = build_rag_context(question, top_k=3)   # 벡터 검색
out_b = generation_service.generate(question, context=ctx)

# 자동 채점 — 객관식 번호 매칭 / 단답 키워드 매칭
score_a = match_objective(out_a, gt) or match_keywords(out_a, gt)
score_b = match_objective(out_b, gt) or match_keywords(out_b, gt)

# 결과: 객관식 995문항에서 Mode A 65.4% / Mode B 63.1% (−2.3pt)
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
    title: "팀 챗봇 프로젝트에서 RAG 실험과 자동 평가를 제 Colab에서 직접 구성해 돌렸습니다",
  },
  {
    id: "flow",
    label: "흐름",
    title: "같은 질문을 LLM 단독과 LLM + RAG에 통과시켜 같은 규칙으로 채점했습니다",
  },
  {
    id: "decisions",
    label: "결정과 이유",
    title: "가장 단순한 Dense 구성부터 쟀고, 저장소는 관리가 쉬운 ChromaDB를 골랐습니다",
  },
  {
    id: "eval",
    label: "평가",
    title: "VL 데이터셋에서 LLM 단독 65.4% → +RAG 63.1%, 2.3pt 내려갔습니다",
  },
  {
    id: "failed",
    label: "안 된 것",
    title: "검색이 질문과 맞지 않는 chunk를 가져와 맞던 문제까지 흔들었습니다",
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
            평가셋은 VL 데이터셋의 객관식 995문항이고, 모델 출력에서 번호를 뽑아 정답과
            비교했습니다(651 → 628문항). 단답형 105문항은 키워드 포함 여부로 따로 채점했는데
            2 → 4문항이라 결론에는 쓰지 않았습니다. 팀 최종 측정(팀원 실행)에서도 방향은
            같았습니다:{" "}
            <a href={`${MED_MR}#L99-L101`} target="_blank" rel="noopener noreferrer">
              객관식 EM 0.69 → 0.67
            </a>
            .
          </p>
          <p>
            Qwen2.5-7B-Instruct(4bit)와 ko-sroberta 임베딩 검색(측정 때는 FAISS 인덱스)으로 LLM 단독(Mode A) vs
            LLM + RAG(Mode B) 2-stage ablation을 동일 평가셋에 돌렸고,
            오답 예시와 검색 결과를 직접 열어 원인을 확인했습니다.
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
            caption="실행 흐름 요약 (의사 코드). 실제 실행은 제 Colab 노트북에서 했고 저장소에는 없습니다."
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
            "검색 테스트와 오답 예시를 직접 열어, 질문과 무관한 문서가 top-k에 섞이는 패턴 확인",
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
          { text: "FAISS로 시작했다가 관리가 편한 ChromaDB로 옮겼는데, 평가 세션에서 Colab 의존성 충돌로 세팅에만 한참을 썼고 결국 측정은 FAISS 인덱스로 돌렸습니다. 27k chunk를 한 번 인덱싱하고 ablation으로 반복 검색만 하는 용도엔 persistence·메타데이터가 필요 없는 일이었고, 가벼운 in-memory 검색이라면 FAISS가 더 맞았을 작업이었습니다. 다음엔 실험용 정적 인덱스는 FAISS, 운영용 동적 데이터는 벡터 DB로 갈라둡니다.", ev: ["corpus"] },
          { text: "다음 라운드로 미뤄둔 변수들, relevance threshold·리랭커, 모델이 불확실할 때만 검색을 트리거하는 adaptive RAG, 500자보다 짧고 신호대잡음비가 높은 chunk 단위 실험입니다.", ev: ["chunk500"] },
          "임베딩으로 후보를 좁힌 뒤 규칙으로 한 번 더 거르는 패턴은 이 실험에서 처음 손에 잡혔고, 이후 StructVerify의 KOSIS 표 매칭 필터(국제기구·추계·세부대상)로 그대로 옮겨갔습니다.",
        ])}
      </CaseSection>
    </CaseLayout>
  );
}
