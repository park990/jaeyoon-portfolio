// /lab 시안 3개가 함께 쓰는 사실 데이터.
// 출처: 0단계 브리프의 「사실」 + 기존 사이트 본문(lib/projects.ts, app/projects/*).
// 근거 링크(EVIDENCE)는 2026-11-17에 커밋 diff를 직접 열어 값이 들어 있는지 확인했고,
// 모두 비로그인 상태에서 200 응답을 확인한 공개 URL이다.

export const PROFILE = {
  nameKo: "박재윤",
  nameEn: "Jaeyoon Park",
  location: "서울 마포구",
  email: "rhkgkrwk2008@gmail.com",
  github: "https://github.com/park990",
  huggingface: "https://huggingface.co/park990",
} as const;

// 재개발 서비스 소개는 브리프가 허용한 문장 수준까지만 쓴다.
export const CURRENT_WORK = {
  name: "서울 재개발 분석 서비스",
  period: "2026.07 ~ 현재",
  role: "1인 개발 · 진행 중",
  summary:
    "여러 곳에 흩어진 공공 자료를 모으고, 틀린 값이 섞이지 않도록 검사 규칙으로 자동 점검합니다.",
  audition: "2026.10 창업 오디션 선발",
  auditionRatio: "14:1",
  mentor: "멘토기관 서울시립대학교",
} as const;

export type Experience = {
  period: string;
  org: string;
  role: string;
  note?: string;
};

export const EXPERIENCE: Experience[] = [
  {
    period: "2026.06 ~ 07",
    org: "샤이닝라이언",
    role: "AI 엔지니어 인턴",
    note: "부동산 공공데이터 수집·전처리 파이프라인, 데이터 분석과 모델 학습, 웹 플랫폼 프로토타입",
  },
  {
    period: "2026.01 ~ 03",
    org: "바이텍씨스템",
    role: "데이터 엔지니어",
    note: "DB 쿼리 최적화, 데이터 정합성 검증",
  },
  {
    period: "2024.06 ~ 09",
    org: "아시아나항공",
    role: "여객운송 인턴 (인천공항)",
  },
];

export type Education = {
  period: string;
  org: string;
  program: string;
  meta?: string;
};

export const EDUCATION: Education[] = [
  {
    period: "2026.03 ~ 05",
    org: "멋쟁이사자처럼",
    program: "NLP 과정",
    meta: "최우수상",
  },
  {
    period: "2025.04 ~ 11",
    org: "쌍용교육센터",
    program: "Java Full-Stack (6개월 + 심화 2개월)",
  },
  {
    period: "2018.03 ~ 2025.02",
    org: "한서대학교",
    program: "항공산업공학 학사",
    meta: "GPA 3.8 / 4.5",
  },
];

export const CERT = { name: "TOEIC", score: "820", date: "2024.12" } as const;

// ─── 근거(Evidence) ────────────────────────────────────────────────
// grade
//  - code   : 커밋 diff에서 해당 값이 들어간 줄을 확인
//  - table  : 리포 안의 평가 결과표
//  - comment: 코드 주석에 적힌 추정치 (측정 로그 아님)
//  - doc    : 상장 등 원본 문서 이미지
export type EvidenceGrade = "code" | "table" | "comment" | "doc";

export type Evidence = {
  id: string;
  label: string; // 화면에 붙는 짧은 표기 (SHA 7자리 등)
  href: string;
  grade: EvidenceGrade;
  /** 이 링크에서 무엇을 확인할 수 있는지 한 줄 */
  shows: string;
  where: string; // 리포/파일 위치
};

const SV = "https://github.com/2026-StructVerify-Lab/structverify";

export const EVIDENCE: Record<string, Evidence> = {
  batch: {
    id: "batch",
    label: "48cf55b",
    href: `${SV}/commit/48cf55b79995b2135bdcc2175b0e8da83e80888a`,
    grade: "code",
    shows: "BATCH_SIZE = 100 — 통계표 메타 100건씩 묶어 임베딩",
    where: "structverify · adaptation/kosis_crawler.py",
  },
  semaphore: {
    id: "semaphore",
    label: "4b6dbab",
    href: `${SV}/commit/4b6dbab5717e00e120c6f61658b7800500cd6403`,
    grade: "code",
    shows: "asyncio.Semaphore(3) + 재시도 — 임베딩 동시 호출 3개 제한",
    where: "structverify · adaptation/kosis_crawler.py",
  },
  parallel: {
    id: "parallel",
    label: "bb04054",
    href: `${SV}/commit/bb04054419fded016f71b1568f88a04e8e4815b6`,
    grade: "code",
    shows: "Step 7~9 asyncio.gather + Semaphore(3) 병렬화",
    where: "structverify · agent/runtime_agent.py",
  },
  parallelEstimate: {
    id: "parallelEstimate",
    label: "L339–341",
    href: `${SV}/blob/fb4f5deb35469ec36c9b5a83cb796b1ce078748f/structverify/agent/runtime_agent.py#L339-L341`,
    grade: "comment",
    shows: "“claim 1건당 14~40초 → 8건 직렬이면 ~7분. 병렬 3이면 ~1/3.” (주석의 추정치)",
    where: "structverify · agent/runtime_agent.py @fb4f5de",
  },
  filterIntlScope: {
    id: "filterIntlScope",
    label: "da34cba",
    href: `${SV}/commit/da34cba63de418be93cedcb97ca94ea66a7edbd7`,
    grade: "code",
    shows: "국제기구(UN·IMF·OECD) 표 차단 + 영아·신생아·모성 세부 대상 차단",
    where: "structverify · retrieval/kosis_connector.py",
  },
  filterForecast: {
    id: "filterForecast",
    label: "1d4a90a",
    href: `${SV}/commit/1d4a90a7fb3e0c5166a0b74eda892de501d81e2b`,
    grade: "code",
    shows: "장래·추계·전망 표 차단",
    where: "structverify · retrieval/kosis_connector.py",
  },
  filterRegion: {
    id: "filterRegion",
    label: "38b1041",
    href: `${SV}/commit/38b1041d66f7b5851c37fa1cbad992da7ae8079c`,
    grade: "code",
    shows: "해외 지역명 표 차단 (합계출산율 → ‘남부·동남아시아’ 표 매칭 방지)",
    where: "structverify · retrieval/kosis_connector.py",
  },
  year: {
    id: "year",
    label: "8d46a4b",
    href: `${SV}/commit/8d46a4b02d196fabf6bde036d91c5848980907a7`,
    grade: "code",
    shows: "연도 필터 abs(차이) > 2 → > 0 (정확 일치)",
    where: "structverify · verification/verifier.py",
  },
  t2gF1: {
    id: "t2gF1",
    label: "README L446–447",
    href: "https://github.com/yeseul-kim01/2026-Text2Graph/blob/504504f914ff4c211725a5448efadb0de511a745/README.md#L446-L447",
    grade: "table",
    shows: "v1 F1 56.64% → v2 59.25% 결과표",
    where: "2026-Text2Graph · README.md @504504f",
  },
  award: {
    id: "award",
    label: "상장",
    href: "/projects/structverify-lab/award.jpg",
    grade: "doc",
    shows: "멋쟁이사자처럼 NLP 과정 최종 프로젝트 최우수상 상장",
    where: "이 사이트 · public/projects/structverify-lab/award.jpg",
  },
};

export const GRADE_LABEL: Record<EvidenceGrade, string> = {
  code: "코드",
  table: "평가표",
  comment: "추정",
  doc: "문서",
};

// ─── StructVerify-Lab (세 시안 공통 카드 소재 — 기존 본문에서만 가져옴) ──
export const SV_PROJECT = {
  slug: "structverify-lab",
  title: "StructVerify-Lab",
  subtitle: "범용 수치 팩트체크 플랫폼",
  // 브리프: 기간을 2026.05 ~ 09로 고치고 "진행 중" 표기 정리
  period: "2026.05 ~ 09",
  team: "4명",
  summary:
    "기사 속 수치 주장을 KOSIS 공식 통계와 비교해 진위를 판정하는 LLM 플랫폼.",
  myPart:
    "4명 팀에서 데이터 레이어(KOSIS 카탈로그 크롤러 · 표 매칭 필터 · PostgreSQL 적재)와 runtime 검증 병렬화, LLM 클라이언트 안정화, 검증 판단 로직을 맡았습니다.",
  award: "멋쟁이사자처럼 NLP 과정 최우수상",
  href: "/projects/structverify-lab",
  repo: "https://github.com/orgs/2026-StructVerify-Lab/repositories",
} as const;
