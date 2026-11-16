// 홈의 경력·교육·연락 데이터. 문구는 기존 components/experience-education.tsx ·
// contact.tsx 원문에서 시작하고, 0단계 지시문 「사실」의 새 항목만 덧붙였다.
import type { Grade } from "@/lib/projects";

export const PROFILE = {
  nameKo: "박재윤",
  nameEn: "Jaeyoon Park",
  title: "AI · NLP 엔지니어 — 수치 검증 · 데이터 파이프라인",
  email: "rhkgkrwk2008@gmail.com",
  github: "https://github.com/park990",
  huggingface: "https://huggingface.co/park990",
  // 이력서 PDF는 내용(주소·경력)이 옛 버전이라 화면에서 숨김. 새 PDF로 교체하면 true.
  resume: "/jaeyoon-park-resume.pdf",
  showResume: false,
  location: "서울특별시 마포구",
} as const;

// 재개발 서비스: 「사실」의 공개 문장까지만. 상세 페이지·그림 없음.
// 경력 표와 홈 작업 띠가 모두 이 값을 읽는다(기간·14:1을 한 곳에만 둔다).
export const CURRENT_WORK = {
  name: "서울 재개발 분석 서비스",
  headline:
    "흩어진 공공 자료를 모으고, 틀린 값이 섞이지 않도록 검사 규칙으로 자동 점검하는 서비스를 혼자 만들고 있습니다",
  role: "1인 개발",
  period: "2026.07 ~ 현재",
  status: "진행 중",
  summary:
    "여러 곳에 흩어진 공공 자료를 모으고, 틀린 값이 섞이지 않도록 검사 규칙으로 자동 점검합니다.",
  audition: "2026.10 창업 오디션 선발",
  ratio: "14:1",
  ratioGrade: "문서" as Grade,
  ratioNote: "2026.10 창업 오디션 선발 기록 (리포 밖)",
  mentor: "멘토기관 서울시립대학교",
};

/** 수치 하나에 붙는 근거 (홈 표 안에서 쓰는 간이형) */
export type InlineGrade = { value: string; grade: Grade; note: string };

export type TimelineRow = {
  period: string;
  title: string; // 직함 또는 과정명 (굵게)
  org?: string;
  line?: string;
  grades?: InlineGrade[];
};

// 최신순 (시작 시점 기준)
export const TIMELINE: TimelineRow[] = [
  {
    period: CURRENT_WORK.period,
    title: CURRENT_WORK.name,
    org: `${CURRENT_WORK.role} · ${CURRENT_WORK.status}`,
    line: `${CURRENT_WORK.summary} ${CURRENT_WORK.audition}(경쟁률 ${CURRENT_WORK.ratio}) · ${CURRENT_WORK.mentor}`,
    grades: [{ value: CURRENT_WORK.ratio, grade: CURRENT_WORK.ratioGrade, note: CURRENT_WORK.ratioNote }],
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
    line: "6팀 중 최우수상 — 최종 프로젝트 StructVerify-Lab",
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
    title: "Java Full-Stack 개발자 양성과정 (AWS · Docker)",
    org: "쌍용교육센터",
    line: "6개월 + 심화 2개월",
  },
  {
    period: "2024.12",
    title: "TOEIC 820",
    grades: [{ value: "820", grade: "문서", note: "TOEIC 성적 (리포 밖 기록)" }],
  },
  {
    period: "2024.06 ~ 09 · 4개월",
    title: "여객운송 인턴",
    org: "아시아나항공",
    line: "인천국제공항 여객운송직 — 다양한 국적·성격의 승객을 동시에 응대하며 커뮤니케이션과 우선순위 판단을 단련. 이후 팀 프로젝트 협업의 자연스러운 기반이 됨.",
  },
  {
    period: "2018.03 ~ 2025.02",
    title: "항공산업공학과 학사",
    org: "한서대학교",
    line: "GPA 3.8 / 4.5",
    grades: [{ value: "GPA 3.8 / 4.5", grade: "문서", note: "성적증명서 (리포 밖 기록)" }],
  },
];

