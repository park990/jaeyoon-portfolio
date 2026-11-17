// 홈의 경력·교육·연락 데이터. 문구는 기존 components/experience-education.tsx ·
// contact.tsx 원문에서 시작하고, 0단계 지시문 「사실」의 새 항목만 덧붙였다.
import type { Grade } from "@/lib/projects";

export const PROFILE = {
  nameKo: "박재윤",
  nameEn: "Jaeyoon Park",
  email: "rhkgkrwk2008@gmail.com",
  github: "https://github.com/park990",
  huggingface: "https://huggingface.co/park990",
  // 이력서 PDF는 내용(주소·경력)이 옛 버전이라 화면에서 숨김. 새 PDF로 교체하면 true.
  resume: "/jaeyoon-park-resume.pdf",
  showResume: false,
  location: "서울특별시 마포구",
} as const;

// 홈 첫 화면 (2단계 3-2). 주장 줄의 mark = 형광(출처가 있는 숫자), struck = 반박된 숫자.
// 링크가 없는 출처(href 없음)는 주석색 글자로만 보인다.
export const HOME_HERO = {
  role: { strong: "AI·NLP 엔지니어", rest: "수치 검증과 데이터 파이프라인" },
  title: ["숫자를 말할 때는", "출처를 같이 붙입니다."],
  intro:
    "기사 속 수치 주장을 공식 통계와 대조하는 LLM 파이프라인을 만들었고, 지금은 흩어진 공공 자료를 모아 검사 규칙으로 자동 점검하는 서비스를 혼자 만들고 있습니다.",
  example: {
    head: ["팀에서 만든 검증기 StructVerify의 예시", "기준 데이터와 판정"],
    // docs/공모전_결과보고서.md L55(예시 문장) · L121(600% vs 543.1% → 위반)
    // struck + "에"는 줄 끝에서 갈라지지 않게 묶는다(hero.tsx)
    claim: { before: "“한국전력공사의 2023년 부채비율은 ", struck: "600%", after: "에 달했다”" },
    reference: "기준 데이터 543.1%",
    verdict: "불일치",
    src: {
      label: "저장소 문서",
      href: "https://github.com/2026-StructVerify-Lab/structverify/blob/fb4f5de/docs/공모전_결과보고서.md?plain=1#L121",
    },
  },
  claimsHead: ["같은 방식으로 본 제 숫자", "출처"],
  claims: [
    {
      before: "구현 오류 두 곳을 고쳐 Dev F1을 ",
      mark: "56.64에서 59.25",
      after: "로 올렸습니다",
      src: {
        label: "팀 저장소 README 성능표",
        href: "https://github.com/yeseul-kim01/2026-text2graph/blob/504504f/README.md?plain=1#L446-L447",
      },
    },
    {
      before: "KOSIS 통계표 ",
      mark: "262,783건",
      after: "을 검색할 수 있게 적재했습니다",
      // [3단계 B5] 공개 문서 링크 (문서에는 26만 건으로 기재)
      src: {
        label: "팀 저장소 문서 (26만 건으로 기재)",
        href: "https://github.com/2026-StructVerify-Lab/structverify/blob/fb4f5deb35469ec36c9b5a83cb796b1ce078748f/docs/custom-embedding-plan.md?plain=1#L4",
      },
    },
    {
      // [2.5단계] 형광은 "최우수"만 — 상장 이미지에 팀 수는 없다("6개 팀 중"은 일반 글자)
      before: "교육 과정 6개 팀 중 ",
      mark: "최우수",
      after: " 팀으로 뽑혔습니다",
      // public/projects/structverify-lab/award.jpg 가 있어 링크로 둔다
      src: { label: "멋쟁이사자처럼 NLP 과정 상장 사진", href: "/projects/structverify-lab/award.jpg" },
    },
  ],
} as {
  role: { strong: string; rest: string };
  title: string[];
  intro: string;
  example: {
    head: string[];
    claim: { before: string; struck: string; after: string };
    reference: string;
    verdict: string;
    src: { label: string; href: string };
  };
  claimsHead: string[];
  claims: { before: string; mark: string; after: string; src: { label: string; href?: string } }[];
};

/** 수치 하나에 붙는 근거 (홈 표 안에서 쓰는 간이형) */
export type InlineGrade = { value: string; grade: Grade; note: string };

export type TimelineRow = {
  period: string;
  title: string; // 직함 또는 과정명 (굵게)
  /** 소속. 배열이면 항목 사이를 간격으로 나눈다 */
  org?: string | string[];
  line?: string;
  grades?: InlineGrade[];
};

// 최신순 (시작 시점 기준)
export const TIMELINE: TimelineRow[] = [
  {
    // [4단계 B14] 재개발 스캐너 (사례 페이지 /projects/redev-scanner). 홈 작업 띠는 lib/projects.ts에서 읽는다
    period: "2026.05 ~ 현재",
    title: "재개발 스캐너 (서울 재개발 분석 서비스)",
    org: "1인 개발, 예비창업자",
    line: "여러 곳에 흩어진 공공 자료를 모으고, 틀린 값이 섞이지 않도록 검사 규칙으로 자동 점검합니다. 2026.10 중소벤처기업부 ‘모두의 창업’ 2기 1라운드 선정, 멘토기관 서울시립대학교",
  },
  {
    period: "2026.06 ~ 07",
    title: "AI 엔지니어 인턴",
    org: "샤이닝라이언",
    line: "부동산 공공데이터 수집·전처리 파이프라인, 데이터 분석과 모델 학습, 웹 플랫폼 프로토타입",
  },
  {
    period: "2026.03 ~ 05",
    title: "자연어처리(NLP) AI 엔지니어 집중 과정",
    org: "멋쟁이사자처럼",
    line: "6팀 중 최우수상, 최종 프로젝트 StructVerify-Lab",
    grades: [{ value: "6팀 중 최우수상", grade: "문서", note: "멋쟁이사자처럼 NLP 과정 최종 프로젝트 상장" }],
  },
  {
    period: "2026.01 ~ 03",
    title: "데이터 엔지니어",
    org: "바이텍씨스템",
    line: "DB 쿼리 최적화, 데이터 정합성 검증",
  },
  {
    period: "2025.04 ~ 11",
    title: "Java Full-Stack 개발자 양성과정 (AWS, Docker)",
    org: "쌍용교육센터",
    line: "6개월 + 심화 2개월",
  },
  {
    period: "2024.12",
    title: "TOEIC 820",
    grades: [{ value: "820", grade: "문서", note: "TOEIC 성적 (리포 밖 기록)" }],
  },
  {
    period: "2024.06 ~ 09, 4개월",
    title: "여객운송 인턴",
    org: "아시아나항공",
    line: "인천국제공항 여객운송직, 다양한 국적·성격의 승객을 동시에 응대하며 커뮤니케이션과 우선순위 판단을 단련. 이후 팀 프로젝트 협업의 자연스러운 기반이 됨.",
  },
  {
    period: "2018.03 ~ 2025.02",
    title: "항공산업공학과 학사",
    org: "한서대학교",
    line: "GPA 3.8 / 4.5",
    grades: [{ value: "GPA 3.8 / 4.5", grade: "문서", note: "성적증명서 (리포 밖 기록)" }],
  },
];

