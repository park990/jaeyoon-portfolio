import type { Metadata } from "next";
import { TrendingUp, Network, BarChart3, type LucideIcon } from "lucide-react";
import { Section, Prose } from "@/components/project-detail/section";
import { CodeBlock } from "@/components/project-detail/code-block";
import {
  ProjectHeader,
  ProjectFooter,
} from "@/components/project-detail/layout";
import {
  TechStackGrid,
  MyRoleCards,
  ResultsGrid,
  LessonsList,
  type Role,
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

// TL;DR — 이 프로젝트의 강점은 기술 선택이 아니라 진단 능력.
type Highlight = {
  icon: LucideIcon;
  label: string;
  value: string;
  note: string;
  accent?: boolean;
};

const HIGHLIGHTS: Highlight[] = [
  {
    icon: TrendingUp,
    label: "Dev F1",
    value: "+2.61pt",
    note: "56.64% → 59.25% (두 디버깅 수정의 합산 효과)",
    accent: true,
  },
  {
    icon: Network,
    label: "Triple 추출",
    value: "10,494",
    note: "dev 998 문서 → NetworkX 기반 KG 시각화",
  },
  {
    icon: BarChart3,
    label: "관계별 정성분석",
    value: "80~90% vs 0~12.5%",
    note: "표면 패턴 관계 vs 상식 추론 관계의 성능 격차",
  },
];

// 디버깅 추론 — 가설 → 검증 → 수정 3단계로 진단 능력을 보여줌.
// 일반적인 Trouble-shooting 카드와 의도적으로 다른 frame: 무엇이 깨졌나가 아니라 어떻게 의심·검증·수정했나.
const DEBUGGING_REASONING = [
  {
    title: "Evaluation의 Adaptive Threshold 적용 누락 — 평가 코드부터 의심",
    hypothesis:
      "학습은 pair별 adaptive threshold를 출력하는데 dev F1이 56.64%에서 정체. 모델 가중치보다 평가/추론 코드를 먼저 의심.",
    verification:
      "scripts/train.py의 evaluate_on_dev를 따라가 보니 고정 threshold(0.5)로 relation 채택 여부를 판단. 학습된 threshold_logits 값이 평가 단계에서 무시되고 있음을 확인.",
    fix:
      "evaluate_on_dev를 ATLOP 정상 평가 방식으로 정정 — 모델이 출력하는 threshold_logits와 각 relation logit을 비교해 채택 판단. 이 한 수정만으로도 F1이 즉시 반영됨.",
  },
  {
    title: "ATLOP ranking loss 오구현 — 원 논문 수식과 직접 대조",
    hypothesis:
      "학습 곡선이 일찍 정체. 모델 구조보다 손실 함수 구현을 의심.",
    verification:
      "src/losses.py의 ATLOPLoss가 'BCE with threshold class concat' 약식 형태 — 단순 이진 분류처럼 작성됨. 원 논문의 Positive/Negative 분리 + threshold 비교 의도가 살아나지 않음을 확인.",
    fix:
      "원 논문 ranking loss 수식 그대로 재구현: loss = log(1+Σexp(neg−TH)) + log(1+Σexp(TH−pos)). 위 평가 수정과 함께 적용해 v1 56.64% → v2 59.25% (+2.61pt) 도달.",
  },
  {
    title: "관계별 성능 격차 해석 — 전체 F1만 보지 않기",
    hypothesis:
      "F1 평균이 같아도 관계 종류별로 성능이 균일하지 않을 것. 어떤 관계 유형에 약한지 봐야 모델 한계를 진단할 수 있다.",
    verification:
      "dev 998 문서 → 10,494 triple 추출 후 관계 종류별 정밀도 측정. 생년월일/사망일 같은 표면 패턴 관계는 80~90%인 반면, 민족/하위분류처럼 상식 추론이 필요한 관계는 0~12.5%로 격차가 큼.",
    fix:
      "결론: BERT-base는 표면 패턴은 잡지만 상식 추론은 약하다. 단순 모델 교체보다 commonsense KG 외부 지식 주입이 다음 라운드 방향이라는 판단. F1 수치 위에서 1단계 더 들어가는 분석 습관이 자리잡음.",
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

      {/* TL;DR Highlights — 진단 능력에 초점 */}
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

      <Section id="debugging" title="디버깅 추론 — 가설 · 검증 · 수정">
        <p className="mb-5 text-sm leading-[1.7] text-muted-foreground">
          이 프로젝트의 강점은 기술 선택이 아니라{" "}
          <span className="text-foreground">진단 능력</span>입니다.
          F1이 정체했을 때 어디를 의심하고, 어떻게 검증했고, 무엇을
          고쳤는지를 3단계로 기록했습니다.
        </p>
        <div className="space-y-3">
          {DEBUGGING_REASONING.map((d, i) => (
            <div
              key={d.title}
              className="rounded-xl border border-border bg-card p-5 sm:p-6"
            >
              <div className="mb-3 flex items-start gap-3">
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
              <dl className="ml-10 space-y-2.5 text-sm leading-[1.7] text-foreground/85">
                <div className="grid grid-cols-[64px_1fr] gap-x-3 gap-y-1">
                  <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    가설
                  </dt>
                  <dd>{d.hypothesis}</dd>
                </div>
                <div className="grid grid-cols-[64px_1fr] gap-x-3 gap-y-1">
                  <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    검증
                  </dt>
                  <dd>{d.verification}</dd>
                </div>
                <div className="grid grid-cols-[64px_1fr] gap-x-3 gap-y-1">
                  <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    수정
                  </dt>
                  <dd>{d.fix}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
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
