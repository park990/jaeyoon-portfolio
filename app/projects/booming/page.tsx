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
import {
  PhotoTodoBanner,
  PhotoPlaceholder,
} from "@/components/project-detail/photo";
import { getProjectBySlug } from "@/lib/projects";

const SLUG = "booming";
const ACCENT = "#10B981";

export const metadata: Metadata = {
  title: "Booming · Jaeyoon Park",
  description:
    "AI 대화 코칭 모바일 앱 — Spring Boot 백엔드 전반 + Flutter 인증/메뉴/디자인 단독 담당",
};

// 사용자 담당 영역 위주의 stack. 모임(gathering)은 제외.
const techStack = [
  {
    category: "Backend (단독)",
    items: ["Spring Boot 3.5+", "Java 21 (Records, Switch Expr)", "JPA", "MySQL"],
  },
  {
    category: "Auth",
    items: ["JWT (Access/Refresh 이중 토큰)", "Spring Security", "OAuth 2.0 (Kakao)"],
  },
  {
    category: "Realtime",
    items: [
      "WebSocket (STOMP + SockJS)",
      "SimpleBroker (/topic, /queue)",
      "JwtChannelInterceptor",
      "Redis 매칭 큐",
    ],
  },
  {
    category: "Frontend (담당 부분)",
    items: [
      "Flutter",
      "Riverpod 2.x",
      "MVVM",
      "flutter_secure_storage",
    ],
  },
  {
    category: "Infra",
    items: ["AWS S3 (이미지 업로드)", "Redis (캐시 + Pub/Sub)"],
  },
];

const roles: Role[] = [
  {
    title: "기획 / UI·UX 디자인 (전체)",
    bullets: [
      "AI가 대화의 정적 시간을 메우고 다음 발화를 제안한다는 핵심 아이디어 기획",
      "Flutter 화면 단위 디자인 (홈/게시판/친구/마이페이지/채팅/하단탭)",
      "메뉴 구조 설계 — bom_screen(게시판) · friend_screen · home_screen · myPage_screen · random_chat_screen + bottom_nav_bar",
    ],
  },
  {
    title: "Spring Boot 백엔드 — 단독 구현",
    bullets: [
      "JwtTokenProvider: HS256 + BASE64 시크릿, Access/Refresh 이중 토큰, DB 미경유 임시 CustomUserDetails 생성으로 검증 성능 확보",
      "SecurityConfig: STATELESS + CSRF off + JwtAuthenticationFilter를 UsernamePasswordAuthenticationFilter 앞에 등록, /api/signUp/**·/ws/** 등 permitAll 분기",
      "WebSocketConfig: /ws + SockJS, /topic·/queue 브로커, /app 클라이언트 prefix, configureClientInboundChannel에 JwtChannelInterceptor 등록",
      "Bbs_controller: /api/post/getList(Slice 페이지네이션, hasNext), submit(multipart content+List<MultipartFile> images, S3 업로드), delete, likeToggle",
      "Clean Architecture 계층 분리 — Controller → Service → Repository, 도메인별 패키지(bbs_*/randomChat_*/myPage_*)로 격리",
    ],
  },
  {
    title: "WebSocket JWT 인증 (JwtChannelInterceptor)",
    bullets: [
      "CONNECT 단계: Authorization Bearer 헤더에서 토큰 추출 → 검증 → CustomUserDetails 생성 → 세션 속성에 저장",
      "SEND/SUBSCRIBE 단계: 세션 속성에서 userDetails 복원 → 현재 스레드 SecurityContextHolder에 보조 설정",
      "컨트롤러는 @Header(\"simpSessionAttributes\")로 직접 접근 — ThreadLocal 한계를 우회하는 표준 패턴 확립",
      "검증 실패 시 preSend가 null 반환으로 메시지 차단 → 인증 안 된 SEND는 도달 불가",
    ],
  },
  {
    title: "랜덤 매칭 시스템 (Redis 매칭 큐 + WebSocket)",
    bullets: [
      "MatchQueueManager: Redis StringRedisTemplate 기반 성별 분리 큐(match:queue:MALE, match:queue:FEMALE)",
      "synchronized tryMatch: 동시 진입 시 동일 유저 더블 매칭 방지",
      "양방향 검증 — 내 desired = 상대 actual && 상대 desired = 내 actual 일 때만 매칭, random은 MALE→FEMALE 순서로 탐색",
      "MatchWebSocketController: /app/match/enter, /app/match/cancel 핸들러, 성공 시 /queue/match/{userIdx}와 /queue/match/{partnerIdx} 양쪽에 MatchData 전송",
      "예외 발생 시 MatchData.error()로 클라이언트 무한 대기 방지",
    ],
  },
  {
    title: "Flutter 인증 / 토큰 저장 / OAuth",
    bullets: [
      "WazzupTokenStorage: flutter_secure_storage 싱글톤, AndroidOptions(encryptedSharedPreferences=true)로 안드로이드 암호화 SharedPreferences 사용",
      "Access/Refresh Token 별도 키 관리, saveTokensOnly(재발급용)·deleteAll(로그아웃) 분리",
      "OAuth 소셜 로그인 4종(Apple/Google/Kakao/Naver) data source 구조 + AuthController(Riverpod)로 통합",
      "닉네임 중복 체크 POST /api/signUp/check_nickName + 회원가입 /submit SocialUserDTO 흐름",
    ],
  },
];

const troubles: Trouble[] = [
  {
    title: "WebSocket에서 @AuthenticationPrincipal이 null",
    star: true,
    problem:
      "HTTP의 JwtAuthenticationFilter는 SecurityContextHolder에 인증을 박아두면 컨트롤러에서 @AuthenticationPrincipal로 잘 받았지만, WebSocket은 CONNECT 스레드(nio-8080-exec-9)와 SEND 스레드(nboundChannel-7)가 달라서 ThreadLocal 기반 SecurityContextHolder가 다음 메시지에서 null로 보임. 같은 패턴으로 옮기자마자 NullPointerException 폭발.",
    solve:
      "JwtChannelInterceptor에서 CONNECT 시 검증한 CustomUserDetails를 accessor.getSessionAttributes()에 저장 → SEND/SUBSCRIBE에서 같은 세션 속성에서 복원. 컨트롤러는 @Header(\"simpSessionAttributes\")로 직접 접근하는 패턴 확립. SecurityContextHolder도 현재 스레드용으로 보조 설정해 다른 Spring Security 기능과 일관성 유지.",
    lesson:
      "Spring Security가 ThreadLocal 가정으로 만들어졌다는 사실을 깨달은 사례. 프레임워크의 'HTTP에서 잘 되던' 패턴을 다른 통신 모델에 그대로 옮기면 안 된다.",
  },
  {
    title: "동시 진입으로 같은 유저가 두 명에게 매칭됨",
    star: true,
    problem:
      "두 사용자가 거의 동시에 /app/match/enter를 보내면 두 스레드가 같은 대기열에서 peek해 같은 유저를 매칭 상대로 가져가는 race condition 발생. 한 명은 정상 매칭, 다른 한 명은 이미 자리를 비운 유저와 매칭되어 빈 방으로 들어가는 현상.",
    solve:
      "MatchQueueManager.tryMatch를 synchronized로 단일 스레드 직렬화. 이후 desired/actual 성별의 양방향 검증으로 잘못된 매칭 차단. random 선호자는 MALE→FEMALE 순으로 우선 탐색해 큐 편차 보정.",
    lesson:
      "분산 환경에서 정답은 분산 락이지만, 단일 인스턴스 환경에서는 synchronized + Redis 큐의 단일 진실원천 조합이 가장 단순한 충분조건",
  },
  {
    title: "웹의 HttpOnly Cookie 패턴이 모바일에서 작동 X",
    problem:
      "HirePicker(웹)에서 사용한 HttpOnly Cookie 기반 토큰 저장은 브라우저가 자동으로 쿠키를 실어 보내는 가정에 의존. Flutter는 OS 단위의 HTTP 클라이언트이고 쿠키 자동 관리가 안 됨 → 같은 인증 로직을 그대로 이식하면 모든 요청이 401.",
    solve:
      "flutter_secure_storage로 Access/Refresh Token을 iOS Keychain / Android Keystore(encryptedSharedPreferences=true)에 저장. WazzupTokenStorage 싱글톤으로 앱 전역 접근 + Riverpod Provider로 상태 노출. 모든 API 요청에 Bearer 헤더 명시.",
    lesson:
      "같은 JWT라도 플랫폼 컨텍스트(브라우저 자동 관리 vs OS 보안 저장소)에 따라 저장 전략을 완전히 갈아야 한다",
  },
];

const interceptorCode = `// WebSocket의 ThreadLocal 한계를 세션 속성으로 우회
@Component
@RequiredArgsConstructor
public class JwtChannelInterceptor implements ChannelInterceptor {
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        StompCommand command = accessor.getCommand();

        if (StompCommand.CONNECT.equals(command)) {
            // 1) Authorization: Bearer xxx 검증
            String bearer = accessor.getFirstNativeHeader("Authorization");
            if (bearer == null || !bearer.startsWith("Bearer ")) return null;
            String token = bearer.substring(7);
            if (!jwtTokenProvider.validateToken(token)) return null;

            // 2) 검증한 userDetails를 세션 속성에 저장 (스레드 무관!)
            Authentication auth = jwtTokenProvider.getAuthentication(token);
            CustomUserDetails ud = (CustomUserDetails) auth.getPrincipal();
            accessor.getSessionAttributes().put("userDetails", ud);

            // 3) 현재 스레드용 보조 설정
            accessor.setUser(ud);
            SecurityContextHolder.getContext().setAuthentication(auth);
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

// 컨트롤러는 @Header로 직접 접근
@MessageMapping("/match/enter")
public void enterQueue(
    @Header("simpSessionAttributes") Map<String, Object> sessionAttributes,
    @Payload Map<String, String> request
) {
    CustomUserDetails user = (CustomUserDetails) sessionAttributes.get("userDetails");
    // ... matchService.enterQueue(user.getUserIdx(), request.get("genderOption"));
}
`;

const matchCode = `@Component
@RequiredArgsConstructor
public class MatchQueueManager {
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private static final String QUEUE_KEY_PREFIX = "match:queue:";

    // 동시 진입으로 인한 더블 매칭 방지 — 단일 스레드 직렬화
    public synchronized Optional<Long> tryMatch(WaitingUser me) {
        String desired = me.getCriteria().getDesiredGender();
        WaitingUser matched = null;

        if ("random".equals(desired)) {
            matched = findMatchInQueue(me, Users.Gender.MALE);
            if (matched == null) matched = findMatchInQueue(me, Users.Gender.FEMALE);
        } else {
            Users.Gender target = "female".equals(desired)
                ? Users.Gender.FEMALE : Users.Gender.MALE;
            matched = findMatchInQueue(me, target);
        }

        // 양방향 검증: 내 desired==상대 actual && 상대 desired==내 actual
        // (findMatchInQueue 내부)
        return matched != null ? Optional.of(matched.getUserIdx()) : Optional.empty();
    }
}
`;

const storageCode = `class WazzupTokenStorage {
  // 싱글톤 — 앱 전역에서 동일 인스턴스
  static final WazzupTokenStorage _instance = WazzupTokenStorage._internal();
  factory WazzupTokenStorage() => _instance;
  WazzupTokenStorage._internal();

  final _storage = const FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true, // 안드로이드 암호화 저장소
    ),
  );

  static const _accessTokenKey = 'WAZZUP_ACCESS_TOKEN';
  static const _refreshTokenKey = 'WAZZUP_REFRESH_TOKEN';

  // 토큰 재발급용 — 유저 정보는 놔두고 토큰만 갱신
  Future<void> saveTokensOnly({
    required String accessToken,
    required String refreshToken,
  }) async {
    await _storage.write(key: _accessTokenKey, value: accessToken);
    await _storage.write(key: _refreshTokenKey, value: refreshToken);
  }

  Future<String?> getAccessToken() => _storage.read(key: _accessTokenKey);
  Future<void> deleteAll() => _storage.deleteAll();          // 로그아웃
}
`;

export default function BoomingPage() {
  const project = getProjectBySlug(SLUG)!;

  return (
    <article
      className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:pt-16"
      style={{ "--accent": ACCENT } as React.CSSProperties}
    >
      <PhotoTodoBanner count={3} />

      <ProjectHeader
        project={project}
        oneLiner="AI가 대화의 정적 시간을 메우고 다음 발화를 제안하는 모바일 앱. Spring Boot 백엔드 전반과 Flutter 인증/메뉴/디자인을 단독 담당."
        period="2025.11 ~ 진행 중"
        team="3명"
      />

      <PhotoPlaceholder
        n={1}
        aspect="portrait"
        caption="앱 메인(홈) 화면 스크린샷 1장. 헤더 직후에 두면 '이 프로젝트의 첫 인상'이 됨. AI 대화 보조 컨셉이 시각적으로 드러나는 화면(추천 발화 카드 등이 보이는 컷)이 좋음."
      />

      <Section id="overview" title="Overview">
        <Prose>
          <p>
            현대인의 대화 단절과 어색한 정적을 해소하기 위해, AI가 사용자의 대화를
            실시간으로 보조해주는 모바일 앱을 기획·설계·구현했습니다. UI/UX부터
            Spring Boot 백엔드 전반, Flutter 단의 인증·메뉴·상태관리까지 가로축의
            대부분을 단독 담당했습니다.
          </p>
          <p>
            HirePicker(웹)에서 학습한 JWT + Redis 인증을 모바일 컨텍스트에 맞게
            재설계 — HttpOnly Cookie가 통하지 않는 환경이라 flutter_secure_storage로
            전환했고, WebSocket은 SimpleBroker + JwtChannelInterceptor + Redis 매칭
            큐 조합으로 새로 구성했습니다.
          </p>
        </Prose>
      </Section>

      <Section id="stack" title="Tech Stack">
        <TechStackGrid groups={techStack} />
      </Section>

      <Section id="role" title="My Role">
        <MyRoleCards roles={roles} accent={ACCENT} />
        <div className="mt-5 space-y-5">
          <PhotoPlaceholder
            n={2}
            caption="직접 디자인한 5개 화면 콜라주 (bom_screen 게시판 · friend_screen · home_screen · myPage_screen · random_chat_screen)를 한 장에. '디자인을 본인이 함'을 가장 잘 증명하는 그림."
          />
          <PhotoPlaceholder
            n={3}
            caption="랜덤 매칭 흐름 3컷 — (1) 대기열 진입 화면 (2) 매칭 성공 알림 (3) 채팅방 입장. WebSocket + Redis 매칭 큐의 동작을 한눈에 보여주는 시퀀스."
          />
        </div>
      </Section>

      <Section id="code" title="Code Highlights">
        <div className="space-y-5">
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              WebSocket의 ThreadLocal 한계를 세션 속성으로 우회하는 인증 인터셉터.
              CONNECT에서 저장 → SEND/SUBSCRIBE에서 복원, 컨트롤러는 @Header로
              직접 접근.
            </p>
            <CodeBlock
              code={interceptorCode}
              lang="java"
              filename="JwtChannelInterceptor.java"
            />
          </div>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              Redis 기반 성별 분리 매칭 큐. synchronized로 race condition 차단 +
              desired/actual 양방향 검증.
            </p>
            <CodeBlock
              code={matchCode}
              lang="java"
              filename="MatchQueueManager.java"
            />
          </div>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              flutter_secure_storage 싱글톤. Access/Refresh를 OS 보안 영역에 저장
              + 재발급·로그아웃을 별도 메서드로 분리.
            </p>
            <CodeBlock
              code={storageCode}
              lang="dart"
              filename="wazzup_token_storage.dart"
            />
          </div>
        </div>
      </Section>

      <Section id="trouble" title="Trouble-shooting">
        <TroubleCards troubles={troubles} accent={ACCENT} />
      </Section>

      <Section id="lessons" title="Lessons Learned">
        <LessonsList
          items={[
            "Spring Security는 ThreadLocal 가정 위에 만들어진 라이브러리 — WebSocket처럼 다른 통신 모델에선 세션 속성 같은 다른 저장소가 필요하다.",
            "race condition은 'synchronized 한 줄'로 해결되는 경우가 더 많다. 분산 락은 진짜 다중 인스턴스 환경에서만 도입.",
            "같은 JWT라도 플랫폼(브라우저 vs OS)에 따라 저장 전략이 완전히 달라진다. 인증은 토큰 알고리즘이 아니라 '토큰을 어디 두고 어떻게 실어 보내느냐'의 문제.",
            "기획·디자인·서버·앱 단까지 단독 담당해보니, 한 사람의 머릿속에서 도메인이 일관되게 흐를 때 의사결정 속도가 비교 불가하게 빨라진다.",
          ]}
        />
      </Section>

      <ProjectFooter currentSlug={SLUG} />
    </article>
  );
}
