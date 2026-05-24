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
import { StagesDiagram, MetricsTable } from "./_components/stages";
import { getProjectBySlug } from "@/lib/projects";

const SLUG = "text2graph";
const ACCENT = "#A78BFA";

export const metadata: Metadata = {
  title: "Text2Graph · Jaeyoon Park",
  description:
    "Document-level Relation Extraction. Adaptive Threshold 버그 + ATLOP Loss 수정으로 F1 +4.07pt",
};

const techStack = [
  { category: "Model", items: ["ATLOP + DREEAM (Evidence-based Supervision)", "BERT-base-uncased (110M)"] },
  { category: "Framework", items: ["PyTorch", "HuggingFace Transformers", "NetworkX"] },
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
    title: "Adaptive Threshold 평가 버그",
    star: true,
    problem:
      "학습된 adaptive threshold가 inference 시점에서 제대로 적용되지 않아 F1 56.64%에 정체. validation 평가 로직 점검 중 threshold가 학습된 값이 아닌 고정값으로 적용되고 있음을 확인.",
    solve:
      "threshold 적용 로직 수정 → F1 56.64% → 60.71% (+4.07pt)",
    lesson:
      "Adaptive Threshold가 학습된 값이 아니라 고정값으로 적용되던 한 줄을 잡고 나니 F1이 단번에 +4pt 가까이 올라가는 걸 직접 보고 나서야, 모델 가중치보다 평가·추론 코드가 최종 수치에 더 직결될 수 있다는 걸 손에 잡았습니다. 그 뒤로는 점수가 안 오를 때 모델을 만지기 전에 평가·추론 코드부터 의심하게 됐습니다.",
  },
  {
    title: "ATLOP Loss 구현 오류",
    star: true,
    problem: "초기 구현이 BCE + concat 방식으로 되어 있어 논문 원본 의도와 다름",
    solve:
      "논문의 Ranking Loss로 재구현 — loss = log(1+Σexp(neg-TH)) + log(1+Σexp(TH-pos)). V2 F1 59.25% (V1과 ablation 비교 가능한 baseline 제공).",
    lesson:
      "기존의 BCE + concat 약식 구현을 ATLOP 원논문 Ranking Loss 수식 그대로 다시 풀어 옮기고 나서야 학습 곡선이 의도대로 흐르기 시작했습니다. 그 전후 차이를 직접 비교해 본 뒤로는 논문 구현을 ‘비슷하게’로 두지 않고 수식 단위까지 맞춰서 옮기게 됐습니다.",
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
        oneLiner="Adaptive Threshold 평가 버그 + ATLOP Loss 구현 오류를 수정해 F1 +4.07pt 개선."
        period="2026.03 ~ 2026.05"
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
        <StagesDiagram />
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
            사용. 본 프로젝트는 annotated만 사용한 조건에서 60.71%로, 데이터 격차를
            감안하면 정상 범위.
          </p>
          <ResultsGrid
            items={[
              "V1 모델 F1 60.71% (Threshold 버그 수정 후)",
              "V2 모델 F1 59.25% (Ranking Loss 적용)",
              "HuggingFace 모델 배포 완료 (park990/hihi_model)",
              "dev set 998 문서 → 10,494 triple 추출",
              "NetworkX KG 시각화: 생년월일/사망일 80–90% 정밀도",
              "민족/하위분류 0–12.5% (long-tail 격차 확인)",
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
