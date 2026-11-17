// 프로젝트 데이터의 단일 출처.
// 홈(작업 띠 · 그 밖의 작업)과 /projects/<slug> 사례 페이지가
// 기간 · 팀 · 역할 · 상태 · 한 줄 소개 · 결과 수치 · 근거를 모두 여기서 읽는다.
// 화면 문자열은 2단계 부호 규칙을 따른다: 문장 속 나열은 쉼표, " — " 꼬리말은 쉼표나 별도 항목.

// ─── 근거 종류 (3단계: 여섯 가지) ─────────────────────────────────────
// 코드        = 커밋·파일 줄로 확인됨 (커밋 고정 URL)
// 문서        = 수상·팀 문서·보고서처럼 열어 볼 수 있는 기록
// 평가표      = 평가 결과가 리포에 남아 있음
// 추정        = 측정 없이 잡은 값
// 비공개 기록 = 내 실행 로그·DB 기록처럼 공개 링크가 없는 근거
// 본인 기재   = 기록이 남지 않아 본인 기억으로만 적은 값
// 형광은 코드·문서·평가표의 결과 숫자에만, 추정은 점선, 비공개 기록·본인 기재는 표시 없음.
export type Grade = "코드" | "문서" | "평가표" | "추정" | "비공개 기록" | "본인 기재";

export const GRADES: Grade[] = ["코드", "문서", "평가표", "추정", "비공개 기록", "본인 기재"];

/** 출처 문장 속 링크 — token 글자를 label 링크로 바꿔 그린다 (근거 표 '출처' 칸) */
export type SourceLinkSpec = { token: string; label: string; href: string };

export type Evidence = {
  id: string;
  grade: Grade;
  /** 이 근거가 뒷받침하는 수치·주장 */
  claim: string;
  /** 어디서 무엇을 확인했는지 */
  source: string;
  /** 커밋 고정 URL (코드·평가표) 또는 원본 문서 경로 */
  href?: string;
  /** 링크에 보일 짧은 표기 — SHA, 파일·줄 등 */
  hrefLabel?: string;
  /** 출처 문장 속 링크들 (같은 주소가 href면 표 끝에 다시 붙이지 않는다) */
  srcLinks?: SourceLinkSpec[];
  /**
   * 이 근거가 뒷받침하는 "결과로 내세우는 숫자" 표기. 화면에서 이 글자에 형광(코드·평가표·문서)이나
   * 점선 밑줄(추정)을 단다. 비공개 기록·본인 기재는 표시하지 않는다. "{…}"가 있으면 그 부분만 표시.
   * [2.5단계] 설정값·차원·개수(1024차원, Semaphore(3), 500자, top-k 등)는 결과가 아니라 넣지 않는다.
   */
  marks?: string[];
  /** [4단계] 종류와 상관없이 점선(추정)으로 그릴 글자 — 비공개 기록 안의 추정값 (예: 규칙 수 "약 27개") */
  estMarks?: string[];
  /** 커밋 근거의 커밋 날짜 (클론에서 git show -s --date=short) */
  date?: string;
};

export type Metric = {
  label: string;
  /** 타일의 큰 값 — 숫자나 핵심어만, 8자 이내 한 줄. 단위·수식어·전후 값은 label·note로 */
  value: string;
  /** 값 아래 보조 설명 (기존 Highlights 카드의 note) */
  note?: string;
  /** Evidence.id 목록 — 첫 항목의 등급을 대표로 표시 */
  ev: string[];
};

export type ProjectLink = { label: string; href: string };

/** 흐름 그림 한 단계 — 본문(또는 리포)에 적힌 단계 그대로 */
export type FlowStep = {
  /** 단계 앞 꼬리표 (예: Stage 1) — 이름과 간격으로 나눠 보인다 */
  tag?: string;
  name: string;
  /** 배열이면 항목을 줄로 나눈다 */
  detail?: string | string[];
  /** 내가 맡은 단계 */
  mine?: boolean;
  /** 이 단계 문구 속 수치의 근거 id */
  ev?: string[];
};

/** 근거가 붙는 한 줄 */
export type GradedLine = { text: string; ev?: string[] };

export type ProjectGroup = "AI/NLP" | "Full-Stack";

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  group: ProjectGroup;
  /** 유형 라벨 (예: 교육 과정 팀 프로젝트) */
  kind: string;
  /** 문장형 제목 — 한 일과 결과 */
  headline: string;
  /** 홈 카드·띠용 한 줄 (기존 lib/projects.ts oneLiner) */
  oneLiner: string;
  /** oneLiner 속 수치의 근거 id */
  oneLinerEv?: string[];
  /** 사례 페이지 머리 요약 (기존 상세 페이지 머리 oneLiner) */
  summary: string;
  /** summary 속 수치의 근거 id */
  summaryEv?: string[];
  /** [4단계] 요약 문장에도 형광을 단다 (기본은 형광 없음) */
  summaryHl?: boolean;
  /** 검색·공유용 설명 (기존 각 페이지 metadata.description) */
  description: string;
  period: string;
  /** 없으면(1인 개발) 메타 줄에 팀 항목을 만들지 않는다 */
  team?: string;
  role: string;
  status: string;
  stack: string[];
  /** 머리에 보일 결과 수치 2~4개. 숫자 결과가 없으면 비워 둔다(칸을 만들지 않음). */
  metrics: Metric[];
  /** 근거 색인 — 본문 수치의 근거까지 포함 */
  evidence: Evidence[];
  /** 홈 작업 띠의 결과 2~3줄 */
  results?: GradedLine[];
  /** 흐름 그림 (홈 띠 · 사례 페이지 공용) */
  flow?: FlowStep[];
  flowCaption?: string;
  /** 커밋 고정 리포 링크 (없으면 칸을 만들지 않음) */
  repo?: ProjectLink;
  links?: ProjectLink[];
  /** 홈 노출 위치: work = 작업 띠, other = 그 밖의 작업 한 줄 */
  display: "work" | "other";
  /** 홈 '그 밖의 작업' 목록 줄에 기간 대신 쓸 표기 (없으면 period) */
  homePeriod?: string;
  /** [4단계] 홈 작업 띠 메타 줄 (없으면 이름 · 부제 · 역할 · 팀 · 기간 · 상태) */
  homeMeta?: string[];
  /** [4단계] 홈 작업 띠 결과 줄 아래 한 줄 (선정 이력 등). 형광 1개 + 출처 링크 + 근거 번호 */
  homeNote?: { text: string; ev?: string[]; link?: ProjectLink };
  /** [4단계] 비공개 기록 근거의 주석 문구 (없으면 "본인 실행 기록 (비공개)") */
  privateNote?: string;
};

const SV = "https://github.com/2026-StructVerify-Lab/structverify";
const SV_MAIN = "fb4f5deb35469ec36c9b5a83cb796b1ce078748f";
const T2G = "https://github.com/yeseul-kim01/2026-Text2Graph";
const T2G_MAIN = "504504f914ff4c211725a5448efadb0de511a745";
// [3단계] 근거 링크 (지시문 [R0408] [Rnow] [NB] [RPT])
const T2G_R0408 = `${T2G}/blob/269da67c14ca4212000016863547c0bca4b6a74f/README.md?plain=1#L51-L58`;
const T2G_RNOW = `${T2G}/blob/${T2G_MAIN}/README.md?plain=1#L97-L103`;
// [NB] [4단계 A2] 노트북 링크는 ?plain=1 + 줄 앵커. 로그인한 사람은 그 줄로 가고, 아니면 렌더된 노트북 화면이 열린다
const T2G_NB = `${T2G}/blob/3769725bc82acf3a488213e1ce4756befab5bfa9/project1/runtimeCheck.ipynb?plain=1`;
const T2G_NB_REL2ID = `${T2G_NB}#L12756-L12760`;
const T2G_NB_DREEAM = `${T2G_NB}#L12676-L12678`;
const T2G_RPT = `${T2G}/blob/${T2G_MAIN}/${encodeURI("레포트최종본.pdf")}`;
const MED = "https://github.com/ljhljh0703-cmd/Medical-Chatbot";
const MED_DEV = "f2bc415fce1afb7be58bc51c898422d6c557f17d";
// [3단계] 근거 링크 (지시문 [MR] [MP]) — 팀 README·문서 (juhyeong 브랜치 @25b0592)
const MED_MR = `${MED}/blob/25b0592c82ab2491c1388590a6a6135b302659f8/README.md?plain=1`;
const MED_MP = `${MED}/blob/25b0592c82ab2491c1388590a6a6135b302659f8/docs/portfolio.html#L860`;
// [4단계] 재개발 스캐너 근거 12 — ‘모두의 창업’ 2기 1라운드 선발 규모 (정책브리핑)
const KR_BRIEFING = "https://www.korea.kr/multi/visualNewsView.do?newsId=148974005";
const HP = "https://github.com/wlsksekf/hire-picker";
const HP_JAEYOON = "d99d665dae4097cfc96e67bd478fb3262f18501a";
const HW = "https://github.com/CodeGlove/-SIST-Project2-HighwayRestInfo";
const HW_JAEYOON = "58dd54e17abdc1341d32a944e6031faff40a7bd6";

export const projects: Project[] = [
  // ─── StructVerify-Lab ──────────────────────────────────────────────
  {
    slug: "structverify-lab",
    title: "StructVerify-Lab",
    subtitle: "범용 수치 팩트체크 플랫폼",
    group: "AI/NLP",
    kind: "교육 과정 팀 프로젝트",
    headline:
      "기사 속 수치 주장을 KOSIS 통계와 대조하는 플랫폼에서 데이터 레이어와 검증 흐름을 맡았습니다",
    oneLiner:
      "기사 속 수치 주장을 KOSIS 공식 통계와 비교해 진위 판정. 초기 baseline 파이프라인부터 KOSIS 262,783건 적재·runtime 병렬화까지.",
    oneLinerEv: ["catalog"],
    summary:
      "기사 속 수치 주장을 KOSIS 공식 통계와 비교해 진위 판정하는 LLM 플랫폼. 초기 baseline 파이프라인부터 KOSIS 262,783건 적재, 표 매칭 필터 4종, runtime 병렬화 ~7분→~1/3, LLM 429 backoff까지 담당.",
    description:
      "v2.0 LLM 사실검증 플랫폼. 인프라·데이터 적재·KOSIS 메타/검색·LLM 429 backoff·runtime 병렬화·검증 판단까지 8개 모듈 담당.",
    summaryEv: ["catalog", "filterIntl", "filterForecast", "filterRegion", "parallelEst", "parallel"],
    period: "2026.04 ~ 08",
    team: "4명 (멋쟁이사자처럼 NLP 과정)",
    role: "데이터 레이어, runtime 검증 병렬화, LLM 클라이언트 안정화, 검증 판단",
    status: "종료",
    stack: ["NCP HCX", "Pydantic", "PostgreSQL+pgvector", "KOSIS API", "FastAPI", "AWS EC2"],
    metrics: [
      { label: "수상", value: "최우수", note: "6팀 중 최우수상, 멋쟁이사자처럼 NLP 집중과정", ev: ["award"] },
      { label: "데이터 적재 건수", value: "262,783", note: "KOSIS 통계 카탈로그 + HCX 임베딩 v2 (1024차원)", ev: ["catalog", "dim"] },
      { label: "Runtime 병렬화", value: "약 1/3", note: "직렬 ~7분 대비, claim 8건 직렬 vs asyncio.gather + Semaphore(3)", ev: ["parallelEst", "parallel"] },
      { label: "표 매칭 필터", value: "4종", note: "국제기구, 장래추계, 해외 지역, 세부 대상", ev: ["filterIntl", "filterForecast", "filterRegion"] },
    ],
    evidence: [
      {
        id: "award",
        grade: "문서",
        claim: "멋쟁이사자처럼 NLP 과정 최종 프로젝트 6팀 중 최우수상",
        source: "상장 이미지 (최우수상·팀명·날짜 기재. ‘6팀’은 상장에 없고 본인 기재)",
        href: "/projects/structverify-lab/award.jpg",
        hrefLabel: "상장",
        marks: ["최우수"],
      },
      {
        id: "catalog",
        grade: "문서",
        claim: "KOSIS 통계 카탈로그(kosis_stat_catalog) 262,783건 적재",
        // [3단계 B5] 공개 문서 링크 (팀 저장소 문서에는 26만으로 기재)
        source:
          "팀 저장소 문서에는 26만으로 기재 (docs/custom-embedding-plan.md L4). 정확한 건수는 kosis_stat_catalog 행 수, 2026.05 EC2 이관 기록 (리포 밖)",
        href: `${SV}/blob/${SV_MAIN}/docs/custom-embedding-plan.md?plain=1#L4`,
        hrefLabel: "custom-embedding-plan.md L4",
        srcLinks: [
          {
            token: "docs/custom-embedding-plan.md L4",
            label: "docs/custom-embedding-plan.md L4",
            href: `${SV}/blob/${SV_MAIN}/docs/custom-embedding-plan.md?plain=1#L4`,
          },
        ],
        marks: ["262,783건", "262,783"],
      },
      {
        id: "parallel",
        grade: "코드",
        claim: "claim별 검증을 asyncio.gather + Semaphore(3)로 병렬화",
        source: "runtime_agent.py Step 7~9 병렬화 커밋",
        href: `${SV}/commit/bb04054419fded016f71b1568f88a04e8e4815b6`,
        hrefLabel: "bb04054",
        date: "2026-05-12",
      },
      {
        id: "parallelEst",
        grade: "추정",
        claim: "claim 1건당 14~40초, 8건 직렬 ~7분 → 병렬 3이면 ~1/3",
        source: "runtime_agent.py 주석의 추정치, 측정 로그 없음 (주석은 팀원 머지 커밋 b2e52e8에서 처음 등장)",
        href: `${SV}/blob/${SV_MAIN}/structverify/agent/runtime_agent.py#L339-L341`,
        hrefLabel: "runtime_agent.py L339–341",
        marks: ["~7분 → 병렬 ~1/3", "~7분 → ~1/3", "~7분→~1/3", "14~40초", "약 1/3", "~7분", "~1/3"],
      },
      {
        id: "embedOpenAI",
        grade: "코드",
        claim: "초기 버전: OpenAI 임베딩(text-embedding-3-small)을 100건 단위 배치로 호출",
        source: "kosis_crawler.py save_to_db (2026-04-27)",
        href: `${SV}/commit/48cf55b79995b2135bdcc2175b0e8da83e80888a`,
        hrefLabel: "48cf55b",
        date: "2026-04-27",
      },
      {
        id: "embedHcx",
        grade: "코드",
        claim: "HCX 임베딩 v2 전환 뒤: 배치 미지원이라 한 건씩 호출 + Semaphore(3) + 429 재시도 최대 5회",
        source: "kosis_crawler.py get_embedding_safe (2026-04-29)",
        href: `${SV}/commit/4b6dbab5717e00e120c6f61658b7800500cd6403`,
        hrefLabel: "4b6dbab",
        date: "2026-04-29",
      },
      {
        id: "embedNow",
        grade: "코드",
        claim: "현재 코드: 100건 단위로 나눠 embed_batch → _embed_batch_hcx가 Semaphore(3), 재시도 5회로 건별 호출",
        source: "embedding_client.py (_BATCH_CONCURRENCY = 3, _BATCH_MAX_RETRY = 5)",
        href: `${SV}/blob/${SV_MAIN}/structverify/utils/embedding_client.py#L210-L235`,
        hrefLabel: "embedding_client.py L210–235",
      },
      {
        id: "dim",
        grade: "코드",
        claim: "HCX 임베딩 v2 1024차원",
        source: "init_db.py embedding vector(1536) → vector(1024) (main: embedding_client.py L19 EMBEDDING_DIM = 1024)",
        href: `${SV}/commit/9fa3c26b676258f74e77bb5bdee8556ad6d4c79f`,
        hrefLabel: "9fa3c26",
        date: "2026-04-28",
      },
      {
        id: "tables",
        grade: "코드",
        claim: "init_db.py 핵심 5 테이블 (requests/claims/truths/results/kosis_stat_catalog)",
        source: "init_db.py CREATE TABLE 5개",
        href: `${SV}/blob/${SV_MAIN}/structverify/storage/init_db.py#L34-L99`,
        hrefLabel: "init_db.py L34–99",
      },
      {
        id: "tablesAlembic",
        grade: "코드",
        claim: "sv_platform alembic 4 테이블 (tenants/users/api_keys/jobs) → init_db와 합쳐 9",
        source: "0001_initial.py op.create_table 4개 (팀원 yeseul 커밋). memory/schema.sql의 2개 테이블은 별도",
        href: `${SV}/blob/${SV_MAIN}/sv_platform/alembic/versions/0001_initial.py#L20-L94`,
        hrefLabel: "0001_initial.py L20–94",
      },
      {
        id: "categories",
        // [2단계] 31 → 30 정정 (KOSIS_TOP_CATEGORIES 30줄, 주석 처리된 MT_OTITLE 1줄 제외)
        grade: "코드",
        claim: "주제별 통계(MT_ZTITLE) 30개 카테고리",
        source: "kosis_crawler.py KOSIS_TOP_CATEGORIES 30개 항목 (A~V)",
        href: `${SV}/blob/${SV_MAIN}/structverify/adaptation/kosis_crawler.py#L91-L124`,
        hrefLabel: "kosis_crawler.py L91–124",
      },
      {
        id: "cos085",
        grade: "본인 기재",
        claim: "코사인 유사도 0.85",
        source: "리포·로그에 유사도 기록이 남아 있지 않음",
      },
      {
        id: "backoff",
        grade: "코드",
        claim: "HCX v1·v3 429 재시도: 최대 3회 시도, 1초·2초 대기 후 실패",
        source: "llm_client.py _call_hcx_v1/_call_hcx_v3 (2026-05-14)",
        href: `${SV}/commit/24ac3a97b4c58d599b5a9bae7c5c418572dfed28`,
        hrefLabel: "24ac3a9",
        date: "2026-05-14",
      },
      {
        id: "backoffStructured",
        grade: "코드",
        claim: "_call_hcx_structured에도 같은 재시도(최대 3회 시도, 1초·2초 대기)",
        source: "llm_client.py _call_hcx_structured (2026-05-18)",
        href: `${SV}/commit/6cfc82ed121ee954e24cfbba09d098b3dbc7f7fa`,
        hrefLabel: "6cfc82e",
        date: "2026-05-18",
      },
      {
        id: "filterIntl",
        grade: "코드",
        claim: "필터: 국제기구(UN·IMF·OECD) 표 차단 + 영아·신생아·모성 세부 대상 차단",
        source: "kosis_connector.py _is_table_relevant",
        href: `${SV}/commit/da34cba63de418be93cedcb97ca94ea66a7edbd7`,
        hrefLabel: "da34cba",
        date: "2026-05-19",
      },
      {
        id: "filterForecast",
        grade: "코드",
        claim: "필터: 장래·추계·전망 표 차단",
        source: "kosis_connector.py _is_table_relevant",
        href: `${SV}/commit/1d4a90a7fb3e0c5166a0b74eda892de501d81e2b`,
        hrefLabel: "1d4a90a",
        date: "2026-05-15",
      },
      {
        id: "filterRegion",
        grade: "코드",
        claim: "필터: 해외 지역명 표 차단",
        source: "kosis_connector.py _is_table_relevant",
        href: `${SV}/commit/38b1041d66f7b5851c37fa1cbad992da7ae8079c`,
        hrefLabel: "38b1041",
        date: "2026-05-15",
      },
      {
        id: "year",
        grade: "코드",
        claim: "연도 필터 ±2 → 정확 일치",
        source: "verifier.py abs(claim_year - kv_year) > 2 → > 0",
        href: `${SV}/commit/8d46a4b02d196fabf6bde036d91c5848980907a7`,
        hrefLabel: "8d46a4b",
        date: "2026-05-15",
      },
      {
        id: "over90",
        grade: "코드",
        claim: "오차 90% 초과는 판단불가(UNVERIFIABLE) 처리",
        source: "verification/config.yaml mismatch_max_error: 0.90 (90% 임계는 팀원 김예슬 2026-05-06 추가)",
        href: `${SV}/blob/${SV_MAIN}/structverify/verification/config.yaml#L20`,
        hrefLabel: "config.yaml L20",
      },
      {
        // [2.5단계] 1단계에서 빠졌던 KOSIS 세마포어 내용 (main L138–139, 이 커밋에서는 L137–138)
        // [3단계 B3] 이전 값 15·5는 코드 주석에만 있고 그 값이 들어간 커밋은 없다
        id: "semKosis",
        grade: "코드",
        claim: "임베딩 갱신 스크립트: KOSIS 호출 동시 실행 5, HCX 임베딩 호출 3",
        source:
          "update_embeddings.py semaphore_api = Semaphore(5), semaphore_hcx = Semaphore(3) (본인 커밋) L138–139. 이전 값은 주석에만 있음",
        href: `${SV}/commit/5866f0bb077cef3fd428bd2d78544323ba16ea9f`,
        hrefLabel: "5866f0b",
        date: "2026-04-30",
      },
    ],
    repo: { label: "2026-StructVerify-Lab/structverify @fb4f5de", href: `${SV}/tree/${SV_MAIN}` },
    results: [
      { text: "멋쟁이사자처럼 NLP 집중과정 6팀 중 최우수상", ev: ["award"] },
      { text: "KOSIS 통계 카탈로그 262,783건 적재 + 1024차원 임베딩", ev: ["catalog", "dim"] },
      { text: "claim 8건 직렬 ~7분 → ~1/3 (asyncio.gather + Semaphore(3))", ev: ["parallelEst", "parallel"] },
    ],
    flow: [
      { name: "기사 텍스트 입력", detail: "비정형 텍스트(뉴스·보고서·문서)" },
      { name: "claim 추출", detail: "수치 기반 주장을 자동으로 추출" },
      {
        name: "KOSIS 카탈로그 검색",
        detail: "kosis_stat_catalog에 대해 category_path ILIKE + embedding 코사인 유사도 하이브리드 검색",
        mine: true,
      },
      {
        name: "통계표 필터",
        detail: ["_is_table_relevant()", "국제기구, 장래추계, 해외 지역, 세부 대상 4종 마커로 차단"],
        mine: true,
        ev: ["filterIntl", "filterForecast", "filterRegion"],
      },
      { name: "수치 판정 (verifier)", detail: "단위·연도·오차율 같은 수치 판정은 verifier가 결정론적 코드로만", mine: true },
      { name: "설명 (explainer)", detail: "자연어 설명은 explainer에서 LLM이 맡음" },
    ],
    flowCaption: "본문에 적힌 검증 단계. 굵은 글씨 단계를 맡았습니다.",
    display: "work",
  },

  // ─── 재개발 스캐너 (4단계) ──────────────────────────────────────────
  // 저장소가 비공개라 근거는 12번(정책브리핑)만 문서, 8번은 추정, 나머지는 비공개 기록.
  // 서비스 주소·화면 캡처·저장소 링크·자료 원천 이름·내부 파일 이름·해시값은 넣지 않는다.
  {
    slug: "redev-scanner",
    title: "재개발 스캐너",
    subtitle: "서울 재개발 분석 서비스",
    group: "AI/NLP",
    kind: "1인 개발 (예비창업자)",
    headline: "잘 나온 모델 지표가 누수 때문이었다는 걸 찾아내고, 절반 아래로 내려간 값을 기준으로 다시 시작했습니다",
    oneLiner:
      "서울 약 90만 필지의 공공 자료를 모아 재개발 가능성의 방향을 근거와 함께 보여 주는 분석 서비스. 흩어진 공공 자료를 모으고, 틀린 값이 섞이지 않도록 검사 규칙으로 자동 점검합니다.",
    summary:
      "서울 약 90만 필지의 공공 자료를 모아 재개발 가능성의 방향을 근거와 함께 보여 주는 분석 서비스를 혼자 만들고 있습니다. 결론은 내리지 않고 방향과 근거만 보여 주는 것이 원칙이라, 틀린 값이 섞이지 않게 검사 규칙으로 스스로 점검하게 했습니다. 2026.10에는 이 서비스로 중소벤처기업부 ‘모두의 창업’ 2기 1라운드에 선정됐습니다(지원 9.3만 명 중 1만 명 선발, 예비창업자, 일반·기술 트랙, 멘토기관 서울시립대학교). 저장소가 비공개라 이 페이지의 숫자는 모두 비공개 기록입니다.",
    summaryEv: ["selected"],
    // 이 페이지의 형광은 요약의 「9.3만 명 중 1만 명」 한 곳
    summaryHl: true,
    description:
      "서울 약 90만 필지의 공공 자료를 모아 재개발 가능성의 방향을 근거와 함께 보여 주는 분석 서비스. 흩어진 공공 자료를 모으고, 틀린 값이 섞이지 않도록 검사 규칙으로 자동 점검합니다.",
    period: "2026.05 ~ 현재",
    role: "자료 수집·모델·검사·화면 전 구간",
    status: "진행 중",
    stack: ["Python", "XGBoost", "FastAPI", "React", "Claude Haiku 5.5"],
    // 타일 설명은 한 문장 그대로 label에 (note를 쓰면 ", "로 이어져 문구가 바뀐다)
    metrics: [
      { label: "누수를 걷어낸 PR-AUC. 이전 값 0.3426 (같은 평가셋 493,221필지)", value: "0.1453", ev: ["leak"] },
      { label: "평가한 모델과 화면이 쓰는 모델의 점수 차 최댓값 (표본 1,000필지)", value: "0.0", ev: ["sameModel"] },
      { label: "LLM 리포트에서 제목만 있고 본문이 빈 절. thinking을 끈 쪽을 채택", value: "23 → 0", ev: ["thinking"] },
    ],
    evidence: [
      {
        id: "leak",
        grade: "비공개 기록",
        claim: "같은 평가셋 493,221필지(기저율 3.33%)에서 PR-AUC 0.3426 → 0.1453 (−57.6%), lift 10.29× → 4.36×",
        source: "비공개 실험 기록, 2026-08-09",
      },
      {
        id: "noBldg",
        grade: "비공개 기록",
        claim: "음성 482,329필지 중 건물이 없는 필지 1건",
        source: "비공개 실험 기록, 2026-08-09",
      },
      {
        id: "temporal",
        grade: "비공개 기록",
        claim:
          "시간 분할: 40개 구역 학습 → 50개 구역 18,227필지 검증(모집단 605,606필지, 기저율 3.01%). PR-AUC 0.1124, lift 3.74×, 공간 교차검증 lift 5.40×",
        source: "비공개 실험 기록, 2026-08-11",
      },
      {
        id: "scoreFile",
        grade: "비공개 기록",
        claim: "화면 점 색과 군집 판정의 점수 파일 불일치: 공통 722,566필지 중 722,561건, 최대 차이 0.995",
        source: "비공개 진단 기록, 2026-08-05",
      },
      {
        id: "sameModel",
        grade: "비공개 기록",
        claim:
          "다른 프로세스 3회 학습: sha 모두 다름, 점수 차 최대 0.555, 상위 1% 일치 90.3%. 교체 후: 모델 sha 일치, 재현 지표 소수 4자리 일치, 표본 1,000필지 점수 차 최댓값 0.0",
        source: "비공개 실험 기록과 커밋, 2026-08-11",
      },
      {
        id: "altSource",
        grade: "비공개 기록",
        claim: "대체 원천 재현율 95.9% (4,686/4,886필지), 미리 정한 기준 ±1%p",
        source: "비공개 기록, 2026-09-04",
      },
      {
        id: "thinking",
        grade: "비공개 기록",
        claim:
          "thinking 켬/끔 비교: 표본 20, 유효 15쌍. 빈 절 23 → 0, 출력 토큰 48,684 → 3,373 (−93.1%), 건당 비용 중앙값 $0.000853 (당시 gemini-2.5-flash, 공식 단가로 계산)",
        source: "비공개 설계 문서와 커밋, 2026-08-11",
      },
      {
        id: "cache",
        grade: "추정",
        claim: "캐시 적중률 46.6~84.1%",
        source: "설계 문서의 추정값, 실측 아님",
        marks: ["46.6~84.1%"],
      },
      {
        id: "harness",
        grade: "비공개 기록",
        claim:
          "하네스: 규칙 약 27개, 메타모픽 관계 9개, 화면 75칸 매트릭스 위반 0, 테스트 함수 4,409개(파이썬 3,992, JS 417)",
        source: "코드에서 셈 2026-11-17 (규칙 수는 추정), 매트릭스는 2026-08-11 기록",
        estMarks: ["약 27개"],
      },
      {
        id: "scope",
        grade: "비공개 기록",
        claim: "서빙 898,286필지(2026-10-31), 라벨 90개 구역 36,796필지(2026-10-18), 지표 45개(2026-08-11), 저장소 3개",
        source: "비공개 기록. 착수 2026.05는 본인 기재이고 저장소 첫 커밋은 2026-06-09",
      },
      {
        id: "aiCommits",
        grade: "비공개 기록",
        claim: "main 커밋 5,609개 중 5,248개(93.6%)에 AI 공동 작성 표시. 제품 코드 109,742줄, 테스트 86,836줄",
        source: "git 집계 2026-11-17 (비공개 저장소)",
      },
      {
        id: "selected",
        grade: "문서",
        claim: "‘모두의 창업’ 2기: 지원 9.3만 명 중 1라운드 1만 명 선발",
        source: "정책브리핑. 본인 선정(2026-10-14)은 운영 기관 통지(비공개)",
        href: KR_BRIEFING,
        hrefLabel: "정책브리핑",
        srcLinks: [{ token: "정책브리핑", label: "정책브리핑", href: KR_BRIEFING }],
        marks: ["9.3만 명 중 1만 명"],
      },
    ],
    results: [
      { text: "누수를 걷어낸 PR-AUC 0.3426 → 0.1453 (같은 평가셋 493,221필지)", ev: ["leak"] },
      { text: "평가한 모델과 화면이 쓰는 모델의 점수 차 0.0 (표본 1,000필지)", ev: ["sameModel"] },
      { text: "LLM 리포트 빈 절 23 → 0, 출력 토큰 −93.1%", ev: ["thinking"] },
    ],
    homeMeta: ["재개발 스캐너", "서울 재개발 분석 서비스", "1인 개발 (예비창업자)", "2026.05 ~ 현재", "진행 중"],
    homeNote: {
      text: "2026.10 중소벤처기업부 ‘모두의 창업’ 2기 1라운드 선정 (지원 9.3만 명 중 1만 명), 멘토기관 서울시립대학교",
      ev: ["selected"],
      link: { label: "정책브리핑", href: KR_BRIEFING },
    },
    flow: [
      { name: "공공 자료 수집·정리", detail: "필지 단위로 묶음", mine: true },
      { name: "지표 계산", detail: "45개", mine: true },
      { name: "점수 모델", detail: "XGBoost", mine: true },
      { name: "자가 검사", detail: "규칙, 메타모픽, 화면 매트릭스", mine: true },
      { name: "리포트", detail: "숫자는 코드, 서술은 LLM", mine: true },
      { name: "화면", detail: "지도와 리포트", mine: true },
    ],
    flowCaption: "전 구간을 직접 맡았습니다.",
    privateNote: "비공개 기록",
    display: "work",
  },

  // ─── Text2Graph ────────────────────────────────────────────────────
  {
    slug: "text2graph",
    title: "Text2Graph",
    subtitle: "Document-level Relation Extraction (Stage 2)",
    group: "AI/NLP",
    kind: "팀 프로젝트",
    headline: "구현 오류 두 곳을 고쳐 Dev F1을 56.64%에서 59.25%로 올렸습니다",
    oneLiner:
      "Adaptive Threshold 버그 + ATLOP Loss 구현 오류 수정으로 F1 +2.61pt (56.64 → 59.25)",
    oneLinerEv: ["f1"],
    summary:
      "DocRED Document-level Relation Extraction 파이프라인의 Stage 2 (ATLOP + DREEAM) 담당. 두 구현 오류(ATLOP Ranking Loss, Adaptive Threshold 평가)를 디버깅으로 잡아 v1 56.64% → v2 59.25% (+2.61pt) 도달.",
    description:
      "Document-level Relation Extraction. ATLOP Loss + Adaptive Threshold 두 구현 오류를 수정해 v1 56.64% → v2 59.25% (+2.61pt)",
    summaryEv: ["f1"],
    period: "2026.04",
    team: "4명",
    role: "Stage 2 (ATLOP + DREEAM) 담당",
    status: "종료",
    stack: ["PyTorch", "HuggingFace", "ATLOP", "DREEAM", "BERT", "NetworkX"],
    metrics: [
      { label: "Dev F1", value: "+2.61pt", note: "56.64% → 59.25% (두 디버깅 수정의 합산 효과)", ev: ["f1"] },
      // [3단계 C8] 출처 줄은 근거 5 하나만 (비공개 기록)
      { label: "Triple 추출", value: "10,494", note: "dev 998 문서 → NetworkX 기반 KG 시각화", ev: ["triples"] },
      // [3단계 C8·C9] 관계별 수치는 정밀도가 아니라 F1
      { label: "관계별 F1", value: "0~12.5%", note: "하위 10개 관계의 F1 (정답 10건 이상). 상위 3개 관계는 81.5~90.3%", ev: ["relgap"] },
    ],
    evidence: [
      {
        id: "f1",
        grade: "평가표",
        claim: "v1 F1 56.64% (P 60.74, R 53.06) → v2 F1 59.25% (P 63.11, R 55.83), +2.61pt",
        source: "README 버전별 성능 표 (본인 커밋 0a6285e가 처음 추가, 학습 로그는 리포에 없음)",
        href: `${T2G}/blob/${T2G_MAIN}/README.md#L446-L447`,
        hrefLabel: "README L446–447",
        marks: ["v1 56.64% → v2 59.25%", "56.64% → 59.25%", "56.64 → 59.25", "+2.61pt", "59.25%"],
      },
      {
        id: "th05",
        grade: "코드",
        claim: "평가가 고정 threshold 0.5로 relation을 채택하던 부분을 threshold_logits 비교로 수정",
        source: "evaluate_on_dev, ATLOPLoss 수정 커밋 (본인)",
        href: `${T2G}/commit/31e47dc9c412651bbfc1db31fd8f72d5cf47a9d1`,
        hrefLabel: "31e47dc",
        date: "2026-04-08",
      },
      {
        id: "rel97",
        grade: "코드",
        claim: "관계 97종, 라벨 0–96",
        source:
          "팀 파이프라인 rel2id.json 97개 항목 (PM 커밋 ba690a5). 본문의 ‘생성’은 DREEAM 재현 실행용 파일로, 노트북 셀 [NB]#L12756-L12760",
        href: `${T2G}/blob/${T2G_MAIN}/pipeline/data/meta/rel2id.json`,
        hrefLabel: "rel2id.json",
        srcLinks: [
          { token: "rel2id.json", label: "rel2id.json", href: `${T2G}/blob/${T2G_MAIN}/pipeline/data/meta/rel2id.json` },
          { token: "[NB]#L12756-L12760", label: "runtimeCheck.ipynb L12756–12760", href: T2G_NB_REL2ID },
        ],
      },
      {
        id: "dev998",
        grade: "코드",
        claim: "DocRED dev set 998 문서",
        source: "파이프라인 노트북 출력 ‘Loaded 998 documents from dev.json’",
        href: `${T2G}/blob/${T2G_MAIN}/pipeline/notebooks/run_pipeline_colab_final.ipynb?plain=1#L693-L695`,
        hrefLabel: "run_pipeline_colab_final.ipynb L693–695",
      },
      {
        id: "triples",
        grade: "비공개 기록",
        claim: "10,494 triple 추출",
        source:
          "본인 Colab 실행 출력 ‘총 10494개 triple 생성’ (2026.04, 비공개). 팀 최종 노트북의 Stage 2 평가는 다른 체크포인트로 10,652건",
      },
      {
        id: "relgap",
        grade: "비공개 기록",
        claim: "관계별 F1: 상위 3개 81.5~90.3%, 하위 10개 0~12.5% (정답 10건 이상)",
        source: "본인 Colab 실행 출력 (2026.04, 비공개). 결과 파일은 리포에 없음",
      },
      {
        id: "bench",
        grade: "문서",
        claim: "ATLOP-BERT Dev F1 64.19% (distant supervision), 학습 문서 약 33배",
        source:
          "팀 최종 보고서 표 3.2 (p.7, †=distantly supervised pre-training)와 2.1 (p.5, 3,053 / 101,873) [RPT]. 원 논문의 사람 라벨만 쓴 BERT-base Dev F1은 61.09",
        href: T2G_RPT,
        hrefLabel: "레포트최종본.pdf",
        srcLinks: [{ token: "[RPT]", label: "레포트최종본.pdf", href: T2G_RPT }],
        // 형광 없음: 이 문단의 형광은 61.71%(근거 8)와 59.25%(근거 1) 두 곳만
      },
      {
        // [3단계 C13] 8번 추가 — DREEAM 공식 코드 재현 (jaeyoon·dev 브랜치 노트북 출력)
        id: "dreeam",
        grade: "코드",
        claim: "DREEAM 공식 코드 재현: dev F1 61.71, Ign F1 59.79, Evidence F1 52.21 (bert-base, 30 epoch)",
        source: "본인 노트북 출력 [NB]#L12676-L12678 (jaeyoon·dev 브랜치)",
        href: T2G_NB_DREEAM,
        hrefLabel: "runtimeCheck.ipynb L12676–12678",
        srcLinks: [
          { token: "[NB]#L12676-L12678", label: "runtimeCheck.ipynb L12676–12678", href: T2G_NB_DREEAM },
        ],
        marks: ["61.71%"],
      },
      {
        // [3단계 C13] 9번 추가 — 담당 범위
        id: "owner",
        grade: "문서",
        claim: "Stage 2 담당",
        source:
          "2026-04-08 팀 README 담당 분배 표 [R0408]. 현재 README 담당 표는 ‘ATLOP ranking loss 구현, 평가 단계 adaptive threshold 보강’으로 기재 [Rnow]",
        href: T2G_R0408,
        hrefLabel: "README L51–58 @269da67",
        srcLinks: [
          { token: "[R0408]", label: "README L51–58 @269da67", href: T2G_R0408 },
          { token: "[Rnow]", label: "README L97–103 @504504f", href: T2G_RNOW },
        ],
      },
    ],
    repo: { label: "yeseul-kim01/2026-Text2Graph @504504f", href: `${T2G}/tree/${T2G_MAIN}` },
    links: [{ label: "HuggingFace 모델 park990/hihi_model", href: "https://huggingface.co/park990/hihi_model" }],
    results: [
      { text: "Dev F1 56.64% → 59.25% (+2.61pt)", ev: ["f1"] },
      { text: "dev 998 문서 → 10,494 triple 추출", ev: ["dev998", "triples"] },
      { text: "관계별 F1 81.5~90.3% vs 0~12.5% (표면 패턴 vs 상식 추론)", ev: ["relgap"] },
    ],
    flow: [
      { tag: "Stage 1", name: "Baseline", detail: "BERT + Mean Pooling" },
      { tag: "Stage 2", name: "ATLOP + DREEAM", detail: "LogSumExp + Adaptive Threshold + Evidence Head", mine: true },
      { tag: "Stage 3", name: "GAIN", detail: "+ GCN 그래프 추론" },
      { tag: "Stage 4", name: "U-Net", detail: "+ Graph U-Net 그래프 추론" },
    ],
    flowCaption: "4-Stage Incremental Stacking",
    display: "work",
  },

  // ─── Medical Chatbot ───────────────────────────────────────────────
  {
    slug: "medical-rag",
    title: "Medical Chatbot",
    subtitle: "의료 도메인 챗봇, RAG 파이프라인 + 자동 평가 담당",
    group: "AI/NLP",
    kind: "교육 과정 팀 프로젝트",
    headline: "RAG를 붙이자 정답률이 65.4%에서 63.1%로 내려간 원인을 오답 케이스로 추적했습니다",
    oneLiner:
      "팀 프로젝트로 만든 의료 도메인 챗봇. 그중 RAG 파이프라인(Qwen2.5-7B, ChromaDB)과 자동 평가를 담당했고, RAG 켜기 전후 ablation에서 LLM 단독 65.4% → +RAG 63.1% 하락이 측정돼 오답 케이스로 원인을 분석했습니다.",
    oneLinerEv: ["ablation"],
    summary:
      "팀 프로젝트로 만든 의료 도메인 챗봇. 그중 RAG 파이프라인과 자동 평가를 담당했고, RAG 켜기 전후 ablation에서 LLM 단독 65.4% → +RAG 63.1% (−2.3pt) 하락을 측정해 distraction 원인을 케이스 단위로 추적. 실험용 벡터 DB와 평가 코드는 제가 Colab에서 따로 만들어 돌렸습니다. 팀 저장소에 남은 코드(평가 노트북, metrics.py, 지식베이스 구축 스크립트)는 팀원이 작성했습니다.",
    description:
      "팀 프로젝트 의료 도메인 챗봇. RAG 파이프라인(Qwen2.5-7B, ChromaDB) + 자동 평가 담당. ablation에서 LLM 단독 65.4% → +RAG 63.1% 하락 측정 + distraction 원인 분석.",
    summaryEv: ["ablation"],
    period: "2026.04",
    team: "4명 (NLP 과정 팀 프로젝트)",
    role: "RAG 파이프라인 + 자동 평가",
    status: "종료",
    stack: ["Qwen2.5-7B (4bit)", "ChromaDB·FAISS", "ko-sroberta", "Dense Retrieval", "Colab L4"],
    metrics: [
      { label: "LLM 단독 vs +RAG", value: "−2.3pt", note: "65.4% → 63.1% (Qwen2.5-7B / VL 객관식 995문항)", ev: ["ablation"] },
    ],
    // [3단계 D3] 팀원 파일 줄 수 근거(옛 5·6번) 삭제 → 4건
    evidence: [
      {
        id: "ablation",
        grade: "비공개 기록",
        claim: "객관식 995문항: LLM 단독 65.4% (651) → +RAG 63.1% (628), −2.3pt",
        source:
          "본인 Colab 실행 출력 (2026.04, 비공개). 결과 파일 results_A.json·results_B.json은 저장소에 없음. 팀 저장소의 결과는 팀원 측정 객관식 EM 0.69 → 0.67 [MR]",
        srcLinks: [{ token: "[MR]", label: "README @25b0592", href: MED_MR }],
      },
      {
        // [3단계 D8] 2026.04 Colab 실행 기록 기준 top-k = 3
        id: "topk",
        grade: "비공개 기록",
        claim: "top-k = 3",
        source:
          "본인 실행 코드(n_results=3)와 발표 자료 기록 (2026.04, 비공개). 팀 평가 노트북은 TOP_K = 5로 따로 측정 (colab_generation_eval.ipynb L307–308)",
        srcLinks: [
          {
            token: "colab_generation_eval.ipynb L307–308",
            label: "colab_generation_eval.ipynb L307–308",
            // [4단계 A2] ?plain=1 + 줄 앵커 (로그인하면 그 줄, 아니면 렌더된 노트북 화면)
            href: `${MED}/blob/${MED_DEV}/notebooks/colab_generation_eval.ipynb?plain=1#L307-L308`,
          },
        ],
      },
      {
        id: "chunk500",
        grade: "문서",
        claim: "500자 단위 chunking",
        source:
          "팀 README에 청킹 size 500 / overlap 50으로 기재 [MR]#L88. 팀 저장소에 커밋된 ChromaDB(팀원 구축)도 chunk 최대 500자",
        href: `${MED_MR}#L88`,
        hrefLabel: "팀 README L88",
        srcLinks: [{ token: "[MR]#L88", label: "README L88", href: `${MED_MR}#L88` }],
      },
      {
        id: "corpus",
        grade: "문서",
        claim: "원천 의학 텍스트 3,447개 문서 → 약 27,000 chunk",
        source:
          "팀 저장소 문서에 3,447 문서(약 1,229만 자), 약 27,000 chunk로 기재 [MP], [MR]#L88. 팀 저장소에 커밋된 ChromaDB(팀원 구축)는 28,916 chunk",
        href: MED_MP,
        hrefLabel: "portfolio.html L860",
        srcLinks: [
          { token: "[MP]", label: "portfolio.html L860", href: MED_MP },
          { token: "[MR]#L88", label: "README L88", href: `${MED_MR}#L88` },
        ],
      },
    ],
    repo: { label: "ljhljh0703-cmd/Medical-Chatbot (dev) @f2bc415", href: `${MED}/tree/${MED_DEV}` },
    results: [
      { text: "LLM 단독 65.4% → +RAG 63.1% (−2.3pt)", ev: ["ablation"] },
      { text: "원천 의학 텍스트 3,447개 → 500자 chunking → 약 27,000 chunk", ev: ["corpus", "chunk500"] },
    ],
    flow: [
      { name: "원천 의학 텍스트", detail: "3,447개 문서", mine: true, ev: ["corpus"] },
      { name: "chunking", detail: "500자 단위 → 약 27,000 chunk", mine: true, ev: ["chunk500", "corpus"] },
      { name: "임베딩, 저장", detail: "ko-sroberta 임베딩 → ChromaDB 저장 (측정 때는 FAISS 인덱스)", mine: true },
      { name: "검색 (Mode B)", detail: "Dense retrieval, top-k = 3", mine: true, ev: ["topk"] },
      { name: "생성", detail: ["Qwen2.5-7B-Instruct(4bit)", "Mode A: LLM 단독 / Mode B: LLM + RAG"] },
      { name: "자동 채점", detail: "객관식 번호 매칭, 단답 키워드 매칭 (VL 데이터셋 일괄)", mine: true },
    ],
    flowCaption: "굵은 글씨 단계를 직접 맡았습니다. LoRA fine-tuning과 FastAPI 서빙 레이어는 팀원 담당.",
    display: "work",
  },

  // ─── Booming ───────────────────────────────────────────────────────
  {
    slug: "booming",
    title: "Booming",
    subtitle: "실시간 채팅 커뮤니티 모바일 앱 (AI 대화 코칭 기능은 개발하다 중단)",
    group: "Full-Stack",
    kind: "팀 프로젝트",
    headline: "토큰을 Redis로 모으고 WebSocket 브로커를 SimpleBroker로 단순화했습니다",
    oneLiner:
      "토큰 전부 Redis 통합 + SimpleBroker 단순화 + 채팅 메시지 MongoDB 분리, 환경에 맞춰 저장소 결정",
    summary:
      "풀스택 학습 사이클의 종착점, HirePicker의 ‘Refresh DB·Redis Pub/Sub’ 반쪽/과한 설계를 받아 토큰 전부 Redis 통합 + SimpleBroker 단순화로 정리. 동시에 모바일이라는 새 환경 조건이 추가됨.",
    description:
      "HighWay Guide·HirePicker의 학습이 종착하는 세 번째 풀스택, 토큰 Redis 통합 + secure_storage + WebSocket SimpleBroker 단순화.",
    period: "2025.11 ~ 2026.01",
    homePeriod: "2025.11 ~ 2026.01, 팀이 흩어져 중단",
    team: "2명",
    role: "Spring Boot 백엔드(모임 도메인 제외) + Flutter 기획·디자인·구현",
    status: "중단",
    stack: ["Flutter", "Spring Boot", "JWT + Redis", "WebSocket(STOMP)", "MySQL", "MongoDB"],
    metrics: [],
    evidence: [
      {
        id: "fewMsgs",
        grade: "본인 기재",
        claim: "메시지 두세 개 만에 @AuthenticationPrincipal이 null",
        source: "공개 리포가 없음",
      },
    ],
    display: "other",
  },

  // ─── HirePicker ────────────────────────────────────────────────────
  {
    slug: "hirepicker",
    title: "HirePicker",
    subtitle: "구인구직 플랫폼",
    group: "Full-Stack",
    kind: "팀 프로젝트",
    headline: "HttpSession 대신 JWT를 도입하고 다대다 즐겨찾기를 공고 기준으로 다시 설계했습니다",
    oneLiner:
      "HttpSession 한계를 JWT로 도입, 휴게소 좋아요의 다대다를 공고 즐겨찾기로 재설계",
    summary:
      "HighWay Guide의 HttpSession·Action 강결합 한계와 다대다 매핑 학습을 JWT·REST 분리·즐겨찾기 재사용으로 이어간 두 번째 풀스택 프로젝트. 동시에 Redis Pub/Sub 같은 ‘과한 설계’ 한 번을 거쳐 Booming의 단순화 결정의 근거가 됨.",
    description:
      "HighWay Guide의 HttpSession·Action 강결합 한계와 다대다 매핑 학습을 JWT·REST 분리·즐겨찾기 재사용으로 이어간 두 번째 풀스택 프로젝트.",
    period: "2025.10 ~ 2025.11",
    team: "5명",
    role: "JWT 인증, 공고 즐겨찾기, WebSocket 채팅, Selenium 수집, Docker Compose",
    status: "종료",
    stack: ["Spring Boot", "Next.js", "JWT", "Redis", "WebSocket", "Docker Compose"],
    metrics: [],
    evidence: [],
    repo: { label: "wlsksekf/hire-picker (jaeyoon) @d99d665", href: `${HP}/tree/${HP_JAEYOON}` },
    display: "other",
  },

  // ─── HighWay Guide ─────────────────────────────────────────────────
  {
    slug: "highway-guide",
    title: "HighWay Guide",
    subtitle: "고속도로 통합 정보 플랫폼",
    group: "Full-Stack",
    kind: "팀 프로젝트",
    headline:
      "BCrypt + HttpSession으로 끝까지 만들어 본 첫 풀스택에서 다음 설계의 근거를 얻었습니다",
    oneLiner:
      "첫 풀스택, BCrypt + HttpSession 인증, 휴게소 좋아요 다대다 첫 설계, Action 강결합의 한계 체감",
    summary:
      "가장 단순한 형태(BCrypt + HttpSession + Action Forward)로 출발해, 그 한계를 다음 프로젝트의 결정 근거로 들고 갈 수 있게 만든 출발점.",
    description:
      "첫 풀스택, BCrypt + HttpSession 인증, 다대다 관계 첫 설계, Action 강결합의 한계를 직접 체감.",
    period: "2025.07 ~ 2025.08",
    team: "5명",
    role: "MVC Front Controller, 인증, 휴게소 즐겨찾기(다대다)",
    status: "종료",
    stack: ["Java", "JSP/Servlet", "MyBatis", "BCrypt", "HttpSession", "MySQL"],
    metrics: [],
    evidence: [
      {
        id: "threePages",
        grade: "코드",
        claim: "공통 모달을 쓰는 페이지 세 개 (지도, 마이페이지, 휴게소)",
        source: "restAreaModal.jsp를 include하는 MapInfo.jsp, mypage.jsp, restArea.jsp (모달은 본인 ‘즐겨찾기’ 커밋 ae7cbb2에서 생성, 본문의 modal.jsp는 실제 파일명과 다름)",
        href: `${HW}/blob/${HW_JAEYOON}/Project_4team/src/main/webapp/restArea.jsp#L20`,
        hrefLabel: "restArea.jsp L20",
      },
    ],
    repo: {
      label: "CodeGlove/-SIST-Project2-HighwayRestInfo (jaeyoon) @58dd54e",
      href: `${HW}/tree/${HW_JAEYOON}`,
    },
    display: "other",
  },
];

/** Text2Graph V1/V2 점수표 (README L446–447과 동일) */
export const T2G_SCORES = [
  { metric: "Micro F1", v1: "56.64%", v2: "59.25%" },
  { metric: "Precision", v1: "60.74%", v2: "63.11%" },
  { metric: "Recall", v1: "53.06%", v2: "55.83%" },
] as const;

/** HighWay Guide 서비스 설명 — 상세 페이지 캡션(출발지·도착지 입력 → 경로상 휴게시설 카드)에서 옮김 */
export const HIGHWAY_SERVICE_LINE =
  "출발지·도착지를 입력하면 경로상 휴게시설(편의시설, 주유비, 평점, 대표메뉴)을 카드로 보여 주는 웹 서비스";

// 사례 페이지 순서 (다음 사례 링크). 마지막 다음은 처음으로 돌아간다.
export const CASE_ORDER = [
  "structverify-lab",
  "redev-scanner",
  "text2graph",
  "medical-rag",
  "booming",
  "hirepicker",
  "highway-guide",
] as const;

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project {
  const i = CASE_ORDER.indexOf(slug as (typeof CASE_ORDER)[number]);
  const next = CASE_ORDER[(i + 1) % CASE_ORDER.length];
  return getProjectBySlug(next)!;
}

export function getEvidence(p: Project, id: string): Evidence | undefined {
  return p.evidence.find((e) => e.id === id);
}

/** 근거 색인 번호 (1부터) */
export function evidenceNo(p: Project, id: string): number {
  return p.evidence.findIndex((e) => e.id === id) + 1;
}

export function getProjectsByDisplay(d: Project["display"]): Project[] {
  return projects.filter((p) => p.display === d);
}
