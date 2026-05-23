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

const SLUG = "booming";
const ACCENT = "#10B981";

export const metadata: Metadata = {
  title: "Booming · Jaeyoon Park",
  description: "AI 대화 코칭 커뮤니티 모바일 앱 — WebSocket + 모바일 인증 최적화",
};

const techStack = [
  { category: "Frontend", items: ["Flutter", "Dart", "Riverpod"] },
  {
    category: "Backend",
    items: ["Spring Boot", "JPA", "WebSocket (STOMP)", "Spring Security", "JWT", "OAuth 2.0"],
  },
  { category: "Cache/DB", items: ["Redis (JWT 저장)", "MySQL"] },
  { category: "Infra", items: ["AWS (EC2, S3)", "Docker", "GitHub Actions"] },
];

const roles: Role[] = [
  {
    title: "WebSocket Simple Broker (in-memory) 기반 실시간 채팅 서버",
    bullets: ["단일 인스턴스 환경에 적합한 선택 — HirePicker의 Redis Pub/Sub 학습이 결정 근거"],
  },
  {
    title: "Flutter Riverpod 상태 관리 구조 설계",
    bullets: ["인증/채팅/세션 도메인별 Provider 분리"],
  },
  {
    title: "Spring Security + JWT + Redis 인증 (모바일 환경 응용)",
    bullets: ["웹의 HttpOnly Cookie 패턴이 모바일에서 작동 불가 → 모바일 컨텍스트에 맞춰 재설계"],
  },
  {
    title: "flutter_secure_storage 기반 Refresh Token 보안 저장",
    bullets: ["iOS Keychain / Android Keystore 활용 → 앱 재실행 시 자동 로그인"],
  },
  {
    title: "Docker + GitHub Actions CI/CD",
    bullets: ["push 시 자동 빌드/배포"],
  },
];

const troubles: Trouble[] = [
  {
    title: "웹 ↔ 모바일 토큰 생명주기 차이",
    star: true,
    problem:
      "HirePicker(웹)에서 사용한 HttpOnly Cookie 기반 토큰 저장이 Flutter에서는 작동 X. Cookie 컨셉 자체가 모바일에 부적합.",
    solve:
      "flutter_secure_storage 패키지로 Refresh Token을 OS 보안 영역(iOS Keychain / Android Keystore)에 저장. 앱 종료 후에도 자동 로그인 유지.",
    lesson:
      "같은 인증 로직이라도 플랫폼 컨텍스트(브라우저 vs OS)에 따라 저장소 전략이 완전히 달라져야 함.",
  },
];

const brokerCode = `@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Simple Broker: in-memory, 단일 인스턴스 환경에 최적
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }
}
`;

const storageCode = `final storage = const FlutterSecureStorage();

// Refresh Token을 OS 보안 영역에 저장
// iOS: Keychain, Android: Keystore
await storage.write(key: 'refresh_token', value: token);

// 앱 재실행 시 자동 로그인
final savedToken = await storage.read(key: 'refresh_token');
`;

export default function BoomingPage() {
  const project = getProjectBySlug(SLUG)!;

  return (
    <article
      className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:pt-16"
      style={{ "--accent": ACCENT } as React.CSSProperties}
    >
      <ProjectHeader
        project={project}
        oneLiner="WebSocket Simple Broker + flutter_secure_storage로 단일 인스턴스 모바일 환경에 인증/통신 최적화."
        period="2025.11 ~ 진행 중"
        team="3명"
      />

      <Section id="overview" title="Overview">
        <Prose>
          <p>
            현대인의 디지털 고립과 소통 불안 해소를 돕는 실시간 AI 대화 코칭
            커뮤니티. UX/UI 디자인부터 백엔드까지 직접 수행했고, HirePicker(웹)의
            인증 시스템 경험을 모바일 환경에 응용했습니다.
          </p>
          <p>
            HirePicker에서 Redis Pub/Sub 메시지 브로커를 직접 구현해본 학습을
            토대로, Booming은 단일 인스턴스 환경에 적합한 Spring 내장 Simple
            Broker를 선택했습니다.
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
              WebSocket Simple Broker 설정. 단일 인스턴스 환경 최적화 선택.
            </p>
            <CodeBlock code={brokerCode} lang="java" filename="WebSocketConfig.java" />
          </div>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              Flutter Secure Storage로 Refresh Token을 OS 보안 영역에 저장.
            </p>
            <CodeBlock code={storageCode} lang="dart" filename="auth_storage.dart" />
          </div>
        </div>
      </Section>

      <Section id="trouble" title="Trouble-shooting">
        <TroubleCards troubles={troubles} accent={ACCENT} />
      </Section>

      <Section id="lessons" title="Lessons Learned">
        <LessonsList
          items={[
            "메시지 브로커 선택은 \"유명한 기술 = 좋은 선택\"이 아니라 시스템 규모(단일/다중 인스턴스)에 맞춰야 한다.",
            "같은 인증 패턴(JWT)도 플랫폼에 따라 저장소 전략이 완전히 달라진다.",
            "웹에서 학습한 패턴을 모바일에 그대로 옮길 수 없다는 것을 직접 확인했다.",
          ]}
        />
      </Section>

      <ProjectFooter currentSlug={SLUG} />
    </article>
  );
}
