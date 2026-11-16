// 프로젝트 데이터의 단일 출처.
// 홈(첫 화면 증거 줄 · 작업 띠 · 그 밖의 작업)과 /projects/<slug> 사례 페이지가
// 기간 · 팀 · 역할 · 상태 · 한 줄 소개 · 결과 수치 · 근거를 모두 여기서 읽는다.

// ─── 근거 등급 ───────────────────────────────────────────────────────
// 코드      = 커밋·파일 줄로 확인됨 (커밋 고정 URL)
// 평가표    = 평가 결과가 리포에 남아 있음
// 문서      = 수상·선발·DB 건수 같은 리포 밖 기록
// 추정      = 측정 없이 잡은 값
// 확인 필요 = 아직 못 정한 값 (main 병합 전에 0개가 되어야 하는 임시 등급)
export type Grade = "코드" | "평가표" | "문서" | "추정" | "확인 필요";

export const GRADES: Grade[] = ["코드", "평가표", "문서", "추정", "확인 필요"];

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
};

export type Metric = {
  label: string;
  value: string;
  /** 값 아래 보조 설명 (기존 Highlights 카드의 note) */
  note?: string;
  /** Evidence.id 목록 — 첫 항목의 등급을 대표로 표시 */
  ev: string[];
};

export type ProjectLink = { label: string; href: string };

/** 흐름 그림 한 단계 — 본문(또는 리포)에 적힌 단계 그대로 */
export type FlowStep = {
  name: string;
  detail?: string;
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
  period: string;
  team: string;
  role: string;
  status: string;
  stack: string[];
  /** 머리에 보일 결과 수치 2~4개. 숫자 결과가 없으면 비워 둔다(칸을 만들지 않음). */
  metrics: Metric[];
  /** 근거 색인 — 본문 수치의 근거까지 포함 */
  evidence: Evidence[];
  /** 홈 첫 화면 증거 줄 — 결과 한 문장 (이 파일의 수치로만) */
  proof?: GradedLine;
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
};

const SV = "https://github.com/2026-StructVerify-Lab/structverify";
const SV_MAIN = "fb4f5deb35469ec36c9b5a83cb796b1ce078748f";
const T2G = "https://github.com/yeseul-kim01/2026-Text2Graph";
const T2G_MAIN = "504504f914ff4c211725a5448efadb0de511a745";
const MED = "https://github.com/ljhljh0703-cmd/Medical-Chatbot";
const MED_DEV = "f2bc415fce1afb7be58bc51c898422d6c557f17d";
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
      "기사 속 수치 주장을 KOSIS 공식 통계와 비교해 진위 판정하는 LLM 플랫폼. 초기 baseline 파이프라인부터 KOSIS 262,783건 적재 · 표 매칭 필터 4종 · runtime 병렬화 ~7분→~1/3 · LLM 429 backoff까지 담당.",
    period: "2026.04 ~ 09",
    team: "4명 (멋쟁이사자처럼 NLP 과정)",
    role: "데이터 레이어 · runtime 검증 병렬화 · LLM 클라이언트 안정화 · 검증 판단",
    status: "종료",
    stack: ["NCP HCX", "Pydantic", "PostgreSQL+pgvector", "KOSIS API", "FastAPI", "AWS EC2"],
    metrics: [
      { label: "수상", value: "6팀 중 최우수상", note: "멋쟁이사자처럼 NLP 집중과정", ev: ["award"] },
      { label: "데이터 적재", value: "262,783건", note: "KOSIS 통계 카탈로그 + HCX 임베딩 v2 (1024차원)", ev: ["catalog", "dim"] },
      { label: "Runtime 병렬화", value: "~7분 → ~1/3", note: "claim 8건 직렬 vs asyncio.gather + Semaphore(3)", ev: ["parallelEst", "parallel"] },
      { label: "표 매칭 필터", value: "4종", note: "국제기구 · 장래추계 · 해외 지역 · 세부 대상", ev: ["filterIntl", "filterForecast", "filterRegion"] },
    ],
    evidence: [
      {
        id: "award",
        grade: "문서",
        claim: "멋쟁이사자처럼 NLP 과정 최종 프로젝트 6팀 중 최우수상",
        source: "상장 이미지",
        href: "/projects/structverify-lab/award.jpg",
        hrefLabel: "상장",
      },
      {
        id: "catalog",
        grade: "문서",
        claim: "KOSIS 통계 카탈로그(kosis_stat_catalog) 262,783건 적재",
        source: "kosis_stat_catalog 행 수 · 2026.05 EC2 이관 기록 (리포 밖)",
      },
      {
        id: "parallel",
        grade: "코드",
        claim: "claim별 검증을 asyncio.gather + Semaphore(3)로 병렬화",
        source: "runtime_agent.py Step 7~9 병렬화 커밋",
        href: `${SV}/commit/bb04054419fded016f71b1568f88a04e8e4815b6`,
        hrefLabel: "bb04054",
      },
      {
        id: "parallelEst",
        grade: "추정",
        claim: "claim 1건당 14~40초 · 8건 직렬 ~7분 → 병렬 3이면 ~1/3",
        source: "runtime_agent.py 주석의 추정치, 측정 로그 없음 (주석은 팀원 머지 커밋 b2e52e8에서 처음 등장)",
        href: `${SV}/blob/${SV_MAIN}/structverify/agent/runtime_agent.py#L339-L341`,
        hrefLabel: "runtime_agent.py L339–341",
      },
      {
        id: "embedOpenAI",
        grade: "코드",
        claim: "초기 버전: OpenAI 임베딩(text-embedding-3-small)을 100건 단위 배치로 호출",
        source: "kosis_crawler.py save_to_db (2026-04-27)",
        href: `${SV}/commit/48cf55b79995b2135bdcc2175b0e8da83e80888a`,
        hrefLabel: "48cf55b",
      },
      {
        id: "embedHcx",
        grade: "코드",
        claim: "HCX 임베딩 v2 전환 뒤: 배치 미지원이라 한 건씩 호출 + Semaphore(3) + 429 재시도 최대 5회",
        source: "kosis_crawler.py get_embedding_safe (2026-04-29)",
        href: `${SV}/commit/4b6dbab5717e00e120c6f61658b7800500cd6403`,
        hrefLabel: "4b6dbab",
      },
      {
        id: "embedNow",
        grade: "코드",
        claim: "현재 코드: 100건 단위로 나눠 embed_batch → _embed_batch_hcx가 Semaphore(3) · 재시도 5회로 건별 호출",
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
        grade: "확인 필요",
        claim: "주제별 통계(MT_ZTITLE) 31개 카테고리",
        source: "리포 KOSIS_TOP_CATEGORIES는 30개(A~V) — 본문 값 31과 다름",
        href: `${SV}/blob/${SV_MAIN}/structverify/adaptation/kosis_crawler.py#L91-L124`,
        hrefLabel: "kosis_crawler.py L91–124",
      },
      {
        id: "cos085",
        grade: "확인 필요",
        claim: "코사인 유사도 0.85",
        source: "리포·로그에서 코사인 유사도 기록을 찾지 못함",
      },
      {
        id: "backoff",
        grade: "코드",
        claim: "HCX v1·v3 429 재시도: 최대 3회 시도, 1초·2초 대기 후 실패",
        source: "llm_client.py _call_hcx_v1/_call_hcx_v3 (2026-05-14)",
        href: `${SV}/commit/24ac3a97b4c58d599b5a9bae7c5c418572dfed28`,
        hrefLabel: "24ac3a9",
      },
      {
        id: "backoffStructured",
        grade: "코드",
        claim: "_call_hcx_structured에도 같은 재시도(최대 3회 시도, 1초·2초 대기)",
        source: "llm_client.py _call_hcx_structured (2026-05-18)",
        href: `${SV}/commit/6cfc82ed121ee954e24cfbba09d098b3dbc7f7fa`,
        hrefLabel: "6cfc82e",
      },
      {
        id: "filterIntl",
        grade: "코드",
        claim: "필터: 국제기구(UN·IMF·OECD) 표 차단 + 영아·신생아·모성 세부 대상 차단",
        source: "kosis_connector.py _is_table_relevant",
        href: `${SV}/commit/da34cba63de418be93cedcb97ca94ea66a7edbd7`,
        hrefLabel: "da34cba",
      },
      {
        id: "filterForecast",
        grade: "코드",
        claim: "필터: 장래·추계·전망 표 차단",
        source: "kosis_connector.py _is_table_relevant",
        href: `${SV}/commit/1d4a90a7fb3e0c5166a0b74eda892de501d81e2b`,
        hrefLabel: "1d4a90a",
      },
      {
        id: "filterRegion",
        grade: "코드",
        claim: "필터: 해외 지역명 표 차단",
        source: "kosis_connector.py _is_table_relevant",
        href: `${SV}/commit/38b1041d66f7b5851c37fa1cbad992da7ae8079c`,
        hrefLabel: "38b1041",
      },
      {
        id: "year",
        grade: "코드",
        claim: "연도 필터 ±2 → 정확 일치",
        source: "verifier.py abs(claim_year - kv_year) > 2 → > 0",
        href: `${SV}/commit/8d46a4b02d196fabf6bde036d91c5848980907a7`,
        hrefLabel: "8d46a4b",
      },
      {
        id: "over90",
        grade: "코드",
        claim: "오차 90% 초과는 판단불가(UNVERIFIABLE) 처리",
        source: "verification/config.yaml mismatch_max_error: 0.90 (90% 임계는 팀원 김예슬 2026-05-06 추가)",
        href: `${SV}/blob/${SV_MAIN}/structverify/verification/config.yaml#L20`,
        hrefLabel: "config.yaml L20",
      },
    ],
    repo: { label: "2026-StructVerify-Lab/structverify @fb4f5de", href: `${SV}/tree/${SV_MAIN}` },
    proof: { text: "KOSIS 통계 카탈로그 262,783건을 적재하고, 6팀 중 최우수상을 받았습니다", ev: ["catalog", "award"] },
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
        detail: "_is_table_relevant() — 국제기구 · 장래추계 · 해외 지역 · 세부 대상 4종 마커로 차단",
        mine: true,
        ev: ["filterIntl", "filterForecast", "filterRegion"],
      },
      { name: "수치 판정 (verifier)", detail: "단위·연도·오차율 같은 수치 판정은 verifier가 결정론적 코드로만", mine: true },
      { name: "설명 (explainer)", detail: "자연어 설명은 explainer에서 LLM이 맡음" },
    ],
    flowCaption: "본문에 적힌 검증 단계. 담당 표시가 붙은 단계를 맡았습니다.",
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
      "DocRED Document-level Relation Extraction 파이프라인의 Stage 2 (ATLOP + DREEAM) 단독 담당. 두 구현 오류(ATLOP Ranking Loss · Adaptive Threshold 평가)를 디버깅으로 잡아 v1 56.64% → v2 59.25% (+2.61pt) 도달.",
    period: "2026.04 ~ 06",
    team: "4명",
    role: "Stage 2 (ATLOP + DREEAM) 단독 담당",
    status: "종료",
    stack: ["PyTorch", "HuggingFace", "ATLOP", "DREEAM", "BERT", "NetworkX"],
    metrics: [
      { label: "Dev F1", value: "+2.61pt", note: "56.64% → 59.25% (두 디버깅 수정의 합산 효과)", ev: ["f1"] },
      { label: "Triple 추출", value: "10,494", note: "dev 998 문서 → NetworkX 기반 KG 시각화", ev: ["triples", "dev998"] },
      { label: "관계별 정성분석", value: "80~90% vs 0~12.5%", note: "표면 패턴 관계 vs 상식 추론 관계의 성능 격차", ev: ["relgap"] },
    ],
    evidence: [
      {
        id: "f1",
        grade: "평가표",
        claim: "v1 F1 56.64% (P 60.74 · R 53.06) → v2 F1 59.25% (P 63.11 · R 55.83), +2.61pt",
        source: "README 버전별 성능 표 (본인 커밋 0a6285e가 처음 추가, 학습 로그는 리포에 없음)",
        href: `${T2G}/blob/${T2G_MAIN}/README.md#L446-L447`,
        hrefLabel: "README L446–447",
      },
      {
        id: "th05",
        grade: "코드",
        claim: "평가가 고정 threshold 0.5로 relation을 채택하던 부분을 threshold_logits 비교로 수정",
        source: "evaluate_on_dev · ATLOPLoss 수정 커밋 (본인)",
        href: `${T2G}/commit/31e47dc9c412651bbfc1db31fd8f72d5cf47a9d1`,
        hrefLabel: "31e47dc",
      },
      {
        id: "rel97",
        grade: "코드",
        claim: "관계 97종 · 라벨 0–96",
        source: "rel2id.json 97개 항목. 파일은 팀원 yeseul 커밋(ba690a5)으로 추가 — 본문의 ‘직접 생성’과 다름. 코드 예시의 P17=1 … P175=96도 리포(P6=1 … P1198=96)와 다름",
        href: `${T2G}/blob/${T2G_MAIN}/pipeline/data/meta/rel2id.json`,
        hrefLabel: "rel2id.json",
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
        grade: "확인 필요",
        claim: "10,494 triple 추출",
        source: "리포에 없음. 가장 가까운 값은 팀 노트북 Stage 3 v6 KG의 10,484, 본인 예측 결과 파일은 빈 파일",
      },
      {
        id: "relgap",
        grade: "확인 필요",
        claim: "관계별 정밀도: 표면 패턴 80~90% vs 상식 추론 0~12.5%",
        source: "관계별 결과가 리포에 없고 예측 파일이 비어 있어 재계산 불가",
      },
      {
        id: "bench",
        grade: "확인 필요",
        claim: "논문 ATLOP-BERT 64.19% · distant pre-training 데이터 30배",
        source: "64.19는 팀 발표자료 PDF에만 있음. ATLOP·DREEAM 원 논문 표의 ATLOP-BERT-base Dev F1은 61.09. 30배 비교의 출처 미확인",
      },
    ],
    repo: { label: "yeseul-kim01/2026-Text2Graph @504504f", href: `${T2G}/tree/${T2G_MAIN}` },
    links: [{ label: "HuggingFace 모델 park990/hihi_model", href: "https://huggingface.co/park990/hihi_model" }],
    proof: { text: "구현 오류 두 곳을 고쳐 Dev F1을 56.64%에서 59.25%로 올렸습니다", ev: ["f1"] },
    results: [
      { text: "Dev F1 56.64% → 59.25% (+2.61pt)", ev: ["f1"] },
      { text: "dev 998 문서 → 10,494 triple 추출", ev: ["dev998", "triples"] },
      { text: "관계별 정밀도 80~90% vs 0~12.5% (표면 패턴 vs 상식 추론)", ev: ["relgap"] },
    ],
    flow: [
      { name: "Stage 1 · Baseline", detail: "BERT + Mean Pooling" },
      { name: "Stage 2 · ATLOP + DREEAM", detail: "LogSumExp + Adaptive Threshold + Evidence Head", mine: true },
      { name: "Stage 3 · GAIN", detail: "+ GCN 그래프 추론" },
      { name: "Stage 4 · U-Net", detail: "+ Graph U-Net 그래프 추론" },
    ],
    flowCaption: "4-Stage Incremental Stacking",
    display: "work",
  },

  // ─── Medical Chatbot ───────────────────────────────────────────────
  {
    slug: "medical-rag",
    title: "Medical Chatbot",
    subtitle: "의료 도메인 챗봇 — RAG 파이프라인 + 자동 평가 담당",
    group: "AI/NLP",
    kind: "교육 과정 팀 프로젝트",
    headline: "RAG를 붙이자 정답률이 65.4%에서 63.1%로 내려간 원인을 오답 케이스로 추적했습니다",
    oneLiner:
      "팀 프로젝트로 만든 의료 도메인 챗봇. 그중 RAG 파이프라인(Qwen2.5-7B · ChromaDB)과 자동 평가를 담당했고, RAG 켜기 전후 ablation에서 LLM 단독 65.4% → +RAG 63.1% 하락이 측정돼 오답 케이스로 원인을 분석했습니다.",
    oneLinerEv: ["ablation"],
    summary:
      "팀 프로젝트로 만든 의료 도메인 챗봇. 그중 RAG 파이프라인과 자동 평가를 담당했고, RAG 켜기 전후 ablation에서 LLM 단독 65.4% → +RAG 63.1% (−2.3pt) 하락을 측정해 distraction 원인을 케이스 단위로 추적.",
    period: "2026.04",
    team: "4명 (NLP 과정 팀 프로젝트)",
    role: "RAG 파이프라인 + 자동 평가",
    status: "종료",
    stack: ["Qwen2.5-7B (4bit)", "ChromaDB", "ko-sroberta", "Dense Retrieval", "Colab A100"],
    metrics: [
      { label: "LLM 단독 vs +RAG", value: "−2.3pt", note: "65.4% → 63.1% (Qwen2.5-7B / VL 평가셋)", ev: ["ablation"] },
    ],
    evidence: [
      {
        id: "ablation",
        grade: "확인 필요",
        claim: "LLM 단독 65.4% → +RAG 63.1% (−2.3pt)",
        source: "리포 전 브랜치에 이 값이 없음 (평가 노트북 출력 0개, 결과 CSV 없음). 리포의 결과는 팀원 README의 객관식 EM 0.69 → 0.67뿐",
        href: `${MED}/blob/${MED_DEV}/notebooks/colab_generation_eval.ipynb`,
        hrefLabel: "colab_generation_eval.ipynb",
      },
      {
        id: "topk",
        grade: "코드",
        claim: "top-k = 5",
        source: "평가 노트북 TOP_K = 5 (app_config.yaml top_k: 5도 같음)",
        href: `${MED}/blob/${MED_DEV}/notebooks/colab_generation_eval.ipynb?plain=1#L307-L308`,
        hrefLabel: "colab_generation_eval.ipynb L307–308",
      },
      {
        id: "chunk500",
        grade: "코드",
        claim: "500자 단위 chunking",
        source: "커밋된 ChromaDB의 chunk 길이 최대 500자 · 중앙값 500자 (500자 분할 스크립트는 리포에 없음)",
        href: `${MED}/blob/${MED_DEV}/chroma_db/chroma.sqlite3`,
        hrefLabel: "chroma_db/chroma.sqlite3",
      },
      {
        id: "corpus",
        grade: "확인 필요",
        claim: "원천 의학 텍스트 3,447개 문서 → 약 27,000 chunk",
        source: "커밋된 ChromaDB는 28,916 chunk · 고유 문서 ID 3,238 — 본문 값과 다름",
      },
      {
        id: "evalLines449",
        grade: "코드",
        claim: "notebooks/colab_generation_eval.ipynb 449줄",
        source: "dev 기준 449줄 (git 이력상 같은 내용을 팀원 Hahyun Song 커밋이 먼저 올림)",
        href: `${MED}/blob/${MED_DEV}/notebooks/colab_generation_eval.ipynb`,
        hrefLabel: "colab_generation_eval.ipynb",
      },
      {
        id: "evalLines216",
        grade: "확인 필요",
        claim: "evaluation/metrics.py 216줄",
        source: "리포 src/evaluation/metrics.py는 230줄 (216은 본인 커밋 d32e33b의 변경 줄 수)",
        href: `${MED}/blob/${MED_DEV}/src/evaluation/metrics.py`,
        hrefLabel: "metrics.py",
      },
    ],
    repo: { label: "ljhljh0703-cmd/Medical-Chatbot (dev) @f2bc415", href: `${MED}/tree/${MED_DEV}` },
    proof: { text: "RAG를 붙이자 정답률이 65.4%에서 63.1%로 떨어진 원인을 오답 케이스로 추적했습니다", ev: ["ablation"] },
    results: [
      { text: "LLM 단독 65.4% → +RAG 63.1% (−2.3pt)", ev: ["ablation"] },
      { text: "원천 의학 텍스트 3,447개 → 500자 chunking → 약 27,000 chunk", ev: ["corpus", "chunk500"] },
    ],
    flow: [
      { name: "원천 의학 텍스트", detail: "3,447개 문서", mine: true, ev: ["corpus"] },
      { name: "chunking", detail: "500자 단위 → 약 27,000 chunk", mine: true, ev: ["chunk500", "corpus"] },
      { name: "임베딩 · 저장", detail: "ko-sroberta 임베딩 → ChromaDB persist", mine: true },
      { name: "검색 (Mode B)", detail: "Dense retrieval · top-k = 5", mine: true, ev: ["topk"] },
      { name: "생성", detail: "Qwen2.5-7B-Instruct(4bit) — Mode A: LLM 단독 / Mode B: LLM + RAG" },
      { name: "자동 채점", detail: "객관식 번호 매칭 · 단답 키워드 매칭 (VL 데이터셋 일괄)", mine: true },
    ],
    flowCaption: "‘담당’ 표시가 붙은 단계를 직접 맡았습니다. LoRA fine-tuning과 FastAPI 서빙 레이어는 팀원 담당.",
    display: "work",
  },

  // ─── Booming ───────────────────────────────────────────────────────
  {
    slug: "booming",
    title: "Booming",
    subtitle: "실시간 채팅 커뮤니티 모바일 앱 (AI 대화 코칭 기능 개발 중)",
    group: "Full-Stack",
    kind: "팀 프로젝트",
    headline: "토큰을 Redis로 모으고 WebSocket 브로커를 SimpleBroker로 단순화했습니다",
    oneLiner:
      "토큰 전부 Redis 통합 + SimpleBroker 단순화 + 채팅 메시지 MongoDB 분리 — 환경에 맞춰 저장소 결정",
    summary:
      "풀스택 학습 사이클의 종착점 — HirePicker의 ‘Refresh DB·Redis Pub/Sub’ 반쪽/과한 설계를 받아 토큰 전부 Redis 통합 + SimpleBroker 단순화로 정리. 동시에 모바일이라는 새 환경 조건이 추가됨.",
    period: "2025.11 ~ 진행 중",
    team: "2명",
    role: "Spring Boot 백엔드(모임 도메인 제외) + Flutter 기획·디자인·구현",
    status: "진행 중",
    stack: ["Flutter", "Spring Boot", "JWT + Redis", "WebSocket(STOMP)", "MySQL", "MongoDB"],
    metrics: [],
    evidence: [
      {
        id: "fewMsgs",
        grade: "확인 필요",
        claim: "메시지 두세 개 만에 @AuthenticationPrincipal이 null",
        source: "공개 리포가 없어 확인할 수 없음",
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
    period: "2025.10 ~ 2025.11",
    team: "5명",
    role: "JWT 인증 · 공고 즐겨찾기 · WebSocket 채팅 · Selenium 수집 · Docker Compose",
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
      "첫 풀스택 — BCrypt + HttpSession 인증, 휴게소 좋아요 다대다 첫 설계, Action 강결합의 한계 체감",
    summary:
      "가장 단순한 형태(BCrypt + HttpSession + Action Forward)로 출발해, 그 한계를 다음 프로젝트의 결정 근거로 들고 갈 수 있게 만든 출발점.",
    period: "2025.07 ~ 2025.08",
    team: "5명",
    role: "MVC Front Controller · 인증 · 휴게소 즐겨찾기(다대다)",
    status: "종료",
    stack: ["Java", "JSP/Servlet", "MyBatis", "BCrypt", "HttpSession", "MySQL"],
    metrics: [],
    evidence: [
      {
        id: "threePages",
        grade: "코드",
        claim: "공통 모달을 쓰는 페이지 세 개 (지도 · 마이페이지 · 휴게소)",
        source: "restAreaModal.jsp를 include하는 MapInfo.jsp · mypage.jsp · restArea.jsp (모달은 본인 ‘즐겨찾기’ 커밋 ae7cbb2에서 생성, 본문의 modal.jsp는 실제 파일명과 다름)",
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
  "출발지·도착지를 입력하면 경로상 휴게시설(편의시설 · 주유비 · 평점 · 대표메뉴)을 카드로 보여 주는 웹 서비스";

// 사례 페이지 순서 (다음 사례 링크). 마지막 다음은 처음으로 돌아간다.
export const CASE_ORDER = [
  "structverify-lab",
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
