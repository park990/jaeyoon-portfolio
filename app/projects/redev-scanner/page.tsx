import type { Metadata } from "next";
import { Prose } from "@/components/project-detail/section";
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
import { CaseSection, FlowFigure, SubHead, type CaseSectionMeta } from "@/components/case/case-parts";
import { Graded } from "@/components/case/evidence";
import { caseMetadata } from "@/lib/site";
import { getProjectBySlug } from "@/lib/projects";

// [4단계 B] 재개발 스캐너 — 기존 사례 틀(CaseLayout · CaseSection · blocks)과 클래스만 쓴다.
// 저장소가 비공개라 숫자는 비공개 기록(근거 8은 추정, 12는 문서). 형광은 요약의 「9.3만 명 중 1만 명」 한 곳.
// 쓰지 않는 말·넣지 않는 것: 지시문 B0 (서비스 주소·화면 캡처·저장소 링크·자료 원천 이름·내부 파일 이름·해시값 포함).

const SLUG = "redev-scanner";
const project = getProjectBySlug(SLUG)!;

export const metadata: Metadata = caseMetadata(project);

const roles: Role[] = [
  {
    title: "점수 모델과 검증",
    bullets: [
      "라벨 누수를 찾아 라벨을 새로 만들고 재학습",
      "과거 자료로만 학습해 이후에 지정된 구역을 맞히는지 시간 분할로 검증",
      "모델을 바꾸기 전에 보정 상태를 점검하고, 기준을 넘으면 교체를 막음",
    ],
  },
  {
    title: "평가한 모델과 화면이 쓰는 모델을 같게",
    bullets: [
      "교체는 재학습이 아니라 평가받은 파일의 복사로 규칙화",
      "프로세스마다 다른 모델이 나오던 원인을 찾아 고침",
    ],
  },
  {
    title: "LLM 리포트",
    bullets: [
      "숫자와 표는 코드가 그리고 LLM은 서술만 씀",
      "숫자와 서술이 어긋나는지 검증, 캐시, 실패했을 때 내려갈 경로",
      "thinking 켬/끔 비교 실험",
    ],
  },
  {
    title: "자가 검사 하네스",
    bullets: [
      "코드로 판정하는 규칙 층과 여러 실행을 비교하는 메타모픽 층",
      "화면 75칸 매트릭스 전수 검사",
    ],
  },
  {
    title: "개발 방식",
    bullets: [
      {
        text: "코드는 대부분 AI 코딩 세션이 썼습니다. main 커밋 5,609개 가운데 93.6%에 AI 공동 작성 표시가 붙어 있습니다.",
        ev: ["aiCommits"],
      },
      "저는 무엇을 만들지와 통과 기준을 정하고, 작업 세션과 분리된 감사 세션의 검사 결과를 보고 승인하거나 돌려보냈습니다.",
      "AI가 쓴 코드와 문장을 그대로 믿을 수 없어서 위의 검사 하네스와 환각 검증을 만들었습니다.",
    ],
  },
];

const techStack = [
  { category: "Model", items: ["XGBoost (지표 45개, 필지 단위 점수)"] },
  {
    category: "LLM",
    items: ["서술 생성에 Claude Haiku 5.5 (2026-10-23부터, 이전에는 gemini-2.5-flash), thinking 끔"],
  },
  { category: "Backend, Frontend", items: ["Python", "FastAPI", "React"] },
  { category: "검사", items: ["규칙 불변식", "메타모픽 관계", "화면 매트릭스", "테스트 함수 4,409개"] },
];

const DECISIONS: { title: string; body: string; ev?: string[] }[] = [
  {
    title: "교체는 재학습이 아니라 복사",
    body:
      "재학습해서 바꾸려 하니 프로세스마다 다른 모델이 나왔습니다. 같은 프로세스에서 두 번 학습하면 점수 차가 0인데, 다른 프로세스에서 세 번 학습하면 sha 세 개가 모두 달랐고 점수 차는 최대 0.555, 상위 1% 일치는 90.3%였습니다. seed는 모델의 난수만 잡고 있었고, set을 도는 순서가 행 순서와 분할을 바꾸고 있었습니다. 그래서 행 순서를 sorted()로 고정했고, 임계값 같은 파생 상수는 다시 계산하지 않고 선언한 값만 쓰게 했고, 파생 파일은 원본에서 다시 만들어 같이 바꾸게 했습니다. 무엇보다 교체 자체를 ‘다시 학습’이 아니라 ‘평가받은 파일을 그대로 복사’로 정했습니다.",
    ev: ["sameModel"],
  },
  {
    title: "숫자는 코드가, 문장만 LLM이",
    body:
      "리포트의 숫자와 표는 코드가 정해진 대로 그리고, LLM은 서술만 씁니다. 서술이 숫자와 어긋나는지 보는 검증은 캐시에서 꺼낸 글이나 템플릿으로 내려간 글에도 항상 돕니다. 캐시 키는 입력 사실, 시스템 프롬프트, 모델을 합친 해시라서 프롬프트를 바꾸면 옛 서술이 다시 나가지 않습니다. 한도 초과(429)나 실패가 나면 정해진 템플릿 글로 내려가고, 리포트가 죽는 경로가 없는지 실측으로 확인했습니다. 문구 검사는 권유로 읽힐 표현 0, 지어낸 숫자 0을 기준으로 둡니다.",
    ev: ["thinking"],
  },
  {
    title: "원천을 바꿀 때는 판정 기준을 먼저 적어 둡니다",
    body:
      "자료의 이용 조건을 전수 점검하다 원천 하나를 바꿔야 했습니다. 대체 후보가 기존 판정을 얼마나 재현하는지 대조했더니 95.9%(4,686/4,886필지)였고, 두 후보의 차이가 미리 정해 둔 ±1%p 안이라 동등하다고 보고 이용 조건이 확실한 쪽을 골랐습니다. 결과를 보고 기준을 정하지 않으려고 기준을 먼저 적었습니다.",
    ev: ["altSource"],
  },
  {
    title: "잠금은 막히는 쪽과 열리는 쪽을 둘 다 잽니다",
    body:
      "기능을 잠글 때 ‘막혔다’만 재면 원래 안 되는 것과 구분되지 않고, ‘열린다’만 재면 고장이어도 통과합니다. 그래서 잠근 상태와 푼 상태를 둘 다 실측해 판정합니다.",
  },
  {
    title: "정답을 모르는 값은 관계로 검사합니다",
    body:
      "내놓는 값 대부분이 정답을 모르는 값이라 정답 비교 테스트를 쓸 수 없었습니다. 그래서 검사를 층으로 나눴습니다. 1층-A는 코드로 판정하는 규칙 불변식이고, 1층-B는 여러 실행을 비교하는 메타모픽 관계입니다(같은 입력을 두 번 돌리면 완전히 같아야 하고, 상위 30개는 상위 50개의 앞 30개와 순서까지 같아야 한다는 식). 규칙은 고의로 깨뜨린 입력에서 실제로 실패를 낸 것만 등록합니다. 종료코드는 통과 0, 위반 3, 판정 불가 2로 나눴고, 화면 구조를 건드리면 75칸 매트릭스를 전부 다시 돌립니다. LLM에게 텍스트 내부 정합을 보게 하는 2층은 설계만 해 두었고 아직 돌리지 않습니다.",
    ev: ["harness"],
  },
];

// 같은 평가셋 비교 표 (근거 1)
const EVAL_ROWS = [
  { metric: "PR-AUC", before: "0.3426", after: "0.1453 (−57.6%)" },
  { metric: "lift", before: "10.29×", after: "4.36×" },
];

// 안 된 것 — Medical과 같은 문제/해결/배운 점 카드 (star 없음)
const troubles: Trouble[] = [
  {
    title: "지표가 좋았던 이유가 누수였음",
    problem:
      "첫 모델의 PR-AUC는 0.3426이었습니다. 그런데 ‘건물 없음’ 지표 하나가 정답을 거의 그대로 알려 주고 있었습니다. 음성 482,329필지 가운데 건물이 없는 필지가 1건뿐이었기 때문입니다.",
    solve:
      "라벨을 새로 만들어 다시 학습시켰습니다. 기저율이 달라진 두 모델은 같은 평가셋에 맞춰 비교했고, 시간 분할 검증을 따로 붙였습니다.",
    lesson:
      "0.3426은 부풀려진 값이었고 0.1453이 실제 값이었습니다. 지표가 좋게 나오면 어떤 입력이 그 점수를 만들었는지부터 봅니다.",
    ev: { problem: ["noBldg"] },
  },
  {
    title: "화면과 판정이 서로 다른 점수 파일을 씀",
    problem:
      "2026-08-05, 화면에서 점 색이 이상한 곳을 직접 발견했습니다. 화면의 점 색과 군집 판정이 서로 다른 점수 파일을 쓰고 있었습니다. 공통 722,566필지 가운데 722,561건이 달랐고 차이는 최대 0.995였습니다.",
    solve:
      "파생 파일을 원본에서 다시 만들어 함께 바꾸게 했고, 모델을 바꿀 때는 평가받은 파일을 복사하는 규칙을 세웠습니다. 교체 뒤에는 실험과 실사용의 모델 sha가 같은지, 재현 지표가 소수 4자리까지 같은지, 표본 1,000필지의 점수 차가 0인지 확인합니다.",
    lesson: "평가에서 본 숫자와 사용자가 보는 숫자가 같은 파일에서 나오는지부터 확인합니다.",
    ev: { problem: ["scoreFile"], solve: ["sameModel"] },
  },
  {
    title: "자동 검사가 놓친 것을 직접 읽다가 찾음",
    problem:
      "thinking을 켠 쪽 리포트에 제목만 있고 본문이 빈 절이 23개 있었습니다(15표본 중 12표본). 자동 검사는 절 제목 수만 세고 있어서 이걸 통과시켰습니다.",
    solve:
      "서술을 직접 읽다가 발견했고, 검사가 본문까지 보도록 고쳤습니다. thinking은 끄는 쪽을 채택했습니다. 표본 20개 가운데 5개는 503 과부하로 빠져 유효한 비교는 15쌍입니다.",
    lesson:
      "‘위반 0’은 검사가 실제로 본 범위 안에서만 뜻이 있습니다. 그래서 하네스에서는 모집단이 0인 ‘위반 0’을 통과가 아니라 판정 불가로 처리하고, 결과에 분모를 같이 적습니다.",
    ev: { problem: ["thinking"] },
  },
];

const SECTIONS: CaseSectionMeta[] = [
  {
    id: "problem",
    label: "문제",
    title: "정답을 바로 확인할 수 없는 값을 내놓는 서비스라, 틀린 값이 섞였는지 스스로 알아내야 했습니다",
  },
  {
    id: "role",
    label: "내가 맡은 것",
    title: "자료 수집부터 모델, 검사, 화면까지 전 구간을 혼자 맡았습니다",
  },
  {
    id: "flow",
    label: "흐름",
    title: "자료를 모아 점수를 매기고, 화면과 리포트로 나가기 전에 검사를 거칩니다",
  },
  {
    id: "decisions",
    label: "결정과 이유",
    title: "교체는 재학습이 아니라 평가받은 파일의 복사로, 숫자는 LLM이 아니라 코드로 정했습니다",
  },
  {
    id: "eval",
    label: "평가",
    title: "같은 평가셋에서 PR-AUC 0.3426 → 0.1453, 시간으로 잘라 보면 lift 3.74×로 아직 약합니다",
  },
  {
    id: "failed",
    label: "안 된 것",
    title: "첫 모델은 ‘건물 없음’ 하나로 정답을 맞히고 있었고, 화면은 다른 점수 파일을 보고 있었습니다",
  },
  {
    id: "next",
    label: "다음에 고칠 것",
    title: "시간으로 잘랐을 때의 성능과, 아직 돌리지 않은 LLM 심사층이 남아 있습니다",
  },
];
const S = Object.fromEntries(SECTIONS.map((s) => [s.id, s])) as Record<string, CaseSectionMeta>;

export default function RedevScannerPage() {
  return (
    <CaseLayout project={project} sections={SECTIONS}>
      <CaseSection meta={S.problem}>
        <Prose>
          <p>
            <Graded
              text="서울 25개 구 898,286필지에 대해, 과거에 정비구역으로 지정된 곳과 얼마나 닮았는지를 점수로 매깁니다. 점수 모델은 지정 이력이 있는 90개 구역 36,796필지를 정답으로, 지표 45개를 입력으로 쓰는 XGBoost입니다. 어려운 점은 내놓는 값 대부분이 정답을 바로 확인할 수 없다는 것이었습니다. 지표가 잘 나와도 그게 실력인지 알 수 없고, 검사가 ‘위반 0’을 내도 정말 들여다본 결과인지 알 수 없었습니다."
              ev={["scope"]}
            />
          </p>
        </Prose>
      </CaseSection>

      <CaseSection meta={S.role}>
        <Prose>
          <p>저장소는 데이터·모델 파이프라인, 웹 화면, API 서버 세 개입니다.</p>
        </Prose>
        {roleItems(roles)}
        <div>
          <SubHead>사용 기술</SubHead>
          <div className="mt-4">
            <TechStackGrid groups={techStack} />
          </div>
        </div>
      </CaseSection>

      <CaseSection meta={S.flow}>
        <FlowFigure steps={project.flow!} caption={project.flowCaption} />
      </CaseSection>

      <CaseSection meta={S.decisions}>
        {DECISIONS.map((d, i) => (
          <div key={d.title}>
            <ItemTitle n={i + 1}>{d.title}</ItemTitle>
            <p className="mt-2 pl-9 text-ink">
              <Graded text={d.body} ev={d.ev} />
            </p>
          </div>
        ))}
      </CaseSection>

      <CaseSection meta={S.eval}>
        <Prose>
          <p>
            <Graded
              text="누수를 걷어낸 재학습 모델을 이전 모델과 같은 평가셋(493,221필지, 기저율 3.33%)에 놓고 비교했습니다."
              ev={["leak"]}
            />
          </p>
        </Prose>
        <table className="tbl w-full border-collapse text-left text-[15px] leading-[1.6]">
          <caption className="pb-2 text-left text-[13px] text-note">같은 평가셋 493,221필지, 2026-08-09</caption>
          <thead>
            <tr>
              <th scope="col" className="py-2 pr-3">지표</th>
              <th scope="col" className="py-2 pr-3 text-right">이전 모델</th>
              <th scope="col" className="py-2 text-right">재학습 모델</th>
            </tr>
          </thead>
          <tbody>
            {EVAL_ROWS.map((r) => (
              <tr key={r.metric}>
                <th scope="row" className="py-2 pr-3 text-left font-semibold text-ink">{r.metric}</th>
                <td className="py-2 pr-3 text-right text-note">{r.before}</td>
                <td className="py-2 text-right text-ink">{r.after}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Prose>
          <p>
            <Graded
              text="과거로 이후를 맞히는지도 따로 봤습니다. 2023년까지 지정된 40개 구역으로 학습하고(지표도 2023년 시점 값으로 다시 계산), 2024~2026년에 새로 지정된 50개 구역 18,227필지로 검증했습니다(모집단 605,606필지, 기저율 3.01%). 결과는 PR-AUC 0.1124, lift 3.74×였고, 같은 시점의 공간 교차검증 lift 5.40×보다 낮았습니다. 당시 기록에는 ‘완전 불가는 아니지만 약하다’고 적었습니다."
              ev={["temporal"]}
            />
          </p>
        </Prose>
        <ResultsGrid
          items={[
            { text: "누수 제거 전후: PR-AUC 0.3426 → 0.1453, lift 10.29× → 4.36×", ev: ["leak"] },
            { text: "시간 분할: PR-AUC 0.1124, lift 3.74× (공간 교차검증 5.40×)", ev: ["temporal"] },
            {
              text: "교체 후 동일성: 모델 sha 일치, 재현 지표 소수 4자리 일치, 표본 1,000필지(25개 구 × 40) 점수 차 최댓값 0.0",
              ev: ["sameModel"],
            },
            {
              text: "LLM 리포트: 빈 절 23 → 0, 출력 토큰 48,684 → 3,373(−93.1%), 건당 비용 중앙값 $0.000853",
              ev: ["thinking"],
            },
            { text: "캐시 적중률 46.6~84.1%", ev: ["cache"] },
            {
              text: "하네스: 규칙 약 27개, 메타모픽 관계 9개, 화면 75칸 매트릭스 위반 0, 테스트 함수 4,409개",
              ev: ["harness"],
            },
          ]}
        />
      </CaseSection>

      <CaseSection meta={S.failed}>{troubleItems(troubles)}</CaseSection>

      <CaseSection meta={S.next}>
        {lessonItems([
          {
            text: "시간 분할 lift 3.74×는 공간 교차검증 5.40×보다 낮습니다. 과거 자료로 이후를 맞히는 힘이 아직 약합니다.",
            ev: ["temporal"],
          },
          "하네스의 2층(LLM 심사)은 설계만 있고 돌리지 않았습니다.",
          "서술 모델을 Claude Haiku 5.5로 바꾼 뒤(2026-10-23)의 건당 비용은 아직 재지 않았습니다.",
        ])}
      </CaseSection>
    </CaseLayout>
  );
}
