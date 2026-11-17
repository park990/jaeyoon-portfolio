import type { Metadata } from "next";
import { Prose } from "@/components/project-detail/section";
import { CodeBlock } from "@/components/project-detail/code-block";
import {
  TechStackGrid,
  ItemTitle,
  roleItems,
  ResultsGrid,
  lessonItems,
  type Role,
} from "@/components/project-detail/blocks";
import { CaseLayout } from "@/components/case/case-layout";
import { CaseSection, SubHead, type CaseSectionMeta } from "@/components/case/case-parts";
import { Graded } from "@/components/case/evidence";
import {
  StagesDiagram,
  MetricsTable,
  Stage2ChangesTable,
} from "./_components/stages";
import { caseMetadata } from "@/lib/site";
import { getProjectBySlug } from "@/lib/projects";

const SLUG = "text2graph";
const project = getProjectBySlug(SLUG)!;

export const metadata: Metadata = caseMetadata(project);

const techStack = [
  { category: "Model", items: ["ATLOP + DREEAM (Evidence-based Supervision)", "BERT-base-uncased (110M)"] },
  { category: "Framework", items: ["PyTorch", "HuggingFace Transformers", "HuggingFace Hub", "NetworkX"] },
  { category: "Eval", items: ["Micro F1", "Ign F1", "Evidence F1"] },
  { category: "환경", items: ["Google Colab Pro (T4 GPU)", "VS Code + SSH", "Git"] },
];

// [3단계 C4~C7] 담당 범위를 팀 README 담당 표에 맞춤. 지시문의 "(근거 n)"은 글자가 아니라 ev로 붙인다.
const roles: Role[] = [
  {
    title: "Stage 2 담당, 학습·평가 실행과 지표 분석",
    bullets: [
      { text: "ATLOP ranking loss 구현, 평가 단계 adaptive threshold 수정", ev: ["th05"] },
      {
        text: "2026-04-08 팀 README 담당 분배 표에 Stage 2 담당으로 기재. 통합 모델 코드와 학습 스크립트 골격은 팀 PM 작성",
        ev: ["owner"],
      },
    ],
  },
  {
    title: "DREEAM 공식 코드 재현 학습 (dev F1 61.71)",
    bullets: [
      {
        text: "Colab에서 DREEAM 공식 코드를 bert-base, 30 epoch로 학습: dev F1 61.71, Ign F1 59.79, Evidence F1 52.21",
        ev: ["dreeam"],
      },
      {
        text: "실행에 필요한 meta/rel2id.json을 rel_info.json에서 생성(97개 관계), 최신 transformers의 AdamW import 오류 수정",
        ev: ["rel97"],
      },
    ],
  },
  {
    title: "V1/V2 ablation 비교 및 Stage 3/4 팀원에게 baseline 제공",
    bullets: ["수정된 평가 + Ranking Loss 두 축으로 V1/V2 분리 후 비교 가능"],
  },
  {
    title: "HuggingFace 모델 배포 (park990/hihi_model)",
    bullets: [
      "V1: best_model_V1.pt (처음 이름 best_model_f1_56_64.pt)",
      "V2: best_model_V2.pt",
      "모델 카드(README) 작성. 팀 README 12장에 Stage 2 체크포인트로 등록",
    ],
  },
  {
    title: "NetworkX 기반 Knowledge Graph 시각화",
    bullets: [
      {
        text: "dev 998 문서 예측을 (개체, 관계, 개체) triple 10,494건으로 바꾸고 문서 단위로 NetworkX 그래프를 그림. 팀 최종 KG 빌더(kg_builder.py)는 팀 PM 작성",
        ev: ["dev998", "triples"],
      },
    ],
  },
];

// 디버깅 추론 — 가설 → 검증 → 수정 3단계로 진단 능력을 보여줌.
// 일반적인 Trouble-shooting 카드와 의도적으로 다른 frame: 무엇이 깨졌나가 아니라 어떻게 의심·검증·수정했나.
const DEBUGGING_REASONING = [
  {
    title: "Evaluation의 Adaptive Threshold 적용 누락, 평가 코드부터 의심",
    hypothesis:
      "학습은 pair별 adaptive threshold를 출력하는데 dev F1이 56.64%에서 정체했습니다. 모델 가중치보다 평가/추론 코드를 먼저 의심했습니다.",
    verification:
      "scripts/train.py의 evaluate_on_dev를 따라가 보니 고정 threshold(0.5)로 relation 채택 여부를 판단하고 있었습니다. 학습된 threshold_logits 값이 평가 단계에서 무시되고 있음을 확인했습니다.",
    fix:
      "evaluate_on_dev를 ATLOP 정상 평가 방식으로 정정했습니다. 모델이 출력하는 threshold_logits와 각 relation logit을 비교해 채택 판단. 이 한 수정만으로도 F1이 즉시 반영됐습니다.",
    ev: { hypothesis: ["f1"], verification: ["th05"] },
  },
  {
    title: "ATLOP ranking loss 오구현, 원 논문 수식과 직접 대조",
    hypothesis:
      "학습 곡선이 일찍 정체했습니다. 모델 구조보다 손실 함수 구현을 의심했습니다.",
    verification:
      "src/losses.py의 ATLOPLoss가 'BCE with threshold class concat' 약식 형태로, 단순 이진 분류처럼 작성돼 있었습니다. 원 논문의 Positive/Negative 분리 + threshold 비교 의도가 살아나지 않음을 확인했습니다.",
    fix:
      "원 논문 ranking loss 수식 그대로 재구현했습니다: loss = log(1+Σexp(neg−TH)) + log(1+Σexp(TH−pos)). 위 평가 수정과 함께 적용해 v1 56.64% → v2 59.25% (+2.61pt) 도달.",
    ev: { fix: ["f1"] },
  },
  {
    title: "관계별 성능 격차 해석, 전체 F1만 보지 않기",
    hypothesis:
      "F1 평균이 같아도 관계 종류별로 성능이 균일하지 않을 것이라 봤습니다. 어떤 관계 유형에 약한지 봐야 모델 한계를 진단할 수 있다고 판단했습니다.",
    verification:
      "dev 998 문서 → 10,494 triple 추출 후 관계 종류별 F1을 쟀습니다. 생년월일(90.3%)·사망일(85.4%) 같은 표면 패턴 관계는 80~90%대인 반면, 민족·하위분류(둘 다 0%)를 포함한 하위 10개 관계는 0~12.5%로 격차가 컸습니다.",
    fix:
      "결론은 BERT-base가 표면 패턴은 잡지만 상식 추론은 약하다는 것이었습니다. 단순 모델 교체보다 commonsense KG 외부 지식 주입을 다음 라운드 방향으로 잡았고, F1 평균만 보지 않고 관계별 분포까지 같이 봅니다.",
    ev: { verification: ["dev998", "triples", "relgap"] },
  },
];

type Debug = (typeof DEBUGGING_REASONING)[number];

function DebugItem({ d, n }: { d: Debug; n: number }) {
  const ev = d.ev as { hypothesis?: string[]; verification?: string[]; fix?: string[] };
  return (
    <div>
      <ItemTitle n={n}>{d.title}</ItemTitle>
      <dl className="mt-3 space-y-3 pl-9 text-[17px] leading-[1.8]">
        {(
          [
            ["가설", d.hypothesis, ev.hypothesis],
            ["검증", d.verification, ev.verification],
            ["수정", d.fix, ev.fix],
          ] as const
        ).map(([k, v, e]) => (
          <div key={k}>
            <dt className="text-[14px] text-note">{k}</dt>
            <dd className="text-ink">
              <Graded text={v} ev={e} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// [3단계 C5] DREEAM 실행용 rel2id.json을 만든 노트북 셀 (project1/runtimeCheck.ipynb @3769725)
const rel2idCode = `rel_info = json.load(open('/content/2026-Text2Graph/project1/data/rel_info.json', 'r'))
rel2id = {"Na": 0}  # 관계 없음 = 0번
for i, rel in enumerate(rel_info.keys()):
    rel2id[rel] = i + 1
json.dump(rel2id, open('meta/rel2id.json', 'w'))
`;

// [3단계 C12] 커밋 31e47dc의 pipeline/src/losses.py L81–L105 글자 그대로 (들여쓰기만 8칸 줄임)
const lossCode = `# ── 핵심: ATLOP ranking loss ──
# positive class는 TH보다 높아야 함
# negative class는 TH보다 낮아야 함
th_logit = logits[:, -1:]  # [num_pairs, 1]

# log(1 + sum_neg(exp(neg - TH))) + log(1 + sum_pos(exp(TH - pos)))
pos_mask = full_labels[:, :-1]   # [num_pairs, num_rels]
neg_mask = 1 - pos_mask

pos_logits = logits[:, :-1]  # [num_pairs, num_rels]

# negative part: exp(logit_neg - TH)
neg_loss = torch.logsumexp(
    pos_logits * neg_mask + (-1e30) * pos_mask - th_logit, dim=-1
)
neg_loss = torch.log1p(torch.exp(neg_loss))

# positive part: exp(TH - logit_pos)
pos_loss = torch.logsumexp(
    -pos_logits * pos_mask + (-1e30) * neg_mask + th_logit, dim=-1
)
pos_loss = torch.log1p(torch.exp(pos_loss))

loss = (neg_loss + pos_loss).mean()
return loss
`;

const SECTIONS: CaseSectionMeta[] = [
  {
    id: "problem",
    label: "문제",
    title: "위키피디아 문서 속 Entity 간 관계 97종을 자동으로 추출해야 했습니다",
  },
  {
    id: "role",
    label: "내가 맡은 것",
    title: "4-Stage 중 Stage 2(ATLOP + DREEAM)를 맡아 학습·평가하고 구현 오류 두 곳을 고쳤습니다",
  },
  {
    id: "flow",
    label: "흐름",
    title: "Baseline 위에 Stage를 하나씩 쌓는 구조에서 두 번째 단계였습니다",
  },
  {
    id: "decisions",
    label: "결정과 이유",
    title: "Stage 2는 Stage 1 baseline에서 다섯 축이 바뀌는 단계였고, 그중 손실 함수와 평가 임계값을 고쳤습니다",
  },
  {
    id: "eval",
    label: "평가",
    title: "DocRED dev에서 Micro F1 56.64% → 59.25%, 관계별로는 격차가 컸습니다",
  },
  {
    id: "failed",
    label: "안 된 것",
    title: "v1은 평가 코드와 손실 함수, 두 곳의 구현 오류로 56.64%에 멈췄습니다",
  },
  {
    id: "next",
    label: "다음에 고칠 것",
    title: "F1이 안 오르면 평가 코드부터, 논문 구현은 수식 단위까지 맞춥니다",
  },
];
const S = Object.fromEntries(SECTIONS.map((s) => [s.id, s])) as Record<string, CaseSectionMeta>;

export default function Text2GraphPage() {
  return (
    <CaseLayout project={project} sections={SECTIONS}>
      <CaseSection meta={S.problem}>
        <Prose>
          <p>
            <Graded
              text="DocRED 데이터셋 기반으로 위키피디아 문서 내 Entity 간 관계(97종)를 자동 추출하는 모델 학습 파이프라인. 팀의 4-Stage Incremental Stacking 구조에서 Stage 2 (ATLOP + DREEAM)를 맡았습니다. 파이프라인 골격과 통합 모델 코드는 팀 PM이 작성했고, 저는 Stage 2의 학습·평가 실행과 손실 함수·평가 임계값 수정을 했습니다."
              ev={["rel97", "owner"]}
            />
          </p>
        </Prose>
      </CaseSection>

      <CaseSection meta={S.role}>
        <Prose>
          <p>
            추출된 triple은 NetworkX로 Knowledge Graph 시각화까지 연결했고,
            학습된 모델은 HuggingFace에 park990/hihi_model로 배포했습니다.
          </p>
        </Prose>
        <SubHead>맡은 일</SubHead>
        {roleItems(roles)}
        <div>
          <SubHead>직접 생성한 관계 매핑</SubHead>
          <p className="mb-3 mt-4 text-[15px] leading-[1.7] text-note">
            <Graded text="DREEAM 실행용 rel2id.json을 만든 노트북 셀." ev={["rel97"]} />
          </p>
          <CodeBlock code={rel2idCode} lang="python" filename="project1/runtimeCheck.ipynb @3769725" />
        </div>
        <div>
          <SubHead>사용 기술</SubHead>
          <div className="mt-4">
            <TechStackGrid groups={techStack} />
          </div>
        </div>
      </CaseSection>

      <CaseSection meta={S.flow}>
        <StagesDiagram />
      </CaseSection>

      <CaseSection meta={S.decisions}>
        <Stage2ChangesTable />
        <p className="max-w-[690px] text-ink">
          <Graded
            text="다섯 축의 모델 코드는 팀 PM이 작성했고, 제가 고친 곳은 Loss(ATL Ranking Loss 구현)와 Threshold(평가 때 adaptive threshold 적용)입니다."
            ev={["th05", "owner"]}
          />
        </p>
      </CaseSection>

      <CaseSection meta={S.eval}>
        <Prose>
          <p>
            <Graded
              text="평가셋은 DocRED dev set(998 문서), 지표는 Micro F1, Precision, Recall입니다."
              ev={["dev998"]}
            />
          </p>
        </Prose>
        <MetricsTable />
        <p className="max-w-[690px] text-ink">
          <Graded
            text="팀 최종 보고서 표 3.2의 ATLOP-BERT Dev F1 64.19%는 distant supervision 사전학습을 쓴 값입니다(학습 문서 3,053건 대비 101,873건, 약 33배). 사람이 라벨링한 데이터만 쓴 원 논문 값은 61.09%이고, 같은 조건에서 제가 DREEAM 공식 코드를 재현한 값은 61.71%, 팀 구현 v2는 59.25%입니다."
            ev={["f1", "bench", "dreeam"]}
          />
        </p>
        <ResultsGrid
          items={[
            { text: "v1 F1 56.64% (구현 오류 포함된 baseline)", ev: ["f1"] },
            { text: "v2 F1 59.25%, ATLOP Ranking Loss + Adaptive Threshold 평가 동시 정정 (+2.61pt)", ev: ["f1"] },
            "HuggingFace 모델 배포: park990/hihi_model (v1 best_model_V1.pt + v2 best_model_V2.pt)",
            { text: "dev set 998 문서 → 10,494 triple 추출 후 NetworkX KG 시각화", ev: ["dev998", "triples"] },
            {
              text: "관계별 F1: 생년월일 90.3%, 사망일 85.4%, 출생지 81.5% / 민족 0%, 하위분류 0%를 포함한 하위 10개 관계 0~12.5% (정답 10건 이상 기준)",
              ev: ["relgap"],
            },
          ]}
        />
        <DebugItem d={DEBUGGING_REASONING[2]} n={3} />
      </CaseSection>

      <CaseSection meta={S.failed}>
        <DebugItem d={DEBUGGING_REASONING[0]} n={1} />
        <DebugItem d={DEBUGGING_REASONING[1]} n={2} />
        <div>
          <p className="mb-3 text-[15px] leading-[1.7] text-note">커밋 31e47dc에 들어간 ranking loss 부분.</p>
          <CodeBlock code={lossCode} lang="python" filename="pipeline/src/losses.py @31e47dc (ATLOPLoss.forward 일부)" />
        </div>
      </CaseSection>

      <CaseSection meta={S.next}>
        {lessonItems([
          {
            text: "처음엔 모델이 잘못된 줄 알고 가중치부터 만지려 했는데, dev F1이 56.64%에서 계속 정체했습니다. evaluate_on_dev를 따라가 보니 학습된 adaptive threshold가 평가에서 무시되고 고정 0.5로 잘리고 있었습니다. 한 줄짜리 버그가 학습 결함보다 더 큰 점수 손실을 내는 걸 본 뒤로, F1이 안 오르면 모델보다 평가·추론 코드부터 의심합니다.",
            ev: ["f1", "th05"],
          },
          "ATLOP Loss를 'BCE + threshold class concat' 약식으로 두니까 학습 곡선이 일찍 정체했습니다. 원 논문 ranking loss 수식 그대로 다시 옮기고 나서야 곡선이 살아났고, 그래서 논문 구현은 수식 단위까지 맞춰 옮기는 식으로 정리했습니다.",
        ])}
      </CaseSection>
    </CaseLayout>
  );
}
