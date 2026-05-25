import type { Metadata } from "next";
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
import {
  StagesDiagram,
  MetricsTable,
  Stage2ChangesTable,
} from "./_components/stages";
import { getProjectBySlug } from "@/lib/projects";

const SLUG = "text2graph";
const ACCENT = "#A78BFA";

export const metadata: Metadata = {
  title: "Text2Graph · Jaeyoon Park",
  description:
    "Document-level Relation Extraction. ATLOP Loss + Adaptive Threshold 두 구현 오류를 수정해 v1 56.64% → v2 59.25% (+2.61pt)",
};

const techStack = [
  { category: "Model", items: ["ATLOP + DREEAM (Evidence-based Supervision)", "BERT-base-uncased (110M)"] },
  { category: "Framework", items: ["PyTorch", "HuggingFace Transformers", "HuggingFace Hub", "NetworkX"] },
  { category: "Eval", items: ["Micro F1", "Ign F1", "Evidence F1"] },
  { category: "환경", items: ["Google Colab Pro (T4 GPU)", "VS Code + SSH", "Git"] },
];

const roles: Role[] = [
  {
    title: "Stage 2 전담 — 학습 파이프라인 구축, 평가 지표 분석",
    bullets: [
      "ATLOP + DREEAM 모듈 학습/평가 코드 전 영역 담당",
      "팀 4-Stage Incremental Stacking 구조 중 Stage 2 독립 책임",
    ],
  },
  {
    title: "meta/rel2id.json 직접 생성 (97개 관계 매핑)",
    bullets: ["P17(country) ~ P175 등 위키데이터 속성 97종을 0-96 라벨로 매핑"],
  },
  {
    title: "V1/V2 ablation 비교 및 Stage 3/4 팀원에게 baseline 제공",
    bullets: ["수정된 평가 + Ranking Loss 두 축으로 V1/V2 분리 후 비교 가능"],
  },
  {
    title: "HuggingFace 모델 배포 (park990/hihi_model)",
    bullets: ["V1: best_model_f1_56_64", "V2: best_model_V2", "README + config + tokenizer 메타데이터 정리"],
  },
  {
    title: "NetworkX 기반 Knowledge Graph 시각화",
    bullets: ["dev 998 문서 → 10,494 triple 추출 후 그래프 시각화"],
  },
];

const troubles: Trouble[] = [
  {
    title: "ATLOP Loss 구현 오류 — BCE 단순 이진 분류 형태",
    star: true,
    problem:
      "v1의 src/losses.py → ATLOPLoss가 ‘BCE with threshold class concat’으로 작성되어 있어 단순 이진 분류 형태였고, ATLOP 원논문의 Positive/Negative 분리 + Threshold 비교 의도가 살아나지 않았습니다. v1 F1 56.64%에서 학습 곡선이 정체했습니다.",
    solve:
      "src/losses.py의 ATLOPLoss를 논문 원본 Ranking Loss로 재구현 — Positive relation은 Threshold보다 높게, Negative relation은 Threshold보다 낮게 학습되도록 분리. 수식: loss = log(1+Σexp(neg−TH)) + log(1+Σexp(TH−pos)).",
    lesson:
      "기존의 BCE + concat 약식 구현을 ATLOP 원논문 Ranking Loss 수식 그대로 다시 풀어 옮기고 나서야 학습 곡선이 의도대로 흐르기 시작했습니다. 그 전후 차이를 직접 비교해 본 뒤로는 논문 구현을 ‘비슷하게’로 두지 않고 수식 단위까지 맞춰서 옮기게 됐습니다.",
  },
  {
    title: "Evaluation 시 Adaptive Threshold 적용 누락",
    star: true,
    problem:
      "scripts/train.py → evaluate_on_dev에서 평가 시 고정 threshold(0.5)로 relation 채택 여부를 판단하고 있었습니다. 모델은 pair별 adaptive threshold를 학습하고 있었지만, 평가 단계에서 그 학습값이 무시되고 있어 ATLOP의 핵심 이점이 수치에 반영되지 않았습니다.",
    solve:
      "evaluate_on_dev를 ATLOP 평가 방식으로 정상화 — 모델이 출력하는 threshold_logits와 각 relation logit을 비교하여 채택 판단. 위 ATLOP Loss 수정과 함께 적용해 v1 56.64% → v2 59.25% (+2.61pt) 도달.",
    lesson:
      "Adaptive Threshold가 학습된 값이 아니라 고정값으로 적용되던 평가 코드를 잡고 나니 학습 측 변경이 비로소 수치로 드러나는 걸 직접 보고 나서야, 모델 가중치보다 평가·추론 코드가 최종 수치에 더 직결될 수 있다는 걸 손에 잡았습니다. 그 뒤로는 점수가 안 오를 때 모델을 만지기 전에 평가·추론 코드부터 의심하게 됐습니다.",
  },
];

const rel2idCode = `{
  "Na": 0,
  "P17": 1,        // country
  "P19": 2,        // place of birth
  "P569": 3,       // date of birth
  "P570": 4,       // date of death
  ...
  "P175": 96
}
`;

const lossCode = `def compute_loss(logits, labels, threshold_class=0):
    # Positive: 정답 관계 점수가 threshold보다 높아야 함
    # Negative: 오답 관계 점수가 threshold보다 낮아야 함

    pos_logits = logits[labels == 1]
    neg_logits = logits[labels == 0]
    th_logit = logits[:, threshold_class:threshold_class+1]

    loss = torch.log(1 + torch.exp(neg_logits - th_logit).sum(dim=1)) + \\
           torch.log(1 + torch.exp(th_logit - pos_logits).sum(dim=1))
    return loss.mean()
`;

export default function Text2GraphPage() {
  const project = getProjectBySlug(SLUG)!;

  return (
    <article
      className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:pt-16"
      style={{ "--accent": ACCENT } as React.CSSProperties}
    >
      <ProjectHeader
        project={project}
        oneLiner="DocRED Document-level Relation Extraction 파이프라인의 Stage 2 (ATLOP + DREEAM) 단독 담당. 두 구현 오류(ATLOP Ranking Loss · Adaptive Threshold 평가)를 디버깅으로 잡아 v1 56.64% → v2 59.25% (+2.61pt) 도달."
        period="2026.04 (1주)"
        team="5명"
        links={project.links}
      />

      <Section id="overview" title="Overview">
        <Prose>
          <p>
            DocRED 데이터셋 기반으로 위키피디아 문서 내 Entity 간 관계(97종)를
            자동 추출하는 모델 학습 파이프라인. 팀의 4-Stage Incremental Stacking
            구조에서 Stage 2 (ATLOP + DREEAM)를 단독 담당했습니다.
          </p>
          <p>
            추출된 triple은 NetworkX로 Knowledge Graph 시각화까지 연결했고,
            학습된 모델은 HuggingFace에 park990/hihi_model로 배포했습니다.
          </p>
        </Prose>
      </Section>

      <Section id="stack" title="Tech Stack">
        <TechStackGrid groups={techStack} />
      </Section>

      <Section id="role" title="My Role">
        <MyRoleCards roles={roles} accent={ACCENT} />
      </Section>

      <Section id="architecture" title="Architecture">
        <div className="space-y-5">
          <StagesDiagram />
          <Stage2ChangesTable />
        </div>
      </Section>

      <Section id="code" title="Code Highlights">
        <div className="space-y-5">
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              직접 생성한 97개 관계 매핑. P17(country)부터 P175까지 위키데이터
              속성을 0–96 라벨로.
            </p>
            <CodeBlock code={rel2idCode} lang="json" filename="meta/rel2id.json" />
          </div>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              ATLOP Ranking Loss 재구현. 논문 원본 수식 그대로 옮긴 버전.
            </p>
            <CodeBlock code={lossCode} lang="python" filename="loss.py" />
          </div>
        </div>
      </Section>

      <Section id="trouble" title="Trouble-shooting">
        <TroubleCards troubles={troubles} accent={ACCENT} />
      </Section>

      <Section id="results" title="Results">
        <div className="space-y-5">
          <MetricsTable />
          <p className="text-sm leading-[1.8] text-muted-foreground">
            벤치마크 대비: 논문 ATLOP-BERT 64.19%는 distant pre-training 데이터 30배
            사용. 본 프로젝트는 annotated만 사용한 조건에서 v2 59.25%로, 데이터 격차를
            감안하면 정상 범위.
          </p>
          <ResultsGrid
            items={[
              "v1 F1 56.64% (구현 오류 포함된 baseline)",
              "v2 F1 59.25% — ATLOP Ranking Loss + Adaptive Threshold 평가 동시 정정 (+2.61pt)",
              "HuggingFace 모델 배포: park990/hihi_model (v1 best_model_f1_56_64 + v2 best_model_V2)",
              "dev set 998 문서 → 10,494 triple 추출 후 NetworkX KG 시각화",
              "관계별 정밀도: 생년월일/사망일 80–90%, 민족/하위분류 0–12.5% (long-tail 격차 확인)",
            ]}
          />
        </div>
      </Section>

      <Section id="lessons" title="Lessons Learned">
        <LessonsList
          items={[
            "Adaptive Threshold 한 줄의 버그가 모델 학습 결함보다 더 큰 점수 손실을 만드는 걸 직접 보고 나서야, 모델을 만지기 전에 평가·추론 코드부터 의심하는 습관이 생겼다.",
            "ATLOP Loss를 수식 그대로 다시 옮기기 전후의 학습 곡선이 달라지는 걸 보고 나서야, 논문 구현을 ‘비슷하게’로 두면 의도가 절반밖에 안 살아난다는 걸 받아들였다.",
            "모델 weight만 올렸을 때 같은 출력이 재현되지 않아 한참 헤맨 뒤에야, HuggingFace 배포는 코드 push가 아니라 README·config·tokenizer까지 한 셋으로 정리하는 작업이라는 걸 알게 됐다.",
          ]}
        />
      </Section>

      <ProjectFooter currentSlug={SLUG} />
    </article>
  );
}
