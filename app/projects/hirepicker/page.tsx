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
  LessonsList,
  type Role,
  type Trouble,
} from "@/components/project-detail/blocks";
import { getProjectBySlug } from "@/lib/projects";

const SLUG = "hirepicker";
const ACCENT = "#F97316";
const REPO = "https://github.com/wlsksekf/hire-picker/tree/jaeyoon";

export const metadata: Metadata = {
  title: "HirePicker · Jaeyoon Park",
  description: "구인구직 플랫폼 — Redis Pub/Sub 직접 구현 + JWT+Redis 인증",
};

const techStack = [
  { category: "Frontend", items: ["Next.js", "React (SSR/ISR)", "Axios", "HttpOnly Cookies"] },
  {
    category: "Backend",
    items: ["Spring Boot", "JPA", "WebSocket (STOMP)", "Spring Security", "JWT", "OAuth 2.0"],
  },
  { category: "Cache/DB", items: ["Redis (Refresh Token + Pub/Sub)", "MySQL"] },
  { category: "Infra", items: ["AWS (EC2, S3)", "Docker Compose", "GitHub Actions"] },
  { category: "Data", items: ["Python Selenium"] },
];

const roles: Role[] = [
  {
    title: "Redis Pub/Sub 메시지 브로커 직접 구현 — 다중 인스턴스 확장 대비",
    bullets: ["Spring 내장 SimpleBroker 대신 외부 Redis Pub/Sub을 STOMP relay로 연결"],
  },
  {
    title: "WebSocket(STOMP) 기반 실시간 채팅 통신 로직",
    bullets: ["메시지 라우팅, 인증 핸드셰이크, 구독 토픽 설계"],
  },
  {
    title: "Spring Security + JWT + Refresh Token Redis 캐싱 인증 시스템",
    bullets: ["TTL 자동 만료로 토큰 관리 단순화"],
  },
  {
    title: "Python Selenium 기반 채용공고 수집",
    bullets: ["일회성 데이터 적재 스크립트로 외부 공고 수집"],
  },
  {
    title: "Docker Compose 통합 개발 환경",
    bullets: ["Spring Boot + Redis 단일 네트워크로 팀원 환경 통합"],
  },
];

const troubles: Trouble[] = [
  {
    title: "Refresh Token 저장소 (DB → Redis)",
    problem:
      "초기에 Refresh Token을 DB에 저장 → 매 요청마다 디스크 I/O. 인증 토큰은 영속 데이터가 아닌 세션에 가까운 임시 데이터.",
    solve: "Redis 인메모리 + TTL 자동 만료",
    lesson: "데이터 성격(영속 vs 임시)에 따라 저장소를 달리 선택해야 함",
  },
  {
    title: "Redis Pub/Sub 메시지 브로커 직접 구현",
    star: true,
    problem:
      "다중 인스턴스 확장 시 Spring 내장 SimpleBroker로는 인스턴스 간 메시지 동기화 불가",
    solve:
      "Redis Pub/Sub을 외부 브로커로 도입해 STOMP relay 구성. 단일 서버 환경에서는 SimpleBroker가 더 효율적이라는 것도 학습 — 다음 프로젝트 Booming에서 단일 인스턴스에 SimpleBroker를 선택한 근거가 됨.",
    lesson: '"유명한 기술 = 좋은 선택"이 아님. 시스템 규모에 맞는 브로커 선택이 핵심.',
  },
  {
    title: "정적 → Selenium 동적 크롤링",
    problem:
      "HTTP 정적 크롤링으로 JS 렌더링 데이터(상세 정보, 이미지) 누락",
    solve:
      "Selenium 동적 크롤링 일회성 스크립트로 수집. 후속 이슈: 데이터 정제 단계가 부족해 무관 데이터 포함.",
    lesson: "수집뿐 아니라 정제·검증의 중요성",
  },
  {
    title: "팀원 환경 불일치 → Docker Compose 통합",
    problem:
      "Redis 별도 실행, 포트 충돌, Java 버전 차이 등으로 구동 장애 반복",
    solve: "Docker Compose로 Spring Boot + Redis 단일 네트워크 통합",
    lesson: "컨테이너 네트워크 및 서비스 간 통신 구조 이해",
  },
];

const brokerCode = `@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Redis Pub/Sub: 다중 인스턴스 확장 대비
        config.enableStompBrokerRelay("/topic", "/queue")
              .setRelayHost(redisHost)
              .setRelayPort(redisPort);
    }
}
`;

const tokenCode = `@Service
public class TokenService {
    public void saveRefreshToken(Long userId, String token) {
        String key = "refresh:" + userId;
        // TTL 자동 만료로 토큰 관리 단순화
        redisTemplate.opsForValue().set(key, token, Duration.ofDays(14));
    }
}
`;

export default function HirePickerPage() {
  const project = getProjectBySlug(SLUG)!;

  return (
    <article
      className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:pt-16"
      style={{ "--accent": ACCENT } as React.CSSProperties}
    >
      <ProjectHeader
        project={project}
        oneLiner="Redis Pub/Sub 메시지 브로커를 직접 구현하고 JWT + Refresh Token 인증 시스템을 설계."
        period="2025.10 ~ 2025.11"
        team="5명"
        links={[{ label: "GitHub", href: REPO }]}
      />

      <Section id="overview" title="Overview">
        <Prose>
          <p>
            Spring Boot + JPA + Next.js 기반 구인구직 플랫폼. Next.js SSR/ISR로
            SEO를 강화하고, Selenium으로 외부 채용공고를 수집하는 풀스택 시스템.
          </p>
          <p>
            HighWay Guide의 HttpSession 한계 경험을 바탕으로 무상태 JWT + Redis
            인증으로 전환했고, 메시지 브로커는 Spring 내장 SimpleBroker가 아닌
            Redis Pub/Sub을 직접 구현해 다중 인스턴스 확장에 대비했습니다.
          </p>
        </Prose>
      </Section>

      <Section id="stack" title="Tech Stack">
        <TechStackGrid groups={techStack} />
      </Section>

      <Section id="role" title="My Role">
        <MyRoleCards roles={roles} accent={ACCENT} />
      </Section>

      <Section id="code" title="Code Highlights">
        <div className="space-y-5">
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              Redis Pub/Sub 메시지 브로커 직접 구현. 다중 인스턴스 확장 대비.
            </p>
            <CodeBlock code={brokerCode} lang="java" filename="WebSocketConfig.java" />
          </div>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              JWT + Refresh Token Redis 저장. TTL 자동 만료로 정리 로직 단순화.
            </p>
            <CodeBlock code={tokenCode} lang="java" filename="TokenService.java" />
          </div>
        </div>
      </Section>

      <Section id="trouble" title="Trouble-shooting">
        <TroubleCards troubles={troubles} accent={ACCENT} />
      </Section>

      <Section id="lessons" title="Lessons Learned">
        <LessonsList
          items={[
            "브로커 선택은 시스템 규모에 따라 다르며, 다음 프로젝트 Booming에서 SimpleBroker를 선택한 결정 근거가 되었다.",
            "HttpSession에서 JWT+Redis로 옮긴 경험이 모바일 환경(Booming)으로 자연스럽게 확장되었다.",
            "데이터의 성격을 보고 저장소를 선택하는 사고 방식이 자리잡았다.",
          ]}
        />
      </Section>

      <ProjectFooter currentSlug={SLUG} />
    </article>
  );
}
