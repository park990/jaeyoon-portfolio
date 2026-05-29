// 프로젝트 메타데이터. Projects 카드 섹션과 /projects/[slug] 상세 페이지가
// 같은 소스를 참조하도록 한 곳에 모아둠.

export type ProjectGroup = "AI/NLP" | "Full-Stack" | "Other";

export type ProjectLink = {
  label: string;
  href: string;
};

/** 홈 카드 영역 위계.
 *  - "featured": AI/NLP 대표 카드(크게, 위쪽)
 *  - "secondary": 풀스택 보조 카드(작게, 아래)
 *  - "other": 카드 그리드에서 빼고 'Other Projects' 한 줄 라인에 노출 */
export type ProjectDisplay = "featured" | "secondary" | "other";

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  oneLiner: string;
  stack: string[];
  period: string;
  team: number;
  group: ProjectGroup;
  /** hex 색상. 카드 호버 시 보더 강조에 사용. */
  accent: string;
  /** 대표 프로젝트 여부. 카드에 ⭐ 표시 + 살짝 강조. */
  featured?: boolean;
  /** 홈 카드 영역 위계. 없으면 secondary로 취급. */
  display?: ProjectDisplay;
  /** 카드/Hero에 노출할 텍스트 배지(예: 수상 라벨). */
  badge?: string;
  links?: ProjectLink[];
  /** 전용 풀 상세 페이지 보유 여부.
   *  true면 /projects/[slug] 동적 라우트가 이 슬러그를 prerender에서 제외 →
   *  app/projects/<slug>/page.tsx가 우선 매칭됨 (라우팅 중복 빌드 제거). */
  hasDetailPage?: boolean;
};

export const PROJECT_GROUPS = ["All", "AI/NLP", "Full-Stack"] as const;
export type ProjectFilter = (typeof PROJECT_GROUPS)[number];

export const projects: Project[] = [
  // ─── Featured · AI/NLP ────────────────────────────────────────────
  {
    slug: "structverify-lab",
    title: "StructVerify-Lab",
    subtitle: "범용 수치 팩트체크 플랫폼",
    oneLiner:
      "기사 속 수치 주장을 KOSIS 공식 통계와 비교해 진위 판정. 초기 baseline 파이프라인부터 KOSIS 262,783건 적재·runtime 병렬화까지.",
    stack: ["NCP HCX", "Pydantic", "PostgreSQL+pgvector", "KOSIS API", "FastAPI", "AWS EC2"],
    period: "2026.05 ~ 진행 중",
    team: 4,
    group: "AI/NLP",
    accent: "#0EA5E9",
    featured: true,
    display: "featured",
    badge: "멋쟁이사자처럼 NLP 과정 최우수상",
    hasDetailPage: true,
  },
  {
    slug: "medical-rag",
    title: "Medical RAG Experiment",
    subtitle: "RAG가 정확도를 떨어뜨리는 조건을 측정한 실험",
    oneLiner:
      "Qwen2.5-7B 기반 의료 챗봇에서 LLM 단독 65.4% → +RAG 63.1%로 하락. 검색된 무관 context가 distraction이 된 원인을 케이스 단위로 분석.",
    stack: ["Qwen2.5-7B (4bit)", "ChromaDB", "Hybrid Retrieval (BM25+Dense)", "FastAPI", "Streamlit"],
    period: "2026.04 (1주)",
    team: 4,
    group: "AI/NLP",
    accent: "#F59E0B",
    featured: true,
    display: "featured",
    links: [
      { label: "GitHub", href: "https://github.com/ljhljh0703-cmd/Medical-Chatbot/tree/dev" },
    ],
    hasDetailPage: true,
  },
  {
    slug: "text2graph",
    title: "Text2Graph",
    subtitle: "Document-level Relation Extraction (Stage 2)",
    oneLiner:
      "Adaptive Threshold 버그 + ATLOP Loss 구현 오류 수정으로 F1 +2.61pt (56.64 → 59.25)",
    stack: ["PyTorch", "HuggingFace", "ATLOP", "DREEAM", "BERT", "NetworkX"],
    period: "2026.04 (1주)",
    team: 5,
    group: "AI/NLP",
    accent: "#A78BFA",
    display: "featured",
    links: [
      { label: "GitHub", href: "https://github.com/yeseul-kim01/2026-Text2Graph" },
      { label: "HuggingFace", href: "https://huggingface.co/park990/hihi_model" },
    ],
    hasDetailPage: true,
  },

  // ─── Secondary · Full-Stack ────────────────────────────────────────
  {
    slug: "booming",
    title: "Booming",
    subtitle: "실시간 채팅 커뮤니티 모바일 앱 (AI 대화 코칭 기능 개발 중)",
    oneLiner:
      "토큰 전부 Redis 통합 + SimpleBroker 단순화 + 채팅 메시지 MongoDB 분리 — 환경에 맞춰 저장소 결정",
    stack: ["Flutter", "Spring Boot", "JWT + Redis", "WebSocket(STOMP)", "MySQL", "MongoDB"],
    period: "2025.11 ~ 진행 중",
    team: 2,
    group: "Full-Stack",
    accent: "#10B981",
    display: "secondary",
    hasDetailPage: true,
  },
  {
    slug: "hirepicker",
    title: "HirePicker",
    subtitle: "구인구직 플랫폼",
    oneLiner:
      "HttpSession 한계를 JWT로 도입, 휴게소 좋아요의 다대다를 공고 즐겨찾기로 재설계",
    stack: ["Spring Boot", "Next.js", "JWT", "Redis", "WebSocket", "Docker Compose"],
    period: "2025.10 ~ 2025.11",
    team: 5,
    group: "Full-Stack",
    accent: "#F97316",
    display: "secondary",
    hasDetailPage: true,
  },

  // ─── Other · 카드 그리드에서 빼고 한 줄 라인으로만 노출 ──────────────
  {
    slug: "highway-guide",
    title: "HighWay Guide",
    subtitle: "고속도로 통합 정보 플랫폼",
    oneLiner:
      "첫 풀스택 — BCrypt + HttpSession 인증, 휴게소 좋아요 다대다 첫 설계, Action 강결합의 한계 체감",
    stack: ["Java", "JSP/Servlet", "MyBatis", "BCrypt", "HttpSession", "MySQL"],
    period: "2025.07 ~ 2025.08",
    team: 5,
    group: "Other",
    accent: "#EF4444",
    display: "other",
    hasDetailPage: true,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

// projects 배열 순서 기준 "다음 프로젝트". 마지막이면 undefined.
// 풀 상세 페이지 하단의 "다음 프로젝트 미리보기"에 사용.
export function getNextProject(slug: string): Project | undefined {
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx < 0 || idx >= projects.length - 1) return undefined;
  return projects[idx + 1];
}

/** 홈 카드 영역별 묶음. projects.tsx에서 사용. */
export function getProjectsByDisplay(d: ProjectDisplay): Project[] {
  return projects.filter((p) => (p.display ?? "secondary") === d);
}
