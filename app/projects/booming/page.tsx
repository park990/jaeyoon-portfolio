import type { Metadata } from "next";
import { KeyRound, Radio, type LucideIcon } from "lucide-react";
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
    items: ["Spring Boot 3.5+ (Java 21)", "Spring Security", "JWT", "JPA"],
  },
  {
    category: "Realtime / Cache",
    items: ["WebSocket (STOMP) + SimpleBroker", "JwtChannelInterceptor", "Redis (토큰 전부)"],
  },
  {
    category: "DB",
    items: ["MySQL (사용자·모임·게시판)", "MongoDB (채팅 메시지)"],
  },
  {
    category: "Infra",
    items: ["Docker Compose (Spring Boot + Redis + MySQL + MongoDB)"],
  },
];

// Part 1 — "What I built": 단순 구현 작업 망라 (발전 narrative와 분리)
const builtItems = [
  "Flutter Riverpod 2.x 상태 관리 + MVVM 구조",
  "flutter_secure_storage로 OS 보안 영역에 토큰 저장",
  "회원가입 / 로그인 / 마이페이지 / 게시판 / 채팅 UI 디자인·구현",
  "하단 탭 네비게이션 + 전체 화면 구성",
  "Spring REST API (인증, 게시판 도메인 — 모임 도메인 제외)",
  "JPA Entity 매핑 (사용자 / 게시판)",
  "MongoDB 채팅 메시지 컬렉션 설계",
  "Docker Compose 환경 (Spring Boot + Redis + MySQL + MongoDB)",
];

// Part 2 — "What carried forward": 다음 프로젝트로 이어진 학습 사이클 (존댓말)
const roles: Role[] = [
  {
    title: "인증 — 토큰 전부 Redis로 통합 (HirePicker 반쪽 변경의 완성)",
    bullets: [
      "Access + Refresh 둘 다 Redis에 저장했고, TTL 자동 만료로 회수 로직 자체를 제거했습니다.",
      "HirePicker에서 얻은 ‘Refresh도 영속 데이터가 아니라 세션 성격’이라는 결론을 코드로 옮겼습니다.",
      "Flutter 측은 flutter_secure_storage(iOS Keychain / Android Keystore)로 OS 보안 영역에 저장해, 웹의 HttpOnly Cookie가 모바일에선 통하지 않는 환경 차이를 반영했습니다.",
    ],
  },
  {
    title: "WebSocket — SimpleBroker로 단순화 + JWT ChannelInterceptor",
    bullets: [
      "HirePicker의 Redis Pub/Sub ‘과한 설계’ 회고를 받아, 단일 인스턴스 모바일 환경에는 Spring 내장 SimpleBroker로 충분하다고 판단했습니다.",
      "WebSocket의 ThreadLocal 한계(CONNECT/SEND 스레드가 다름)를 JwtChannelInterceptor와 세션 속성에 userDetails를 저장하는 패턴으로 해결했습니다.",
      "메시지 유실 우려는 영속 저장으로 보완했고, 외부 네트워크 I/O 비용은 제거했습니다.",
    ],
  },
  {
    title: "메시지 저장소 — MySQL에서 MongoDB로 (데이터 성격에 맞춰)",
    bullets: [
      "HirePicker는 ChatMessage를 MySQL 관계형 테이블로 저장했지만, 컬럼 스키마가 채팅 메시지의 다양성(첨부·이모지·시스템 메시지·메타데이터)을 표현하기에 부족했습니다.",
      "Booming은 채팅 메시지가 본질적으로 ‘문서(document)’에 가깝다고 판단해 MongoDB로 전환했고, 스키마 자유도와 메시지 단위 쿼리·페이지네이션 효율을 얻었습니다.",
      "JPA 관계형 모델은 사용자·모임·게시판처럼 정형 도메인에 유지하고, 채팅 메시지만 MongoDB로 분리하는 폴리글랏 구조로 정리했습니다.",
    ],
  },
  {
    title: "Spring Boot 백엔드 + Flutter 기획/디자인/구현 단독",
    bullets: [
      "백엔드 전반(인증·게시판·세션·DB)을 모임 도메인 제외하고 단독으로 담당했고, HirePicker의 분리 구조(REST + 분리된 클라이언트)를 모바일 컨텍스트로 그대로 이식했습니다.",
      "Flutter Riverpod 2.x 상태관리·MVVM 구조·하단 탭 네비·전체 화면 디자인을 단독으로 진행했습니다.",
      "AI 코칭 모듈은 현재 개발 중이며 본 페이지의 구현 영역에는 포함되지 않습니다. 기획 단계의 핵심 아이디어(AI가 대화의 정적 시간을 메우고 다음 발화를 제안)는 직접 정의해뒀습니다.",
    ],
  },
];

const troubles: Trouble[] = [
  {
    title: "WebSocket에서 @AuthenticationPrincipal이 null",
    star: true,
    problem:
      "HTTP의 JwtAuthenticationFilter는 SecurityContextHolder에 박아두면 @AuthenticationPrincipal로 잘 받았습니다. 그러나 WebSocket은 CONNECT 스레드와 SEND 스레드가 달라서 ThreadLocal 기반의 SecurityContextHolder가 다음 메시지에서 null로 보였습니다.",
    solve:
      "JwtChannelInterceptor에서 CONNECT 시 검증한 CustomUserDetails를 accessor.getSessionAttributes()에 저장하고, SEND/SUBSCRIBE에서 같은 세션 속성에서 복원하는 패턴으로 해결했습니다. 컨트롤러는 @Header(\"simpSessionAttributes\")로 직접 접근하도록 했습니다.",
    lesson:
      "처음엔 HTTP에서 @AuthenticationPrincipal이 너무 자연스럽게 동작하니까 WebSocket에서도 당연히 될 거라 생각하고 그대로 갖다 붙였는데, 메시지 두세 개 주고받자마자 null로 떨어졌습니다. 한참 디버깅한 끝에야 CONNECT 스레드와 SEND 스레드가 다르다는 점, 그리고 SecurityContextHolder가 그 스레드를 따라간다는 사실이 손에 잡혔습니다. 같은 Spring이라도 통신 모델이 바뀌면 인증 컨텍스트가 어디에 실리는지부터 다시 봐야 한다는 걸, 이 디버깅으로 처음 체감했습니다.",
  },
  {
    title: "웹의 HttpOnly Cookie 패턴이 모바일에서 작동 X",
    problem:
      "HirePicker(웹)는 브라우저가 자동으로 쿠키를 실어 보내는 가정에 의존했습니다. Flutter는 OS 단위 HTTP 클라이언트라 쿠키 자동 관리가 되지 않았습니다.",
    solve:
      "flutter_secure_storage로 Access/Refresh Token을 OS 보안 영역에 저장하고, 모든 API 요청에 Bearer 헤더를 명시했습니다. 같은 JWT라도 플랫폼에 따라 저장 전략이 완전히 달라진다는 점을 반영했습니다.",
    lesson:
      "웹에서 HttpOnly Cookie로 깔끔하게 돌던 흐름을 Flutter에 옮겼더니, 같은 JWT인데도 쿠키가 자동으로 실리지 않아 첫 요청부터 401을 받았습니다. 그제서야 토큰 자체보다 ‘어디 저장하고 어떻게 헤더에 싣느냐’가 인증의 진짜 어려움이라는 걸 알게 됐고, secure_storage + Bearer 헤더 명시로 다시 설계하면서 플랫폼이 바뀌면 인증 저장소 전략도 같이 바뀌어야 한다는 감각이 생겼습니다.",
  },
  {
    title: "모바일 게시판 — 다른 사용자의 좋아요 +1이 즉시 보이지 않음",
    problem:
      "게시판 좋아요는 HighWay Guide·HirePicker에서 두 번 다뤄본 다대다 매핑이라 DB 설계 자체는 어렵지 않았습니다. 다만 Booming은 모바일이라 한 번 그려진 화면이 상태를 오래 들고 있는 환경이라, 내가 좋아요를 누른 변화가 다른 사용자에게는 그 사용자가 직접 새로고침할 때까지 +1로 보이지 않았습니다. 웹에선 페이지 이동·새 요청 흐름에 묻혀 보이지 않던 동기화 문제가, 모바일 컨텍스트에서 새 난이도로 드러났습니다.",
    solve:
      "Riverpod로 게시글 상태를 좋아요 액션 직후 낙관적으로 갱신하고, 게시판 진입·pull-to-refresh·화면 재포커스 시점에 서버 카운트로 재조회하는 패턴으로 정리했습니다. 같은 다대다 모델이지만 ‘언제 다시 가져올지’를 클라이언트가 명시적으로 결정해야 한다는 점을 반영했습니다.",
    lesson:
      "내 좋아요는 잘 반영되는데 다른 사람 좋아요가 한참 뒤에 보이는 걸 사용자 입장에서 겪고 나서야, 모델은 익숙해진 다대다인데 모바일에선 ‘언제 다시 가져올지’를 내가 결정해줘야 한다는 점이 새로 들어왔습니다. DB 설계가 같다고 클라이언트 상태 관리도 같지 않다는 걸, 갱신 시점이라는 한 층을 직접 끼우면서 처음 깨달았습니다.",
  },
];

// TL;DR — 보조 카드라 2개로 최소. HirePicker 학습의 종착점이라는 narrative만.
type Highlight = {
  icon: LucideIcon;
  label: string;
  value: string;
  note: string;
  accent?: boolean;
};

const HIGHLIGHTS: Highlight[] = [
  {
    icon: KeyRound,
    label: "토큰 통합",
    value: "Access + Refresh → Redis",
    note: "HirePicker '반쪽 변경'을 받아 TTL 자동 만료로 회수 로직 자체 제거",
    accent: true,
  },
  {
    icon: Radio,
    label: "WebSocket 단순화",
    value: "SimpleBroker + JwtChannelInterceptor",
    note: "HirePicker Redis Pub/Sub '과한 설계' 회고 → 단일 인스턴스 환경에 맞춤",
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
        oneLiner="풀스택 학습 사이클의 종착점 — HirePicker의 ‘Refresh DB·Redis Pub/Sub’ 반쪽/과한 설계를 받아 토큰 전부 Redis 통합 + SimpleBroker 단순화로 정리. 동시에 모바일이라는 새 환경 조건이 추가됨."
        period="2025.11 ~ 진행 중"
        team="2명"
      />

      {/* TL;DR — 보조 카드라 2개만. 큰 그림은 'What carried forward' 섹션이 담음. */}
      <section
        aria-label="Highlights"
        className="-mt-2 mb-12 grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {HIGHLIGHTS.map((h) => {
          const Icon = h.icon;
          return (
            <div
              key={h.label}
              className={
                "rounded-xl border p-4 sm:p-5 " +
                (h.accent
                  ? "border-[var(--accent)]/50 bg-[var(--accent)]/5"
                  : "border-border bg-card")
              }
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={
                    "h-4 w-4 " +
                    (h.accent ? "text-[var(--accent)]" : "text-muted-foreground")
                  }
                  aria-hidden="true"
                />
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {h.label}
                </p>
              </div>
              <p
                className={
                  "mt-2 text-base font-semibold tracking-tight sm:text-lg " +
                  (h.accent ? "text-[var(--accent)]" : "text-foreground")
                }
              >
                {h.value}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {h.note}
              </p>
            </div>
          );
        })}
      </section>

      <Section id="overview" title="Overview">
        <Prose>
          <p>
            세 번째 풀스택 프로젝트이자 학습 사이클의 종착점입니다.{" "}
            <span className="font-medium text-foreground">
              HirePicker에서 미완으로 남긴 두 결정
            </span>
            을 받아 정리했습니다 — (1) Refresh Token DB 저장 → Redis 통합, (2)
            WebSocket Redis Pub/Sub → SimpleBroker 단순화. 동시에 모바일이라는
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
        {/* Part 1 — What I built (보조 정보, 톤다운) */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold tracking-tight text-foreground/70">
            What I built
          </h3>
          <p className="mt-1 text-xs text-muted-foreground/80">
            이 프로젝트에서 직접 구현한 영역
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 text-[13px] leading-[1.6] text-foreground/65 sm:grid-cols-2">
            {builtItems.map((b) => (
              <li key={b} className="relative pl-4">
                <span
                  className="absolute left-0 top-[0.7em] h-1 w-1 rounded-full bg-muted-foreground/60"
                  aria-hidden="true"
                />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* 두 섹션 시각 구분 */}
        <div className="my-12 border-t border-border/40 sm:my-16" />

        {/* Part 2 — What carried forward (핵심 정보, 강조) */}
        <div>
          <div className="border-l-[3px] border-[var(--accent)] pl-4 sm:pl-5">
            <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              What carried forward
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              다음 프로젝트의 결정 근거가 된 학습 사이클
            </p>
          </div>
          <div className="mt-6">
            <MyRoleCards roles={roles} accent={ACCENT} />
          </div>
        </div>
      </Section>

      <Section id="code" title="Code Highlight">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            WebSocket의 ThreadLocal 한계를 세션 속성으로 우회한 JWT 인증
            인터셉터 — 이 프로젝트에서 가장 정교한 트러블슈팅이었습니다.
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
            "HighWay의 단순함과 HirePicker의 과한 설계가 각자 다음 프로젝트에서 결정 근거로 살아 움직이는 걸 직접 겪고 나니, 이렇게 사이클을 만들어 가는 게 책 한 권보다 빠르다는 느낌이 듭니다.",
            "HTTP에서 @AuthenticationPrincipal이 자연스럽게 동작하던 패턴을 WebSocket에 그대로 옮겼다 null 디버깅을 한참 하고 나서야 같은 Spring이라도 통신 모델이 바뀌면 인증 컨텍스트가 어디 실리는지부터 다시 봐야 한다는 걸 알았습니다.",
            "웹에서 HttpOnly Cookie로 깔끔하게 풀리던 흐름이 Flutter에선 첫 요청부터 401로 막힙니다. 토큰 자체보다 어디에 저장하고 어떻게 헤더에 싣느냐가 인증의 진짜 어려움이었습니다.",
            "채팅 메시지를 MySQL 컬럼에 욱여넣다 보면 첨부·이모지·시스템 메시지가 들어올 때마다 어색해집니다. 같은 도메인 안에서도 데이터 성격에 따라 저장소를 갈라두는 편이 결국 더 깔끔하다는 결론에 닿았습니다.",
          ]}
        />
      </Section>

      <ProjectFooter currentSlug={SLUG} />
    </article>
  );
}
