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
  description:
    "HighWay Guide·HirePicker의 학습이 종착하는 세 번째 풀스택 — 토큰 Redis 통합 + secure_storage + WebSocket SimpleBroker 단순화.",
};

const techStack = [
  { category: "Mobile", items: ["Flutter", "Riverpod 2.x", "flutter_secure_storage"] },
  {
    category: "Backend",
    items: ["Spring Boot 3.5+ (Java 21)", "Spring Security", "JPA"],
  },
  {
    category: "Realtime / Cache",
    items: ["WebSocket (STOMP) + SimpleBroker", "JWT ChannelInterceptor", "Redis (토큰 전부)"],
  },
  {
    category: "DB",
    items: ["MySQL (사용자·모임·게시판)", "MongoDB (채팅 메시지)"],
  },
];

const roles: Role[] = [
  {
    title: "인증 — 토큰 전부 Redis로 통합 (HirePicker 반쪽 변경의 완성)",
    bullets: [
      "Access + Refresh 둘 다 Redis에 저장 — TTL 자동 만료로 회수 로직 자체 제거",
      "HirePicker에서 'Refresh도 영속 데이터가 아니라 세션 성격'이라는 결론을 코드로 옮김",
      "Flutter 측은 flutter_secure_storage(iOS Keychain / Android Keystore)로 OS 보안 영역에 저장 — 웹의 HttpOnly Cookie가 모바일에선 통하지 않는 환경 차이를 반영",
    ],
  },
  {
    title: "WebSocket — SimpleBroker로 단순화 + JWT ChannelInterceptor",
    bullets: [
      "HirePicker의 Redis Pub/Sub '과한 설계' 회고를 받아, 단일 인스턴스 모바일 환경엔 Spring 내장 SimpleBroker로 충분하다고 판단",
      "WebSocket의 ThreadLocal 한계(CONNECT/SEND 스레드 다름)를 JwtChannelInterceptor + 세션 속성에 userDetails 저장 패턴으로 해결",
      "메시지 유실 우려는 영속 저장으로 보완 — 외부 네트워크 I/O 비용은 제거됨",
    ],
  },
  {
    title: "메시지 저장소 — MySQL에서 MongoDB로 (데이터 성격에 맞춰)",
    bullets: [
      "HirePicker는 ChatMessage를 MySQL 관계형 테이블로 저장 — 컬럼 스키마가 채팅 메시지의 다양성(첨부·이모지·시스템 메시지·메타데이터)을 표현하기 부족했음",
      "Booming은 채팅 메시지가 본질적으로 '문서(document)'에 가깝다고 판단해 MongoDB로 전환 — 스키마 자유도 + 메시지 단위 쿼리/페이지네이션 효율",
      "JPA 관계형 모델은 사용자/모임/게시판처럼 정형 도메인에 유지, 채팅 메시지만 MongoDB로 분리하는 폴리글랏 구조",
    ],
  },
  {
    title: "Spring Boot 백엔드 + Flutter 기획/디자인/구현 단독",
    bullets: [
      "백엔드 전반(인증·게시판·세션·DB)을 모임 도메인 제외하고 단독 담당 — HirePicker의 분리 구조(REST + 분리된 클라이언트)를 모바일 컨텍스트로 그대로 이식",
      "Flutter Riverpod 2.x 상태관리·MVVM 구조·하단 탭 네비·전체 화면 디자인 단독",
      "기획 단계의 핵심 아이디어(AI가 대화의 정적 시간을 메우고 다음 발화를 제안)까지 직접 정의",
    ],
  },
];

const troubles: Trouble[] = [
  {
    title: "WebSocket에서 @AuthenticationPrincipal이 null",
    star: true,
    problem:
      "HTTP의 JwtAuthenticationFilter는 SecurityContextHolder만 박아두면 @AuthenticationPrincipal로 잘 받음. WebSocket은 CONNECT 스레드와 SEND 스레드가 달라서 ThreadLocal 기반 SecurityContextHolder가 다음 메시지에서 null로 보임.",
    solve:
      "JwtChannelInterceptor에서 CONNECT 시 검증한 CustomUserDetails를 accessor.getSessionAttributes()에 저장 → SEND/SUBSCRIBE에서 같은 세션 속성에서 복원. 컨트롤러는 @Header(\"simpSessionAttributes\")로 직접 접근.",
    lesson:
      "Spring Security가 ThreadLocal 가정으로 만들어졌다는 사실 — 'HTTP에서 잘 되던' 패턴을 다른 통신 모델에 그대로 옮기면 안 된다.",
  },
  {
    title: "웹의 HttpOnly Cookie 패턴이 모바일에서 작동 X",
    problem:
      "HirePicker(웹)는 브라우저가 자동으로 쿠키를 실어 보내는 가정에 의존했음. Flutter는 OS 단위 HTTP 클라이언트라 쿠키 자동 관리가 안 됨.",
    solve:
      "flutter_secure_storage로 Access/Refresh Token을 OS 보안 영역에 저장 + 모든 API 요청에 Bearer 헤더 명시. 같은 JWT라도 플랫폼에 따라 저장 전략이 완전히 달라짐을 반영.",
    lesson:
      "인증은 토큰 알고리즘이 아니라 '토큰을 어디 두고 어떻게 실어 보내느냐'의 문제 — 플랫폼 컨텍스트가 저장소를 결정한다.",
  },
];

const interceptorCode = `// JwtChannelInterceptor — WebSocket의 ThreadLocal 한계를 세션 속성으로 우회

@Component
@RequiredArgsConstructor
public class JwtChannelInterceptor implements ChannelInterceptor {
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        StompCommand command = accessor.getCommand();

        if (StompCommand.CONNECT.equals(command)) {
            String bearer = accessor.getFirstNativeHeader("Authorization");
            if (bearer == null || !bearer.startsWith("Bearer ")) return null;

            String token = bearer.substring(7);
            if (!jwtTokenProvider.validateToken(token)) return null;

            // 검증한 userDetails를 세션 속성에 저장 (스레드 무관)
            Authentication auth = jwtTokenProvider.getAuthentication(token);
            CustomUserDetails ud = (CustomUserDetails) auth.getPrincipal();
            accessor.getSessionAttributes().put("userDetails", ud);
        }
        else if (StompCommand.SEND.equals(command)
              || StompCommand.SUBSCRIBE.equals(command)) {
            // 다른 스레드 → 세션 속성에서 복원
            CustomUserDetails ud = (CustomUserDetails)
                accessor.getSessionAttributes().get("userDetails");
            if (ud == null) return null;
            accessor.setUser(ud);
            SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(ud, "", ud.getAuthorities()));
        }
        return message;
    }
}
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
        oneLiner="풀스택 학습 사이클의 종착점 — HirePicker의 'Refresh DB·Redis Pub/Sub' 반쪽/과한 설계를 받아 토큰 전부 Redis 통합 + SimpleBroker 단순화로 정리. 동시에 모바일이라는 새 환경 조건이 추가됨."
        period="2025.11 ~ 진행 중"
        team="3명"
      />

      <Section id="overview" title="Overview">
        <Prose>
          <p>
            세 번째 풀스택 프로젝트이자 학습 사이클의 종착점.{" "}
            <span className="font-medium text-foreground">
              HirePicker에서 미완으로 남긴 두 결정
            </span>
            을 받아 정리했습니다 — (1) Refresh Token DB 저장 → Redis 통합,
            (2) WebSocket Redis Pub/Sub → SimpleBroker 단순화. 동시에 모바일이라는
            새 환경 조건이 더해져, 같은 JWT라도 저장소 전략을 다시 짜야 한다는
            교훈을 직접 적용했습니다.
          </p>
        </Prose>
      </Section>

      <Section id="stack" title="Tech Stack">
        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
          ※ <span className="text-foreground">직접 다룬 영역</span>의 기술 세트.
    
        </p>
        <TechStackGrid groups={techStack} />
      </Section>

      <Section id="role" title="My Role">
        <MyRoleCards roles={roles} accent={ACCENT} />
      </Section>

      <Section id="evolution" title="Evolution — 이전 두 프로젝트의 결정이 어떻게 이어졌나">
        <div className="mt-2 space-y-3">
          <EvolutionRow
            from="HirePicker — Refresh=DB / Access=Redis (반쪽 변경)"
            to="Booming — 둘 다 Redis + TTL 자동 만료 (회수 로직 자체 제거)"
            note="'토큰은 영속 데이터가 아니라 세션' 결론을 코드로 옮김"
          />
          <EvolutionRow
            from="HirePicker — STOMP + Redis Pub/Sub (과한 설계 회고)"
            to="Booming — SimpleBroker + JWT ChannelInterceptor (환경에 맞춘 단순화)"
            note="단일 인스턴스 모바일 환경에는 외부 broker 불필요 — 메시지 영속은 DB로 보완"
          />
          <EvolutionRow
            from="HirePicker — Next.js + Spring REST (웹 분리)"
            to="Booming — Flutter + Spring REST (모바일 분리) + secure_storage"
            note="같은 분리 구조를 다른 플랫폼에 이식하면서 저장소 전략은 OS 보안 영역으로"
          />
          <EvolutionRow
            from="HirePicker — 채팅 메시지를 MySQL 관계형 테이블에"
            to="Booming — MongoDB 문서 기반 (사용자/모임 등 정형은 MySQL 그대로)"
            note="메시지의 schemaless 본질에 맞춰 저장소를 분리 — 폴리글랏 모델링"
          />
        </div>
      </Section>

      <Section id="code" title="Code Highlight">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            WebSocket의 ThreadLocal 한계를 세션 속성으로 우회한 JWT 인증
            인터셉터 — 이 프로젝트에서 가장 정교한 트러블슈팅.
          </p>
          <CodeBlock
            code={interceptorCode}
            lang="java"
            filename="JwtChannelInterceptor.java"
          />
        </div>
      </Section>

      <Section id="trouble" title="Trouble-shooting">
        <TroubleCards troubles={troubles} accent={ACCENT} />
      </Section>

      <Section id="lessons" title="Lessons Learned">
        <LessonsList
          items={[
            "이전 프로젝트의 '미완·과한 설계'를 다음 프로젝트의 결정 근거로 들고 가는 사이클이 가장 효율적인 학습 방식이다.",
            "Spring Security는 ThreadLocal 가정 위에 만들어졌다 — HTTP 패턴을 다른 통신 모델에 그대로 옮기지 않는다.",
            "인증은 토큰 알고리즘이 아니라 '저장소·전달 방식'의 문제 — 플랫폼 컨텍스트가 결정한다.",
            "데이터의 성격(관계형 vs 문서)에 따라 저장소를 분리하는 폴리글랏 모델링이 단일 DB로 억지로 표현하는 것보다 깔끔하다.",
          ]}
        />
      </Section>

      <ProjectFooter currentSlug={SLUG} />
    </article>
  );
}

// 전 → 후 비교 한 줄.
function EvolutionRow({ from, to, note }: { from: string; to: string; note: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4">
        <div className="rounded-md border border-border bg-background/40 px-3 py-2 text-sm text-foreground/85">
          {from}
        </div>
        <span className="hidden text-muted-foreground sm:block" aria-hidden>
          →
        </span>
        <div className="rounded-md border border-[var(--accent)]/40 bg-[var(--accent)]/5 px-3 py-2 text-sm text-foreground">
          {to}
        </div>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}
