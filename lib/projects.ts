// 프로젝트 메타데이터. Projects 카드 섹션과 /projects/[slug] 상세 페이지가
// 같은 소스를 참조하도록 한 곳에 모아둠.

export type ProjectGroup = "AI/NLP" | "Full-Stack";

export type ProjectLink = {
  label: string;
  href: string;
};

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
  links?: ProjectLink[];
  /** 전용 풀 상세 페이지 보유 여부.
   *  true면 /projects/[slug] 동적 라우트가 이 슬러그를 prerender에서 제외 →
   *  app/projects/<slug>/page.tsx가 우선 매칭됨 (라우팅 중복 빌드 제거). */
  hasDetailPage?: boolean;
};

export const PROJECT_GROUPS = ["All", "AI/NLP", "Full-Stack"] as const;
export type ProjectFilter = (typeof PROJECT_GROUPS)[number];

export const projects: Project[] = [
  {
    slug: "structverify-lab",
    title: "StructVerify-Lab",
    subtitle: "범용 수치 팩트체크 플랫폼",
    oneLiner:
      "초기 파이프라인 전체를 단일 test.py로 구현해 모듈화 baseline 제공",
    stack: ["Python", "PostgreSQL", "pgvector", "FastAPI", "LLM", "AWS EC2"],
    period: "2026.04 ~ 진행 중",
    team: 4,
    group: "AI/NLP",
    accent: "#0EA5E9",
    featured: true,
    hasDetailPage: true,
  },
  {
    slug: "text2graph",
    title: "Text2Graph",
    subtitle: "Document-level Relation Extraction (Stage 2)",
    oneLiner:
      "Adaptive Threshold 버그 + ATLOP Loss 구현 오류 수정으로 F1 +4.07pt",
    stack: ["PyTorch", "HuggingFace", "ATLOP", "DREEAM", "BERT", "NetworkX"],
    period: "2026.03 (1주)",
    team: 5,
    group: "AI/NLP",
    accent: "#A78BFA",
    links: [
      { label: "GitHub", href: "https://github.com/yeseul-kim01/2026-Text2Graph" },
      { label: "HuggingFace", href: "https://huggingface.co/park990/hihi_model" },
    ],
    hasDetailPage: true,
  },
  {
    slug: "booming",
    title: "Booming",
    subtitle: "AI 대화 코칭 커뮤니티 (모바일 앱)",
    oneLiner:
      "WebSocket Simple Broker + flutter_secure_storage 모바일 인증 적용",
    stack: ["Flutter", "Spring Boot", "WebSocket(STOMP)", "JWT", "Redis", "MySQL"],
    period: "2025.11 ~ 진행 중",
    team: 3,
    group: "Full-Stack",
    accent: "#10B981",
    hasDetailPage: true,
  },
  {
    slug: "hirepicker",
    title: "HirePicker",
    subtitle: "구인구직 플랫폼",
    oneLiner:
      "Redis Pub/Sub 메시지 브로커 직접 구현, JWT+Redis 인증 시스템 학습",
    stack: ["Spring Boot", "Next.js", "Redis", "JWT", "Selenium", "Docker Compose"],
    period: "2025.10 ~ 2025.11",
    team: 5,
    group: "Full-Stack",
    accent: "#F97316",
    hasDetailPage: true,
  },
  {
    slug: "highway-guide",
    title: "HighWay Guide",
    subtitle: "고속도로 통합 정보 플랫폼",
    oneLiner:
      "MVC Model 2 Front Controller 직접 설계, 카카오→네이버 폴백 자동화",
    stack: ["Java", "JSP/Servlet", "MyBatis", "Kakao Map", "Naver Geocoding", "MySQL"],
    period: "2025.07 ~ 2025.08",
    team: 5,
    group: "Full-Stack",
    accent: "#EF4444",
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
